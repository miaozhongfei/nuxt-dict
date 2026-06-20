---
title: قالب‌های تنظیمات
description: قالب‌های پیکربندی nuxt.config.ts برای سناریوهای رایج، کپی و استفاده کنید.
---

::code-group

```ts [API داخلی]
export default defineNuxtConfig({
  modules: ['@lacqjs/nuxt-dict'],
  dict: {
    api: {
      baseURL: '',
      dictEndpoint: '/api/dict/list',
    },
  },
});
```

```ts [API خارجی]
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

```ts [چند مخزنی]
export default defineNuxtConfig({
  modules: ['@lacqjs/nuxt-dict'],
  dict: {
    api: {
      baseURL: '',
      dictEndpoint: '/api/dict/list',
    },
    stores: {
      payment: { baseURL: 'https://pay-api.example.com', dictEndpoint: '/v1/dictionary' },
      logistics: { dictEndpoint: '/api/logistics/dict' },
    },
  },
});
```

```ts [غیرفعال کردن IndexedDB]
export default defineNuxtConfig({
  modules: ['@lacqjs/nuxt-dict'],
  dict: {
    cache: {
      indexedDB: { enabled: false },
      memoryMax: 100,
      ttl: 600000,
    },
  },
});
```

```ts [پیکربندی کامل]
export default defineNuxtConfig({
  modules: ['@lacqjs/nuxt-dict'],
  dict: {
    enable: true,
    logLevel: 3,
    api: {
      baseURL: '',
      dictEndpoint: '/api/dict/list',
      versionEndpoint: '/api/dict/version',
    },
    cache: {
      memoryMax: 200,
      ttl: 0,
      indexedDB: { enabled: true, dbName: 'nuxt-dict' },
    },
    locale: {
      default: 'fa-IR',
      source: 'cookie',
      cookieKey: 'i18n_redirected',
      paramKey: 'lang',
      apiHeaderKey: 'X-Locale',
    },
    ssr: {
      prefetch: ['gender', 'status', 'industry'],
    },
  },
});
```

::

## آداپتور GraphQL

آداپتورها در فایل‌های مستقل با استفاده از `defineDictAdapter()` تعریف می‌شوند. فایل را در `~/dict/dict-adapter.ts` (مسیر قراردادی آداپتور سراسری) قرار دهید، ماژول آن را به صورت خودکار شناسایی می‌کند.

::code-group

```ts [~/dict/dict-adapter.ts]
// آداپتور سراسری GraphQL — جایگزین درخواست‌های REST پیش‌فرض
export default defineDictAdapter({
  async fetchDict(storeName, { types, locale }) {
    // دریافت داده‌های دیکشنری از طریق GraphQL
    const res = await fetch('https://gql.example.com', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: `{ dict(types: [${types.map((t) => `"${t}"`).join(',')}], locale: "${locale}") { version data { type items { code label } } } }`,
      }),
    });
    return (await res.json()).data.dict;
  },
  async fetchVersion(storeName) {
    // دریافت نسخه از طریق GraphQL
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
      // مسیر قراردادی ~/dict/dict-adapter.ts به صورت خودکار شناسایی می‌شود، یا صریحاً مشخص کنید:
      // adapter: '~/dict/dict-adapter',
    },
  },
});
```

::

## آداپتور سفارشی مخزن

هر مخزن می‌تواند از فایل آداپتور مستقل خود استفاده کند. مسیر قراردادی `~/dict/{storeName}-adapter.ts` به صورت خودکار توسط ماژول شناسایی می‌شود.

::code-group

```ts [~/dict/static-adapter.ts]
// آداپتور سفارشی مخزن static — بازگشت داده‌های ثابت، بدون درخواست HTTP
export default defineDictAdapter({
  async fetchDict(_storeName, { types, locale }) {
    return {
      data: {
        priority: {
          type: 'priority',
          items: [
            { value: 'high', label: `بالا (${locale})` },
            { value: 'low', label: `پایین (${locale})` },
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
      // مسیر قراردادی ~/dict/static-adapter.ts به صورت خودکار شناسایی می‌شود، یا صریحاً مشخص کنید:
      // static: { adapter: '~/dict/static-adapter' },
      static: {},
    },
  },
});
```

::
