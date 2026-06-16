<template>
  <div>
    <h2>van-dropdown-menu + useDict</h2>
    <p style="color: #666">下拉菜单筛选，选项来自字典数据</p>

    <ClientOnly>
      <div v-if="loading" style="padding: 40px; text-align: center; color: #999">加载中...</div>
      <div v-else style="max-width: 400px">
        <van-dropdown-menu>
          <van-dropdown-item v-model="genderVal" :options="genderColumns" title="性别" />
          <van-dropdown-item v-model="statusVal" :options="statusColumns" title="状态" />
        </van-dropdown-menu>

        <div style="padding: 16px; background: #fff; margin-top: 8px; border-radius: 8px">
          <p>
            性别选择：<b>{{ genderVal }}</b>
          </p>
          <p>
            状态选择：<b>{{ statusVal }}</b>
          </p>
        </div>
      </div>
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
const { data: genderOpts, loading } = useDict('gender');
const { data: statusOpts } = useDict('status');

const genderColumns = computed(() =>
  genderOpts.value.map((o) => ({ text: o.label, value: o.value })),
);
const statusColumns = computed(() =>
  statusOpts.value.map((o) => ({ text: o.label, value: o.value })),
);

const genderVal = ref(0);
const statusVal = ref(0);
</script>
