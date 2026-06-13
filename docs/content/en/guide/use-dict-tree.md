---
title: useDictTree
description: Fetch, translate, and path-trace tree-structured dictionary data with unlimited depth.
---

# useDictTree

**Goal**: Master tree-structured dictionaries (like regions, organizational charts) — fetching, translating, and path lookup.

## When do you need this?

- You need a three-level region picker
- You store a district code (e.g., `440104`) but need to display the full path "Guangdong / Guangzhou / Yuexiu"
- You need to find all ancestor nodes of a given node

## Full Signature

```ts
useDictTree(type: string): UseDictTreeReturn
useDictTree(storeName: string, type: string): UseDictTreeReturn
```

## Return Values

| Property | Type | Description |
|----------|------|-------------|
| `tree` | `ShallowRef<TreeNode[] \| null>` | Complete tree data |
| `translate` | `(value: string \| number) => string` | Translate any node at any depth |
| `findPath` | `(value: string \| number) => string[]` | Path backtracking. Input a leaf node code, output label array from root to leaf |
| `loading` | `Ref<boolean>` | Loading state |
| `refresh` | `() => Promise<void>` | Manual refresh |

## findPath: Path Backtracking

```vue
<template>
  <p>Region value: 440104</p>
  <p>Full path: {{ findPath('440104').join(' / ') }}</p>
  <!-- Output: Guangdong / Guangzhou / Yuexiu -->
</template>

<script setup lang="ts">
const { findPath } = useDictTree('region')
</script>
```

## Integration with Element Plus Cascader

```vue
<template>
  <el-cascader
    v-model="selected"
    :options="tree || []"
    :props="{ value: 'value', label: 'label', children: 'children' }"
    placeholder="Select region"
    clearable
  />
</template>

<script setup lang="ts">
const { tree } = useDictTree('region')
const selected = ref([])
</script>
```

## Unlimited Depth

`useDictTree` supports arbitrary depth. Both `translate` and `findPath` recurse correctly regardless of tree depth.

## Notes

> `findPath` only searches within already loaded `tree` data. Ensure `tree.value` is not `null` before calling it.

## What You Learned

- [ ] Use `useDictTree` for tree dictionary data
- [ ] Use `findPath` for code → full path backtracking
- [ ] Integrate with Element Plus Cascader
