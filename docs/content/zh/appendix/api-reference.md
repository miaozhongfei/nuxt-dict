---
title: API 速查表
description: 所有 composable 和 $dict 的方法签名与返回值一览。
---

## useDict

```
useDict(type: string): UseDictReturn
useDict(storeName: string, type: string): UseDictReturn
```

| 返回值 | 类型 | 说明 |
|--------|------|------|
| `data` | `ShallowRef<DictItem[] \| null>` | 字典原始数据，每项为 `{ value, label, ... }` |
| `translate` | `(value: string \| number) => string` | 同步翻译函数 |
| `loading` | `Ref<boolean>` | 加载状态 |
| `error` | `Ref<string \| null>` | 错误信息 |
| `refresh` | `() => Promise<void>` | 手动刷新 |

## useDictTree

```
useDictTree(type: string): UseDictTreeReturn
useDictTree(storeName: string, type: string): UseDictTreeReturn
```

| 返回值 | 类型 | 说明 |
|--------|------|------|
| `tree` | `ShallowRef<TreeNode[] \| null>` | 树形字典数据 |
| `translate` | `(value: string \| number) => string` | 翻译任意节点 |
| `findPath` | `(value: string \| number) => string[]` | 路径回溯 |
| `loading` | `Ref<boolean>` | 加载状态 |
| `refresh` | `() => Promise<void>` | 手动刷新 |

## useLocale

```
useLocale(): { locale, setLocale, locales }
```

| 返回值 | 类型 | 说明 |
|--------|------|------|
| `locale` | `Ref<string>` | 当前语言 |
| `setLocale` | `(newLocale: string) => void` | 切换语言 |
| `locales` | `string[]` | 支持的语言列表 |

## $dict

| 方法 | 签名 |
|------|------|
| `translate` | `$dict.translate(type, value)` / `$dict.translate(store, type, value)` |
| `translatePath` | `$dict.translatePath(type, value)` / `$dict.translatePath(store, type, value, separator?)` |

## 类型定义

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
