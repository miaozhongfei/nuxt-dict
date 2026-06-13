---
title: 安装模块
description: 将 @lacqjs/nuxt-dict 安装到你的 Nuxt 项目中。
---

**本章目标**：在上一章创建的 Nuxt 项目中安装 Nuxt Dict 模块，并验证安装成功。

## 第 1 步：安装依赖包

```bash
pnpm add @lacqjs/nuxt-dict
```

这个命令会下载 `@lacqjs/nuxt-dict` 包到 `node_modules/`，并在 `package.json` 的 `dependencies` 中记录这个依赖。

> Nuxt Dict 属于运行时依赖，所以用 `pnpm add`（不加 `-D`）。

## 第 2 步：注册模块

打开项目根目录下的 `nuxt.config.ts` 文件，把 `'@lacqjs/nuxt-dict'` 加到 `modules` 数组里：

```ts [nuxt.config.ts]
export default defineNuxtConfig({
  modules: [
    '@lacqjs/nuxt-dict'
  ],
})
```

> **`modules` 是什么？** Nuxt 的模块系统允许别人写好一个功能包，你在 modules 里注册一下就能直接用。就像给手机装 App 一样——安装 + 启用。

保存文件。如果 `pnpm dev` 还在运行，Nuxt 会自动检测到变化并重新加载。

## 第 3 步：验证安装

### 查看控制台日志

重新启动开发服务器（如果还没运行的话）：

```bash
pnpm dev
```

在终端中，你应该看到类似这样的日志：

```
[nuxt-dict] 初始化模块 @lacqjs/nuxt-dict
[nuxt-dict] @lacqjs/nuxt-dict 模块选项: { enable: true, logLevel: 3, ... }
```

看到这些日志，说明模块已经成功注册并初始化了。

### 验证 TypeScript 支持

在你的 `pages/index.vue` 文件中输入：

```vue [pages/index.vue]
<script setup lang="ts">
const { data } = useDict('gender')
</script>
```

如果编辑器没有报错，而且输入 `useDict` 时有自动补全提示，说明 TypeScript 类型声明也加载成功了。

> **为什么没有配置 `dict: {}` 也可以用？** 模块的所有配置项都有默认值。后面 [配置全解](/advanced/full-config) 章节会详细讲解每个配置项。

## 本章你学会了

- [ ] 用 `pnpm add @lacqjs/nuxt-dict` 安装字典模块
- [ ] 在 `nuxt.config.ts` 的 `modules` 中注册模块
- [ ] 通过控制台日志验证模块初始化成功
- [ ] 在 `.vue` 文件中使用 `useDict` 并确认类型提示正常
