import type { ShallowRef, Ref } from 'vue'

/** 仓库名字面量联合类型，由 addTypeTemplate 根据 stores 配置动态生成 */
import type { StoreKey } from '#build/types/nuxt-dict-store-names'
export type { StoreKey }

/** 字典项 */
export interface DictItem {
  value: string | number
  label: string
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

/** 字典适配器接口，允许用户自定义数据源（REST / GraphQL / 本地文件等） */
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

/** translate / translatePath 使用的选项 */
export interface TranslateOptions {
  /** 仓库名，默认 'dicts' */
  storeName?: StoreKey
  /** 取值字段名，默认 'label' */
  field?: string
}

/** translatePath 使用的选项，在 TranslateOptions 基础上增加 separator */
export interface TranslatePathOptions extends TranslateOptions {
  /** 层级路径分隔符，默认 ' / ' */
  separator?: string
}

/** useDict 返回类型 */
export interface UseDictReturn {
  data: ShallowRef<DictItem[] | null>
  translate: (value: string | number, opts?: TranslateOptions) => string
  loading: Ref<boolean>
  error: Ref<string | null>
  refresh: () => Promise<void>
}

/** $dict 翻译器对象类型，暴露 translate / translatePath 两个翻译方法。
 * 仓库名统一通过 opts.storeName 指定，不接受首参为 storeName 的旧式写法。 */
export interface DictTranslator {
  translate(type: string, code: string | number, opts?: TranslateOptions): string
  translatePath(type: string, code: string | number, opts?: TranslatePathOptions): string
}

/** useDictTree 返回类型 */
export interface UseDictTreeReturn {
  tree: ShallowRef<TreeNode[] | null>
  translate: (value: string | number, opts?: TranslateOptions) => string
  findPath: (value: string | number) => string[]
  loading: Ref<boolean>
  refresh: () => Promise<void>
}
