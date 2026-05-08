export interface CacheTime {
  /** 天 */
  day?: number
  /** 小时 */
  hour?: number
  /** 分钟 */
  minutes?: number
  /** 秒 */
  second?: number
}

export interface CacheData {
  /** 实际缓存的数据 */
  value: any
  /** 过期时间戳，单位毫秒 */
  expires: number
}

/**
 * 缓存
 */
export class Cache<CacheType extends AnyObject> {
  packageName: string
  packageVersion: string
  /** 默认缓存 7 天 */
  defaultExpires = 864e5 * 7

  constructor(name: string, version: string) {
    this.packageName = name
    this.packageVersion = version
  }

  /**
   * 将缓存时长转换为毫秒。
   *
   * 传入 number 时直接按毫秒处理；传入对象时按 day/hour/minutes/second 累加。
   */
  formatTime(data: Partial<CacheTime> | number): number {
    if (typeof data == 'number')
      return data

    const { day, hour, minutes, second } = data
    const dataDay = (day ? day * 24 : 0) * 864e2// 秒
    const dataHours = (hour || 0) * 60 * 60// 秒
    const dataMinutes = (minutes || 0) * 60// 秒
    const dataSeconds = (second || 0) * 60// 秒
    return (dataDay + dataHours + dataMinutes + dataSeconds) * 1000
  }

  /**
   * 根据传入的缓存时长计算最终过期时间戳。
   *
   * time 为 -1 时会使用 Number.MAX_SAFE_INTEGER 作为缓存时长，
   * 生成一个极大的过期时间，业务上等价于永不过期。
   */
  getExpires(time?: Partial<CacheTime> | number): number {
    let expires = this.defaultExpires
    if (time === -1)
      expires = Number.MAX_SAFE_INTEGER

    else if (time)
      expires = this.formatTime(time)

    return new Date().getTime() + expires
  }

  get perfixKey() {
    return `${this.packageName}_${this.packageVersion}_`
  }

  stringifyJson<T = any>(data: T): string {
    try {
      return JSON.stringify(data)
    }
    catch (error) {
      throw new Error(error as any)
    }
  }

  parseJson(data: string): object {
    try {
      return JSON.parse(data)
    }
    catch (error) {
      throw new Error(error as any)
    }
  }

  /** 拼接带应用名和版本号前缀的真实缓存 key */
  getRealKey<K extends keyof CacheType>(key: K) {
    return `${this.perfixKey}${String(key)}`
  }

  /**
   * 写入缓存。
   *
   * @param key 缓存键，会自动加上 packageName/packageVersion 前缀
   * @param value 缓存值
   * @param options 缓存时长；传 -1 表示永不过期；不传则默认 7 天
   */
  set<K extends keyof CacheType>(key: K, value: CacheType[K], options = this.defaultExpires) {
    if (typeof localStorage === 'undefined')
      return
    const _key = this.getRealKey(key)
    const data = this.stringifyJson({
      value,
      expires: this.getExpires(options),
    })
    try {
      data && localStorage.setItem(_key, data)
    }
    // eslint-disable-next-line unused-imports/no-unused-vars
    catch (e) {
      // handle exceptions, possibly by removing older items
    }
  }

  /**
   * 读取缓存。
   *
   * 数据不存在或已经过期时返回 null；如果已过期，会同步删除该缓存项。
   */
  get<K extends keyof CacheType>(key: K) {
    if (typeof localStorage === 'undefined')
      return null
    const res = localStorage.getItem(this.getRealKey(key))
    if (!res)
      return null
    const { expires, value } = this.parseJson(res) as CacheData
    const now = Date.now()
    if (expires < now) {
      this.remove(key)
      return null
    }
    return value as CacheType[K]
  }

  /** 删除指定缓存项 */
  remove<K extends keyof CacheType>(key: K) {
    // uni.removeStorageSync(this.getRealKey(key) as string);
    localStorage.removeItem(this.getRealKey(key) as string)
  }

  /** 清空当前 packageName/packageVersion 命名空间下的所有缓存 */
  clear() {
    if (typeof localStorage === 'undefined')
      return
    const keysToDelete: string[] = []
    for (let i = 0, len = localStorage.length; i < len; i++) {
      const key = localStorage.key(i)
      if (key && key.startsWith(this.perfixKey))
        keysToDelete.push(key)
    }
    keysToDelete.forEach(key => localStorage.removeItem(key))
  }
}
