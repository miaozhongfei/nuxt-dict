/**
 * @description 模拟版本号接口
 * 用于缓存失效判断，生产环境可替换为 Java 后端真实版本号
 */
export default defineEventHandler(() => {
  return { version: '1.0.0' };
});
