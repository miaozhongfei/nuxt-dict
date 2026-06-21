// eslint-disable require-await -- async 保留以满足 DictAdapter 接口 Promise 返回类型
/**
 * dicts5 仓库自定义适配器（约定路径自动发现，lazy: true 惰性版本检查）。
 * 返回 3 个字典类型：currency(货币)、logistics(物流)、warehouse(仓库)。
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
        currency: {
          type: 'currency',
          items: [
            { value: 'cny', label: isEn ? '【S5】CNY' : '【源5】人民币', symbol: '¥' },
            { value: 'usd', label: isEn ? '【S5】USD' : '【源5】美元', symbol: '$' },
            { value: 'eur', label: isEn ? '【S5】EUR' : '【源5】欧元', symbol: '€' },
          ],
        },
        logistics: {
          type: 'logistics',
          items: [
            { value: 'sf', label: isEn ? '【S5】SF Express' : '【源5】顺丰', color: '#FF6600' },
            { value: 'zt', label: isEn ? '【S5】ZTO' : '【源5】中通', color: '#0066FF' },
            { value: 'yt', label: isEn ? '【S5】YTO' : '【源5】圆通', color: '#FF0000' },
          ],
        },
        warehouse: {
          type: 'warehouse',
          items: [
            { value: 'east', label: isEn ? '【S5】East' : '【源5】华东仓', region: '上海' },
            { value: 'south', label: isEn ? '【S5】South' : '【源5】华南仓', region: '广州' },
            { value: 'north', label: isEn ? '【S5】North' : '【源5】华北仓', region: '北京' },
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
