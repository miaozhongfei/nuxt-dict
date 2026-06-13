---
title: Element Plus Integration
description: Complete examples of using the dictionary module with Element Plus components.
---

# Element Plus Integration

Full examples of using the dictionary module with common Element Plus components.

**Prerequisite**: Element Plus installed in your project.

## Select

```vue
<template>
  <el-select v-model="value" placeholder="Select gender" :loading="loading">
    <el-option v-for="opt in options" :key="opt.value" :label="opt.label" :value="opt.value" />
  </el-select>
</template>

<script setup lang="ts">
const { options, loading } = useDict('gender')
const value = ref('')
</script>
```

## Table Column Translation

```vue
<template>
  <el-table :data="tableData" border stripe>
    <el-table-column prop="name" label="Name" />
    <el-table-column prop="gender" label="Gender">
      <template #default="{ row }">
        {{ $dict.translate('gender', row.gender) }}
      </template>
    </el-table-column>
    <el-table-column prop="status" label="Status">
      <template #default="{ row }">
        <el-tag :color="getStatusColor(row.status)">
          {{ $dict.translate('status', row.status) }}
        </el-tag>
      </template>
    </el-table-column>
  </el-table>
</template>

<script setup lang="ts">
const { data: statusData } = useDict('status')

function getStatusColor(value: number) {
  return (statusData.value?.find(i => i.value === code) as any)?.color
}

const tableData = ref([
  { name: 'John', gender: 'male', status: 1 },
  { name: 'Jane', gender: 'female', status: 0 },
])
</script>
```

## Cascader

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
const selected = ref<string[]>([])
</script>
```

## Radio / Checkbox

```vue
<template>
  <el-radio-group v-model="radio" :loading="loading">
    <el-radio v-for="opt in options" :key="opt.value" :value="opt.value">{{ opt.label }}</el-radio>
  </el-radio-group>
</template>

<script setup lang="ts">
const { options, loading } = useDict('gender')
const radio = ref('')
</script>
```

## Tags

```vue
<template>
  <el-tag v-for="opt in options" :key="opt.value" :color="getColor(opt.value)" style="margin-right:8px;">
    {{ opt.label }}
  </el-tag>
</template>

<script setup lang="ts">
const { data, options } = useDict('industry')

function getColor(value: string | number) {
  return (data.value?.find(i => i.value === code) as any)?.color
}
</script>
```

## Form

```vue
<script setup lang="ts">
const { options: gOpts, loading: gLoading } = useDict('gender')
const { options: iOpts, loading: iLoading } = useDict('industry')
const { tree: rTree } = useDictTree('region')

const form = reactive({ gender: '', industry: '', region: [] })
</script>
```
