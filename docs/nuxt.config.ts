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
  i18n: {
    locales: [
      { code: 'zh', language: 'zh-CN', name: '中文', file: 'zh.json' ,dir: 'ltr'},
      { code: 'en', language: 'en-US', name: 'English', file: 'en.json' ,dir: 'ltr'},
      { code: 'fa', name: 'Farsi', language: 'fa-IR', file: 'fa.json' ,dir: 'rtl' },
    ],
    strategy: 'prefix_except_default',
    defaultLocale: 'zh',
  },
})
