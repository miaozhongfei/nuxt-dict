// https://nuxt.com/docs/api/configuration/nuxt-config

const isDev = import.meta.env.DEV;

const APP_BASEURL = '/demo-multi-store/';

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
  // 禁用 Google Fonts 自动下载（国内网络不可达）
  fonts: {
    providers: { google: false, googleicons: false },
  },
  // 预打包运行时发现的新依赖，避免 HMR 时页面全量刷新
  vite: {
    optimizeDeps: { include: ['@vue/devtools-core', '@vue/devtools-kit'] },
  },
  // 开发工具 - 开发体验
  devtools: { enabled: isDev },
  devServer: {
    port: 5023,
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
   * nuxt-dict 多仓库配置示例
   * 5 个仓库覆盖 REST/自定义适配器 × lazy on/off 全组合
   */
  dict: {
    api: {
      baseURL: APP_BASEURL.replace(/\/$/u, ''),
      dictEndpoint: '/api/dict/list',
      versionEndpoint: '/api/dict/version',
    },
    stores: {
      // REST + lazy: false（默认）— 独立端点，立即版本检查
      dicts2: { dictEndpoint: '/api/dict/list2' },
      // REST + lazy: true — 同 dicts2 端点，惰性版本检查
      dicts3: { dictEndpoint: '/api/dict/list2', lazy: true },
      // 自定义 adapter（~/dict/dicts4-adapter.ts 约定路径自动发现）+ lazy: false
      dicts4: { lazy: false },
      // 自定义 adapter（~/dict/dicts5-adapter.ts 约定路径自动发现）+ lazy: true
      dicts5: { lazy: true },
    },
  },
});
