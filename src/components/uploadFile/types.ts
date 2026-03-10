import type { UploadStatus } from 'element-plus'

/**
 * 根据 limit 推导出 v-model 类型
 * - limit = 1 时：单文件
 * - 其他情况：文件数组
 */
export type UploadedFilesModel<T extends number | undefined>
  = T extends 1 ? UploadRow | null : UploadRow[] | null

/**
 * 上传模式
 *  - 'avatar' → 头像模式（单文件、固定圆形/方形容器、通常只显示最后一张图）
 *  - 'list'   → 列表模式（可多文件，显示缩略图列表）
 *  - 'drag'   → 拖拽模式，支持拖拽，没有预览情况
 *  - 'button' → 按钮模式，只有一个上传按钮，没有预览情况
 */
export type UploadFileModel = 'avatar' | 'list' | 'drag' | 'button'

/**
 * 上传接口返回 data 中的文件对象
 */
export interface UploadFileResponseModel {
  /**
   * 文件访问地址
   */
  httpUrl?: string

  /**
   * 磁盘保存地址
   */
  save_path?: string

  /**
   * 前端自己根据 url 截取的文件名
   */
  _fileName?: string
}

/**
 * 预留扩展
 */
export type UploadFileResponseBaseModel = UploadFileResponseModel & Record<string, any>

export interface UploadRow {
  uid?: string
  /**
   * 文件上传的文件名 - 前端获取
   */
  name?: string
  /**
   * 文件扩展名 - 前端获取
   */
  type?: string
  /**
   * 文件大小 - 前端获取 MB
   */
  size?: string
  /**
   * 文件大小 - 前端获取 字节
   */
  sizeBytes?: number
  /**
   * 文件最后修改时间 - 前端获取
   */
  createdAt?: string
  /**
   * 上传进度百分比 0~100 - 前端获取
   */
  progress?: number
  /**
   * @deprecated  已废弃 请在response中获取
   */
  url?: string
  /**
   * 上传状态 - 前端获取
   */
  status?: UploadStatus
  message?: string
  response?: ResponseData<UploadFileResPhoneModel>
}

export interface UploadFileResPhoneModel {
  /**
   * 文件地址
   */
  httpUrl?: string
  /**
   * 磁盘保存地址
   */
  save_path?: string
  /**
   * 前端自己截取的文件名
   */
  _fileName?: string
}
