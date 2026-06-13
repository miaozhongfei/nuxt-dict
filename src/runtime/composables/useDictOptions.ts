import { computed } from 'vue'
import { useDict } from './useDict'
import type { UseDictOptionsReturn, StoreKey } from '../types'

/**
 * 以 { label, value } 格式使用字典数据，
 * 直接适配 UI 库的 options 属性。
 *
 * @example
 * // 默认存储库 'dicts'
 * const { options } = useDictOptions('industry')
 * // 指定存储库 'dicts2'
 * const { options } = useDictOptions('dicts2', 'industry')
 */
export function useDictOptions(type: string): UseDictOptionsReturn
export function useDictOptions(storeName: StoreKey, type: string): UseDictOptionsReturn
export function useDictOptions(storeOrType: string, maybeType?: string): UseDictOptionsReturn {
  const { data, loading, refresh } = maybeType === undefined
    ? useDict(storeOrType)
    : useDict(storeOrType as StoreKey, maybeType)

  const options = computed(() => {
    if (!data.value) return []
    return data.value.map((item) => ({
      label: item.label,
      value: item.code,
    }))
  })

  return {
    options,
    loading,
    refresh,
  }
}
