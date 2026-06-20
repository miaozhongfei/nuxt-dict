// eslint-disable require-await -- async 保留以满足 DictAdapter 接口 Promise 返回类型
/**
 * dicts5 仓库自定义适配器（约定路径自动发现）。
 * 返回硬编码数据（【源5】前缀），用于验证自定义适配器 + lazy: true（惰性版本检查）。
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
        status: {
          type: 'status',
          items: [
            { value: 'pending', label: locale === 'en-US' ? '【S5】Pending' : '【源5】待支付' },
            { value: 'paid', label: locale === 'en-US' ? '【S5】Paid' : '【源5】已支付' },
            { value: 'refunded', label: locale === 'en-US' ? '【S5】Refunded' : '【源5】已退款' },
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
    return '5.0.0';
  },
});
