const isDev = import.meta.env.DEV;

export default defineNuxtConfig({
  modules: ['../src/module', 'nuxt-skill-hub', '@element-plus/nuxt'],
  // 开发工具 - 开发体验
  devtools: { enabled: isDev },
  sourcemap: {
    client: isDev,
    server: isDev,
  },
  logLevel: isDev ? 'verbose' : 'info',
  debug: isDev,
  devServer: {
    port: 5000,
  },
  build: {
    transpile: ['vant'],
  },
  dict: {
    // ========== 场景 1：内部 API（当前 playground 默认） ==========
    api: {
      baseURL: '',
      dictEndpoint: '/api/dict/list',
      versionEndpoint: '/api/dict/version',
    },
    // ========== 场景 2：外部第三方接口 ==========
    // api: {
    //   baseURL: 'https://api.example.com',
    //   dictEndpoint: '/v1/dictionary',
    //   versionEndpoint: '/v1/dictionary/version',
    // },

    // ========== 场景 3：自定义适配器（文件路径方式） ==========
    // 方式一：约定路径自动发现 — 放置 ~/dict/dict-adapter.ts 即可，无需配置
    // 方式二：显式指定文件路径
    // api: {
    //   adapter: '~/dict/dict-adapter',
    // },
    locale: {
      default: 'zh-CN',
      source: 'cookie',
      paramKey: 'lang',
      apiHeaderKey: '',
    },
    stores: {
      // dicts2 仓库使用独立的 API 端点（/api/dict/list2），返回不同数据
      dicts2: { dictEndpoint: '/api/dict/list2' },
      // 示例：payment 仓库使用自定义适配器（约定路径 ~/dict/payment-adapter.ts 或显式指定）
      // payment: { adapter: '~/dict/payment-adapter' },
    },
    ssr: {
      // prefetch: ['gender', 'status', 'region', 'industry'],
      prefetch: [],
    },
  },
  compatibilityDate: '2025-06-10',
  skillHub: {
    // 推荐：明确告诉它要生成给哪个 Agent
    targets: ['claude-code', 'opencode', 'agents'],
  },
});
