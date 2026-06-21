/**
 * @description 二号数据源 REST 端点（GET），供 dicts2/dicts3 仓库使用
 * 返回 3 个字典类型：gender(【源2】)、status(【源2】)、priority
 * 支持 ?lang=zh-CN|en-US 多语言
 */
export default defineEventHandler((event) => {
  const query = getQuery(event);
  const locale = (query.lang as string) || 'zh-CN';
  const isEn = locale === 'en-US' || locale === 'en';

  return {
    data: {
      gender: {
        type: 'gender',
        items: [
          { value: 'male', label: isEn ? '【S2】Male' : '【源2】男' },
          { value: 'female', label: isEn ? '【S2】Female' : '【源2】女' },
          { value: 'other', label: isEn ? '【S2】Other' : '【源2】其他' },
        ],
      },
      status: {
        type: 'status',
        items: [
          { value: 1, label: isEn ? '【S2】Enabled' : '【源2】启用', color: '#00CC66' },
          { value: 0, label: isEn ? '【S2】Disabled' : '【源2】禁用', color: '#CC3333' },
          { value: 2, label: isEn ? '【S2】Pending' : '【源2】待审核', color: '#FF9900' },
        ],
      },
      priority: {
        type: 'priority',
        items: [
          { value: 'high', label: isEn ? '【S2】High' : '【源2】高', color: '#FF4444' },
          { value: 'medium', label: isEn ? '【S2】Medium' : '【源2】中', color: '#FFAA00' },
          { value: 'low', label: isEn ? '【S2】Low' : '【源2】低', color: '#44BB44' },
        ],
      },
    },
  };
});
