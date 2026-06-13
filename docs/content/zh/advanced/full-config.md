---
title: 配置全解
description: nuxt.config.ts 中 dict 配置项的完整参考，含每个字段的类型、默认值和说明。
---

# 配置全解

本章列出 `nuxt.config.ts` 中 `dict` 配置的所有字段。

## enable

| 类型 | 默认值 | 说明 |
|------|--------|------|
| `boolean` | `true` | 是否启用字典模块 |

## logLevel

| 类型 | 默认值 | 说明 |
|------|--------|------|
| `number` | `3` | 日志级别：0=静默, 1=错误, 2=警告, 3=信息, 4=调试, 5=详细 |

## api.baseURL

| 类型 | 默认值 | 说明 |
|------|--------|------|
| `string` | `'/api'` | API 基础地址。支持绝对 URL 或相对路径 |

## api.dictEndpoint

| 类型 | 默认值 | 说明 |
|------|--------|------|
| `string` | `'/dict/list'` | 字典列表接口路径 |

## api.versionEndpoint

| 类型 | 默认值 | 说明 |
|------|--------|------|
| `string` | `'/dict/version'` | 版本号接口路径 |

## api.adapter

| 类型 | 默认值 | 说明 |
|------|--------|------|
| `DictAdapter \| undefined` | `undefined` | 默认仓库 `dicts` 的自定义字典适配器。命名仓库使用 `stores.xxx.adapter`，详见 [自定义适配器](/advanced/custom-adapter) |

## cache.memoryMax

| 类型 | 默认值 | 说明 |
|------|--------|------|
| `number` | `200` | 内存缓存最大条目数 |

## cache.ttl

| 类型 | 默认值 | 说明 |
|------|--------|------|
| `number` | `0` | 内存缓存 TTL（毫秒），0 = 永不过期 |

## cache.indexedDB.enabled

| 类型 | 默认值 | 说明 |
|------|--------|------|
| `boolean` | `true` | 是否启用 IndexedDB |

## cache.indexedDB.dbName

| 类型 | 默认值 | 说明 |
|------|--------|------|
| `string` | `'nuxt-dict'` | IndexedDB 数据库名称 |

## locale.default

| 类型 | 默认值 | 说明 |
|------|--------|------|
| `string` | `'zh-CN'` | 兜底语言 |

## locale.source

| 类型 | 默认值 | 说明 |
|------|--------|------|
| `'cookie' \| 'header' \| 'query'` | `'cookie'` | 语言检测来源 |

## locale.cookieKey

| 类型 | 默认值 | 说明 |
|------|--------|------|
| `string` | `'i18n_redirected'` | cookie 名称。默认值与 @nuxtjs/i18n 共享同一 cookie，实现语言自动同步。详见 [i18n 国际化](/integration/i18n) |

## locale.queryKey

| 类型 | 默认值 | 说明 |
|------|--------|------|
| `string` | `'lang'` | URL 查询参数名 |

## locale.paramKey

| 类型 | 默认值 | 说明 |
|------|--------|------|
| `string` | `'lang'` | 发给 API 时语言参数的查询参数名 |

## locale.apiHeaderKey

| 类型 | 默认值 | 说明 |
|------|--------|------|
| `string` | `'X-Locale'` | 发给 API 时语言的请求头名 |

## stores

| 类型 | 默认值 | 说明 |
|------|--------|------|
| `Record<string, { baseURL?, dictEndpoint?, versionEndpoint?, adapter? }>` | `{}` | 多仓库 API 配置。每个仓库可配置独立的端点或自定义适配器 |

每个仓库的可配字段：
- **`baseURL`**：API 基础地址，未配继承全局 `api.baseURL`
- **`dictEndpoint`**：字典列表接口路径，未配继承全局 `api.dictEndpoint`
- **`versionEndpoint`**：版本号接口路径，未配继承全局 `api.versionEndpoint`
- **`adapter`**：该仓库的自定义适配器（**不继承**，未配则自动创建 REST 适配器）

详见 [多仓库](/advanced/multi-store)。

## ssr.prefetch

| 类型 | 默认值 | 说明 |
|------|--------|------|
| `string[]` | `[]` | 服务端预取的字典类型列表 |

详见 [SSR 预取](/advanced/ssr-prefetch)。

## version.storageKey

| 类型 | 默认值 | 说明 |
|------|--------|------|
| `string` | `'__NUXT_DICT_VERSION__'` | localStorage 版本号 key |
