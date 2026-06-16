<template>
  <div>
    <h2>useDict — 基础翻译</h2>
    <p style="color: #666">核心 composable，返回 loading / error / data / translate / refresh</p>

    <div v-if="loading" style="padding: 40px; text-align: center; color: #999">加载中...</div>

    <div
      v-else-if="error"
      style="padding: 20px; background: #fef0f0; border-radius: 8px; color: #f56c6c"
    >
      {{ error }}
      <button @click="doRefresh" style="margin-left: 12px; cursor: pointer">重试</button>
    </div>

    <div v-else>
      <h4>gender 字典数据</h4>
      <table border="1" cellpadding="6" cellspacing="0" style="border-collapse: collapse">
        <thead>
          <tr>
            <th>code</th>
            <th>label（useDict 翻译）</th>
            <th>$dict.translate（同步）</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in data" :key="item.value">
            <td>{{ item.value }}</td>
            <td>{{ translate(item.value) }}</td>
            <td>{{ $dict.translate('gender', item.value) }}</td>
          </tr>
        </tbody>
      </table>

      <div style="margin-top: 16px">
        <button @click="doRefresh" style="cursor: pointer">刷新字典</button>
        <span style="margin-left: 8px; color: #666">data 长度: {{ data?.length }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { data, translate, loading, error } = useDict('gender');
function doRefresh() {
  useDict('gender').refresh();
}
</script>
