import type { DictAdapter } from '../../types';

/**
 * 版本检查器，使用 localStorage 存储版本号（替代 IndexedDB meta store）。
 * localStorage 同步读写、无需异步初始化，比 IndexedDB 更简单可靠。
 *
 * 逻辑：
 * 1. 调用远程版本接口 → 失败则抛出，不操作 localStorage，不清理字典
 * 2. 成功则比对 → 版本一致不操作 → 不一致时写入 localStorage、标记 changed
 */
export class VersionCheck {
  private adapter: DictAdapter;
  private storageKey: string;

  constructor(adapter: DictAdapter, storageKey: string) {
    this.adapter = adapter;
    // 防御：确保 storageKey 始终为有效字符串
    this.storageKey = typeof storageKey === 'string' ? storageKey : '__NUXT_DICT_VERSION__';
  }

  /**
   * 执行版本比对。
   * @returns changed 为 true 时调用方应执行 invalidateAll 清空全部缓存
   */
  async check(storeName: string): Promise<{ changed: boolean; version: string }> {
    // 从 localStorage 读取本地缓存的版本号
    const storedVersion = this.getStoredVersion();
    const remoteVersion = await this.adapter.fetchVersion(storeName);

    const changed = storedVersion !== remoteVersion;

    // 版本不一致时才写入 localStorage 并通知上层清空缓存
    if (changed) {
      this.setStoredVersion(remoteVersion);
    }

    return { changed, version: remoteVersion };
  }

  /** 从 localStorage 读取版本号，不可用时返回 null */
  private getStoredVersion(): string | null {
    // SSR 环境下 localStorage 不可用，跳过
    if (typeof localStorage === 'undefined') return null;
    try {
      return localStorage.getItem(this.storageKey);
    } catch {
      return null;
    }
  }

  /** 将版本号写入 localStorage */
  private setStoredVersion(version: string): void {
    if (typeof localStorage === 'undefined') return;
    try {
      localStorage.setItem(this.storageKey, version);
    } catch {
      // localStorage 写入失败静默忽略（无痕模式存储满等场景）
    }
  }
}
