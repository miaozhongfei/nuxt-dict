---
title: 环境准备
description: 安装 Node.js 和 pnpm，创建你的第一个 Nuxt 项目。
---

# 环境准备

**本章目标**：在你的电脑上安装 Node.js 和 pnpm，然后创建一个可以运行的 Nuxt 项目。学完本章你将有一个可访问 `http://localhost:3000` 的空白 Nuxt 项目。

## 什么时候需要看这章？

- 你是第一次接触前端开发，电脑上没有任何前端工具
- 你的电脑重装过系统，需要重新搭建环境
- 你已经安装了 Node.js 但不熟悉 pnpm

## 第 1 步：安装 Node.js

Node.js 是 Nuxt 运行的基础环境。Nuxt 4 要求 **Node.js >= 22.0.0**。

### 1.1 下载安装包

打开 Node.js 官网： [https://nodejs.org](https://nodejs.org)

你会看到两个版本：
- **LTS**（长期支持版）：推荐大多数人使用，稳定可靠
- **Current**（最新版）：包含最新功能，但可能有 bug

**选择 LTS 版本，点击下载即可。**

### 1.2 安装

下载完成后，双击安装包，一路点"下一步"即可完成安装。

安装过程中有一个选项叫做 **"Automatically install the necessary tools"**，勾选它（它会自动安装一些编译工具，后面可能用到）。

### 1.3 验证安装

安装完成后，打开终端（PowerShell / CMD / Terminal 都可以），输入以下命令：

```bash
node --version
```

你应该看到类似这样的输出：

```
v22.12.0
```

版本号大于等于 `22.0.0` 就说明安装成功了。

## 第 2 步：安装 pnpm

pnpm 是一个 JavaScript 包管理器。你可以把它理解成一个"应用商店"——别人写好的代码打包发布上去，你用 pnpm 下载安装。

Nuxt Dict 项目强制使用 pnpm，不能用 npm 或 yarn。

### 2.1 安装 pnpm

在终端中输入：

```bash
npm install -g pnpm
```

这条命令的含义是：
- `npm install` = 用 npm 安装一个包
- `-g`（global）= 全局安装，之后在任何目录都能用 pnpm 命令
- `pnpm` = 我们要装的包名

### 2.2 验证安装

```bash
pnpm --version
```

输出应该大于等于 `10.22.0`。

### 2.3 配置镜像源（可选，推荐）

国内的网络环境访问国外 npm 仓库可能比较慢。配置淘宝镜像可以加速下载：

```bash
pnpm config set registry https://registry.npmmirror.com/
```

> **镜像源是什么？** 简单理解就是把国外的服务器上存的数据在国内服务器上复制了一份，国内下载更快。

## 第 3 步：创建 Nuxt 项目

### 3.1 初始化项目

打开终端，进入你想放项目代码的目录，然后运行：

```bash
npx nuxi init my-app
```

这个命令会：
- `npx nuxi` = 临时下载并运行 `nuxi`（Nuxt 的项目脚手架工具）
- `init my-app` = 创建一个名为 `my-app` 的项目

运行过程中它会问你几个问题：
- **Which package manager would you like to use?** → 选择 **pnpm**
- **Initialize git repository?** → 选择 **Yes**（推荐）

### 3.2 进入项目目录

```bash
cd my-app
```

### 3.3 安装依赖

```bash
pnpm install
```

这个命令会根据 `package.json` 里声明的依赖列表，把所有需要的包下载到 `node_modules/` 目录。

### 3.4 启动项目

```bash
pnpm dev
```

你应该看到类似这样的输出：

```
Nuxt 4.x.x

> Local:    http://localhost:3000/
```

在浏览器中打开 `http://localhost:3000/`，看到 Nuxt 的欢迎页面，就说明项目创建成功了！

## 本章你学会了

- [ ] 在电脑上安装 Node.js（版本 >= 22）
- [ ] 安装 pnpm 包管理器
- [ ] 用 `npx nuxi init` 创建一个 Nuxt 项目
- [ ] 用 `pnpm dev` 启动开发服务器
- [ ] 在浏览器中访问 `http://localhost:3000`
