---
title: Vant 集成
description: 将字典模块与 Vant 移动端组件配合使用的完整示例。
---

# Vant 集成

本章提供 Vant 移动端组件的字典集成示例。

**前提**：项目中已安装 Vant。

## Picker 选择器

```vue
<template>
  <van-field v-model="selectedText" is-link readonly label="性别" placeholder="请选择性别" @click="showPicker = true" />
  <van-popup v-model:show="showPicker" round position="bottom">
    <van-picker :columns="pickerColumns" @confirm="onConfirm" @cancel="showPicker = false" />
  </van-popup>
</template>

<script setup lang="ts">
const { options } = useDict('gender')
const showPicker = ref(false)
const selectedText = ref('')

const pickerColumns = computed(() =>
  options.value.map(opt => ({ text: opt.label, value: opt.value }))
)

function onConfirm({ selectedOptions }: any) {
  selectedText.value = selectedOptions[0]?.text ?? ''
  showPicker.value = false
}
</script>
```

## DropdownMenu 下拉菜单

```vue
<template>
  <van-dropdown-menu>
    <van-dropdown-item v-model="status" :options="statusCols" title="状态" />
    <van-dropdown-item v-model="gender" :options="genderCols" title="性别" />
  </van-dropdown-menu>
</template>

<script setup lang="ts">
const { options: statusOptions } = useDict('status')
const { options: genderOptions } = useDict('gender')

const status = ref('')
const gender = ref('')

const statusCols = computed(() => statusOptions.value.map(o => ({ text: o.label, value: o.value })))
const genderCols = computed(() => genderOptions.value.map(o => ({ text: o.label, value: o.value })))
</script>
```

## Cascader 级联选择

```vue
<template>
  <van-field v-model="cascaderText" is-link readonly label="区域" placeholder="请选择区域" @click="showCascader = true" />
  <van-popup v-model:show="showCascader" round position="bottom">
    <van-cascader v-model="cascaderValue" title="请选择区域" :options="vantTree" @close="showCascader = false" @finish="onFinish" />
  </van-popup>
</template>

<script setup lang="ts">
const { tree } = useDictTree('region')
const showCascader = ref(false)
const cascaderValue = ref('')
const cascaderText = ref('')

const vantTree = computed(() => {
  if (!tree.value) return []
  return toVant(tree.value)
})

function toVant(nodes: any[]): any[] {
  return nodes.map(n => ({ text: n.label, value: n.value, children: n.children ? toVant(n.children) : undefined }))
}

function onFinish({ selectedOptions }: any) {
  cascaderText.value = selectedOptions.map((o: any) => o.text).join(' / ')
  showCascader.value = false
}
</script>
```

## Radio 单选框

```vue
<template>
  <van-radio-group v-model="radio">
    <van-radio v-for="opt in options" :key="opt.value" :name="opt.value">{{ opt.label }}</van-radio>
  </van-radio-group>
</template>

<script setup lang="ts">
const { options } = useDict('gender')
const radio = ref('')
</script>
```
