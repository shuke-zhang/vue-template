import type { AxiosRequestConfig } from 'axios';

export interface UserCustomConfig {
  /**
   * 是否携带token
   */
  withToken?: boolean
  /**
   * 是否携带时间戳
   */
  joinTime?: boolean
  /**
   * 是否取消重复请求
   */
  ignoreRepeatRequest?: boolean
  /**
   *  token 键名
   */
  tokenKey?: string
  /**
   * token 键值
   */
  tokenKeyScheme?: string
  /**
   * 是否开启响应错误提示
   */
  showMessageError?: boolean
  /**
   * 是否打开接口请求失败时错误提示
   */
  showErrorMsg?: boolean
}

export interface Canceler {
  (message?: string, config?: AxiosRequestConfig, request?: any): void
}

export type ResponseResult<T extends object = object> = {
  code: number
  status: number
  msg: string
  message: string
} & T;
