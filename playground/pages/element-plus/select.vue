<template>
  <div>
    <h2>el-select + useDict</h2>
    <p style="color: #666">直接绑定 useDict 返回的 data</p>

    <div v-if="loading" style="padding: 40px; text-align: center; color: #999">加载中...</div>
    <div v-else style="display: flex; align-items: center; gap: 12px; flex-wrap: wrap">
      <span>性别：</span>
      <el-select v-model="value" placeholder="请选择" style="width: 200px">
        <el-option v-for="o in options" :key="o.value" :label="o.label" :value="o.value" />
      </el-select>
      <span
        >选中值：<code>{{ value }}</code></span
      >
      <span
        >翻译：<b>{{ value ? translate(value) : '-' }}</b></span
      >
    </div>
    <details style="margin-top: 16px">
      <summary>options 数据</summary>
      <pre>{{ JSON.stringify(options, null, 2) }}</pre>
    </details>
  </div>
</template>

<script setup lang="ts">
const { data: options, translate, loading } = useDict('gender');
const value = ref('');
</script>
