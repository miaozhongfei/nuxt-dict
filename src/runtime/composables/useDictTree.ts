import { shallowRef, ref, watch, onMounted } from 'vue'
import { useNuxtApp } from '#imports'
import type { DictManager } from '../core/dict-manager'
import { DEFAULT_STORE_NAME } from '../core/cache/indexeddb-cache'
import type { TreeNode, UseDictTreeReturn, StoreKey, TranslateOptions } from '../types'

/**
 * 使用树形字典数据，支持翻译和路径查找。
 * 组件挂载时自动加载，适用于区域选择器等级联场景。
 *
 * @description 从字典管理器获取树形字典数据，挂载后自动触发网络请求（或缓存）。
 * @param {string} type - 字典类型名（如 'region'），一参形式：useDictTree(type)，使用默认仓库 'dicts'
 * @param {StoreKey} storeName - 仓库名（如 'dicts2'），二参形式：useDictTree(storeName, type)
 * @param {string} type - 字典类型名，二参形式时作为第二参数传入
 * @returns {UseDictTreeReturn} 包含 tree（树节点数组）、translate（翻译函数）、findPath（路径回溯）、loading、refresh
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

  /**
   * 同步翻译树中任意节点的 value → label。
   *
   * @description 默认从当前 useDictTree 的 tree ref（shallowRef）中递归查找，Vue 响应式系统可追踪，
   * 可直接放在 computed 中使用。跨仓库时回退到 manager 的内存缓存查找。
   *
   * @param {string | number} value - 节点编码值
   * @param {TranslateOptions} [opts] - 可选配置（field 指定取值字段，storeName 可覆盖仓库）
   * @returns {string} 翻译后的文本，未命中时返回 value 的字符串形式
   */
  function translate(value: string | number, opts?: TranslateOptions): string {
    const targetStore = opts?.storeName ?? storeName
    const field = opts?.field ?? 'label'
    // 跨仓库场景：当前 tree ref 只持有本仓库数据，回退到 manager
    if (targetStore !== storeName) {
      return manager.translate(dictType, value, { storeName: targetStore, field })
    }
    // 默认场景：从 tree ref（shallowRef）递归查找 → Vue 能追踪
    if (!tree.value) return String(value)
    const node = findNodeByCode(tree.value, value)
    if (!node) return String(value)
    return (node[field] as string | undefined) ?? node.label
  }

  /**
   * 在已加载的树数据中查找 value 对应的层级路径。
   *
   * @description 从 tree ref（shallowRef）递归查找，Vue 响应式系统可追踪，可直接放在 computed 中使用。
   * @param {string | number} value - 叶子节点编码值
   * @returns {string[]} 从根节点到目标节点的 label 数组，未找到返回空数组
   *
   * @example
   * findPath('440104')  // → ['广东', '广州', '越秀区']
   */
  function findPath(value: string | number): string[] {
    if (!tree.value) return []
    return findPathInTree(tree.value, value)
  }

  /**
   * 从管理器加载树形字典数据，走正常缓存链（内存 → IndexedDB → 网络）。
   *
   * @returns {Promise<void>}
   */
  async function load(): Promise<void> {
    loading.value = true
    try {
      const entry = await manager.getDict(dictType, storeName)
      tree.value = entry.tree ?? null
    } finally {
      loading.value = false
    }
  }

  /**
   * 强制刷新：跳过缓存，直接从网络获取最新树形数据。
   *
   * @returns {Promise<void>}
   */
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
 *
 * @param {TreeNode[]} nodes - 树节点数组
 * @param {string | number} targetCode - 目标叶子节点编码值
 * @returns {string[]} 从根节点到目标节点的 label 数组，未找到返回空数组
 *
 * @example
 * // code=440104 → ['广东', '广州', '越秀区']
 * findPathInTree(tree, '440104')
 */
function findPathInTree(nodes: TreeNode[], targetCode: string | number): string[] {
  for (const node of nodes) {
    if (String(node.value) === String(targetCode)) {
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

/**
 * 在树形字典中递归查找指定 code 的节点。
 *
 * @param {TreeNode[]} nodes - 树节点数组
 * @param {string | number} targetCode - 目标节点编码值
 * @returns {TreeNode | undefined} 匹配的树节点，未找到返回 undefined
 */
function findNodeByCode(nodes: TreeNode[], targetCode: string | number): TreeNode | undefined {
  for (const node of nodes) {
    if (String(node.value) === String(targetCode)) {
      return node
    }
    if (node.children && node.children.length > 0) {
      const found = findNodeByCode(node.children, targetCode)
      if (found) return found
    }
  }
  return undefined
}
