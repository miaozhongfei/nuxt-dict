<template>
  <div>
    <h2>el-cascader + useDictTree</h2>
    <p style="color: #666">useDictTree 数据转换为 el-cascader 的 options 格式</p>

    <div v-if="loading" style="padding: 40px; text-align: center; color: #999">加载中...</div>
    <div v-else style="display: flex; align-items: center; gap: 12px; flex-wrap: wrap">
      <span>选择地区：</span>
      <el-cascader
        v-model="value"
        :options="cascaderOptions"
        placeholder="请选择"
        style="width: 300px"
        clearable
      />
      <span v-if="value?.length"
        >选中路径：<b>{{ value.join(' / ') }}</b></span
      >
    </div>
    <details style="margin-top: 16px">
      <summary>cascader options</summary>
      <pre>{{ JSON.stringify(cascaderOptions, null, 2) }}</pre>
    </details>
  </div>
</template>

<script setup lang="ts">
import type { TreeNode } from '../../../../src/runtime/types';

const { tree, loading } = useDictTree('region');

function toCascaderOptions(nodes: TreeNode[] | null): any[] {
  if (!nodes) return [];
  return nodes.map((n) => ({
    value: n.value,
    label: n.label,
    children: n.children ? toCascaderOptions(n.children) : undefined,
  }));
}

const cascaderOptions = computed(() => toCascaderOptions(tree.value));
const value = ref<string[]>([]);
</script>
