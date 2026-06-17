<template>
  <div style="margin-left: 1.5rem; padding: 0.2rem 0">
    <span style="font-weight: 500">{{ node.label }}</span>
    <code style="margin-left: 0.5rem; font-size: 0.8rem; color: #6b7280">{{ node.value }}</code>
    <TreeNodeItem v-for="child in node.children" :key="child.value" :node="child" />
  </div>
</template>

<script setup lang="ts">
import type { TreeNode } from '@lacqjs/nuxt-dict';

defineProps<{ node: TreeNode }>();
</script>
