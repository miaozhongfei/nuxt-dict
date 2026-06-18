/**
 * @description 模拟字典列表接口，支持语言参数
 * 生产环境可替换为 Java 后端或第三方接口：
 *   只需将 nuxt.config.ts 中 dict.api.baseURL 改为实际地址即可
 *   例如: baseURL: 'https://your-java-backend.com'
 */
// eslint-disable-next-line max-lines-per-function
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
          label: locale === 'en-US' || locale === 'en' ? 'Beijing' : '北京',
          children: [
            {
              value: '110101',
              label: locale === 'en-US' || locale === 'en' ? 'Dongcheng' : '东城区',
            },
            {
              value: '110102',
              label: locale === 'en-US' || locale === 'en' ? 'Xicheng' : '西城区',
            },
            {
              value: '110105',
              label: locale === 'en-US' || locale === 'en' ? 'Chaoyang' : '朝阳区',
            },
            {
              value: '110108',
              label: locale === 'en-US' || locale === 'en' ? 'Haidian' : '海淀区',
            },
          ],
        },
        {
          value: '310000',
          label: locale === 'en-US' || locale === 'en' ? 'Shanghai' : '上海',
          children: [
            {
              value: '310101',
              label: locale === 'en-US' || locale === 'en' ? 'Huangpu' : '黄浦区',
            },
            { value: '310104', label: locale === 'en-US' || locale === 'en' ? 'Xuhui' : '徐汇区' },
            {
              value: '310115',
              label: locale === 'en-US' || locale === 'en' ? 'Pudong' : '浦东新区',
            },
          ],
        },
        {
          value: '440000',
          label: locale === 'en-US' || locale === 'en' ? 'Guangdong' : '广东',
          children: [
            {
              value: '440100',
              label: locale === 'en-US' || locale === 'en' ? 'Guangzhou' : '广州',
              children: [
                {
                  value: '440103',
                  label: locale === 'en-US' || locale === 'en' ? 'Liwan' : '荔湾区',
                },
                {
                  value: '440104',
                  label: locale === 'en-US' || locale === 'en' ? 'Yuexiu' : '越秀区',
                },
                {
                  value: '440106',
                  label: locale === 'en-US' || locale === 'en' ? 'Tianhe' : '天河区',
                },
              ],
            },
            {
              value: '440300',
              label: locale === 'en-US' || locale === 'en' ? 'Shenzhen' : '深圳',
              children: [
                {
                  value: '440303',
                  label: locale === 'en-US' || locale === 'en' ? 'Luohu' : '罗湖区',
                },
                {
                  value: '440304',
                  label: locale === 'en-US' || locale === 'en' ? 'Futian' : '福田区',
                },
                {
                  value: '440305',
                  label: locale === 'en-US' || locale === 'en' ? 'Nanshan' : '南山区',
                },
              ],
            },
          ],
        },
      ],
    },
  };

  // gender — 扁平字典
  // eslint-disable-next-line unicorn/no-immediate-mutation
  base.gender = {
    type: 'gender',
    items: [
      { value: 'male', label: locale === 'en-US' || locale === 'en' ? 'Male' : '男' },
      { value: 'female', label: locale === 'en-US' || locale === 'en' ? 'Female' : '女' },
      { value: 'other', label: locale === 'en-US' || locale === 'en' ? 'Other' : '其他' },
    ],
  };

  // status — 扁平字典，含扩展字段 color
  base.status = {
    type: 'status',
    items: [
      {
        value: 1,
        label: locale === 'en-US' || locale === 'en' ? 'Enabled' : '启用',
        color: '#67C23A',
      },
      {
        value: 0,
        label: locale === 'en-US' || locale === 'en' ? 'Disabled' : '禁用',
        color: '#F56C6C',
      },
      {
        value: 2,
        label: locale === 'en-US' || locale === 'en' ? 'Pending' : '待审核',
        color: '#E6A23C',
      },
    ],
  };

  // industry — 扁平字典，含扩展字段 color
  base.industry = {
    type: 'industry',
    items: [
      {
        value: 'it',
        label: locale === 'en-US' || locale === 'en' ? 'IT' : '互联网/IT',
        color: '#409EFF',
      },
      {
        value: 'finance',
        label: locale === 'en-US' || locale === 'en' ? 'Finance' : '金融',
        color: '#E6A23C',
      },
      {
        value: 'edu',
        label: locale === 'en-US' || locale === 'en' ? 'Education' : '教育',
        color: '#67C23A',
      },
      {
        value: 'health',
        label: locale === 'en-US' || locale === 'en' ? 'Healthcare' : '医疗',
        color: '#F56C6C',
      },
      {
        value: 'manufacture',
        label: locale === 'en-US' || locale === 'en' ? 'Manufacturing' : '制造业',
        color: '#909399',
      },
      {
        value: 'retail',
        label: locale === 'en-US' || locale === 'en' ? 'Retail' : '零售',
        color: '#E040FB',
      },
    ],
  };

  return { data: base };
});
