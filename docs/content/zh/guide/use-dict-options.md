---
title: useDict
description: 直接输出 { value, label } 格式的字典数据，无缝对接 Nuxt UI / Element Plus / Vant 等 UI 库。
---

**本章目标**：学会用 `useDict` 快速对接 Nuxt UI、Element Plus、Vant 等 UI 库的组件。

## 什么时候需要这个功能？

- 用了 Nuxt UI，`<USelect>` 需要 `items` 数据
- 用了 Element Plus，`<el-select>` 需要数据格式为 `[{ value, label }]`
- 用了 Vant，`<van-picker>` 需要 `columns` 数据
- 需要一次性获得可绑定 UI 组件的字典数据

## 完整签名

```ts
useDict(type: string): useDictReturn
useDict(storeName: string, type: string): useDictReturn
```

## 返回值

| 属性        | 类型                                  | 说明                                                 |
| ----------- | ------------------------------------- | ---------------------------------------------------- |
| `data`      | `ShallowRef<DictItem[] \| null>`      | 字典数据数组，每项为 `{ value, label, ...扩展字段 }` |
| `translate` | `(value: string \| number) => string` | 同步翻译函数                                         |
| `loading`   | `Ref<boolean>`                        | 是否正在加载                                         |
| `refresh`   | `() => Promise<void>`                 | 手动刷新                                             |

`DictItem` 的 `value` 字段天然对应 UI 组件库的 `value`，无需额外映射即可直接绑定。

## 使用示例

::code-group

```vue [Nuxt UI]
<template>
  <USelect v-model="selected" :items="data" placeholder="请选择" />
</template>

<script setup lang="ts">
const { data } = useDict('industry');
const selected = ref('');
</script>
```

```vue [Element Plus]
<template>
  <el-select v-model="selected" placeholder="请选择行业" :loading="loading">
    <el-option v-for="opt in data" :key="opt.value" :label="opt.label" :value="opt.value" />
  </el-select>
</template>

<script setup lang="ts">
const { data, loading } = useDict('industry');
const selected = ref('');
</script>
```

```vue [Vant]
<template>
  <van-field v-model="selectedLabel" readonly placeholder="请选择" @click="showPicker = true" />
  <van-popup v-model:show="showPicker" round position="bottom">
    <van-picker :columns="columns" @confirm="onConfirm" @cancel="showPicker = false" />
  </van-popup>
</template>

<script setup lang="ts">
const { data } = useDict('gender');
const selected = ref('');
const selectedLabel = ref('');
const showPicker = ref(false);
const columns = computed(
  () => data?.map((item) => ({ text: item.label, value: item.value })) || [],
);
function onConfirm(picked: { selectedOptions: Array<{ text: string; value: string }> }) {
  selected.value = picked.selectedOptions[0].value;
  selectedLabel.value = picked.selectedOptions[0].text;
  showPicker.value = false;
}
</script>
```

```vue [原生 HTML Select]
<template>
  <select v-model="selected">
    <option value="">请选择</option>
    <option v-for="opt in data" :key="opt.value" :value="opt.value">
      {{ opt.label }}
    </option>
  </select>
</template>

<script setup lang="ts">
const { data } = useDict('gender');
const selected = ref('');
</script>
```

::

## 注意事项

> `data` 中的 `DictItem` 自带 `value` 字段，直接与 UI 组件库的 `value` 字段一致，无需手动 `map` 转换。

> 扩展字段（如 `color`）都保留在 `data` 的每项中，可以直接用于组件属性。例如 `<el-tag :color="item.color">`。

## 本章你学会了

- [ ] 用 `useDict` 获取 `{ value, label }` 格式的字典数据
- [ ] 对接 Nuxt UI 的 `<USelect>` 组件
- [ ] 对接 Element Plus 的 `<el-select>` 组件
- [ ] 对接 Vant 的 `<van-picker>` 组件
- [ ] 对接原生 `<select>` 元素
