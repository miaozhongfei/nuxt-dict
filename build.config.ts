import { defineBuildConfig } from 'unbuild';

export default defineBuildConfig({
  clean: true,
  declaration: true,
  // rollup: {
  //   inlineDependencies: true,
  //   esbuild: { minify: true },
  // },
  externals: [
    // Nuxt 全家桶（必须）
    'nuxt',
    '@nuxt/schema',
    '@nuxt/kit',

    // Vue 全家桶（可选）
    'vue',
    '@vue/shared',
    '@vue/reactivity',
    '@vue/runtime-core',

    // 其他依赖（可选）
    'nuxt-auth-utils',
    'defu',
    'consola',
    'dexie',
  ],
});
