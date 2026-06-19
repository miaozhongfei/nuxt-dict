---
title: useDict
description: Complete useDict usage guide — fetch dictionary data and translate.
---

**Goal**: Master all `useDict` usage patterns, including basic translation, loading/error handling, manual refresh, and specifying stores.

## When do you need this?

- A table's "Status" column stores `0` / `1`, but you want users to see "Enabled" / "Disabled"
- You need both raw dictionary data and translation capability
- You want full control over how dictionary data is rendered

## Full Signature

```ts
// Default store
useDict(type: string): UseDictReturn

// Specific store
useDict(storeName: string, type: string): UseDictReturn
```

## Return Values

| Property      | Type                                                 | Description                                                                                                                   |
| ------------- | ---------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| `data`        | `ShallowRef<DictItem[] \| null>`                     | Raw dictionary data array. Starts as `null`, becomes `[{ value: 0, label: 'Disabled' }, ...]` after loading                   |
| `translate`   | `(value: string \| number) => string`                | Synchronous translation function. Input code, output the corresponding label. Falls back to the code as a string if not found |
| `getDictItem` | `(value: string \| number) => DictItem \| undefined` | Synchronously get the full dictionary item object. Returns `{ value, label, ... }`, or `undefined` on cache miss              |
| `loading`     | `Ref<boolean>`                                       | Whether data is loading                                                                                                       |
| `error`       | `Ref<string \| null>`                                | Error message on failure                                                                                                      |
| `refresh`     | `() => Promise<void>`                                | Force refresh, skipping cache                                                                                                 |

## Basic Example

```vue
<template>
  <div>
    <p v-if="loading">Loading...</p>

    <div v-else-if="error" style="background:#fef0f0;padding:16px;border-radius:8px;">
      <p style="color:#F56C6C;">{{ error }}</p>
      <button @click="doRefresh">Retry</button>
    </div>

    <table v-else border="1" cellpadding="6" cellspacing="0" style="border-collapse:collapse;">
      <thead>
        <tr>
          <th>Code</th>
          <th>Label</th>
          <th>Translate Check</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in data" :key="item.value">
          <td>{{ item.value }}</td>
          <td>{{ item.label }}</td>
          <td>{{ translate(item.value) }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
const { data, translate, loading, error, refresh } = useDict('status');

function doRefresh() {
  refresh();
}
</script>
```

## Translation Function Details

`translate(value)` is synchronous and only looks up data already loaded into the memory cache. No network request needed:

```vue
<template>
  <table>
    <tr v-for="user in userList" :key="user.id">
      <td>{{ user.name }}</td>
      <td>{{ translate(user.status) }}</td>
    </tr>
  </table>
</template>
```

> **Why is translation synchronous?** Once `useDict('status')` has finished loading data on mount, the `status` dictionary data is in memory. Subsequent `translate()` calls look up directly from memory.

## Get Full Dictionary Item (getDictItem)

Use when you need the full `DictItem` object rather than a string translation of a single field. For example, to access the `color` field for component properties.

```vue
<template>
  <el-tag :color="statusItem?.color as string" effect="dark">
    {{ statusItem?.label }}
  </el-tag>
</template>

<script setup lang="ts">
const { getDictItem } = useDict('status');

const statusItem = computed(() => getDictItem(1));
// → { value: 1, label: 'Enabled', color: '#67C23A' }
</script>
```

> `getDictItem` is also synchronous, looking up from the memory cache. Returns `undefined` on cache miss.

## Automatic Code Type Conversion

Dictionary item codes may be `number` (e.g., `0`), while your business data may be `string` (e.g., `'0'`). `translate()` automatically converts both to strings for comparison:

```ts
translate(0); // → 'Disabled'
translate('0'); // → 'Disabled'
```

## Manual Refresh

Call `refresh()` to force a re-fetch from the server, skipping both memory and IndexedDB caches.

## Specifying a Store

```vue
<script setup lang="ts">
// Default store 'dicts'
const { data } = useDict('gender');

// Store 'payment'
const { data: payData } = useDict('payment', 'status');
</script>
```

See [Multi-Store](/advanced/multi-store) for details.

## Scope & Reactivity

`useDict` is a **component-level** composable. Each calling component holds its own `shallowRef`. Data is auto-fetched on mount (`onMounted`), and the template re-renders automatically when data changes. Locale switches trigger auto-reload via `manager.locale` watcher.

- **Reactive**: Yes. `data` is a `ShallowRef` — Vue tracks reference changes, template updates automatically
- **Call site**: Must be called at the top level of `<script setup>`, not inside callbacks / conditionals / regular functions
- **Best for**: Template binding (select options, list rendering, tree display)

`$dict` is a **global** synchronous translator with no Vue reactivity. See [$dict Translate](/guide/dollar-dict).

:read-more{to="/guide/dollar-dict"}

## Notes

> `translate()` still works when `data` is `null`, but returns the code as a string. Ensure you use `v-if="data"` or loading state guards.

## What You Learned

- [ ] Use `useDict('type')` to get dictionary data and translation
- [ ] Handle `loading` / `error` states correctly
- [ ] Use `translate()` for code → label conversion
- [ ] Use `getDictItem()` to get full dictionary item objects (with extended fields)
- [ ] Call `refresh()` to force cache invalidation
- [ ] Use `useDict('store', 'type')` for specific stores
