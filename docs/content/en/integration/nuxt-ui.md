---
title: Nuxt UI Integration
description: Complete examples of using the dictionary module with Nuxt UI components.
---

This chapter provides 6 complete examples showing how to use the dictionary module with common Nuxt UI components.

**Prerequisite**: `@nuxt/ui` is installed in your project.

## USelect Dropdown

`useDict` returns `{ label, value }[]` which is directly compatible with Nuxt UI's `items` prop — no conversion needed.

```vue
<template>
  <USelect v-model="value" :items="options" placeholder="Select gender" :loading="loading" />
</template>

<script setup lang="ts">
const { options, loading } = useDict('gender');
const value = ref('');
</script>
```

## UTable Column Translation

```vue
<template>
  <UTable :rows="tableData" :columns="columns" />
</template>

<script setup lang="ts">
const { data: statusData } = useDict('status');

function getStatusColor(value: number) {
  return (statusData.value?.find((i) => i.value === code) as any)?.color;
}

const columns = computed(() => [
  { key: 'name', label: 'Name' },
  { key: 'gender', label: 'Gender' },
  {
    key: 'status',
    label: 'Status',
    cell: ({ row }: { row: any }) =>
      h(UBadge, {
        color: getStatusColor(row.status) as any,
        label: $dict.translate('status', row.status) as string,
      }),
  },
]);

const tableData = ref([
  { name: 'Alice', gender: 'female', status: 1 },
  { name: 'Bob', gender: 'male', status: 0 },
]);
</script>
```

## Tree Dictionary (Nested Select)

Nuxt UI has no native Cascader. Use `USelectMenu` with nested `children` for drill-down selection:

```vue
<template>
  <USelectMenu
    v-model="selected"
    :items="cascaderItems"
    placeholder="Select region"
    searchable
    :loading="loading"
  />
</template>

<script setup lang="ts">
const { tree, loading, translate } = useDictTree('region');

// Convert tree nodes to USelectMenu-compatible nested format
const cascaderItems = computed(() => {
  function convert(nodes: any[]): any[] {
    return nodes.map((n) => ({
      label: n.label,
      value: n.value,
      children: n.children && n.children.length > 0 ? convert(n.children) : undefined,
    }));
  }
  return tree.value ? convert(tree.value) : [];
});

const selected = ref('');
</script>
```

## URadioGroup / UCheckbox

```vue
<template>
  <div class="flex flex-col gap-2">
    <URadioGroup v-model="radio" :items="options" :loading="loading" />
    <UCheckbox
      v-for="opt in options"
      :key="opt.value"
      v-model="checkbox"
      :value="opt.value"
      :label="opt.label"
    />
  </div>
</template>

<script setup lang="ts">
const { options, loading } = useDict('gender');
const radio = ref('');
const checkbox = ref<string[]>([]);
</script>
```

## UBadge Status Labels

```vue
<template>
  <div class="flex gap-2">
    <UBadge
      v-for="opt in options"
      :key="opt.value"
      :label="opt.label"
      :color="getBadgeColor(opt.value) as any"
      variant="subtle"
    />
  </div>
</template>

<script setup lang="ts">
const { data, options } = useDict('status');

function getBadgeColor(value: string | number) {
  return (data.value?.find((i) => i.value === code) as any)?.color ?? 'neutral';
}
</script>
```

## UForm (Multiple Dictionaries)

```vue
<template>
  <UForm :state="form" class="space-y-4">
    <UFormGroup label="Gender" name="gender">
      <USelect v-model="form.gender" :items="gOpts" :loading="gLoading" />
    </UFormGroup>
    <UFormGroup label="Industry" name="industry">
      <USelect v-model="form.industry" :items="iOpts" :loading="iLoading" />
    </UFormGroup>
    <UFormGroup label="Status" name="status">
      <USelectMenu v-model="form.status" :items="sOpts" :loading="sLoading" />
    </UFormGroup>
  </UForm>
</template>

<script setup lang="ts">
const { options: gOpts, loading: gLoading } = useDict('gender');
const { options: iOpts, loading: iLoading } = useDict('industry');
const { options: sOpts, loading: sLoading } = useDict('status');

const form = reactive({ gender: '', industry: '', status: '' });
</script>
```
