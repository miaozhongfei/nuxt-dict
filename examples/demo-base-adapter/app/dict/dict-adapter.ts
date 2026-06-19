import { defineDictAdapter } from '@lacqjs/nuxt-dict/runtime/utils/define-adapter';

/** 应用基础路径，需与 nuxt.config.ts 中的 app.baseURL 保持一致 */
const APP_BASEURL = '/demo-base-adapter/';

/** 字段映射：第三方接口返回 code，模块期望 value */
const mapItem = ({ code, ...rest }: any) => ({ value: code, ...rest });
/** 递归映射树节点的 code → value */
const mapTree = (node: any): any => ({
  ...mapItem(node),
  ...(node.children ? { children: node.children.map(mapTree) } : {}),
});

/**
 * 自定义 GraphQL 字典适配器。
 * 演示如何对接返回 code 字段的 GraphQL 接口，并将字段映射为模块标准格式（code → value）。
 * 版本号从独立的 version 接口获取。
 *
 * 约定路径：本文件位于 ~/dict/dict-adapter.ts，模块自动发现，无需在 nuxt.config.ts 中显式配置。
 */
export default defineDictAdapter({
  /**
   * 从 GraphQL 接口获取字典数据，并将接口字段映射为模块标准格式。
   * @param _storeName - 仓库名（本示例未使用）
   * @param options - 包含 types（字典类型列表）和 locale（语言标识）
   * @returns 符合 DictResponse 格式的字典数据
   */
  async fetchDict(_storeName, { types, locale }) {
    // 构造 GraphQL 查询
    const query = `{ dict(types: [${types.map((t) => `"${t}"`)}], locale: "${locale}") { data { type items { code label color } tree { code label children { code label children { code label } } } } } }`;
    const res = await fetch(`${APP_BASEURL}api/dict/list2`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query }),
    });
    const result = await res.json();
    // 解包 GraphQL 响应：data.dict.data → DictEntry[]
    const entries = result.data.dict.data;

    // 从 version 接口获取版本号
    const versionRes = await fetch(`${APP_BASEURL}api/dict/version`);
    const { version } = await versionRes.json();

    // 数组 → Record<string, DictEntry>，以 type 为 key
    const data: Record<string, any> = {};
    for (const entry of entries) {
      data[entry.type] = {
        type: entry.type,
        items: entry.items?.map(mapItem) ?? [],
        ...(entry.tree ? { tree: entry.tree.map(mapTree) } : {}),
      };
    }

    return { version, data };
  },

  /**
   * 获取字典版本号，用于缓存失效判断。
   * @param _storeName - 仓库名（本示例未使用）
   * @returns 版本号字符串
   */
  async fetchVersion(_storeName) {
    const res = await fetch(`${APP_BASEURL}api/dict/version`);
    return (await res.json()).version;
  },
});
