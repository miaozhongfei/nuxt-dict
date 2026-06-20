---
title: API 速查表
description: 所有 composable 和 $dict 的方法签名与返回值一览。
---

## useDict

```
useDict(type: string): UseDictReturn
useDict(storeName: string, type: string): UseDictReturn
```

| 返回值        | 类型                                                 | 说明                                         |
| ------------- | ---------------------------------------------------- | -------------------------------------------- |
| `data`        | `ShallowRef<DictItem[] \| null>`                     | 字典原始数据，每项为 `{ value, label, ... }` |
| `translate`   | `(value: string \| number) => string`                | 同步翻译函数                                 |
| `getDictItem` | `(value: string \| number) => DictItem \| undefined` | 同步获取完整字典项对象                       |
| `loading`     | `Ref<boolean>`                                       | 加载状态                                     |
| `error`       | `Ref<string \| null>`                                | 错误信息                                     |
| `refresh`     | `() => Promise<void>`                                | 手动刷新                                     |

**作用域**：组件级响应式。在 `<script setup>` 顶层调用，组件挂载时自动加载，数据变化后模板自动重渲染。

## useDictTree

```
useDictTree(type: string): UseDictTreeReturn
useDictTree(storeName: string, type: string): UseDictTreeReturn
```

| 返回值      | 类型                                    | 说明         |
| ----------- | --------------------------------------- | ------------ |
| `tree`      | `ShallowRef<TreeNode[] \| null>`        | 树形字典数据 |
| `translate` | `(value: string \| number) => string`   | 翻译任意节点 |
| `findPath`  | `(value: string \| number) => string[]` | 路径回溯     |
| `loading`   | `Ref<boolean>`                          | 加载状态     |
| `refresh`   | `() => Promise<void>`                   | 手动刷新     |

**作用域**：组件级响应式，与 `useDict` 一致。挂载时自动加载树形数据。

## useLocale

```
useLocale(): { locale, setLocale, locales }
```

| 返回值      | 类型                          | 说明           |
| ----------- | ----------------------------- | -------------- |
| `locale`    | `Ref<string>`                 | 当前语言       |
| `setLocale` | `(newLocale: string) => void` | 切换语言       |
| `locales`   | `string[]`                    | 支持的语言列表 |

## $dict

| 方法            | 签名                                                                                                         |
| --------------- | ------------------------------------------------------------------------------------------------------------ |
| `translate`     | `$dict.translate(type, value)` / `$dict.translate(type, value, { storeName?, field? })`                      |
| `translatePath` | `$dict.translatePath(type, value)` / `$dict.translatePath(type, value, { storeName?, field?, separator? })`  |
| `translateData` | `$dict.translateData(data, mapping, suffix?)` → 返回追加了翻译字段的新对象                                   |
| `getDictItem`   | `$dict.getDictItem(type, value)` / `$dict.getDictItem(type, value, { storeName? })` → 返回完整 DictItem 对象 |

**作用域**：全局同步非响应式。直接读取管理器内存缓存，不触发 Vue 重渲染。适合 computed、表格 formatter 等场景。使用前需通过 `useDict` / `useDictTree` 加载数据。

## 类型定义

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
  adapter?: string; // 自定义适配器文件路径，如 '~/dict/dict-adapter.ts'
  lazy?: boolean; // 是否惰性检查版本号，默认继承 api.lazy
}
```

## defineDictAdapter

```ts
export function defineDictAdapter(adapter: DictAdapter): DictAdapter
```

类型辅助函数，用于在独立文件中定义自定义适配器。原样返回传入的适配器对象，仅提供类型约束。

```ts [~/dict/dict-adapter.ts]
export default defineDictAdapter({
  async fetchDict(storeName, options) {
    // 自定义获取逻辑
  },
  async fetchVersion(storeName) {
    // 自定义版本获取逻辑
  },
})
```
