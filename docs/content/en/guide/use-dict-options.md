---
title: useDict
description: Directly output { value, label } format dictionary data for seamless integration with Element Plus, Vant, etc.
---

**Goal**: Learn to use `useDict` to quickly integrate with Nuxt UI, Element Plus, Vant, and other UI library components.

## When do you need this?

- You use Nuxt UI and `<USelect>` needs `items` data
- You use Element Plus and `<el-select>` needs `[{ value, label }]` format
- You use Vant and `<van-picker>` needs `columns` data
- You need dictionary data directly bindable to UI components

## Full Signature

```ts
useDict(type: string): useDictReturn
useDict(storeName: string, type: string): useDictReturn
```

## Return Values

| Property    | Type                                  | Description                                                           |
| ----------- | ------------------------------------- | --------------------------------------------------------------------- |
| `data`      | `ShallowRef<DictItem[] \| null>`      | Dictionary data array, each item is `{ value, label, ...extensions }` |
| `translate` | `(value: string \| number) => string` | Synchronous translation function                                      |
| `loading`   | `Ref<boolean>`                        | Loading state                                                         |
| `refresh`   | `() => Promise<void>`                 | Manual refresh                                                        |

`DictItem.value` naturally matches UI component libraries' `value` field — no manual mapping needed.

## Usage Examples

::code-group

```vue [Nuxt UI]
<template>
  <USelect v-model="selected" :items="data" placeholder="Select" />
</template>

<script setup lang="ts">
const { data } = useDict('industry');
const selected = ref('');
</script>
```

```vue [Element Plus]
<template>
  <el-select v-model="selected" placeholder="Select industry" :loading="loading">
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
  <van-field v-model="selectedLabel" readonly placeholder="Select" @click="showPicker = true" />
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

```vue [Native Select]
<template>
  <select v-model="selected">
    <option value="">Select</option>
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

## Notes

> `data` contains `DictItem` items with a native `value` field, directly matching UI component libraries — no manual `map` needed.

> Extension fields (like `color`) are preserved in each `data` item and can be used directly in component props. e.g. `<el-tag :color="item.color">`.

## What You Learned

- [ ] Use `useDict` for `{ value, label }` formatted dictionary data
- [ ] Integrate with Nuxt UI `<USelect>`
- [ ] Integrate with Element Plus `<el-select>`
- [ ] Integrate with Vant `<van-picker>`
- [ ] Integrate with native `<select>`
