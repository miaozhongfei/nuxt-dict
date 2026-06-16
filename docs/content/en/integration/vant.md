---
title: Vant Integration
description: Complete examples of using the dictionary module with Vant mobile components.
---

Full examples of using the dictionary module with Vant mobile components.

**Prerequisite**: Vant installed in your project.

## Picker

```vue
<template>
  <van-field
    v-model="selectedText"
    is-link
    readonly
    label="Gender"
    placeholder="Select"
    @click="showPicker = true"
  />
  <van-popup v-model:show="showPicker" round position="bottom">
    <van-picker :columns="pickerColumns" @confirm="onConfirm" @cancel="showPicker = false" />
  </van-popup>
</template>

<script setup lang="ts">
const { options } = useDict('gender');
const showPicker = ref(false);
const selectedText = ref('');

const pickerColumns = computed(() =>
  options.value.map((opt) => ({ text: opt.label, value: opt.value })),
);

function onConfirm({ selectedOptions }: any) {
  selectedText.value = selectedOptions[0]?.text ?? '';
  showPicker.value = false;
}
</script>
```

## DropdownMenu

```vue
<template>
  <van-dropdown-menu>
    <van-dropdown-item v-model="status" :options="statusCols" title="Status" />
    <van-dropdown-item v-model="gender" :options="genderCols" title="Gender" />
  </van-dropdown-menu>
</template>

<script setup lang="ts">
const { options: statusOptions } = useDict('status');
const { options: genderOptions } = useDict('gender');

const statusCols = computed(() =>
  statusOptions.value.map((o) => ({ text: o.label, value: o.value })),
);
const genderCols = computed(() =>
  genderOptions.value.map((o) => ({ text: o.label, value: o.value })),
);
</script>
```

## Cascader

```vue
<template>
  <van-field v-model="cascaderText" is-link readonly label="Region" @click="show = true" />
  <van-popup v-model:show="show" round position="bottom">
    <van-cascader v-model="value" title="Select Region" :options="vantTree" @finish="onFinish" />
  </van-popup>
</template>

<script setup lang="ts">
const { tree } = useDictTree('region');

const vantTree = computed(() => {
  if (!tree.value) return [];
  return tree.value.map((n) => ({
    text: n.label,
    value: n.value,
    children: n.children?.length
      ? n.children.map((c) => ({ text: c.label, value: c.code }))
      : undefined,
  }));
});
</script>
```

## Radio

```vue
<template>
  <van-radio-group v-model="radio">
    <van-radio v-for="opt in options" :key="opt.value" :name="opt.value">{{ opt.label }}</van-radio>
  </van-radio-group>
</template>

<script setup lang="ts">
const { options } = useDict('gender');
const radio = ref('');
</script>
```
