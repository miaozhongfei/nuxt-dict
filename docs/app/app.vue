<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<style>
@import 'tailwindcss' theme(static);
@import '@nuxt/ui';

@source "../content/**/*";

@theme {
  --font-sans: 'Public Sans', sans-serif;

  --color-green-50: #effdf5;
  --color-green-100: #d9fbe8;
  --color-green-200: #b3f5d1;
  --color-green-300: #75edae;
  --color-green-400: #00dc82;
  --color-green-500: #00c16a;
  --color-green-600: #00a155;
  --color-green-700: #007f45;
  --color-green-800: #016538;
  --color-green-900: #0a5331;
  --color-green-950: #052e16;
}

:root {
  --ui-container: 90rem;
}

.dark {
  --ui-bg: var(--ui-color-neutral-950);
  --ui-bg-muted: var(--ui-color-neutral-900);
  --ui-bg-elevated: var(--ui-color-neutral-900);
  --ui-bg-accented: var(--ui-color-neutral-800);
}

/* 搜索高亮 */
mark {
  background: color-mix(in oklab, var(--ui-color-primary-400) 20%, transparent);
  color: var(--ui-color-primary-600);
  border-radius: 2px;
  padding: 0 2px;
}

.dark mark {
  background: color-mix(in oklab, var(--ui-color-primary-500) 25%, transparent);
  color: var(--ui-color-primary-300);
}

/* 滚动条自动隐藏 */
.scrollbar-hide {
  scrollbar-width: thin;
  scrollbar-color: transparent transparent;
  transition: scrollbar-color 0.3s;
}
.scrollbar-hide:hover,
.scrollbar-hide:active {
  scrollbar-color: rgba(128, 128, 128, 0.3) transparent;
}
.scrollbar-hide::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
.scrollbar-hide::-webkit-scrollbar-thumb {
  background: transparent;
  border-radius: 3px;
}
.scrollbar-hide:hover::-webkit-scrollbar-thumb {
  background: rgba(128, 128, 128, 0.3);
}
.scrollbar-hide::-webkit-scrollbar-track {
  background: transparent;
}

/* RTL 页面中代码块保持从左到右 */
[dir="rtl"] pre,
[dir="rtl"] code {
  direction: ltr;
  text-align: left;
}

/* 主题切换：点击扩散圆环（Firefox/Safari 降级方案） */
.theme-transition-overlay {
  position: fixed;
  inset: 0;
  z-index: 9999;
  pointer-events: none;
  opacity: 0.9;
  transition: clip-path 0.8s ease-out;
}
</style>
