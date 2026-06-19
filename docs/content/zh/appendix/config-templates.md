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
});
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
});
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
});
```

```ts [禁用 IndexedDB]
export default defineNuxtConfig({
  modules: ['@lacqjs/nuxt-dict'],
  dict: {
    cache: { indexedDB: { enabled: false }, memoryMax: 100, ttl: 600000 },
  },
});
```

```ts [完整配置]
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

## GraphQL 适配器

适配器定义在独立文件中，使用 `defineDictAdapter()` 创建。文件放在 `~/dict/dict-adapter.ts`（全局适配器约定路径），模块自动发现。

::code-group

```ts [~/dict/dict-adapter.ts]
// 全局 GraphQL 适配器——替代默认 REST 请求
export default defineDictAdapter({
  async fetchDict(storeName, { types, locale }) {
    // 通过 GraphQL 查询字典数据
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
    // 通过 GraphQL 查询版本号
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
      // 约定路径 ~/dict/dict-adapter.ts 自动发现，也可以显式指定：
      // adapter: '~/dict/dict-adapter',
    },
  },
});
```

::

## 仓库自定义适配器

每个仓库可以使用独立的适配器文件。约定路径 `~/dict/{storeName}-adapter.ts`，模块自动发现。

::code-group

```ts [~/dict/static-adapter.ts]
// static 仓库的自定义适配器——直接返回硬编码数据，不发起 HTTP 请求
export default defineDictAdapter({
  async fetchDict(_storeName, { types, locale }) {
    return {
      version: 'static-1.0',
      data: {
        priority: {
          type: 'priority',
          items: [
            { value: 'high', label: `高 (${locale})` },
            { value: 'low', label: `低 (${locale})` },
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
      // 约定路径 ~/dict/static-adapter.ts 自动发现，也可以显式指定：
      // static: { adapter: '~/dict/static-adapter' },
      static: {},
    },
  },
});
```

::
