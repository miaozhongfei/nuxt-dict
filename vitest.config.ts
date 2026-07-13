import { fileURLToPath } from 'node:url'

import { defineVitestConfig } from '@nuxt/test-utils/config'

export default defineVitestConfig({
  test: {
    // 默认 node 环境（纯单元测试秒跑）；
    // 需要 Nuxt 运行环境（#imports / runtimeConfig）的用例在文件顶部用 `// @vitest-environment nuxt` 覆盖
    environment: 'node',
    include: ['test/**/*.test.ts'],
    environmentOptions: {
      nuxt: {
        // 指向测试专用迷你 Nuxt 应用
        rootDir: fileURLToPath(new URL('./test/fixtures/basic', import.meta.url)),
        domEnvironment: 'jsdom',
      },
    },
  },
})
