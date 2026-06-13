---
title: 缓存体系
description: 深入理解三级缓存架构 —— 内存、IndexedDB、API，以及版本检测与自动失效机制。
---

# 缓存体系

**本章目标**：理解字典模块的三级缓存架构、读写流程和配置调优。

## 三级缓存架构

```
用户组件调用 useDict / useDict / useDictTree
  ↓
一级: 内存缓存 (Map) ← 最快，命中直接返回
  ↓ 未命中
二级: IndexedDB 持久缓存 ← 跨页面保留
  ↓ 未命中 / 版本不一致
三级: API 网络请求 ← 最终数据源
  ↓ 获取成功
回填: 同时写入 IndexedDB + 内存缓存
```

## 各层详解

**第一层：内存缓存**
- 存储在 JavaScript `Map` 对象中
- 生命周期：页面关闭即清除
- 容量：`cache.memoryMax`（默认 200）
- 过期：`cache.ttl` 毫秒后过期（默认 0 = 永不过期）
- 淘汰：LRU 策略

**第二层：IndexedDB**
- 持久存储，除非清除浏览器数据或模块失效缓存
- 可开关：`cache.indexedDB.enabled`

**第三层：API**
- 请求去重：同一字典类型的并发请求会合并为一次网络调用

## 读写流程

**读（getDict）**：内存缓存 → 请求去重 → IndexedDB → API

**强制刷新（refresh）**：清除内存缓存 → 跳过 IndexedDB → 直接请求 API

## 版本检测

首次访问某个仓库的字典数据时（调用 `useDict` / `useDictTree` / `useDict`），模块惰性调用 `fetchVersion()` 与 localStorage 存储的上次版本号比较：
- 版本一致 → 缓存有效
- 版本不一致 → 清空该仓库所有缓存
- 检测失败 → 忽略错误，继续使用缓存

## 配置调优

```ts [nuxt.config.ts]
dict: {
  cache: {
    memoryMax: 200,       // 最多缓存条目数
    ttl: 0,               // 过期时间，0 = 永不过期
    indexedDB: {
      enabled: true,      // 是否启用 IndexedDB
    },
  },
}
```

| 场景 | 建议 |
|------|------|
| 字典很少变动 | `ttl: 0`，依赖版本号失效 |
| 字典经常变动 | `ttl: 600000`（10 分钟） |
| 移动端 | `memoryMax: 50` |
| SSR 为主 | `indexedDB.enabled: false` |

## 本章你学会了

- [ ] 理解三级缓存的架构和读写流程
- [ ] 知道版本检测如何自动失效缓存
- [ ] 根据场景调优缓存配置
