<script setup lang="ts">
import type { Collections } from '@nuxt/content';
import { withLeadingSlash } from 'ufo';

const route = useRoute();
const { locale, locales, setLocale, t } = useI18n();
const localePath = useLocalePath();
const colorMode = useColorMode();

function toggleColorMode(e: MouseEvent) {
  const next = colorMode.preference === 'dark' ? 'light' : 'dark';

  // 1. 取当前（旧主题）背景色
  const oldBg = getComputedStyle(document.body).backgroundColor;

  // 2. 直接切换到新主题
  colorMode.preference = next;

  // 3. 等新主题 CSS 生效后，用旧主题色创建 overlay 覆盖全屏
  requestAnimationFrame(() => {
    const x = e.clientX + 'px';
    const y = e.clientY + 'px';
    const overlay = document.createElement('div');
    overlay.className = 'theme-transition-overlay';
    overlay.style.setProperty('--x', x);
    overlay.style.setProperty('--y', y);
    overlay.style.background = oldBg;
    overlay.style.clipPath = `circle(150% at ${x} ${y})`;
    document.body.appendChild(overlay);

    // 4. 动画：从全屏缩到点击处（reveal 新主题）
    requestAnimationFrame(() => {
      overlay.style.clipPath = `circle(0 at ${x} ${y})`;
    });

    overlay.addEventListener('transitionend', () => overlay.remove());
  });
}

const availableLocales = computed(() =>
  locales.value.map((l: any) => ({ label: l.name, value: l.code })),
);

// 与 catch-all 页面共享同一 useAsyncData key，Nuxt 自动去重
const slug = computed(() => {
  const segments = ((route.params.slug as string[]) || []).filter(Boolean);
  return withLeadingSlash(segments.join('/'));
});

const pageKey = computed(() => 'toc-' + locale.value + '-' + slug.value);

const { data: page } = await useAsyncData(
  pageKey,
  async () => {
    const collection = ('content_' + locale.value) as keyof Collections;
    return queryCollection(collection).path(slug.value).first() || null;
  },
  { watch: [locale, slug] },
);

const tocLinks = computed(() => (page.value as any)?.body?.toc?.links || []);

const mainRef = ref<HTMLElement>();

function onTocMove(id: string) {
  const el = document.getElementById(id);
  if (el && mainRef.value) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

watch(() => route.path, () => {
  nextTick(() => {
    if (mainRef.value) {
      mainRef.value.scrollTop = 0;
    }
  });
});

const sidebarGroups = [
  {
    label: 'sidebar.welcome',
    defaultOpen: true,
    items: [
      { label: 'sidebar.environment', to: '/guide/environment' },
      { label: 'sidebar.installation', to: '/guide/installation' },
      { label: 'sidebar.first-dict', to: '/guide/first-dict' },
    ],
  },
  {
    label: 'sidebar.core',
    defaultOpen: false,
    items: [
      { label: 'sidebar.use-dict', to: '/guide/use-dict' },
      { label: 'sidebar.use-dict-options', to: '/guide/use-dict-options' },
      { label: 'sidebar.use-dict-tree', to: '/guide/use-dict-tree' },
      { label: 'sidebar.use-locale', to: '/guide/use-locale' },
      { label: 'sidebar.dollar-dict', to: '/guide/dollar-dict' },
    ],
  },
  {
    label: 'sidebar.advanced',
    defaultOpen: false,
    items: [
      { label: 'sidebar.multi-store', to: '/advanced/multi-store' },
      { label: 'sidebar.custom-adapter', to: '/advanced/custom-adapter' },
      { label: 'sidebar.ssr-prefetch', to: '/advanced/ssr-prefetch' },
      { label: 'sidebar.cache-system', to: '/advanced/cache-system' },
      { label: 'sidebar.full-config', to: '/advanced/full-config' },
    ],
  },
  {
    label: 'sidebar.integration',
    defaultOpen: false,
    items: [
      { label: 'sidebar.element-plus', to: '/integration/element-plus' },
      { label: 'sidebar.vant', to: '/integration/vant' },
      { label: 'sidebar.nuxt-ui', to: '/integration/nuxt-ui' },
      { label: 'sidebar.vanilla', to: '/integration/vanilla' },
      { label: 'sidebar.i18n', to: '/integration/i18n' },
    ],
  },
  {
    label: 'sidebar.appendix',
    defaultOpen: false,
    items: [
      { label: 'sidebar.api-reference', to: '/appendix/api-reference' },
      { label: 'sidebar.faq', to: '/appendix/faq' },
      { label: 'sidebar.config-templates', to: '/appendix/config-templates' },
    ],
  },
];

// UNavigationMenu 格式：根据当前路由自动展开所在分组
const navItems = computed(() => {
  const currentPath = route.path.replace(/^\/(en|fa)/, '') || '/';
  let hasOpen = false;
  const groups = sidebarGroups.map((group) => {
    const open = group.items.some((item) => currentPath.startsWith(item.to));
    if (open) hasOpen = true;
    return {
      label: t(group.label),
      defaultOpen: open,
      children: group.items.map((item) => ({
        label: t(item.label),
        to: localePath(item.to),
      })),
    };
  });
  // 首页或无匹配时展开第一组
  if (!hasOpen && groups.length > 0) {
    groups[0].defaultOpen = true;
  }
  return groups;
});
</script>

<template>
  <UApp>
    <UHeader>
      <template #left>
        <NuxtLink to="/" class="flex items-center gap-2 font-bold text-lg">
          <UIcon name="i-lucide-book-type" class="w-5 h-5" />
          <span>Nuxt Dict</span>
        </NuxtLink>
      </template>
      <template #right>
        <UButton color="neutral" variant="ghost" size="sm" @click="toggleColorMode($event)">
          <UIcon :name="colorMode.preference === 'dark' ? 'i-lucide-sun' : 'i-lucide-moon'" class="w-4 h-4" />
        </UButton>
        <SearchDialog />
        <USelect
          :model-value="locale"
          :items="availableLocales"
          size="sm"
          class="w-32"
          @update:model-value="(v: string) => setLocale(v)"
        />
      </template>
    </UHeader>

    <UContainer>
      <div class="flex gap-8 h-[calc(100vh-var(--ui-header-height))]">
        <aside class="hidden lg:block w-56 flex-shrink-0 overflow-y-auto py-4 scrollbar-hide">
          <UNavigationMenu :items="navItems" orientation="vertical" class="text-sm" highlight />
        </aside>

        <main ref="mainRef" class="flex-1 min-w-0 overflow-y-auto py-8 scrollbar-hide scroll-smooth">
          <slot />
        </main>

        <aside class="hidden xl:block w-56 flex-shrink-0 py-8" v-if="tocLinks?.length">
          <UContentToc :links="tocLinks" :title="$t('common.toc')" @move="onTocMove" />
        </aside>
      </div>
    </UContainer>
  </UApp>
</template>
