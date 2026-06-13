---
title: useLocale
description: 多语言管理 —— 获取当前语言、切换语言并持久化到 Cookie。
---

# useLocale

**本章目标**：学会获取和切换当前语言，理解语言变更后字典数据如何自动刷新。

## 什么时候需要这个功能？

- 应用需要支持中英文切换
- 用户切换语言后，下拉框的选项文字跟着变成目标语言
- 需要语言切换按钮

## 完整签名

```ts
useLocale(): {
  locale: Ref<string>
  setLocale: (newLocale: string) => void
  locales: string[]
}
```

## 返回值

| 属性 | 类型 | 说明 |
|------|------|------|
| `locale` | `Ref<string>` | 当前语言代码，如 `'zh-CN'` |
| `setLocale` | `(newLocale: string) => void` | 切换语言，更新 Cookie 并清空字典缓存 |
| `locales` | `string[]` | 支持的语言列表 |

## 基础示例

```vue
<template>
  <div>
    <p>当前语言：{{ locale }}</p>
    <button @click="setLocale('zh-CN')" :style="{ fontWeight: locale === 'zh-CN' ? 'bold' : 'normal' }">
      中文
    </button>
    <button @click="setLocale('en-US')" :style="{ fontWeight: locale === 'en-US' ? 'bold' : 'normal' }">
      English
    </button>
  </div>
</template>

<script setup lang="ts">
const { locale, setLocale } = useLocale()
</script>
```

## 语言检测机制

配置 `dict.locale.source` 定义语言来源：

- **`'cookie'`（默认）** — 从 cookie 读取，默认 key 为 `i18n_redirected`
- **`'header'`** — 从请求头读取（仅服务端）
- **`'query'`** — 从 URL 参数读取，默认 key 为 `lang`

如果检测不到，使用 `locale.default`（默认 `'zh-CN'`）。

## 切换语言后发生了什么？

1. `locale` 值更新
2. Cookie 同步更新
3. **所有字典的内存缓存被清空**（不同语言数据不同）
4. 使用 `useDict` / `useDictTree` 的组件**自动重新加载**对应语言的字典数据

> 不需要手动刷新字典！组件检测到数据变成 `null` 后会自动发起新请求。

## 注意事项

> 语言切换后，使用 `useDict` / `useDictTree` / `useDict` 的组件**会自动重取**对应语言的字典数据，无需手动刷新或额外写 watch 代码。

> 如果你使用的是 `@nuxtjs/i18n`，两个模块通过共享同一个 cookie（默认 `i18n_redirected`）自动同步语言。详见 [i18n 国际化](/integration/i18n)。

## 本章你学会了

- [ ] 用 `useLocale` 获取和切换当前语言
- [ ] 理解三种语言检测来源
- [ ] 知道语言切换后字典缓存自动清空
