# Changelog

## v0.0.8

[compare changes](https://github.com/miaozhongfei/nuxt-dict/compare/v0.0.7...v0.0.8)

### 🩹 Fixes

- 添加 runtime 子路径导出，修复 stub 构建下 defineDictAdapter 运行时不可用 ([ef28595](https://github.com/miaozhongfei/nuxt-dict/commit/ef28595))

### 💅 Refactors

- 移动 define-adapter 到 core/ 并注册 auto-import，用户无需手动导入 ([c65002b](https://github.com/miaozhongfei/nuxt-dict/commit/c65002b))

### 🏡 Chore

- 同步 .nuxtrc 版本号 ([d45a8d8](https://github.com/miaozhongfei/nuxt-dict/commit/d45a8d8))

### ❤️ Contributors

- Miaozhongfei ([@miaozhongfei](https://github.com/miaozhongfei))

## v0.0.7

[compare changes](https://github.com/miaozhongfei/nuxt-dict/compare/v0.0.6...v0.0.7)

### 🩹 Fixes

- 修复 defineDictAdapter 类型导出，types 入口改为 module.d.mts ([01b7842](https://github.com/miaozhongfei/nuxt-dict/commit/01b7842))

### 🏡 Chore

- 同步 dev:prepare 自动生成的版本号和 lockfile ([bca09e7](https://github.com/miaozhongfei/nuxt-dict/commit/bca09e7))
- 同步 dev:prepare 自动生成文件 ([c796d19](https://github.com/miaozhongfei/nuxt-dict/commit/c796d19))

### ❤️ Contributors

- Miaozhongfei ([@miaozhongfei](https://github.com/miaozhongfei))

## v0.0.6

[compare changes](https://github.com/miaozhongfei/nuxt-dict/compare/v0.0.5...v0.0.6)

### 🚀 Enhancements

- 支持文件路径式自定义适配器，解决 runtimeConfig 函数序列化问题 ([2368550](https://github.com/miaozhongfei/nuxt-dict/commit/2368550))

### 🩹 Fixes

- 示例页面用 useState 替代 ref，修复多语言切换时下拉框选中值丢失 ([81cc7ae](https://github.com/miaozhongfei/nuxt-dict/commit/81cc7ae))

### 💅 Refactors

- 同步更新 playground 中的 adapter 注释与展示页，适配文件路径方式 ([8c4f540](https://github.com/miaozhongfei/nuxt-dict/commit/8c4f540))

### 📖 Documentation

- 补充 useDict/$dict 作用域与响应式行为说明，新建 scope-compare 演示页 ([5d71d02](https://github.com/miaozhongfei/nuxt-dict/commit/5d71d02))
- 更新全部适配器文档，适配文件路径方式和 defineDictAdapter 辅助函数 ([e00a67f](https://github.com/miaozhongfei/nuxt-dict/commit/e00a67f))

### 🏡 Chore

- Nuxt dev 自动更新 .nuxtrc 版本号 ([9a97886](https://github.com/miaozhongfei/nuxt-dict/commit/9a97886))

### ❤️ Contributors

- Miaozhongfei ([@miaozhongfei](https://github.com/miaozhongfei))

## v0.0.5

[compare changes](https://github.com/miaozhongfei/nuxt-dict/compare/v0.0.4...v0.0.5)

### 🩹 Fixes

- 语言切换时保留 UI 组件选中值，修复全部 lint warning ([39b660a](https://github.com/miaozhongfei/nuxt-dict/commit/39b660a))

### 💅 Refactors

- Remove old-style API, unify storeName to opts object ([e3ff644](https://github.com/miaozhongfei/nuxt-dict/commit/e3ff644))
- Remove old-style API, unify storeName to opts object" ([ce343ec](https://github.com/miaozhongfei/nuxt-dict/commit/ce343ec))

### 🏡 Chore

- **release:** V0.0.3 ([8b16299](https://github.com/miaozhongfei/nuxt-dict/commit/8b16299))
- Nuxt dev 自动更新 .nuxtrc 版本号至 0.0.4 ([256e5df](https://github.com/miaozhongfei/nuxt-dict/commit/256e5df))

### ❤️ Contributors

- Miaozhongfei ([@miaozhongfei](https://github.com/miaozhongfei))
- Miaozf <1103520414@qq.com>

## v0.0.4

[compare changes](https://github.com/miaozhongfei/nuxt-dict/compare/v0.0.2...v0.0.4)

### 🚀 Enhancements

- Add GitHub Pages deployment for docs site ([773da91](https://github.com/miaozhongfei/nuxt-dict/commit/773da91))
- Remove manual # headings from markdown, use frontmatter title with ContentRenderer ([bb8e6b0](https://github.com/miaozhongfei/nuxt-dict/commit/bb8e6b0))
- 新增 getDictItem 方法，translate/getDictItem/findPath 改为响应式，补充 JSDoc ([dfc1596](https://github.com/miaozhongfei/nuxt-dict/commit/dfc1596))

### 🔥 Performance

- 预建 itemMap/nodeMap/pathMap 索引映射，translate/getDictItem/findPath 查找 O(N) → O(1) ([61a25e0](https://github.com/miaozhongfei/nuxt-dict/commit/61a25e0))

### 🩹 Fixes

- Add explicit type annotation for dict plugin export ([1dfc222](https://github.com/miaozhongfei/nuxt-dict/commit/1dfc222))
- Add /en and /fa to prerender routes for multi-locale SSG ([972ee5d](https://github.com/miaozhongfei/nuxt-dict/commit/972ee5d))
- Include locale in useAsyncData key to prevent content cross-language ([dc7f39a](https://github.com/miaozhongfei/nuxt-dict/commit/dc7f39a))
- Remove BOM from markdown files to fix frontmatter parsing ([16ffe5e](https://github.com/miaozhongfei/nuxt-dict/commit/16ffe5e))
- Remove remaining # headings from missed markdown files ([f86155e](https://github.com/miaozhongfei/nuxt-dict/commit/f86155e))
- 修复模块发布后插件路径解析报 ENOENT 警告，新增 demo-base-api 示例 ([3922343](https://github.com/miaozhongfei/nuxt-dict/commit/3922343))

### 💅 Refactors

- Rename DictItem.code to value, remove useDictOptions ([39fbac5](https://github.com/miaozhongfei/nuxt-dict/commit/39fbac5))
- Remove old-style API, unify storeName to opts object ([9f6ad4d](https://github.com/miaozhongfei/nuxt-dict/commit/9f6ad4d))
- Data/tree 改为 DeepReadonly 只读，防止外部直接修改 ([ad79274](https://github.com/miaozhongfei/nuxt-dict/commit/ad79274))

### 📖 Documentation

- Add Nuxt UI and Vant examples to use-dict-options (zh/en/fa) ([dae3bbb](https://github.com/miaozhongfei/nuxt-dict/commit/dae3bbb))
- Sync index description with zh version (en/fa) ([d51d9dc](https://github.com/miaozhongfei/nuxt-dict/commit/d51d9dc))
- Update zh index description and feature list ([aadeddb](https://github.com/miaozhongfei/nuxt-dict/commit/aadeddb))
- Add JSDoc for all public exports and generate doc ([5080be8](https://github.com/miaozhongfei/nuxt-dict/commit/5080be8))
- Add translateData to API signature, usage examples, and cross-store demo ([824f33e](https://github.com/miaozhongfei/nuxt-dict/commit/824f33e))
- 完善 README、添加 LICENSE、统一作者信息、docs 顶栏增加 GitHub 按钮 ([c1a21ea](https://github.com/miaozhongfei/nuxt-dict/commit/c1a21ea))

### 🏡 Chore

- Commit remaining config and code changes for docs site ([3ab4924](https://github.com/miaozhongfei/nuxt-dict/commit/3ab4924))
- Release 脚本显式指定 push origin dev ([369294c](https://github.com/miaozhongfei/nuxt-dict/commit/369294c))
- 恢复 v0.0.3 CHANGELOG 条目 ([106e2f8](https://github.com/miaozhongfei/nuxt-dict/commit/106e2f8))
- 同步版本号至 0.0.3（与已发布版本保持一致） ([f3e45cd](https://github.com/miaozhongfei/nuxt-dict/commit/f3e45cd))

### 🎨 Styles

- Oxfmt 格式化全部代码 ([352c75e](https://github.com/miaozhongfei/nuxt-dict/commit/352c75e))

### ❤️ Contributors

- Miaozhongfei ([@miaozhongfei](https://github.com/miaozhongfei))
- Miaozf <1103520414@qq.com>

## v0.0.3

[compare changes](https://github.com/miaozhongfei/nuxt-dict/compare/v0.0.2...v0.0.3)

### 🚀 Enhancements

- Add GitHub Pages deployment for docs site ([773da91](https://github.com/miaozhongfei/nuxt-dict/commit/773da91))
- Remove manual # headings from markdown, use frontmatter title with ContentRenderer ([bb8e6b0](https://github.com/miaozhongfei/nuxt-dict/commit/bb8e6b0))
- 新增 getDictItem 方法，translate/getDictItem/findPath 改为响应式，补充 JSDoc ([dfc1596](https://github.com/miaozhongfei/nuxt-dict/commit/dfc1596))

### 🔥 Performance

- 预建 itemMap/nodeMap/pathMap 索引映射，translate/getDictItem/findPath 查找 O(N) → O(1) ([61a25e0](https://github.com/miaozhongfei/nuxt-dict/commit/61a25e0))

### 🩹 Fixes

- Add explicit type annotation for dict plugin export ([1dfc222](https://github.com/miaozhongfei/nuxt-dict/commit/1dfc222))
- Add /en and /fa to prerender routes for multi-locale SSG ([972ee5d](https://github.com/miaozhongfei/nuxt-dict/commit/972ee5d))
- Include locale in useAsyncData key to prevent content cross-language ([dc7f39a](https://github.com/miaozhongfei/nuxt-dict/commit/dc7f39a))
- Remove BOM from markdown files to fix frontmatter parsing ([16ffe5e](https://github.com/miaozhongfei/nuxt-dict/commit/16ffe5e))
- Remove remaining # headings from missed markdown files ([f86155e](https://github.com/miaozhongfei/nuxt-dict/commit/f86155e))

### 💅 Refactors

- Rename DictItem.code to value, remove useDictOptions ([39fbac5](https://github.com/miaozhongfei/nuxt-dict/commit/39fbac5))
- Remove old-style API, unify storeName to opts object ([e3ff644](https://github.com/miaozhongfei/nuxt-dict/commit/e3ff644))
- Remove old-style API, unify storeName to opts object" ([ce343ec](https://github.com/miaozhongfei/nuxt-dict/commit/ce343ec))
- Remove old-style API, unify storeName to opts object ([9f6ad4d](https://github.com/miaozhongfei/nuxt-dict/commit/9f6ad4d))
- Data/tree 改为 DeepReadonly 只读，防止外部直接修改 ([ad79274](https://github.com/miaozhongfei/nuxt-dict/commit/ad79274))

### 📖 Documentation

- Add Nuxt UI and Vant examples to use-dict-options (zh/en/fa) ([dae3bbb](https://github.com/miaozhongfei/nuxt-dict/commit/dae3bbb))
- Sync index description with zh version (en/fa) ([d51d9dc](https://github.com/miaozhongfei/nuxt-dict/commit/d51d9dc))
- Update zh index description and feature list ([aadeddb](https://github.com/miaozhongfei/nuxt-dict/commit/aadeddb))
- Add JSDoc for all public exports and generate doc ([5080be8](https://github.com/miaozhongfei/nuxt-dict/commit/5080be8))
- Add translateData to API signature, usage examples, and cross-store demo ([824f33e](https://github.com/miaozhongfei/nuxt-dict/commit/824f33e))
- 完善 README、添加 LICENSE、统一作者信息、docs 顶栏增加 GitHub 按钮 ([c1a21ea](https://github.com/miaozhongfei/nuxt-dict/commit/c1a21ea))

### 🏡 Chore

- Commit remaining config and code changes for docs site ([3ab4924](https://github.com/miaozhongfei/nuxt-dict/commit/3ab4924))

### ❤️ Contributors

- Miaozf <1103520414@qq.com>

## v0.0.3

[compare changes](https://github.com/miaozhongfei/nuxt-dict/compare/v0.0.2...v0.0.3)

### 🚀 Enhancements

- Add GitHub Pages deployment for docs site ([773da91](https://github.com/miaozhongfei/nuxt-dict/commit/773da91))
- Remove manual # headings from markdown, use frontmatter title with ContentRenderer ([bb8e6b0](https://github.com/miaozhongfei/nuxt-dict/commit/bb8e6b0))
- 新增 getDictItem 方法，translate/getDictItem/findPath 改为响应式，补充 JSDoc ([dfc1596](https://github.com/miaozhongfei/nuxt-dict/commit/dfc1596))

### 🔥 Performance

- 预建 itemMap/nodeMap/pathMap 索引映射，translate/getDictItem/findPath 查找 O(N) → O(1) ([61a25e0](https://github.com/miaozhongfei/nuxt-dict/commit/61a25e0))

### 🩹 Fixes

- Add explicit type annotation for dict plugin export ([1dfc222](https://github.com/miaozhongfei/nuxt-dict/commit/1dfc222))
- Add /en and /fa to prerender routes for multi-locale SSG ([972ee5d](https://github.com/miaozhongfei/nuxt-dict/commit/972ee5d))
- Include locale in useAsyncData key to prevent content cross-language ([dc7f39a](https://github.com/miaozhongfei/nuxt-dict/commit/dc7f39a))
- Remove BOM from markdown files to fix frontmatter parsing ([16ffe5e](https://github.com/miaozhongfei/nuxt-dict/commit/16ffe5e))
- Remove remaining # headings from missed markdown files ([f86155e](https://github.com/miaozhongfei/nuxt-dict/commit/f86155e))

### 💅 Refactors

- Rename DictItem.code to value, remove useDictOptions ([39fbac5](https://github.com/miaozhongfei/nuxt-dict/commit/39fbac5))
- Remove old-style API, unify storeName to opts object ([e3ff644](https://github.com/miaozhongfei/nuxt-dict/commit/e3ff644))
- Remove old-style API, unify storeName to opts object" ([ce343ec](https://github.com/miaozhongfei/nuxt-dict/commit/ce343ec))
- Remove old-style API, unify storeName to opts object ([9f6ad4d](https://github.com/miaozhongfei/nuxt-dict/commit/9f6ad4d))
- Data/tree 改为 DeepReadonly 只读，防止外部直接修改 ([ad79274](https://github.com/miaozhongfei/nuxt-dict/commit/ad79274))

### 📖 Documentation

- Add Nuxt UI and Vant examples to use-dict-options (zh/en/fa) ([dae3bbb](https://github.com/miaozhongfei/nuxt-dict/commit/dae3bbb))
- Sync index description with zh version (en/fa) ([d51d9dc](https://github.com/miaozhongfei/nuxt-dict/commit/d51d9dc))
- Update zh index description and feature list ([aadeddb](https://github.com/miaozhongfei/nuxt-dict/commit/aadeddb))
- Add JSDoc for all public exports and generate doc ([5080be8](https://github.com/miaozhongfei/nuxt-dict/commit/5080be8))
- Add translateData to API signature, usage examples, and cross-store demo ([824f33e](https://github.com/miaozhongfei/nuxt-dict/commit/824f33e))
- 完善 README、添加 LICENSE、统一作者信息、docs 顶栏增加 GitHub 按钮 ([c1a21ea](https://github.com/miaozhongfei/nuxt-dict/commit/c1a21ea))

### 🏡 Chore

- Commit remaining config and code changes for docs site ([3ab4924](https://github.com/miaozhongfei/nuxt-dict/commit/3ab4924))

### ❤️ Contributors

- Miaozf <1103520414@qq.com>

## v0.0.2

### 🚀 Enhancements

- Initial commit ([a9d80bb](https://github.com/miaozhongfei/nuxt-dict/commit/a9d80bb))

### 🏡 Chore

- Add release:e2e and release:e2e:major scripts ([b052170](https://github.com/miaozhongfei/nuxt-dict/commit/b052170))
- Add changelogen dev dependency ([4bf684e](https://github.com/miaozhongfei/nuxt-dict/commit/4bf684e))

### ❤️ Contributors

- Miaozf <1103520414@qq.com>
