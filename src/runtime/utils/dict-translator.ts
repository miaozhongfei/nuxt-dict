import type { DictManager } from '../core/dict-manager';
import type {
  DictTranslator,
  DictItem,
  TranslateOptions,
  TranslatePathOptions,
  GetDictItemOptions,
  StoreKey,
} from '../types';

/** 批翻译映射配置：字段名 → 字典类型 string 或 { type, storeName? } */
type TranslateDataMappingValue = string | { type: string; storeName?: StoreKey };
type TranslateDataMapping = Record<string, TranslateDataMappingValue>;

/**
 * 通过字典类型和编码获取翻译文本。
 * 旧式 storeName 作为首参的写法已移除，统一通过 opts.storeName 指定仓库。
 * 由 createDictTranslator 内部委托，独立为函数以控制长度。
 */
function translate(
  manager: DictManager,
  type: string,
  code: string | number,
  opts?: TranslateOptions,
): string {
  return manager.translate(type, code, opts);
}

/**
 * 获取树形字典中某个编码的完整层级路径。
 * 旧式 storeName 作为首参的写法已移除，统一通过 opts 指定仓库和分隔符。
 * 由 createDictTranslator 内部委托，独立为函数以控制长度。
 */
function translatePath(
  manager: DictManager,
  type: string,
  code: string | number,
  opts?: TranslatePathOptions,
): string {
  return manager.translatePath(type, code, opts);
}

/**
 * 从内存缓存中查找编码对应的完整字典项对象。
 * 与 translate 参数一致，但返回整个 DictItem 而非提取字符串字段。
 * 由 createDictTranslator 内部委托，独立为函数以控制长度。
 */
function getDictItem(
  manager: DictManager,
  type: string,
  code: string | number,
  opts?: GetDictItemOptions,
): DictItem | undefined {
  return manager.getDictItem(type, code, opts);
}

/**
 * 批量翻译数据对象中的指定字段，返回追加了翻译字段的新对象。
 * 由 createDictTranslator 内部委托，独立为函数以控制长度。
 */
function translateData(
  manager: DictManager,
  data: Record<string, unknown>,
  mapping: TranslateDataMapping,
  suffix: string,
): Record<string, unknown> {
  const result: Record<string, unknown> = { ...data };
  for (const [key, mapValue] of Object.entries(mapping)) {
    const code = data[key];
    const type = typeof mapValue === 'string' ? mapValue : mapValue.type;
    const storeName = typeof mapValue === 'string' ? undefined : mapValue.storeName;
    const translated =
      code !== undefined && code !== null
        ? translate(manager, type, code as string | number, storeName ? { storeName } : undefined)
        : '';
    result[key + suffix] = translated;
  }
  return result;
}

/**
 * 创建字典翻译器，封装 translate / translatePath / translateData 方法。
 * 作为 $dict 注入到 NuxtApp，供组件直接调用翻译。
 * 使用包装层而非直接暴露 DictManager，以控制公开 API 范围。
 *
 * 仓库名统一通过 opts.storeName 指定，不再接受首参为 storeName 的旧式写法。
 *
 * @param {DictManager} manager - 字典管理器实例，提供底层 translate 能力
 * @returns {DictTranslator} 翻译器对象，含 translate / translatePath / translateData 方法
 *
 * @example
 * // 默认存储库 'dicts'
 * $dict.translate('gender', value)
 * $dict.translatePath('region', value)
 *
 * // 指定存储库 + 自定义字段
 * $dict.translate('gender', value, { storeName: 'dicts2', field: 'name' })
 * $dict.translatePath('region', value, { storeName: 'dicts2', field: 'value', separator: ' -> ' })
 *
 * // 默认存储库 + 自定义字段
 * $dict.translate('gender', value, { field: 'name' })
 *
 * // 批量翻译数据对象中的字段
 * $dict.translateData(
 *   { gender: 'male', status: 1 },
 *   { gender: 'gender', status: 'status' }
 * )
 * // → { gender: 'male', gender_label: '男', status: 1, status_label: '启用' }
 */
// eslint-disable max-lines-per-function
export function createDictTranslator(manager: DictManager): DictTranslator {
  return {
    /**
     * 同步翻译字典编码 → 文本。
     *
     * @description 从全局内存缓存中查找编码对应的文本，未命中时返回 code 原样。先通过 useDict 等加载数据后调用。
     * @param {string} type - 字典类型名，如 'gender'、'status'
     * @param {string | number} code - 字典编码值
     * @param {TranslateOptions} [opts] - 可选配置（storeName 指定仓库，field 指定取值字段，默认 'label'）
     * @returns {string} 翻译后的文本，缓存未命中时返回 String(code)
     *
     * @example
     * $dict.translate('gender', 'male')
     * $dict.translate('gender', 'male', { storeName: 'dicts2' })
     * $dict.translate('status', 1, { field: 'color' })
     */
    translate(type: string, code: string | number, opts?: TranslateOptions): string {
      return translate(manager, type, code, opts);
    },

    /**
     * 树形字典中查找编码的完整层级路径。
     *
     * @description 从内存缓存中加载的树形字典数据里，通过 DFS 查找目标编码并回溯完整路径，用分隔符拼接后返回。
     * @param {string} type - 树形字典类型名，如 'region'
     * @param {string | number} code - 叶子节点编码值
     * @param {TranslatePathOptions} [opts] - 可选配置（storeName 指定仓库，field 指定节点取值字段，separator 指定分隔符，默认 ' / '）
     * @returns {string} 用分隔符连接的完整层级路径，未命中时返回 String(code)
     *
     * @example
     * $dict.translatePath('region', '440104')
     * $dict.translatePath('region', '440104', { separator: ' → ' })
     * $dict.translatePath('region', '440104', { storeName: 'dicts2', field: 'value' })
     */
    translatePath(type: string, code: string | number, opts?: TranslatePathOptions): string {
      return translatePath(manager, type, code, opts);
    },

    /**
     * 批量翻译数据对象中的多个编码字段。
     *
     * @description 传入一个数据对象和字段→字典类型映射表，返回追加了翻译字段的新对象（不修改原对象）。
     * @param {Record<string, unknown>} data - 需要翻译的数据对象，如 `{ gender: 'male', status: 1 }`
     * @param {Record<string, string | { type: string; storeName?: StoreKey }>} mapping - 字段映射表，key 为原字段名，value 为字典类型名（string）或 `{ type, storeName? }` 对象
     * @param {string} [suffix='_label'] - 翻译字段的后缀，默认 `'_label'`，即翻译结果追加到 `原字段名 + suffix` 字段
     * @returns {Record<string, unknown>} 新对象，包含原数据所有字段 + 以 suffix 为后缀的翻译字段
     *
     * @example
     * $dict.translateData(
     *   { gender: 'male', status: 1, name: '张三' },
     *   { gender: 'gender', status: 'status' }
     * )
     * // → { gender: 'male', gender_label: '男', status: 1, status_label: '启用', name: '张三' }
     *
     * // 跨仓库 + 自定义后缀
     * $dict.translateData(
     *   { payStatus: 1 },
     *   { payStatus: { type: 'pay_status', storeName: 'payment' } },
     *   '_text'
     * )
     * // → { payStatus: 1, payStatus_text: '已支付' }
     */
    translateData(
      data: Record<string, unknown>,
      mapping: TranslateDataMapping,
      suffix: string = '_label',
    ): Record<string, unknown> {
      return translateData(manager, data, mapping, suffix);
    },

    /**
     * 从内存缓存中查找编码对应的完整字典项对象。
     *
     * @description 与 translate 参数一致，但返回整个 DictItem 而非提取单个字段。缓存未命中时返回 undefined。
     * @param {string} type - 字典类型名，如 'gender'、'status'
     * @param {string | number} code - 字典编码值
     * @param {GetDictItemOptions} [opts] - 可选配置（storeName 指定仓库）
     * @returns {DictItem | undefined} 完整的字典项对象，缓存未命中时返回 undefined
     *
     * @example
     * $dict.getDictItem('gender', 'male')
     * // → { value: 'male', label: '男' }
     * $dict.getDictItem('gender', 'male', { storeName: 'dicts2' })
     * // → { value: 'male', label: '男（源2）' }
     */
    getDictItem(
      type: string,
      code: string | number,
      opts?: GetDictItemOptions,
    ): DictItem | undefined {
      return getDictItem(manager, type, code, opts);
    },
  };
}
