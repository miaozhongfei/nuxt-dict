<template>
  <div>
    <h1>Nuxt UI 集成</h1>
    <p>
      演示 Nuxt UI v4 组件与 nuxt-dict 字典数据的结合使用。Nuxt UI 使用
      <code>items: [&#123; label, value }]</code> 格式，与 dict 数据天然对齐。
    </p>

    <!-- 1. USelectMenu -->
    <div class="demo-card">
      <div class="demo-card__header">
        <span class="demo-card__badge">USelectMenu</span>
        <span style="color: #6b7280; font-size: 0.85rem">— gender 下拉选择</span>
      </div>
      <p class="demo-card__desc">
        将 <code>data</code> 映射为 <code>&#123; label, value }</code> 数组传给
        <code>:items</code>。
      </p>

      <USelectMenu v-model="gender" :items="genderItems" placeholder="请选择性别" style="width: 200px;" />

      <div class="demo-result" v-if="gender">
        选中：<b>{{ gender }}</b>
      </div>
    </div>

    <!-- 2. UBadge -->
    <div class="demo-card">
      <div class="demo-card__header">
        <span class="demo-card__badge">UBadge</span>
        <span style="color: #6b7280; font-size: 0.85rem">— status 彩色标签</span>
      </div>
      <p class="demo-card__desc">
        利用 status 字典的 <code>color</code> 字段，映射为 <code>UBadge</code> 的
        <code>color</code> prop。
      </p>

      <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
        <UBadge v-for="item in statusBadges" :key="item.value" :color="item.color" variant="soft" size="md">
          {{ item.label }}
        </UBadge>
      </div>
    </div>

    <!-- 3. UTable -->
    <div class="demo-card">
      <div class="demo-card__header">
        <span class="demo-card__badge">UTable</span>
        <span style="color: #6b7280; font-size: 0.85rem">— 数据表格</span>
      </div>
      <p class="demo-card__desc">
        通过 <code>computed</code> 将原始数据预翻译为可展示的行数据，再传给 <code>UTable</code>。
      </p>

      <UTable :data="tableRows" :columns="tableColumns" />
    </div>
  </div>
</template>

<script setup lang="ts">
const { data: genderData } = useDict('gender');
const { data: statusData } = useDict('status');
useDict('industry');

const { $dict } = useNuxtApp();

const gender = useState('demo-gender', () => '');

const genderItems = computed(() =>
  (genderData.value ?? []).map((o) => ({ label: o.label, value: o.value })),
);

const statusBadges = computed(() =>
  (statusData.value ?? []).map((o) => {
    const hex = ((o as any).color as string).replace('#', '').toLowerCase();
    let color: 'success' | 'error' | 'warning' | 'neutral' = 'neutral';
    if (hex === '67c23a') color = 'success';
    else if (hex === 'f56c6c') color = 'error';
    else if (hex === 'e6a23c') color = 'warning';
    return { ...o, color };
  }),
);

const tableColumns = [
  { accessorKey: 'name', header: '姓名' },
  { accessorKey: 'genderLabel', header: '性别' },
  { accessorKey: 'statusLabel', header: '状态' },
  { accessorKey: 'industryLabel', header: '行业' },
];

const tableRows = computed(() => {
  const raw = [
    { name: '张三', gender: 'male', status: 1, industry: 'it' },
    { name: '李四', gender: 'female', status: 0, industry: 'finance' },
    { name: '王五', gender: 'male', status: 2, industry: 'edu' },
  ];
  return raw.map((row) => ({
    name: row.name,
    genderLabel: $dict.translate('gender', row.gender),
    statusLabel: $dict.translate('status', row.status),
    industryLabel: $dict.translate('industry', row.industry),
  }));
});
</script>
