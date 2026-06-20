// eslint-disable require-await -- async 保留以满足 DictAdapter 接口 Promise 返回类型
/**
 * dicts4 仓库自定义适配器（约定路径自动发现）。
 * 返回硬编码数据（【源4】前缀），用于验证自定义适配器 + lazy: false（立即版本检查）。
 */
export default defineDictAdapter({
  /**
   * 返回硬编码字典数据，不发起网络请求。
   * @param _storeName - 仓库名（未使用）
   * @param options - 包含 types 和 locale
   * @returns 符合 DictResponse 格式的字典数据
   */
  async fetchDict(_storeName, { types: _types, locale }) {
    return {
      data: {
        gender: {
          type: 'gender',
          items: [
            { value: 'male', label: locale === 'en-US' ? '【S4】Male' : '【源4】男' },
            { value: 'female', label: locale === 'en-US' ? '【S4】Female' : '【源4】女' },
            { value: 'other', label: locale === 'en-US' ? '【S4】Other' : '【源4】其他' },
          ],
        },
        status: {
          type: 'status',
          items: [
            { value: 1, label: '【源4】启用', color: '#67C23A' },
            { value: 0, label: '【源4】禁用', color: '#F56C6C' },
          ],
        },
      },
    };
  },

  /**
   * 返回硬编码版本号。
   * @param _storeName - 仓库名（未使用）
   * @returns 版本号字符串
   */
  async fetchVersion(_storeName) {
    return '4.0.0';
  },
});
