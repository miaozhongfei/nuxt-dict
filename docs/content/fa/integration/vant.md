---
title: یکپارچه‌سازی با Vant
description: مثال‌های کامل استفاده از ماژول دیکشنری با کامپوننت‌های موبایل Vant.
---

**پیش‌نیاز**: Vant در پروژه نصب و پیکربندی شده باشد.

## مثال ۱: انتخاب‌گر Picker

```vue
<template>
  <van-field
    v-model="selectedText"
    is-link readonly
    label="جنسیت"
    placeholder="لطفاً انتخاب کنید"
    @click="showPicker = true"
  />
  <van-popup v-model:show="showPicker" round position="bottom">
    <van-picker
      :columns="pickerColumns"
      @confirm="onConfirm"
      @cancel="showPicker = false"
    />
  </van-popup>
</template>

<script setup lang="ts">
const { options } = useDict('gender')
const showPicker = ref(false)
const selectedText = ref('')
const selectedValue = ref('')

// تبدیل به فرمت مورد نیاز vant picker
const pickerColumns = computed(() =>
  options.value.map(opt => ({ text: opt.label, value: opt.value }))
)

function onConfirm({ selectedOptions }: any) {
  selectedText.value = selectedOptions[0]?.text ?? ''
  selectedValue.value = selectedOptions[0]?.value ?? ''
  showPicker.value = false
}
</script>
```

## مثال ۲: منوی کشویی DropdownMenu

```vue
<template>
  <van-dropdown-menu>
    <van-dropdown-item v-model="status" :options="statusPickerOptions" title="وضعیت" />
    <van-dropdown-item v-model="gender" :options="genderPickerOptions" title="جنسیت" />
  </van-dropdown-menu>
</template>

<script setup lang="ts">
const { options: statusOptions } = useDict('status')
const { options: genderOptions } = useDict('gender')

const status = ref('')
const gender = ref('')

const statusPickerOptions = computed(() =>
  statusOptions.value.map(opt => ({ text: opt.label, value: opt.value }))
)
const genderPickerOptions = computed(() =>
  genderOptions.value.map(opt => ({ text: opt.label, value: opt.value }))
)
</script>
```

## مثال ۳: انتخاب‌گر آبشاری Cascader

```vue
<template>
  <van-field v-model="cascaderText" is-link readonly label="منطقه" @click="show = true" />
  <van-popup v-model:show="show" round position="bottom">
    <van-cascader v-model="value" title="انتخاب منطقه" :options="vantTree" @finish="onFinish" />
  </van-popup>
</template>

<script setup lang="ts">
const { tree } = useDictTree('region')
const show = ref(false)
const value = ref('')
const cascaderText = ref('')

const vantTree = computed(() => {
  if (!tree.value) return []
  return convertTree(tree.value)
})

function convertTree(nodes: any[]): any[] {
  return nodes.map(node => ({
    text: node.label,
    value: node.value,
    children: node.children?.length ? convertTree(node.children) : undefined,
  }))
}

function onFinish({ selectedOptions }: any) {
  cascaderText.value = selectedOptions.map((o: any) => o.text).join(' / ')
  show.value = false
}
</script>
```

## مثال ۴: دکمه رادیویی Radio

```vue
<template>
  <van-radio-group v-model="radio">
    <van-radio v-for="opt in radioOptions" :key="opt.value" :name="opt.value">
      {{ opt.label }}
    </van-radio>
  </van-radio-group>
</template>

<script setup lang="ts">
const { options: radioOptions } = useDict('gender')
const radio = ref('')
</script>
```
