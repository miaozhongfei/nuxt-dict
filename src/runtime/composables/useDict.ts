import { shallowRef, ref, watch, onMounted, onBeforeUnmount } from 'vue'
import { useNuxtApp } from '#imports'
import type { DictManager } from '../core/dict-manager'
import { DEFAULT_STORE_NAME } from '../core/cache/indexeddb-cache'
import type { DictItem, UseDictReturn, StoreKey } from '../types'

/** 跟踪同一字典类型的活跃组件实例，用于监听变更。key 格式: `{storeName}:{type}` */
const activeInstances = new Map<string, Set<symbol>>()

/**
 * 从管理器拉取字典数据并更新响应式状态。
 * 抽取 load/refresh 共用逻辑以减少重复。
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

  const storeName = maybeType === undefined ? DEFAULT_STORE_NAME : storeOrType
  const dictType = maybeType ?? storeOrType

  const data = shallowRef<DictItem[] | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const instanceId = Symbol(dictType)
  const trackKey = `${storeName}:${dictType}`

  trackInstance(trackKey, instanceId)

  function translate(value: string | number): string {
    return manager.translate(dictType, value, storeName)
  }

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

  return { data, translate, loading, error, refresh }
}
