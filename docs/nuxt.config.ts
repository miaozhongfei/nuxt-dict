// https://nuxt.com/docs/api/configuration/nuxt-config

const isDev = import.meta.env.DEV

export default defineNuxtConfig({
  modules: ['@nuxt/ui', '@nuxtjs/i18n', '@nuxt/content', '@nuxtjs/color-mode'],
  // 开发工具 - 开发体验
  devtools: { enabled: isDev },
  devServer: {
    port: 5010,
  },
  future: {
    compatibilityVersion: 4,
  },
  compatibilityDate: '2025-06-10',
  // GitHub Pages 部署：项目站点 /nuxt-dict/ 为应用基础路径
  app: {
    baseURL: '/nuxt-dict/',
  },
  // Nuxt Content v3 数据库：利用 Node 26 内置 SQLite，无需安装 better-sqlite3
  content: {
    experimental: { sqliteConnector: 'native' },
  },
  i18n: {
    locales: [
      { code: 'zh', language: 'zh-CN', name: '中文', file: 'zh.json' ,dir: 'ltr'},
      { code: 'en', language: 'en-US', name: 'English', file: 'en.json' ,dir: 'ltr'},
      { code: 'fa', name: 'Farsi', language: 'fa-IR', file: 'fa.json' ,dir: 'rtl' },
    ],
    strategy: 'prefix_except_default',
    defaultLocale: 'zh',
  },
  // 静态生成：从首页爬取所有链接，预渲染全部 60 个内容页面
  nitro: {
    prerender: {
      crawlLinks: true,
      routes: ['/'],
    },
  },
})
