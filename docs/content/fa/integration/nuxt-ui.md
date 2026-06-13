---
title: یکپارچه‌سازی با Nuxt UI
description: مثال‌های کامل از استفاده ماژول دیکشنری با کامپوننت‌های Nuxt UI.
---

# یکپارچه‌سازی با Nuxt UI

این فصل ۶ مثال کامل ارائه می‌دهد که نحوه استفاده از ماژول دیکشنری با کامپوننت‌های رایج Nuxt UI را نشان می‌دهد.

**پیش‌نیاز**: `@nuxt/ui` در پروژه شما نصب شده باشد.

## USelect (دراپ‌داون انتخاب)

`useDictOptions` آرایه‌ای از `{ label, value }` برمی‌گرداند که مستقیماً با prop `items` در Nuxt UI سازگار است — بدون نیاز به تبدیل.

```vue
<template>
  <USelect
    v-model="value"
    :items="options"
    placeholder="جنسیت را انتخاب کنید"
    :loading="loading"
  />
</template>

<script setup lang="ts">
const { options, loading } = useDictOptions('gender')
const value = ref('')
</script>
```

## UTable (ترجمه ستون جدول)

```vue
<template>
  <UTable :rows="tableData" :columns="columns" />
</template>

<script setup lang="ts">
const { data: statusData } = useDict('status')

function getStatusColor(code: number) {
  return (statusData.value?.find(i => i.code === code) as any)?.color
}

const columns = computed(() => [
  { key: 'name', label: 'نام' },
  { key: 'gender', label: 'جنسیت' },
  {
    key: 'status',
    label: 'وضعیت',
    cell: ({ row }: { row: any }) =>
      h(UBadge, {
        color: getStatusColor(row.status) as any,
        label: $dict.translate('status', row.status) as string,
      }),
  },
])

const tableData = ref([
  { name: 'آلیس', gender: 'female', status: 1 },
  { name: 'باب', gender: 'male', status: 0 },
])
</script>
```

## دیکشنری درختی (انتخاب تو در تو)

Nuxt UI Cascader بومی ندارد. از `USelectMenu` با `children` تو در تو برای انتخاب سطح به سطح استفاده کنید:

```vue
<template>
  <USelectMenu
    v-model="selected"
    :items="cascaderItems"
    placeholder="منطقه را انتخاب کنید"
    searchable
    :loading="loading"
  />
</template>

<script setup lang="ts">
const { tree, loading, translate } = useDictTree('region')

// تبدیل گره‌های درختی به فرمت تو در تو سازگار با USelectMenu
const cascaderItems = computed(() => {
  function convert(nodes: any[]): any[] {
    return nodes.map(n => ({
      label: n.label,
      value: n.code,
      children: n.children && n.children.length > 0 ? convert(n.children) : undefined,
    }))
  }
  return tree.value ? convert(tree.value) : []
})

const selected = ref('')
</script>
```

## URadioGroup / UCheckbox

```vue
<template>
  <div class="flex flex-col gap-2">
    <URadioGroup v-model="radio" :items="options" :loading="loading" />
    <UCheckbox v-for="opt in options" :key="opt.value" v-model="checkbox" :value="opt.value" :label="opt.label" />
  </div>
</template>

<script setup lang="ts">
const { options, loading } = useDictOptions('gender')
const radio = ref('')
const checkbox = ref<string[]>([])
</script>
```

## UBadge (برچسب‌های وضعیت)

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
const { data, options } = useDict('status')

function getBadgeColor(code: string | number) {
  return (data.value?.find(i => i.code === code) as any)?.color ?? 'neutral'
}
</script>
```

## UForm (چندین دیکشنری ترکیبی)

```vue
<template>
  <UForm :state="form" class="space-y-4">
    <UFormGroup label="جنسیت" name="gender">
      <USelect v-model="form.gender" :items="gOpts" :loading="gLoading" />
    </UFormGroup>
    <UFormGroup label="صنعت" name="industry">
      <USelect v-model="form.industry" :items="iOpts" :loading="iLoading" />
    </UFormGroup>
    <UFormGroup label="وضعیت" name="status">
      <USelectMenu v-model="form.status" :items="sOpts" :loading="sLoading" />
    </UFormGroup>
  </UForm>
</template>

<script setup lang="ts">
const { options: gOpts, loading: gLoading } = useDictOptions('gender')
const { options: iOpts, loading: iLoading } = useDictOptions('industry')
const { options: sOpts, loading: sLoading } = useDictOptions('status')

const form = reactive({ gender: '', industry: '', status: '' })
</script>
```
