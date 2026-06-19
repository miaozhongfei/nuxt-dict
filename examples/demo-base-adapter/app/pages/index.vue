<template>
  <div>
    <h1>{{ t('home.title') }}</h1>
    <p>{{ t('home.subtitle') }}</p>

    <div class="demo-tip">
      {{ t('home.apiNote') }}
    </div>

    <div class="home-grid">
      <NuxtLink :to="localePath('/use-dict')" class="home-card">
        <h3>useDict</h3>
        <p>扁平字典加载、翻译、刷新、错误处理</p>
      </NuxtLink>
      <NuxtLink :to="localePath('/use-dict-tree')" class="home-card">
        <h3>useDictTree</h3>
        <p>树形字典渲染 + findPath 路径查找</p>
      </NuxtLink>
      <NuxtLink :to="localePath('/dollar-dict')" class="home-card">
        <h3>$dict 同步翻译</h3>
        <p>translate / translatePath / translateData / getDictItem</p>
      </NuxtLink>
      <NuxtLink :to="localePath('/scope-compare')" class="home-card">
        <h3>作用域对比</h3>
        <p>useDict/$dict 的作用域、响应式、适用场景对比</p>
      </NuxtLink>
      <NuxtLink :to="localePath('/element-plus')" class="home-card">
        <h3>Element Plus</h3>
        <p>el-select / el-tag / el-table / el-cascader</p>
      </NuxtLink>
      <NuxtLink :to="localePath('/vant')" class="home-card">
        <h3>Vant</h3>
        <p>van-dropdown-menu / van-picker</p>
      </NuxtLink>
      <NuxtLink :to="localePath('/nuxt-ui')" class="home-card">
        <h3>Nuxt UI</h3>
        <p>USelectMenu / UBadge / UTable</p>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
const { t } = useI18n();
const localePath = useLocalePath();
</script>
