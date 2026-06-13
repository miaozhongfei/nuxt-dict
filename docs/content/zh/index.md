---
title: Nuxt Dict
description: 基于 Element Plus、Vant 字典的 Nuxt 模块，提供便捷的字典数据管理和使用功能。
---

# Nuxt Dict

Nuxt Dict 是一个 Nuxt 4 模块，帮你轻松管理项目中的**字典数据**（也叫数据字典、码表、枚举值）。

## 什么是字典数据？

在你的日常开发中，一定会遇到这些场景：

- 表格里"性别"列显示的是 `male` / `female`，但用户想看到的是"男" / "女"
- 下拉框的可选项"行业类型"需要从后端接口获取
- 省市区选择器需要树形数据结构
- 项目要支持多语言，同一个下拉框在中文和英文环境下显示不同的文字

**字典模块就是专门解决这些问题的。**

## 这个模块能做什么？

- **useDict** — 根据字典类型获取数据，提供 `translate(code)` 翻译接口
- **useDictOptions** — 直接输出 `{ label, value }[]` 格式，无缝对接 Element Plus / Vant
- **useDictTree** — 树形字典支持，提供 `findPath` 路径回溯（如区号找完整省市区）
- **useLocale** — 多语言管理，支持 cookie / header / query 三种语言检测方式
- **三级缓存** — 内存 → IndexedDB → API，自动版本检测与失效
- **SSR 预取** — 服务端预取字典数据，首屏直出无需等待

## 快速开始（3 步）

1. **安装**：`pnpm add @lacqjs/nuxt-dict`
2. **注册**：在 `nuxt.config.ts` 的 `modules` 中添加 `'@lacqjs/nuxt-dict'`
3. **使用**：在任意页面中写 `const { data, translate } = useDict('gender')`

> **你需要什么基础？** 理想情况下，你不需要懂 Nuxt，甚至不需要懂 Vue。只要你会用电脑、会打字，跟着这篇文档一步一步做，就能把字典功能用在你的项目里。

## 文档导航

| 章节 | 适合谁 |
|------|--------|
| [环境准备](/guide/environment) → [安装模块](/guide/installation) → [第一个字典](/guide/first-dict) | 零基础，第一次使用 |
| [useDict](/guide/use-dict) ∼ [$dict](/guide/dollar-dict) | 了解每个 API 的详细用法 |
| [多仓库](/advanced/multi-store) ∼ [配置全解](/advanced/full-config) | 需要在生产环境中深度使用 |
| [Element Plus](/integration/element-plus) / [Vant](/integration/vant) | 对接 UI 库的完整示例 |
| [API 速查表](/appendix/api-reference) / [常见问题](/appendix/faq) | 快速查阅 |

准备好了吗？从 [环境准备](/guide/environment) 开始吧！
