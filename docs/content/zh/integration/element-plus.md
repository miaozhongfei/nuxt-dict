---
title: Element Plus 集成
description: 将字典模块与 Element Plus 组件配合使用的完整示例。
---

# Element Plus 集成

本章提供 6 个完整示例，展示字典模块与 Element Plus 常用组件的配合用法。

**前提**：项目中已安装 Element Plus。

## Select 下拉选择器

```vue
<template>
  <el-select v-model="value" placeholder="请选择性别" :loading="loading">
    <el-option v-for="opt in options" :key="opt.value" :label="opt.label" :value="opt.value" />
  </el-select>
</template>

<script setup lang="ts">
const { options, loading } = useDictOptions('gender')
const value = ref('')
</script>
```

## Table 列翻译

```vue
<template>
  <el-table :data="tableData" border stripe>
    <el-table-column prop="name" label="姓名" />
    <el-table-column prop="gender" label="性别">
      <template #default="{ row }">
        {{ $dict.translate('gender', row.gender) }}
      </template>
    </el-table-column>
    <el-table-column prop="status" label="状态">
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

function getStatusColor(code: number) {
  return (statusData.value?.find(i => i.code === code) as any)?.color
}

const tableData = ref([
  { name: '张三', gender: 'male', status: 1 },
  { name: '李四', gender: 'female', status: 0 },
])
</script>
```

## Cascader 级联选择器

```vue
<template>
  <el-cascader
    v-model="selected"
    :options="tree || []"
    :props="{ value: 'code', label: 'label', children: 'children' }"
    placeholder="请选择区域"
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
    <el-radio v-for="opt in options" :key="opt.value" :value="opt.value">
      {{ opt.label }}
    </el-radio>
  </el-radio-group>
</template>

<script setup lang="ts">
const { options, loading } = useDictOptions('gender')
const radio = ref('')
</script>
```

## Tags 标签

```vue
<template>
  <el-tag v-for="opt in options" :key="opt.value" :color="getColor(opt.value)" style="margin-right:8px;">
    {{ opt.label }}
  </el-tag>
</template>

<script setup lang="ts">
const { data, options } = useDict('industry')

function getColor(code: string | number) {
  return (data.value?.find(i => i.code === code) as any)?.color
}
</script>
```

## Form 表单

```vue
<template>
  <el-form :model="form" label-width="80px">
    <el-form-item label="性别">
      <el-select v-model="form.gender" :loading="gLoading">
        <el-option v-for="opt in gOpts" :key="opt.value" :label="opt.label" :value="opt.value" />
      </el-select>
    </el-form-item>
    <el-form-item label="行业">
      <el-select v-model="form.industry" :loading="iLoading">
        <el-option v-for="opt in iOpts" :key="opt.value" :label="opt.label" :value="opt.value" />
      </el-select>
    </el-form-item>
    <el-form-item label="区域">
      <el-cascader v-model="form.region" :options="rTree || []" :props="{ value: 'code', label: 'label', children: 'children' }" />
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
const { options: gOpts, loading: gLoading } = useDictOptions('gender')
const { options: iOpts, loading: iLoading } = useDictOptions('industry')
const { tree: rTree } = useDictTree('region')

const form = reactive({ gender: '', industry: '', region: [] })
</script>
```
