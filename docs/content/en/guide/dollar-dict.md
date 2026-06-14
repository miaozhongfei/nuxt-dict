---
title: $dict Synchronous Translation
description: Call $dict.translate() directly in templates for synchronous translation without component mounting.
---

**Goal**: Learn to use `$dict` anywhere for synchronous translation.

## When do you need this?

- Quickly translate a code in a template without declaring a composable
- Share cached translation results across multiple components
- Translate tree dictionary path hierarchies (`$dict.translatePath`)
- Get the full dictionary item object (e.g., to access color, icon, etc. via `$dict.getDictItem`)

## What is $dict?

`$dict` is a global translator injected into NuxtApp, accessible from any component. Its data comes from the memory cache populated by `useDict` / `useDictTree` calls.

> Dictionary data must have been loaded by some `useDict` / `useDictTree` before `$dict.translate()` can translate it. If the cache is empty, it returns the code as-is.

## API Signature

```ts
// Translate flat dictionary
$dict.translate(type: string, value: string | number): string
// Translate flat dictionary + custom options (storeName / field)
$dict.translate(type: string, value: string | number, opts: { storeName?: string; field?: string }): string

// Translate tree dictionary path (default separator ' / ')
$dict.translatePath(type: string, value: string | number): string
// Translate tree dictionary path + custom options (storeName / field / separator)
$dict.translatePath(type: string, value: string | number, opts: { storeName?: string; field?: string; separator?: string }): string

// Batch translate data object
$dict.translateData(data: Record<string, unknown>, mapping: Record<string, string | { type: string; storeName?: string }>, suffix?: string): Record<string, unknown>

// Get full dictionary item object (returns DictItem, not a string)
$dict.getDictItem(type: string, value: string | number): DictItem | undefined
// Specify store
$dict.getDictItem(type: string, value: string | number, opts: { storeName?: string }): DictItem | undefined
```

## Usage Examples

::code-group
  ```vue [Basic]
  <template>
    <p>Gender code 'male' → {{ $dict.translate('gender', 'male') }}</p>
    <!-- Output: Male -->

    <p>Status code 0 → {{ $dict.translate('status', 0) }}</p>
    <!-- Output: Disabled -->

    <p>Region code 440104 path → {{ $dict.translatePath('region', '440104') }}</p>
    <!-- Output: Guangdong / Guangzhou / Yuexiu -->
  </template>
  ```

  ```vue [In Table Columns]
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

  ```vue [Batch Translate (translateData)]
  <script setup>
  const tableData = [
    { id: 1, gender: 'male', status: 0, name: 'Zhang San' },
    { id: 2, gender: 'female', status: 1, name: 'Li Si' },
  ]
  const processed = tableData.map(row =>
    $dict.translateData(row, { gender: 'gender', status: { type: 'status', storeName: 'dicts2' } })
  )
  // string for default store, { type, storeName? } for cross-store
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

## getDictItem — Get Full Dictionary Item Object

Use when you need the full `DictItem` object rather than a string translation of a single field. For example, to access the `color` field for component properties.

```vue
<template>
  <el-tag :color="(statusItem?.color as string)" effect="dark">
    {{ statusItem?.label }}
  </el-tag>
</template>

<script setup>
// useDict pre-loads data
useDict('status')

// Get full DictItem object, accessing color and other extended properties
const statusItem = computed(() => $dict.getDictItem('status', 1))
// → { value: 1, label: 'Enabled', color: '#67C23A' }

// Cross-store
const item2 = $dict.getDictItem('status', 1, { storeName: 'dicts2' })
</script>
```

> Returns `DictItem | undefined`. On cache miss it returns `undefined`, unlike `translate()` which returns the code as a string.

## translateData — Batch Translate Data Objects

Use `translateData` when you need to translate multiple code fields in a data object at once.

```vue
<template>
  <table>
    <tr v-for="row in processed" :key="row.id">
      <td>{{ row.gender_label }}</td>
      <td>{{ row.status_label }}</td>
      <td>{{ row.name }}</td>
    </tr>
  </table>
</template>

<script setup>
const tableData = [
  { id: 1, gender: 'male', status: 0, name: 'Zhang San' },
  { id: 2, gender: 'female', status: 1, name: 'Li Si' },
]

// Batch translate: pass a mapping { sourceField: dictType } → returns a new object with translated fields appended
const processed = tableData.map(row =>
  $dict.translateData(row, { gender: 'gender', status: 'status' })
)
// [{ gender: 'male', gender_label: 'Male', status: 0, status_label: 'Enabled', ... }, ...]

// Cross-store example: { type, storeName? } for a non-default store
$dict.translateData(
  { orderStatus: 1 },
  { orderStatus: { type: 'pay_status', storeName: 'payment' } }
)
// → { orderStatus: 1, orderStatus_label: 'Paid' }
</script>
```

> When mapping value is a `string`, the default store is used. To specify a store, use `{ type: 'status', storeName: 'dicts2' }`. The suffix defaults to `'_label'` and can be customized via the third parameter.

## vs useDict.translate

| | `$dict.translate()` | `useDict().translate()` |
|---|---|---|
| Mount required | No | `useDict` loads in `onMounted` |
| Data source | Global memory cache | Component's `data` ref |
| Use case | Quick translation, shared across components | When loading/error state is needed |

> **Best practice:** Load a dictionary type once with `useDict` in a root component, then use `$dict.translate()` everywhere else.

## What You Learned

- [ ] Use `$dict.translate()` for synchronous translation in templates
- [ ] Use `$dict.translatePath()` for tree dictionary path hierarchies
- [ ] Use `$dict.getDictItem()` to get full dictionary item objects
- [ ] Understand the difference between `$dict` and `useDict().translate`
