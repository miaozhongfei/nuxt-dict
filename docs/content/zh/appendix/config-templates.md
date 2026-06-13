---
title: 配置模板
description: 常用场景的 nuxt.config.ts 配置模板，复制即用。
---

::code-group
  ```ts [内部 API]
  export default defineNuxtConfig({
    modules: ['@lacqjs/nuxt-dict'],
    dict: {
      api: { baseURL: '', dictEndpoint: '/api/dict/list' },
    },
  })
  ```

  ```ts [外部第三方 API]
  export default defineNuxtConfig({
    modules: ['@lacqjs/nuxt-dict'],
    dict: {
      api: {
        baseURL: 'https://dict-api.example.com',
        dictEndpoint: '/v1/dictionary',
        versionEndpoint: '/v1/dictionary/version',
      },
    },
  })
  ```

  ```ts [GraphQL 适配器]
  export default defineNuxtConfig({
    modules: ['@lacqjs/nuxt-dict'],
    dict: {
      api: {
        adapter: {
          async fetchDict(storeName, { types, locale }) {
            const res = await fetch('https://gql.example.com', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ query: `{ dict(types: [${types.map(t => `"${t}"`)}], locale: "${locale}") { version data { type items { code label } } } }` }),
            })
            return (await res.json()).data.dict
          },
          async fetchVersion(storeName) {
            const res = await fetch('https://gql.example.com', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ query: '{ dictVersion }' }) })
            return (await res.json()).data.dictVersion
          },
        },
      },
    },
  })
  ```

  ```ts [多仓库]
  export default defineNuxtConfig({
    modules: ['@lacqjs/nuxt-dict'],
    dict: {
      api: { baseURL: '', dictEndpoint: '/api/dict/list' },
      stores: {
        payment: { baseURL: 'https://pay-api.example.com', dictEndpoint: '/v1/dictionary' },
        logistics: { dictEndpoint: '/api/logistics/dict' },
      },
    },
  })
  ```

  ```ts [仓库自定义适配器]
  export default defineNuxtConfig({
    modules: ['@lacqjs/nuxt-dict'],
    dict: {
      api: { baseURL: '', dictEndpoint: '/api/dict/list' },
      stores: {
        // 命名仓库使用自定义适配器，不发起 HTTP 请求
        static: {
          adapter: {
            async fetchDict(_storeName, { types, locale }) {
              return {
                version: 'static-1.0',
                data: {
                  priority: { type: 'priority', items: [
                    { value: 'high', label: `高 (${locale})` },
                    { value: 'low', label: `低 (${locale})` },
                  ] },
                },
              }
            },
            async fetchVersion(_storeName) { return 'static-1.0' },
          },
        },
      },
    },
  })
  ```

  ```ts [禁用 IndexedDB]
  export default defineNuxtConfig({
    modules: ['@lacqjs/nuxt-dict'],
    dict: {
      cache: { indexedDB: { enabled: false }, memoryMax: 100, ttl: 600000 },
    },
  })
  ```

  ```ts [完整配置]
  export default defineNuxtConfig({
    modules: ['@lacqjs/nuxt-dict'],
    dict: {
      enable: true,
      logLevel: 3,
      api: { baseURL: '', dictEndpoint: '/api/dict/list', versionEndpoint: '/api/dict/version' },
      cache: { memoryMax: 200, ttl: 0, indexedDB: { enabled: true, dbName: 'nuxt-dict' } },
      locale: { default: 'zh-CN', source: 'cookie', cookieKey: 'i18n_redirected', paramKey: 'lang', apiHeaderKey: 'X-Locale' },
      ssr: { prefetch: ['gender', 'status', 'industry'] },
    },
  })
  ```
::
