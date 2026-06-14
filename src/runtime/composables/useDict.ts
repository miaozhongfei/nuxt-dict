import { shallowRef, ref, watch, onMounted, onBeforeUnmount } from 'vue'
import { useNuxtApp } from '#imports'
import type { DictManager } from '../core/dict-manager'
import { DEFAULT_STORE_NAME } from '../core/cache/indexeddb-cache'
import type { DictItem, UseDictReturn, StoreKey, TranslateOptions, GetDictItemOptions } from '../types'

/** 跟踪同一字典类型的活跃组件实例，用于监听变更。key 格式: `{storeName}:{type}` */
const activeInstances = new Map<string, Set<symbol>>()

/**
 * 从管理器拉取字典数据并更新响应式状态。
 * 抽取 load/refresh 共用逻辑以减少重复。
 *
 * @param {DictManager} manager - 字典管理器实例
 * @param {string} dictType - 字典类型名，如 'gender'
 * @param {string} storeName - 仓库名，如 'dicts'
 * @param {ReturnType<typeof shallowRef<DictItem[] | null>>} data - 响应式数据引用
 * @param {ReturnType<typeof ref<boolean>>} loading - 加载状态引用
 * @param {ReturnType<typeof ref<string | null>>} error - 错误信息引用
 * @param {'load' | 'refresh'} mode - 加载模式，load 走正常缓存链，refresh 跳过缓存
 * @returns {Promise<void>}
 */
async function fetchDictData(
  manager: DictManager,
  dictType: string,
  storeName: string,
  data: ReturnType<typeof shallowRef<DictItem[] | null>>,
  loading: ReturnType<typeof ref<boolean>>,
  error: ReturnType<typeof ref<string | null>>,
  mode: 'load' | 'refresh' = 'load',
): Promise<void> {
  loading.value = true
  error.value = null
  try {
    const entry = await (mode === 'refresh'
      ? manager.refresh(dictType, storeName)
      : manager.getDict(dictType, storeName))
    data.value = entry.items
  } catch (e) {
    error.value = e instanceof Error ? e.message : String(e)
  } finally {
    loading.value = false
  }
}

/** 注册组件实例到活跃追踪表，卸载时自动清理 */
function trackInstance(type: string, instanceId: symbol): void {
  if (!activeInstances.has(type)) {
    activeInstances.set(type, new Set())
  }
  activeInstances.get(type)!.add(instanceId)

  onBeforeUnmount(() => {
    const instances = activeInstances.get(type)
    if (instances) {
      instances.delete(instanceId)
      if (instances.size === 0) {
        activeInstances.delete(type)
      }
    }
  })
}

/**
 * 使用指定类型的字典数据。
 * 组件挂载时自动加载，卸载时自动清理引用。
 * 返回翻译函数、加载状态和手动刷新方法。
 *
 * @description 从字典管理器获取扁平字典数据，挂载后自动触发网络请求（或缓存）。
 * @param {string} type - 字典类型名（如 'gender'），一参形式：useDict(type)，使用默认仓库 'dicts'
 * @param {StoreKey} storeName - 仓库名（如 'dicts2'），二参形式：useDict(storeName, type)
 * @param {string} type - 字典类型名，二参形式时作为第二参数传入
 * @returns {UseDictReturn} 包含 data（字典项数组）、translate（翻译函数）、loading、error、refresh
 *
 * @example
 * // 默认存储库 'dicts'
 * const { data, translate } = useDict('gender')
 * // 指定存储库 'dicts2'
 * const { data, translate } = useDict('dicts2', 'gender')
 */
export function useDict(type: string): UseDictReturn
export function useDict(storeName: StoreKey, type: string): UseDictReturn
export function useDict(storeOrType: string, maybeType?: string): UseDictReturn {
  const nuxtApp = useNuxtApp()
  const manager = nuxtApp.$dictManager as DictManager

  const storeName = (maybeType === undefined ? DEFAULT_STORE_NAME : storeOrType) as StoreKey
  const dictType = maybeType ?? storeOrType

  const data = shallowRef<DictItem[] | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const instanceId = Symbol(dictType)
  const trackKey = `${storeName}:${dictType}`

  trackInstance(trackKey, instanceId)

  /**
   * 同步翻译编码 → 文本。
   *
   * @description 默认从当前 useDict 的 data ref（shallowRef）中查找，Vue 响应式系统可追踪，
   * 可直接放在 computed 中使用。跨仓库时回退到 manager 的内存缓存查找。
   *
   * @param {string | number} value - 字典编码值
   * @param {TranslateOptions} [opts] - 可选配置（field 指定取值字段，storeName 覆盖仓库）
   * @returns {string} 翻译后的文本，缓存未命中时返回 value 的字符串形式
   */
  function translate(value: string | number, opts?: TranslateOptions): string {
    const targetStore = opts?.storeName ?? storeName
    const field = opts?.field ?? 'label'
    // 跨仓库场景：当前 data ref 只持有本仓库数据，回退到 manager 的内存缓存查找
    // 极少使用，非响应式可接受
    if (targetStore !== storeName) {
      return manager.translate(dictType, value, { storeName: targetStore, field })
    }
    // 默认场景：从 data ref（shallowRef）中查找，Vue 能追踪 → computed 可自动重算
    if (!data.value) return String(value)
    const item = data.value.find((i) => String(i.value) === String(value))
    if (!item) return String(value)
    return (item[field] as string | undefined) ?? item.label
  }

  /**
   * 同步获取完整字典项对象。
   *
   * @description 默认从当前 useDict 的 data ref（shallowRef）中查找，Vue 响应式系统可追踪，
   * 可直接放在 computed 中使用。跨仓库时回退到 manager 的内存缓存查找。
   * 与 translate 参数一致，但返回整个 DictItem 而非提取字符串字段。
   *
   * @param {string | number} value - 字典编码值
   * @param {GetDictItemOptions} [opts] - 可选配置（storeName 指定目标仓库）
   * @returns {DictItem | undefined} 完整的字典项对象，缓存未命中时返回 undefined
   *
   * @example
   * const { getDictItem } = useDict('status')
   * // 当前仓库，从 data ref 读取 → computed 可追踪 ✅
   * const item = computed(() => getDictItem(1))
   * // → { value: 1, label: '启用', color: '#67C23A' }
   *
   * @example
   * // 跨仓库回退到 manager 内存缓存
   * const item = getDictItem(1, { storeName: 'dicts2' })
   */
  function getDictItem(value: string | number, opts?: GetDictItemOptions): DictItem | undefined {
    // 跨仓库场景：当前 data ref 只持有本仓库数据，回退到 manager 的内存缓存查找
    // 极少使用，非响应式可接受
    if (opts?.storeName && opts.storeName !== storeName) {
      return manager.getDictItem(dictType, value, opts)
    }
    // 默认场景：从 data ref（shallowRef）中查找，Vue 能追踪 → computed 可自动重算
    if (!data.value) return undefined
    return data.value.find((i) => String(i.value) === String(value))
  }

  /**
   * 强制刷新：跳过内存缓存和 IndexedDB，直接从网络获取最新数据。
   *
   * @returns {Promise<void>}
   */
  async function refresh(): Promise<void> {
    await fetchDictData(manager, dictType, storeName, data, loading, error, 'refresh')
  }

  onMounted(() => {
    fetchDictData(manager, dictType, storeName, data, loading, error, 'load')
  })

  // 监听语言切换，自动重新加载字典数据
  watch(
    () => manager.locale.value,
    () => { fetchDictData(manager, dictType, storeName, data, loading, error, 'load') },
  )

  return { data, translate, getDictItem, loading, error, refresh }
}
