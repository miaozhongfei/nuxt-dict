---
title: Vanilla Vue Integration
description: Use dictionary data with native HTML elements, no UI library required.
---

# Vanilla Vue Integration

No UI library needed — these examples use only native HTML elements.

## Native Select

```vue
<template>
  <p v-if="loading">Loading...</p>
  <select v-else v-model="selected">
    <option value="">Select</option>
    <option v-for="opt in options" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
  </select>
  <p>Selected: {{ selected }}</p>
</template>

<script setup lang="ts">
const { options, loading } = useDict('gender')
const selected = ref('')
</script>
```

## Native Table Column Translation

```vue
<template>
  <table border="1" cellpadding="8" cellspacing="0" style="border-collapse:collapse;">
    <thead><tr><th>Name</th><th>Gender</th><th>Status</th></tr></thead>
    <tbody>
      <tr v-if="!genderData || !statusData">
        <td colspan="3" style="text-align:center;">Loading...</td>
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
  { id: 1, name: 'John', gender: 'male', status: 1 },
  { id: 2, name: 'Jane', gender: 'female', status: 0 },
]
</script>
```

## Custom Tree Component

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
