---
title: Config Templates
description: Copy-paste nuxt.config.ts config templates for common scenarios.
---

::code-group
  ```ts [Internal API]
  export default defineNuxtConfig({
    modules: ['@lacqjs/nuxt-dict'],
    dict: {
      api: { baseURL: '', dictEndpoint: '/api/dict/list' },
    },
  })
  ```

  ```ts [External API]
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

  ```ts [GraphQL Adapter]
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

  ```ts [Multi-Store]
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

  ```ts [Store Custom Adapter]
  export default defineNuxtConfig({
    modules: ['@lacqjs/nuxt-dict'],
    dict: {
      api: { baseURL: '', dictEndpoint: '/api/dict/list' },
      stores: {
        // Named store with custom adapter — no HTTP requests
        static: {
          adapter: {
            async fetchDict(_storeName, { types, locale }) {
              return {
                version: 'static-1.0',
                data: {
                  priority: { type: 'priority', items: [
                    { value: 'high', label: `High (${locale})` },
                    { value: 'low', label: `Low (${locale})` },
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

  ```ts [IndexedDB Disabled]
  export default defineNuxtConfig({
    modules: ['@lacqjs/nuxt-dict'],
    dict: {
      cache: { indexedDB: { enabled: false }, memoryMax: 100, ttl: 600000 },
    },
  })
  ```

  ```ts [Full Config]
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
