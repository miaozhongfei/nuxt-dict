---
title: Custom Adapter
description: Connect to any dictionary data source format — GraphQL, Firestore, local JSON files, and more.
---

# Custom Adapter

**Goal**: Write custom adapters to connect the dictionary module to non-standard REST APIs or other data sources.

## Adapter Interface

```ts
interface DictAdapter {
  fetchDict(storeName: string, options: { types: string[]; locale: string }): Promise<DictResponse>
  fetchVersion(storeName: string): Promise<string>
}
```

## Examples

Four adapter examples covering common scenarios — GraphQL, local JSON, format conversion, and multi-API routing:

::code-group
  ```ts [GraphQL Adapter]
  dict: {
    api: {
      adapter: {
        async fetchDict(storeName, { types, locale }) {
          const query = `{ dict(types: [${types.map(t => `"${t}"`)}], locale: "${locale}") { version data { type items { code label } } } }`
          const res = await fetch('https://graphql.example.com', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query }),
          })
          return (await res.json()).data.dict
        },
        async fetchVersion(storeName) {
          const res = await fetch('https://graphql.example.com', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query: '{ dictVersion }' }),
          })
          return (await res.json()).data.dictVersion
        },
      },
    },
  },
  ```

  ```ts [Local JSON Adapter]
  import dictData from './data/dictionary.json'

  dict: {
    api: {
      adapter: {
        async fetchDict(storeName, { types }) {
          const data: Record<string, any> = {}
          for (const type of types) {
            if (dictData[type]) data[type] = dictData[type]
          }
          return { version: '1.0.0', data }
        },
        async fetchVersion(storeName) { return '1.0.0' },
      },
    },
  },
  ```

  ```ts [Format Conversion]
  dict: {
    api: {
      adapter: {
        async fetchDict(storeName, { types }) {
          const res = await fetch(`/api/custom-dict?codes=${types.join(',')}`)
          const json = await res.json()
          const data: Record<string, any> = {}
          for (const item of json.payload) {
            data[item.dictType] = {
              type: item.dictType,
              items: item.options.map((opt: any) => ({ value: opt.dictCode, label: opt.dictName })),
            }
          }
          return { version: json.dataVersion || '1.0.0', data }
        },
        async fetchVersion(storeName) {
          const res = await fetch('/api/custom-dict/version')
          return (await res.json()).version
        },
      },
    },
  },
  ```

  ```ts [Route by StoreName]
  dict: {
    stores: {
      payment: { dictEndpoint: '/v1/payment/dict' },
      logistics: { dictEndpoint: '/v1/logistics/dict' },
    },
    api: {
      adapter: {
        async fetchDict(storeName, { types, locale }) {
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
      },
    },
  },
  ```
::

When each store calls `fetchDict` / `fetchVersion`, the module automatically passes the corresponding `storeName` — you don't need to repeat `baseURL` in the `stores` config.

> If different stores need very different adapter logic (e.g., one uses GraphQL, another uses local files), you can skip the global `api.adapter` if/else routing and configure each store with its own `adapter` directly. See [Multi-Store](/advanced/multi-store#custom-adapter-per-store).

## What You Learned

- [ ] Understand the two methods of `DictAdapter`
- [ ] Write a GraphQL adapter
- [ ] Write a local JSON file adapter
- [ ] Transform data formats within an adapter
- [ ] Use `storeName` to route different external APIs
