---
title: useDictOptions
description: 直接输出 { label, value } 格式的字典数据，无缝对接 Element Plus / Vant 等 UI 库。
---

# useDictOptions

**本章目标**：学会用 `useDictOptions` 快速对接 Element Plus、Vant 等 UI 库的组件。

## 什么时候需要这个功能？

- 用了 Element Plus，`<el-select>` 需要 `:options="[{ label, value }]"` 格式
- 用了 Vant，`<van-picker>` 需要 `columns` 数据
- 不想手动把 `{ code, label }` 转成 `{ value, label }`

## 完整签名

```ts
useDictOptions(type: string): UseDictOptionsReturn
useDictOptions(storeName: string, type: string): UseDictOptionsReturn
```

## 返回值

| 属性 | 类型 | 说明 |
|------|------|------|
| `options` | `ComputedRef<{ label: string; value: string \| number }[]>` | 计算属性，自动将 `code` 映射为 `value` |
| `loading` | `Ref<boolean>` | 是否正在加载 |
| `refresh` | `() => Promise<void>` | 手动刷新 |

`useDictOptions` 内部调用的是 `useDict`，所以缓存、loading 等行为完全一致。区别只在于 `options` 包装了 `{ label, value }` 格式。

## 使用示例

::code-group
  ```vue [Element Plus]
  <template>
    <el-select v-model="selected" placeholder="请选择行业" :loading="loading">
      <el-option v-for="opt in options" :key="opt.value" :label="opt.label" :value="opt.value" />
    </el-select>
    <p>选中的值：{{ selected }}</p>
  </template>

  <script setup lang="ts">
  const { options, loading } = useDictOptions('industry')
  const selected = ref('')
  </script>
  ```

  ```vue [原生 HTML Select]
  <template>
    <select v-model="selected">
      <option value="">请选择</option>
      <option v-for="opt in options" :key="opt.value" :value="opt.value">
        {{ opt.label }}
      </option>
    </select>
  </template>

  <script setup lang="ts">
  const { options } = useDictOptions('gender')
  const selected = ref('')
  </script>
  ```
::

## 注意事项

> `options` 是计算属性，当字典数据变化时自动重新计算。不需要手动 watch 数据后重新 map。

> 扩展字段不会出现在 `options` 中。如果你需要字典项的扩展字段（如 `color`），请使用 `useDict` 获取原始 `data`。

## 本章你学会了

- [ ] 用 `useDictOptions` 获取 `{ label, value }` 格式的选项数据
- [ ] 对接 Element Plus 的 `<el-select>` 组件
- [ ] 对接原生 `<select>` 元素
- [ ] 理解 `options` 是计算属性，随数据自动更新
