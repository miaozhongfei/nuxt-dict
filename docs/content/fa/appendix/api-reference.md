---
title: مرجع API
description: تمام امضاهای متد composable و $dict و مقادیر بازگشتی در یک نگاه.
---

## useDict

```ts
useDict(type: string): UseDictReturn
useDict(storeName: string, type: string): UseDictReturn
```

| بازگشت        | نوع                                                  | توضیح                                                 |
| ------------- | ---------------------------------------------------- | ----------------------------------------------------- |
| `data`        | `ShallowRef<DictItem[] \| null>`                     | داده‌های خام دیکشنری، هر آیتم `{ value, label, ... }` |
| `translate`   | `(value: string \| number) => string`                | تابع ترجمه همزمان                                     |
| `getDictItem` | `(value: string \| number) => DictItem \| undefined` | دریافت آیتم کامل دیکشنری                              |
| `loading`     | `Ref<boolean>`                                       | وضعیت بارگذاری                                        |
| `error`       | `Ref<string \| null>`                                | اطلاعات خطا                                           |
| `refresh`     | `() => Promise<void>`                                | بازنشانی دستی                                         |

**محدوده**: سطح کامپوننت، واکنش‌گرا. در سطح بالای `<script setup>` فراخوانی شود؛ بارگذاری خودکار در mount؛ تمپلیت با تغییر داده به‌روز می‌شود.

## useDictTree

```ts
useDictTree(type: string): UseDictTreeReturn
useDictTree(storeName: string, type: string): UseDictTreeReturn
```

| بازگشت      | نوع                                     | توضیح                  |
| ----------- | --------------------------------------- | ---------------------- |
| `tree`      | `ShallowRef<TreeNode[] \| null>`        | داده‌های دیکشنری درختی |
| `translate` | `(value: string \| number) => string`   | ترجمه هر گره           |
| `findPath`  | `(value: string \| number) => string[]` | بازگشت مسیر            |
| `loading`   | `Ref<boolean>`                          | وضعیت بارگذاری         |
| `refresh`   | `() => Promise<void>`                   | بازنشانی دستی          |

**محدوده**: سطح کامپوننت، واکنش‌گرا — مشابه `useDict`. بارگذاری خودکار داده‌های درختی در mount.

## useLocale

```ts
useLocale(): { locale, setLocale, locales }
```

| بازگشت      | نوع                           | توضیح                      |
| ----------- | ----------------------------- | -------------------------- |
| `locale`    | `Ref<string>`                 | زبان فعلی                  |
| `setLocale` | `(newLocale: string) => void` | تغییر زبان                 |
| `locales`   | `string[]`                    | لیست زبان‌های پشتیبانی شده |

## $dict

| متد             | امضا                                                                                                                |
| --------------- | ------------------------------------------------------------------------------------------------------------------- |
| `translate`     | `$dict.translate(type, value)` / `$dict.translate(type, value, { storeName?, field? })`                             |
| `translatePath` | `$dict.translatePath(type, value)` / `$dict.translatePath(type, value, { storeName?, field?, separator? })`         |
| `translateData` | `$dict.translateData(data, mapping, suffix?)` → شیء جدید با فیلدهای ترجمه شده برمی‌گرداند                           |
| `getDictItem`   | `$dict.getDictItem(type, value)` / `$dict.getDictItem(type, value, { storeName? })` → شیء کامل DictItem برمی‌گرداند |

**محدوده**: سراسری، همگام، غیر واکنش‌گرا. مستقیماً از کش حافظه مدیریت می‌خواند؛ بدون رندر مجدد Vue. مناسب برای computed و formatter جدول. نیاز به بارگذاری داده از طریق `useDict` / `useDictTree` دارد.

## تعاریف نوع

```ts
interface DictItem {
  value: string | number;
  label: string;
  [key: string]: unknown;
}

interface TreeNode extends DictItem {
  children?: TreeNode[];
}

interface DictEntry {
  type: string;
  items: DictItem[];
  tree?: TreeNode[];
}

interface DictResponse {
  version: string;
  data: Record<string, DictEntry>;
}

interface DictAdapter {
  fetchDict(storeName: string, options: { types: string[]; locale: string }): Promise<DictResponse>;
  fetchVersion(storeName: string): Promise<string>;
}

interface StoreApiOptions {
  baseURL?: string;
  dictEndpoint?: string;
  versionEndpoint?: string;
  adapter?: string; // مسیر فایل آداپتور سفارشی، مثلاً '~/dict/dict-adapter.ts'
}
```

## defineDictAdapter

```ts
export function defineDictAdapter(adapter: DictAdapter): DictAdapter
```

تابع کمکی نوع برای تعریف آداپتورهای سفارشی در فایل‌های جداگانه. آداپتور را بدون تغییر برمی‌گرداند؛ فقط محدودیت‌های نوع را فراهم می‌کند.

```ts [~/dict/dict-adapter.ts]
export default defineDictAdapter({
  async fetchDict(storeName, options) {
    // منطق واکشی سفارشی
  },
  async fetchVersion(storeName) {
    // منطق واکشی نسخه سفارشی
  },
})
```
