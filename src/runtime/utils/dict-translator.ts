import type { DictManager } from '../core/dict-manager'
import type { DictTranslator, TranslateOptions, TranslatePathOptions } from '../types'

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
  return manager.translate(type, code, opts)
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
  return manager.translatePath(type, code, opts)
}

/**
 * 创建字典翻译器，封装 translate / translatePath 方法。
 * 作为 $dict 注入到 NuxtApp，供组件直接调用翻译。
 * 使用包装层而非直接暴露 DictManager，以控制公开 API 范围。
 *
 * 仓库名统一通过 opts.storeName 指定，不再接受首参为 storeName 的旧式写法。
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
 */
export function createDictTranslator(manager: DictManager): DictTranslator {
  return {
    translate(type: string, code: string | number, opts?: TranslateOptions): string {
      return translate(manager, type, code, opts)
    },
    translatePath(type: string, code: string | number, opts?: TranslatePathOptions): string {
      return translatePath(manager, type, code, opts)
    },
  }
}
