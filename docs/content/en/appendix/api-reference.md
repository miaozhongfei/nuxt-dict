---
title: API Reference
description: All composable and $dict method signatures and return values at a glance.
---

## useDict

```
useDict(type: string): UseDictReturn
useDict(storeName: string, type: string): UseDictReturn
```

| Return        | Type                                                 | Description                                               |
| ------------- | ---------------------------------------------------- | --------------------------------------------------------- |
| `data`        | `ShallowRef<DictItem[] \| null>`                     | Raw dictionary data, each item is `{ value, label, ... }` |
| `translate`   | `(value: string \| number) => string`                | Synchronous translation                                   |
| `getDictItem` | `(value: string \| number) => DictItem \| undefined` | Get full dictionary item                                  |
| `loading`     | `Ref<boolean>`                                       | Loading state                                             |
| `error`       | `Ref<string \| null>`                                | Error info                                                |
| `refresh`     | `() => Promise<void>`                                | Manual refresh                                            |

**Scope**: Component-level, reactive. Call at the top of `<script setup>`; auto-fetches on mount; template auto-updates on data change.

## useDictTree

```
useDictTree(type: string): UseDictTreeReturn
useDictTree(storeName: string, type: string): UseDictTreeReturn
```

| Return      | Type                                    | Description          |
| ----------- | --------------------------------------- | -------------------- |
| `tree`      | `ShallowRef<TreeNode[] \| null>`        | Tree dictionary data |
| `translate` | `(value: string \| number) => string`   | Translate any node   |
| `findPath`  | `(value: string \| number) => string[]` | Path backtracking    |
| `loading`   | `Ref<boolean>`                          | Loading state        |
| `refresh`   | `() => Promise<void>`                   | Manual refresh       |

**Scope**: Component-level, reactive — same as `useDict`. Auto-fetches tree data on mount.

## useLocale

```
useLocale(): { locale, setLocale, locales }
```

| Return      | Type                          | Description         |
| ----------- | ----------------------------- | ------------------- |
| `locale`    | `Ref<string>`                 | Current language    |
| `setLocale` | `(newLocale: string) => void` | Switch language     |
| `locales`   | `string[]`                    | Supported languages |

## $dict

| Method          | Signature                                                                                                          |
| --------------- | ------------------------------------------------------------------------------------------------------------------ |
| `translate`     | `$dict.translate(type, value)` / `$dict.translate(type, value, { storeName?, field? })`                            |
| `translatePath` | `$dict.translatePath(type, value)` / `$dict.translatePath(type, value, { storeName?, field?, separator? })`        |
| `translateData` | `$dict.translateData(data, mapping, suffix?)` → returns new object with translated fields appended                 |
| `getDictItem`   | `$dict.getDictItem(type, value)` / `$dict.getDictItem(type, value, { storeName? })` → returns full DictItem object |

**Scope**: Global, synchronous, non-reactive. Reads directly from the manager's memory cache; no Vue re-render. Best for computed properties and table formatters. Requires data to be loaded via `useDict` / `useDictTree` first.

## Type Definitions

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
  adapter?: string; // File path to a custom adapter, e.g. '~/dict/dict-adapter.ts'
  lazy?: boolean; // Whether to lazily check version, inherits from api.lazy
}
```

## defineDictAdapter

```ts
export function defineDictAdapter(adapter: DictAdapter): DictAdapter
```

Type helper for defining custom adapters in separate files. Returns the adapter as-is; only provides type constraints.

```ts [~/dict/dict-adapter.ts]
export default defineDictAdapter({
  async fetchDict(storeName, options) {
    // Custom fetch logic
  },
  async fetchVersion(storeName) {
    // Custom version fetch logic
  },
})
```
