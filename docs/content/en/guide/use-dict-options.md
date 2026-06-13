---
title: useDictOptions
description: Directly output { label, value } format dictionary data for seamless integration with Element Plus, Vant, etc.
---

# useDictOptions

**Goal**: Learn to use `useDictOptions` to quickly integrate with Element Plus, Vant, and other UI library components.

## When do you need this?

- You use Element Plus and `<el-select>` needs `:options="[{ label, value }]"` format
- You use Vant and `<van-picker>` needs `columns` data
- You don't want to manually map `{ code, label }` to `{ value, label }`

## Full Signature

```ts
useDictOptions(type: string): UseDictOptionsReturn
useDictOptions(storeName: string, type: string): UseDictOptionsReturn
```

## Return Values

| Property | Type | Description |
|----------|------|-------------|
| `options` | `ComputedRef<{ label: string; value: string \| number }[]>` | Computed property that automatically maps `code` to `value` |
| `loading` | `Ref<boolean>` | Loading state |
| `refresh` | `() => Promise<void>` | Manual refresh |

`useDictOptions` internally calls `useDict`, so caching and loading behavior are identical.

## Usage Examples

::code-group
  ```vue [Element Plus]
  <template>
    <el-select v-model="selected" placeholder="Select industry" :loading="loading">
      <el-option v-for="opt in options" :key="opt.value" :label="opt.label" :value="opt.value" />
    </el-select>
    <p>Selected: {{ selected }}</p>
  </template>

  <script setup lang="ts">
  const { options, loading } = useDictOptions('industry')
  const selected = ref('')
  </script>
  ```

  ```vue [Native Select]
  <template>
    <select v-model="selected">
      <option value="">Select</option>
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

## Notes

> `options` is a computed property — it updates automatically when dictionary data changes. No manual watching needed.

> Extension fields don't appear in `options`. Use `useDict` for raw `data` if you need extra fields like `color`.

## What You Learned

- [ ] Use `useDictOptions` for `{ label, value }` formatted options
- [ ] Integrate with Element Plus `<el-select>`
- [ ] Integrate with native `<select>`
- [ ] Understand that `options` auto-updates
