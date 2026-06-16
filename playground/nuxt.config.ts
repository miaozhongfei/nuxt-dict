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

    // ========== 场景 3：自定义适配器（接收 storeName 做路由） ==========
    // 注意：api.adapter 中的函数经过 Nuxt runtimeConfig 序列化后在客户端不可用。
    // 推荐方案：在服务端模块或自定义插件中通过工厂函数创建 adapter，直接注入 DictManager。
    // api: {
    //   adapter: {
    //     async fetchDict(storeName, { types, locale }) {
    //       console.log(`[CustomAdapter] fetchDict storeName="${storeName}" types=${types}`)
    //       // 根据 storeName 路由到不同后端或返回不同数据
    //       const prefix = storeName === 'payment' ? '支付' : '默认'
    //       return { version: 'custom-1.0.0', data: { ... } }
    //     },
    //     async fetchVersion(storeName) {
    //       console.log(`[CustomAdapter] fetchVersion storeName="${storeName}"`)
    //       return `custom-${storeName}-1.0.0`
    //     },
    //   },
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
      // 示例：payment 仓库使用自定义适配器（不走 HTTP，直接返回硬编码数据）
      // payment: { adapter: { ... } },
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
