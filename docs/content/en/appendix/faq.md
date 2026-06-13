---
title: FAQ
description: Most common issues encountered when using the dictionary module and their solutions.
---

# FAQ

## Page shows raw codes instead of translated text

Possible causes:
1. Dictionary data hasn't loaded yet. Use `v-if="data"` before translate
2. Wrong dictionary type name. Verify the type in `useDict('gender')` matches the backend API
3. API configuration is wrong. Check `dict.api.baseURL` and `dict.api.dictEndpoint`

## useDict returns null data

`data` starts as `null` — it loads asynchronously on mount. Use `loading` and `error` to determine the current state.

## How to manually refresh a dictionary?

Call the `refresh()` function returned by the composable.

## Dictionary doesn't update after language switch?

`setLocale()` clears the memory cache. Components using `useDict` / `useDictTree` / `useDict` **auto-reload** dictionary data for the new language — no manual refresh or extra `watch` code needed.

## How to use with @nuxtjs/i18n?

Both modules auto-sync via a shared cookie (default `i18n_redirected`). Dictionary data updates automatically on page refresh or runtime language switch. See [i18n](/integration/i18n).

## How to integrate with an existing backend API?

Use a [custom adapter](/advanced/custom-adapter) to transform the backend response format.

## How to connect multiple backend dictionary sources?

Use [Multi-Store](/advanced/multi-store) to configure separate API endpoints in `dict.stores`.

## IndexedDB errors?

IndexedDB write failures don't affect functionality. Common causes: private browsing mode, insufficient storage. Disable with `cache.indexedDB.enabled: false`.

## Dictionary data updated but page shows old data?

1. Ensure the version endpoint returns a new version number
2. Call `refresh()` to force re-fetch

## Code is numeric but translate(1) returns raw code?

The module compares as strings internally. Verify the backend code is indeed numeric type.

## SSR prefetch configured but not working?

Prefetch only applies in SSR mode. SPA mode doesn't need it.

## Server error "fetch is not defined"

Ensure your Node.js runtime is >= 22 (Nuxt 4 requirement).
