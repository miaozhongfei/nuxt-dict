---
title: سفارشی آداپتور
description: اتصال به هر فرمت منبع داده دیکشنری — GraphQL، Firestore، فایل‌های JSON محلی و غیره.
---

**هدف**: نوشتن آداپتورهای سفارشی برای اتصال ماژول دیکشنری به APIهای REST غیر استاندارد یا منابع داده دیگر.

## چه زمانی به این ویژگی نیاز دارید؟

- فرمت داده‌های دیکشنری برگشتی از backend شما با فرمت پیش‌فرض ماژول متفاوت است
- از GraphQL به جای REST استفاده می‌کنید
- داده‌های دیکشنری شما در پایگاه داده‌های NoSQL مانند Firestore / MongoDB ذخیره شده است
- داده‌های دیکشنری شما فایل‌های JSON محلی است و نیازی به درخواست شبکه ندارد

## رابط آداپتور

آداپتور سفارشی باید رابط `DictAdapter` را پیاده‌سازی کند. ماژول تابع کمکی `defineDictAdapter()` را برای استنتاج کامل نوع TypeScript فراهم می‌کند:

```ts
// defineDictAdapter() در زمان اجرا شیء را بدون تغییر برمی‌گرداند، فقط بررسی نوع ارائه می‌دهد
export default defineDictAdapter({
  async fetchDict(storeName, { types, locale }) { /* ... */ },
  async fetchVersion(storeName) { /* ... */ },
})
```

تعریف کامل رابط:

```ts
interface DictAdapter {
  fetchDict(storeName: string, options: { types: string[]; locale: string }): Promise<DictResponse>;
  fetchVersion(storeName: string): Promise<string>;
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
  version: string;
  data: Record<string, DictEntry>;
}

interface DictEntry {
  type: string;
  items: DictItem[];
  tree?: TreeNode[];
}

interface DictItem {
  value: string | number;
  label: string;
  [key: string]: unknown; // فیلدهای اضافی
}

interface TreeNode extends DictItem {
  children?: TreeNode[];
}
```

### fetchVersion

دریافت آخرین شماره نسخه دیکشنری فعلی. ماژول از آن برای تشخیص نیاز به پاک کردن کش استفاده می‌کند.

## روش‌های ثبت

آداپتورها در فایل‌های مستقل تعریف می‌شوند. دو روش برای ثبت آنها وجود دارد:

### کشف خودکار مسیر قراردادی (توصیه شده)

فایل آداپتور را در `~/dict/dict-adapter.ts` قرار دهید و ماژول آن را به طور خودکار کشف می‌کند — نیازی به پیکربندی نیست:

```ts [~/dict/dict-adapter.ts]
// ماژول به طور خودکار ~/dict/dict-adapter.ts را کشف می‌کند، نیازی به تنظیم nuxt.config.ts نیست
export default defineDictAdapter({
  async fetchDict(storeName, { types, locale }) {
    const res = await fetch(`/api/dict?types=${types.join(',')}&lang=${locale}`)
    return res.json()
  },
  async fetchVersion(storeName) {
    const res = await fetch('/api/dict/version')
    return (await res.json()).version
  },
})
```

### مسیر پیکربندی صریح

اگر فایل آداپتور در مسیر قراردادی نیست، مسیر را در `nuxt.config.ts` مشخص کنید:

```ts [nuxt.config.ts]
export default defineNuxtConfig({
  modules: ['@lacqjs/nuxt-dict'],
  dict: {
    api: {
      // مسیر صریح فایل آداپتور (مسیر قراردادی را لغو می‌کند)
      adapter: '~/custom/my-adapter',
    },
  },
})
```

هر مخزن نیز می‌تواند فایل آداپتور مستقل خود را داشته باشد، مسیر قراردادی: `~/dict/{storeName}-adapter.ts`.

## مثال‌ها

چهار آداپتور برای سناریوهای رایج — GraphQL، JSON محلی، تبدیل فرمت، و مسیریابی چند API:

::code-group

```ts [GraphQL]
// ~/dict/dict-adapter.ts
export default defineDictAdapter({
  async fetchDict(storeName, { types, locale }) {
    // ساخت رشته پرس‌وجوی GraphQL
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
    // پرس‌وجوی شماره نسخه فعلی دیکشنری
    const res = await fetch('https://graphql.example.com/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: '{ dictVersion }' }),
    })
    return (await res.json()).data.dictVersion
  },
})
```

```ts [JSON محلی]
// ~/dict/dict-adapter.ts
import { defineDictAdapter } from '@lacqjs/nuxt-dict'
// وارد کردن فایل داده‌های دیکشنری محلی
import dictData from '../data/dictionary.json'

export default defineDictAdapter({
  async fetchDict(storeName, { types }) {
    // فیلتر داده‌های محلی بر اساس نوع‌های درخواستی
    const data: Record<string, any> = {}
    for (const type of types) {
      if (dictData[type]) data[type] = dictData[type]
    }
    // داده‌های محلی تغییر نمی‌کنند، شماره نسخه ثابت
    return { version: '1.0.0', data }
  },
  async fetchVersion(storeName) {
    // نیازی به تشخیص نسخه برای داده‌های محلی نیست
    return '1.0.0'
  },
})
```

```ts [تبدیل فرمت]
// ~/dict/dict-adapter.ts
export default defineDictAdapter({
  async fetchDict(storeName, { types, locale }) {
    const res = await fetch(`/api/custom-dict?codes=${types.join(',')}&lang=${locale}`)
    const json = await res.json()
    // تبدیل فرمت backend به فرمت DictResponse مورد انتظار ماژول
    const data: Record<string, any> = {}
    for (const item of json.payload) {
      data[item.dictType] = {
        type: item.dictType,
        items: item.options.map((opt: any) => ({
          value: opt.dictCode,
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
})
```

```ts [مسیریابی StoreName]
// ~/dict/dict-adapter.ts
export default defineDictAdapter({
  async fetchDict(storeName, { types, locale }) {
    // انتخاب نقطه پایانی API بر اساس storeName
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
})
```

::

هر مخزن هنگام فراخوانی `fetchDict` / `fetchVersion`، ماژول به طور خودکار `storeName` متناظر را ارسال می‌کند — نیازی به تکرار `baseURL` در پیکربندی `stores` نیست.

> اگر مخازن مختلف نیاز به منطق آداپتور بسیار متفاوتی دارند (مثلاً یکی از GraphQL استفاده می‌کند و دیگری از فایل‌های محلی)، می‌توانید از مسیریابی if/else در آداپتور سراسری صرف‌نظر کنید و برای هر مخزن فایل آداپتور مستقل ایجاد کنید (مسیر قراردادی `~/dict/{storeName}-adapter.ts`). به [چند مخزنی](/advanced/multi-store#آداپتور-سفارشی-برای-هر-مخزن) مراجعه کنید.

## نکات

> مقدار بازگشتی `fetchVersion` برای تشخیص نیاز به ابطال کش استفاده می‌شود. اگر نسخه برگشتی با نسخه قبلی متفاوت باشد، ماژول تمام کش را پاک کرده و داده‌ها را دوباره دریافت می‌کند. اگر نیازی به تشخیص نسخه ندارید، یک رشته ثابت برگردانید.

> `fetch` در آداپتور هم در سمت سرور و هم در سمت کلاینت اجرا می‌شود. در سمت سرور (SSR) درخواست fetch در محیط Node.js اجرا می‌شود و در سمت کلاینت fetch مرورگر. به مسائل cross-origin و تفاوت‌های محیطی توجه کنید.

## آنچه در این فصل آموختید

- [ ] درک دو متد رابط `DictAdapter`
- [ ] استفاده از تابع کمکی `defineDictAdapter()` برای تعریف آداپتور
- [ ] ثبت آداپتور از طریق مسیر قراردادی `~/dict/dict-adapter.ts`
- [ ] نوشتن آداپتور GraphQL
- [ ] نوشتن آداپتور فایل JSON محلی
- [ ] تبدیل فرمت داده‌ها در آداپتور
- [ ] استفاده از `storeName` برای مسیریابی به APIهای خارجی مختلف
