import { shallowRef, ref, watch, onMounted, triggerRef } from 'vue';
import type { ShallowRef, DeepReadonly } from 'vue';

import { useNuxtApp } from '#imports';

import { DEFAULT_STORE_NAME } from '../core/cache/indexeddb-cache';
import type { DictManager } from '../core/dict-manager';
import type { TreeNode, UseDictTreeReturn, StoreKey, TranslateOptions } from '../types';

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
export function useDictTree(type: string): UseDictTreeReturn;
export function useDictTree(storeName: StoreKey, type: string): UseDictTreeReturn;
// eslint-disable-next-line max-lines-per-function
export function useDictTree(storeOrType: string, maybeType?: string): UseDictTreeReturn {
  const nuxtApp = useNuxtApp();
  const manager = nuxtApp.$dictManager as DictManager;

  const storeName = (maybeType === undefined ? DEFAULT_STORE_NAME : storeOrType) as StoreKey;
  const dictType = maybeType ?? storeOrType;

  const tree = shallowRef<TreeNode[] | null>(null);
  // String(code) → TreeNode 索引映射，O(1) 查找替代 O(N) 递归遍历
  const nodeMap = new Map<string, TreeNode>();
  // String(code) → 完整层级路径 索引映射
  const pathMap = new Map<string, string[]>();
  const loading = ref(false);

  /**
   * 同步翻译树中任意节点的 value → label。
   *
   * @description 默认从预建的 nodeMap（String(code) → TreeNode）中 O(1) 查找。
   * 仍读 tree.value 保持 Vue 响应式依赖。跨仓库时回退到 manager 的内存缓存查找。
   *
   * @param {string | number} value - 节点编码值
   * @param {TranslateOptions} [opts] - 可选配置（field 指定取值字段，storeName 可覆盖仓库）
   * @returns {string} 翻译后的文本，未命中时返回 value 的字符串形式
   */
  function translate(value: string | number, opts?: TranslateOptions): string {
    const targetStore = opts?.storeName ?? storeName;
    const field = opts?.field ?? 'label';
    // 跨仓库场景：当前 tree ref 只持有本仓库数据，回退到 manager
    if (targetStore !== storeName) {
      return manager.translate(dictType, value, { storeName: targetStore, field });
    }
    // 默认场景：读 tree.value 保持响应式依赖，从 nodeMap O(1) 查找
    if (!tree.value) return String(value);
    const node = nodeMap.get(String(value));
    if (!node) return String(value);
    return (node[field] as string | undefined) ?? node.label;
  }

  /**
   * 查找叶子节点的完整层级路径。
   *
   * @description 从预建的 pathMap（String(code) → 完整路径数组）中 O(1) 查找。
   * 仍读 tree.value 保持 Vue 响应式依赖。
   * @param {string | number} value - 叶子节点编码值
   * @returns {string[]} 从根节点到目标节点的 label 数组，未找到返回空数组
   *
   * @example
   * findPath('440104')  // → ['广东', '广州', '越秀区']
   */
  function findPath(value: string | number): string[] {
    if (!tree.value) return [];
    return pathMap.get(String(value)) ?? [];
  }

  /**
   * 从管理器加载树形字典数据，走正常缓存链（内存 → IndexedDB → 网络）。
   *
   * @returns {Promise<void>}
   */
  async function load(): Promise<void> {
    loading.value = true;
    try {
      const entry = await manager.getDict(dictType, storeName);
      const newTree = entry.tree ?? null;
      // 原地更新树数据，保持 tree 引用不变，避免级联选择器等 UI 组件丢失状态
      if (tree.value && newTree) {
        tree.value.splice(0, tree.value.length, ...newTree);
        triggerRef(tree);
      } else {
        tree.value = newTree;
      }
      if (entry.tree) buildMaps(entry.tree, nodeMap, pathMap);
    } finally {
      loading.value = false;
    }
  }

  /**
   * 强制刷新：跳过缓存，直接从网络获取最新树形数据。
   *
   * @returns {Promise<void>}
   */
  async function refresh(): Promise<void> {
    loading.value = true;
    try {
      const entry = await manager.refresh(dictType, storeName);
      const newTree = entry.tree ?? null;
      // 原地更新树数据，保持 tree 引用不变
      if (tree.value && newTree) {
        tree.value.splice(0, tree.value.length, ...newTree);
        triggerRef(tree);
      } else {
        tree.value = newTree;
      }
      if (entry.tree) buildMaps(entry.tree, nodeMap, pathMap);
    } finally {
      loading.value = false;
    }
  }

  onMounted(load);

  // 监听语言切换，自动重新加载树形字典数据
  watch(() => manager.locale.value, load);

  return {
    tree: tree as unknown as Readonly<ShallowRef<DeepReadonly<TreeNode[] | null>>>,
    translate,
    findPath,
    loading,
    refresh,
  };
}

/**
 * 遍历整棵树，预建 String(code) → TreeNode 和 String(code) → 完整路径两个索引映射。
 * 将 translate / findPath 从 O(N) 递归优化为 O(1) 直接查找。
 *
 * @param {TreeNode[]} nodes - 树节点数组
 * @param {Map<string, TreeNode>} nodeMap - code → 节点的映射（会被填充）
 * @param {Map<string, string[]>} pathMap - code → 完整路径的映射（会被填充）
 * @param {string[]} ancestors - 当前节点的祖先 label 列表（内部递归用）
 */
function buildMaps(
  nodes: TreeNode[],
  nodeMap: Map<string, TreeNode>,
  pathMap: Map<string, string[]>,
  ancestors: string[] = [],
): void {
  for (const node of nodes) {
    const code = String(node.value);
    const path = [...ancestors, node.label];
    nodeMap.set(code, node);
    pathMap.set(code, path);
    if (node.children && node.children.length > 0) {
      buildMaps(node.children, nodeMap, pathMap, path);
    }
  }
}
