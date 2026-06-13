---
title: 常见问题
description: 使用字典模块时遇到的最常见问题及解决方法。
---

## 页面显示 code 原文而不是翻译后的文字

可能原因：
1. 字典数据还没加载完成。确保在 `v-if="data"` 条件下使用 translate
2. 字典类型名写错了。确认 `useDict('gender')` 中的类型名和后端接口返回的一致
3. API 接口地址配置不对。检查 `dict.api.baseURL` 和 `dict.api.dictEndpoint`

## useDict 返回的 data 是 null

`data` 初始值就是 `null`，组件挂载后异步加载。用 `loading` 和 `error` 判断当前状态。

## 如何手动刷新字典？

调用 composable 返回的 `refresh()` 函数。

## 切换语言后字典没变？

`setLocale()` 会清空内存缓存，使用 `useDict` / `useDictTree` / `useDict` 的组件会**自动重新加载**对应语言的字典数据，无需手动刷新或额外写 watch 代码。

## 如何与 @nuxtjs/i18n 一起使用？

两个模块通过共享同一个 cookie（默认 `i18n_redirected`）自动同步语言。页面刷新或运行时切换语言，字典数据都会自动更新。详见 [i18n 国际化](/integration/i18n)。

## 如何对接已有后端接口？

使用 [自定义适配器](/advanced/custom-adapter)，在 `api.adapter` 中转换后端数据格式。

## 如何对接多个后端字典源？

使用 [多仓库](/advanced/multi-store)，在 `dict.stores` 中为每个数据源配置独立 API 端点。

## IndexedDB 报错怎么办？

IndexedDB 写入失败不影响功能。常见原因：隐私模式、空间不足。可设置 `cache.indexedDB.enabled: false`。

## 字典数据更新了但页面还是旧的？

1. 确保后端版本号接口返回了新的版本号
2. 调用 `refresh()` 强制刷新

## code 是数字，但 translate(1) 返回原文

模块内部统一转字符串比较。检查后端返回的 `code` 确实是数字类型。

## SSR 预取配置了但不生效？

预取仅 SSR 模式下生效。SPA 模式不需要预取配置。

## 服务端报错 "fetch is not defined"

确保运行环境 Node.js >= 22（Nuxt 4 要求）。

## $dict.translatePath 返回 code 原文

可能原因：不是树形字典（`tree` 字段为空）、数据还没加载、树中不存在该 code。
