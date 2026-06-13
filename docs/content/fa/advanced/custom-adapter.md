---
title: سفارشی آداپتور
description: اتصال به هر فرمت منبع داده دیکشنری — GraphQL، Firestore، فایل‌های JSON محلی و غیره.
---

# آداپتور سفارشی

**هدف**: نوشتن آداپتورهای سفارشی برای اتصال ماژول دیکشنری به APIهای REST غیر استاندارد یا منابع داده دیگر.

## چه زمانی به این ویژگی نیاز دارید؟

- فرمت داده‌های دیکشنری برگشتی از backend شما با فرمت پیش‌فرض ماژول متفاوت است
- از GraphQL به جای REST استفاده می‌کنید
- داده‌های دیکشنری شما در پایگاه داده‌های NoSQL مانند Firestore / MongoDB ذخیره شده است
- داده‌های دیکشنری شما فایل‌های JSON محلی است و نیازی به درخواست شبکه ندارد

## رابط آداپتور

آداپتور سفارشی باید رابط زیر را پیاده‌سازی کند:

```ts
interface DictAdapter {
  fetchDict(storeName: string, options: { types: string[]; locale: string }): Promise<DictResponse>
  fetchVersion(storeName: string): Promise<string>
}
```

### fetchDict

دریافت داده‌های دیکشنری. پارامترها:
- `storeName`: نام مخزن (مثلاً `'dicts'` پیش‌فرض، یا نام‌های پیکربندی شده در `stores`)
- `types`: لیست نوع‌های دیکشنری درخواستی، مانند `['gender', 'status']`
- `locale`: زبان فعلی، مانند `'zh-CN'`

مقدار بازگشتی باید با فرمت `DictResponse` مطابقت داشته باشد:

```ts
interface DictResponse {
  version: string
  data: Record<string, DictEntry>
}

interface DictEntry {
  type: string
  items: DictItem[]
  tree?: TreeNode[]
}

interface DictItem {
  code: string | number
  label: string
  [key: string]: unknown  // فیلدهای اضافی
}

interface TreeNode extends DictItem {
  children?: TreeNode[]
}
```

### fetchVersion

دریافت آخرین شماره نسخه دیکشنری فعلی. ماژول از آن برای تشخیص نیاز به پاک کردن کش استفاده می‌کند.

## مثال‌ها

چهار آداپتور برای سناریوهای رایج — GraphQL، JSON محلی، تبدیل فرمت، و مسیریابی چند API:

::code-group
  ```ts [GraphQL]
  export default defineNuxtConfig({
    modules: ['@lacqjs/nuxt-dict'],
    dict: {
      api: {
        adapter: {
          async fetchDict(storeName, { types, locale }) {
            const query = `
              query GetDict($types: [String!]!, $locale: String!) {
                dict(types: $types, locale: $locale) {
                  version
                  data { type items { code label } }
                }
              }
            `
            const res = await fetch('https://graphql.example.com/graphql', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ query, variables: { types, locale } }),
            })
            return (await res.json()).data.dict
          },
          async fetchVersion(storeName) {
            const res = await fetch('https://graphql.example.com/graphql', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ query: '{ dictVersion }' }),
            })
            return (await res.json()).data.dictVersion
          },
        },
      },
    },
  })
  ```

  ```ts [JSON محلی]
  import dictData from './data/dictionary.json'

  export default defineNuxtConfig({
    modules: ['@lacqjs/nuxt-dict'],
    dict: {
      api: {
        adapter: {
          async fetchDict(storeName, { types }) {
            const data: Record<string, any> = {}
            for (const type of types) {
              if (dictData[type]) data[type] = dictData[type]
            }
            return { version: '1.0.0', data }
          },
          async fetchVersion(storeName) { return '1.0.0' },
        },
      },
    },
  })
  ```

  ```ts [تبدیل فرمت]
  dict: {
    api: {
      adapter: {
        async fetchDict(storeName, { types, locale }) {
          const res = await fetch(`/api/custom-dict?codes=${types.join(',')}&lang=${locale}`)
          const json = await res.json()
          const data: Record<string, any> = {}
          for (const item of json.payload) {
            data[item.dictType] = {
              type: item.dictType,
              items: item.options.map((opt: any) => ({
                code: opt.dictCode,
                label: opt.dictName,
              })),
            }
          }
          return { version: json.dataVersion || '1.0.0', data }
        },
        async fetchVersion(storeName) {
          const res = await fetch('/api/custom-dict/version')
          return (await res.json()).version
        },
      },
    },
  },
  ```

  ```ts [مسیریابی StoreName]
  dict: {
    stores: {
      payment: { dictEndpoint: '/v1/payment/dict' },
      logistics: { dictEndpoint: '/v1/logistics/dict' },
    },
    api: {
      adapter: {
        async fetchDict(storeName, { types, locale }) {
          const endpoints: Record<string, string> = {
            dicts: 'https://default-api.example.com/dict/list',
            payment: 'https://pay-api.example.com/v1/payment/dict',
            logistics: 'https://logistics-api.example.com/v1/logistics/dict',
          }
          const url = endpoints[storeName] || endpoints.dicts
          const res = await fetch(`${url}?types=${types.join(',')}&lang=${locale}`)
          return res.json()
        },
        async fetchVersion(storeName) {
          const res = await fetch(`https://${storeName === 'dicts' ? 'default' : storeName}-api.example.com/version`)
          return (await res.json()).version
        },
      },
    },
  },
  ```
::

هر مخزن هنگام فراخوانی `fetchDict` / `fetchVersion`، ماژول به طور خودکار `storeName` متناظر را ارسال می‌کند — نیازی به تکرار `baseURL` در پیکربندی `stores` نیست.

> اگر مخازن مختلف نیاز به منطق آداپتور بسیار متفاوتی دارند (مثلاً یکی از GraphQL استفاده می‌کند و دیگری از فایل‌های محلی)، می‌توانید از مسیریابی if/else در `api.adapter` سراسری صرف‌نظر کنید و هر مخزن را با `adapter` مخصوص خود مستقیماً پیکربندی کنید. به [چند مخزنی](/advanced/multi-store#آداپتور-سفارشی-برای-هر-مخزن) مراجعه کنید.

## نکات

> مقدار بازگشتی `fetchVersion` برای تشخیص نیاز به ابطال کش استفاده می‌شود. اگر نسخه برگشتی با نسخه قبلی متفاوت باشد، ماژول تمام کش را پاک کرده و داده‌ها را دوباره دریافت می‌کند. اگر نیازی به تشخیص نسخه ندارید، یک رشته ثابت برگردانید.

> `fetch` در آداپتور هم در سمت سرور و هم در سمت کلاینت اجرا می‌شود. در سمت سرور (SSR) درخواست fetch در محیط Node.js اجرا می‌شود و در سمت کلاینت fetch مرورگر. به مسائل cross-origin و تفاوت‌های محیطی توجه کنید.

## آنچه در این فصل آموختید

- [ ] درک دو متد رابط `DictAdapter`
- [ ] نوشتن آداپتور GraphQL
- [ ] نوشتن آداپتور فایل JSON محلی
- [ ] تبدیل فرمت داده‌ها در آداپتور
- [ ] استفاده از `storeName` برای مسیریابی به APIهای خارجی مختلف
