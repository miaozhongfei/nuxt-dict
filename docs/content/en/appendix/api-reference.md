---
title: API Reference
description: All composable and $dict method signatures and return values at a glance.
---

# API Reference

## useDict

```
useDict(type: string): UseDictReturn
useDict(storeName: string, type: string): UseDictReturn
```

| Return | Type | Description |
|--------|------|-------------|
| `data` | `ShallowRef<DictItem[] \| null>` | Raw dictionary data |
| `translate` | `(code: string \| number) => string` | Synchronous translation |
| `loading` | `Ref<boolean>` | Loading state |
| `error` | `Ref<string \| null>` | Error info |
| `refresh` | `() => Promise<void>` | Manual refresh |

## useDictOptions

```
useDictOptions(type: string): UseDictOptionsReturn
useDictOptions(storeName: string, type: string): UseDictOptionsReturn
```

| Return | Type | Description |
|--------|------|-------------|
| `options` | `ComputedRef<{ label: string; value: string \| number }[]>` | UI options format |
| `loading` | `Ref<boolean>` | Loading state |
| `refresh` | `() => Promise<void>` | Manual refresh |

## useDictTree

```
useDictTree(type: string): UseDictTreeReturn
useDictTree(storeName: string, type: string): UseDictTreeReturn
```

| Return | Type | Description |
|--------|------|-------------|
| `tree` | `ShallowRef<TreeNode[] \| null>` | Tree dictionary data |
| `translate` | `(code: string \| number) => string` | Translate any node |
| `findPath` | `(code: string \| number) => string[]` | Path backtracking |
| `loading` | `Ref<boolean>` | Loading state |
| `refresh` | `() => Promise<void>` | Manual refresh |

## useLocale

| Return | Type | Description |
|--------|------|-------------|
| `locale` | `Ref<string>` | Current language |
| `setLocale` | `(newLocale: string) => void` | Switch language |
| `locales` | `string[]` | Supported languages |

## $dict

| Method | Signature |
|--------|-----------|
| `translate` | `$dict.translate(type, code)` / `$dict.translate(store, type, code)` |
| `translatePath` | `$dict.translatePath(type, code)` / `$dict.translatePath(store, type, code, separator?)` |

## Type Definitions

```ts
interface DictItem {
  code: string | number
  label: string
  [key: string]: unknown
}

interface TreeNode extends DictItem {
  children?: TreeNode[]
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
