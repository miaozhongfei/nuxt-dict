/* eslint-disable max-lines */
import {
  addImports,
  addImportsDir,
  addPlugin,
  addTemplate,
  addTypeTemplate,
  createResolver,
  defineNuxtModule,
  useLogger,
} from '@nuxt/kit';
import type { Resolver } from '@nuxt/kit';
import type { Nuxt } from '@nuxt/schema';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';

import pkg from '../package.json';
import { defaultOptions } from './runtime/options';
import type { ModuleOptions } from './runtime/types';
import { createLogger } from './runtime/utils/logger';

export type { ModuleOptions };
export type { DictManager } from './runtime/core/dict-manager';
export type {
  DictAdapter,
  DictTranslator,
  DictItem,
  TreeNode,
  TranslateOptions,
  TranslatePathOptions,
  GetDictItemOptions,
} from './runtime/types';
export { createDictTranslator } from './runtime/utils/dict-translator';
export { defineDictAdapter } from './runtime/core/define-adapter';

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
  });

  // 生成仓库名字面量联合类型，用于编译期校验 storeName 参数
  addTypeTemplate({
    filename: 'types/nuxt-dict-store-names.d.ts',
    getContents: () => {
      const storeNames = ['dicts', ...Object.keys(stores ?? {})];
      const union = storeNames.map((s) => `'${s}'`).join(' | ');
      return `export type StoreKey = ${union}\n`;
    },
  });
}

/**
 * 解析自定义适配器文件路径：显式配置 > 约定路径自动发现。
 * 约定路径为 ~/dict/{conventionName}.ts（或 .js / .mjs）。
 * @param nuxt Nuxt 实例，用于读取 srcDir
 * @param explicitPath 用户在配置中显式指定的文件路径（如 '~/dict/dict-adapter'）
 * @param conventionName 约定文件名（不含扩展名），如 'dict-adapter' 或 '{storeName}-adapter'
 * @returns 解析后的文件路径字符串，未找到时返回 undefined
 */
function resolveAdapterPath(
  nuxt: Nuxt,
  explicitPath: unknown,
  conventionName: string,
): string | undefined {
  // 显式配置优先（类型检查确保为有效字符串）
  if (typeof explicitPath === 'string') return explicitPath;
  // 约定路径发现：检查 ~/dict/{conventionName}.{ts,js,mjs}
  const base = resolve(nuxt.options.srcDir, 'dict', conventionName);
  for (const ext of ['.ts', '.js', '.mjs']) {
    // 规范化为正斜杠，兼容 Windows 路径在 import 语句中的使用
    if (existsSync(base + ext)) return (base + ext).replaceAll('\\', '/');
  }
  return undefined;
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

    // ── 自定义适配器：约定路径发现 + 显式配置 ──
    const globalAdapterPath = resolveAdapterPath(
      _nuxt, _options.api?.adapter, 'dict-adapter',
    );

    const storeAdapterPaths: Record<string, string> = {};
    for (const [name, config] of Object.entries(_options.stores ?? {})) {
      const adapterPath = resolveAdapterPath(
        _nuxt, config.adapter, `${name}-adapter`,
      );
      if (adapterPath) storeAdapterPaths[name] = adapterPath;
    }

    // 生成 virtual module: 全局 adapter + per-store adapters（插件通过 import 获取，不经序列化）
    addTemplate({
      filename: 'nuxt-dict/adapters.ts',
      getContents: () => {
        let code = '';
        // 全局 adapter
        if (globalAdapterPath) {
          code += `export { default as globalAdapter } from '${globalAdapterPath}'\n`;
        } else {
          code += 'export const globalAdapter = undefined\n';
        }
        // per-store adapters
        const entries = Object.entries(storeAdapterPaths);
        if (entries.length > 0) {
          code += entries.map(([name, p]) =>
            `import adapter_${name.replaceAll(/\W/gu, '_')} from '${p}'`,
          ).join('\n') + '\n';
          code += `export const storeAdapters = { ${entries.map(([name]) =>
            `'${name}': adapter_${name.replaceAll(/\W/gu, '_')}`,
          ).join(', ')} }\n`;
        } else {
          code += 'export const storeAdapters = {} as Record<string, never>\n';
        }
        return code;
      },
    });

    // 生成 virtual module 的类型声明
    addTypeTemplate({
      filename: 'types/nuxt-dict-adapters.d.ts',
      getContents: () => `
declare module '#build/nuxt-dict/adapters' {
  import type { DictAdapter } from '@lacqjs/nuxt-dict'
  export const globalAdapter: DictAdapter | undefined
  export const storeAdapters: Record<string, DictAdapter>
}
`,
    });

    // 内联函数适配器的兼容性警告
    if (_options.api?.adapter && typeof _options.api.adapter !== 'string') {
      logger.warn(
        'dict.api.adapter 不支持内联函数（无法序列化到客户端）。'
        + '请改用文件路径或将文件放在约定位置 ~/dict/dict-adapter.ts',
      );
    }

    // 剥离 adapter 后写入 runtimeConfig（adapter 通过 virtual module 传递，不走序列化）
    const { adapter: _globalAdapter, ...apiWithoutAdapter } = _options.api;
    const sanitizedStores: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(_options.stores ?? {})) {
      const { adapter: _storeAdapter, ...rest } = v;
      sanitizedStores[k] = rest;
    }
    _nuxt.options.runtimeConfig.public.dict = {
      ..._options,
      api: apiWithoutAdapter,
      stores: sanitizedStores,
    };

    // 确保运行时目录被转译（支持现代 ES 语法）
    _nuxt.options.build.transpile.push(resolver.resolve('./runtime'));
    // 确保 dexie 被 Vite 正确处理（避免 CJS/ESM 解析问题）
    _nuxt.options.build.transpile.push('dexie');

    // 注册插件（无扩展名，Nuxt 构建时自动解析对应文件）
    addPlugin(resolver.resolve('./runtime/plugins/dict'));

    // 注册 composables 目录，自动导入 useDict / useDictTree / useLocale
    addImportsDir(resolver.resolve('./runtime/composables'));

    // 注册 defineDictAdapter 自动导入，用户无需手动 import 即可在 adapter 文件中直接使用
    addImports([{ name: 'defineDictAdapter', from: resolver.resolve('./runtime/core/define-adapter') }]);

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
