<template>
  <div>
    <h1>作用域对比</h1>
    <p>
      nuxt-dict 提供两类 API：<code>useDict</code> / <code>useDictTree</code>（组件级响应式）和
      <code>$dict</code>（全局同步非响应式）。
    </p>

    <!-- useDict -->
    <div class="demo-card">
      <div class="demo-card__header">
        <span class="demo-card__badge">useDict / useDictTree</span>
        <span style="color: #6b7280; font-size: 0.85rem">— 组件级，响应式</span>
      </div>
      <p class="demo-card__desc">
        在 <code>&lt;script setup&gt;</code> 中调用，组件
        <code>onMounted</code> 时自动加载数据。返回 <code>shallowRef</code>， Vue
        响应式系统可追踪，数据变化时模板自动重渲染。
      </p>
      <ul>
        <li><b>作用域</b>：组件内部，每个 <code>useDict('gender')</code> 独立管理</li>
        <li><b>响应式</b>：是，<code>data</code> 变化时模板自动更新</li>
        <li><b>加载时机</b>：组件挂载时自动触发，切换语言时自动重载</li>
        <li><b>适合场景</b>：模板绑定（select 选项、列表渲染、树形展示）</li>
        <li>
          <b>返回值</b
          >：<code>data</code>（ShallowRef）、<code>translate</code>（同步翻译函数）、<code>loading</code>、<code>error</code>、<code
            >refresh</code
          >
        </li>
      </ul>
    </div>

    <!-- $dict -->
    <div class="demo-card">
      <div class="demo-card__header">
        <span class="demo-card__badge">$dict</span>
        <span style="color: #6b7280; font-size: 0.85rem">— 全局级，同步非响应式</span>
      </div>
      <p class="demo-card__desc">
        通过 Nuxt 插件注入到全局，直接读取管理器的内存缓存。不产生 Vue 响应式依赖，适合在
        <code>computed</code>、表格 formatter 等不适合产生副作用的位置使用。
      </p>
      <ul>
        <li><b>作用域</b>：全局，所有组件共享同一个实例</li>
        <li><b>响应式</b>：否，不触发组件重渲染</li>
        <li>
          <b>加载时机</b>：不需要挂载，缓存命中则同步返回，未命中返回 <code>String(code)</code>
        </li>
        <li><b>适合场景</b>：computed 计算属性、el-table formatter、任何 JS 逻辑</li>
        <li><b>前提</b>：需先通过 <code>useDict</code> 加载数据到缓存</li>
      </ul>
    </div>

    <!-- 对比表 -->
    <div class="demo-card">
      <div class="demo-card__header">
        <span class="demo-card__badge">对比表格</span>
        <span style="color: #6b7280; font-size: 0.85rem">— 一览区别</span>
      </div>

      <table class="demo-table">
        <thead>
          <tr>
            <th>特性</th>
            <th>useDict / useDictTree</th>
            <th>$dict</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><b>作用域</b></td>
            <td>组件内部</td>
            <td>全局</td>
          </tr>
          <tr>
            <td><b>响应式</b></td>
            <td>✅ 数据变化触发重渲染</td>
            <td>❌ 不触发重渲染</td>
          </tr>
          <tr>
            <td><b>调用位置</b></td>
            <td><code>&lt;script setup&gt;</code> 顶层</td>
            <td>任意位置（模板/computed/JS）</td>
          </tr>
          <tr>
            <td><b>加载方式</b></td>
            <td>挂载后自动请求</td>
            <td>读取已有缓存</td>
          </tr>
          <tr>
            <td><b>模板绑定</b></td>
            <td>✅ 适合</td>
            <td>⚠️ 不推荐（静态快照）</td>
          </tr>
          <tr>
            <td><b>computed 中使用</b></td>
            <td>✅ translate 可放 computed</td>
            <td>✅ 天然适合</td>
          </tr>
          <tr>
            <td><b>表格 formatter</b></td>
            <td>⚠️ 需配合 el-table slot</td>
            <td>✅ 最佳选择</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
