---
title: یکپارچه‌سازی با Vue خالص
description: استفاده از داده‌های دیکشنری با عناصر HTML بومی، بدون نیاز به کتابخانه UI.
---

# یکپارچه‌سازی با Vue خالص

بدون وابستگی به هیچ کتابخانه UI هم می‌توان از ماژول دیکشنری استفاده کرد. مثال‌های زیر همگی از عناصر HTML بومی استفاده می‌کنند.

## مثال ۱: کشویی Select بومی

```vue
<template>
  <div>
    <p v-if="loading">در حال بارگذاری...</p>
    <select v-else v-model="selected">
      <option value="">لطفاً انتخاب کنید</option>
      <option v-for="opt in options" :key="opt.value" :value="opt.value">
        {{ opt.label }}
      </option>
    </select>
    <p>انتخاب: {{ selected }}</p>
  </div>
</template>

<script setup lang="ts">
const { options, loading } = useDictOptions('gender')
const selected = ref('')
</script>
```

## مثال ۲: ترجمه ستون Table بومی

```vue
<template>
  <table border="1" cellpadding="8" cellspacing="0" style="border-collapse:collapse;">
    <thead>
      <tr><th>نام</th><th>جنسیت</th><th>وضعیت</th></tr>
    </thead>
    <tbody>
      <tr v-if="!genderData || !statusData">
        <td colspan="3" style="text-align:center;">در حال بارگذاری...</td>
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
  { id: 1, name: 'علی', gender: 'male', status: 1 },
  { id: 2, name: 'مریم', gender: 'female', status: 0 },
]
</script>
```

## مثال ۳: کامپوننت درختی سفارشی

```vue
<template>
  <div>
    <p v-if="loading">در حال بارگذاری...</p>
    <ul v-else style="list-style:none;padding-left:0;">
      <li v-for="node in tree" :key="node.code">
        <details>
          <summary>{{ node.label }} ({{ node.code }})</summary>
          <ul v-if="node.children" style="list-style:none;padding-left:20px;">
            <li v-for="child in node.children" :key="child.code">
              <details v-if="child.children?.length">
                <summary>{{ child.label }} ({{ child.code }})</summary>
                <ul style="list-style:none;padding-left:20px;">
                  <li v-for="leaf in child.children" :key="leaf.code">
                    {{ leaf.label }} ({{ leaf.code }})
                  </li>
                </ul>
              </details>
              <span v-else>{{ child.label }} ({{ child.code }})</span>
            </li>
          </ul>
        </details>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
const { tree, loading } = useDictTree('region')
</script>
```
