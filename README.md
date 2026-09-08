# 🚀 Smart Approval Admin

> 让审批流程像搭积木一样简单 —— 配置驱动的智能审批管理系统

<p align="center">
  <img src="https://img.shields.io/badge/React-19-61DAFB?logo=react" />
  <img src="https://img.shields.io/badge/TypeScript-6.0-3178C6?logo=typescript" />
  <img src="https://img.shields.io/badge/XState-5-2C6EE0?logo=xstate" />
  <img src="https://img.shields.io/badge/Tailwind-4-06B6D4?logo=tailwindcss" />
  <img src="https://img.shields.io/badge/Vite-8-646CFF?logo=vite" />
</p>

---

## ✨ 项目简介

Smart Approval Admin 是一个 **配置驱动** 的企业级审批管理系统。通过声明式配置定义审批流程、表单字段和条件分支，**新增审批类型零代码修改**，只需添加一个配置对象即可上线全新流程。

### 💡 介绍语

> **"审批流程不该写死在代码里。"**
>
> 传统审批系统的痛点：每加一种审批类型就要改一堆组件、状态机、表单逻辑。Smart Approval Admin 把这一切抽象成配置——请假、报销、采购、通用……业务方自己定义流程规则，系统自动生成状态机和表单，开发只需专注基础设施。
>
> 搭配 AI 智能填表和异常行为检测，让审批不只是"走流程"，而是真正智能的企业管理工具。

---

## 🖼️ 功能预览

| 功能模块 | 说明 |
|---------|------|
| 🔐 多角色登录 | 员工 / 经理 / HR / 财务，四种角色隔离 |
| 📝 智能创建审批 | AI 自然语言填表，配置驱动表单渲染 |
| 📊 审批列表 | 万级数据虚拟滚动，Tab 分类筛选 |
| 🔄 审批详情 | 配置驱动进度条，状态机实时流转 |
| 🤖 AI 助手 | DeepSeek + MCP 集成，智能辅助决策 |
| ⚠️ 异常检测 | 2σ 原则 + 连续驳回检测，自动预警 |

---

## 🏗️ 技术架构

```
┌─────────────────────────────────────────────────────┐
│                    Frontend                          │
│  React 19 + TypeScript + Vite + TailwindCSS 4       │
├─────────────────────────────────────────────────────┤
│                    状态管理                           │
│  XState 5 (配置驱动状态机) + Zustand (全局状态)       │
├─────────────────────────────────────────────────────┤
│                    核心能力                           │
│  machineFactory (动态状态机生成)                      │
│  approvalFlowRegistry (流程配置注册表)                │
│  anomalyDetection (异常检测引擎)                      │
├─────────────────────────────────────────────────────┤
│                    AI 集成                            │
│  DeepSeek API + MCP (Model Context Protocol)        │
└─────────────────────────────────────────────────────┘
```

---

## 🎯 核心特性

### 📦 配置驱动的状态机

```typescript
// 只需添加一个配置对象，即可新增审批流程
export const leaveFlowConfig: ApprovalFlowConfig = {
  flowType: 'leave',
  label: '请假审批',
  steps: [...],        // 审批节点定义
  guards: [...],       // 条件分支规则
  formFields: [...],   // 表单字段配置
  contextMapping: [...], // 上下文映射
}

// 注册即生效
registerFlow(leaveFlowConfig)
```

### 🤖 AI 智能填表

输入自然语言，AI 自动识别审批类型并填充表单：

```
"帮我请三天假，下周三到周五，年假"
→ 自动选择：请假审批
→ 自动填写：请假类型=年假，开始日期=下周三，结束日期=下周五，天数=3
```

### ⚠️ 智能异常检测

- **2σ 原则**：检测各部门请假率异常波动
- **连续驳回检测**：同一审批人连续驳回 ≥3 次自动预警

---

## 🚀 快速开始

### 环境要求

- Node.js ≥ 18
- pnpm (推荐)

### 安装运行

```bash
# 克隆项目
git clone https://github.com/WHITE12232132/approval-admin.git
cd approval-admin

# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev
```

### 测试账号

| 账号 | 密码 | 角色 |
|------|------|------|
| admin | 123456 | 员工 |
| manager | 123456 | 经理 |
| hr | 123456 | HR |
| finance | 123456 | 财务 |

---

## 📁 项目结构

```
src/
├── components/
│   ├── ProtectedRoute.tsx    # 路由守卫
│   └── ui/                   # UI 组件库
├── hooks/
│   ├── useAIFill.ts          # AI 智能填表 Hook
│   └── useAnomalyDetection.ts # 异常检测 Hook
├── layouts/
│   └── DashboardLayout/      # 布局组件
├── pages/
│   ├── login/                # 登录页
│   ├── dashboard/            # 仪表盘
│   └── approval/
│       ├── list/             # 审批列表（虚拟滚动）
│       ├── create/           # 创建审批（配置驱动表单）
│       └── detail/           # 审批详情（配置驱动进度条）
├── store/
│   ├── types.ts              # 流程配置类型定义
│   ├── machineFactory.ts     # 状态机工厂
│   ├── approvalMachine.ts    # 兼容入口
│   └── userStore.ts          # 用户状态（持久化）
├── utils/
│   └── anomalyDetection.ts   # 异常检测算法
├── mock/
│   └── approvals.ts          # Mock 审批数据
└── api/
    └── deepseek.ts           # DeepSeek API 集成

server/
└── index.ts                  # Express 后端（MCP 集成）

mcp-server/
└── ...                       # MCP Server 实现
```

---

## 🔧 技术栈

| 类别 | 技术 | 用途 |
|------|------|------|
| 框架 | React 19 | UI 渲染 |
| 语言 | TypeScript 6.0 | 类型安全 |
| 构建 | Vite 8 | 开发/构建 |
| 样式 | TailwindCSS 4 | 原子化 CSS |
| 状态机 | XState 5 | 审批流程状态管理 |
| 状态管理 | Zustand 5 | 全局状态 |
| 路由 | React Router 7 | 页面路由 |
| 虚拟滚动 | TanStack Virtual | 万级数据渲染 |
| AI | DeepSeek + MCP | 智能填表 |
| 后端 | Express | API 服务 |

---

## 🌐 在线体验

🔗 [点击访问 Demo](https://approval-admin.vercel.app) *(Vercel 部署，仅支持前端功能)*

> ⚠️ AI 功能需要后端服务支持，Vercel 部署版本暂不可用

---

## 📌 路线图

- [ ] 审批流程可视化设计器
- [ ] WebSocket 实时通知
- [ ] 审批历史记录与统计
- [ ] 多语言支持 (i18n)
- [ ] 暗黑主题
- [ ] 移动端适配

---

## 📄 License

MIT © [beaster431](https://github.com/WHITE12232132)
