import type { DictAdapter } from '../types';

/**
 * 定义自定义字典适配器（类型辅助函数）。
 *
 * @description 提供完整的 TypeScript 类型推导，确保适配器实现符合 DictAdapter 接口。
 * 运行时原样返回，不做任何处理。用于自定义适配器文件（如 ~/dict/dict-adapter.ts）中导出适配器。
 *
 * @param {DictAdapter} adapter - 适配器对象，需实现 fetchDict 和 fetchVersion 方法
 * @returns {DictAdapter} 原样返回传入的适配器对象
 *
 * @example
 * // ~/dict/dict-adapter.ts
 * import { defineDictAdapter } from '@lacqjs/nuxt-dict'
 *
 * export default defineDictAdapter({
 *   async fetchDict(storeName, { types, locale }) {
 *     const res = await fetch(`/api/dict?types=${types.join(',')}&lang=${locale}`)
 *     return res.json()
 *   },
 *   async fetchVersion(storeName) {
 *     const res = await fetch('/api/dict/version')
 *     return (await res.json()).version
 *   },
 * })
 */
export function defineDictAdapter(adapter: DictAdapter): DictAdapter {
  return adapter;
}
