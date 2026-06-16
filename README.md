<p align="center">
  <h1 align="center">@lacqjs/nuxt-dict</h1>
</p>

<p align="center">
  <a href="https://npmjs.com/package/@lacqjs/nuxt-dict"><img src="https://img.shields.io/npm/v/@lacqjs/nuxt-dict?style=flat-square&colorA=202128&colorB=36936A" alt="Version"></a>
  <a href="https://npmjs.com/package/@lacqjs/nuxt-dict"><img src="https://img.shields.io/npm/dm/@lacqjs/nuxt-dict?style=flat-square&colorA=202128&colorB=36936A" alt="Downloads"></a>
  <a href="https://github.com/miaozhongfei/nuxt-dict/blob/main/LICENSE"><img src="https://img.shields.io/github/license/miaozhongfei/nuxt-dict?style=flat-square&colorA=202128&colorB=36936A" alt="License"></a>
  <a href="https://miaozhongfei.github.io/nuxt-dict/"><img src="https://img.shields.io/badge/Docs-202128?style=flat-square&logo=gitbook&logoColor=DDDDD4" alt="Docs"></a>
</p>

> Nuxt 数据字典模块，提供扁平 / 树形字典翻译、多语言国际化、三级缓存与 SSR 预取。

## 快速开始

### 安装

```bash
pnpm add @lacqjs/nuxt-dict
```

### 注册模块

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['@lacqjs/nuxt-dict'],
});
```

```vue
<template>
  <el-select v-model="value" placeholder="请选择">
    <el-option v-for="o in options" :key="o.value" :label="o.label" :value="o.value" />
  </el-select>
</template>

<script setup lang="ts">
const { data: options } = useDict('gender');
const value = ref('');
</script>
```

## 特性

- **扁平字典** — `useDict(type)` 自动加载，返回 `[{ value, label }]`，直接绑定 UI 组件
- **树形字典** — `useDictTree(type)` 支持任意深度树形结构 + `findPath()` 路径回溯
- **多语言** — `useLocale()` 切换语言，所有活跃字典实例自动重新请求
- **多仓库** — 通过 `stores` 配置从不同 API 端点加载，实现数据隔离
- **三级缓存** — 内存 LRU → IndexedDB → 网络（版本校验），最大化减少请求
- **SSR 预取** — `ssr.prefetch` 配置服务端预加载，加速首屏渲染
- **自定义适配器** — 实现 `DictAdapter` 接口即可对接任意数据源
- **同步翻译** — `$dict.translate()` / `$dict.translatePath()` / `$dict.translateData()` 全场景覆盖

完整用法与配置请查看 → [文档](https://miaozhongfei.github.io/nuxt-dict/)

## 开发

```bash
pnpm dev            # 启动开发服务器
pnpm prepack        # 构建产物
pnpm lint           # 代码检查
pnpm typecheck      # 类型检查
pnpm e2e            # E2E 测试
```

## 感谢 / 致谢

本项目受益于以下优秀开源项目：

- [Nuxt](https://nuxt.com/) — Vue 全栈框架
- [@nuxt/kit](https://github.com/nuxt/nuxt) — Nuxt 模块开发工具包
- [defu](https://github.com/unjs/defu) — 深度合并配置
- [consola](https://github.com/unjs/consola) — 日志工具
- [compare-versions](https://github.com/omichelsen/compare-versions) — 版本比较

## 许可证

[MIT](./LICENSE) License © 2026-PRESENT [miaozhongfei](https://github.com/miaozhongfei)
