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
});
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
});
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
});
```

```ts [IndexedDB Disabled]
export default defineNuxtConfig({
  modules: ['@lacqjs/nuxt-dict'],
  dict: {
    cache: { indexedDB: { enabled: false }, memoryMax: 100, ttl: 600000 },
  },
});
```

```ts [Full Config]
export default defineNuxtConfig({
  modules: ['@lacqjs/nuxt-dict'],
  dict: {
    enable: true,
    logLevel: 3,
    api: { baseURL: '', dictEndpoint: '/api/dict/list', versionEndpoint: '/api/dict/version' },
    cache: { memoryMax: 200, ttl: 0, indexedDB: { enabled: true, dbName: 'nuxt-dict' } },
    locale: {
      default: 'zh-CN',
      source: 'cookie',
      cookieKey: 'i18n_redirected',
      paramKey: 'lang',
      apiHeaderKey: 'X-Locale',
    },
    ssr: { prefetch: ['gender', 'status', 'industry'] },
  },
});
```

::

## GraphQL Adapter

Adapters are defined in separate files using `defineDictAdapter()`. Place the file at `~/dict/dict-adapter.ts` (the convention path for global adapters), and the module auto-discovers it.

::code-group

```ts [~/dict/dict-adapter.ts]
// Global GraphQL adapter — replaces the default REST requests
export default defineDictAdapter({
  async fetchDict(storeName, { types, locale }) {
    // Fetch dictionary data via GraphQL
    const res = await fetch('https://gql.example.com', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: `{ dict(types: [${types.map((t) => `"${t}"`)}], locale: "${locale}") { version data { type items { code label } } } }`,
      }),
    });
    return (await res.json()).data.dict;
  },
  async fetchVersion(storeName) {
    // Fetch version via GraphQL
    const res = await fetch('https://gql.example.com', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: '{ dictVersion }' }),
    });
    return (await res.json()).data.dictVersion;
  },
});
```

```ts [nuxt.config.ts]
export default defineNuxtConfig({
  modules: ['@lacqjs/nuxt-dict'],
  dict: {
    api: {
      // Convention path ~/dict/dict-adapter.ts is auto-discovered, or specify explicitly:
      // adapter: '~/dict/dict-adapter',
    },
  },
});
```

::

## Store Custom Adapter

Each store can use its own adapter file. The convention path `~/dict/{storeName}-adapter.ts` is auto-discovered by the module.

::code-group

```ts [~/dict/static-adapter.ts]
// Custom adapter for the static store — returns hardcoded data, no HTTP requests
export default defineDictAdapter({
  async fetchDict(_storeName, { types, locale }) {
    return {
      version: 'static-1.0',
      data: {
        priority: {
          type: 'priority',
          items: [
            { value: 'high', label: `High (${locale})` },
            { value: 'low', label: `Low (${locale})` },
          ],
        },
      },
    };
  },
  async fetchVersion(_storeName) {
    return 'static-1.0';
  },
});
```

```ts [nuxt.config.ts]
export default defineNuxtConfig({
  modules: ['@lacqjs/nuxt-dict'],
  dict: {
    api: { baseURL: '', dictEndpoint: '/api/dict/list' },
    stores: {
      // Convention path ~/dict/static-adapter.ts is auto-discovered, or specify explicitly:
      // static: { adapter: '~/dict/static-adapter' },
      static: {},
    },
  },
});
```

::
