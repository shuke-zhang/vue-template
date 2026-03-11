<script setup lang="ts" generic="T extends number | undefined = undefined">
import type {
  UploadFile,
  UploadFiles,
  UploadInstance,
  UploadProgressEvent,
  UploadRawFile,
  UploadRequestOptions,
  UploadStatus,
  UploadUserFile,
} from 'element-plus'
import type { EpPropMergeType } from 'element-plus/es/utils/index.mjs'
import type {
  UploadedFilesModel,
  UploadFileModel,
  UploadFileResponseModel,
  UploadRow,
} from './types'
import { Delete, Plus, ZoomIn } from '@element-plus/icons-vue'
import axios from 'axios'
import { dayjs, ElMessage, genFileId } from 'element-plus'
import { computed, defineExpose, nextTick, ref, watch } from 'vue'

type Awaitable<TValue> = Promise<TValue> | TValue

const props = withDefaults(defineProps<{
  /**
   * 上传接口相对地址
   */
  action?: string

  /**
   * 上传模式
   */
  mode?: UploadFileModel

  /**
   * 完整上传地址
   */
  uploadUrl?: string

  /**
   * 图标大小
   */
  iconSize?: string

  /**
   * 图标颜色
   */
  iconColor?: string

  /**
   * 宽度
   */
  width?: string

  /**
   * 高度
   */
  height?: string

  /**
   * 从响应中解析文件地址
   */
  resolveUrl?: (resp: ResponseData<UploadFileResponseModel>) => string

  /**
   * 是否只读
   */
  readonly?: boolean

  /**
   * 列表类型
   */
  listType?: EpPropMergeType<StringConstructor, 'picture-card' | 'text' | 'picture', unknown> | undefined

  /**
   * 请求方法
   */
  method?: 'POST' | 'PUT' | 'PATCH'

  /**
   * 请求头
   */
  headers?: Record<string, string>

  /**
   * 是否携带 cookie
   */
  withCredentials?: boolean

  /**
   * 附加表单
   */
  extraForm?: Record<string, any>

  /**
   * 文件类型
   */
  fileTypes?: string[] | string

  /**
   * 最大大小 MB
   */
  maxSizeMB?: number

  /**
   * 数量限制
   */
  limit?: T

  /**
   * 是否显示角标
   */
  isOccupyCorner?: boolean
  /**
   * 多文件上传时，是否保持用户选择文件时的顺序
   *
   * true：
   * - uploadedFiles 按用户选择顺序输出
   * - 即使接口返回顺序乱了，最终数组顺序仍保持 1、2、3
   *
   * false：
   * - uploadedFiles 按上传结果进入数组的顺序输出
   * - 谁先返回谁先排前面
   */
  preserveBatchSelectionOrder?: boolean
}>(), {
  action: '/api/videoKC/video_upload2',
  mode: 'list',
  iconSize: '16',
  iconColor: '#000000',
  width: '100',
  height: '100',
  resolveUrl: (resp: ResponseData<UploadFileResponseModel>) => {
    return resp?.data?.httpUrl || ''
  },
  readonly: false,
  listType: 'picture-card',
  method: 'POST',
  headers: () => ({}),
  withCredentials: false,
  extraForm: () => ({}),
  fileTypes: () => [],
  maxSizeMB: 0,
  isOccupyCorner: false,
  preserveBatchSelectionOrder: true,
})

const emit = defineEmits<{
  (e: 'progress', row: UploadRow): void
  (e: 'success', row: UploadRow): void
  (e: 'error', row: UploadRow): void
  (e: 'onBeforeRemove', payload: { uploadFile: UploadFile, uploadFiles: UploadFiles }): void
  (e: 'onSuccess', payload: { response: ResponseData<UploadFileResponseModel>, uploadFile: UploadFile, uploadFiles: UploadFiles }): void
  (e: 'onError', payload: { error: Error, uploadFile: UploadFile, uploadFiles: UploadFiles }): void
  (e: 'onProgress', payload: { evt: UploadProgressEvent, uploadFile: UploadFile, uploadFiles: UploadFiles }): void
  (e: 'onRemove', payload: { uploadFile: UploadFile, uploadFiles: UploadFiles }): void
}>()

/**
 * el-upload 内部展示层文件列表
 *
 * 作用：
 * 1. 专门给 Element Plus 的 <el-upload> 组件使用
 * 2. 用于维护上传列表、缩略图、删除按钮、预览状态等 UI 展示
 * 3. 属于“组件内部展示数据”，不是最终业务提交数据
 *
 * 数据类型：
 * - 始终为 UploadUserFile[]
 *
 * 外部是否必须传：
 * - 不必须
 * - 一般业务场景下，外部不需要关心这个字段
 * - 只有在你想“手动控制上传列表展示 / 手动回显 el-upload 列表”时，才需要 v-model:file-data
 *
 * 建议：
 * - 普通页面开发时，可以不传
 * - 推荐主要使用 v-model:uploaded-files 作为业务数据源
 */
const fileData = defineModel<UploadUserFile[]>('fileData', {
  default: () => [],
})

/**
 * 上传结果业务模型
 *
 * 作用：
 * 1. 保存当前组件真正的上传结果数据
 * 2. 外部页面应优先使用这个字段进行业务处理
 * 3. 可用于表单提交、获取文件地址、监听上传进度、判断上传状态
 *
 * 数据类型：
 * - 单文件模式（limit = 1 / avatar）时：UploadRow | null
 * - 多文件模式时：UploadRow[] | null
 *
 * 里面通常包含：
 * - 文件名 name
 * - 文件大小 size / sizeBytes
 * - 上传进度 progress
 * - 上传状态 status
 * - 后端返回结果 response
 * - 文件地址 response.data.httpUrl
 *
 * 外部是否必须传：
 * - 不必须
 * - 但如果外部页面需要拿到上传结果，建议一定使用 v-model:uploaded-files
 *
 * 建议：
 * - 业务开发时，优先使用这个字段
 * - 一般不要把 fileData 当成最终业务数据源
 */
const uploadedFiles = defineModel<UploadedFilesModel<T>>('uploadedFiles', {
  default: () => null as UploadedFilesModel<T>,
})

const uploadRef = ref<UploadInstance | null>(null)
const inFlight = new Map<string, AbortController>()
const selectionOrderByUid = new Map<string, number>()
const selectionOrderSeed = ref(0)
const metaByUid = new Map<string, {
  name: string
  type: string
  sizeBytes: number
  createdAt: string
}>()

/**
 * 预览弹窗
 * 仅图片使用
 */
const dialogImageUrl = ref('')
const dialogOriginalUrl = ref('')
const dialogVisible = ref(false)

/**
 * 预览视频
 */
const dialogVideoUrl = ref('')
const dialogVideoVisible = ref(false)

/**
 * 缩略图缓存
 * key = uid
 * value = 预览地址
 */
const previewMap = ref<Record<string, string>>({})

/**
 * 文件类型缓存
 * key = uid
 * value = image / video / file
 */
const previewKindMap = ref<Record<string, 'image' | 'video' | 'file'>>({})

const IMAGE_EXTS = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'svg']
const VIDEO_EXTS = ['mp4', 'avi', 'mov', 'rmvb', 'wmv', 'flv', 'mkv', 'webm', 'm4v', '3gp']
const KNOWN_MIMES: Record<string, string[]> = {
  'application/pdf': ['pdf'],
  'application/zip': ['zip'],
  'application/x-zip-compressed': ['zip'],
}

const isSingle = computed(() => {
  return props.mode === 'avatar' || props.limit === 1
})

const isFileDrag = computed(() => {
  return props.mode === 'drag'
})

const isFileAvatar = computed(() => {
  return props.mode === 'avatar'
})

const isFileList = computed(() => {
  return props.mode === 'list'
})

const isFileBtn = computed(() => {
  return props.mode === 'button'
})

/**
 * 只有 avatar / list 才展示预览区
 */
const shouldShowPreviewList = computed(() => {
  return props.mode === 'avatar' || props.mode === 'list'
})

/**
 * 只有 avatar / list 才允许预览交互
 * 但真正点击预览时还会继续判断是否为图片
 */
const shouldEnablePreview = computed(() => {
  return props.mode === 'avatar' || props.mode === 'list'
})

const actualLimit = computed(() => {
  if (props.mode === 'avatar') {
    return 1
  }

  return props.limit || 0
})

const isReadonlyComputed = computed(() => {
  if (props.readonly) {
    return true
  }

  const limit = Number(actualLimit.value || 0)

  if (!limit) {
    return false
  }

  return fileData.value.length >= limit
})

const finalUploadUrl = computed(() => {
  const base = import.meta.env.VITE_API_URL || ''
  const act = props.action || ''
  return props.uploadUrl ?? `${base}${act}`
})

const width = computed(() => {
  if (props.mode === 'button') {
    return 'auto'
  }

  return props.width.includes('px') ? props.width : `${props.width}px`
})

const height = computed(() => {
  if (props.mode === 'button') {
    return 'auto'
  }

  return props.height.includes('px') ? props.height : `${props.height}px`
})

const borderRadius = computed(() => {
  return props.mode === 'avatar' ? '50%' : '6px'
})

const itemMargin = computed(() => {
  return isSingle.value ? '0px' : '10px'
})

const progressSize = computed(() => {
  if (props.height.includes('px')) {
    return `${Math.max(Number.parseFloat(props.height) - 10, 20)}px`
  }

  return `${Math.max(Number(props.height) - 10, 20)}px`
})

const oneLimitHeight = computed(() => {
  return isSingle.value ? height.value : null
})

function getRows(): UploadRow[] {
  const val = uploadedFiles.value

  if (Array.isArray(val)) {
    return [...val]
  }

  /**
   * 空对象视为“未初始化”
   * 例如外部写了：
   * const file = ref<UploadRow | null>({})
   */
  if (isEmptyPlainObject(val)) {
    return []
  }

  if (val && typeof val === 'object') {
    return [val]
  }

  return []
}

function setRows(rows: UploadRow[]): void {
  if (isSingle.value) {
    uploadedFiles.value = (rows[0] ?? null) as UploadedFilesModel<T>
    return
  }

  const finalRows = sortRowsBySelectionOrder(rows)

  uploadedFiles.value = finalRows as UploadedFilesModel<T>
}

function ensureUploadedFilesMode(): void {
  const val = uploadedFiles.value

  if (isSingle.value) {
    /**
     * 单文件模式下：
     * - 数组取第一个
     * - 空对象转成 null
     */
    if (Array.isArray(val)) {
      uploadedFiles.value = (val[0] ?? null) as UploadedFilesModel<T>
      return
    }

    if (isEmptyPlainObject(val)) {
      uploadedFiles.value = null as UploadedFilesModel<T>
    }

    return
  }

  /**
   * 多文件模式下：
   * - 非数组统一转数组
   * - 空对象转空数组
   */
  if (!Array.isArray(val)) {
    if (isEmptyPlainObject(val)) {
      uploadedFiles.value = [] as UploadedFilesModel<T>
      return
    }

    if (val) {
      uploadedFiles.value = [val] as UploadedFilesModel<T>
      return
    }

    uploadedFiles.value = [] as UploadedFilesModel<T>
  }
}

function ensureFileDataMode(): void {
  if (isSingle.value && fileData.value.length > 1) {
    fileData.value = fileData.value.slice(0, 1)
  }
}

watch(
  () => [props.limit, props.mode],
  () => {
    ensureUploadedFilesMode()
    ensureFileDataMode()
  },
  { immediate: true },
)

function formatBytes(bytes: number): string {
  const KB = 1024
  const MB = KB * 1024
  const GB = MB * 1024

  if (bytes < MB) {
    return `${(bytes / KB).toFixed(2)} KB`
  }

  if (bytes < GB) {
    return `${(bytes / MB).toFixed(2)} MB`
  }

  return `${(bytes / GB).toFixed(2)} GB`
}

interface NormalizedTypes {
  exts: Set<string>
  mimes: Set<string>
  acceptAttr: string
}

function normalizeFileTypes(input: string[] | string | undefined): NormalizedTypes {
  const tokens = Array.isArray(input) ? input : input ? [input] : []
  const exts = new Set<string>()
  const mimes = new Set<string>()

  if (tokens.length === 0) {
    return {
      exts,
      mimes,
      acceptAttr: '',
    }
  }

  tokens.forEach((raw) => {
    const t = String(raw).trim().toLowerCase()

    if (!t) {
      return
    }

    if (t === 'image' || t === 'image/*') {
      IMAGE_EXTS.forEach((e) => {
        exts.add(e)
      })
      mimes.add('image/*')
      return
    }

    if (t === 'video' || t === 'video/*') {
      VIDEO_EXTS.forEach((e) => {
        exts.add(e)
      })
      mimes.add('video/*')
      return
    }

    if (t === 'pdf') {
      exts.add('pdf')
      mimes.add('application/pdf')
      return
    }

    if (t === 'zip') {
      exts.add('zip')
      mimes.add('application/zip')
      return
    }

    if (t.startsWith('application/')) {
      const mapped = KNOWN_MIMES[t] || []

      mapped.forEach((e) => {
        exts.add(e)
      })

      mimes.add(t)
      return
    }

    const pure = t.startsWith('.') ? t.slice(1) : t

    if (/^[a-z0-9]+$/.test(pure)) {
      exts.add(pure)
    }
  })

  const acceptParts: string[] = []

  mimes.forEach((m) => {
    acceptParts.push(m)
  })

  exts.forEach((e) => {
    acceptParts.push(`.${e}`)
  })

  return {
    exts,
    mimes,
    acceptAttr: acceptParts.join(','),
  }
}

const normalizedTypes = computed(() => {
  /**
   * avatar 强制只支持图片
   */
  if (props.mode === 'avatar') {
    return normalizeFileTypes('image')
  }

  return normalizeFileTypes(props.fileTypes)
})

function getFileExt(name: string | undefined): string {
  if (!name) {
    return ''
  }

  if (!name.includes('.')) {
    return ''
  }

  return name.split('.').pop()?.toLowerCase() || ''
}

function getPreviewKindByNameOrType(name: string | undefined, mime: string | undefined): 'image' | 'video' | 'file' {
  const ext = getFileExt(name)
  const lowerMime = (mime || '').toLowerCase()

  if (IMAGE_EXTS.includes(ext) || lowerMime.startsWith('image/')) {
    return 'image'
  }

  if (VIDEO_EXTS.includes(ext) || lowerMime.startsWith('video/')) {
    return 'video'
  }

  return 'file'
}

function getFileTypeLabel(name: string | undefined): string {
  const ext = getFileExt(name)

  if (!ext) {
    return '文件'
  }

  return ext.toUpperCase()
}

function matchByType(file: UploadRawFile, norm: NormalizedTypes): boolean {
  if (norm.exts.size === 0 && norm.mimes.size === 0) {
    return true
  }

  const mime = (file.type || '').toLowerCase()
  const name = file.name || ''
  const ext = name.includes('.') ? name.split('.').pop()?.toLowerCase() || '' : ''

  if (ext && norm.exts.has(ext)) {
    return true
  }

  const okMime = mime && (
    norm.mimes.has(mime)
    || [...norm.mimes].some((m) => {
      if (!m.endsWith('/*')) {
        return false
      }

      const prefix = `${m.split('/')[0]}/`
      return mime.startsWith(prefix)
    })
  )

  if (okMime) {
    return true
  }

  return false
}

function checkSize(file: UploadRawFile, maxMB: number): true | string {
  if (!maxMB || maxMB <= 0) {
    return true
  }

  const ok = file.size <= maxMB * 1024 * 1024

  if (ok) {
    return true
  }

  return `文件过大，最大支持 ${maxMB} MB，当前 ${formatBytes(file.size)}`
}

/**
 * 生成视频第一帧预览
 */
async function generateVideoPoster(url: string): Promise<string> {
  return await new Promise((resolve) => {
    const video = document.createElement('video')
    video.crossOrigin = 'anonymous'
    video.preload = 'metadata'
    video.muted = true
    video.playsInline = true
    video.src = url

    const cleanup = () => {
      video.pause()
      video.removeAttribute('src')
      video.load()
    }

    video.addEventListener('loadeddata', () => {
      try {
        video.currentTime = 0
      }
      catch {
        resolve('')
      }
    })

    video.addEventListener('seeked', () => {
      try {
        const canvas = document.createElement('canvas')
        canvas.width = video.videoWidth || 320
        canvas.height = video.videoHeight || 180
        const ctx = canvas.getContext('2d')

        if (!ctx) {
          cleanup()
          resolve('')
          return
        }

        ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
        const poster = canvas.toDataURL('image/png')
        cleanup()
        resolve(poster)
      }
      catch {
        cleanup()
        resolve('')
      }
    })

    video.addEventListener('error', () => {
      cleanup()
      resolve('')
    })
  })
}

/**
 * 根据文件类型更新预览
 */
async function updatePreviewByFile(uploadFile: UploadUserFile): Promise<void> {
  const uidStr = String(uploadFile.uid)
  const fileUrl = uploadFile.url || ''
  const kind = getPreviewKindByNameOrType(uploadFile.name, (uploadFile.raw as File | undefined)?.type)

  previewKindMap.value[uidStr] = kind

  if (!fileUrl) {
    return
  }

  if (kind === 'image') {
    previewMap.value[uidStr] = fileUrl
    return
  }

  if (kind === 'video') {
    const poster = await generateVideoPoster(fileUrl)

    if (poster) {
      previewMap.value[uidStr] = poster
    }

    return
  }

  previewMap.value[uidStr] = ''
}

function beforeUpload(file: UploadRawFile) {
  const uid = String((file as any).uid ?? '')

  if (uid) {
    metaByUid.set(uid, {
      name: file.name || '未知文件',
      type: file.type || '',
      sizeBytes: Number(file.size ?? 0),
      createdAt: dayjs().format('YYYY-MM-DD HH:mm:ss'),
    })
  }

  /**
   * avatar 强制只允许图片
   */
  if (props.mode === 'avatar') {
    const kind = getPreviewKindByNameOrType(file.name, file.type)

    if (kind !== 'image') {
      ElMessage.error('头像模式只支持图片上传')
      return false
    }
  }

  const okType = matchByType(file, normalizedTypes.value)

  if (!okType) {
    const hint = normalizedTypes.value.acceptAttr || '所需类型'
    ElMessage.error(`文件类型不符合要求，仅支持：${hint}`)
    return false
  }

  const sizeCheck = checkSize(file, props.maxSizeMB)

  if (sizeCheck !== true) {
    ElMessage.error(sizeCheck)
    return false
  }

  return true
}

function onExceed(filesRaw: File[]) {
  if (!isSingle.value) {
    ElMessage.warning(`最多只能上传 ${actualLimit.value} 个文件`)
    return
  }

  const raw = filesRaw[0] as UploadRawFile

  uploadRef.value?.clearFiles()
  setRows([])
  fileData.value = []
  raw.uid = genFileId()
  uploadRef.value?.handleStart(raw)
  uploadRef.value?.submit()
}

function isPlaceholderName(name: string | undefined): boolean {
  if (!name) {
    return true
  }

  return name.trim() === '未知文件'
}

function getRow(uid: string): UploadRow | undefined {
  return getRows().find((row) => {
    return String(row.uid) === uid
  })
}

function upsert(uid: string, patch: Partial<UploadRow> & Pick<UploadRow, 'uid'>): UploadRow {
  const rows = getRows()
  const idx = rows.findIndex((row) => {
    return String(row.uid) === uid
  })
  const meta = metaByUid.get(uid)

  const defaultName = patch.name || meta?.name || '未知文件'
  const defaultType = patch.type || meta?.type || ''
  const defaultSizeBytes = Number(patch.sizeBytes ?? meta?.sizeBytes ?? 0)
  const defaultSize = patch.size || formatBytes(defaultSizeBytes)
  const defaultCreatedAt = patch.createdAt || meta?.createdAt || dayjs().format('YYYY-MM-DD HH:mm:ss')

  const baseRow: UploadRow = {
    uid,
    name: defaultName,
    type: defaultType,
    size: defaultSize,
    sizeBytes: defaultSizeBytes,
    createdAt: defaultCreatedAt,
    progress: Number(patch.progress ?? 0),
    url: patch.url || '',
    status: patch.status || 'uploading',
    message: patch.message,
    response: patch.response,
  }

  if (idx === -1) {
    const nextRow = {
      ...baseRow,
      ...patch,
    } as UploadRow

    setRows([...rows, nextRow])
    return nextRow
  }

  const merged = {
    ...rows[idx],
    ...patch,
  } as UploadRow

  const nextRows = [...rows]
  nextRows[idx] = merged
  setRows(nextRows)
  return merged
}

function removeRow(uidStr: string): void {
  const controller = inFlight.get(uidStr)

  if (controller) {
    controller.abort()
    inFlight.delete(uidStr)
  }

  metaByUid.delete(uidStr)
  selectionOrderByUid.delete(uidStr)
  if (previewMap.value[uidStr]?.startsWith('blob:')) {
    URL.revokeObjectURL(previewMap.value[uidStr])
  }

  delete previewMap.value[uidStr]
  delete previewKindMap.value[uidStr]

  const nextRows = getRows().filter((row) => {
    return String(row.uid) !== uidStr
  })

  setRows(nextRows)

  fileData.value = fileData.value.filter((item) => {
    return String(item.uid) !== uidStr
  })
}

function pickMeta(
  existed: UploadRow | undefined,
  nextName: string,
  nextType: string,
  nextSizeBytes: number,
) {
  const keepName = existed?.name && !isPlaceholderName(existed.name) ? existed.name : nextName
  const keepType = existed?.type || nextType
  const keepSizeBytes = typeof existed?.sizeBytes === 'number' && existed.sizeBytes > 0
    ? existed.sizeBytes
    : nextSizeBytes

  const keepSize = keepSizeBytes > 0
    ? formatBytes(keepSizeBytes)
    : formatBytes(nextSizeBytes)

  return {
    name: keepName,
    type: keepType,
    sizeBytes: keepSizeBytes,
    size: keepSize,
    createdAt: existed?.createdAt || dayjs().format('YYYY-MM-DD HH:mm:ss'),
  }
}

function syncFileDataItem(
  uploadFile: UploadUserFile,
  patch?: Partial<UploadUserFile>,
): void {
  const uidStr = String(uploadFile.uid)

  const idx = fileData.value.findIndex((item) => {
    return String(item.uid) === uidStr
  })

  const merged: UploadUserFile = {
    name: uploadFile.name || '',
    url: uploadFile.url || '',
    status: uploadFile.status || 'ready',
    uid: uploadFile.uid,
    percentage: uploadFile.percentage ?? 0,
    raw: uploadFile.raw,
    response: uploadFile.response,
    size: uploadFile.size,
    ...patch,
  }

  if (idx === -1) {
    if (isSingle.value) {
      fileData.value = [merged]
      return
    }

    fileData.value.push(merged)
    return
  }

  fileData.value[idx] = {
    ...fileData.value[idx],
    ...merged,
  }
}

function handleChange(uploadFile: UploadUserFile): void {
  const uid = String((uploadFile as any).uid)
  const status = (uploadFile as UploadUserFile & { status?: UploadStatus }).status

  ensureSelectionOrder(uid)

  if (status === 'fail') {
    removeRow(uid)
    return
  }

  const existed = getRow(uid)

  if (existed) {
    syncFileDataItem(uploadFile)
    return
  }

  if (isSingle.value) {
    setRows([])
    fileData.value = []
  }

  const raw = uploadFile.raw as File | undefined
  const sizeBytes = Number(raw?.size ?? 0)

  metaByUid.set(uid, {
    name: raw?.name || uploadFile.name || '未知文件',
    type: raw?.type || '',
    sizeBytes,
    createdAt: dayjs().format('YYYY-MM-DD HH:mm:ss'),
  })

  const row = upsert(uid, {
    uid,
    name: raw?.name || uploadFile.name || '未知文件',
    type: raw?.type || '',
    size: formatBytes(sizeBytes),
    sizeBytes,
    createdAt: dayjs().format('YYYY-MM-DD HH:mm:ss'),
    progress: 0,
    url: '',
    status: 'uploading',
  })

  previewKindMap.value[uid] = getPreviewKindByNameOrType(uploadFile.name, raw?.type)

  syncFileDataItem(uploadFile, {
    status: 'ready',
    percentage: 0,
  })

  emit('progress', row)
}

function makeUploadProgressEvent(percent: number, loaded = 0, total = 100): UploadProgressEvent {
  const evt = new ProgressEvent('progress', {
    lengthComputable: true,
    loaded,
    total,
  })

  ;(evt as any).percent = percent

  return evt as UploadProgressEvent
}

async function doUpload(options: UploadRequestOptions): Promise<void> {
  const { file, onProgress, onSuccess, onError } = options
  const f = file as File
  const uidStr = String((file as any).uid)
  const existed = getRow(uidStr)
  const metaFromMap = metaByUid.get(uidStr)

  const sizeBytes = Number(f?.size ?? (file as any)?.size ?? metaFromMap?.sizeBytes ?? 0)
  const fileName = f?.name || (file as any)?.name || metaFromMap?.name || existed?.name || '未知文件'
  const fileType = f?.type || (file as any)?.type || metaFromMap?.type || existed?.type || ''
  const meta = pickMeta(existed, fileName, fileType, sizeBytes)

  upsert(uidStr, {
    uid: uidStr,
    name: meta.name,
    type: meta.type,
    size: meta.size,
    sizeBytes: meta.sizeBytes,
    createdAt: meta.createdAt,
    progress: existed?.progress ?? 0,
    url: existed?.url || '',
    status: existed?.status || 'uploading',
  })

  const controller = new AbortController()
  inFlight.set(uidStr, controller)

  try {
    const form = new FormData()
    form.append('file', f)

    Object.entries(props.extraForm).forEach(([key, value]) => {
      form.append(key, String(value))
    })

    let last = 0

    const res = await axios.request({
      method: props.method,
      url: finalUploadUrl.value,
      data: form,
      headers: {
        'Content-Type': 'multipart/form-data',
        ...props.headers,
      },
      withCredentials: props.withCredentials,
      signal: controller.signal,
      onUploadProgress: (e) => {
        if (!e.total) {
          return
        }

        let percent = Math.floor((e.loaded / e.total) * 100)

        if (percent >= 100) {
          percent = 99
        }

        if (percent <= last) {
          return
        }

        last = percent

        const row = upsert(uidStr, {
          uid: uidStr,
          progress: percent,
          status: 'uploading',
        })

        const evt = makeUploadProgressEvent(percent, e.loaded, e.total)

        onProgress?.(evt)

        const currentFile = fileData.value.find((item) => {
          return String(item.uid) === uidStr
        })

        if (currentFile) {
          currentFile.status = 'uploading'
          currentFile.percentage = percent
        }

        emit('progress', row)

        if (currentFile) {
          emit('onProgress', {
            evt,
            uploadFile: currentFile as UploadFile,
            uploadFiles: fileData.value as UploadFiles,
          })
        }
      },
    })

    const data = res.data as ResponseData<UploadFileResponseModel>

    if (data?.code && data.code !== 200) {
      throw new Error(data?.msg || '上传失败')
    }

    const url = props.resolveUrl(data)
    const fileNameMatch = url?.match(/\/([^/?#]+)(?:[?#]|$)/)
    const rawData = (data?.data ?? {}) as UploadFileResponseModel

    const enhancedData: ResponseData<UploadFileResponseModel> = {
      ...data,
      data: {
        ...rawData,
        httpUrl: rawData.httpUrl || url,
        _fileName: fileNameMatch ? fileNameMatch[1] : '',
      },
    }

    const row = upsert(uidStr, {
      uid: uidStr,
      progress: 100,
      status: 'success',
      url,
      response: enhancedData,
    })

    const target = fileData.value.find((item) => {
      return String(item.uid) === uidStr
    })

    if (target) {
      target.url = url
      target.status = 'success'
      target.percentage = 100
      ;(target as any).response = enhancedData
      await updatePreviewByFile(target)
    }

    onSuccess?.(enhancedData)
    onProgress?.(makeUploadProgressEvent(100, 1, 1))

    await nextTick()

    emit('success', row)

    if (target) {
      emit('onSuccess', {
        response: enhancedData,
        uploadFile: target as UploadFile,
        uploadFiles: fileData.value as UploadFiles,
      })
    }

    clearAfterSuccess()
  }
  catch (err: any) {
    const canceled = err?.code === 'ERR_CANCELED'
      || err?.name === 'CanceledError'
      || err?.message === 'canceled'

    if (canceled) {
      upsert(uidStr, {
        uid: uidStr,
        status: 'fail',
        message: '已取消',
      })

      onError?.(err)
      removeRow(uidStr)
    }
    else {
      const row = upsert(uidStr, {
        uid: uidStr,
        status: 'fail',
        message: err?.message || '上传失败',
      })

      onError?.(err)
      emit('error', row)
      ElMessage.error(err?.message || '上传失败')

      const target = fileData.value.find((item) => {
        return String(item.uid) === uidStr
      })

      if (target) {
        emit('onError', {
          error: err,
          uploadFile: target as UploadFile,
          uploadFiles: fileData.value as UploadFiles,
        })
      }

      removeRow(uidStr)
    }
  }
  finally {
    inFlight.delete(uidStr)
    metaByUid.delete(uidStr)
  }
}

function handleError(_error: unknown, uploadFile: UploadFile): void {
  const uidStr = String((uploadFile as any).uid)
  removeRow(uidStr)
}

function clearAfterSuccess(): void {
  /**
   * 头像模式、列表模式需要保留 file-list，
   * 否则上传成功后界面会重新变回 “+”
   */
  if (props.mode === 'drag' || props.mode === 'button') {
    if (isSingle.value) {
      uploadRef.value?.clearFiles()
    }
  }
}

/**
 * 只有图片才允许点击预览
 */
function handleFilePreview(uploadFile: UploadFile): void {
  if (!shouldEnablePreview.value) {
    return
  }

  const uidStr = String(uploadFile.uid)
  const kind = previewKindMap.value[uidStr]
  const fileUrl = uploadFile.url || ''

  if (!fileUrl) {
    return
  }

  dialogOriginalUrl.value = fileUrl

  if (kind === 'image') {
    dialogImageUrl.value = fileUrl
    dialogVisible.value = true
    return
  }

  if (kind === 'video') {
    dialogVideoUrl.value = fileUrl
    dialogVideoVisible.value = true
  }
}

function beforeRemove(uploadFile: UploadFile, uploadFiles: UploadFiles): Awaitable<boolean> {
  emit('onBeforeRemove', {
    uploadFile,
    uploadFiles,
  })

  return true
}

function handleRemove(uploadFile: UploadFile, uploadFiles: UploadFiles): void {
  removeRow(String(uploadFile.uid))

  emit('onRemove', {
    uploadFile,
    uploadFiles,
  })
}

async function openOriginal(): Promise<void> {
  const fileUrl = dialogOriginalUrl.value

  if (!fileUrl) {
    return
  }

  try {
    const res = await fetch(fileUrl, {
      credentials: 'omit',
    })

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`)
    }

    const blob = await res.blob()
    const blobUrl = URL.createObjectURL(blob)
    window.open(blobUrl, '_blank')

    setTimeout(() => {
      URL.revokeObjectURL(blobUrl)
    }, 60000)
  }
  catch (error) {
    console.error(error)
    ElMessage.error('预览失败')
  }
}

function abortUpload(target: UploadFile | UploadRow | string | number): void {
  const uidStr = typeof target === 'object'
    ? String((target as any).uid)
    : String(target)

  const controller = inFlight.get(uidStr)

  if (controller) {
    controller.abort()
  }

  const elFile = {
    name: '',
    status: 'ready',
    uid: Number(uidStr),
  } as UploadFile

  uploadRef.value?.abort(elFile)

  upsert(uidStr, {
    uid: uidStr,
    status: 'fail',
    message: '已取消',
  })
}

function isEmptyPlainObject(value: unknown): boolean {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return false
  }

  return Object.keys(value as Record<string, unknown>).length === 0
}

function ensureSelectionOrder(uid: string): void {
  if (selectionOrderByUid.has(uid)) {
    return
  }

  selectionOrderSeed.value += 1
  selectionOrderByUid.set(uid, selectionOrderSeed.value)
}

function sortRowsBySelectionOrder(rows: UploadRow[]): UploadRow[] {
  if (!props.preserveBatchSelectionOrder) {
    return rows
  }

  if (isSingle.value) {
    return rows
  }

  return [...rows].sort((a, b) => {
    const orderA = selectionOrderByUid.get(String(a.uid)) ?? Number.MAX_SAFE_INTEGER
    const orderB = selectionOrderByUid.get(String(b.uid)) ?? Number.MAX_SAFE_INTEGER

    return orderA - orderB
  })
}

watch(dialogVisible, (val) => {
  if (!val) {
    dialogImageUrl.value = ''
  }
})

defineExpose({
  abortUpload,
})
</script>

<template>
  <div
    class="upload-wrap"
    :class="{ 'has-corner': isOccupyCorner }"
  >
    <el-upload
      ref="uploadRef"
      v-model:file-list="fileData"
      :class="{
        'avatar-mode': mode === 'avatar',
        'readonly': isReadonlyComputed,
        'preview-list-mode': shouldShowPreviewList,
      }"
      :drag="isFileDrag"
      action=""
      :list-type="shouldShowPreviewList
        ? (mode === 'avatar' ? 'picture-card' : listType)
        : undefined"
      :multiple="!isSingle"
      :show-file-list="shouldShowPreviewList"
      :limit="actualLimit > 0 ? actualLimit : undefined"
      :accept="normalizedTypes.acceptAttr"
      :disabled="readonly"
      :http-request="doUpload"
      :on-change="handleChange"
      :before-upload="beforeUpload"
      :before-remove="beforeRemove"
      :on-error="handleError"
      :on-preview="shouldEnablePreview ? handleFilePreview : undefined"
      :on-remove="handleRemove"
      :on-exceed="onExceed"
    >
      <!-- drag 模式 -->
      <div
        v-if="isFileDrag"
        class="h-full flex flex-col justify-center items-center text-[#1b79ff]"
      >
        <svg
          viewBox="0 0 1024 1024"
          focusable="false"
          data-icon="inbox"
          width="1.5em"
          height="1.5em"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            d="M885.2 446.3l-.2-.8-112.2-285.1c-5-16.1-19.9-27.2-36.8-27.2H281.2c-17 0-32.1 11.3-36.9 27.6L139.4 443l-.3.7-.2.8c-1.3 4.9-1.7 9.9-1 14.8-.1 1.6-.2 3.2-.2 4.8V830a60.9 60.9 0 0060.8 60.8h627.2c33.5 0 60.8-27.3 60.9-60.8V464.1c0-1.3 0-2.6-.1-3.7.4-4.9 0-9.6-1.3-14.1zm-295.8-43l-.3 15.7c-.8 44.9-31.8 75.1-77.1 75.1-22.1 0-41.1-7.1-54.8-20.6S436 441.2 435.6 419l-.3-15.7H229.5L309 210h399.2l81.7 193.3H589.4zm-375 76.8h157.3c24.3 57.1 76 90.8 140.4 90.8 33.7 0 65-9.4 90.3-27.2 22.2-15.6 39.5-37.4 50.7-63.6h156.5V814H214.4V480.1z"
          />
        </svg>
        <div class="text-[#000000] text-xs mt-[4px]">
          单击或拖动文件到此区域进行上传
        </div>
        <div
          v-if="Number(actualLimit || 0) > 1"
          class="mt-[4px] text-[12px] text-gray-400"
        >
          支持批量上传
        </div>
      </div>

      <!-- list / avatar 模式 -->
      <div
        v-if="isFileList || isFileAvatar"
        class="flex-center flex-col text-center"
        :class="{ 'avatar-upload': isFileAvatar }"
      >
        <el-icon :size="iconSize" :color="iconColor">
          <Plus />
        </el-icon>
      </div>

      <!-- button 模式 -->
      <slot name="button">
        <el-button v-if="isFileBtn" type="primary">
          选择文件
        </el-button>
      </slot>

      <!-- 自定义文件卡片内容 -->
      <template #file="{ file }">
        <div
          class="custom-file-card"
          :class="{
            'is-image-card': previewKindMap[String(file.uid)] === 'image',
          }"
          @click="previewKindMap[String(file.uid)] === 'image'
            ? handleFilePreview(file as UploadFile)
            : undefined"
        >
          <!-- 图片 -->
          <img
            v-if="previewKindMap[String(file.uid)] === 'image' && previewMap[String(file.uid)]"
            class="custom-file-cover"
            :src="previewMap[String(file.uid)]"
            alt="preview"
          >

          <!-- 视频第一帧 -->
          <img
            v-else-if="previewKindMap[String(file.uid)] === 'video' && previewMap[String(file.uid)]"
            class="custom-file-cover"
            :src="previewMap[String(file.uid)]"
            alt="video-poster"
          >

          <!-- 其他文件占位 -->
          <div
            v-else
            class="custom-file-fallback"
          >
            <div class="fallback-type">
              {{ getFileTypeLabel(file.name) }}
            </div>
            <div class="fallback-text">
              文件
            </div>
          </div>

          <div
            v-if="previewKindMap[String(file.uid)] === 'video'"
            class="video-tag"
          >
            VIDEO
          </div>

          <div class="custom-file-mask">
            <el-icon
              v-if="previewKindMap[String(file.uid)] === 'image' || previewKindMap[String(file.uid)] === 'video'"
              class="custom-file-action"
              @click.stop="handleFilePreview(file as UploadFile)"
            >
              <ZoomIn />
            </el-icon>

            <el-icon
              class="custom-file-action"
              @click.stop="handleRemove(file as UploadFile, fileData as UploadFiles)"
            >
              <Delete />
            </el-icon>
          </div>

          <div class="custom-file-name" :title="file.name">
            {{ file.name }}
          </div>
        </div>
      </template>
    </el-upload>

    <el-dialog v-model="dialogVisible" append-to-body width="520px">
      <div class="mb-3 flex items-center justify-between">
        <div class="text-xs text-gray-500 truncate" :title="dialogOriginalUrl">
          {{ dialogOriginalUrl }}
        </div>
        <el-button
          v-if="dialogOriginalUrl"
          type="primary"
          text
          @click="openOriginal"
        >
          在新窗口打开
        </el-button>
      </div>
      <img :src="dialogImageUrl" alt="预览">
    </el-dialog>

    <el-dialog v-model="dialogVideoVisible" append-to-body width="720px" destroy-on-close>
      <div class="mb-3 flex items-center justify-between">
        <div class="text-xs text-gray-500 truncate" :title="dialogOriginalUrl">
          {{ dialogOriginalUrl }}
        </div>
        <el-button
          v-if="dialogOriginalUrl"
          type="primary"
          text
          @click="openOriginal"
        >
          在新窗口打开
        </el-button>
      </div>

      <video
        v-if="dialogVideoUrl"
        :src="dialogVideoUrl"
        controls
        autoplay
        class="video-preview-player"
      />
    </el-dialog>
  </div>
</template>

<style lang="scss" scoped>
.upload-wrap {
  position: relative;
}

img {
  width: 100%;
  height: auto;
}

.readonly {
  height: v-bind(oneLimitHeight) !important;

  :deep(.el-upload-list__item-status-label),
  :deep(.el-upload--picture-card) {
    display: none !important;
  }
}

:deep(.el-upload-list__item-actions) {
  width: v-bind(width) !important;
  height: v-bind(height) !important;
}

:deep(.el-upload--picture-card) {
  width: v-bind(width) !important;
  height: v-bind(height) !important;
  margin-bottom: v-bind(itemMargin) !important;
  margin-right: v-bind(itemMargin) !important;
  border-radius: v-bind(borderRadius) !important;
}

:deep(.is-uploading) {
  width: v-bind(width) !important;
  height: v-bind(height) !important;
  border-radius: v-bind(borderRadius) !important;
}

:deep(.el-upload-list__item) {
  width: v-bind(width) !important;
  height: v-bind(height) !important;
  margin-bottom: v-bind(itemMargin) !important;
  margin-right: v-bind(itemMargin) !important;
  border-radius: v-bind(borderRadius) !important;
  overflow: hidden !important;
}

:deep(.is-success) {
  width: v-bind(width) !important;
  height: v-bind(height) !important;
  margin: 0;
  border-radius: v-bind(borderRadius) !important;
}

:deep(.el-icon--close-tip) {
  display: none !important;
}

:deep(.el-progress-circle) {
  width: v-bind(progressSize) !important;
  height: v-bind(progressSize) !important;
  border-radius: v-bind(borderRadius) !important;
}

:deep(.el-progress) {
  width: v-bind(progressSize) !important;
  height: v-bind(progressSize) !important;
  border-radius: v-bind(borderRadius) !important;
}

:deep(.el-upload-dragger) {
  width: v-bind(width) !important;
  height: v-bind(height) !important;
  border-radius: v-bind(borderRadius) !important;
}

.avatar-upload {
  overflow: hidden;
  width: v-bind(width) !important;
  height: v-bind(width) !important;
  border-radius: v-bind(borderRadius) !important;
}

.has-corner :deep(.el-upload-list__item)::after {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  border-top: 36px solid #34c759;
  border-left: 36px solid transparent;
  border-top-right-radius: 6px;
}

.has-corner :deep(.el-upload-list__item)::before {
  content: attr(data-ext);
  position: absolute;
  top: 10px;
  right: 1px;
  width: 20px;
  transform: rotate(45deg);
  transform-origin: top right;
  text-align: right;
  color: #fff;
  font-size: 10px;
  z-index: 2;
}

.avatar-mode {
  background-color: unset !important;
}

:deep(.el-upload) {
  width: 100%;
}

:deep(.el-upload-dragger) {
  box-sizing: border-box;
}

.custom-file-card {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: #f5f7fa;
}

.custom-file-cover {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.custom-file-fallback {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #eef3ff 0%, #f8faff 100%);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: #606266;
}

.fallback-type {
  font-size: 20px;
  font-weight: 700;
  color: #409eff;
  line-height: 1;
}

.fallback-text {
  margin-top: 6px;
  font-size: 12px;
  color: #909399;
}

.video-tag {
  position: absolute;
  top: 8px;
  left: 8px;
  padding: 2px 6px;
  background: rgba(0, 0, 0, 0.55);
  color: #fff;
  border-radius: 10px;
  font-size: 10px;
  line-height: 1.2;
}

.custom-file-mask {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.35);
  opacity: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 14px;
  transition: opacity 0.2s;
}

.custom-file-card:hover .custom-file-mask {
  opacity: 1;
}

.custom-file-action {
  color: #fff;
  font-size: 18px;
  cursor: pointer;
}

.custom-file-name {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 4px 8px;
  background: rgba(0, 0, 0, 0.42);
  color: #fff;
  font-size: 12px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.video-preview-player {
  width: 100%;
  max-height: 70vh;
  display: block;
  background: #000;
  border-radius: 8px;
}
</style>
