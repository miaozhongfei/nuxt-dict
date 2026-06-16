export default defineEventHandler((event) => {
  const query = getQuery(event);
  const locale = (query.lang as string) || 'zh-CN';

  const base: Record<string, any> = {
    region: {
      type: 'region',
      items: [],
      tree: [
        {
          value: '110000',
          label: '北京',
          children: [
            { value: '110101', label: '东城区' },
            { value: '110102', label: '西城区' },
            { value: '110105', label: '朝阳区' },
            { value: '110108', label: '海淀区' },
          ],
        },
        {
          value: '310000',
          label: '上海',
          children: [
            { value: '310101', label: '黄浦区' },
            { value: '310104', label: '徐汇区' },
            { value: '310105', label: '长宁区' },
            { value: '310115', label: '浦东新区' },
          ],
        },
        {
          value: '440000',
          label: '广东',
          children: [
            {
              value: '440100',
              label: '广州',
              children: [
                { value: '440103', label: '荔湾区' },
                { value: '440104', label: '越秀区' },
                { value: '440106', label: '天河区' },
              ],
            },
            {
              value: '440300',
              label: '深圳',
              children: [
                { value: '440303', label: '罗湖区' },
                { value: '440304', label: '福田区' },
                { value: '440305', label: '南山区' },
              ],
            },
          ],
        },
        {
          value: '330000',
          label: '浙江',
          children: [
            {
              value: '330100',
              label: '杭州',
              children: [
                { value: '330102', label: '上城区' },
                { value: '330108', label: '滨江区' },
              ],
            },
            {
              value: '330200',
              label: '宁波',
              children: [
                { value: '330203', label: '海曙区' },
                { value: '330212', label: '鄞州区' },
              ],
            },
          ],
        },
      ],
    },
  };

  // Locale-aware data
  if (locale === 'en-US' || locale === 'en') {
    base.gender = {
      type: 'gender',
      items: [
        { value: 'male', label: 'Male' },
        { value: 'female', label: 'Female' },
        { value: 'other', label: 'Other' },
      ],
    };
    base.status = {
      type: 'status',
      items: [
        { value: 0, label: 'Disabled', color: '#F56C6C' },
        { value: 1, label: 'Enabled', color: '#67C23A' },
        { value: 2, label: 'Pending', color: '#E6A23C' },
        { value: 3, label: 'Deleted', color: '#909399' },
      ],
    };
    base.industry = {
      type: 'industry',
      items: [
        { value: 'it', label: 'Internet / IT', color: '#409EFF' },
        { value: 'finance', label: 'Finance', color: '#E6A23C' },
        { value: 'edu', label: 'Education', color: '#67C23A' },
        { value: 'health', label: 'Healthcare', color: '#F56C6C' },
        { value: 'manufacture', label: 'Manufacturing', color: '#909399' },
        { value: 'retail', label: 'Retail / E-commerce', color: '#E040FB' },
      ],
    };
  } else if (locale === 'ja-JP') {
    base.gender = {
      type: 'gender',
      items: [
        { value: 'male', label: '男性' },
        { value: 'female', label: '女性' },
        { value: 'other', label: 'その他' },
      ],
    };
    base.status = {
      type: 'status',
      items: [
        { value: 0, label: '無効', color: '#F56C6C' },
        { value: 1, label: '有効', color: '#67C23A' },
        { value: 2, label: '審査中', color: '#E6A23C' },
        { value: 3, label: '削除済', color: '#909399' },
      ],
    };
    base.industry = {
      type: 'industry',
      items: [
        { value: 'it', label: 'インターネット/IT', color: '#409EFF' },
        { value: 'finance', label: '金融', color: '#E6A23C' },
        { value: 'edu', label: '教育', color: '#67C23A' },
        { value: 'health', label: '医療', color: '#F56C6C' },
        { value: 'manufacture', label: '製造業', color: '#909399' },
        { value: 'retail', label: '小売/EC', color: '#E040FB' },
      ],
    };
  } else {
    // zh-CN (default)
    base.gender = {
      type: 'gender',
      items: [
        { value: 'male', label: '男' },
        { value: 'female', label: '女' },
        { value: 'other', label: '其他' },
      ],
    };
    base.status = {
      type: 'status',
      items: [
        { value: 0, label: '禁用', color: '#F56C6C' },
        { value: 1, label: '启用', color: '#67C23A' },
        { value: 2, label: '待审核', color: '#E6A23C' },
        { value: 3, label: '已删除', color: '#909399' },
      ],
    };
    base.industry = {
      type: 'industry',
      items: [
        { value: 'it', label: '互联网/IT', color: '#409EFF' },
        { value: 'finance', label: '金融', color: '#E6A23C' },
        { value: 'edu', label: '教育', color: '#67C23A' },
        { value: 'health', label: '医疗健康', color: '#F56C6C' },
        { value: 'manufacture', label: '制造业', color: '#909399' },
        { value: 'retail', label: '零售/电商', color: '#E040FB' },
      ],
    };
  }

  return { version: '1.0.0', data: base };
});
