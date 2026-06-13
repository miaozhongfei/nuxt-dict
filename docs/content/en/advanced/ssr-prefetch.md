---
title: SSR Prefetch
description: Prefetch dictionary data during server-side rendering to accelerate first-screen display.
---

**Goal**: Understand how SSR prefetch works and configure which dictionary types to prefetch for better first-screen performance.

## Why prefetch?

Default flow:

```
Browser shows HTML → Vue takes over (hydration)
  → useDict fetches in onMounted → data loads → page updates
```

Problem: Between hydration and data loading, users see **loading state** or **raw codes**.

With prefetch:

```
Server renders HTML
  → Simultaneously: server prefetches dict data, injects into HTML payload
    → Browser directly shows translated text
      → Vue reads payload into memory cache
```

## Configuration

```ts [nuxt.config.ts]
dict: {
  ssr: {
    prefetch: ['gender', 'status', 'industry'],
  },
}
```

## Prefetch + On-demand

Prefetch means "pre-load first-screen essentials", not "load everything":

```vue
<template>
  <!-- These are in prefetch → show translated text immediately -->
  <p>Gender: {{ $dict.translate('gender', user.gender) }}</p>
  <p>Industry: {{ $dict.translate('industry', user.industry) }}</p>

  <!-- Not in prefetch → loaded on demand -->
  <div v-if="showDetail">
    <p>Detail: {{ $dict.translate('detail_type', item.type) }}</p>
  </div>
</template>
```

## Fault Tolerance

Prefetch uses `Promise.all` but tolerates partial failures. A failed prefetch only logs a warning — the page renders normally and the dictionary loads on the client side.

## Performance Tips

Only put essential dictionary types (typically 3-10) in `prefetch`. Don't put all dictionaries there.

## Notes

> Prefetch only works in SSR mode. SPA mode doesn't need it.

## What You Learned

- [ ] Understand the SSR prefetch workflow
- [ ] Configure `dict.ssr.prefetch`
- [ ] Know that prefetch failure doesn't block rendering
