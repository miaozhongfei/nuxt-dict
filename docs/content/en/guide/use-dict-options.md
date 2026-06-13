---
title: useDict
description: Directly output { value, label } format dictionary data for seamless integration with Element Plus, Vant, etc.
---

**Goal**: Learn to use `useDict` to quickly integrate with Element Plus, Vant, and other UI library components.

## When do you need this?

- You use Element Plus and `<el-select>` needs `[{ value, label }]` format
- You use Vant and `<van-picker>` needs `columns` data
- You need dictionary data directly bindable to UI components

## Full Signature

```ts
useDict(type: string): useDictReturn
useDict(storeName: string, type: string): useDictReturn
```

## Return Values

| Property | Type | Description |
|----------|------|-------------|
| `data` | `ShallowRef<DictItem[] \| null>` | Dictionary data array, each item is `{ value, label, ...extensions }` |
| `translate` | `(value: string \| number) => string` | Synchronous translation function |
| `loading` | `Ref<boolean>` | Loading state |
| `refresh` | `() => Promise<void>` | Manual refresh |

`DictItem.value` naturally matches UI component libraries' `value` field — no manual mapping needed.

## Usage Examples

::code-group
  ```vue [Element Plus]
  <template>
    <el-select v-model="selected" placeholder="Select industry" :loading="loading">
      <el-option v-for="opt in data" :key="opt.value" :label="opt.label" :value="opt.value" />
    </el-select>
    <p>Selected: {{ selected }}</p>
  </template>

  <script setup lang="ts">
  const { data, loading } = useDict('industry')
  const selected = ref('')
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
  const { data } = useDict('gender')
  const selected = ref('')
  </script>
  ```
::

## Notes

> `data` contains `DictItem` items with a native `value` field, directly matching UI component libraries — no manual `map` needed.

> Extension fields (like `color`) are preserved in each `data` item and can be used directly in component props. e.g. `<el-tag :color="item.color">`.

## What You Learned

- [ ] Use `useDict` for `{ value, label }` formatted dictionary data
- [ ] Integrate with Element Plus `<el-select>`
- [ ] Integrate with native `<select>`
