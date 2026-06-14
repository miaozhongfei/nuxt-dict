import { shallowRef, ref, watch, onMounted } from 'vue'
import { useNuxtApp } from '#imports'
import type { DictManager } from '../core/dict-manager'
import { DEFAULT_STORE_NAME } from '../core/cache/indexeddb-cache'
import type { TreeNode, UseDictTreeReturn, StoreKey, TranslateOptions } from '../types'

/**
 * 使用树形字典数据，支持翻译和路径查找。
 * 组件挂载时自动加载，适用于区域选择器等级联场景。
 *
 * @example
 * // 默认存储库 'dicts'
 * const { tree, translate } = useDictTree('region')
 * // 指定存储库 'dicts2'
 * const { tree, translate } = useDictTree('dicts2', 'region')
 */
export function useDictTree(type: string): UseDictTreeReturn
export function useDictTree(storeName: StoreKey, type: string): UseDictTreeReturn
export function useDictTree(storeOrType: string, maybeType?: string): UseDictTreeReturn {
  const nuxtApp = useNuxtApp()
  const manager = nuxtApp.$dictManager as DictManager

  const storeName = (maybeType === undefined ? DEFAULT_STORE_NAME : storeOrType) as StoreKey
  const dictType = maybeType ?? storeOrType

  const tree = shallowRef<TreeNode[] | null>(null)
  const loading = ref(false)

  /** 翻译树中任意节点的 value → label。支持通过 opts.field 取自定义字段 */
  function translate(value: string | number, opts?: TranslateOptions): string {
    return manager.translate(dictType, value, { storeName, ...opts })
  }

  /** 在已加载的树数据中查找 value 对应的层级路径 */
  function findPath(value: string | number): string[] {
    if (!tree.value) return []
    return findPathInTree(tree.value, value)
  }

  async function load(): Promise<void> {
    loading.value = true
    try {
      const entry = await manager.getDict(dictType, storeName)
      tree.value = entry.tree ?? null
    } finally {
      loading.value = false
    }
  }

  /** 强制刷新，跳过缓存直接从服务端拉取 */
  async function refresh(): Promise<void> {
    loading.value = true
    try {
      const entry = await manager.refresh(dictType, storeName)
      tree.value = entry.tree ?? null
    } finally {
      loading.value = false
    }
  }

  onMounted(load)

  // 监听语言切换，自动重新加载树形字典数据
  watch(() => manager.locale.value, load)

  return { tree, translate, findPath, loading, refresh }
}

/**
 * 在树形字典中递归查找指定 code 的层级路径。
 * 例如 code=440104 → ['广东', '广州', '越秀区']
 */
function findPathInTree(nodes: TreeNode[], targetCode: string | number): string[] {
  for (const node of nodes) {
    if (node.value === targetCode) {
      return [node.label]
    }
    if (node.children && node.children.length > 0) {
      const childPath = findPathInTree(node.children, targetCode)
      if (childPath.length > 0) {
        return [node.label, ...childPath]
      }
    }
  }
  return []
}
