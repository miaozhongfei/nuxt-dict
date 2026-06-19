/**
 * @description 模拟 GraphQL 字典列表接口（POST），支持语言参数
 * 接收 GraphQL 风格的请求体 { query: "..." }，从中提取 locale 参数。
 * 响应格式为 GraphQL 信封：{ data: { dict: { data: [...] } } }
 * 注意：此 mock 使用 code 字段而非 value，适配器需自行转换。
 */
// eslint-disable-next-line max-lines-per-function
export default defineEventHandler(async (event) => {
  // 从 POST 请求体中读取 GraphQL 查询
  const body = await readBody(event);
  // 用正则从 GraphQL query 字符串中提取 locale 参数
  const localeMatch = body?.query?.match(/locale:\s*"([^"]+)"/u);
  const locale = localeMatch?.[1] || 'zh-CN';

  const base: Record<string, any> = {
    region: {
      type: 'region',
      items: [],
      tree: [
        {
          code: '110000',
          label: locale === 'en-US' || locale === 'en' ? 'Beijing' : '北京',
          children: [
            {
              code: '110101',
              label: locale === 'en-US' || locale === 'en' ? 'Dongcheng' : '东城区',
            },
            {
              code: '110102',
              label: locale === 'en-US' || locale === 'en' ? 'Xicheng' : '西城区',
            },
            {
              code: '110105',
              label: locale === 'en-US' || locale === 'en' ? 'Chaoyang' : '朝阳区',
            },
            {
              code: '110108',
              label: locale === 'en-US' || locale === 'en' ? 'Haidian' : '海淀区',
            },
          ],
        },
        {
          code: '310000',
          label: locale === 'en-US' || locale === 'en' ? 'Shanghai' : '上海',
          children: [
            {
              code: '310101',
              label: locale === 'en-US' || locale === 'en' ? 'Huangpu' : '黄浦区',
            },
            { code: '310104', label: locale === 'en-US' || locale === 'en' ? 'Xuhui' : '徐汇区' },
            {
              code: '310115',
              label: locale === 'en-US' || locale === 'en' ? 'Pudong' : '浦东新区',
            },
          ],
        },
        {
          code: '440000',
          label: locale === 'en-US' || locale === 'en' ? 'Guangdong' : '广东',
          children: [
            {
              code: '440100',
              label: locale === 'en-US' || locale === 'en' ? 'Guangzhou' : '广州',
              children: [
                {
                  code: '440103',
                  label: locale === 'en-US' || locale === 'en' ? 'Liwan' : '荔湾区',
                },
                {
                  code: '440104',
                  label: locale === 'en-US' || locale === 'en' ? 'Yuexiu' : '越秀区',
                },
                {
                  code: '440106',
                  label: locale === 'en-US' || locale === 'en' ? 'Tianhe' : '天河区',
                },
              ],
            },
            {
              code: '440300',
              label: locale === 'en-US' || locale === 'en' ? 'Shenzhen' : '深圳',
              children: [
                {
                  code: '440303',
                  label: locale === 'en-US' || locale === 'en' ? 'Luohu' : '罗湖区',
                },
                {
                  code: '440304',
                  label: locale === 'en-US' || locale === 'en' ? 'Futian' : '福田区',
                },
                {
                  code: '440305',
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
      { code: 'male', label: locale === 'en-US' || locale === 'en' ? 'Male' : '男' },
      { code: 'female', label: locale === 'en-US' || locale === 'en' ? 'Female' : '女' },
      { code: 'other', label: locale === 'en-US' || locale === 'en' ? 'Other' : '其他' },
    ],
  };

  // status — 扁平字典，含扩展字段 color
  base.status = {
    type: 'status',
    items: [
      {
        code: 1,
        label: locale === 'en-US' || locale === 'en' ? 'Enabled' : '启用',
        color: '#67C23A',
      },
      {
        code: 0,
        label: locale === 'en-US' || locale === 'en' ? 'Disabled' : '禁用',
        color: '#F56C6C',
      },
      {
        code: 2,
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
        code: 'it',
        label: locale === 'en-US' || locale === 'en' ? 'IT' : '互联网/IT',
        color: '#409EFF',
      },
      {
        code: 'finance',
        label: locale === 'en-US' || locale === 'en' ? 'Finance' : '金融',
        color: '#E6A23C',
      },
      {
        code: 'edu',
        label: locale === 'en-US' || locale === 'en' ? 'Education' : '教育',
        color: '#67C23A',
      },
      {
        code: 'health',
        label: locale === 'en-US' || locale === 'en' ? 'Healthcare' : '医疗',
        color: '#F56C6C',
      },
      {
        code: 'manufacture',
        label: locale === 'en-US' || locale === 'en' ? 'Manufacturing' : '制造业',
        color: '#909399',
      },
      {
        code: 'retail',
        label: locale === 'en-US' || locale === 'en' ? 'Retail' : '零售',
        color: '#E040FB',
      },
    ],
  };

  // 返回 GraphQL 信封格式，data 为数组（模拟真实 GraphQL 接口）
  return { data: { dict: { data: Object.values(base) } } };
});
