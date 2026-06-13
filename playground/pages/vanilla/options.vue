<template>
  <div>
    <h2>useDict — 选项生成</h2>
    <p style="color:#666;">用于 el-select / van-picker 等组件，直接返回 [{value, label}] 格式</p>

    <div v-if="loading" style="padding:40px;text-align:center;color:#999;">加载中...</div>
    <div v-else>
      <label>
        请选择行业：
        <select v-model="selected" style="padding:4px 8px;font-size:16px;margin-left:8px;">
          <option v-for="o in options" :key="o.value" :value="o.value">{{ o.label }}</option>
        </select>
      </label>

      <p style="margin-top:12px;">当前选中：<b>{{ selected }}</b></p>

      <details style="margin-top:16px;">
        <summary>options 原始数据</summary>
        <pre>{{ JSON.stringify(options, null, 2) }}</pre>
      </details>
    </div>
  </div>
</template>

<script setup lang="ts">
const { data: options, loading } = useDict('industry')
const selected = ref('')
</script>
