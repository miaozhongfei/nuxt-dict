---
title: 纯 Vue 集成
description: 不依赖任何 UI 库，用原生 HTML 元素使用字典数据。
---

# 纯 Vue 集成

不依赖任何 UI 库也能用字典模块。以下示例全部使用原生 HTML 元素。

## 原生 Select 下拉框

```vue
<template>
  <div>
    <p v-if="loading">加载中...</p>
    <select v-else v-model="selected">
      <option value="">请选择</option>
      <option v-for="opt in options" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
    </select>
    <p>选中: {{ selected }}</p>
  </div>
</template>

<script setup lang="ts">
const { options, loading } = useDict('gender')
const selected = ref('')
</script>
```

## 原生 Table 列翻译

```vue
<template>
  <table border="1" cellpadding="8" cellspacing="0" style="border-collapse:collapse;">
    <thead>
      <tr><th>姓名</th><th>性别</th><th>状态</th></tr>
    </thead>
    <tbody>
      <tr v-if="!genderData || !statusData">
        <td colspan="3" style="text-align:center;">加载中...</td>
      </tr>
      <tr v-else v-for="user in users" :key="user.id">
        <td>{{ user.name }}</td>
        <td>{{ $dict.translate('gender', user.gender) }}</td>
        <td>{{ $dict.translate('status', user.status) }}</td>
      </tr>
    </tbody>
  </table>
</template>

<script setup lang="ts">
const { data: genderData } = useDict('gender')
const { data: statusData } = useDict('status')

const users = [
  { id: 1, name: '张三', gender: 'male', status: 1 },
  { id: 2, name: '李四', gender: 'female', status: 0 },
]
</script>
```

## 自定义 Tree 组件

```vue
<template>
  <ul v-if="tree" style="list-style:none;padding-left:0;">
    <li v-for="node in tree" :key="node.value">
      <details>
        <summary>{{ node.label }} ({{ node.value }})</summary>
        <ul v-if="node.children" style="list-style:none;padding-left:20px;">
          <li v-for="child in node.children" :key="child.value">
            <details v-if="child.children?.length">
              <summary>{{ child.label }} ({{ child.value }})</summary>
              <ul style="list-style:none;padding-left:20px;">
                <li v-for="leaf in child.children" :key="leaf.value">{{ leaf.label }} ({{ leaf.value }})</li>
              </ul>
            </details>
            <span v-else>{{ child.label }} ({{ child.value }})</span>
          </li>
        </ul>
      </details>
    </li>
  </ul>
</template>

<script setup lang="ts">
const { tree } = useDictTree('region')
</script>
```
