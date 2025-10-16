<script setup lang="ts">
import { ElMessage } from 'element-plus'
import { speakerList, upgradeSpeakerListInPlace } from './voices_label_value_plus'
// 路径按你项目调整
upgradeSpeakerListInPlace(speakerList)
interface EmotionOption { label: string, value: string }
interface SpeakerOption {
  label: string
  value: string
  languages: string[]
  emotions: EmotionOption[]
  business: string[]
  mix: boolean
}
const wsUrl = ref('ws://localhost:8787/tts')
const text = ref('唧唧复唧唧，木兰当户织。不闻机杼声，唯闻女叹息。问女何所思，问女何所忆。女亦无所思，女亦无所忆。昨夜见军帖，可汗大点兵。军书十二卷，卷卷有爷名。阿爷无大儿，木兰无长兄。愿为市鞍马，从此替爷征。')
const speaker = ref('zh_female_tianxinxiaomei_emo_v2_mars_bigtts')
const emotion = ref<string>('')
const emotionScale = ref<number>(4)
const audioFormat = ref<'mp3' | 'wav'>('mp3')
const sampleRate = ref<number>(24000)

const audioRef = ref<HTMLAudioElement | null>(null)
let _ws: WebSocket | null = null

let _mediaSource: MediaSource | null = null
let _sourceBuffer: SourceBuffer | null = null
let _mediaUrl: string | null = null

// —— 合并/节流 —— //
const TARGET_CHUNK = 96 * 1024 // 首批 ≥96KB 再播
const MERGE_LOW = 64 * 1024
const MERGE_HIGH = 128 * 1024

let _mergeBuf = new Uint8Array(0)
let _queue: ArrayBuffer[] = []
let _appending = false
let _firstPlayed = false

let _allChunks: ArrayBuffer[] = []
const chunksCount = ref(0)
const totalBytes = ref(0)
const running = ref(false)
const canDownload = computed(() => !running.value && _allChunks.length > 0)
// 当前选中音色完整对象
const current = computed<SpeakerOption | undefined>(() =>
  (speakerList as unknown as SpeakerOption[]).find(s => s.value === speaker.value),
)
// 根据选中音色，联动情感下拉
const emotionOptions = computed<EmotionOption[]>(() => current.value?.emotions ?? [])
function human(n: number) {
  if (n < 1024) {
    return `${n} B`
  }
  if (n < 1024 * 1024) {
    return `${(n / 1024).toFixed(1)} KB`
  }
  return `${(n / 1024 / 1024).toFixed(2)} MB`
}

function _resetMedia() {
  _queue = []
  _mergeBuf = new Uint8Array(0)
  _appending = false
  _firstPlayed = false
  _allChunks = []
  chunksCount.value = 0
  totalBytes.value = 0

  if (_sourceBuffer) {
    try {
      _sourceBuffer.abort()
    }
    catch (_e) {}
  }
  if (_mediaSource && _mediaSource.readyState === 'open') {
    try {
      _mediaSource.endOfStream()
    }
    catch (_e) {}
  }
  _sourceBuffer = null
  _mediaSource = null

  if (_mediaUrl) {
    URL.revokeObjectURL(_mediaUrl)
    _mediaUrl = null
  }
  const _el = audioRef.value
  if (_el) {
    _el.removeAttribute('src')
    _el.load()
  }
}

function _closeWs() {
  if (_ws && _ws.readyState === WebSocket.OPEN) {
    try {
      _ws.close()
    }
    catch (_e) {}
  }
  _ws = null
}

async function _initMSE() {
  const _el = audioRef.value
  if (!_el) {
    return
  }
  _mediaSource = new MediaSource()
  _mediaUrl = URL.createObjectURL(_mediaSource)
  _el.src = _mediaUrl

  await new Promise<void>((resolve) => {
    _mediaSource!.addEventListener('sourceopen', () => resolve(), { once: true })
  })

  // audio/mpeg for mp3
  _sourceBuffer = _mediaSource.addSourceBuffer('audio/mpeg')
  _sourceBuffer.addEventListener('updateend', () => {
    _appending = false
    if (!_sourceBuffer) {
      return
    }
    if (_queue.length > 0 && !_sourceBuffer.updating) {
      _appending = true
      _sourceBuffer.appendBuffer(_queue.shift()!)
    }
  })
}

function _concat(a: Uint8Array, b: Uint8Array) {
  const out = new Uint8Array(a.length + b.length)
  out.set(a, 0)
  out.set(b, a.length)
  return out
}

function _appendMerged(_buf: ArrayBuffer) {
  if (!_sourceBuffer) {
    return
  }
  if (_sourceBuffer.updating || _appending) {
    _queue.push(_buf)
  }
  else {
    _appending = true
    _sourceBuffer.appendBuffer(_buf)
  }
}

function _onBinary(buf: ArrayBuffer) {
  // 保存完整数据用于下载
  _allChunks.push(buf)
  chunksCount.value++
  totalBytes.value += buf.byteLength

  if (audioFormat.value === 'mp3') {
    // 合并到目标尺寸区间（64-128KB）
    if (_mergeBuf.length < MERGE_LOW) {
      _mergeBuf = _concat(_mergeBuf, new Uint8Array(buf))
      if (!_firstPlayed && _mergeBuf.length >= TARGET_CHUNK) {
        // 首批到位，先追加再 play
        _appendMerged(_mergeBuf.buffer)
        _mergeBuf = new Uint8Array(0)
        const _el = audioRef.value
        if (_el && !_firstPlayed) {
          _firstPlayed = true
          _el.play().catch((_e) => {})
        }
      }
      return
    }

    const merged = _concat(_mergeBuf, new Uint8Array(buf))
    if (merged.length >= MERGE_HIGH) {
      _appendMerged(merged.buffer)
      _mergeBuf = new Uint8Array(0)
    }
    else {
      _mergeBuf = merged
    }
  }
}

function start() {
  if (running.value) {
    return
  }
  if (!text.value.trim()) {
    ElMessage.warning('请输入文本')
    return
  }

  _closeWs()
  _resetMedia()
  running.value = true

  const _doMSE = audioFormat.value === 'mp3'

  const _go = async () => {
    if (_doMSE) {
      await _initMSE()
      // 不立刻 play，等首批缓冲 ≥ TARGET_CHUNK
    }
    _ws = new WebSocket(wsUrl.value)
    _ws.binaryType = 'arraybuffer'

    _ws.onopen = () => {
      // 等后端 READY_SEND_PARAMS
    }

    _ws.onmessage = (e) => {
      if (typeof e.data === 'string') {
        if (e.data === 'READY_SEND_PARAMS') {
          const payload = {
            text: text.value,
            speaker: speaker.value,
            audio_params: {
              format: audioFormat.value,
              sample_rate: sampleRate.value,
              emotion: emotion.value,
              emotion_scale: emotionScale.value,
            },
          }
          console.log('payload', payload)

          _ws?.send(JSON.stringify(payload))
        }
        return
      }
      _onBinary(e.data as ArrayBuffer)
    }

    _ws.onerror = (_err) => {
      running.value = false
      ElMessage.error('WebSocket 错误')
    }

    _ws.onclose = () => {
      // 把残余合并块发掉
      if (audioFormat.value === 'mp3' && _mergeBuf.length > 0) {
        _appendMerged(_mergeBuf.buffer)
        _mergeBuf = new Uint8Array(0)
      }

      // 等待队列清空后结束 MSE
      if (_mediaSource && _mediaSource.readyState === 'open') {
        const _finish = () => {
          if (_sourceBuffer && (_sourceBuffer.updating || _queue.length > 0)) {
            requestAnimationFrame(_finish)
            return
          }
          try {
            _mediaSource!.endOfStream()
          }
          catch (_e) {}
        }
        requestAnimationFrame(_finish)
      }
      running.value = false
    }
  }

  _go()
}

function stop() {
  _closeWs()
  _resetMedia()
  running.value = false
}

function downloadAudio() {
  if (_allChunks.length === 0) {
    return
  }
  const mime = audioFormat.value === 'mp3' ? 'audio/mpeg' : 'audio/wav'
  const blob = new Blob(_allChunks, { type: mime })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${speaker.value}_${Date.now()}.${audioFormat.value}`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  setTimeout(() => URL.revokeObjectURL(url), 0)
}

onBeforeUnmount(() => {
  _closeWs()
  _resetMedia()
})
</script>

<template>
  <div class="p-6">
    <el-card class="max-w-3xl m-auto">
      <h2>豆包TTS · 流式播放（平滑版）</h2>

      <el-form label-width="120px" class="mt-4">
        <el-form-item label="代理地址">
          <el-input v-model="wsUrl" placeholder="ws://localhost:8787/tts" />
        </el-form-item>

        <el-form-item label="文本">
          <el-input v-model="text" type="textarea" :rows="3" />
        </el-form-item>

        <el-form-item label="音色">
          <el-select v-model="speaker" style="width: 360px" filterable clearable placeholder="选择音色">
            <el-option
              v-for="item in speakerList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>

        <!-- 选中音色后的补充信息（可选） -->
        <div v-if="current">
          <div class="text-xs" style="color:#909399;margin-bottom:6px">
            语种：{{ current.languages.join(' / ') }}
            <span v-if="current.mix"> · 支持MIX</span>
            <span v-if="current.business.length"> · 业务方：{{ current.business.join(' / ') }}</span>
          </div>

          <el-form-item v-if="emotionOptions.length" label="情感">
            <el-select v-model="emotion" style="width: 360px" clearable placeholder="可选情感（不选则默认）">
              <el-option
                v-for="e in emotionOptions"
                :key="e.value"
                :label="e.label"
                :value="e.value"
              />
            </el-select>
          </el-form-item>

          <el-form-item v-if="emotionOptions.length" label="情感值">
            <el-input-number v-model="emotionScale" :min="1" :max="5" />
          </el-form-item>
        </div>

        <el-form-item label="格式">
          <el-radio-group v-model="audioFormat">
            <el-radio value="mp3">
              mp3（推荐流式）
            </el-radio>
            <el-radio value="wav">
              wav（收完播）
            </el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="采样率">
          <el-select v-model="sampleRate" style="width: 200px">
            <el-option label="24000 Hz" :value="24000" />
            <el-option label="16000 Hz" :value="16000" />
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" :disabled="running" @click="start">
            开始合成
          </el-button>
          <el-button :disabled="!running" @click="stop">
            停止
          </el-button>
          <el-button :disabled="!canDownload" @click="downloadAudio">
            下载
          </el-button>
        </el-form-item>
      </el-form>

      <el-divider />

      <div class="text-sm text-gray-500">
        状态：<b>{{ running ? '运行中' : '空闲' }}</b>；
        片段：{{ chunksCount }}；累计：{{ human(totalBytes) }}
      </div>

      <audio ref="audioRef" controls style="width: 100%; margin-top: 12px" />
    </el-card>
  </div>
</template>

<style scoped>
.p-6 {
  padding: 24px;
}
.max-w-3xl {
  max-width: 900px;
}
.m-auto {
  margin: 0 auto;
}
.mt-4 {
  margin-top: 16px;
}
</style>
