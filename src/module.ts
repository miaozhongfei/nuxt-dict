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
export type { DictTranslator, DictItem, TreeNode, TranslateOptions, TranslatePathOptions, GetDictItemOptions } from './runtime/types'
export { createDictTranslator } from './runtime/utils/dict-translator'

/**
 * 注册类型模板：NuxtApp 扩展声明 + 仓库名字面量联合类型。
 * 抽取到独立函数以控制 setup 函数行数。
 */
// eslint-disable max-lines-per-function
function registerTypeTemplates(resolver: Resolver, stores: ModuleOptions['stores']) {
  // 生成 NuxtApp 类型增强声明，使 $dict / $dictManager 有 IDE 提示
  // eslint-disable max-lines-per-function
  addTypeTemplate({
    filename: 'types/nuxt-dict.d.ts',
    // eslint-disable max-lines-per-function
    getContents: () => `
import type { StoreKey } from '#build/types/nuxt-dict-store-names'

declare module '#app' {
  interface NuxtApp {
    $dict: {
      /**
       * 同步翻译字典编码 → 文本。
       * @description 同步翻译字典编码 → 文本。从全局内存缓存中查找编码对应的文本，缓存未命中时返回 code 原样。先通过 useDict 等加载数据后调用。
       * @param type - 字典类型名，如 'gender'
       * @param code - 编码值
       * @param opts - 可选配置对象
       * @param {StoreKey} [opts.storeName] - 指定仓库名
       * @param {string} [opts.field] - 指定取值字段，默认 'label'
       * @returns {string} 翻译文本，缓存未命中时返回 code 原样
       * @example
       * $dict.translate('gender', 'male')
       * $dict.translate('gender', 'male', { storeName: 'dicts2' })
       */
      translate(type: string, code: string | number, opts?: { storeName?: StoreKey; field?: string }): string
      /**
       * 树形字典中查找编码的完整层级路径。
       * @description 树形字典中查找编码的完整层级路径。从内存缓存中加载的树形字典数据里，通过 DFS 查找目标编码并回溯完整路径，用分隔符拼接后返回。
       * @param type - 树形字典类型名，如 'region'
       * @param code - 叶子节点编码值
       * @param opts - 可选配置对象
       * @param {StoreKey} [opts.storeName] - 指定仓库名
       * @param {string} [opts.field] - 指定节点取值字段，默认 'label'
       * @param {string} [opts.separator] - 层级路径分隔符，默认 ' / '
       * @returns {string} 用分隔符连接的完整层级路径，缓存未命中时返回 code 原样
       * @example
       * $dict.translatePath('region', '440104')
       * $dict.translatePath('region', '440104', { separator: ' → ' })
       */
      translatePath(type: string, code: string | number, opts?: { storeName?: StoreKey; field?: string; separator?: string }): string
      /**
       * 批量翻译数据对象中的多个编码字段。
       * @description 批量翻译数据对象中的多个编码字段。传入一个数据对象和字段→字典类型映射表，返回追加了翻译字段的新对象（不修改原对象）。
       * @param data - 需要翻译的数据对象，如 { gender: 'male', status: 1 }
       * @param mapping - 字段→字典类型映射表，值为 string（默认仓库）或 { type, storeName? }（指定仓库）
       * @param suffix - 翻译字段后缀，默认 '_label'，结果写入 原字段名 + suffix
       * @returns {Record<string, unknown>} 新对象，包含原数据所有字段 + 以 suffix 为后缀的翻译字段
       * @example
       * $dict.translateData(
       *   { gender: 'male', status: 1, name: '张三' },
       *   { gender: 'gender', status: 'status' }
       * )
       * // → { ..., gender_label: '男', status_label: '禁用', ... }
       */
       translateData(data: Record<string, unknown>, mapping: Record<string, string | { type: string; storeName?: StoreKey }>, suffix?: string): Record<string, unknown>
       /**
        * 从内存缓存中查找编码对应的完整字典项对象。
        * @description 从已加载的缓存中查找编码对应的完整 DictItem 对象（非字符串翻译）。缓存未命中时返回 undefined。
        * @param type - 字典类型名，如 'gender'
        * @param code - 编码值
        * @param opts - 可选配置对象
        * @param {StoreKey} [opts.storeName] - 指定仓库名
        * @returns {DictItem | undefined} 完整的字典项对象，缓存未命中时返回 undefined
        * @example
        * $dict.getDictItem('gender', 'male')
        * $dict.getDictItem('gender', 'male', { storeName: 'dicts2' })
        */
       getDictItem(type: string, code: string | number, opts?: { storeName?: StoreKey }): DictItem | undefined
     }
   }
 }

 declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $dict: {
      /**
       * 同步翻译字典编码 → 文本。
       * @description 同步翻译字典编码 → 文本。从全局内存缓存中查找编码对应的文本，缓存未命中时返回 code 原样。
       * @param type - 字典类型名，如 'gender'
       * @param code - 编码值
       * @param opts - 可选配置对象
       * @param {StoreKey} [opts.storeName] - 指定仓库名
       * @param {string} [opts.field] - 指定取值字段，默认 'label'
       * @returns {string} 翻译文本，缓存未命中时返回 code 原样
       * @example
       * $dict.translate('gender', 'male')
       * $dict.translate('gender', 'male', { storeName: 'dicts2' })
       */
      translate(type: string, code: string | number, opts?: { storeName?: StoreKey; field?: string }): string
      /**
       * 树形字典中查找编码的完整层级路径。
       * @description 树形字典中查找编码的完整层级路径。通过 DFS 查找目标编码并回溯完整路径，用分隔符拼接后返回。
       * @param type - 树形字典类型名，如 'region'
       * @param code - 叶子节点编码值
       * @param opts - 可选配置对象
       * @param {StoreKey} [opts.storeName] - 指定仓库名
       * @param {string} [opts.field] - 指定节点取值字段，默认 'label'
       * @param {string} [opts.separator] - 层级路径分隔符，默认 ' / '
       * @returns {string} 用分隔符连接的完整层级路径，缓存未命中时返回 code 原样
       * @example
       * $dict.translatePath('region', '440104')
       * $dict.translatePath('region', '440104', { separator: ' → ' })
       */
      translatePath(type: string, code: string | number, opts?: { storeName?: StoreKey; field?: string; separator?: string }): string
      /**
       * 批量翻译数据对象中的多个编码字段。
       * @description 批量翻译数据对象中的多个编码字段。传入字段→字典类型映射表，返回含翻译字段的新对象（不修改原对象）。
       * @param data - 需要翻译的数据对象，如 { gender: 'male', status: 1 }
       * @param mapping - 字段→字典类型映射表，值为 string（默认仓库）或 { type, storeName? }（指定仓库）
       * @param suffix - 翻译字段后缀，默认 '_label'
       * @returns {Record<string, unknown>} 新对象，包含原数据所有字段 + 以 suffix 为后缀的翻译字段
       * @example
       * $dict.translateData(
       *   { gender: 'male', status: 1, name: '张三' },
       *   { gender: 'gender', status: 'status' }
       * )
       * // → { ..., gender_label: '男', status_label: '禁用', ... }
       */
       translateData(data: Record<string, unknown>, mapping: Record<string, string | { type: string; storeName?: StoreKey }>, suffix?: string): Record<string, unknown>
       /**
        * 从内存缓存中查找编码对应的完整字典项对象。
        * @description 从已加载的缓存中查找编码对应的完整 DictItem 对象（非字符串翻译）。缓存未命中时返回 undefined。
        * @param type - 字典类型名，如 'gender'
        * @param code - 编码值
        * @param opts - 可选配置对象
        * @param {StoreKey} [opts.storeName] - 指定仓库名
        * @returns {DictItem | undefined} 完整的字典项对象，缓存未命中时返回 undefined
        * @example
        * $dict.getDictItem('gender', 'male')
        * $dict.getDictItem('gender', 'male', { storeName: 'dicts2' })
        */
       getDictItem(type: string, code: string | number, opts?: { storeName?: StoreKey }): DictItem | undefined
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
