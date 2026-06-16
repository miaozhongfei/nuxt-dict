# demo-base-api

演示 `@lacqjs/nuxt-dict` 模块最简配置：**仅设置 `dict.api.baseURL`**，其余全部使用默认值。

## 运行方式

```bash
# 1. 先在根目录构建模块
pnpm prepack

# 2. 进入示例目录安装依赖
cd examples/demo-base-api
pnpm install

# 3. 启动开发服务器
pnpm dev
```

## 示例说明

项目在 `server/api/dict/` 下用 Nitro 模拟了字典接口（`list.get.ts` + `version.get.ts`），返回 gender 和 status 两个字典类型。

`nuxt.config.ts` 中只配置了 `dict.api.baseURL: '/api'`（显式写出，实为默认值），页面通过 `useDict('gender')` 和 `useDict('status')` 加载字典数据并展示。

## 替换为生产接口

只需修改 `nuxt.config.ts` 中的 `dict.api.baseURL`：

```ts
dict: {
  api: {
    // 相对路径（同域 API）
    baseURL: '/api',

    // 绝对路径（Java 后端或第三方接口）
    // baseURL: 'https://your-java-backend.com',
  },
},
```

无需修改任何页面代码。
