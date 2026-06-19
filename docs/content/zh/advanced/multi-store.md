---
title: 多仓库
description: 一个页面同时对接多个后端字典数据源。
---

**本章目标**：学会在项目中配置多个字典数据仓库，一个页面同时使用来自不同系统的字典数据。

## 什么时候需要这个功能？

- 管理后台首页需要同时显示"主系统"的订单状态和"支付系统"的支付方式
- 微服务架构，字典数据分别存在不同的后端服务中
- 需要对接第三方系统的字典

## 配置多仓库

```ts [nuxt.config.ts]
export default defineNuxtConfig({
  modules: ['@lacqjs/nuxt-dict'],
  dict: {
    // 全局 API 配置（默认仓库 'dicts' 使用）
    api: {
      baseURL: '',
      dictEndpoint: '/api/dict/list',
    },
    // 额外的存储仓库
    stores: {
      // 仓库 payment：独立的后端地址
      payment: { baseURL: 'https://pay-api.example.com', dictEndpoint: '/v1/dictionary' },
      // 仓库 logistics：独立端点但同域名
      logistics: { dictEndpoint: '/api/logistics/dict' },
      // 仓库 static：走自定义适配器文件，不发起网络请求
      // 约定路径 ~/dict/static-adapter.ts 自动发现
      static: {},
    },
  },
});
```

`static` 仓库的适配器定义在独立文件中：

```ts [~/dict/static-adapter.ts]
// static 仓库的自定义适配器——直接返回硬编码数据，不发起 HTTP 请求
export default defineDictAdapter({
  async fetchDict(_storeName, { types, locale }) {
    return {
      version: 'static-1.0',
      data: {
        priority: {
          type: 'priority',
          items: [
            { value: 'high', label: `高优先级 (${locale})` },
            { value: 'low', label: `低优先级 (${locale})` },
          ],
        },
      },
    };
  },
  async fetchVersion(_storeName) {
    return 'static-1.0';
  },
});
```

## 继承规则

`stores` 中每个仓库未配置的字段从全局 `api` 继承。以 `logistics` 为例：

- `baseURL` 未配置 → 继承全局 `''`（本地接口）
- `dictEndpoint` 配置了 `/api/logistics/dict` → 覆盖全局值
- `versionEndpoint` 未配置 → 继承全局值

> `adapter` 字段比较特殊——它**不参与继承**。如果你没有为某个仓库配置 `adapter`，模块会自动为其创建默认的 REST 适配器（使用该仓库继承后的 endpoint 配置），而不是从全局 `api.adapter` 复制。`adapter` 的值是一个文件路径字符串（如 `'~/dict/static-adapter'`），指向使用 `defineDictAdapter()` 导出适配器的文件。

## 仓库使用自定义适配器

每个命名仓库都可以配置独立的自定义适配器文件（`adapter` 字段传入文件路径字符串），代替默认的 REST 请求。适配器文件使用 `defineDictAdapter()` 定义，约定路径 `~/dict/{storeName}-adapter.ts` 可被模块自动发现。适用于以下场景：

- 字典数据来自本地文件或静态配置，不需要 HTTP 请求
- 不同仓库的后端接口格式差异大，需要各自独立的适配逻辑
- 需要模拟数据进行开发调试

使用自定义适配器的仓库在 composable 中的用法和其他仓库完全一样：

```vue
<template>
  <div>
    <h3>优先级（static 仓库 — 自定义适配器）</h3>
    <select v-model="priority">
      <option v-for="opt in staticOptions" :key="opt.value" :value="opt.value">
        {{ opt.label }}
      </option>
    </select>
  </div>
</template>

<script setup lang="ts">
// static 仓库走自定义适配器文件，不发起网络请求
const { options: staticOptions } = useDict('static', 'priority');

const priority = ref('');
</script>
```

## 使用多仓库

```vue
<template>
  <div>
    <h3>订单状态（主系统）</h3>
    <select v-model="orderStatus">
      <option v-for="opt in orderOptions" :key="opt.value" :value="opt.value">
        {{ opt.label }}
      </option>
    </select>

    <h3>支付方式（支付系统）</h3>
    <select v-model="payMethod">
      <option v-for="opt in payOptions" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
    </select>
  </div>
</template>

<script setup lang="ts">
// 默认仓库
const { options: orderOptions } = useDict('order_status');
// payment 仓库
const { options: payOptions } = useDict('payment', 'pay_method');

const orderStatus = ref('');
const payMethod = ref('');
</script>
```

## useDict / useDictTree / $dict 指定仓库

```ts
// useDict
const { data: payData } = useDict('payment', 'pay_status');

// useDictTree
const { tree: locTree } = useDictTree('logistics', 'delivery_region');

// $dict
$dict.translate('pay_status', 1, { storeName: 'payment' });
```

## 各仓库独立的版本检测

每个仓库有自己独立的版本号检测，采用**惰性机制**——只在首次访问该仓库的字典数据时触发 `fetchVersion()`，而非模块启动时全量检查。某个仓库的版本更新只会失效该仓库的缓存，不影响其他仓库。

## 彻底搞懂仓库配置规则

### 先理解两个基本概念

**1. 什么是仓库（store）？**

仓库就是一个"字典数据来源"。比如你的项目需要三种字典：

- 性别、状态 → 从本地后台 `/api/dict/list` 拿 → 这就是仓库 `dicts`（默认仓库）
- 支付方式 → 从支付系统 `https://pay-api.example.com` 拿 → 这就是仓库 `payment`
- 静态标签 → 直接写死在代码里，不需要 HTTP → 这也是一个仓库

每个仓库用**仓库名**区分（`dicts`、`payment`、`static` 等）。

**2. 什么是适配器（adapter）？**

适配器就是一个"拿数据的小工具"。它定义在独立文件中，使用 `defineDictAdapter()` 创建，有两个任务：

- `fetchDict`：去拿字典数据
- `fetchVersion`：去看看版本有没有变

模块自带一个**默认 REST 适配器**——它会自动发 HTTP 请求去你配的地址拿数据。如果你不需要 HTTP（比如读本地文件），或者后端接口格式不一样，你可以自己写一个适配器文件替换它。

### 仓库的三种存在方式

一个仓库可以处于下面三种状态之一：

| 状态                 | 在 `stores` 里怎么写          | 效果                                                                                                |
| -------------------- | ----------------------------- | --------------------------------------------------------------------------------------------------- |
| **未声明**           | 完全不写                      | 模块不知道有这个东西。你在代码里用 `useDict('myStore', 'type')` 时，直接复用 `dicts` 的适配器       |
| **声明了，但为空**   | `myStore: {}`                 | 模块知道有这个仓库，但所有字段都是空的。会创建一个独立的 REST 适配器，地址字段全部从全局 `api` 复制 |
| **声明了，配了字段** | `myStore: { baseURL: '...' }` | 用你配的字段 + 没配的字段从全局 `api` 复制                                                          |

**三种状态对比代码：**

```ts [nuxt.config.ts]
// 全局 api——所有仓库没配字段时的默认值来源
api: { baseURL: '/api', dictEndpoint: '/dict/list', versionEndpoint: '/dict/version' }
stores: {
  // 状态 1：payment 完全没有声明
  // → 代码里写 useDict('payment', 'type') 时，画面到 dicts 适配器，端点还是 /api/dict/list

  // 状态 2：logistics 声明了但为空
  logistics: {},
  // → 独立的 REST 适配器，端点继承为 /api/dict/list
  // → 有自己独立的缓存和版本号

  // 状态 3：static 配了 adapter（文件路径）
  static: { adapter: '~/dict/static-adapter' },
  // → 用自己的自定义适配器文件，不走 HTTP
}
```

**状态 1 vs 状态 2 的区别：**

虽然端点一样，但是：

- 状态 1：`payment` 和 `dicts` 共享一个适配器、一套缓存——`dicts` 更新了版本，`payment` 也跟着失效
- 状态 2：`logistics` 有自己独立的适配器、独立的缓存——`dicts` 更新了版本，`logistics` 不受影响

> 什么时候需要用状态 2（声明空对象）？当你希望同一个端点返回的不同字典类型有独立的缓存时。

### 四个字段的详细说明

每个仓库可配四个字段：

| 字段              | 类型   | 作用                           | 例子                            |
| ----------------- | ------ | ------------------------------ | ------------------------------- |
| `baseURL`         | 字符串 | 服务器的地址                   | `https://pay-api.example.com`   |
| `dictEndpoint`    | 字符串 | 获取字典数据的接口路径         | `/v1/dictionary`                |
| `versionEndpoint` | 字符串 | 获取版本号的接口路径           | `/v1/dictionary/version`        |
| `adapter`         | 字符串 | 自定义适配器的文件路径         | `'~/dict/static-adapter'`       |

**最终请求的完整 URL = `baseURL` + 对应端点。**

举个例子：

```ts [nuxt.config.ts]
payment: {
  baseURL: 'https://pay-api.example.com',
  dictEndpoint: '/v1/dictionary',
  versionEndpoint: '/v1/dictionary/version',
}
// 实际请求：https://pay-api.example.com/v1/dictionary?types=gender,status&lang=zh-CN
// 版本请求：https://pay-api.example.com/v1/dictionary/version
```

### 继承规则逐条详解

#### 规则 1：三个地址字段都会自动继承

如果某个仓库没配 `baseURL`、`dictEndpoint`、`versionEndpoint`，就自动从全局 `api` 复制同名配置。

**示例 1：配了一个，缺了两个**

```ts [nuxt.config.ts]
api: { baseURL: '/api', dictEndpoint: '/dict/list', versionEndpoint: '/dict/version' }
stores: {
  payment: { baseURL: 'https://pay-api.example.com' },
  // ↑ 只写了 baseURL
}
```

`payment` 最终效果：

- `baseURL` = `'https://pay-api.example.com'` ← 用自己写的
- `dictEndpoint` = `'/dict/list'` ← 从全局复制
- `versionEndpoint` = `'/dict/version'` ← 从全局复制

**示例 2：一个都没配**

```ts [nuxt.config.ts]
api: { baseURL: '/api', dictEndpoint: '/dict/list', versionEndpoint: '/dict/version' }
stores: {
  logistics: {},
  // ↑ 什么也没写
}
```

`logistics` 最终效果：

- `baseURL` = `'/api'` ← 从全局复制
- `dictEndpoint` = `'/dict/list'` ← 从全局复制
- `versionEndpoint` = `'/dict/version'` ← 从全局复制

**示例 3：全配了**

```ts [nuxt.config.ts]
api: { baseURL: '/api', dictEndpoint: '/dict/list', versionEndpoint: '/dict/version' }
stores: {
  payment: {
    baseURL: 'https://pay-api.example.com',
    dictEndpoint: '/v1/dictionary',
    versionEndpoint: '/v1/dictionary/version',
  },
}
```

`payment` 最终效果：三个全用自己的，全局的完全用不上。

#### 规则 2：适配器不会自动继承

这是**最关键也最容易搞错**的一条规则。

**2.1 默认仓库 `dicts`**

```ts [nuxt.config.ts]
api: {
  baseURL: '/api',
  dictEndpoint: '/dict/list',
  adapter: '~/dict/dict-adapter',   // ← 全局自定义适配器文件路径
}
```

默认仓库 `dicts` 的优先级：

1. 先看 `api.adapter` 有没有配文件路径 → 有就加载对应的适配器文件
2. 没配 → 检查约定路径 `~/dict/dict-adapter.ts` 是否存在 → 存在则自动加载
3. 都没有 → 自动创建 REST 适配器（用全局的三个地址字段）

**2.2 命名仓库（`stores.xxx`）**

```ts [nuxt.config.ts]
api: {
  adapter: '~/dict/dict-adapter',   // ← 这个适配器文件路径命名仓库看不见！
}
stores: {
  payment: {
    baseURL: 'https://pay-api.example.com',
    // 没有配 adapter
  },
}
```

`payment` 仓库的逻辑：

1. 先看 `stores.payment.adapter` 有没有配文件路径 → 没配
2. 检查约定路径 `~/dict/payment-adapter.ts` 是否存在 → 不存在
3. 不会去看 `api.adapter` → **跳过**
4. 自动创建 REST 适配器（用继承后的地址字段）

所以 `payment` 最终走的是 `https://pay-api.example.com/dict/list`（REST），而不是你全局配的自定义适配器。

**为什么会这样设计？**

```ts [nuxt.config.ts]
// 假设适配器可以继承，会出现这个尴尬的情况：
api: { adapter: '~/dict/dict-adapter' }

stores: {
  payment: {},
  logistics: {},
  static: {},
}
// payment、logistics、static 三个仓库都会加载同一个适配器文件
// 适配器的 fetchDict 被调用时，靠 storeName 参数区分
// 这不是"继承数据"，这是"用一个工具处理多个来源"
```

如果真的想用一个工具处理多个仓库，直接在适配器里按 `storeName` 路由就好——没必要靠"继承"把同一个文件复制到每个仓库。

**2.3 全局适配器和命名仓库适配器的关系**

两种方式能实现同样的效果，但适用场景不同：

**方式 A：全局适配器文件 + storeName 路由**

::code-group

```ts [~/dict/dict-adapter.ts]
// 全局适配器——根据 storeName 路由到不同的地址
export default defineDictAdapter({
  async fetchDict(storeName, { types, locale }) {
    const urls: Record<string, string> = {
      dicts: '/api/dict/list',
      payment: 'https://pay-api.example.com/v1/dictionary',
      logistics: '/api/logistics/dict',
    }
    const url = urls[storeName]
    const res = await fetch(`${url}?types=${types.join(',')}&lang=${locale}`)
    return res.json()
  },
  async fetchVersion(storeName) {
    const res = await fetch(`/api/version?store=${storeName}`)
    return (await res.json()).version
  },
});
```

```ts [nuxt.config.ts]
// 约定路径 ~/dict/dict-adapter.ts 自动发现
stores: {
  payment: {},     // 声明了，让模块知道有这个仓库，但配不配端点无所谓
  logistics: {},   // 因为适配器内部已经做了路由
}
```

::

适用于：所有仓库用同一个协议（HTTP），只是地址不同，适配器逻辑完全一样。

**方式 B：每个仓库独立适配器文件**

::code-group

```ts [~/dict/static-adapter.ts]
// static 仓库的自定义适配器——完全自定义，不走 HTTP
export default defineDictAdapter({
  async fetchDict() { return { version: '1.0', data: { /* ... */ } } },
  async fetchVersion() { return '1.0' },
});
```

```ts [nuxt.config.ts]
api: { baseURL: '', dictEndpoint: '/api/dict/list' },
stores: {
  payment: {
    baseURL: 'https://pay-api.example.com',
    dictEndpoint: '/v1/dictionary',
    // 不写 adapter → 自动创建 REST 适配器
  },
  // 约定路径 ~/dict/static-adapter.ts 自动发现
  static: {},
}
```

::

适用于：不同仓库用完全不同的获取数据方式（HTTP vs 本地文件 vs GraphQL）。

### 完整对照表

把所有可能的情况列出来：

| 仓库类型                  | 条件                      | 使用的适配器                                                                                                                                                                                   |
| ------------------------- | ------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `dicts`（默认仓库）       | 有 `api.adapter`          | 加载 `api.adapter` 指定的适配器文件                                                                                                                                                            |
| `dicts`（默认仓库）       | 没有 `api.adapter`        | 检查约定路径 `~/dict/dict-adapter.ts` → 存在则加载；否则用 REST：`api.baseURL` + `api.dictEndpoint` + `api.versionEndpoint`                                                                    |
| `xxx`（在 `stores` 声明） | 有 `stores.xxx.adapter`   | 加载 `stores.xxx.adapter` 指定的适配器文件（不受 `api.adapter` 影响）                                                                                                                          |
| `xxx`（在 `stores` 声明） | 没有 `stores.xxx.adapter` | 检查约定路径 `~/dict/xxx-adapter.ts` → 存在则加载；否则用 REST：继承后的地址字段。有独立缓存、独立版本检测                                                                                      |
| `yyy`（未声明）           | —                         | 复用 `dicts` 的适配器，共享同一套缓存                                                                                                                                                          |

### 总结一句话

> 三个地址（baseURL / dictEndpoint / versionEndpoint）你写不写都会补上——没写就抄全局。适配器你配了文件路径就用你的，没配就检查约定路径（`~/dict/dict-adapter.ts` 或 `~/dict/{storeName}-adapter.ts`），约定路径也没有就给你装 HTTP 工具，绝不会去抄全局的。

## 本章你学会了

- [ ] 在 `dict.stores` 中配置多个字典数据仓库
- [ ] 理解仓库配置的继承规则
- [ ] 在 composable 中指定仓库名
