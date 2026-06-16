---
title: $dict 同步翻译
description: 在模板中直接调用 $dict.translate() 做同步翻译，无需组件挂载。
---

**本章目标**：学会在任何地方使用 `$dict` 做同步翻译。

## 什么时候需要这个功能？

- 在模板中快速翻译某个 code，不想单独声明 composable
- 在多个组件中翻译同一种字典类型，共享已缓存的翻译结果
- 翻译树形字典的层级路径（`$dict.translatePath`）
- 需要通过 code 获取完整的字典项对象（如获取颜色、图标等扩展字段，使用 `$dict.getDictItem`）

## $dict 是什么？

`$dict` 是一个注入到 NuxtApp 的全局翻译器，任何组件都可以直接使用。它访问的字典数据来自 `useDict` / `useDictTree` 等加载后存入的内存缓存。

> 字典数据必须先被某个 `useDict` / `useDictTree` 加载过，`$dict.translate()` 才能翻译。如果缓存中没有数据，返回 code 原文。

## API 签名

```ts
// 翻译扁平字典
$dict.translate(type: string, value: string | number): string
// 翻译扁平字典 + 自定义选项（storeName / field）
$dict.translate(type: string, value: string | number, opts: { storeName?: string; field?: string }): string

// 翻译树形字典路径（默认分隔符 ' / '）
$dict.translatePath(type: string, value: string | number): string
// 翻译树形字典路径 + 自定义选项（storeName / field / separator）
$dict.translatePath(type: string, value: string | number, opts: { storeName?: string; field?: string; separator?: string }): string

// 批量翻译数据对象
$dict.translateData(data: Record<string, unknown>, mapping: Record<string, string | { type: string; storeName?: string }>, suffix?: string): Record<string, unknown>

// 获取完整字典项对象（返回 DictItem，非字符串）
$dict.getDictItem(type: string, value: string | number): DictItem | undefined
// 指定仓库
$dict.getDictItem(type: string, value: string | number, opts: { storeName?: string }): DictItem | undefined
```

## 使用示例

::code-group

```vue [基础用法]
<template>
  <p>性别代码 'male' → {{ $dict.translate('gender', 'male') }}</p>
  <!-- 输出: 男 -->

  <p>状态代码 0 → {{ $dict.translate('status', 0) }}</p>
  <!-- 输出: 禁用 -->

  <p>区域代码 440104 → {{ $dict.translatePath('region', '440104') }}</p>
  <!-- 输出: 广东 / 广州 / 越秀区 -->

  <p>
    自定义分隔符 →
    {{ $dict.translatePath('region', '440104', { storeName: 'dicts', separator: ' → ' }) }}
  </p>
  <!-- 输出: 广东 → 广州 → 越秀区 -->
</template>
```

```vue [表格列中使用]
<template>
  <table>
    <tr v-for="user in users" :key="user.id">
      <td>{{ user.name }}</td>
      <td>{{ $dict.translate('status', user.status) }}</td>
      <td>{{ $dict.translate('gender', user.gender) }}</td>
    </tr>
  </table>
</template>
```

```vue [批量翻译 (translateData)]
<script setup>
const tableData = [
  { id: 1, gender: 'male', status: 0, name: '张三' },
  { id: 2, gender: 'female', status: 1, name: '李四' },
];
const processed = tableData.map((row) =>
  $dict.translateData(row, { gender: 'gender', status: { type: 'status', storeName: 'dicts2' } }),
);
// 默认仓库时传 string，跨仓库时传 { type, storeName? }
</script>
<template>
  <table>
    <tr v-for="row in processed" :key="row.id">
      <td>{{ row.name }}</td>
      <td>{{ row.gender_label }}</td>
      <td>{{ row.status_label }}</td>
    </tr>
  </table>
</template>
```

::

## getDictItem —— 获取完整字典项对象

当需要获取字典项的完整对象（而非单独某个字段的文字翻译）时使用。比如拿到 `color` 字段用于组件属性。

```vue
<template>
  <el-tag :color="(statusItem?.color as string)" effect="dark">
    {{ statusItem?.label }}
  </el-tag>
</template>

<script setup>
// useDict 预加载数据
useDict('status');

// 获取完整 DictItem 对象，可直接访问 color 等扩展属性
const statusItem = computed(() => $dict.getDictItem('status', 1));
// → { value: 1, label: '启用', color: '#67C23A' }

// 跨仓库
const item2 = $dict.getDictItem('status', 1, { storeName: 'dicts2' });
</script>
```

> 返回值是 `DictItem | undefined`。缓存未命中时返回 `undefined`，与 `translate()` 返回 code 原文的行为不同。

## translateData —— 批量翻译数据对象

当需要一次性翻译数据对象中的多个编码字段时，使用 `translateData`。

```vue
<template>
  <table>
    <tr v-for="row in processed" :key="row.id">
      <td>{{ row.xb_label }}</td>
      <td>{{ row.zt_label }}</td>
      <td>{{ row.name }}</td>
    </tr>
  </table>
</template>

<script setup>
const tableData = [
  { id: 1, xb: 'male', zt: 0, name: '张三' },
  { id: 2, xb: 'female', zt: 1, name: '李四' },
];

// 批量翻译：传入映射表 { 原字段: 字典类型 } → 返回追加了翻译字段的新对象
const processed = tableData.map((row) => $dict.translateData(row, { xb: 'gender', zt: 'status' }));
// [{ xb: 'male', xb_label: '男', zt: 0, zt_label: '禁用', ... }, ...]

// 跨仓库示例：{ type, storeName? } 指定非默认仓库
$dict.translateData(
  { orderStatus: 1 },
  { orderStatus: { type: 'pay_status', storeName: 'payment' } },
);
// → { orderStatus: 1, orderStatus_label: '已支付' }
</script>
```

> `mapping` 中值为 `string` 时使用默认仓库。需要指定仓库时用 `{ type: 'status', storeName: 'dicts2' }`。后缀可通过第三个参数自定义，默认 `'_label'`。

## 与 useDict.translate 的区别

| 对比         | `$dict.translate()`  | `useDict().translate()`         |
| ------------ | -------------------- | ------------------------------- |
| 需要组件挂载 | 不需要               | `useDict` 在 `onMounted` 中加载 |
| 依赖的数据   | 全局内存缓存         | 当前组件的 `data` ref           |
| 适用场景     | 快速翻译、多组件共享 | 需要 loading/error 状态的场景   |

> **最佳实践：** 同一个字典类型，在应用的某个根组件中用 `useDict` 加载一次，之后所有地方都用 `$dict.translate()` 翻译。

## 本章你学会了

- [ ] 在模板中使用 `$dict.translate()` 做同步翻译
- [ ] 使用 `$dict.translatePath()` 获取树形字典的层级路径
- [ ] 使用 `$dict.getDictItem()` 获取完整字典项对象
- [ ] 理解 `$dict` 与 `useDict().translate` 的适用场景差异
