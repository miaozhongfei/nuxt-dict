/**
 * @description 模拟字典列表接口
 * 生产环境可替换为 Java 后端或第三方接口：
 *   只需将 nuxt.config.ts 中 dict.api.baseURL 改为实际地址即可
 *   例如: baseURL: 'https://your-java-backend.com'
 */
export default defineEventHandler(() => {
  return {
    data: {
      gender: [
        { value: 'male', label: '男' },
        { value: 'female', label: '女' },
        { value: 'other', label: '其他' },
      ],
      status: [
        { value: 1, label: '启用', color: '#67C23A' },
        { value: 0, label: '禁用', color: '#F56C6C' },
      ],
    },
  };
});
