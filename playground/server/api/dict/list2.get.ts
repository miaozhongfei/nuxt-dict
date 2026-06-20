export default defineEventHandler((event) => {
  const query = getQuery(event);
  const locale = (query.lang as string) || 'zh-CN';
  const isEn = locale === 'en-US' || locale === 'en';

  // 二号数据源返回完全不同的数据——可一眼区分来源
  return {
    version: '2.0.0',
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
          { value: 0, label: isEn ? '【S2】Disabled' : '【源2】禁用', color: '#FF0000' },
          { value: 1, label: isEn ? '【S2】Enabled' : '【源2】启用', color: '#00FF00' },
        ],
      },
    },
  };
});
