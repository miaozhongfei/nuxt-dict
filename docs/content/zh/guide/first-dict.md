---
title: 第一个字典功能
description: 从零开始，用 useDictOptions 写出你的第一个字典下拉框。
---

# 第一个字典功能

**本章目标**：独立写出一个"性别下拉框"，从后端字典接口获取选项数据并渲染在页面上。

## 前提：准备字典数据

字典模块需要后端提供一个字典接口。为了让你快速上手，我们会在 Nuxt 项目里自己写一个假的接口作为演示。

在 `server/api/dict/` 目录下创建一个文件 `list.get.ts`：

::code-group
  ```ts [server/api/dict/list.get.ts]
  export default defineEventHandler(() => {
    return {
      version: '1.0.0',
      data: {
        gender: {
          type: 'gender',
          items: [
            { code: 'male', label: '男' },
            { code: 'female', label: '女' },
            { code: 'other', label: '其他' },
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
        baseURL: '',                       // 为空表示请求本地接口
        dictEndpoint: '/api/dict/list',    // 字典列表接口路径
      },
    },
  })
  ```
::

这个接口返回的数据结构是：
- `version`：版本号，用于判断数据是否更新过
- `data`：一个对象，key 是字典类型名（如 `gender`），value 是字典项列表

> **`baseURL: ''` 是什么意思？** 表示接口地址相对于当前网站本身。如果你有独立的字典服务，就把 `baseURL` 改成 `https://dict-api.example.com`。

## 写页面代码

打开 `pages/index.vue`，把内容改成：

```vue [pages/index.vue]
<template>
  <div style="max-width:400px;margin:40px auto;">
    <h2>性别选择</h2>
    <p v-if="loading" style="color:#999;">加载中...</p>
    <p v-else-if="error" style="color:red;">加载失败：{{ error }}</p>
    <div v-else>
      <select v-model="selected" style="width:100%;padding:8px;font-size:16px;">
        <option value="">请选择性别</option>
        <option v-for="opt in options" :key="opt.value" :value="opt.value">
          {{ opt.label }}
        </option>
      </select>
      <p style="margin-top:12px;">你选择的是：<strong>{{ selected }}</strong></p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const { options, loading, error } = useDictOptions('gender')
const selected = ref('')
</script>
```

## 运行查看效果

```bash
pnpm dev
```

打开 `http://localhost:3000/`，你应该看到：
1. 一个下拉框，有"请选择性别"、"男"、"女"、"其他"四个选项
2. 选择一个选项后，下方显示你选了什么

## 逐行解释

- `<select>` 是 HTML 原生的下拉框
- `v-model="selected"` 双向绑定：用户选什么，`selected` 就变成什么
- `v-for="opt in options"` 遍历字典选项，每个渲染一个 `<option>`
- `useDictOptions('gender')` 告诉模块："我需要 gender 这个字典类型的数据"
- `options` 返回 `[{ label: '男', value: 'male' }, ...]`，直接喂给下拉框
- `loading` / `error` 分别表示加载中 / 加载失败

`useDictOptions` 内部做了这些事：
1. 先检查内存缓存中有没有 `gender` 的数据
2. 没有的话检查 IndexedDB（浏览器数据库）
3. 再没有的话向后端 `/api/dict/list?types=gender` 发请求
4. 拿到数据后把 `{ code, label }` 转成 `{ value, label }`

## 注意事项

> 如果你对接的是现有的后端接口，格式可能不一样。模块支持 [自定义适配器](/advanced/custom-adapter)，可以适配任何接口格式。

## 本章你学会了

- [ ] 在 `server/api/` 下创建一个模拟字典接口
- [ ] 配置 `nuxt.config.ts` 中的 `dict.api` 指向字典接口
- [ ] 用 `useDictOptions()` 获取字典数据并渲染下拉框
- [ ] 理解 `loading`、`error`、`options` 的各自用途
