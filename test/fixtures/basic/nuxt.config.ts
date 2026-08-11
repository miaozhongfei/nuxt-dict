// 测试专用迷你 Nuxt 应用：仅为 @nuxt/test-utils 提供运行环境（#imports / runtimeConfig），不渲染演示页面。
export default defineNuxtConfig({
  // 安装本模块，使其 setup() 把配置注入 runtimeConfig.public.dict
  modules: ['../../../src/module'],
  // app.vue 放在 fixture 根目录
  srcDir: '.',
  // 写死测试所需的基础字典配置，测试直接读模块注入的真实配置
  dict: {
    api: {
      baseURL: '',
      dictEndpoint: '/api/dict/list',
      versionEndpoint: '/api/dict/version',
    },
    locale: {
      default: 'zh-CN',
      source: 'cookie',
    },
  },
  compatibilityDate: '2025-06-10',
})
