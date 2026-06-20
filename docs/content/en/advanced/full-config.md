---
title: Full Config Reference
description: Complete reference for all dict configuration options in nuxt.config.ts, with type, default, and description for each field.
---

This chapter lists all fields in the `dict` configuration of `nuxt.config.ts`.

## enable

| Type      | Default | Description                          |
| --------- | ------- | ------------------------------------ |
| `boolean` | `true`  | Enable/disable the dictionary module |

## logLevel

| Type     | Default | Description                                           |
| -------- | ------- | ----------------------------------------------------- |
| `number` | `3`     | 0=Silent, 1=Error, 2=Warn, 3=Info, 4=Debug, 5=Verbose |

## api.baseURL

| Type     | Default  | Description                                            |
| -------- | -------- | ------------------------------------------------------ |
| `string` | `'/api'` | API base URL. Supports absolute URLs or relative paths |

## api.dictEndpoint

| Type     | Default        | Description                   |
| -------- | -------------- | ----------------------------- |
| `string` | `'/dict/list'` | Dictionary list endpoint path |

## api.versionEndpoint

| Type     | Default           | Description                 |
| -------- | ----------------- | --------------------------- |
| `string` | `'/dict/version'` | Version check endpoint path |

## api.adapter

| Type                     | Default     | Description                                                                                                                                                                                                                       |
| ------------------------ | ----------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `string \| undefined` | `undefined` | File path to a custom adapter (e.g. `'~/dict/dict-adapter.ts'`). If a file exists at the convention path `~/dict/dict-adapter.ts`, the module auto-discovers and registers it without manual config. Named stores use `stores.xxx.adapter`. See [Custom Adapter](/advanced/custom-adapter) |

## api.lazy

| Type      | Default | Description                                                                                                            |
| --------- | ------- | ---------------------------------------------------------------------------------------------------------------------- |
| `boolean` | `false` | Whether to lazily check the version. `false`: check immediately on page load. `true`: defer until the first `getDict()` call |

Use `false` (default) when you have few stores. Use `true` for stores that may not be accessed on every page.
Each store can override this via `stores[name].lazy`.

## cache.memoryMax

| Type     | Default | Description                  |
| -------- | ------- | ---------------------------- |
| `number` | `200`   | Maximum memory cache entries |

## cache.ttl

| Type     | Default | Description                               |
| -------- | ------- | ----------------------------------------- |
| `number` | `0`     | Memory cache TTL in ms. 0 = never expires |

## cache.indexedDB.enabled

| Type      | Default | Description                       |
| --------- | ------- | --------------------------------- |
| `boolean` | `true`  | Enable IndexedDB persistent cache |

## cache.indexedDB.dbName

| Type     | Default       | Description             |
| -------- | ------------- | ----------------------- |
| `string` | `'nuxt-dict'` | IndexedDB database name |

## locale.default

| Type     | Default   | Description     |
| -------- | --------- | --------------- |
| `string` | `'zh-CN'` | Fallback locale |

## locale.source

| Type                              | Default    | Description               |
| --------------------------------- | ---------- | ------------------------- |
| `'cookie' \| 'header' \| 'query'` | `'cookie'` | Language detection source |

## locale.cookieKey

| Type     | Default             | Description                                                                                                            |
| -------- | ------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| `string` | `'i18n_redirected'` | Cookie name. Default shares the same cookie as @nuxtjs/i18n for automatic language sync. See [i18n](/integration/i18n) |

## locale.queryKey

| Type     | Default  | Description              |
| -------- | -------- | ------------------------ |
| `string` | `'lang'` | URL query parameter name |

## locale.headerKey

| Type     | Default             | Description         |
| -------- | ------------------- | ------------------- |
| `string` | `'accept-language'` | Request header name |

## locale.paramKey

| Type     | Default  | Description                          |
| -------- | -------- | ------------------------------------ |
| `string` | `'lang'` | Query parameter name sent to the API |

## locale.apiHeaderKey

| Type     | Default      | Description                         |
| -------- | ------------ | ----------------------------------- |
| `string` | `'X-Locale'` | Request header name sent to the API |

## stores

| Type                                                                      | Default | Description                                                                           |
| ------------------------------------------------------------------------- | ------- | ------------------------------------------------------------------------------------- |
| `Record<string, { baseURL?, dictEndpoint?, versionEndpoint?, adapter?, lazy? }>` | `{}`    | Multi-store API config. Each store can have independent endpoints or a custom adapter |

Per-store fields:

- **`baseURL`**: API base URL, inherits global `api.baseURL` if not set
- **`dictEndpoint`**: Dictionary list endpoint, inherits global `api.dictEndpoint` if not set
- **`versionEndpoint`**: Version endpoint, inherits global `api.versionEndpoint` if not set
- **`adapter`**: File path to a custom adapter for this store (`string`, **not inherited**; a REST adapter is auto-created if not set)
- **`lazy`**: Whether to lazily check the version (`boolean`, inherits global `api.lazy` if not set, defaults to `false`)

See [Multi-Store](/advanced/multi-store).

## ssr.prefetch

| Type       | Default | Description                                                                        |
| ---------- | ------- | ---------------------------------------------------------------------------------- |
| `string[]` | `[]`    | Dictionary types to prefetch on server. See [SSR Prefetch](/advanced/ssr-prefetch) |

## version.storageKey

| Type     | Default                   | Description              |
| -------- | ------------------------- | ------------------------ |
| `string` | `'__NUXT_DICT_VERSION__'` | localStorage version key |
