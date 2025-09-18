# feishu-bot-notify

基于 [tsdown](https://tsdown.dev/) 打包构建的飞书机器人通知工具，便于在组件发布场景下快速发送富文本更新通知。

## 功能特点

- 🧾 **更新列表渲染**：传入字符串数组即可生成 Markdown 项目符号列表。
- 🚀 **一键推送**：封装 webhook 请求及超时处理，直接调用即可完成通知。
- 🌐 **网络兼容**：基于 [`ofetch`](https://github.com/unjs/ofetch) 自动适配 Node 16+、Node 18+ 的网络实现。
- 📦 **类型完备**：导出 TypeScript 类型定义，方便在业务代码中安全使用。

## 快速开始

> 依赖 Node.js 16 及以上版本。Node 18+ 将使用内置 `fetch`，更低版本由 `ofetch` 自动回退至适合的实现。

1. 安装依赖

   ```bash
   pnpm install
   # 或 npm install / yarn install / bun install
   ```

2. 编译打包（使用 tsdown）

   ```bash
   pnpm build
   ```

3. 配置环境变量并运行示例脚本

   ```bash
   export FEISHU_WEBHOOK="https://open.feishu.cn/open-apis/bot/v2/hook/xxxx"
   pnpm ts-node examples/send-demo.ts
   # 或者使用内置脚本打包后执行
   pnpm build && FEISHU_WEBHOOK=... pnpm notify
   ```

## 代码规范

- 执行 ESLint 检查：

  ```bash
  pnpm lint
  pnpm lint:fix # 自动修复
  ```

- 执行 Prettier 格式化：

  ```bash
  pnpm format
  ```

项目采用 `@sxzz/eslint-config` 与 `@sxzz/prettier-config` 统一风格，`eslint.config.js` 与 `prettier.config.js` 已在根目录预置。

## 核心 API

```ts
import {
  createComponentUpdateCard,
  sendComponentUpdateNotification,
  type ComponentUpdateCardOptions
} from 'feishu-bot-notify'

const card = createComponentUpdateCard({
  componentName: '@one-public/icons',
  version: '0.0.1',
  changes: ['新增 20+ 图标及优化使用体验。'],
  buttonUrl: 'https://icons-playground.vercel.app/'
})

await sendComponentUpdateNotification({
  webhookUrl: process.env.FEISHU_WEBHOOK!,
  ...cardOptions
})
```

## 项目结构

```
feishu-bot-notify/
├── examples/
│   └── send-demo.ts         # 示例脚本，演示如何调用通知函数
├── src/
│   ├── card.ts              # 卡片构建逻辑
│   ├── index.ts             # 对外导出入口
│   └── sender.ts            # webhook 请求封装（基于 ofetch 的网络实现）
├── eslint.config.js         # 基于 @sxzz/eslint-config 的 ESLint Flat 配置
├── prettier.config.js       # 基于 @sxzz/prettier-config 的 Prettier 配置
├── .prettierignore
├── package.json
├── tsconfig.json
├── tsdown.config.ts
└── README.md
```

## tsdown 配置要点

- `tsdown.config.ts` 中开启 `dts: true` 以生成类型声明，并通过 `external: ['ofetch']` 保持依赖外部化。
- 默认输出格式为 `ESM`，`package.json` 指向 `dist/index.mjs`。
- `tsconfig.json` 启用 `isolatedDeclarations`，以获得更快的声明文件生成速度。

更多参数可参考官方文档：

- [Getting Started](https://github.com/rolldown/tsdown/blob/main/docs/guide/getting-started.md)
- [Options - dts](https://github.com/rolldown/tsdown/blob/main/docs/options/dts.md)
- [Reference - clean](https://github.com/rolldown/tsdown/blob/main/docs/reference/config-options.md)

## 后续扩展建议

- 将卡片内容抽象成可配置模板，支持不同的业务场景。
- 对接 CI/CD 流程，在发布完成后自动调用该工具推送通知。
- 增加重试与日志功能，提升对飞书接口故障的容错能力。
