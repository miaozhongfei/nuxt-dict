# Changelog

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
- Remove old-style  API, unify storeName to opts object ([e3ff644](https://github.com/miaozhongfei/nuxt-dict/commit/e3ff644))
- Remove old-style  API, unify storeName to opts object" ([ce343ec](https://github.com/miaozhongfei/nuxt-dict/commit/ce343ec))
- Remove old-style  API, unify storeName to opts object ([9f6ad4d](https://github.com/miaozhongfei/nuxt-dict/commit/9f6ad4d))
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
