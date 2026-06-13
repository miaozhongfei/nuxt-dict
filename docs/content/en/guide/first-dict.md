---
title: Your First Dictionary
description: From scratch, write your first dictionary dropdown using useDict.
---

# Your First Dictionary

**Goal**: Write a "gender dropdown" that fetches option data from a backend dictionary API and renders it on the page.

## Prerequisite: Prepare Dictionary Data

The dictionary module requires a backend API. To get you started quickly, we'll create a mock API within the Nuxt project.

Create a file at `server/api/dict/list.get.ts`:

::code-group
  ```ts [server/api/dict/list.get.ts]
  export default defineEventHandler(() => {
    return {
      version: '1.0.0',
      data: {
        gender: {
          type: 'gender',
          items: [
            { value: 'male', label: 'Male' },
            { value: 'female', label: 'Female' },
            { value: 'other', label: 'Other' },
          ],
        },
      },
    }
  })
  ```

  ```ts [nuxt.config.ts]
  export default defineNuxtConfig({
    modules: ['@lacqjs/nuxt-dict'],
    dict: {
      api: {
        baseURL: '',
        dictEndpoint: '/api/dict/list',
      },
    },
  })
  ```
::

> **What does `baseURL: ''` mean?** The API address is relative to your website. If you have a separate dictionary service, change `baseURL` to `https://dict-api.example.com`.

## Write the page

Open `pages/index.vue` and replace the content:

```vue [pages/index.vue]
<template>
  <div style="max-width:400px;margin:40px auto;">
    <h2>Gender Selection</h2>
    <p v-if="loading" style="color:#999;">Loading...</p>
    <p v-else-if="error" style="color:red;">Failed: {{ error }}</p>
    <div v-else>
      <select v-model="selected" style="width:100%;padding:8px;font-size:16px;">
        <option value="">Select gender</option>
        <option v-for="opt in options" :key="opt.value" :value="opt.value">
          {{ opt.label }}
        </option>
      </select>
      <p style="margin-top:12px;">Selected: <strong>{{ selected }}</strong></p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const { options, loading, error } = useDict('gender')
const selected = ref('')
</script>
```

## Run and see the result

```bash
pnpm dev
```

Open `http://localhost:3000/`, you should see:
1. A dropdown with "Select gender", "Male", "Female", "Other" four options
2. After selecting, the chosen value appears below

## How it works

- `useDict('gender')` tells the module: "I need the gender dictionary type data"
- `options` returns `[{ label: 'Male', value: 'male' }, ...]`, ready to feed into dropdowns
- `loading` / `error` represent the loading state

Internally, `useDict`:
1. Checks memory cache for `gender` data
2. Falls back to IndexedDB (browser database)
3. Falls back to fetching `/api/dict/list?types=gender`
4. Converts `{ code, label }` to `{ value, label }`

## What You Learned

- [ ] Create a mock dictionary API in `server/api/`
- [ ] Configure `dict.api` to point to the API
- [ ] Use `useDict()` to fetch dictionary data and render a dropdown
- [ ] Understand `loading`, `error`, and `options`
