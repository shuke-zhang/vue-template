import asyncio
import websockets

# 连接成功后给客户端发消息
async def handler(websocket, path):
    print("有人连接上来了:", websocket.remote_address)

    # 这里你可以换成你自己的消息内容
    msg = "你已成功连接服务器，欢迎！"  

    # 主动发送
    await websocket.send(msg)

    try:
        async for message in websocket:
            print("收到客户端消息:", message)
    except websockets.ConnectionClosed:
        print("客户端断开连接")

# 启动 WebSocket 服务
async def main():
    async with websockets.serve(handler, "0.0.0.0", 8765):
        print("WebSocket 服务器已启动：ws://0.0.0.0:8765")
        await asyncio.Future()  # 让程序一直运行

if __name__ == "__main__":
    asyncio.run(main())
