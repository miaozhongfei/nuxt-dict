<template>
  <div>
    <h1>useDict — 扁平字典</h1>
    <p>
      加载 gender、industry 两个字典类型，演示
      <code>data</code
      >、<code>translate</code>、<code>loading</code>、<code>error</code>、<code>refresh</code>。语言切换由顶部导航栏的
      <code>@nuxtjs/i18n</code> 统一控制。
    </p>

    <div class="demo-tip">
      <b>作用域</b>：组件级响应式。在
      <code>&lt;script setup&gt;</code> 中调用，组件挂载时自动加载，数据变化后模板自动重渲染。适合
      select 选项、列表渲染等模板绑定场景。
    </div>

    <!-- 1. gender — 基础选择 -->
    <div class="demo-card">
      <div class="demo-card__header">
        <span class="demo-card__badge">useDict('gender')</span>
        <span style="color: #6b7280; font-size: 0.85rem">— 下拉选择 + 翻译</span>
      </div>
      <p class="demo-card__desc">
        将字典数据直接作为 select 选项，用 <code>translate(val)</code> 显示选中文本。
      </p>

      <div v-if="genderLoading" class="demo-loading">加载中...</div>
      <div v-else-if="genderError" class="demo-error">
        {{ genderError }}
        <button class="btn btn--primary" style="margin-left: 0.5rem" @click="doGenderRefresh">
          重试
        </button>
      </div>
      <div v-else>
        <select v-model="selectedGender" class="input" style="width: 160px">
          <option value="">—— 请选择 ——</option>
          <option v-for="item in genderData" :key="item.value" :value="item.value">
            {{ item.label }}
          </option>
        </select>
        <div class="demo-result" v-if="selectedGender">
          translate：<b>{{ genderTranslate(selectedGender) }}</b>
        </div>
      </div>
    </div>

    <!-- 2. industry — 扩展字段 color -->
    <div class="demo-card">
      <div class="demo-card__header">
        <span class="demo-card__badge">useDict('industry')</span>
        <span style="color: #6b7280; font-size: 0.85rem">— 扩展字段 color + 列表渲染</span>
      </div>
      <p class="demo-card__desc">
        字典项可携带额外属性（如 <code>color</code>），用
        <code>translate(val, &#123; field: 'color' })</code> 读取。
      </p>

      <div v-if="industryLoading" class="demo-loading">加载中...</div>
      <ul v-else class="demo-list">
        <li v-for="item in industryData" :key="item.value">
          <span
            class="color-dot"
            :style="{ background: industryTranslate(item.value, { field: 'color' }) }"
          />
          <span style="flex: 1">{{ item.label }}</span>
          <code>{{ item.value }}</code>
          <code style="font-size: 0.8rem; color: #6b7280">{{
            industryTranslate(item.value, { field: 'color' })
          }}</code>
        </li>
      </ul>
    </div>

    <!-- 3. refresh -->
    <div class="demo-card">
      <div class="demo-card__header">
        <span class="demo-card__badge">refresh()</span>
        <span style="color: #6b7280; font-size: 0.85rem">— 强制刷新</span>
      </div>
      <p class="demo-card__desc">跳过缓存，直接从网络重新获取字典数据。</p>
      <button class="btn btn--primary" @click="doGenderRefresh">刷新 gender 字典</button>
      <span style="margin-left: 0.75rem; font-size: 0.85rem; color: #6b7280">
        data 长度：{{ genderData?.length ?? 0 }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
const {
  data: genderData,
  translate: genderTranslate,
  loading: genderLoading,
  error: genderError,
  refresh: genderRefresh,
} = useDict('gender');

const {
  data: industryData,
  translate: industryTranslate,
  loading: industryLoading,
} = useDict('industry');

const selectedGender = useState('demo-gender', () => '');

function doGenderRefresh() {
  genderRefresh();
}
</script>
