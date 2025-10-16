# -*- coding: utf-8 -*-
import asyncio
import json
import logging
import time
import uuid
from aiohttp import web, ClientSession, TCPConnector

# ===== 固定配置（不改动）=====
VOLC_ENDPOINT = "wss://openspeech.bytedance.com/api/v3/tts/bidirection"
APPID = "3810425215"
ACCESS_TOKEN = "mHT8sdy_o3wVHNSIw9jfJqCawEu0Aq5s"
RESOURCE_ID = "volc.service_type.10029"
LOCAL_PORT = 8787
# ===========================

logging.basicConfig(
    level=logging.DEBUG,
    format="%(asctime)s.%(msecs)03d | %(levelname)-7s | %(message)s",
    datefmt="%H:%M:%S",
)
log = logging.getLogger("tts-bridge")

# —— 协议常量（保持与上游一致，省略注释）——
class MsgType:
    FullClientRequest = 0b1
    FullServerResponse = 0b1001
    AudioOnlyServer = 0b1011

class MsgFlag:
    WithEvent = 0b100

class EventType:
    StartConnection = 1
    FinishConnection = 2
    ConnectionStarted = 50
    ConnectionFinished = 52
    StartSession = 100
    FinishSession = 102
    SessionStarted = 150
    SessionFinished = 152
    TaskRequest = 200
    TTSResponse = 352

def _u32(n: int) -> bytes:
    return n.to_bytes(4, "big", signed=False)

def _i32(n: int) -> bytes:
    return n.to_bytes(4, "big", signed=True)

def _marshal(msg_type: int, flag: int, payload: bytes, event: int | None = None, session_id: str | None = None) -> bytes:
    b0 = (1 << 4) | 1         # version=1, headerSize=4
    b1 = ((msg_type & 0xF) << 4) | (flag & 0xF)
    b2 = (1 << 4) | 0         # serialization=JSON, compression=None
    parts = [bytes([b0, b1, b2, 0])]
    if flag == MsgFlag.WithEvent:
        if event is None:
            raise ValueError("event required")
        parts.append(_i32(event))
        if event not in (EventType.StartConnection, EventType.FinishConnection,
                         EventType.ConnectionStarted, EventType.ConnectionFinished):
            sid = (session_id or "").encode("utf-8")
            parts.append(_u32(len(sid)))
            if sid:
                parts.append(sid)
    parts.append(_u32(len(payload)))
    if payload:
        parts.append(payload)
    data = b"".join(parts)
    return data

async def _wait_event(ws_up, want_type: int, want_event: int, timeout: float = 15.0):
    _start = time.time()
    while True:
        if time.time() - _start > timeout:
            raise asyncio.TimeoutError(f"wait {want_type=}, {want_event=} timeout")
        msg = await ws_up.receive()
        if msg.type == web.WSMsgType.BINARY:
            data: bytes = msg.data
            # 解析最小字段：type/flag/event/payloadLen
            if len(data) < 8:
                continue
            header_size = data[0] & 0xF
            _type = (data[1] >> 4) & 0xF
            _flag = data[1] & 0xF
            off = 4 * header_size
            _event = None
            if _flag == MsgFlag.WithEvent:
                if len(data) < off + 4:
                    continue
                _event = int.from_bytes(data[off:off+4], "big", signed=True)
            if _type == want_type and _event == want_event:
                return
        elif msg.type in (web.WSMsgType.CLOSE, web.WSMsgType.ERROR):
            raise RuntimeError("upstream closed")

async def _connect_upstream(session: ClientSession):
    headers = {
        "X-Api-App-Key": APPID,
        "X-Api-Access-Key": ACCESS_TOKEN,
        "X-Api-Resource-Id": RESOURCE_ID,
        "X-Api-Connect-Id": str(uuid.uuid4()),
    }
    _masked = {**headers, "X-Api-Access-Key": ACCESS_TOKEN[:6] + "***" + ACCESS_TOKEN[-4:]}
    log.info("Upstream headers: %s", _masked)
    ws_up = await session.ws_connect(VOLC_ENDPOINT, headers=headers)
    log.info("Upstream connected")
    return ws_up

async def _tts_stream(ws_down, text: str, speaker: str, emotion:str,emotionScale:int, fmt: str, sr: int):
    # 连接上游
    async with ClientSession(trust_env=False, connector=TCPConnector(ssl=None)) as session:
        ws_up = await _connect_upstream(session)

        # StartConnection
        await ws_up.send_bytes(_marshal(MsgType.FullClientRequest, MsgFlag.WithEvent, b"{}", EventType.StartConnection))
        await _wait_event(ws_up, MsgType.FullServerResponse, EventType.ConnectionStarted)

        # StartSession
        session_id = str(uuid.uuid4())
        req_template = {
            "user": {"uid": str(uuid.uuid4())},
            "req_params": {
                "speaker": speaker,
                "audio_params": {
                    "format": fmt, 
                    "sample_rate": sr, 
                    "enable_timestamp": True,
                    "emotion": emotion,
                    "emotion_scale": emotionScale
                    },
                "additions": json.dumps({"disable_markdown_filter": False}, ensure_ascii=False),
            },
            "event": EventType.StartSession,
        }
        print('req_template',req_template)
        await ws_up.send_bytes(_marshal(
            MsgType.FullClientRequest, MsgFlag.WithEvent,
            json.dumps(req_template, ensure_ascii=False).encode("utf-8"),
            EventType.StartSession, session_id
        ))
        await _wait_event(ws_up, MsgType.FullServerResponse, EventType.SessionStarted)

        # 整句发送
        payload = {
            "user": req_template["user"],
            "req_params": {**req_template["req_params"], "text": text},
            "event": EventType.TaskRequest,
        }
        await ws_up.send_bytes(_marshal(
            MsgType.FullClientRequest, MsgFlag.WithEvent,
            json.dumps(payload, ensure_ascii=False).encode("utf-8"),
            EventType.TaskRequest, session_id
        ))

        # FinishSession
        await ws_up.send_bytes(_marshal(
            MsgType.FullClientRequest, MsgFlag.WithEvent, b"{}", EventType.FinishSession, session_id
        ))

        # —— 关键：聚合 + 节流下发 —— #
        AGG_BYTES = 48 * 1024   # 满 48KB 就发
        AGG_MS    = 40          # 或 40ms 超时必发
        _buf = bytearray()
        _last_flush = time.time()
        _chunks = 0
        _bytes = 0

        async def _flush(force=False):
            nonlocal _buf, _last_flush
            if not _buf:
                return
            now = time.time()
            if (len(_buf) >= AGG_BYTES) or force or ((now - _last_flush) * 1000 >= AGG_MS):
                await ws_down.send_bytes(bytes(_buf))
                _buf.clear()
                _last_flush = now

        while True:
            msg = await ws_up.receive()
            if msg.type == web.WSMsgType.BINARY:
                data: bytes = msg.data
                if len(data) < 8:
                    continue
                header_size = data[0] & 0xF
                _type = (data[1] >> 4) & 0xF
                _flag = data[1] & 0xF
                _off = 4 * header_size
                _event = None
                if _flag == MsgFlag.WithEvent:
                    _event = int.from_bytes(data[_off:_off+4], "big", signed=True)
                    # 跳过会话ID长度与内容
                    if _event not in (EventType.StartConnection, EventType.FinishConnection,
                                      EventType.ConnectionStarted, EventType.ConnectionFinished):
                        _sid_len = int.from_bytes(data[_off+4:_off+8], "big", signed=False)
                        _off += 8 + _sid_len
                    else:
                        _off += 4
                _payload_size = int.from_bytes(data[_off:_off+4], "big", signed=False)
                _off += 4
                _payload = data[_off:_off+_payload_size] if _payload_size > 0 else b""

                if _type == 0b1011:  # AudioOnlyServer
                    _chunks += 1
                    _bytes += len(_payload)
                    _buf.extend(_payload)
                    # 满足条件就冲刷
                    await _flush()
                if _event == EventType.SessionFinished:
                    # 最后一口吐干净
                    await _flush(force=True)
                    break
            elif msg.type in (web.WSMsgType.CLOSE, web.WSMsgType.ERROR):
                break

        # FinishConnection
        await ws_up.send_bytes(_marshal(MsgType.FullClientRequest, MsgFlag.WithEvent, b"{}", EventType.FinishConnection))
        await _wait_event(ws_up, MsgType.FullServerResponse, EventType.ConnectionFinished)

async def tts_handler(request: web.Request):
    ws_down = web.WebSocketResponse()
    await ws_down.prepare(request)
    log.info("Browser connected: %s", request.remote)

    # 通知前端发送参数
    try:
        await ws_down.send_str("READY_SEND_PARAMS")
    except Exception:
        pass

    # 等待参数（5s），超时用默认
    _params = None
    try:
        _msg = await asyncio.wait_for(ws_down.receive(), timeout=5.0)
        if _msg.type == web.WSMsgType.TEXT:
            try:
                _params = json.loads(_msg.data)
            except Exception as _e:
                log.warning("JSON parse error: %s", _e)
    except asyncio.TimeoutError:
        log.warning("No params in 5s, using defaults.")

    text = (_params or {}).get("text") or "你好，欢迎使用火山引擎语音合成服务"
    speaker = (_params or {}).get("speaker") or "zh_male_yangguangqingnian_moon_bigtts"
    ap = (_params or {}).get("audio_params") or {}
    emotion = ap.get("emotion") or ""
    emotionScale = ap.get("emotion_scale") or 0.5
    fmt = "wav" if ap.get("format") == "wav" else "mp3"
    sr = int(ap.get("sample_rate") or 24000)
    log.info("TTS params: len=%d speaker=%s fmt=%s sr=%d", len(text), speaker, fmt, sr)

    try:
        await _tts_stream(ws_down, text, speaker,emotion,emotionScale, fmt, sr)
    except Exception as _e:
        log.exception("TTS stream error: %s", _e)
    finally:
        try:
            await ws_down.close()
        except Exception:
            pass
    return ws_down

def main():
    app = web.Application()
    app.router.add_get("/tts", tts_handler)
    log.info("✅ TTS Bridge listening: ws://0.0.0.0:%d/tts", LOCAL_PORT)
    web.run_app(app, host="0.0.0.0", port=LOCAL_PORT)

if __name__ == "__main__":
    main()
