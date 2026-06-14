import { fileURLToPath } from 'url';

import { addImportsDir, addPlugin, addTypeTemplate, createResolver, defineNuxtModule, useLogger } from '@nuxt/kit';
import type { Nuxt } from '@nuxt/schema';

import pkg from '../package.json';
import type { ModuleOptions } from './runtime/types';
import { defaultOptions } from './runtime/options';
import { createLogger } from './runtime/utils/logger';
import type { Resolver } from '@nuxt/kit';

export type { ModuleOptions };
export type { DictManager } from './runtime/core/dict-manager'
export type { DictTranslator } from './runtime/types'
export { createDictTranslator } from './runtime/utils/dict-translator'

/**
 * 注册类型模板：NuxtApp 扩展声明 + 仓库名字面量联合类型。
 * 抽取到独立函数以控制 setup 函数行数。
 */
function registerTypeTemplates(resolver: Resolver, stores: ModuleOptions['stores']) {
  // 生成 NuxtApp 类型增强声明，使 $dict / $dictManager 有 IDE 提示
  addTypeTemplate({
    filename: 'types/nuxt-dict.d.ts',
    getContents: () => `
import type { StoreKey } from '#build/types/nuxt-dict-store-names'

declare module '#app' {
  interface NuxtApp {
    $dict: {
      translate(type: string, code: string | number, opts?: { storeName?: StoreKey; field?: string }): string
      translatePath(type: string, code: string | number, opts?: { storeName?: StoreKey; field?: string; separator?: string }): string
    }
  }
}

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $dict: {
      translate(type: string, code: string | number, opts?: { storeName?: StoreKey; field?: string }): string
      translatePath(type: string, code: string | number, opts?: { storeName?: StoreKey; field?: string; separator?: string }): string
    }
  }
}

export {}
`,
  })

  // 生成仓库名字面量联合类型，用于编译期校验 storeName 参数
  addTypeTemplate({
    filename: 'types/nuxt-dict-store-names.d.ts',
    getContents: () => {
      const storeNames = ['dicts', ...Object.keys(stores ?? {})]
      const union = storeNames.map((s) => `'${s}'`).join(' | ')
      return `export type StoreKey = ${union}\n`
    },
  })
}

/**
 * Nuxt Dict 模块入口。
 * 提供字典数据的统一管理、缓存、翻译和 SSR 预取能力。
 * 用户通过 nuxt.config.ts 的 `dict` 配置项进行定制。
 */
export default defineNuxtModule<ModuleOptions>().with({
  meta: {
    name: pkg.name,
    version: pkg.version,
    configKey: 'dict',
    compatibility: {
      nuxt: pkg.devDependencies.nuxt || '^4.4.0',
    },
    moduleDependencies: {},
  },
  defaults: defaultOptions,
  setup(_options, _nuxt) {
    const logger = useLogger(pkg.name, { level: _options.logLevel });
    logger.debug(`初始化模块 ${pkg.name}`);
    logger.debug(`${pkg.name} 模块选项:`, _options);
    if (!_options.enable) {
      logger.debug(`${pkg.name} 模块被禁用，跳过设置。`);
      return;
    }
    const resolver = createResolver(import.meta.url);

    const runtimeDir = fileURLToPath(new URL('./runtime', import.meta.url));

    // 将解析后的选项写入 runtimeConfig，供运行时插件读取
    _nuxt.options.runtimeConfig.public.dict = _options;

    // 确保运行时目录被转译（支持现代 ES 语法）
    _nuxt.options.build.transpile.push(resolver.resolve(runtimeDir));

    // 注册插件
    addPlugin({ src: resolver.resolve(runtimeDir, 'plugins', 'dict.ts') });

    // 注册 composables 目录，自动导入 useDict / useDictTree / useLocale
    addImportsDir(resolver.resolve(runtimeDir, 'composables'));

    registerTypeTemplates(resolver, _options.stores);

    // 确保 TypeScript 能解析本模块的类型引用
    _nuxt.hook('prepare:types', ({ references }) => {
      references.push({ types: pkg.name });
    });
  },
  /** 模块首次安装到项目时触发 */
  onInstall(_nuxt: Nuxt) {
    const logger = createLogger(pkg.name);
    logger.info(`首次为 ${pkg.name} 进行设置！`);
  },
  /** 模块版本升级时触发（使用 semver 比较，每版本只触发一次） */
  onUpgrade(_nuxt: Nuxt, _options: ModuleOptions, _previousVersion: string) {
    const logger = createLogger(pkg.name, { level: _options.logLevel });
    logger.info(`升级 ${pkg.name} 从 ${_previousVersion} 到 ${pkg.version}`);
  },
});
