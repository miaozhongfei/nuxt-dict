// eslint-disable max-lines
import { shallowRef } from 'vue'
import { MemoryCache } from './cache/memory-cache'
import { IndexedDBCache, DEFAULT_STORE_NAME } from './cache/indexeddb-cache'
import { VersionCheck } from './cache/version-check'
import type { DictAdapter, DictEntry, DictItem, TreeNode, CacheEntry, TranslateOptions, TranslatePathOptions, GetDictItemOptions } from '../types'

/**
 * DictManager 构造参数。
 *
 * @example
 * const manager = new DictManager({
 *   adapters: new Map([['dicts', createDefaultAdapter({ ... })]),
 *   indexedDB: new IndexedDBCache('nuxt-dict'),
 *   memoryMax: 200,
 *   ttl: 0,
 *   versionStorageKey: '__NUXT_DICT_VERSION__',
 * })
 */
export interface DictManagerOptions {
  /** 仓库名 → DictAdapter 映射表。至少包含默认仓库 'dicts' 的 adapter */
  adapters: Map<string, DictAdapter>
  indexedDB: IndexedDBCache
  memoryMax: number
  ttl: number
  /** localStorage 中存储版本号的 key */
  versionStorageKey: string
}

/**
 * 字典管理器 —— 核心调度层。
 *
 * 缓存策略：内存缓存 → IndexedDB 持久缓存 → 网络请求
 * 请求去重：对同一 key 的并发请求合并为单次网络调用（pendingRequests）
 *
 * @example
 * // 通常由插件自动创建，无需手动实例化
 * // 在组件中通过 useNuxtApp().$dictManager 访问
 * const { $dictManager: manager } = useNuxtApp()
 * const entry = await manager.getDict('gender')
 * const label = manager.translate('gender', 'male')
 */
export class DictManager {
  private memoryCache: MemoryCache<DictEntry>
  private indexedDB: IndexedDBCache
  private adapters: Map<string, DictAdapter>
  /** 每个仓库独立的版本检查器 */
  private versionChecks: Map<string, VersionCheck>
  /** 正在进行的字典请求，用于去重 */
  private pendingRequests: Map<string, Promise<DictEntry>>
  /** 已完成版本检查的仓库集合 */
  private checkedStores = new Set<string>()
  /** 正在进行的版本检查请求，用于去重 */
  private pendingVersionChecks = new Map<string, Promise<void>>()
  locale = shallowRef<string>('zh-CN')


  constructor(options: DictManagerOptions) {
    this.memoryCache = new MemoryCache<DictEntry>(options.memoryMax, options.ttl)
    this.indexedDB = options.indexedDB
    this.adapters = options.adapters
    this.pendingRequests = new Map()
    // 为每个 adapter 创建独立的版本检查器，默认仓库复用原始 key 保证兼容
    this.versionChecks = new Map()
    for (const [storeName, adapter] of options.adapters) {
      const storageKey = storeName === DEFAULT_STORE_NAME
        ? options.versionStorageKey
        : `${options.versionStorageKey}__${storeName}`
      this.versionChecks.set(storeName, new VersionCheck(adapter, storageKey))
    }
  }

  /** 构建带存储库命名空间和语言后缀的缓存键 */
  private buildKey(dictType: string, storeName: string): string {
    return `${storeName}:${dictType}_${this.locale.value}`
  }

  /** 根据 storeName 获取对应的 adapter。找不到时回退到默认仓库 'dicts' 的 adapter */
  private getAdapter(storeName: string): DictAdapter {
    return this.adapters.get(storeName) ?? this.adapters.get(DEFAULT_STORE_NAME)!
  }

  /**
   * 切换语言，清空内存缓存和待处理请求。
   * 语言变更后所有 useDict / useDictTree 组件通过 watch 自动重取数据。
   *
   * @param {string} locale - 目标语言代码，如 'zh-CN'、'en-US'
   */
  setLocale(locale: string): void {
    if (this.locale.value !== locale) {
      this.locale.value = locale
      this.memoryCache.clear()
      this.pendingRequests.clear()
    }
  }

  /**
   * 获取当前语言。
   *
   * @returns {string} 当前语言代码，如 'zh-CN'
   */
  getLocale(): string {
    return this.locale.value
  }

  /**
   * 惰性版本检查：首次访问该仓库时检查版本变更，按需清理缓存。
   * 并发调用去重 —— 同一仓库的多个 getDict 共享单次版本检查。
   */
  private async ensureVersionChecked(storeName: string): Promise<void> {
    if (this.checkedStores.has(storeName)) return

    const pending = this.pendingVersionChecks.get(storeName)
    if (pending) {
      await pending
      return
    }

    const promise = this.versionChecks.get(storeName)
      ? (async () => {
          const vc = this.versionChecks.get(storeName)!
          try {
            if (typeof localStorage !== 'undefined') {
              const { changed } = await vc.check(storeName)
              if (changed) {
                await this.invalidateAll(storeName)
              }
            }
          } catch {
            // 版本检查失败不阻塞字典获取
          }
        })()
      : Promise.resolve()

    this.pendingVersionChecks.set(storeName, promise)
    this.checkedStores.add(storeName)

    try {
      await promise
    } finally {
      this.pendingVersionChecks.delete(storeName)
    }
  }

  /**
   * 获取字典数据。
   * 优先级：内存缓存 → 合并中的请求 → IndexedDB → 网络请求
   *
   * @param {string} type - 字典类型名，如 'gender'
   * @param {string} storeName - 仓库名，默认 'dicts'
   * @returns {Promise<DictEntry>} 包含 items 和可选 tree 的字典条目
   */
  async getDict(type: string, storeName = DEFAULT_STORE_NAME): Promise<DictEntry> {
    // 惰性版本检查：首次访问该仓库时检查版本并失效过期缓存
    await this.ensureVersionChecked(storeName)

    const key = this.buildKey(type, storeName)

    // 一级：内存缓存命中
    const memoryEntry = this.memoryCache.get(key)
    if (memoryEntry) {
      return memoryEntry.data
    }

    // 二级：请求去重 —— 同 key 并发调用共享同一 Promise
    const pending = this.pendingRequests.get(key)
    if (pending) {
      return pending
    }

    const promise = this.fetchAndCache(type, storeName, key)
    this.pendingRequests.set(key, promise)

    try {
      return await promise
    } finally {
      this.pendingRequests.delete(key)
    }
  }

  /** 执行实际的数据获取与缓存写入 */
  private async fetchAndCache(type: string, storeName: string, key: string): Promise<DictEntry> {
    // 优先读 IndexedDB 持久缓存
    const idbEntry = await this.indexedDB.get(storeName, type, this.locale.value)
    if (idbEntry) {
      this.memoryCache.set(key, {
        data: idbEntry.data,
        timestamp: Date.now(),
        version: idbEntry.version,
      })
      return idbEntry.data
    }

    // 回退到网络请求
    const adapter = this.getAdapter(storeName)
    const response = await adapter.fetchDict(storeName, {
      types: [type],
      locale: this.locale.value,
    })

    const entry = response.data[type]
    if (!entry) {
      throw new Error(`Dictionary type "${type}" not found in response`)
    }

    const cacheEntry: CacheEntry<DictEntry> = {
      data: entry,
      timestamp: Date.now(),
      version: response.version,
    }

    // 同时写入两级缓存（IndexedDB 写入失败不影响数据返回）
    this.memoryCache.set(key, cacheEntry)
    try {
      await this.indexedDB.set(storeName, type, this.locale.value, cacheEntry)
    } catch {
      // IndexedDB 写入可能在版本升级期间失败，不抛异常
    }

    return entry
  }

  /**
   * 强制刷新指定字典：跳过缓存，直接从网络获取最新数据。
   * 适用于用户手动刷新、数据变更通知等场景。
   *
   * @param {string} type - 字典类型名，如 'gender'
   * @param {string} storeName - 仓库名，默认 'dicts'
   * @returns {Promise<DictEntry>} 最新的字典条目
   */
  async refresh(type: string, storeName = DEFAULT_STORE_NAME): Promise<DictEntry> {
    const key = this.buildKey(type, storeName)
    this.memoryCache.delete(key)
    this.pendingRequests.delete(key)

    const adapter = this.getAdapter(storeName)
    const response = await adapter.fetchDict(storeName, {
      types: [type],
      locale: this.locale.value,
    })

    const entry = response.data[type]
    if (!entry) {
      throw new Error(`Dictionary type "${type}" not found in response`)
    }

    const cacheEntry: CacheEntry<DictEntry> = {
      data: entry,
      timestamp: Date.now(),
      version: response.version,
    }

    this.memoryCache.set(key, cacheEntry)
    try {
      await this.indexedDB.set(storeName, type, this.locale.value, cacheEntry)
    } catch {
      // IndexedDB 写入可能在版本升级期间失败，不抛异常
    }

    return entry
  }

  /**
   * 同步翻译 value → label，未命中缓存时回退原样返回。
   *
   * @param {string} type - 字典类型名，如 'gender'
   * @param {string | number} value - 字典编码值
   * @param {TranslateOptions} opts - 可选配置（storeName 指定仓库，field 指定取值字段，默认 'label'）
   * @returns {string} 翻译后的文本，缓存未命中时返回 value 的字符串形式
   */
  translate(type: string, value: string | number, opts?: TranslateOptions): string {
    const storeName = opts?.storeName ?? DEFAULT_STORE_NAME
    const field = opts?.field ?? 'label'
    const key = this.buildKey(type, storeName)
    const entry = this.memoryCache.get(key)
    if (!entry) return String(value)

    const item = entry.data.items.find((i: DictItem) => this.codeMatch(i.value, value))
    if (!item) return String(value)
    return (item[field] as string | undefined) ?? item.label
  }

  /**
   * 从内存缓存中查找编码对应的完整字典项对象。
   * 参数与 translate 一致，但返回整个 DictItem 而非提取字段。
   *
   * @param {string} type - 字典类型名，如 'gender'
   * @param {string | number} value - 字典编码值
   * @param {GetDictItemOptions} opts - 可选配置（storeName 指定仓库）
   * @returns {DictItem | undefined} 完整的字典项对象，缓存未命中时返回 undefined
   */
  getDictItem(type: string, value: string | number, opts?: GetDictItemOptions): DictItem | undefined {
    const storeName = opts?.storeName ?? DEFAULT_STORE_NAME
    const key = this.buildKey(type, storeName)
    const entry = this.memoryCache.get(key)
    if (!entry) return undefined

    return entry.data.items.find((i: DictItem) => this.codeMatch(i.value, value))
  }

  /**
   * 树形字典中查找 value 的完整层级路径。
   *
   * @param {string} type - 字典类型名，如 'region'
   * @param {string | number} value - 叶子节点编码值
   * @param {TranslatePathOptions} opts - 可选配置（storeName 指定仓库，field 指定取值字段，separator 指定分隔符，默认 ' / '）
   * @returns {string} 用分隔符连接的完整层级路径，未命中时返回 value 字符串
   */
  translatePath(type: string, value: string | number, opts?: TranslatePathOptions): string {
    const storeName = opts?.storeName ?? DEFAULT_STORE_NAME
    const field = opts?.field ?? 'label'
    const separator = opts?.separator ?? ' / '
    const key = this.buildKey(type, storeName)
    const entry = this.memoryCache.get(key)
    if (!entry || !entry.data.tree) return String(value)

    const path = this.findPathInTree(entry.data.tree, value, field)
    return path.length > 0 ? path.join(separator) : String(value)
  }

  /** DFS 在树形字典中查找目标编码的路径，每节点取指定字段 */
  private findPathInTree(nodes: TreeNode[], targetCode: string | number, field: string): string[] {
    for (const node of nodes) {
      if (this.codeMatch(node.value, targetCode)) {
        return [(node[field] as string | undefined) ?? node.label]
      }
      if (node.children && node.children.length > 0) {
        const childPath = this.findPathInTree(node.children, targetCode, field)
        if (childPath.length > 0) {
          return [(node[field] as string | undefined) ?? node.label, ...childPath]
        }
      }
    }
    return []
  }

  /**
   * code 比对 —— 统一转字符串比较。
   * 避免字典配置中数字/字符串编码不一致导致的匹配失败。
   */
  private codeMatch(a: string | number, b: string | number): boolean {
    return String(a) === String(b)
  }

  /**
   * 初始化管理器。
   * 版本检查已改为惰性执行，在首次 getDict() 调用时触发，避免全量串行请求。
   *
   * @returns {Promise<void>}
   */
  async initialize(): Promise<void> {
    // no-op: 版本检查移至首次 getDict() 调用时惰性执行，避免全量串行请求
  }

  /**
   * 失效缓存数据。
   *
   * @param {string} storeName - 指定要失效的仓库，不传则清空所有仓库及内存缓存
   * @returns {Promise<void>}
   */
  async invalidateAll(storeName?: string): Promise<void> {
    if (storeName) {
      // 按仓库名前缀清除内存缓存（key 格式: `{storeName}:...`）
      this.memoryCache.deleteByPrefix(`${storeName}:`)
    } else {
      this.memoryCache.clear()
    }
    this.pendingRequests.clear()
    await this.indexedDB.clear(storeName)
  }
}
