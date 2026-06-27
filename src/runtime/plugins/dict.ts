import { watch } from 'vue';

import { globalAdapter, storeAdapters } from '#build/nuxt-dict/adapters';
import { defineNuxtPlugin, useRequestEvent, useCookie, useRoute } from '#imports';

import { createDefaultAdapter } from '../core/adapter';
import { IndexedDBCache, DEFAULT_STORE_NAME } from '../core/cache/indexeddb-cache';
import { DictManager } from '../core/dict-manager';
import { defaultOptions } from '../options';
import type { ResolvedModuleOptions, DictAdapter } from '../types';
import { createDictTranslator } from '../utils/dict-translator';
import { createLogger } from '../utils/logger';

/**
 * 从服务端请求中解析当前语言。
 * 支持 cookie、header、query 三种来源。
 */
function resolveServerLocale(options: ResolvedModuleOptions): string {
  const event = useRequestEvent();
  if (!event) return options.locale.default;

  if (options.locale.source === 'cookie') {
    const langCookie = useCookie(options.locale.cookieKey);
    return langCookie.value || options.locale.default;
  }

  if (options.locale.source === 'header') {
    const lang = event.headers.get(options.locale.headerKey);
    return lang
      ? (lang.split(',')[0]?.split(';')[0]?.trim() ?? options.locale.default)
      : options.locale.default;
  }

  if (options.locale.source === 'query') {
    const url = event.node.req.url || '';
    const searchIndex = url.indexOf('?');
    if (searchIndex === -1) return options.locale.default;
    const params = new URLSearchParams(url.slice(searchIndex));
    return params.get(options.locale.queryKey) || options.locale.default;
  }

  return options.locale.default;
}

/**
 * 检测 baseURL 是否为绝对地址（http/https 开头）。
 * 绝对地址直接返回，无需额外处理。
 */
function isAbsoluteURL(url: string): boolean {
  return /^https?:\/\//iu.test(url);
}

/**
 * 解析最终使用的 baseURL。
 * - 绝对地址（如 https://api.example.com）：直接返回，支持外部第三方接口
 * - 相对/空地址：SSR 端从请求 host 头构造绝对 origin，客户端由浏览器隐式补全
 */
function resolveBaseURL(baseURL: string): string {
  // 用户配置了外部绝对地址 → 直接使用，不拼接本地 origin
  if (isAbsoluteURL(baseURL)) {
    return baseURL;
  }

  if (import.meta.client) {
    return baseURL;
  }

  // SSR 端：相对路径需要拼接当前请求的 origin 才能被 Node.js fetch 解析
  const event = useRequestEvent();
  if (!event) return baseURL;

  const protocol = event.headers.get('x-forwarded-proto') || 'http';
  const host = event.headers.get('host');
  return host ? `${protocol}://${host}` : baseURL;
}

/**
 * 从客户端环境解析当前语言。
 * 与服务端 resolveServerLocale 对称，支持 cookie、query 两种来源。
 * header 在客户端不可用，回退默认值。
 */
function resolveClientLocale(options: ResolvedModuleOptions): string {
  if (options.locale.source === 'cookie') {
    const langCookie = useCookie(options.locale.cookieKey);
    return langCookie.value || options.locale.default;
  }

  if (options.locale.source === 'query') {
    const route = useRoute();
    return (route.query[options.locale.queryKey] as string) || options.locale.default;
  }

  return options.locale.default;
}

/**
 * 客户端侧初始化 IndexedDB 持久缓存 + 版本检查。
 * 先初始化 IndexedDB（invalidateAll 需要 IndexedDB 已就绪），再执行非 lazy 仓库的立即版本检查。
 */
async function initClient(
  manager: DictManager,
  indexedDB: IndexedDBCache,
  options: ResolvedModuleOptions,
  logger: ReturnType<typeof createLogger>,
): Promise<void> {
  if (options.cache.indexedDB.enabled) {
    try {
      // 一次性声明所有仓库对应的 object store（默认仓库 + 配置中的命名仓库）
      const storeNames = [DEFAULT_STORE_NAME, ...Object.keys(options.stores)];
      await indexedDB.init(storeNames);
    } catch (e) {
      logger.warn('IndexedDB init failed:', e);
    }
  }
  await manager.initialize();
}

/**
 * 根据配置确定哪些仓库使用惰性版本检查。
 * lazy 仓库在首次 getDict 时才检查版本，非 lazy 仓库在页面加载时立即检查。
 */
function resolveLazyStores(options: ResolvedModuleOptions): Set<string> {
  const lazyStores = new Set<string>();
  if (options.api.lazy) lazyStores.add(DEFAULT_STORE_NAME);
  for (const [name, config] of Object.entries(options.stores)) {
    if (config.lazy ?? options.api.lazy ?? false) {
      lazyStores.add(name);
    }
  }
  return lazyStores;
}

/**
 * 服务端预取指定类型的字典数据，加速首屏渲染。
 * 允许部分失败，不阻塞页面响应。
 */
async function executePrefetch(
  manager: DictManager,
  types: string[],
  logger: ReturnType<typeof createLogger>,
): Promise<void> {
  try {
    await Promise.all(types.map((type) => manager.getDict(type)));
  } catch (e) {
    logger.warn('SSR prefetch failed:', e);
  }
}

/**
 * 构建 adapter 映射表。默认仓库 'dicts' 使用全局 api 配置，
 * 其他仓库从 stores 配置创建独立 adapter（未配项继承全局值）。
 */
function createAdapters(
  options: ResolvedModuleOptions,
  logger: ReturnType<typeof createLogger>,
): Map<string, DictAdapter> {
  const adapters = new Map<string, DictAdapter>();

  // 默认仓库 'dicts'：优先使用 virtual module 导入的自定义适配器
  const defaultAdapter =
    globalAdapter ??
    createDefaultAdapter({
      baseURL: resolveBaseURL(options.api.baseURL),
      dictEndpoint: options.api.dictEndpoint,
      versionEndpoint: options.api.versionEndpoint,
      paramKey: options.locale.paramKey,
      apiHeaderKey: options.locale.apiHeaderKey,
    });
  adapters.set(DEFAULT_STORE_NAME, defaultAdapter);
  logger.debug(
    `Dict adapter created for default store '${DEFAULT_STORE_NAME}': ${options.api.baseURL}${options.api.dictEndpoint}`,
  );

  // 为 stores 中配置的每个仓库创建 adapter（优先用 virtual module 导入的自定义 adapter，否则用默认 REST adapter）
  for (const [storeName, storeApi] of Object.entries(options.stores)) {
    const adapter =
      storeAdapters[storeName] ??
      createDefaultAdapter({
        baseURL: resolveBaseURL(storeApi.baseURL ?? options.api.baseURL),
        dictEndpoint: storeApi.dictEndpoint ?? options.api.dictEndpoint,
        versionEndpoint: storeApi.versionEndpoint ?? options.api.versionEndpoint,
        paramKey: options.locale.paramKey,
        apiHeaderKey: options.locale.apiHeaderKey,
      });
    adapters.set(storeName, adapter);
    const desc = storeAdapters[storeName]
      ? 'custom adapter'
      : `${storeApi.baseURL ?? options.api.baseURL}${storeApi.dictEndpoint ?? options.api.dictEndpoint}`;
    logger.debug(`Dict adapter created for store '${storeName}': ${desc}`);
  }

  return adapters;
}

/**
 * Nuxt 插件入口：初始化字典管理器并注入 $dict / $dictManager。
 * - 服务端解析语言偏好并预取配置的字典类型
 * - 客户端初始化 IndexedDB 持久缓存
 */
const dictPlugin = defineNuxtPlugin(async (nuxtApp) => {
  const options = (nuxtApp.$config?.public?.dict ?? defaultOptions) as ResolvedModuleOptions;

  if (!options.enable) return;

  const logger = createLogger('nuxt-dict', { level: options.logLevel });

  const adapters = createAdapters(options, logger);
  const indexedDB = new IndexedDBCache(options.cache.indexedDB.dbName);
  const lazyStores = resolveLazyStores(options);

  const manager = new DictManager({
    adapters,
    indexedDB,
    memoryMax: options.cache.memoryMax,
    ttl: options.cache.ttl,
    versionStorageKey: options.version.storageKey,
    lazyStores,
  });

  const locale = import.meta.server ? resolveServerLocale(options) : resolveClientLocale(options);

  manager.setLocale(locale);

  // 客户端监听 cookie 中的语言变化：当外部模块（如 @nuxtjs/i18n）切换语言并写入同一 cookie 时，
  // useCookie 对同一 key 共享 reactive ref，watch 会自动触发，DictManager 同步更新语言并清缓存
  if (import.meta.client && options.locale.source === 'cookie') {
    const langCookie = useCookie(options.locale.cookieKey);
    watch(langCookie, (newLocale: string | null | undefined) => {
      if (newLocale && newLocale !== manager.getLocale()) {
        logger.debug(`Cookie locale changed to '${newLocale}'`);
        manager.setLocale(newLocale);
      }
    });
  }

  // 客户端初始化：IndexedDB 持久缓存 + 非 lazy 仓库立即版本检查
  if (import.meta.client) {
    await initClient(manager, indexedDB, options, logger);
  }

  if (import.meta.server && options.ssr.prefetch.length > 0) {
    await executePrefetch(manager, options.ssr.prefetch, logger);
  }

  const translator = createDictTranslator(manager);

  nuxtApp.provide('dict', translator);
  nuxtApp.provide('dictManager', manager);
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default dictPlugin as any;
