---
title: Multi-Store
description: Connect one page to multiple backend dictionary data sources simultaneously.
---

**Goal**: Configure multiple dictionary data stores so a single page can use dictionary data from different systems.

## When do you need this?

- An admin dashboard needs both "main system" order statuses and "payment system" payment methods
- Microservice architecture with dictionary data in different backend services
- Integrating third-party system dictionaries

## Configuration

```ts [nuxt.config.ts]
export default defineNuxtConfig({
  modules: ['@lacqjs/nuxt-dict'],
  dict: {
    api: { baseURL: '', dictEndpoint: '/api/dict/list' },
    stores: {
      // payment store: independent backend address
      payment: { baseURL: 'https://pay-api.example.com', dictEndpoint: '/v1/dictionary' },
      // logistics store: independent endpoint, same domain
      logistics: { dictEndpoint: '/api/logistics/dict' },
      // static store: uses custom adapter, no HTTP requests
      static: {
        adapter: {
          async fetchDict(_storeName, { types, locale }) {
            return {
              version: 'static-1.0',
              data: {
                priority: { type: 'priority', items: [
                  { value: 'high', label: `High Priority (${locale})` },
                  { value: 'low', label: `Low Priority (${locale})` },
                ] },
              },
            }
          },
          async fetchVersion(_storeName) {
            return 'static-1.0'
          },
        },
      },
    },
  },
})
```

## Inheritance Rules

Unconfigured fields inherit from the global `api`. For `logistics`:
- `baseURL` not set → inherits `''`
- `dictEndpoint` set as `/api/logistics/dict` → overrides global
- `versionEndpoint` not set → inherits global

> The `adapter` field is special — it **does not inherit**. If you don't configure `adapter` for a store, the module automatically creates a default REST adapter for it (using that store's inherited endpoint config) instead of copying the global `api.adapter`.

## Custom Adapter per Store

Each named store can configure its own custom adapter (the `adapter` field), replacing the default REST request. This is useful when:

- Dictionary data comes from local files or static config, no HTTP needed
- Different stores have very different backend formats, requiring independent adapter logic
- You need mock data for development and debugging

Stores with custom adapters are used in composables exactly the same way as other stores:

```vue
<template>
  <div>
    <h3>Priority (static store — custom adapter)</h3>
    <select v-model="priority">
      <option v-for="opt in staticOptions" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
    </select>
  </div>
</template>

<script setup lang="ts">
// static store uses custom adapter, no network requests
const { options: staticOptions } = useDict('static', 'priority')

const priority = ref('')
</script>
```

## Usage

```ts
// Default store
const { options: orderOptions } = useDict('order_status')

// payment store
const { options: payOptions } = useDict('payment', 'pay_method')

// useDict / useDictTree / $dict all support store parameter
const { data } = useDict('payment', 'pay_status')
const { tree } = useDictTree('logistics', 'delivery_region')
$dict.translate('payment', 'pay_status', 1)
```

## Independent Version Detection

Each store has its own version detection using a **lazy mechanism** — `fetchVersion()` is only called on first access to that store's dictionary data, not eagerly at module startup. A version update in one store only invalidates that store's cache, leaving others unaffected.

## Mastering Store Config Rules

### Two Basic Concepts

**1. What is a store?**

A store is a "dictionary data source". For example, your project might need three kinds of dictionaries:

- Gender, status → fetched from your local backend at `/api/dict/list` → this is store `dicts` (the default store)
- Payment methods → fetched from the payment system at `https://pay-api.example.com` → this is store `payment`
- Static labels → hardcoded directly in code, no HTTP needed → this is also a store

Each store is identified by a **store name** (`dicts`, `payment`, `static`, etc.).

**2. What is an adapter?**

An adapter is a "data-fetching tool". It has two jobs:
- `fetchDict`: go get the dictionary data
- `fetchVersion`: check if the version has changed

The module comes with a built-in **default REST adapter** — it automatically sends HTTP requests to the URL you configured. If you don't need HTTP (e.g., reading local files), or if your backend format differs, you can write your own adapter to replace it.

### Three Ways a Store Can Exist

A store can be in one of three states:

| State | How you write it in `stores` | Effect |
|-------|------------------------------|--------|
| **Not declared** | Don't write it at all | The module doesn't know about it. When you call `useDict('myStore', 'type')`, it reuses the `dicts` adapter directly |
| **Declared, but empty** | `myStore: {}` | The module knows this store exists, but all fields are empty. It creates an independent REST adapter, copying all address fields from the global `api` |
| **Declared with fields** | `myStore: { baseURL: '...' }` | Uses the fields you set + copies unset fields from the global `api` |

**Code comparison of the three states:**

```ts [nuxt.config.ts]
// Global api — the default value source for all stores' unset fields
api: { baseURL: '/api', dictEndpoint: '/dict/list', versionEndpoint: '/dict/version' }
stores: {
  // State 1: payment is not declared at all
  // → Calling useDict('payment', 'type') silently falls back to the dicts adapter, endpoint is still /api/dict/list

  // State 2: logistics is declared but empty
  logistics: {},
  // → Independent REST adapter, endpoint inherits as /api/dict/list
  // → Has its own independent cache and version detection

  // State 3: static has an adapter configured
  static: { adapter: { ... } },
  // → Uses its own custom adapter, no HTTP requests
}
```

**Difference between State 1 and State 2:**

Even though the endpoints are the same:
- State 1: `payment` and `dicts` share one adapter and one cache — when `dicts` version updates, `payment` cache is also invalidated
- State 2: `logistics` has its own adapter and cache — when `dicts` version updates, `logistics` is unaffected

> When would you use State 2 (declaring an empty object)? When you want different dictionary types from the same endpoint to have independent caching.

### Detailed Explanation of the Four Fields

Each store can configure four fields:

| Field | Type | Purpose | Example |
|-------|------|---------|---------|
| `baseURL` | string | The server address | `https://pay-api.example.com` |
| `dictEndpoint` | string | The endpoint path for fetching dictionary data | `/v1/dictionary` |
| `versionEndpoint` | string | The endpoint path for fetching the version number | `/v1/dictionary/version` |
| `adapter` | object | A custom tool to replace the default HTTP tool | `{ fetchDict(...) {}, fetchVersion(...) {} }` |

**The final request URL = `baseURL` + the corresponding endpoint.**

Example:

```ts [nuxt.config.ts]
payment: {
  baseURL: 'https://pay-api.example.com',
  dictEndpoint: '/v1/dictionary',
  versionEndpoint: '/v1/dictionary/version',
}
// Actual request: https://pay-api.example.com/v1/dictionary?types=gender,status&lang=zh-CN
// Version request: https://pay-api.example.com/v1/dictionary/version
```

### Inheritance Rules in Detail

#### Rule 1: The three address fields always auto-inherit

If a store doesn't set `baseURL`, `dictEndpoint`, or `versionEndpoint`, they are automatically copied from the global `api` config.

**Example 1: Set one, missing two**

```ts [nuxt.config.ts]
api: { baseURL: '/api', dictEndpoint: '/dict/list', versionEndpoint: '/dict/version' }
stores: {
  payment: { baseURL: 'https://pay-api.example.com' },
  // ↑ Only baseURL was set
}
```

`payment` final result:
- `baseURL` = `'https://pay-api.example.com'` ← uses your value
- `dictEndpoint` = `'/dict/list'` ← copied from global
- `versionEndpoint` = `'/dict/version'` ← copied from global

**Example 2: None set**

```ts [nuxt.config.ts]
api: { baseURL: '/api', dictEndpoint: '/dict/list', versionEndpoint: '/dict/version' }
stores: {
  logistics: {},
  // ↑ Nothing was set
}
```

`logistics` final result:
- `baseURL` = `'/api'` ← copied from global
- `dictEndpoint` = `'/dict/list'` ← copied from global
- `versionEndpoint` = `'/dict/version'` ← copied from global

**Example 3: All set**

```ts [nuxt.config.ts]
api: { baseURL: '/api', dictEndpoint: '/dict/list', versionEndpoint: '/dict/version' }
stores: {
  payment: {
    baseURL: 'https://pay-api.example.com',
    dictEndpoint: '/v1/dictionary',
    versionEndpoint: '/v1/dictionary/version',
  },
}
```

`payment` final result: all three use your values, the global config is completely ignored.

#### Rule 2: Adapters do NOT auto-inherit

This is **the most critical and easiest rule to get wrong**.

**2.1 Default store `dicts`**

```ts [nuxt.config.ts]
api: {
  baseURL: '/api',
  dictEndpoint: '/dict/list',
  adapter: myCustomAdapter,   // ← global custom adapter
}
```

Default store `dicts` priority:
1. Check if `api.adapter` is set → if yes, use it
2. If not → auto-create a REST adapter (using the three global address fields)

**2.2 Named stores (`stores.xxx`)**

```ts [nuxt.config.ts]
api: {
  adapter: myCustomAdapter,   // ← named stores cannot see this adapter!
}
stores: {
  payment: {
    baseURL: 'https://pay-api.example.com',
    // No adapter configured
  },
}
```

`payment` store's logic:
1. Check if `stores.payment.adapter` is set → it's not
2. Does NOT look at `api.adapter` → **skips it**
3. Auto-creates a REST adapter (using the inherited address fields)

So `payment` ends up calling `https://pay-api.example.com/dict/list` (REST), not your global custom adapter.

**Why was it designed this way?**

```ts [nuxt.config.ts]
// If adapter inheritance were allowed, this awkward situation would occur:
api: { adapter: myGlobalAdapter }

stores: {
  payment: {},
  logistics: {},
  static: {},
}
// payment, logistics, and static would all "share the same adapter object"
// myGlobalAdapter.fetchDict would be called for all three, distinguished only by storeName
// That's not "inheriting data" — that's "using one tool to handle multiple sources"
```

If you really want one tool to handle multiple stores, just route by `storeName` inside the adapter — there's no need to "inherit" the same object to every store.

**2.3 Relationship between global adapter and per-store adapters**

Both approaches achieve similar results, but suit different scenarios:

**Approach A: Global adapter + storeName routing**

```ts [nuxt.config.ts]
api: {
  adapter: {
    async fetchDict(storeName, { types, locale }) {
      const urls: Record<string, string> = {
        dicts: '/api/dict/list',
        payment: 'https://pay-api.example.com/v1/dictionary',
        logistics: '/api/logistics/dict',
      }
      const url = urls[storeName]
      const res = await fetch(`${url}?types=${types.join(',')}&lang=${locale}`)
      return res.json()
    },
    async fetchVersion(storeName) {
      const res = await fetch(`/api/version?store=${storeName}`)
      return (await res.json()).version
    },
  },
}
stores: {
  payment: {},     // Declared so the module knows it exists — endpoint config doesn't matter
  logistics: {},   // because the adapter handles routing internally
}
```

Best for: All stores use the same protocol (HTTP), only addresses differ, adapter logic is identical.

**Approach B: Per-store independent adapters**

```ts [nuxt.config.ts]
api: { baseURL: '', dictEndpoint: '/api/dict/list' },
stores: {
  payment: {
    baseURL: 'https://pay-api.example.com',
    dictEndpoint: '/v1/dictionary',
    // No adapter written → auto-creates REST adapter
  },
  static: {
    adapter: {
      // Fully custom, no HTTP
      async fetchDict() { return { version: '1.0', data: { ... } } },
      async fetchVersion() { return '1.0' },
    },
  },
}
```

Best for: Different stores use completely different data-fetching approaches (HTTP vs local files vs GraphQL).

### Complete Reference Table

All possible cases listed:

| Store Type | Condition | Adapter Used |
|-----------|-----------|-------------|
| `dicts` (default) | `api.adapter` is set | Uses `api.adapter` |
| `dicts` (default) | `api.adapter` not set | Uses REST: `api.baseURL` + `api.dictEndpoint` + `api.versionEndpoint` |
| `xxx` (declared in `stores`) | `stores.xxx.adapter` is set | Uses `stores.xxx.adapter` (unaffected by `api.adapter`) |
| `xxx` (declared in `stores`) | `stores.xxx.adapter` not set | Uses REST: `stores.xxx.baseURL ?? api.baseURL` + `stores.xxx.dictEndpoint ?? api.dictEndpoint` + `stores.xxx.versionEndpoint ?? api.versionEndpoint`. Has independent cache and version detection |
| `yyy` (not declared) | — | Reuses the `dicts` adapter, shares the same cache |

### One-Sentence Summary

> The three address fields (baseURL / dictEndpoint / versionEndpoint) will always be filled — if you don't set them, they copy from the global config. The adapter you set is the one used; if you don't set one, an HTTP tool is installed for you — it will never copy from the global adapter.

## What You Learned

- [ ] Configure multiple stores in `dict.stores`
- [ ] Understand configuration inheritance
- [ ] Specify store names in composables
