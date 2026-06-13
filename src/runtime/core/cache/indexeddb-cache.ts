import type { DictEntry, CacheEntry } from '../../types'

/** 默认 IndexedDB 对象存储库名称 */
export const DEFAULT_STORE_NAME = 'dicts'

/**
 * IndexedDB 缓存实现，用于持久化字典数据。
 * 支持客户端离线访问，减少重复网络请求。
 * 版本号改用 localStorage 存储，不再使用 IndexedDB。
 *
 * 多对象存储库支持：
 * - 默认存储库 `'dicts'` 在 init() 时创建
 * - 额外存储库通过 ensureStore() 惰性创建
 * - 使用串行升级队列处理并发多 store 创建，批量累积后一次升级完成
 */
export class IndexedDBCache {
  private dbName: string
  private db: IDBDatabase | null = null
  private version = 1
  /** 串行化升级队列，防止并发 ensureStore 导致多次版本升级 */
  private upgradeQueue: Promise<void> = Promise.resolve()
  /** 累积待创建的 store 名，批量创建以减少升级次数 */
  private pendingStores: Set<string> = new Set()

  constructor(dbName: string) {
    this.dbName = dbName
  }

  /** 初始化 IndexedDB，创建默认对象存储库 */
  init(): Promise<void> {
    if (this.db) return Promise.resolve()

    return new Promise((resolve, reject) => {
      // 不指定版本号以打开数据库当前版本，避免跨版本（version 增量升级后）的 VersionError
      const request = indexedDB.open(this.dbName)
      request.addEventListener('upgradeneeded', () => {
        const db = request.result
        if (!db.objectStoreNames.contains(DEFAULT_STORE_NAME)) {
          db.createObjectStore(DEFAULT_STORE_NAME)
        }
      })
      request.addEventListener('success', () => {
        this.db = request.result
        // 同步当前数据库实际版本号，供后续 ensureStore 升级使用
        this.version = this.db.version
        resolve()
      })
      request.addEventListener('error', () => {
        reject(new Error('Failed to open IndexedDB: ' + (request.error?.message || 'unknown error')))
      })
      request.addEventListener('blocked', () => {
        reject(new Error('IndexedDB is blocked by another tab'))
      })
    })
  }

  /**
   * 惰性确保指定名称的对象存储库存在。
   * 若当前 DB 中已有该 store 则立即返回；
   * 否则将 store 名加入待建集合，通过串行队列触发一次版本升级批量创建。
   */
  private async ensureStore(storeName: string): Promise<void> {
    // 尚未初始化则先初始化
    await this.init()

    if (this.db!.objectStoreNames.contains(storeName)) return

    this.pendingStores.add(storeName)

    this.upgradeQueue = this.upgradeQueue.then(() => this.doUpgrade())

    return this.upgradeQueue
  }

  /**
   * 执行一次版本升级，批量创建所有累积的待建 object store。
   * 内部注册 onversionchange 确保旧连接能被浏览器主动关闭，
   * blocked 事件不视为错误——旧连接释放后 success 事件会自动触发。
   */
  private async doUpgrade(): Promise<void> {
    if (this.pendingStores.size === 0) return

    const stores = new Set(this.pendingStores)
    this.pendingStores.clear()

    const toCreate = [...stores].filter((s) => !this.db!.objectStoreNames.contains(s))
    if (toCreate.length === 0) return

    this.db!.onversionchange = () => {
      this.db!.close()
    }
    this.db!.close()
    this.version++

    await new Promise<void>((resolve, reject) => {
      const req = indexedDB.open(this.dbName, this.version)
      req.addEventListener('upgradeneeded', () => {
        const db = req.result
        for (const name of toCreate) {
          if (!db.objectStoreNames.contains(name)) {
            db.createObjectStore(name)
          }
        }
      })
      req.addEventListener('success', () => {
        this.db = req.result
        resolve()
      })
      req.addEventListener('error', () => reject(req.error))
      // blocked 表示旧连接尚未完全释放（可能有未提交的事务），
      // 不视为错误——旧连接 onversionchange 关闭后升级会自动继续
      req.addEventListener('blocked', () => {})
    })
  }

  /** 生成存储键名：`{dictType}_{locale}` */
  private getStoreKey(dictType: string, locale: string): string {
    return `${dictType}_${locale}`
  }

  /** 从指定存储库读取字典缓存 */
  async get(storeName: string, dictType: string, locale: string): Promise<CacheEntry<DictEntry> | null> {
    if (!this.db) return null
    await this.ensureStore(storeName)
    if (!this.db) return null

    return new Promise((resolve, reject) => {
      const tx = this.db!.transaction(storeName, 'readonly')
      const store = tx.objectStore(storeName)
      const request = store.get(this.getStoreKey(dictType, locale))
      request.addEventListener('success', () => resolve(request.result ?? null))
      request.addEventListener('error', () => reject(request.error))
    })
  }

  /** 写入字典缓存条目到指定存储库 */
  async set(storeName: string, dictType: string, locale: string, entry: CacheEntry<DictEntry>): Promise<void> {
    if (!this.db) return
    await this.ensureStore(storeName)
    if (!this.db) return

    return new Promise((resolve, reject) => {
      const tx = this.db!.transaction(storeName, 'readwrite')
      const store = tx.objectStore(storeName)
      const request = store.put(entry, this.getStoreKey(dictType, locale))
      request.addEventListener('success', () => resolve())
      request.addEventListener('error', () => reject(request.error))
    })
  }

  /**
   * 清空字典缓存数据。
   * @param storeName 指定要清空的存储库名，不传则清空全部存储库
   */
  async clear(storeName?: string): Promise<void> {
    if (!this.db) return

    if (storeName) {
      if (!this.db!.objectStoreNames.contains(storeName)) return
      await new Promise<void>((resolve, reject) => {
        const tx = this.db!.transaction(storeName, 'readwrite')
        const store = tx.objectStore(storeName)
        const request = store.clear()
        request.addEventListener('success', () => resolve())
        request.addEventListener('error', () => reject(request.error))
      })
      return
    }

    const storeNames = Array.from(this.db!.objectStoreNames)
    for (const name of storeNames) {
      await new Promise<void>((resolve, reject) => {
        const tx = this.db!.transaction(name, 'readwrite')
        const store = tx.objectStore(name)
        const request = store.clear()
        request.addEventListener('success', () => resolve())
        request.addEventListener('error', () => reject(request.error))
      })
    }
  }
}
