---
title: useDictTree
description: 树形字典数据的获取、翻译和路径回溯，支持无限层级深度。
---

**本章目标**：掌握树形字典（如省市区、组织架构）的获取、翻译和路径查找。

## 什么时候需要这个功能？

- 你需要省市区三级联动选择器
- 字段值存的是"区号"（如 `440104`），但需要展示完整路径"广东 / 广州 / 越秀区"
- 你需要查找某个节点的所有上级节点（路径回溯）

## 完整签名

```ts
useDictTree(type: string): UseDictTreeReturn
useDictTree(storeName: string, type: string): UseDictTreeReturn
```

## 返回值

| 属性        | 类型                                    | 说明                                                       |
| ----------- | --------------------------------------- | ---------------------------------------------------------- |
| `tree`      | `ShallowRef<TreeNode[] \| null>`        | 完整的树形字典数据                                         |
| `translate` | `(value: string \| number) => string`   | 翻译任意层级的节点                                         |
| `findPath`  | `(value: string \| number) => string[]` | 路径回溯。输入叶子节点 code，返回从根到该节点的 label 数组 |
| `loading`   | `Ref<boolean>`                          | 是否正在加载                                               |
| `refresh`   | `() => Promise<void>`                   | 手动刷新                                                   |

## findPath：路径回溯

假设省市区树形数据是：

```
广东
├── 广州
│   ├── 荔湾区 (440103)
│   ├── 越秀区 (440104)
│   └── 天河区 (440106)
└── 深圳
    ├── 罗湖区 (440303)
    └── 福田区 (440304)
```

存的是区号 `440104`，展示需要完整路径：

```vue
<template>
  <p>区域编码：440104</p>
  <p>完整路径：{{ findPath('440104').join(' / ') }}</p>
  <!-- 输出: 广东 / 广州 / 越秀区 -->
</template>

<script setup lang="ts">
const { findPath } = useDictTree('region');
</script>
```

## 对接 Element Plus Cascader

```vue
<template>
  <el-cascader
    v-model="selected"
    :options="tree || []"
    :props="{ value: 'value', label: 'label', children: 'children' }"
    placeholder="请选择区域"
    clearable
  />
</template>

<script setup lang="ts">
const { tree } = useDictTree('region');
const selected = ref([]);
</script>
```

el-cascader 需要 `value` / `label` / `children` 三个字段，我们的 `TreeNode` 正好有 `code` / `label` / `children`，通过 `props` 映射即可。

## 无限层级深度

`useDictTree` 支持任意深度的树形数据。`translate` 和 `findPath` 都能正确递归查找。

## 作用域与响应式行为

`useDictTree` 与 `useDict` 行为一致：组件级响应式，挂载时自动加载。`tree` 为 `ShallowRef`，数据变化时自动重渲染。详见 [useDict 作用域](/guide/use-dict#作用域与响应式行为)。

:read-more{to="/guide/use-dict"}

## 注意事项

> `findPath` 只在已加载的 `tree` 数据中查找，不会发起额外的网络请求。确保 `tree.value` 不为 `null`。

## 本章你学会了

- [ ] 用 `useDictTree` 获取树形字典数据
- [ ] 用 `findPath` 实现 code → 完整路径的回溯
- [ ] 对接 Element Plus Cascader 级联选择器
