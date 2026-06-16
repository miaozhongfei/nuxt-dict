// https://nuxt.com/docs/api/configuration/nuxt-config

const isDev = import.meta.env.DEV;

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
  // 开发工具 - 开发体验
  devtools: { enabled: isDev },
  devServer: {
    port: 5021,
  },
  future: {
    compatibilityVersion: 4,
  },
  compatibilityDate: '2025-06-10',
  // GitHub Pages 部署：项目站点 /nuxt-dict/ 为应用基础路径
  app: {
    baseURL: '/demo-base-api/',
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
   * 本示例只配置 api.baseURL，其余全部使用默认值
   * 生产环境只需修改 baseURL 即可切换为 Java 后端或第三方接口：
   *   相对路径（同域）: '/api'
   *   空字符串（直接拼接）: ''
   *   绝对路径（跨域）: 'https://your-java-backend.com'
   */
  dict: {
    api: {
      baseURL: '/api',
    },
  },
});
