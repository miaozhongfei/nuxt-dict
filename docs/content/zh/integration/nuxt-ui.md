---
title: Nuxt UI 集成
description: 将字典模块与 Nuxt UI 组件配合使用的完整示例。
---

本章提供 6 个完整示例，展示字典模块与 Nuxt UI 常用组件的配合用法。

**前提**：项目中已安装 `@nuxt/ui`。

## USelect 下拉选择器

`useDict` 返回的 `{ label, value }[]` 与 Nuxt UI 的 `items` prop 直接兼容，无需转换。

```vue
<template>
  <USelect v-model="value" :items="options" placeholder="请选择性别" :loading="loading" />
</template>

<script setup lang="ts">
const { options, loading } = useDict('gender');
const value = ref('');
</script>
```

## UTable 表格列翻译

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
  { key: 'name', label: '姓名' },
  { key: 'gender', label: '性别' },
  {
    key: 'status',
    label: '状态',
    cell: ({ row }: { row: any }) =>
      h(UBadge, {
        color: getStatusColor(row.status) as any,
        label: $dict.translate('status', row.status) as string,
      }),
  },
]);

const tableData = ref([
  { name: '张三', gender: 'male', status: 1 },
  { name: '李四', gender: 'female', status: 0 },
]);
</script>
```

## 树形字典（嵌套级联选择）

Nuxt UI 没有内置 Cascader，通过 `USelectMenu` 的嵌套 `children` 属性实现级联：

```vue
<template>
  <USelectMenu
    v-model="selected"
    :items="cascaderItems"
    placeholder="请选择区域"
    searchable
    :loading="loading"
  />
</template>

<script setup lang="ts">
const { tree, loading, translate } = useDictTree('region');

// 转码成 USelectMenu 兼容的嵌套格式
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

## UBadge 状态标签

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

## UForm 表单（多字典组合）

```vue
<template>
  <UForm :state="form" class="space-y-4">
    <UFormGroup label="性别" name="gender">
      <USelect v-model="form.gender" :items="gOpts" :loading="gLoading" />
    </UFormGroup>
    <UFormGroup label="行业" name="industry">
      <USelect v-model="form.industry" :items="iOpts" :loading="iLoading" />
    </UFormGroup>
    <UFormGroup label="状态" name="status">
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
