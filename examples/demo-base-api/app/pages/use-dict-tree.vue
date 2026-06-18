<template>
  <div>
    <h1>useDictTree — 树形字典</h1>
    <p>加载 region 省市区树形字典，演示递归渲染层级结构和 <code>findPath</code> 路径查找。</p>

    <div class="demo-tip">
      <b>作用域</b>：组件级响应式。与 <code>useDict</code> 相同，组件挂载时自动加载，<code
        >tree</code
      >
      变化后模板自动重渲染。
    </div>

    <!-- 1. 树形渲染 -->
    <div class="demo-card">
      <div class="demo-card__header">
        <span class="demo-card__badge">useDictTree('region')</span>
        <span style="color: #6b7280; font-size: 0.85rem">— 递归渲染省市区三级树</span>
      </div>
      <p class="demo-card__desc">
        字典接口返回
        <code>tree: [ TreeNode&#123; children: TreeNode[] } ]</code> 结构，用递归组件渲染。
      </p>

      <div v-if="loading" class="demo-loading">加载中...</div>
      <div v-else class="demo-result--info" style="margin-bottom: 0.5rem">
        共 {{ tree?.length }} 个省份
      </div>
      <div v-if="tree">
        <TreeNodeItem v-for="node in tree" :key="node.value" :node="node" />
      </div>
    </div>

    <!-- 2. findPath -->
    <div class="demo-card">
      <div class="demo-card__header">
        <span class="demo-card__badge">findPath(code)</span>
        <span style="color: #6b7280; font-size: 0.85rem">— O(1) 路径查找</span>
      </div>
      <p class="demo-card__desc">根据叶子节点编码，返回从根到叶的完整层级路径数组。</p>

      <div style="display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap">
        <input
          v-model="lookupCode"
          class="input"
          placeholder="输入区县编码，如 440104"
          style="width: 220px"
        />
        <button class="btn btn--primary" @click="doLookup">查找路径</button>
      </div>

      <div class="demo-result" v-if="lookupResult !== null">
        路径：<b>{{ lookupResult.join(' / ') }}</b>
      </div>
      <div style="margin-top: 0.5rem; font-size: 0.8rem; color: #6b7280">
        试试这些编码：
        <button
          class="btn"
          style="margin: 0.15rem"
          @click="
            lookupCode = '110101';
            doLookup();
          "
        >
          110101
        </button>
        <button
          class="btn"
          style="margin: 0.15rem"
          @click="
            lookupCode = '310115';
            doLookup();
          "
        >
          310115
        </button>
        <button
          class="btn"
          style="margin: 0.15rem"
          @click="
            lookupCode = '440104';
            doLookup();
          "
        >
          440104
        </button>
        <button
          class="btn"
          style="margin: 0.15rem"
          @click="
            lookupCode = '440304';
            doLookup();
          "
        >
          440304
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { TreeNode } from '@lacqjs/nuxt-dict';

const { tree, findPath, loading } = useDictTree('region');

const lookupCode = ref('');
const lookupResult = ref<string[] | null>(null);

function doLookup() {
  lookupResult.value = findPath(lookupCode.value);
}
</script>
