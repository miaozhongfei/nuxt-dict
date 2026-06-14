import type { DictAdapter, DictResponse } from '../types'

/**
 * 创建默认适配器所需的配置参数。
 *
 * @example
 * const adapter = createDefaultAdapter({
 *   baseURL: '/api',
 *   dictEndpoint: '/dict/list',
 *   versionEndpoint: '/dict/version',
 *   paramKey: 'lang',
 *   apiHeaderKey: 'X-Locale',
 * })
 */
export interface DefaultAdapterOptions {
  baseURL: string
  dictEndpoint: string
  versionEndpoint: string
  /** 发送给 API 的语言参数名，设为空则不传，默认 'lang' */
  paramKey: string
  /** 发送给 API 的语言请求头名，设为空则不传，默认 'X-Locale' */
  apiHeaderKey: string
}

/**
 * 构建完整请求 URL。
 * - SSR / 外部 API：baseURL 为绝对地址，拼接为绝对 URL
 * - 客户端内部 API：baseURL 为空，返回相对路径由浏览器隐式补全
 * 使用原生 fetch（非 ofetch），避免客户端环境解析相对 URL 的问题。
 */
function buildURL(baseURL: string, endpoint: string, params: Record<string, string>): string {
  const searchParams = new URLSearchParams(params)
  const qs = searchParams.toString()
  // baseURL 非空时直接拼接（SSR 侧已解析为绝对 origin，外部 API 也是绝对地址）
  return qs ? `${baseURL}${endpoint}?${qs}` : `${baseURL}${endpoint}`
}

/** fetchDict 所需的内聚配置 */
interface FetchDictConfig {
  baseURL: string
  dictEndpoint: string
  paramKey: string
  apiHeaderKey: string
}

/**
 * 拉取指定类型和语言的字典数据。
 * 独立提取以控制函数行数，遵循 oxlint max-lines-per-function 规则。
 */
async function fetchDictImpl(_storeName: string, config: FetchDictConfig, types: string[], locale: string): Promise<DictResponse> {
  const params: Record<string, string> = { types: types.join(',') }
  // paramKey 为空时不传语言参数
  if (config.paramKey) {
    params[config.paramKey] = locale
  }
  const url = buildURL(config.baseURL, config.dictEndpoint, params)
  const headers: Record<string, string> = { Accept: 'application/json' }
  // apiHeaderKey 非空时将语言值写入请求头
  if (config.apiHeaderKey) {
    headers[config.apiHeaderKey] = locale
  }
  try {
    const response = await fetch(url, { method: 'GET', headers })
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`)
    }
    return response.json()
  } catch (e) {
    throw new Error(`Failed to fetch dictionary: ${e instanceof Error ? e.message : String(e)}`, { cause: e })
  }
}

/** fetchVersion 所需的内聚配置 */
interface FetchVersionConfig {
  baseURL: string
  versionEndpoint: string
}

/**
 * 获取远程字典版本号。
 * 独立提取以控制函数行数，遵循 oxlint max-lines-per-function 规则。
 */
async function fetchVersionImpl(_storeName: string, config: FetchVersionConfig): Promise<string> {
  const url = buildURL(config.baseURL, config.versionEndpoint, {})
  try {
    const response = await fetch(url, { method: 'GET', headers: { Accept: 'application/json' } })
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`)
    }
    const data = await response.json()
    if (!data.version) {
      throw new Error('Version not found in response')
    }
    return data.version
  } catch (e) {
    throw new Error(`Failed to fetch version: ${e instanceof Error ? e.message : String(e)}`, { cause: e })
  }
}

/**
 * 创建默认的 REST 字典适配器。
 * 底层使用原生 fetch，兼容浏览器和 Node.js 18+（Nuxt 4 要求）。
 * SSR 侧由 resolveBaseURL() 保证 baseURL 为绝对 origin，客户端相对路径由浏览器处理。
 *
 * @param {DefaultAdapterOptions} options - 适配器配置参数（baseURL、dictEndpoint、versionEndpoint、paramKey、apiHeaderKey）
 * @returns {DictAdapter} 实现了 fetchDict / fetchVersion 方法的 DictAdapter 实例
 *
 * @example
 * const adapter = createDefaultAdapter({
 *   baseURL: 'https://api.example.com',
 *   dictEndpoint: '/v1/dict/list',
 *   versionEndpoint: '/v1/dict/version',
 *   paramKey: 'lang',
 *   apiHeaderKey: 'X-Locale',
 * })
 *
 * // 用于 ModuleOptions.api.adapter
 * // 或 stores.<storeName>.adapter
 */
export function createDefaultAdapter(options: DefaultAdapterOptions): DictAdapter {
  const { baseURL, dictEndpoint, versionEndpoint, paramKey, apiHeaderKey } = options

  const dictConfig: FetchDictConfig = { baseURL, dictEndpoint, paramKey, apiHeaderKey }
  const versionConfig: FetchVersionConfig = { baseURL, versionEndpoint }

  return {
    fetchDict: (storeName, { types, locale }) => fetchDictImpl(storeName, dictConfig, types, locale),
    fetchVersion: (storeName) => fetchVersionImpl(storeName, versionConfig),
  }
}
