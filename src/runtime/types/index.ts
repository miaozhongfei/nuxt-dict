import type { ShallowRef, Ref } from 'vue'

/** 仓库名字面量联合类型，由 addTypeTemplate 根据 stores 配置动态生成 */
import type { StoreKey } from '#build/types/nuxt-dict-store-names'
export type { StoreKey }

/**
 * 字典项，表示字典中单个编码与其显示文本的映射关系。
 *
 * @description 扁平字典的最小数据单元。每个 DictItem 包含一个编码值（value）
 * 和对应的显示文本（label），并可携带任意扩展字段（如 color、icon 等）。
 * 用于 useDict 返回的 data、$dict.getDictItem 的返回值等场景。
 * 
 * @property {string | number} value - 字典编码值，支持字符串和数字类型，用于匹配业务数据中的 code
 * @property {string} label - 编码对应的显示文本（翻译后的文字）
 *
 * @example
 * // 基础条目
 * { value: 'male', label: '男' }
 * { value: 1, label: '启用', color: '#67C23A' }
 *
 * @example
 * // 通过 $dict.getDictItem 获取完整对象
 * import type { DictItem } from '@lacqjs/nuxt-dict'
 * const item:DictItem = $dict.getDictItem('gender', 'male')
 * // item.value → 'male', item.label → '男'
 */
export interface DictItem {
  /** 字典编码值，支持字符串和数字类型 */
  value: string | number
  /** 编码对应的显示文本 */
  label: string
  /** 允许携带任意扩展字段（如 color、icon 等） */
  [key: string]: unknown
}

/** 树形字典节点，用于级联选择器 */
export interface TreeNode extends DictItem {
  children?: TreeNode[]
}

/** 单个字典类型的数据结构 */
export interface DictEntry {
  type: string
  items: DictItem[]
  tree?: TreeNode[]
}

/** API 返回的字典响应格式 */
export interface DictResponse {
  version: string
  data: Record<string, DictEntry>
}

/** IndexedDB 中存储的缓存条目 */
export interface CacheEntry<T = DictEntry> {
  data: T
  timestamp: number
  version: string
}

/**
 * 字典适配器接口，允许用户自定义数据源（REST / GraphQL / 本地文件等）。
 *
 * @example
 * // 自定义适配器示例
 * const customAdapter: DictAdapter = {
 *   fetchDict: async (storeName, { types, locale }) => {
 *     const res = await fetch(`/api/${storeName}/dict?types=${types.join(',')}&lang=${locale}`)
 *     return res.json()
 *   },
 *   fetchVersion: async (storeName) => {
 *     const res = await fetch(`/api/${storeName}/dict/version`)
 *     const data = await res.json()
 *     return data.version
 *   },
 * }
 */
export interface DictAdapter {
  fetchDict(storeName: string, options: { types: string[]; locale: string }): Promise<DictResponse>
  fetchVersion(storeName: string): Promise<string>
}

/** 语言来源类型 */
export type LocaleSource = 'cookie' | 'header' | 'query'

/** 单个仓库的 API 配置。未配置项从全局 `api` 继承。 */
export interface StoreApiOptions {
  /** API 基础地址，默认继承全局 `api.baseURL` */
  baseURL?: string
  /** 字典列表接口路径，默认继承全局 `api.dictEndpoint` */
  dictEndpoint?: string
  /** 版本号接口路径，默认继承全局 `api.versionEndpoint` */
  versionEndpoint?: string
  /** 自定义字典适配器，不传则使用默认 REST 适配器（继承全局 api 配置） */
  adapter?: DictAdapter
}

/** 模块配置项（用户可传，字段均可选） */
export interface ModuleOptions {
  /** 是否启用字典模块，默认 `true` */
  enable?: boolean
  /** 日志级别，0=静默, 1=错误, 2=警告, 3=信息, 4=调试, 5=详细，默认 `3` */
  logLevel?: number
  api?: {
    /** API 基础地址，支持绝对 URL（外部接口）或相对路径（本地接口），默认 `'/api'` */
    baseURL?: string
    /** 字典列表接口路径，默认 `'/dict/list'` */
    dictEndpoint?: string
    /** 版本号接口路径，默认 `'/dict/version'` */
    versionEndpoint?: string
    /** 自定义字典适配器，不传则使用默认 REST 适配器 */
    adapter?: DictAdapter
  }
  cache?: {
    /** 内存缓存最大条目数，默认 `200` */
    memoryMax?: number
    /** 内存缓存 TTL（毫秒），`0` 表示永不过期，默认 `0` */
    ttl?: number
    indexedDB?: {
      /** 是否启用 IndexedDB 持久缓存，默认 `true` */
      enabled?: boolean
      /** IndexedDB 数据库名称，默认 `'nuxt-dict'` */
      dbName?: string
    }
  }
  locale?: {
    /** 兜底语言，无法从指定来源检测到语言时使用，默认 `'zh-CN'` */
    default?: string
    /** 语言检测来源，`'cookie'` / `'header'` / `'query'`，默认 `'cookie'` */
    source?: LocaleSource
    /** `source` 为 `'cookie'` 时读取的 cookie 名称，默认 `'lang'` */
    cookieKey?: string
    /** `source` 为 `'query'` 时读取的 URL 查询参数名，默认 `'lang'` */
    queryKey?: string
    /** `source` 为 `'header'` 时读取的请求头名称，默认 `'accept-language'` */
    headerKey?: string
    /** 发给字典 API 时，语言值的查询参数名，设为 `''` 则不传，默认 `'lang'` */
    paramKey?: string
    /** 发给字典 API 时，语言值的请求头名，设为 `''` 则不传，默认 `'X-Locale'` */
    apiHeaderKey?: string
  }
  /** 仓库 API 配置映射。key 为仓库名，value 为该仓库的 API 端点配置。
   * 未配置的字段从全局 `api` 继承。未在此列出的仓库使用全局 `api` 配置。
   * @example { payment: { baseURL: 'https://pay-api.com' }, logistics: { dictEndpoint: '/logistics/list' } }
   */
  stores?: Record<string, StoreApiOptions>
  ssr?: {
    /** 服务端预取的字典类型列表，加速首屏渲染 */
    prefetch?: string[]
  }
  version?: {
    /** localStorage 中存储版本号的 key，默认 `'__NUXT_DICT_VERSION__'` */
    storageKey?: string
  }
}

/** 模块配置项（内部解析后，字段均必填） */
export interface ResolvedModuleOptions {
  enable: boolean
  logLevel: number
  api: {
    baseURL: string
    dictEndpoint: string
    versionEndpoint: string
    adapter?: DictAdapter
  }
  cache: {
    memoryMax: number
    ttl: number
    indexedDB: {
      enabled: boolean
      dbName: string
    }
  }
  locale: {
    default: string
    source: LocaleSource
    cookieKey: string
    queryKey: string
    headerKey: string
    paramKey: string
    apiHeaderKey: string
  }
  /** 仓库 API 配置映射（解析后） */
  stores: Record<string, StoreApiOptions>
  ssr: {
    prefetch: string[]
  }
  version: {
    storageKey: string
  }
}

/**
 * translate / translatePath 使用的选项。
 *
 * @example
 * // 默认仓库，取 label
 * translate('gender', 'male')
 * // 指定仓库
 * translate('gender', 'male', { storeName: 'dicts2' })
 * // 取自定义字段
 * translate('status', 1, { field: 'color' })
 */
export interface TranslateOptions {
  /** 仓库名，默认 'dicts' */
  storeName?: StoreKey
  /** 取值字段名，默认 'label' */
  field?: string
}

/**
 * translatePath 使用的选项，在 TranslateOptions 基础上增加 separator。
 *
 * @example
 * // 默认仓库，默认分隔符 ' / '
 * translatePath('region', '440104')
 * // 自定义分隔符
 * translatePath('region', '440104', { separator: ' → ' })
 * // 指定仓库 + 自定义字段 + 自定义分隔符
 * translatePath('region', '440104', { storeName: 'dicts2', field: 'value', separator: ' → ' })
 */
export interface TranslatePathOptions extends TranslateOptions {
  /** 层级路径分隔符，默认 ' / ' */
  separator?: string
}

/**
 * getDictItem 使用的选项。与 translate 参数一致，但不含 field（返回整个对象）。
 *
 * @example
 * // 默认仓库
 * getDictItem('gender', 'male')
 * // 指定仓库
 * getDictItem('gender', 'male', { storeName: 'dicts2' })
 */
export interface GetDictItemOptions {
  /** 仓库名，默认 'dicts' */
  storeName?: StoreKey
}

/**
 * useDict 返回类型。
 *
 * @description useDict 调用后返回的对象，包含字典数据、翻译函数、状态管理和刷新能力。
 * 组件挂载时自动加载数据，卸载时自动清理。支持语言切换后自动重取。
 *
 * @property {ShallowRef<DictItem[] | null>} data - 字典原始数据数组。初始为 null，加载完成后为 [{ value, label, ... }]
 * @property {(value: string | number, opts?: TranslateOptions) => string} translate - 同步翻译函数，默认从 data ref 查找 code → label（响应式），未命中返回 code 原文
 * @property {(value: string | number, opts?: GetDictItemOptions) => DictItem | undefined} getDictItem - 同步获取完整字典项对象，缓存未命中返回 undefined
 * @property {Ref<boolean>} loading - 是否正在加载字典数据
 * @property {Ref<string | null>} error - 加载失败时的错误信息，正常时为 null
 * @property {() => Promise<void>} refresh - 强制刷新，跳过缓存直接从网络获取最新数据
 *
 * @example
 * const { data, translate, loading, refresh } = useDict('gender')
 * const { data, translate } = useDict('dicts2', 'gender')
 */
export interface UseDictReturn {
  /** 字典原始数据数组。初始为 null，加载完成后为 [{ value, label, ... }] */
  data: ShallowRef<DictItem[] | null>

  /**
   * 同步翻译编码 → 文本，默认从 data ref（shallowRef）查找，Vue 响应式系统可追踪。
   *
   * @description 从当前 useDict 的 data ref 中查找编码对应的翻译文本。
   * 同步执行，不发起网络请求。可放在 computed 中使用。
   * @param {string | number} value - 字典编码值
   * @param {TranslateOptions} [opts] - 可选配置
   * @param {StoreKey} [opts.storeName] - 仓库名。同仓库从 data ref 读取（响应式），跨仓库回退 manager 内存缓存
   * @param {string} [opts.field] - 取值字段名，默认 'label'
   * @returns {string} 翻译后的文本，缓存未命中时返回 value 的字符串形式
   *
   * @example
   * const { translate } = useDict('gender')
   * translate('male')              // → '男'
   * translate(1, { field: 'color' }) // 取自定义字段
   */
  translate: (value: string | number, opts?: TranslateOptions) => string

  /**
   * 同步获取完整字典项对象，默认从 data ref（shallowRef）中查找，Vue 响应式系统可追踪。
   *
   * @description 与 translate 参数一致，但返回整个 DictItem 对象而非提取字符串字段。
   * 可获取 value、label、以及 color 等扩展属性。可放在 computed 中使用。
   * @param {string | number} value - 字典编码值
   * @param {GetDictItemOptions} [opts] - 可选配置
   * @param {StoreKey} [opts.storeName] - 目标仓库名。同仓库从 data ref 读取（响应式），跨仓库回退 manager 内存缓存
   * @returns {DictItem | undefined} 完整的字典项对象，缓存未命中时返回 undefined
   *
   * @example
   * const { getDictItem } = useDict('status')
   * const item = computed(() => getDictItem(1))  // 响应式 ✅
   * // → { value: 1, label: '启用', color: '#67C23A' }
   */
  getDictItem: (value: string | number, opts?: GetDictItemOptions) => DictItem | undefined

  /** 是否正在加载字典数据 */
  loading: Ref<boolean>
  /** 加载失败时的错误信息，正常时为 null */
  error: Ref<string | null>

  /**
   * 强制刷新字典数据。
   *
   * @description 跳过内存缓存和 IndexedDB，直接从网络获取最新数据并更新缓存。
   * 适用于后端通知字典更新后手动触发。
   * @returns {Promise<void>}
   *
   * @example
   * const { refresh } = useDict('gender')
   * await refresh()  // 强制重新拉取最新数据
   */
  refresh: () => Promise<void>
}

/**
 * $dict 翻译器对象类型，暴露同步翻译和批量翻译方法。
 *
 * @description 注入到 NuxtApp 和 Vue 组件的全局翻译器，从内存缓存中查找已加载的字典数据。
 * 仓库名统一通过 opts.storeName 或 mapping 中指定，不接受首参为 storeName 的旧式写法。
 *
 * @property {(type: string, code: string | number, opts?: TranslateOptions) => string} translate - 同步翻译编码 → 文本，未命中返回 code 原文
 * @property {(type: string, code: string | number, opts?: TranslatePathOptions) => string} translatePath - 树形字典编码 → 层级路径，用分隔符拼接
 * @property {(data, mapping, suffix?) => Record<string, unknown>} translateData - 批量翻译对象中的多个编码字段，返回追加了翻译字段的新对象
 * @property {(type: string, code: string | number, opts?: GetDictItemOptions) => DictItem | undefined} getDictItem - 获取完整字典项对象，缓存未命中返回 undefined
 *
 * @example
 * $dict.translate('gender', 'male')
 * $dict.translate('gender', 'male', { storeName: 'dicts2' })
 * $dict.translatePath('region', '440104', { separator: ' → ' })
 * $dict.translateData({ gender: 'male', status: 1 }, { gender: 'gender', status: 'status' })
 * $dict.getDictItem('gender', 'male')
 */
export interface DictTranslator {
  /**
   * 同步翻译编码 → 文本，从内存缓存查找。
   *
   * @description 从全局内存缓存中查找编码对应的翻译文本。需先通过 useDict 加载数据后调用。
   * @param {string} type - 字典类型名，如 'gender'、'status'
   * @param {string | number} code - 字典编码值
   * @param {TranslateOptions} [opts] - 可选配置
   * @param {StoreKey} [opts.storeName] - 仓库名，默认 'dicts'
   * @param {string} [opts.field] - 取值字段名，默认 'label'
   * @returns {string} 翻译后的文本，缓存未命中时返回 code 的字符串形式
   *
   * @example
   * $dict.translate('gender', 'male')
   * $dict.translate('gender', 'male', { storeName: 'dicts2' })
   * $dict.translate('status', 1, { field: 'color' })
   */
  translate(type: string, code: string | number, opts?: TranslateOptions): string

  /**
   * 树形字典编码 → 层级路径，从内存缓存查找。
   *
   * @description 从已加载的树形字典数据中通过 DFS 查找目标编码并回溯完整路径，用分隔符拼接。
   * @param {string} type - 树形字典类型名，如 'region'
   * @param {string | number} code - 叶子节点编码值
   * @param {TranslatePathOptions} [opts] - 可选配置
   * @param {StoreKey} [opts.storeName] - 仓库名，默认 'dicts'
   * @param {string} [opts.field] - 节点取值字段名，默认 'label'
   * @param {string} [opts.separator] - 层级分隔符，默认 ' / '
   * @returns {string} 用分隔符连接的完整层级路径，缓存未命中时返回 code 的字符串形式
   *
   * @example
   * $dict.translatePath('region', '440104')
   * $dict.translatePath('region', '440104', { separator: ' → ' })
   */
  translatePath(type: string, code: string | number, opts?: TranslatePathOptions): string

  /**
   * 批量翻译数据对象中的多个编码字段。
   *
   * @description 传入一个数据对象和字段 → 字典类型映射表，返回追加了翻译字段的新对象（不修改原对象）。
   * @param {Record<string, unknown>} data - 需要翻译的数据对象，如 { gender: 'male', status: 1 }
   * @param {Record<string, string | { type: string; storeName?: StoreKey }>} mapping - 字段映射表。key 为原字段名，value 为字典类型 string（默认仓库）或 { type, storeName? } 对象（指定仓库）
   * @param {string} [suffix='_label'] - 翻译字段的后缀，如 '_label' → gender_label
   * @returns {Record<string, unknown>} 新对象，包含原数据所有字段 + 追加的翻译字段
   *
   * @example
   * $dict.translateData(
   *   { gender: 'male', status: 1 },
   *   { gender: 'gender', status: 'status' }
   * )
   * // → { gender: 'male', gender_label: '男', status: 1, status_label: '启用' }
   */
  translateData(data: Record<string, unknown>, mapping: Record<string, string | { type: string; storeName?: StoreKey }>, suffix?: string): Record<string, unknown>

  /**
   * 同步获取完整字典项对象，从内存缓存查找。
   *
   * @description 与 translate 参数一致，但返回整个 DictItem 对象而非提取字符串字段。
   * 可获取 value、label、以及 color 等扩展属性。
   * @param {string} type - 字典类型名，如 'gender'、'status'
   * @param {string | number} code - 字典编码值
   * @param {GetDictItemOptions} [opts] - 可选配置
   * @param {StoreKey} [opts.storeName] - 仓库名，默认 'dicts'
   * @returns {DictItem | undefined} 完整的字典项对象，缓存未命中时返回 undefined
   *
   * @example
   * $dict.getDictItem('gender', 'male')
   * // → { value: 'male', label: '男' }
   * $dict.getDictItem('status', 1, { storeName: 'dicts2' })
   * // → { value: 1, label: '启用', color: '#67C23A' }
   */
  getDictItem(type: string, code: string | number, opts?: GetDictItemOptions): DictItem | undefined
}

/**
 * useDictTree 返回类型。
 *
 * @description useDictTree 调用后返回的对象，包含树形字典数据、翻译函数、路径回溯和刷新能力。
 * 适用于级联选择器等需要层级数据的场景。支持语言切换后自动重取。
 *
 * @property {ShallowRef<TreeNode[] | null>} tree - 树形字典节点数组。初始为 null，加载完成后为完整树结构
 * @property {(value: string | number, opts?: TranslateOptions) => string} translate - 同步翻译树中任意节点的 value → label，默认从 tree ref 查找（响应式）
 * @property {(value: string | number) => string[]} findPath - 查找叶子节点的完整层级路径，从 tree ref 查找（响应式），如 code=440104 → ['广东', '广州', '越秀区']
 * @property {Ref<boolean>} loading - 是否正在加载树形字典数据
 * @property {() => Promise<void>} refresh - 强制刷新，跳过缓存直接从网络获取最新数据
 *
 * @example
 * const { tree, translate, findPath, loading, refresh } = useDictTree('region')
 * const { tree, translate } = useDictTree('dicts2', 'region')
 */
export interface UseDictTreeReturn {
  /** 树形字典节点数组。初始为 null，加载完成后为完整树结构 */
  tree: ShallowRef<TreeNode[] | null>

  /**
   * 同步翻译树中任意节点的 value → label，默认从 tree ref（shallowRef）递归查找。
   *
   * @description 从当前 useDictTree 的 tree ref 中递归查找节点编码对应的翻译文本，
   * Vue 响应式系统可追踪，可直接放在 computed 中使用。跨仓库时回退 manager 内存缓存。
   * @param {string | number} value - 节点编码值
   * @param {TranslateOptions} [opts] - 可选配置
   * @param {StoreKey} [opts.storeName] - 仓库名。同仓库从 tree ref 读取（响应式），跨仓库回退 manager
   * @param {string} [opts.field] - 取值字段名，默认 'label'
   * @returns {string} 翻译后的文本，缓存未命中时返回 value 的字符串形式
   *
   * @example
   * const { translate } = useDictTree('region')
   * translate('440104')  // → '越秀区'
   */
  translate: (value: string | number, opts?: TranslateOptions) => string

  /**
   * 查找叶子节点的完整层级路径，从 tree ref（shallowRef）查找，已为响应式。
   *
   * @description 在已加载的树形字典数据（tree ref）中递归查找目标编码，回溯从根到叶的完整路径。
   * Vue 响应式系统可追踪，可直接放在 computed 中使用。
   * @param {string | number} value - 叶子节点编码值
   * @returns {string[]} 从根到叶的 label 数组，如 ['广东', '广州', '越秀区']，未找到返回空数组
   *
   * @example
   * const { findPath } = useDictTree('region')
   * findPath('440104')  // → ['广东', '广州', '越秀区']
   */
  findPath: (value: string | number) => string[]

  /** 是否正在加载树形字典数据 */
  loading: Ref<boolean>

  /**
   * 强制刷新树形字典数据。
   *
   * @description 跳过内存缓存和 IndexedDB，直接从网络获取最新树形数据并更新缓存。
   * @returns {Promise<void>}
   *
   * @example
   * const { refresh } = useDictTree('region')
   * await refresh()  // 强制重新拉取最新数据
   */
  refresh: () => Promise<void>
}
