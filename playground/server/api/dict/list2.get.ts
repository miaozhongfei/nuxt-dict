export default defineEventHandler(() => {
  // 二号数据源返回完全不同的数据——可一眼区分来源
  return {
    version: '2.0.0',
    data: {
      gender: {
        type: 'gender',
        items: [
          { value: 'male', label: '【源2】男' },
          { value: 'female', label: '【源2】女' },
          { value: 'other', label: '【源2】其他' },
        ],
      },
      status: {
        type: 'status',
        items: [
          { value: 0, label: '【源2】禁用', color: '#FF0000' },
          { value: 1, label: '【源2】启用', color: '#00FF00' },
        ],
      },
    },
  };
});
