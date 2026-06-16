---
title: Cache System
description: Deep dive into the three-tier cache architecture — memory, IndexedDB, API — with version detection and auto-invalidation.
---

**Goal**: Understand the three-tier cache architecture, read/write flow, and configuration tuning.

## Three-tier Architecture

```
Component calls useDict / useDict / useDictTree
  ↓
Tier 1: Memory Cache (Map) ← Fastest, returns immediately on hit
  ↓ Miss
Tier 2: IndexedDB Persistent Cache ← Survives page reloads
  ↓ Miss / version mismatch
Tier 3: API Network Request ← Final data source
  ↓ Success
Write-back: Update both IndexedDB + Memory Cache
```

## Tier Details

**Tier 1: Memory Cache**

- Stored in JavaScript `Map` object
- Lifetime: Cleared on page close
- Capacity: `cache.memoryMax` (default 200)
- Expiry: `cache.ttl` ms (default 0 = never expires)
- Eviction: LRU (Least Recently Used)

**Tier 2: IndexedDB**

- Persistent storage, survives page reloads and browser restarts
- Can be disabled: `cache.indexedDB.enabled`

**Tier 3: API**

- Request deduplication: Concurrent requests for the same dictionary type merge into one network call

## Read/Write Flow

**Read (getDict)**: Memory → Pending dedup → IndexedDB → API

**Refresh**: Clear memory → Skip IndexedDB → Direct API call → Write back

## Version Detection

On first access to a store's dictionary data (when calling `useDict` / `useDictTree` / `useDict`), the module lazily calls `fetchVersion()` and compares against the version stored in localStorage:

- Match → Cache is valid
- Mismatch → Clear all caches for that store
- Failure → Ignore error, continue using cache

## Tuning

```ts [nuxt.config.ts]
dict: {
  cache: {
    memoryMax: 200,
    ttl: 0,               // 0 = never expire
    indexedDB: { enabled: true },
  },
}
```

| Scenario                  | Recommendation                         |
| ------------------------- | -------------------------------------- |
| Rarely changing dicts     | `ttl: 0`, rely on version invalidation |
| Frequently changing dicts | `ttl: 600000` (10 min)                 |
| Mobile                    | `memoryMax: 50`                        |
| SSR-heavy                 | `indexedDB.enabled: false`             |

## What You Learned

- [ ] Understand the three-tier cache architecture
- [ ] Know how version detection auto-invalidates caches
- [ ] Tune cache settings for different scenarios
