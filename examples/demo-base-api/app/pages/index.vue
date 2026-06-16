<template>
  <div>
    <h2>nuxt-dict：仅配置 base API 示例</h2>
    <p>
      本示例在 server 端口模拟字典接口，生产环境只需修改 nuxt.config.ts 中的
      <code>dict.api.baseURL</code>
      即可替换为 Java 后端或第三方接口。
    </p>

    <!-- gender 字典 -->
    <section>
      <h3>gender 字典</h3>
      <div v-if="genderLoading">加载中...</div>
      <div v-else>
        <select v-model="selectedGender">
          <option v-for="item in genderData" :key="item.value" :value="item.value">
            {{ item.label }}
          </option>
        </select>
        <p>选中：{{ genderTranslate(selectedGender) }}</p>
      </div>
    </section>

    <!-- status 字典 -->
    <section>
      <h3>status 字典</h3>
      <div v-if="statusLoading">加载中...</div>
      <div v-else>
        <p v-for="item in statusData" :key="item.value">
          {{ item.label }}（code：{{ item.value }}，color：{{
            statusTranslate(item.value, { field: 'color' })
          }}）
        </p>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
const { data: genderData, translate: genderTranslate, loading: genderLoading } = useDict('gender');

const { data: statusData, translate: statusTranslate, loading: statusLoading } = useDict('status');

const selectedGender = ref('');
</script>
