export default defineEventHandler(() => {
  // 二号数据源返回完全不同的数据——可一眼区分来源
  return {
    version: '2.0.0',
    data: {
      gender: {
        type: 'gender',
        items: [
          { code: 'male', label: '【源2】男' },
          { code: 'female', label: '【源2】女' },
          { code: 'other', label: '【源2】其他' },
        ],
      },
      status: {
        type: 'status',
        items: [
          { code: 0, label: '【源2】禁用', color: '#FF0000' },
          { code: 1, label: '【源2】启用', color: '#00FF00' },
        ],
      },
    },
  }
})
