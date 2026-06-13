<script setup lang="ts">
import type { Collections } from '@nuxt/content';
import { withLeadingSlash } from 'ufo';

const route = useRoute();
const { locale, localeProperties } = useI18n();

const slug = computed(() => {
  const segments = ((route.params.slug as string[]) || []).filter(Boolean);
  return withLeadingSlash(segments.join('/'));
});

const pageKey = computed(() => 'page-' + slug.value);

const { data: page } = await useAsyncData(
  pageKey,
  async () => {
    const collection = ('content_' + locale.value) as keyof Collections;
    return queryCollection(collection).path(slug.value).first() || null;
  },
  { watch: [locale, slug] },
);

if (!page.value) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true });
}

useSeoMeta(page.value.seo);
</script>

<template>
  <ContentRenderer v-if="page" :dir="localeProperties?.dir ?? 'ltr'" :value="page" />
</template>
