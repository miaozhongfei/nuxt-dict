<template>
  <div>
    <h1>Vant 集成</h1>
    <p>
      演示 Vant 移动端组件与 nuxt-dict 字典数据的结合使用。Vant 组件需要 <code>text</code>/<code
        >value</code
      >
      格式，用 <code>computed</code> 做一次映射即可。
    </p>

    <client-only>
      <!-- 1. van-dropdown-menu -->
      <div class="demo-card">
        <div class="demo-card__header">
          <span class="demo-card__badge">van-dropdown-menu</span>
          <span style="color: #6b7280; font-size: 0.85rem">— 性别 + 行业下拉</span>
        </div>
        <p class="demo-card__desc">
          将字典 <code>&#123; value, label }</code> 映射为 Vant 的
          <code>&#123; text, value }</code> 格式。
        </p>

        <div style="background: #f9fafb; border-radius: 8px; overflow: hidden">
          <van-dropdown-menu>
            <van-dropdown-item v-model="genderValue" :options="genderOptions" title="性别" />
            <van-dropdown-item v-model="industryValue" :options="industryOptions" title="行业" />
          </van-dropdown-menu>
        </div>

        <div class="demo-result" v-if="genderValue || industryValue">
          当前筛选：性别 = <b>{{ genderValue || '——' }}</b
          >，行业 = <b>{{ industryValue || '——' }}</b>
        </div>
      </div>

      <!-- 2. van-picker -->
      <div class="demo-card">
        <div class="demo-card__header">
          <span class="demo-card__badge">van-picker</span>
          <span style="color: #6b7280; font-size: 0.85rem">— 行业选择器</span>
        </div>
        <p class="demo-card__desc">
          单列选择器，columns 同样映射为 <code>&#123; text, value }</code> 格式。
        </p>

        <van-picker :columns="pickerColumns" @confirm="onPickerConfirm" style="height: 220px" />
        <div class="demo-result" v-if="pickedIndustry">
          选中：<b>{{ pickedIndustry }}</b>
        </div>
      </div>
    </client-only>
  </div>
</template>

<script setup lang="ts">
const { data: genderData } = useDict('gender');
const { data: industryData } = useDict('industry');

const genderValue = ref();
const industryValue = ref();
const pickedIndustry = ref('');

const genderOptions = computed(() =>
  (genderData.value ?? []).map((o) => ({ text: o.label, value: o.value })),
);

const industryOptions = computed(() =>
  (industryData.value ?? []).map((o) => ({ text: o.label, value: o.value })),
);

const pickerColumns = computed(() =>
  (industryData.value ?? []).map((o) => ({ text: o.label, value: o.value })),
);

function onPickerConfirm({
  selectedOptions,
}: {
  selectedOptions: { text: string; value: string }[];
}) {
  pickedIndustry.value = selectedOptions[0]?.text || '';
}
</script>
