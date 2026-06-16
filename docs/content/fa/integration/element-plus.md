---
title: یکپارچه‌سازی با Element Plus
description: مثال‌های کامل استفاده از ماژول دیکشنری با کامپوننت‌های Element Plus.
---

این فصل ۶ مثال کامل از نحوه استفاده از ماژول دیکشنری با کامپوننت‌های رایج Element Plus ارائه می‌دهد.

**پیش‌نیاز**: Element Plus در پروژه نصب و پیکربندی شده باشد.

## مثال ۱: انتخاب‌گر کشویی Select

```vue
<template>
  <el-select v-model="value" placeholder="جنسیت را انتخاب کنید" :loading="loading">
    <el-option v-for="opt in options" :key="opt.value" :label="opt.label" :value="opt.value" />
  </el-select>
</template>

<script setup lang="ts">
const { options, loading } = useDict('gender');
const value = ref('');
</script>
```

## مثال ۲: ترجمه ستون Table

```vue
<template>
  <el-table :data="tableData" border stripe>
    <el-table-column prop="name" label="نام" />
    <el-table-column prop="gender" label="جنسیت">
      <template #default="{ row }">
        {{ $dict.translate('gender', row.gender) }}
      </template>
    </el-table-column>
    <el-table-column prop="status" label="وضعیت">
      <template #default="{ row }">
        <el-tag :color="getStatusColor(row.status)">
          {{ $dict.translate('status', row.status) }}
        </el-tag>
      </template>
    </el-table-column>
  </el-table>
</template>

<script setup lang="ts">
// بارگذاری داده‌های دیکشنری وضعیت برای دریافت رنگ
const { data: statusData } = useDict('status');

function getStatusColor(value: number): string | undefined {
  const item = statusData.value?.find((i) => i.value === code);
  return (item as any)?.color;
}

const tableData = ref([
  { name: 'علی', gender: 'male', status: 1 },
  { name: 'مریم', gender: 'female', status: 0 },
]);
</script>
```

## مثال ۳: انتخاب‌گر آبشاری Cascader

```vue
<template>
  <el-cascader
    v-model="selected"
    :options="tree || []"
    :props="{ value: 'value', label: 'label', children: 'children' }"
    placeholder="منطقه را انتخاب کنید"
    clearable
  />
  <p v-if="selected.length">
    مسیر کامل: {{ $dict.translatePath('region', selected[selected.length - 1]) }}
  </p>
</template>

<script setup lang="ts">
const { tree } = useDictTree('region');
const selected = ref<string[]>([]);
</script>
```

## مثال ۴: گروه Radio / Checkbox

```vue
<template>
  <el-radio-group v-model="radio" :loading="loading">
    <el-radio v-for="opt in options" :key="opt.value" :value="opt.value">
      {{ opt.label }}
    </el-radio>
  </el-radio-group>
</template>

<script setup lang="ts">
const { options, loading } = useDict('gender');
const radio = ref('');
</script>
```

## مثال ۵: رندر برچسب Tags

```vue
<template>
  <div>
    <el-tag
      v-for="opt in options"
      :key="opt.value"
      :color="getColor(opt.value)"
      style="margin-right: 8px;"
    >
      {{ opt.label }}
    </el-tag>
  </div>
</template>

<script setup lang="ts">
const { data, options } = useDict('industry');

function getColor(value: string | number): string | undefined {
  const item = data.value?.find((i) => i.value === code);
  return (item as any)?.color;
}
</script>
```

## مثال ۶: فرم Form

```vue
<template>
  <el-form :model="form" label-width="80px">
    <el-form-item label="جنسیت">
      <el-select v-model="form.gender" :loading="genderLoading">
        <el-option
          v-for="opt in genderOptions"
          :key="opt.value"
          :label="opt.label"
          :value="opt.value"
        />
      </el-select>
    </el-form-item>
    <el-form-item label="صنعت">
      <el-select v-model="form.industry" :loading="industryLoading">
        <el-option
          v-for="opt in industryOptions"
          :key="opt.value"
          :label="opt.label"
          :value="opt.value"
        />
      </el-select>
    </el-form-item>
    <el-form-item label="منطقه">
      <el-cascader
        v-model="form.region"
        :options="regionTree || []"
        :props="{ value: 'value', label: 'label', children: 'children' }"
      />
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
const { options: genderOptions, loading: genderLoading } = useDict('gender');
const { options: industryOptions, loading: industryLoading } = useDict('industry');
const { tree: regionTree } = useDictTree('region');

const form = reactive({ gender: '', industry: '', region: [] });
</script>
```
