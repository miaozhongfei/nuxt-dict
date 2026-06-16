<script setup lang="ts">
const { locale } = useI18n();
const router = useRouter();

const isOpen = ref(false);
const query = ref('');
const results = ref<any[]>([]);
const inputRef = ref<HTMLInputElement>();
const onlyCurrent = ref(true);

const localeLabels: Record<string, string> = { zh: '中文', en: 'English', fa: 'فارسی' };

// 构建 collection 列表（响应式）
const collectionKey = computed(() => {
  if (onlyCurrent.value) return `content_${locale.value}`;
  return ['content_zh', 'content_en', 'content_fa'];
});

const { status, search } = useSearchCollection(collectionKey as any);

watch(query, async (value) => {
  const q = value.trim();
  if (!q || status.value !== 'ready') {
    results.value = [];
    return;
  }
  results.value = await search(q, {
    limit: 10,
    snippet: { columns: ['content'], around: 30 },
  });
});

watch(isOpen, (val) => {
  if (val) {
    nextTick(() => inputRef.value?.focus());
    query.value = '';
    results.value = [];
  }
});

function onKeydown(e: KeyboardEvent) {
  if (e.key === '/' && !isOpen.value) {
    const tag = (e.target as HTMLElement)?.tagName;
    if (tag !== 'INPUT' && tag !== 'TEXTAREA') {
      e.preventDefault();
      isOpen.value = true;
    }
  }
  if (e.key === 'Escape' && isOpen.value) isOpen.value = false;
}

onMounted(() => window.addEventListener('keydown', onKeydown));
onBeforeUnmount(() => window.removeEventListener('keydown', onKeydown));

function goTo(item: any) {
  isOpen.value = false;
  // item.id contains the full path; strip locale prefix if matching current
  let path = item.id || '';
  if (path.startsWith('/zh')) path = path.slice(3) || '/';
  if (path.startsWith('/en')) path = '/en' + path.slice(3);
  if (path.startsWith('/fa')) path = '/fa' + path.slice(3);
  router.push(path || '/');
}
</script>

<template>
  <UButton color="neutral" variant="ghost" size="sm" aria-label="Search" @click="isOpen = true">
    <UIcon name="i-lucide-search" class="w-4 h-4" />
    <span class="hidden lg:inline ml-1 text-(--ui-text-muted) text-xs">/</span>
  </UButton>

  <UModal v-model:open="isOpen" :overlay="true" :transition="true">
    <template #content>
      <div class="w-full max-w-lg">
        <div class="flex items-center gap-2 p-4 border-b border-(--ui-border)">
          <UIcon name="i-lucide-search" class="w-5 h-5 text-(--ui-text-muted) flex-shrink-0" />
          <input
            ref="inputRef"
            v-model="query"
            type="text"
            :placeholder="onlyCurrent ? 'Search...' : 'Search all languages...'"
            :disabled="status !== 'ready'"
            class="flex-1 bg-transparent outline-none text-base"
          />
          <span
            class="text-xs text-(--ui-text-muted) px-1.5 py-0.5 border border-(--ui-border) rounded"
            >ESC</span
          >
        </div>

        <div class="flex items-center gap-2 px-4 py-2 border-b border-(--ui-border)">
          <label
            class="flex items-center gap-1.5 text-xs text-(--ui-text-muted) cursor-pointer select-none"
          >
            <input type="checkbox" v-model="onlyCurrent" class="cursor-pointer" />
            {{ $t('lang.searchCurrent') }}
          </label>
        </div>

        <div class="max-h-80 overflow-y-auto">
          <div v-if="status === 'loading'" class="p-4 text-center text-(--ui-text-muted) text-sm">
            Indexing...
          </div>
          <div
            v-else-if="query && results.length === 0 && status === 'ready'"
            class="p-4 text-center text-(--ui-text-muted) text-sm"
          >
            No results for "{{ query }}"
          </div>
          <ul v-else-if="results.length > 0" class="py-2">
            <li v-for="item in results" :key="item.id">
              <button
                class="w-full text-left px-4 py-2.5 hover:bg-(--ui-bg-elevated) transition-colors"
                @click="goTo(item)"
              >
                <div class="text-sm font-medium truncate">{{ item.title }}</div>
                <p
                  v-if="item.snippets?.content"
                  class="text-xs text-(--ui-text-muted) mt-0.5"
                  v-html="item.snippets.content"
                />
              </button>
            </li>
          </ul>
          <div
            v-if="!query && status === 'ready'"
            class="p-4 text-center text-(--ui-text-muted) text-sm"
          >
            Type to search...
          </div>
        </div>
      </div>
    </template>
  </UModal>
</template>
