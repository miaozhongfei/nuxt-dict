export default defineEventHandler((event) => {
  const query = getQuery(event)
  const locale = (query.lang as string) || 'zh-CN'

  const base: Record<string, any> = {
    region: {
      type: 'region',
      items: [],
      tree: [
        {
          code: '110000', label: '北京',
          children: [
            { code: '110101', label: '东城区' },
            { code: '110102', label: '西城区' },
            { code: '110105', label: '朝阳区' },
            { code: '110108', label: '海淀区' },
          ],
        },
        {
          code: '310000', label: '上海',
          children: [
            { code: '310101', label: '黄浦区' },
            { code: '310104', label: '徐汇区' },
            { code: '310105', label: '长宁区' },
            { code: '310115', label: '浦东新区' },
          ],
        },
        {
          code: '440000', label: '广东',
          children: [
            { code: '440100', label: '广州', children: [
              { code: '440103', label: '荔湾区' },
              { code: '440104', label: '越秀区' },
              { code: '440106', label: '天河区' },
            ]},
            { code: '440300', label: '深圳', children: [
              { code: '440303', label: '罗湖区' },
              { code: '440304', label: '福田区' },
              { code: '440305', label: '南山区' },
            ]},
          ],
        },
        {
          code: '330000', label: '浙江',
          children: [
            { code: '330100', label: '杭州', children: [
              { code: '330102', label: '上城区' },
              { code: '330108', label: '滨江区' },
            ]},
            { code: '330200', label: '宁波', children: [
              { code: '330203', label: '海曙区' },
              { code: '330212', label: '鄞州区' },
            ]},
          ],
        },
      ],
    },
  }

  // Locale-aware data
  if (locale === 'en-US' || locale === 'en') {
    base.gender = { type: 'gender', items: [
      { code: 'male', label: 'Male' },
      { code: 'female', label: 'Female' },
      { code: 'other', label: 'Other' },
    ]}
    base.status = { type: 'status', items: [
      { code: 0, label: 'Disabled', color: '#F56C6C' },
      { code: 1, label: 'Enabled', color: '#67C23A' },
      { code: 2, label: 'Pending', color: '#E6A23C' },
      { code: 3, label: 'Deleted', color: '#909399' },
    ]}
    base.industry = { type: 'industry', items: [
      { code: 'it', label: 'Internet / IT', color: '#409EFF' },
      { code: 'finance', label: 'Finance', color: '#E6A23C' },
      { code: 'edu', label: 'Education', color: '#67C23A' },
      { code: 'health', label: 'Healthcare', color: '#F56C6C' },
      { code: 'manufacture', label: 'Manufacturing', color: '#909399' },
      { code: 'retail', label: 'Retail / E-commerce', color: '#E040FB' },
    ]}
  } else if (locale === 'ja-JP') {
    base.gender = { type: 'gender', items: [
      { code: 'male', label: '男性' },
      { code: 'female', label: '女性' },
      { code: 'other', label: 'その他' },
    ]}
    base.status = { type: 'status', items: [
      { code: 0, label: '無効', color: '#F56C6C' },
      { code: 1, label: '有効', color: '#67C23A' },
      { code: 2, label: '審査中', color: '#E6A23C' },
      { code: 3, label: '削除済', color: '#909399' },
    ]}
    base.industry = { type: 'industry', items: [
      { code: 'it', label: 'インターネット/IT', color: '#409EFF' },
      { code: 'finance', label: '金融', color: '#E6A23C' },
      { code: 'edu', label: '教育', color: '#67C23A' },
      { code: 'health', label: '医療', color: '#F56C6C' },
      { code: 'manufacture', label: '製造業', color: '#909399' },
      { code: 'retail', label: '小売/EC', color: '#E040FB' },
    ]}
  } else {
    // zh-CN (default)
    base.gender = { type: 'gender', items: [
      { code: 'male', label: '男' },
      { code: 'female', label: '女' },
      { code: 'other', label: '其他' },
    ]}
    base.status = { type: 'status', items: [
      { code: 0, label: '禁用', color: '#F56C6C' },
      { code: 1, label: '启用', color: '#67C23A' },
      { code: 2, label: '待审核', color: '#E6A23C' },
      { code: 3, label: '已删除', color: '#909399' },
    ]}
    base.industry = { type: 'industry', items: [
      { code: 'it', label: '互联网/IT', color: '#409EFF' },
      { code: 'finance', label: '金融', color: '#E6A23C' },
      { code: 'edu', label: '教育', color: '#67C23A' },
      { code: 'health', label: '医疗健康', color: '#F56C6C' },
      { code: 'manufacture', label: '制造业', color: '#909399' },
      { code: 'retail', label: '零售/电商', color: '#E040FB' },
    ]}
  }

  return { version: '1.0.0', data: base }
})
