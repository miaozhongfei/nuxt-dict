import { Dexie } from 'dexie';

import type { DictEntry, CacheEntry } from '../../types';
import { createLogger } from '../../utils/logger';

/** 默认 IndexedDB 对象存储库名称 */
export const DEFAULT_STORE_NAME = 'dicts';

/** 日志实例（单例，由 plugin 设置 level 后全局共享） */
const logger = createLogger('nuxt-dict');

/**
 * 基于 Dexie.js 的 IndexedDB 缓存实现（多表方案）。
 *
 * @description 每个字典仓库对应一个独立的 Dexie table（IndexedDB object store），
 * 通过 init(storeNames) 在初始化时一次性声明所有表的 schema，
 * 避免原生 IndexedDB 多次版本升级导致的竞态问题。
 *
 * 数据隔离：各仓库数据物理隔离，在 DevTools Application 面板中独立可见。
 * Schema 管理：使用仓库数量作为版本号，增删仓库时自动升级。
 *
 * @example
 * const cache = new IndexedDBCache('nuxt-dict')
 * await cache.init(['dicts', 'dicts2', 'dicts3'])
 * await cache.set('dicts', 'gender', 'zh-CN', entry)
 * const result = await cache.get('dicts', 'gender', 'zh-CN')
 */
export class IndexedDBCache {
  private db: Dexie;
  private dbName: string;

  /**
   * @param {string} dbName - IndexedDB 数据库名称
   */
  constructor(dbName: string) {
    this.dbName = dbName;
    this.db = new Dexie(dbName);
  }

  /**
   * 初始化数据库，一次性声明所有仓库对应的 object store。
   *
   * @description 根据传入的仓库名列表声明 Dexie schema，每个仓库一个独立表。
   * 使用仓库数量作为版本号，增减仓库时自动触发 Dexie 的版本升级。
   * 若版本降级（删了仓库）导致 VersionError，自动删除旧库重建。
   *
   * @param {string[]} storeNames - 所有仓库名列表，如 ['dicts', 'dicts2', 'dicts3']
   * @returns {Promise<void>}
   */
  async init(storeNames: string[]): Promise<void> {
    // 构建 schema：每个仓库一个表，无索引（纯 key-value）
    const schema: Record<string, string> = {};
    for (const name of storeNames) {
      schema[name] = '';
    }
    // 版本号 = 仓库数量（增加仓库时自动升级，至少为 1）
    const version = Math.max(storeNames.length, 1);
    this.db.version(version).stores(schema);

    logger.debug(`IndexedDB init: opening "${this.dbName}", version=${version}, stores=[${storeNames.join(', ')}]`);

    try {
      await this.db.open();
    } catch (e: unknown) {
      // 版本降级（用户删了仓库导致 storeNames 变少）→ 删除旧库重建
      if (e instanceof Error && e.name === 'VersionError') {
        logger.debug(`IndexedDB init: VersionError, deleting old database and recreating`);
        this.db.close();
        await Dexie.delete(this.dbName);
        this.db = new Dexie(this.dbName);
        this.db.version(version).stores(schema);
        await this.db.open();
      } else {
        throw e;
      }
    }

    logger.debug(`IndexedDB init: complete, tables=[${this.db.tables.map(t => t.name).join(', ')}]`);
  }

  /**
   * 生成缓存键。
   * @param {string} dictType - 字典类型，如 'gender'
   * @param {string} locale - 语言标识，如 'zh-CN'
   * @returns {string} 格式 `${dictType}_${locale}`
   */
  private getStoreKey(dictType: string, locale: string): string {
    return `${dictType}_${locale}`;
  }

  /**
   * 从指定仓库读取字典缓存。
   *
   * @param {string} storeName - 仓库名，如 'dicts'
   * @param {string} dictType - 字典类型，如 'gender'
   * @param {string} locale - 语言标识，如 'zh-CN'
   * @returns {Promise<CacheEntry<DictEntry> | null>} 缓存条目，未命中返回 null
   */
  async get(
    storeName: string,
    dictType: string,
    locale: string,
  ): Promise<CacheEntry<DictEntry> | null> {
    if (!this.db.isOpen()) return null;

    // 仓库表不存在时返回 null（用户可能手动删除了 store）
    if (!this.db.tables.some(t => t.name === storeName)) return null;

    const key = this.getStoreKey(dictType, locale);
    const record = await this.db.table(storeName).get(key);
    logger.debug(`IndexedDB get: store=${storeName} key=${key} hit=${!!record}`);
    return record ?? null;
  }

  /**
   * 写入缓存条目到指定仓库。
   *
   * @param {string} storeName - 仓库名
   * @param {string} dictType - 字典类型
   * @param {string} locale - 语言标识
   * @param {CacheEntry<DictEntry>} entry - 缓存条目
   * @returns {Promise<void>}
   */
  async set(
    storeName: string,
    dictType: string,
    locale: string,
    entry: CacheEntry<DictEntry>,
  ): Promise<void> {
    if (!this.db.isOpen()) return;
    if (!this.db.tables.some(t => t.name === storeName)) return;

    const key = this.getStoreKey(dictType, locale);
    logger.debug(`IndexedDB set: store=${storeName} key=${key}`);
    await this.db.table(storeName).put(entry, key);
  }

  /**
   * 清空缓存数据。
   *
   * @param {string} [storeName] - 指定仓库名则只清该仓库，不传则清空全部
   * @returns {Promise<void>}
   */
  async clear(storeName?: string): Promise<void> {
    if (!this.db.isOpen()) return;

    if (storeName) {
      if (!this.db.tables.some(t => t.name === storeName)) return;
      logger.debug(`IndexedDB clear: store=${storeName}`);
      await this.db.table(storeName).clear();
    } else {
      logger.debug('IndexedDB clear: ALL');
      for (const table of this.db.tables) {
        await table.clear();
      }
    }
  }
}
