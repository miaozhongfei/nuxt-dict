<template>
  <div>
    <header class="layout-header">
      <nav class="layout-nav">
        <NuxtLink :to="localePath('/')" class="layout-nav__brand"> nuxt-dict </NuxtLink>
        <NuxtLink
          :to="localePath('/use-dict')"
          class="layout-nav__link"
          active-class="layout-nav__link--active"
          exact-active-class="layout-nav__link--active"
        >
          {{ t('nav.useDict') }}
        </NuxtLink>
        <NuxtLink
          :to="localePath('/use-dict-tree')"
          class="layout-nav__link"
          active-class="layout-nav__link--active"
          exact-active-class="layout-nav__link--active"
        >
          {{ t('nav.useDictTree') }}
        </NuxtLink>
        <NuxtLink
          :to="localePath('/dollar-dict')"
          class="layout-nav__link"
          active-class="layout-nav__link--active"
          exact-active-class="layout-nav__link--active"
        >
          {{ t('nav.dollarDict') }}
        </NuxtLink>
        <NuxtLink
          :to="localePath('/scope-compare')"
          class="layout-nav__link"
          active-class="layout-nav__link--active"
          exact-active-class="layout-nav__link--active"
        >
          {{ t('nav.scopeCompare') }}
        </NuxtLink>
        <NuxtLink
          :to="localePath('/element-plus')"
          class="layout-nav__link"
          active-class="layout-nav__link--active"
          exact-active-class="layout-nav__link--active"
        >
          {{ t('nav.elementPlus') }}
        </NuxtLink>
        <NuxtLink
          :to="localePath('/vant')"
          class="layout-nav__link"
          active-class="layout-nav__link--active"
          exact-active-class="layout-nav__link--active"
        >
          {{ t('nav.vant') }}
        </NuxtLink>
        <NuxtLink
          :to="localePath('/nuxt-ui')"
          class="layout-nav__link"
          active-class="layout-nav__link--active"
          exact-active-class="layout-nav__link--active"
        >
          {{ t('nav.nuxtUi') }}
        </NuxtLink>
        <span class="layout-nav__lang">
          <NuxtLink
            :to="localePath($route.path, 'zh')"
            class="layout-nav__lang-btn"
            :class="{ active: $i18n.locale === 'zh' }"
          >
            中文
          </NuxtLink>
          <NuxtLink
            :to="localePath($route.path, 'en')"
            class="layout-nav__lang-btn"
            :class="{ active: $i18n.locale === 'en' }"
          >
            EN
          </NuxtLink>
        </span>
      </nav>
    </header>
    <main class="demo-container">
      <NuxtPage />
    </main>
  </div>
</template>

<script setup lang="ts">
const { t } = useI18n();
const localePath = useLocalePath();
const route = useRoute();
</script>
