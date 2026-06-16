<template>
  <div>
    <h2>van-picker + useDict</h2>
    <p style="color: #666">单列选择器，columns 来自 useDict</p>

    <ClientOnly>
      <div v-if="loading" style="padding: 40px; text-align: center; color: #999">加载中...</div>
      <div v-else style="max-width: 400px">
        <van-picker
          title="选择行业"
          :columns="columns"
          :default-index="0"
          @confirm="onConfirm"
          @cancel="onCancel"
          style="min-height: 240px"
        />
        <p v-if="confirmedValue" style="margin-top: 12px; text-align: center">
          已选择：<b>{{ confirmedValue }}</b>
        </p>
      </div>
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
const { data: options, loading } = useDict('industry');

const columns = computed(() => options.value.map((o) => ({ text: o.label, value: o.value })));
const confirmedValue = ref('');

function onConfirm({ selectedOptions }: any) {
  confirmedValue.value = selectedOptions[0]?.text ?? '';
}
function onCancel() {
  confirmedValue.value = '';
}
</script>
