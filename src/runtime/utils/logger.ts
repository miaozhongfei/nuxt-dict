import type { ConsolaInstance } from 'consola';
import { consola } from 'consola';

/** 全局 logger 单例缓存，按 tag 区分，避免重复创建 */
const globalLoggers = new Map<string, ConsolaInstance>();

/**
 * 创建带标签的 consola logger（单例模式）。
 * 同一 tag 多次调用返回同一个实例，确保日志配置一致。
 * @param tag 日志标签（模块名）
 * @param options.level 日志级别，支持数字或字符串
 */
export function createLogger(tag: string, options: { level?: number | string } = {}) {
  if (globalLoggers.has(tag)) {
    const cached = globalLoggers.get(tag)!;
    if (options.level !== undefined) {
      cached.level = resolveLogLevel(options.level);
    }
    return cached;
  }

  const logger = consola.create({}).withTag(tag);
  if (options.level !== undefined) {
    logger.level = resolveLogLevel(options.level);
  }

  globalLoggers.set(tag, logger);
  return logger;
}

/**
 * 将字符串日志级别映射为 consola 内部数值。
 * 数字直接透传，字符串查表映射。
 */
function resolveLogLevel(level: number | string): number {
  if (typeof level === 'number') return level;

  const map: Record<string, number> = {
    silent: -999,
    fatal: 0,
    error: 0,
    warn: 1,
    log: 2,
    info: 3,
    success: 3,
    debug: 4,
    trace: 5,
    verbose: 999,
  };

  return map[level.toLowerCase()] ?? 3;
}
