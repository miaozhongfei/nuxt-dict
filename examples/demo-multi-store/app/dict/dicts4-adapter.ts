// eslint-disable require-await -- async 保留以满足 DictAdapter 接口 Promise 返回类型
/**
 * dicts4 仓库自定义适配器（约定路径自动发现，lazy: false 立即版本检查）。
 * 返回 3 个字典类型：gender(【源4】)、paymentStatus(支付状态)、orderType(订单类型)。
 * 支持多语言。
 */
export default defineDictAdapter({
  /**
   * 返回硬编码字典数据。
   * @param _storeName - 仓库名（未使用）
   * @param options - 包含 types 和 locale
   * @returns 符合 DictResponse 格式的字典数据
   */
  async fetchDict(_storeName, { types: _types, locale }) {
    const isEn = locale === 'en-US' || locale === 'en';
    return {
      data: {
        gender: {
          type: 'gender',
          items: [
            { value: 'male', label: isEn ? '【S4】Male' : '【源4】男' },
            { value: 'female', label: isEn ? '【S4】Female' : '【源4】女' },
            { value: 'other', label: isEn ? '【S4】Other' : '【源4】其他' },
          ],
        },
        paymentStatus: {
          type: 'paymentStatus',
          items: [
            { value: 'pending', label: isEn ? '【S4】Pending' : '【源4】待支付', color: '#FF9900' },
            { value: 'paid', label: isEn ? '【S4】Paid' : '【源4】已支付', color: '#00CC66' },
            { value: 'refunded', label: isEn ? '【S4】Refunded' : '【源4】已退款', color: '#CC3333' },
          ],
        },
        orderType: {
          type: 'orderType',
          items: [
            { value: 'normal', label: isEn ? '【S4】Normal' : '【源4】普通', color: '#409EFF' },
            { value: 'urgent', label: isEn ? '【S4】Urgent' : '【源4】加急', color: '#FF4444' },
            { value: 'special', label: isEn ? '【S4】Special' : '【源4】特殊', color: '#9933FF' },
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
