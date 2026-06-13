---
title: useDict
description: useDict 完整用法详解 —— 获取字典数据并翻译。
---

# useDict

**本章目标**：掌握 `useDict` 的所有用法，包括基础翻译、loading/error 处理、手动刷新和指定存储库。

## 什么时候需要这个功能？

- 你有一个表格，其中"状态"列存的是 `0` / `1`，但你希望用户看到"启用" / "禁用"
- 你需要同时拿到字典原始数据和翻译能力
- 你需要自己控制字典数据的渲染方式

## 完整签名

```ts
// 使用默认存储库
useDict(type: string): UseDictReturn

// 指定存储库
useDict(storeName: string, type: string): UseDictReturn
```

## 返回值

| 属性 | 类型 | 说明 |
|------|------|------|
| `data` | `ShallowRef<DictItem[] \| null>` | 字典原始数据数组。初始为 `null`，加载完成后变成 `[{ value: 0, label: '禁用' }, ...]` |
| `translate` | `(value: string \| number) => string` | 同步翻译函数。输入 code，输出对应的 label。如果 code 不存在，返回 code 本身的字符串形式 |
| `loading` | `Ref<boolean>` | 是否正在加载 |
| `error` | `Ref<string \| null>` | 加载失败时的错误信息 |
| `refresh` | `() => Promise<void>` | 手动刷新，强制跳过缓存 |

## 基础示例

```vue
<template>
  <div>
    <p v-if="loading">加载中...</p>

    <div v-else-if="error" style="background:#fef0f0;padding:16px;border-radius:8px;">
      <p style="color:#F56C6C;">{{ error }}</p>
      <button @click="doRefresh">重试</button>
    </div>

    <table v-else border="1" cellpadding="6" cellspacing="0" style="border-collapse:collapse;">
      <thead>
        <tr><th>编码 (code)</th><th>显示文字 (label)</th><th>翻译验证</th></tr>
      </thead>
      <tbody>
        <tr v-for="item in data" :key="item.value">
          <td>{{ item.value }}</td>
          <td>{{ item.label }}</td>
          <td>{{ translate(item.value) }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
const { data, translate, loading, error, refresh } = useDict('status')

function doRefresh() { refresh() }
</script>
```

## 翻译函数详解

`translate(value)` 是同步函数，它只查找**当前已加载到内存缓存中的数据**，不需要等网络请求：

```vue
<template>
  <table>
    <tr v-for="user in userList" :key="user.id">
      <td>{{ user.name }}</td>
      <!-- user.status 是数字 0/1/2 → 翻译成"禁用"/"启用"/"待审核" -->
      <td>{{ translate(user.status) }}</td>
    </tr>
  </table>
</template>
```

> **为什么翻译是同步的？** 当 `useDict('status')` 在组件挂载时已经完成了数据加载，`status` 的字典数据就存放在内存缓存中了。之后调用 `translate(statusCode)` 直接从内存中查找。

## code 类型自动转换

字典项的 code 可能是 `number`（如 `0`），而你的业务数据可能是 `string`（如 `'0'`）。`translate()` 内部自动把两边都转成字符串比较：

```ts
translate(0)   // → '禁用'
translate('0') // → '禁用'
```

## 手动刷新

当你知道后端字典数据已经更新时，可以调用 `refresh()` 强制重新拉取：

```vue
<script setup lang="ts">
const { data, refresh } = useDict('status')

function onDictUpdated() {
  refresh()  // 后端通知字典有更新 → 清除缓存并重新请求
}
</script>
```

`refresh()` 的行为：清除内存缓存 → 跳过 IndexedDB → 直接向服务器发起新请求 → 写入 IndexedDB + 内存。

## 指定存储库

```vue
<script setup lang="ts">
// 默认存储库 'dicts'
const { data } = useDict('gender')

// 指定存储库 'payment'
const { data: payData } = useDict('payment', 'status')
</script>
```

> 多仓库的详细配置见 [多仓库](/advanced/multi-store) 章节。

## 注意事项

> `translate()` 在 `data` 为 `null` 时仍可调用，但会返回 code 原文。确保在 `v-if="data"` 或用 loading 状态包裹。

## 本章你学会了

- [ ] 使用 `useDict('type')` 获取字典数据和翻译函数
- [ ] 正确处理 `loading` / `error` 三种状态
- [ ] 用 `translate()` 做 code → label 转换
- [ ] 调用 `refresh()` 强制刷新缓存
- [ ] 使用 `useDict('store', 'type')` 指定存储库
