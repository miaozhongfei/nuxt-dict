import type { ResolvedModuleOptions } from './types';

/** 模块默认配置。module.ts 和 runtime 端共享同一份，避免重复定义。 */
export const defaultOptions: ResolvedModuleOptions = {
  enable: true,
  logLevel: 3,
  api: {
    baseURL: '/api',
    dictEndpoint: '/dict/list',
    versionEndpoint: '/dict/version',
    lazy: false,
  },
  cache: {
    memoryMax: 200,
    ttl: 0,
    indexedDB: {
      enabled: true,
      dbName: 'nuxt-dict',
    },
  },
  locale: {
    default: 'zh-CN',
    source: 'cookie',
    cookieKey: 'i18n_redirected',
    queryKey: 'lang',
    headerKey: 'accept-language',
    paramKey: 'lang',
    apiHeaderKey: 'X-Locale',
  },
  stores: {},
  ssr: {
    prefetch: [],
  },
  version: {
    storageKey: '__NUXT_DICT_VERSION__',
  },
};
