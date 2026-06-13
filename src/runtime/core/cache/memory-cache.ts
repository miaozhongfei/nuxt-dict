import type { CacheEntry } from '../../types'

/**
 * 内存缓存，支持 LRU 淘汰和 TTL 过期。
 * Map 保证插入顺序，借助 keys().next() 获取最久未使用项。
 */
export class MemoryCache<T = unknown> {
  private cache: Map<string, CacheEntry<T>>
  private maxSize: number
  /** 毫秒级 TTL，0 表示永不过期 */
  private ttl: number

  constructor(maxSize = 200, ttl = 0) {
    this.cache = new Map()
    this.maxSize = maxSize
    this.ttl = ttl
  }

  /** 读取缓存项，命中后移至末尾（LRU），TTL 过期则清除 */
  get(key: string): CacheEntry<T> | undefined {
    const entry = this.cache.get(key)
    if (!entry) return undefined

    if (this.ttl > 0 && Date.now() - entry.timestamp > this.ttl) {
      this.cache.delete(key)
      return undefined
    }

    this.cache.delete(key)
    this.cache.set(key, entry)
    return entry
  }

  /** 写入缓存项，超过 maxSize 时淘汰最旧条目 */
  set(key: string, entry: CacheEntry<T>): void {
    if (this.cache.has(key)) {
      this.cache.delete(key)
    } else {
      this.sweep()
      if (this.cache.size >= this.maxSize) {
        const firstKey = this.cache.keys().next().value
        if (firstKey !== undefined) {
          this.cache.delete(firstKey)
        }
      }
    }
    this.cache.set(key, entry)
  }

  has(key: string): boolean {
    const entry = this.cache.get(key)
    if (!entry) return false
    if (this.ttl > 0 && Date.now() - entry.timestamp > this.ttl) {
      this.cache.delete(key)
      return false
    }
    return true
  }

  delete(key: string): void {
    this.cache.delete(key)
  }

  clear(): void {
    this.cache.clear()
  }

  /** 按 key 前缀删除缓存项。用于按仓库名清除内存缓存（key 格式: `{storeName}:...`） */
  deleteByPrefix(prefix: string): void {
    for (const key of this.cache.keys()) {
      if (key.startsWith(prefix)) {
        this.cache.delete(key)
      }
    }
  }

  get size(): number {
    this.sweep()
    return this.cache.size
  }

  keys(): string[] {
    this.sweep()
    return Array.from(this.cache.keys())
  }

  /** 清除所有已过期的缓存项 */
  private sweep(): void {
    if (this.ttl <= 0) return
    const now = Date.now()
    for (const [key, entry] of this.cache) {
      if (now - entry.timestamp > this.ttl) {
        this.cache.delete(key)
      }
    }
  }
}
