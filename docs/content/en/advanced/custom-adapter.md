---
title: Custom Adapter
description: Connect to any dictionary data source format — GraphQL, Firestore, local JSON files, and more.
---

**Goal**: Write custom adapters to connect the dictionary module to non-standard REST APIs or other data sources.

## Adapter Interface

An adapter implements two methods from the `DictAdapter` interface. The module provides a `defineDictAdapter()` helper for full TypeScript type inference:

```ts
// defineDictAdapter() returns the object as-is at runtime, only provides type checking
export default defineDictAdapter({
  async fetchDict(storeName, { types, locale }) { /* ... */ },
  async fetchVersion(storeName) { /* ... */ },
})
```

Full interface definition:

```ts
interface DictAdapter {
  fetchDict(storeName: string, options: { types: string[]; locale: string }): Promise<DictResponse>;
  fetchVersion(storeName: string): Promise<string>;
}
```

## Registration

Adapters are defined in separate files. There are two ways to register them:

### Convention Path Auto-Discovery (Recommended)

Place the adapter file at `~/dict/dict-adapter.ts` and the module discovers it automatically — no configuration needed:

```ts [~/dict/dict-adapter.ts]
// Module auto-discovers ~/dict/dict-adapter.ts, no nuxt.config.ts setup required
export default defineDictAdapter({
  async fetchDict(storeName, { types, locale }) {
    const res = await fetch(`/api/dict?types=${types.join(',')}&lang=${locale}`)
    return res.json()
  },
  async fetchVersion(storeName) {
    const res = await fetch('/api/dict/version')
    return (await res.json()).version
  },
})
```

### Explicit Config Path

If the adapter file is not at the convention location, specify the path in `nuxt.config.ts`:

```ts [nuxt.config.ts]
export default defineNuxtConfig({
  modules: ['@lacqjs/nuxt-dict'],
  dict: {
    api: {
      // Explicit adapter file path (overrides convention path)
      adapter: '~/custom/my-adapter',
    },
  },
})
```

Each store can also have its own adapter file at the convention path `~/dict/{storeName}-adapter.ts`.

## Examples

Four adapter examples covering common scenarios — GraphQL, local JSON, format conversion, and multi-API routing:

::code-group

```ts [GraphQL Adapter]
// ~/dict/dict-adapter.ts
export default defineDictAdapter({
  async fetchDict(storeName, { types, locale }) {
    // Build the GraphQL query string
    const query = `{ dict(types: [${types.map(t => `"${t}"`)}], locale: "${locale}") { version data { type items { code label } } } }`
    const res = await fetch('https://graphql.example.com', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query }),
    })
    return (await res.json()).data.dict
  },
  async fetchVersion(storeName) {
    // Query the current dictionary version
    const res = await fetch('https://graphql.example.com', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: '{ dictVersion }' }),
    })
    return (await res.json()).data.dictVersion
  },
})
```

```ts [Local JSON Adapter]
// ~/dict/dict-adapter.ts
import { defineDictAdapter } from '@lacqjs/nuxt-dict'
// Import local dictionary data file
import dictData from '../data/dictionary.json'

export default defineDictAdapter({
  async fetchDict(storeName, { types }) {
    // Filter local data by requested types
    const data: Record<string, any> = {}
    for (const type of types) {
      if (dictData[type]) data[type] = dictData[type]
    }
    // Local data doesn't change, use a fixed version
    return { data }
  },
  async fetchVersion(storeName) {
    // No version detection needed for local data
    return '1.0.0'
  },
})
```

```ts [Format Conversion]
// ~/dict/dict-adapter.ts
export default defineDictAdapter({
  async fetchDict(storeName, { types }) {
    const res = await fetch(`/api/custom-dict?codes=${types.join(',')}`)
    const json = await res.json()
    // Transform backend format to DictResponse format expected by the module
    const data: Record<string, any> = {}
    for (const item of json.payload) {
      data[item.dictType] = {
        type: item.dictType,
        items: item.options.map((opt: any) => ({ value: opt.dictCode, label: opt.dictName })),
      }
    }
    return { data }
  },
  async fetchVersion(storeName) {
    const res = await fetch('/api/custom-dict/version')
    return (await res.json()).version
  },
})
```

```ts [Route by StoreName]
// ~/dict/dict-adapter.ts
export default defineDictAdapter({
  async fetchDict(storeName, { types, locale }) {
    // Route to different API endpoints based on storeName
    const endpoints: Record<string, string> = {
      dicts: 'https://default-api.example.com/dict/list',
      payment: 'https://pay-api.example.com/v1/payment/dict',
      logistics: 'https://logistics-api.example.com/v1/logistics/dict',
    }
    const url = endpoints[storeName] || endpoints.dicts
    const res = await fetch(`${url}?types=${types.join(',')}&lang=${locale}`)
    return res.json()
  },
  async fetchVersion(storeName) {
    const res = await fetch(`https://${storeName === 'dicts' ? 'default' : storeName}-api.example.com/version`)
    return (await res.json()).version
  },
})
```

::

When each store calls `fetchDict` / `fetchVersion`, the module automatically passes the corresponding `storeName` — you don't need to repeat `baseURL` in the `stores` config.

> If different stores need very different adapter logic (e.g., one uses GraphQL, another uses local files), you can skip the global adapter if/else routing and create separate adapter files for each store (convention path `~/dict/{storeName}-adapter.ts`). See [Multi-Store](/advanced/multi-store#custom-adapter-per-store).

## What You Learned

- [ ] Understand the two methods of `DictAdapter`
- [ ] Use `defineDictAdapter()` helper to define adapters
- [ ] Register adapters via convention path `~/dict/dict-adapter.ts`
- [ ] Write a GraphQL adapter
- [ ] Write a local JSON file adapter
- [ ] Transform data formats within an adapter
- [ ] Use `storeName` to route different external APIs
