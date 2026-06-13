import type { DictManager } from '../core/dict-manager'

/**
 * 创建字典翻译器，封装 translate / translatePath 方法。
 * 作为 $dict 注入到 NuxtApp，供组件直接调用翻译。
 * 使用包装层而非直接暴露 DictManager，以控制公开 API 范围。
 *
 * @example
 * // 默认存储库 'dicts'
 * $dict.translate('gender', value)
 * $dict.translatePath('region', value)
 *
 * // 指定存储库，storeName 作为第一个参数
 * $dict.translate('dicts2', 'gender', value)
 * $dict.translatePath('dicts2', 'region', value)
 * $dict.translatePath('dicts2', 'region', value, ' -> ')
 *
 * // 注意：默认存储库 + 自定义分隔符需显式传 storeName
 * $dict.translatePath('dicts', 'region', value, ' -> ')
 */
export function createDictTranslator(manager: DictManager) {
  return {
    /**
     * 通过字典类型和编码获取翻译文本。
     * 2 参：默认存储库；3 参：指定存储库（storeName 为第一个参数）
     */
    translate(storeOrType: string, codeOrType: string | number, value?: string | number): string {
      if (value !== undefined) {
        // 3 args: storeName, type, value
        return manager.translate(codeOrType as string, value, storeOrType)
      }
      // 2 args: type, code
      return manager.translate(storeOrType, codeOrType)
    },

    /**
     * 获取树形字典中某个编码的完整层级路径。
     * 2 参：默认存储库 + 默认分隔符
     * 3 参：指定存储库 + 默认分隔符（storeName 为第一个参数）
     * 4 参：指定存储库 + 自定义分隔符
     * 默认存储库 + 自定义分隔符需显式传 'dicts' 作为 storeName
     */
    translatePath(
      storeOrType: string,
      codeOrType: string | number,
      separatorOrCode?: string | number,
      separator?: string,
    ): string {
      if (separator !== undefined) {
        // 4 args: storeName, type, code, separator
        return manager.translatePath(codeOrType as string, separatorOrCode as string | number, separator, storeOrType)
      }
      if (separatorOrCode !== undefined) {
        // 3 args: storeName, type, code（默认分隔符）
        return manager.translatePath(codeOrType as string, separatorOrCode as string | number, undefined, storeOrType)
      }
      // 2 args: type, code
      return manager.translatePath(storeOrType, codeOrType as string | number)
    },
  }
}
