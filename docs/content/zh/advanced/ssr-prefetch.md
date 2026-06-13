---
title: SSR 预取
description: 在服务端渲染时预取字典数据，加速首屏展示。
---

**本章目标**：理解 SSR 预取的工作原理，配置需要预取的字典类型以优化首屏性能。

## 为什么需要预取？

默认流程：

```
浏览器显示 HTML → Vue 接管（hydration）
  → useDict 在 onMounted 中发起请求 → 数据加载 → 更新页面
```

问题：hydration 到数据加载完成之间，用户会看到 **loading 状态**或**code 原文**。

启用预取后：

```
服务端渲染 HTML
  → 同时：服务端预取字典数据，注入 HTML payload
    → 浏览器直接看到翻译后的文字
      → Vue 接管，从 payload 读取数据到内存缓存
```

## 配置预取

```ts [nuxt.config.ts]
export default defineNuxtConfig({
  modules: ['@lacqjs/nuxt-dict'],
  dict: {
    ssr: {
      prefetch: ['gender', 'status', 'industry'],
    },
  },
})
```

## 预取与按需加载的配合

预取是"首屏必需的数据提前拉"，不是全量加载：

```vue
<template>
  <!-- gender / industry 在 prefetch 中 → 首屏直接显示翻译 -->
  <p>性别：{{ $dict.translate('gender', user.gender) }}</p>
  <p>行业：{{ $dict.translate('industry', user.industry) }}</p>

  <!-- detail_type 不在 prefetch 中 → 按需加载 -->
  <div v-if="showDetail">
    <p>详情：{{ $dict.translate('detail_type', item.type) }}</p>
  </div>
</template>
```

## 预取失败的容错

预取使用 `Promise.all` 并发请求，但**允许部分失败**。某个字典预取失败只输出警告日志，不阻塞页面，该字典会在客户端按需加载。

## 性能建议

只在 `prefetch` 中配置首屏必需的字典类型（通常 3-10 个），不要把全部字典都放进去。

## 注意事项

> 预取只在 SSR 模式下生效。纯客户端渲染（SPA）不需要配置。

## 本章你学会了

- [ ] 理解 SSR 预取的工作流程
- [ ] 在 `dict.ssr.prefetch` 中配置预取类型
- [ ] 知道预取失败不会阻塞页面渲染
