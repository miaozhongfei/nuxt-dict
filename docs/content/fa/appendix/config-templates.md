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

```ts [GraphQL]
export default defineNuxtConfig({
  modules: ['@lacqjs/nuxt-dict'],
  dict: {
    api: {
      adapter: {
        async fetchDict(storeName, { types, locale }) {
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
          const res = await fetch('https://gql.example.com', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query: '{ dictVersion }' }),
          });
          return (await res.json()).data.dictVersion;
        },
      },
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

```ts [آداپتور سفارشی مخزن]
export default defineNuxtConfig({
  modules: ['@lacqjs/nuxt-dict'],
  dict: {
    api: { baseURL: '', dictEndpoint: '/api/dict/list' },
    stores: {
      // مخزن نام‌گذاری شده با آداپتور سفارشی — بدون درخواست HTTP
      static: {
        adapter: {
          async fetchDict(_storeName, { types, locale }) {
            return {
              version: 'static-1.0',
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
        },
      },
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
