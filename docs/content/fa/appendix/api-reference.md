---
title: مرجع API
description: تمام امضاهای متد composable و $dict و مقادیر بازگشتی در یک نگاه.
---

## useDict

```ts
useDict(type: string): UseDictReturn
useDict(storeName: string, type: string): UseDictReturn
```

| بازگشت | نوع | توضیح |
|--------|------|-----------|
| `data` | `ShallowRef<DictItem[] \| null>` | داده‌های خام دیکشنری، هر آیتم `{ value, label, ... }` |
| `translate` | `(value: string \| number) => string` | تابع ترجمه همزمان |
| `loading` | `Ref<boolean>` | وضعیت بارگذاری |
| `error` | `Ref<string \| null>` | اطلاعات خطا |
| `refresh` | `() => Promise<void>` | بازنشانی دستی |

## useDictTree

```ts
useDictTree(type: string): UseDictTreeReturn
useDictTree(storeName: string, type: string): UseDictTreeReturn
```

| بازگشت | نوع | توضیح |
|--------|------|-----------|
| `tree` | `ShallowRef<TreeNode[] \| null>` | داده‌های دیکشنری درختی |
| `translate` | `(value: string \| number) => string` | ترجمه هر گره |
| `findPath` | `(value: string \| number) => string[]` | بازگشت مسیر |
| `loading` | `Ref<boolean>` | وضعیت بارگذاری |
| `refresh` | `() => Promise<void>` | بازنشانی دستی |

## useLocale

```ts
useLocale(): { locale, setLocale, locales }
```

| بازگشت | نوع | توضیح |
|--------|------|-----------|
| `locale` | `Ref<string>` | زبان فعلی |
| `setLocale` | `(newLocale: string) => void` | تغییر زبان |
| `locales` | `string[]` | لیست زبان‌های پشتیبانی شده |

## $dict

| متد | امضا |
|------|------|
| `translate` | `$dict.translate(type, value)` / `$dict.translate(store, type, value)` |
| `translatePath` | `$dict.translatePath(type, value)` / `$dict.translatePath(store, type, value, separator?)` |

## تعاریف نوع

```ts
interface DictItem {
  value: string | number
  label: string
  [key: string]: unknown
}

interface TreeNode extends DictItem {
  children?: TreeNode[]
}

interface DictEntry {
  type: string
  items: DictItem[]
  tree?: TreeNode[]
}

interface DictResponse {
  version: string
  data: Record<string, DictEntry>
}

interface DictAdapter {
  fetchDict(storeName: string, options: { types: string[]; locale: string }): Promise<DictResponse>
  fetchVersion(storeName: string): Promise<string>
}

interface StoreApiOptions {
  baseURL?: string
  dictEndpoint?: string
  versionEndpoint?: string
  adapter?: DictAdapter
}
```
