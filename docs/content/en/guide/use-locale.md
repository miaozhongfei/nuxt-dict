---
title: useLocale
description: Multi-language management — get current language, switch language, and persist to cookie.
---

# useLocale

**Goal**: Learn to get and switch the current language, and understand how dictionary data auto-refreshes after language change.

## When do you need this?

- Your app needs Chinese/English switching
- After switching language, all dropdown options should change to the target language
- You need a language switcher button

## Full Signature

```ts
useLocale(): {
  locale: Ref<string>
  setLocale: (newLocale: string) => void
  locales: string[]
}
```

## Return Values

| Property | Type | Description |
|----------|------|-------------|
| `locale` | `Ref<string>` | Current language code, e.g., `'zh-CN'` |
| `setLocale` | `(newLocale: string) => void` | Switch language, update cookie, clear dictionary cache |
| `locales` | `string[]` | Supported language list |

## Basic Example

```vue
<template>
  <div>
    <p>Current language: {{ locale }}</p>
    <button @click="setLocale('zh-CN')" :style="{ fontWeight: locale === 'zh-CN' ? 'bold' : 'normal' }">中文</button>
    <button @click="setLocale('en-US')" :style="{ fontWeight: locale === 'en-US' ? 'bold' : 'normal' }">English</button>
  </div>
</template>

<script setup lang="ts">
const { locale, setLocale } = useLocale()
</script>
```

## Language Detection

Configure `dict.locale.source` to define the detection source:

- **`'cookie'`** (default) — Read from cookie, default key is `i18n_redirected`
- **`'header'`** — Read from HTTP request header (server-side only)
- **`'query'`** — Read from URL query parameter, default key is `lang`

If none is detected, uses `locale.default` (default `'zh-CN'`).

## What happens after switching language?

1. `locale` value updates
2. Cookie syncs
3. **All dictionary memory cache is cleared** (different languages have different data)
4. Components using `useDict` / `useDictTree` **auto-reload** dictionary data for the new language

> No manual refresh needed! Components detect that data became `null` and automatically fetch new data.

## Notes

> After switching language, components using `useDict` / `useDictTree` / `useDict` **auto-reload** dictionary data for the new language — no manual refresh or extra `watch` code needed.

> If you're using `@nuxtjs/i18n`, both modules auto-sync via a shared cookie (default `i18n_redirected`). See [i18n](/integration/i18n).

## What You Learned

- [ ] Use `useLocale` to get and switch language
- [ ] Understand three detection sources
- [ ] Know that cache auto-clears on language switch
