import { describe, expect, it } from 'vitest'

import { MemoryCache } from '../src/runtime/core/cache/memory-cache'

function makeEntry<T>(value: T) {
  return { data: value, timestamp: Date.now() }
}

describe('memoryCache - 基础操作', () => {
  it('set 后可 get 到相同数据', () => {
    const cache = new MemoryCache<string>()
    cache.set('k1', makeEntry('v1'))
    expect(cache.get('k1')?.data).toBe('v1')
  })

  it('未 set 的 key 返回 undefined', () => {
    const cache = new MemoryCache<string>()
    expect(cache.get('missing')).toBeUndefined()
  })

  it('has 返回是否存在且未过期', () => {
    const cache = new MemoryCache<string>()
    cache.set('k1', makeEntry('v1'))
    expect(cache.has('k1')).toBe(true)
    expect(cache.has('k2')).toBe(false)
  })

  it('delete 后可正确删除', () => {
    const cache = new MemoryCache<string>()
    cache.set('k1', makeEntry('v1'))
    cache.delete('k1')
    expect(cache.has('k1')).toBe(false)
  })

  it('clear 后所有缓存清空', () => {
    const cache = new MemoryCache<string>()
    cache.set('k1', makeEntry('v1'))
    cache.set('k2', makeEntry('v2'))
    cache.clear()
    expect(cache.size).toBe(0)
  })

  it('TTL 过期后 get 返回 undefined', async () => {
    const cache = new MemoryCache<string>(200, 50)
    cache.set('k1', makeEntry('v1'))
    await new Promise<void>((r) => { setTimeout(r, 60) })
    expect(cache.get('k1')).toBeUndefined()
  })
})

describe('memoryCache - 容量和前缀', () => {
  it('超出 maxSize 时淘汰最旧条目', () => {
    const cache = new MemoryCache<string>(2)
    cache.set('k1', makeEntry('v1'))
    cache.set('k2', makeEntry('v2'))
    cache.set('k3', makeEntry('v3'))
    expect(cache.has('k1')).toBe(false)
    expect(cache.has('k2')).toBe(true)
    expect(cache.has('k3')).toBe(true)
  })

  it('deleteByPrefix 按前缀删除', () => {
    const cache = new MemoryCache<string>()
    cache.set('storeA:gender', makeEntry('g'))
    cache.set('storeA:status', makeEntry('s'))
    cache.set('storeB:gender', makeEntry('g2'))
    cache.deleteByPrefix('storeA:')
    expect(cache.has('storeA:gender')).toBe(false)
    expect(cache.has('storeA:status')).toBe(false)
    expect(cache.has('storeB:gender')).toBe(true)
  })
})
