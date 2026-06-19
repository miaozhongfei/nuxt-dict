---
title: 自定义适配器
description: 对接任意格式的字典数据源 —— GraphQL、Firestore、本地 JSON 文件等。
---

**本章目标**：学会编写自定义适配器，让字典模块对接非标准 REST 接口或其他数据源。

## 适配器接口

适配器需要实现 `DictAdapter` 接口的两个方法。模块提供了 `defineDictAdapter()` 辅助函数，提供完整的 TypeScript 类型推导：

```ts
import { defineDictAdapter } from '@lacqjs/nuxt-dict'

// defineDictAdapter() 运行时原样返回，仅提供类型检查
export default defineDictAdapter({
  async fetchDict(storeName, { types, locale }) { /* ... */ },
  async fetchVersion(storeName) { /* ... */ },
})
```

完整的接口定义如下：

```ts
interface DictAdapter {
  fetchDict(storeName: string, options: { types: string[]; locale: string }): Promise<DictResponse>;
  fetchVersion(storeName: string): Promise<string>;
}
```

## 注册方式

适配器通过独立文件定义，有两种注册方式：

### 约定路径自动发现（推荐）

将适配器文件放在 `~/dict/dict-adapter.ts`，模块启动时会自动发现并加载，无需任何配置：

```ts [~/dict/dict-adapter.ts]
import { defineDictAdapter } from '@lacqjs/nuxt-dict'

// 模块自动发现 ~/dict/dict-adapter.ts，nuxt.config.ts 无需额外配置
export default defineDictAdapter({
  async fetchDict(storeName, { types, locale }) {
    const res = await fetch(`/api/dict?types=${types.join(',')}&lang=${locale}`)
    return res.json()
  },
  async fetchVersion(storeName) {
    const res = await fetch('/api/dict/version')
    return (await res.json()).version
  },
})
```

### 显式配置路径

如果适配器文件不在约定位置，可以在 `nuxt.config.ts` 中指定路径：

```ts [nuxt.config.ts]
export default defineNuxtConfig({
  modules: ['@lacqjs/nuxt-dict'],
  dict: {
    api: {
      // 显式指定适配器文件路径（覆盖约定路径）
      adapter: '~/custom/my-adapter',
    },
  },
})
```

每个仓库也可以有独立的适配器文件，约定路径为 `~/dict/{storeName}-adapter.ts`。

## 示例

以下四种适配器覆盖常见场景——GraphQL、本地 JSON、格式转换、多 API 路由：

::code-group

```ts [GraphQL 适配器]
// ~/dict/dict-adapter.ts
import { defineDictAdapter } from '@lacqjs/nuxt-dict'

export default defineDictAdapter({
  async fetchDict(storeName, { types, locale }) {
    // 构造 GraphQL 查询语句
    const query = `{ dict(types: [${types.map((t) => `"${t}"`)}], locale: "${locale}") { version data { type items { code label } tree { code label children { code label } } } } }`
    const res = await fetch('https://graphql.example.com', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query }),
    })
    return (await res.json()).data.dict
  },
  async fetchVersion(storeName) {
    // 查询当前字典版本号
    const res = await fetch('https://graphql.example.com', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: '{ dictVersion }' }),
    })
    return (await res.json()).data.dictVersion
  },
})
```

```ts [本地 JSON 适配器]
// ~/dict/dict-adapter.ts
import { defineDictAdapter } from '@lacqjs/nuxt-dict'
// 导入本地字典数据文件
import dictData from '../data/dictionary.json'

export default defineDictAdapter({
  async fetchDict(storeName, { types }) {
    // 按请求的类型过滤本地数据
    const data: Record<string, any> = {}
    for (const type of types) {
      if (dictData[type]) data[type] = dictData[type]
    }
    // 本地数据不变，版本号固定
    return { version: '1.0.0', data }
  },
  async fetchVersion(storeName) {
    // 本地数据无需版本检测，返回固定值
    return '1.0.0'
  },
})
```

```ts [格式转换]
// ~/dict/dict-adapter.ts
import { defineDictAdapter } from '@lacqjs/nuxt-dict'

export default defineDictAdapter({
  async fetchDict(storeName, { types, locale }) {
    const res = await fetch(`/api/custom-dict?codes=${types.join(',')}`)
    const json = await res.json()
    // 将后端格式转换为模块期望的 DictResponse 格式
    const data: Record<string, any> = {}
    for (const item of json.payload) {
      data[item.dictType] = {
        type: item.dictType,
        items: item.options.map((opt: any) => ({ value: opt.dictCode, label: opt.dictName })),
      }
    }
    return { version: json.dataVersion || '1.0.0', data }
  },
  async fetchVersion(storeName) {
    const res = await fetch('/api/custom-dict/version')
    return (await res.json()).version
  },
})
```

```ts [StoreName 路由]
// ~/dict/dict-adapter.ts
import { defineDictAdapter } from '@lacqjs/nuxt-dict'

export default defineDictAdapter({
  async fetchDict(storeName, { types, locale }) {
    // 根据 storeName 选择不同的 API 端点
    const endpoints: Record<string, string> = {
      dicts: 'https://default-api.example.com/dict/list',
      payment: 'https://pay-api.example.com/v1/payment/dict',
      logistics: 'https://logistics-api.example.com/v1/logistics/dict',
    }
    const url = endpoints[storeName] || endpoints.dicts
    const res = await fetch(`${url}?types=${types.join(',')}&lang=${locale}`)
    return res.json()
  },
  async fetchVersion(storeName) {
    const res = await fetch(`https://${storeName === 'dicts' ? 'default' : storeName}-api.example.com/version`)
    return (await res.json()).version
  },
})
```

::

每个仓库调用 `fetchDict` / `fetchVersion` 时，模块会自动传入对应的 `storeName`，你无需在 `stores` 配置中重复定义 `baseURL`。

> 如果不同仓库的适配逻辑差异较大（比如有的走 GraphQL、有的走本地文件），可以不用全局适配器做 if/else 路由，而是给每个仓库创建独立的适配器文件（约定路径 `~/dict/{storeName}-adapter.ts`）。详见 [多仓库](/advanced/multi-store#仓库使用自定义适配器)。

## 注意事项

> `fetchVersion` 的返回值用于判断缓存是否失效。如果不需要版本检测，返回固定字符串即可。

## 本章你学会了

- [ ] 理解 `DictAdapter` 接口的两个方法
- [ ] 使用 `defineDictAdapter()` 辅助函数定义适配器
- [ ] 通过约定路径 `~/dict/dict-adapter.ts` 自动注册适配器
- [ ] 写出 GraphQL 适配器
- [ ] 写出本地 JSON 文件适配器
- [ ] 在适配器中做数据格式转换
- [ ] 根据 `storeName` 路由不同的外部接口
