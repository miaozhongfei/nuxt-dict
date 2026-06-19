// https://nuxt.com/docs/api/configuration/nuxt-config

const isDev = import.meta.env.DEV;

const APP_BASEURL = '/demo-base-adapter/';

export default defineNuxtConfig({
  modules: [
    '@nuxt/ui',
    '@nuxtjs/i18n',
    '@vueuse/nuxt',
    '@pinia/nuxt',
    'pinia-plugin-persistedstate/nuxt',
    '@nuxtjs/tailwindcss',
    '@element-plus/nuxt',
    '@lacqjs/nuxt-dict',
  ],
  css: ['~/assets/css/main.css'],
  // 开发工具 - 开发体验
  devtools: { enabled: isDev },
  devServer: {
    port: 5022,
  },
  future: {
    compatibilityVersion: 4,
  },
  compatibilityDate: '2025-06-10',
  // GitHub Pages 部署：项目站点 /nuxt-dict/ 为应用基础路径
  app: {
    baseURL: APP_BASEURL,
  },
  i18n: {
    locales: [
      { code: 'zh', language: 'zh-CN', name: '中文', file: 'zh.json', dir: 'ltr' },
      { code: 'en', language: 'en-US', name: 'English', file: 'en.json', dir: 'ltr' },
    ],
    strategy: 'prefix_except_default',
    defaultLocale: 'zh',
  },
  /**
   * nuxt-dict 字典模块配置
   * 本示例使用自定义 GraphQL 适配器（定义在 ~/dict/dict-adapter.ts）
   * 模块自动发现约定路径 ~/dict/dict-adapter.ts，无需显式配置 adapter
   */
  dict: {},
});
