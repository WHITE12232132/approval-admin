/**
 * 审批流程配置类型定义
 *
 * 设计目标：
 * 1. 业务方新增审批类型，只需在此文件追加一个 config 对象
 * 2. 状态机工厂读取 config 动态生成 XState 机器，UI 无需改动
 * 3. 审批路径通过 transitions[].guard 声明式配置，支持条件分支
 * 4. 表单字段 + 上下文映射全部配置化，create 页面零硬编码
 */

// ======================== 类型定义 ========================

/** 审批上下文 — 状态机运行时数据 */
export interface ApprovalContext {
  approvalId: string
  type: string          // 审批类型：leave / reimbursement / procurement / general
  amount: number        // 报销金额
  days: number          // 请假天数
  itemName: string      // 采购物品
  quantity: number      // 采购数量
  currentApprover: string
}

/** 审批事件 */
export type ApprovalEvent =
  | { type: 'SUBMIT' }
  | { type: 'APPROVE' }
  | { type: 'REJECT' }
  | { type: 'WITHDRAW' }

// ======================== Guard 配置 ========================

/** Guard 配置 — 条件判断规则 */
export interface GuardConfig {
  /** guard 唯一名称， transitions 中通过此名称引用 */
  name: string
  /** guard 描述（便于业务方理解） */
  description: string
  /** 判断函数：返回 true 表示条件成立 */
  condition: (ctx: ApprovalContext) => boolean
}

// ======================== 状态步骤配置 ========================

/** 单个状态步骤 */
export interface FlowStep {
  /** 状态 key（对应 XState state node id） */
  key: string
  /** 中文显示名称 */
  label: string
  /** 审批角色（仅审批节点需要） */
  approverRole?: string
  /** 从此状态出发的事件转换规则（按声明顺序匹配） */
  transitions: TransitionConfig[]
  /**
   * 自动路由规则 — 进入此状态后立即评估，无需用户操作
   * 适用于：进入 pending 后根据天数/金额自动判断走哪条审批线
   * XState always 数组，按声明顺序匹配第一个命中的 guard
   */
  alwaysTransitions?: AlwaysTransitionConfig[]
}

/** 转换规则 — 事件触发 */
export interface TransitionConfig {
  /** 目标状态 key */
  target: string
  /** 触发事件（SUBMIT / APPROVE / REJECT / WITHDRAW） */
  event: string
  /** 条件 guard 名称（可选，无 guard 则直接跳转） */
  guard?: string
}

/** 转换规则 — 自动路由（always） */
export interface AlwaysTransitionConfig {
  /** 目标状态 key */
  target: string
  /** 条件 guard 名称（可选，无 guard 则无条件跳转） */
  guard?: string
  /** 优先级（数值越小越先匹配，可选，默认 0） */
  priority?: number
}

// ======================== 表单字段配置 ========================

/** 字段联动规则 — 当前字段值满足条件时，控制目标字段的显隐 */
export interface ReactionsConfig {
  /** 被控制的目标字段 key */
  target: string
  fulfill: {
    state: {
      /** 表达式，如 '{{$self.value === "病假"}}' */
      visible: string
    }
  }
}

/** 表单字段验证规则 */
export interface FieldValidationRules {
  /** 是否必填 */
  required?: boolean
  /** 必填时的错误提示 */
  requiredMessage?: string
  /** 最小值（数字类型） */
  min?: number
  /** 最大值（数字类型） */
  max?: number
  /** 最小长度（字符串类型） */
  minLength?: number
  /** 最大长度（字符串类型） */
  maxLength?: number
  /** 正则表达式验证 */
  pattern?: string
  /** 正则不匹配时的错误提示 */
  patternMessage?: string
  /** 自定义验证函数名（用于复杂验证逻辑） */
  validator?: string
}

/** 表单字段配置 — 声明式定义，业务方可自助扩展 */
export interface FormFieldConfig {
  /** 字段 key（对应表单值的 key） */
  key: string
  /** 字段标题（显示在表单中） */
  title: string
  /** 组件类型：Input / Select / DatePicker / InputNumber / Textarea */
  component: 'Input' | 'Select' | 'DatePicker' | 'InputNumber' | 'Textarea'
  /** 占位文本 */
  placeholder?: string
  /** 下拉选项（仅 Select 组件需要） */
  options?: { label: string; value: string }[]
  /** 字段联动规则 */
  reactions?: ReactionsConfig
  /** 字段默认值 */
  defaultValue?: string | number
  /** 验证规则 */
  rules?: FieldValidationRules
}

/** 上下文字段映射 — 表单值 → ApprovalContext 的转换规则 */
export interface ContextFieldMapping {
  /** 目标字段（ApprovalContext 的属性名） */
  contextField: keyof ApprovalContext
  /** 表单字段 key（对应 FormFieldConfig.key） */
  formField: string
  /** 值类型转换：'string' | 'number'（默认 'string'） */
  transform?: 'string' | 'number'
}

// ======================== 审批流程完整配置 ========================

/** 审批流程完整配置 */
export interface ApprovalFlowConfig {
  /** 流程唯一标识（如 'leave', 'reimbursement'） */
  flowType: string
  /** 流程显示名称（中文，如 '请假审批'） */
  label: string
  /** 流程简称（用于列表标签等小空间展示，如 '请假'） */
  shortLabel: string
  /** 流程描述 */
  description: string
  /** 状态步骤定义（按审批顺序排列） */
  steps: FlowStep[]
  /** 本流程用到的 guard 条件 */
  guards: GuardConfig[]
  /**
   * 发起审批时的表单字段定义
   * create 页面从此数组读取字段，动态渲染表单，零硬编码
   */
  formFields: FormFieldConfig[]
  /**
   * 表单值 → ApprovalContext 的映射规则
   * create 页面提交时按此规则构建上下文，传递给状态机
   */
  contextMapping: ContextFieldMapping[]
}

// ======================== 默认上下文 ========================

export const defaultContext: ApprovalContext = {
  approvalId: '',
  type: '',
  amount: 0,
  days: 0,
  itemName: '',
  quantity: 0,
  currentApprover: '',
}

// ======================== 内置 Guard 函数 ========================

export const builtInGuards: GuardConfig[] = [
  {
    name: 'daysLTE3',
    description: '请假天数 ≤ 3 天',
    condition: (ctx) => ctx.days <= 3,
  },
  {
    name: 'daysGT3',
    description: '请假天数 > 3 天',
    condition: (ctx) => ctx.days > 3,
  },
  {
    name: 'amountLTE5000',
    description: '报销金额 ≤ 5000 元',
    condition: (ctx) => ctx.amount <= 5000,
  },
  {
    name: 'amountGT5000',
    description: '报销金额 > 5000 元',
    condition: (ctx) => ctx.amount > 5000,
  },
]

// ======================== 流程配置 ========================

/** 请假审批 — 天数 ≤3 直接通过，>3 走经理+HR 双重审批 */
export const leaveFlowConfig: ApprovalFlowConfig = {
  flowType: 'leave',
  label: '请假审批',
  shortLabel: '请假',
  description: '请假天数 ≤ 3 天直接审批通过；> 3 天需部门经理 + HR 双重审批',
  steps: [
    {
      key: 'draft',
      label: '草稿',
      transitions: [
        { target: 'pending', event: 'SUBMIT' },
      ],
    },
    {
      key: 'pending',
      label: '待审批',
      approverRole: 'employee',
      transitions: [
        { target: 'approved', event: 'APPROVE', guard: 'daysLTE3' },
        { target: 'managerApproval', event: 'APPROVE', guard: 'daysGT3' },
        { target: 'rejected', event: 'REJECT' },
        { target: 'withdrawn', event: 'WITHDRAW' },
      ],
      alwaysTransitions: [
        { target: 'managerApproval', guard: 'daysGT3', priority: 1 },
      ],
    },
    {
      key: 'managerApproval',
      label: '经理审批',
      approverRole: 'manager',
      transitions: [
        { target: 'hrApproval', event: 'APPROVE' },
        { target: 'rejected', event: 'REJECT' },
        { target: 'withdrawn', event: 'WITHDRAW' },
      ],
    },
    {
      key: 'hrApproval',
      label: 'HR审批',
      approverRole: 'hr',
      transitions: [
        { target: 'approved', event: 'APPROVE' },
        { target: 'rejected', event: 'REJECT' },
        { target: 'withdrawn', event: 'WITHDRAW' },
      ],
    },
  ],
  guards: [builtInGuards[0], builtInGuards[1]],
  formFields: [
    {
      key: 'leaveType',
      title: '请假类型',
      component: 'Select',
      placeholder: '请选择请假类型',
      defaultValue: '事假',
      options: [
        { label: '事假', value: '事假' },
        { label: '病假', value: '病假' },
        { label: '年假', value: '年假' },
      ],
      reactions: {
        target: 'diagnosis',
        fulfill: { state: { visible: '{{$self.value === "病假"}}' } },
      },
      rules: {
        required: true,
        requiredMessage: '请选择请假类型',
      },
    },
    {
      key: 'startDate',
      title: '开始时间',
      component: 'DatePicker',
      rules: {
        required: true,
        requiredMessage: '请选择开始时间',
      },
    },
    {
      key: 'endDate',
      title: '结束时间',
      component: 'DatePicker',
      rules: {
        required: true,
        requiredMessage: '请选择结束时间',
      },
    },
    {
      key: 'days',
      title: '请假天数',
      component: 'InputNumber',
      placeholder: '请输入请假天数',
      defaultValue: 1,
      rules: {
        required: true,
        requiredMessage: '请输入请假天数',
        min: 1,
        max: 365,
      },
    },
    {
      key: 'reason',
      title: '请假事由',
      component: 'Textarea',
      placeholder: '请输入请假事由',
      rules: {
        required: true,
        requiredMessage: '请输入请假事由',
        minLength: 5,
        maxLength: 500,
      },
    },
    {
      key: 'diagnosis',
      title: '诊断证明',
      component: 'Input',
      placeholder: '请上传诊断证明',
      rules: {
        required: false, // 仅病假时必填，可通过自定义验证实现
      },
    },
  ],
  contextMapping: [
    { contextField: 'days', formField: 'days', transform: 'number' },
  ],
}

/** 报销审批 — 金额 ≤5000 直接通过，>5000 走财务总监审批 */
export const reimbursementFlowConfig: ApprovalFlowConfig = {
  flowType: 'reimbursement',
  label: '报销审批',
  shortLabel: '报销',
  description: '报销金额 ≤ 5000 元直接审批通过；> 5000 元需财务总监审批',
  steps: [
    {
      key: 'draft',
      label: '草稿',
      transitions: [
        { target: 'pending', event: 'SUBMIT' },
      ],
    },
    {
      key: 'pending',
      label: '待审批',
      approverRole: 'employee',
      transitions: [
        { target: 'approved', event: 'APPROVE', guard: 'amountLTE5000' },
        { target: 'financeApproval', event: 'APPROVE', guard: 'amountGT5000' },
        { target: 'rejected', event: 'REJECT' },
        { target: 'withdrawn', event: 'WITHDRAW' },
      ],
      alwaysTransitions: [
        { target: 'financeApproval', guard: 'amountGT5000', priority: 1 },
      ],
    },
    {
      key: 'financeApproval',
      label: '财务总监审批',
      approverRole: 'finance',
      transitions: [
        { target: 'approved', event: 'APPROVE' },
        { target: 'rejected', event: 'REJECT' },
        { target: 'withdrawn', event: 'WITHDRAW' },
      ],
    },
  ],
  guards: [builtInGuards[2], builtInGuards[3]],
  formFields: [
    {
      key: 'amount',
      title: '报销金额',
      component: 'InputNumber',
      placeholder: '请输入金额',
      rules: {
        required: true,
        requiredMessage: '请输入报销金额',
        min: 0.01,
        max: 1000000,
      },
    },
    {
      key: 'reason',
      title: '报销事由',
      component: 'Textarea',
      placeholder: '请输入报销事由',
      rules: {
        required: true,
        requiredMessage: '请输入报销事由',
        minLength: 5,
        maxLength: 500,
      },
    },
  ],
  contextMapping: [
    { contextField: 'amount', formField: 'amount', transform: 'number' },
  ],
}

/** 采购审批 — 固定流程：经理审批 */
export const procurementFlowConfig: ApprovalFlowConfig = {
  flowType: 'procurement',
  label: '采购审批',
  shortLabel: '采购',
  description: '采购申请需部门经理审批',
  steps: [
    {
      key: 'draft',
      label: '草稿',
      transitions: [
        { target: 'pending', event: 'SUBMIT' },
      ],
    },
    {
      key: 'pending',
      label: '待审批',
      approverRole: 'employee',
      transitions: [
        { target: 'managerApproval', event: 'APPROVE' },
        { target: 'rejected', event: 'REJECT' },
        { target: 'withdrawn', event: 'WITHDRAW' },
      ],
    },
    {
      key: 'managerApproval',
      label: '经理审批',
      approverRole: 'manager',
      transitions: [
        { target: 'approved', event: 'APPROVE' },
        { target: 'rejected', event: 'REJECT' },
        { target: 'withdrawn', event: 'WITHDRAW' },
      ],
    },
  ],
  guards: [],
  formFields: [
    {
      key: 'itemName',
      title: '采购物品',
      component: 'Input',
      placeholder: '请输入物品名称',
      rules: {
        required: true,
        requiredMessage: '请输入采购物品名称',
        minLength: 2,
        maxLength: 100,
      },
    },
    {
      key: 'quantity',
      title: '数量',
      component: 'InputNumber',
      placeholder: '请输入数量',
      rules: {
        required: true,
        requiredMessage: '请输入采购数量',
        min: 1,
        max: 10000,
      },
    },
    {
      key: 'reason',
      title: '采购事由',
      component: 'Textarea',
      placeholder: '请输入采购事由',
      rules: {
        required: true,
        requiredMessage: '请输入采购事由',
        minLength: 5,
        maxLength: 500,
      },
    },
  ],
  contextMapping: [
    { contextField: 'itemName', formField: 'itemName', transform: 'string' },
    { contextField: 'quantity', formField: 'quantity', transform: 'number' },
  ],
}

/** 通用审批 — 最简流程：直接通过 */
export const generalFlowConfig: ApprovalFlowConfig = {
  flowType: 'general',
  label: '通用审批',
  shortLabel: '通用',
  description: '通用审批，提交后直接通过',
  steps: [
    {
      key: 'draft',
      label: '草稿',
      transitions: [
        { target: 'pending', event: 'SUBMIT' },
      ],
    },
    {
      key: 'pending',
      label: '待审批',
      approverRole: 'employee',
      transitions: [
        { target: 'approved', event: 'APPROVE' },
        { target: 'rejected', event: 'REJECT' },
        { target: 'withdrawn', event: 'WITHDRAW' },
      ],
    },
  ],
  guards: [],
  formFields: [
    {
      key: 'title',
      title: '标题',
      component: 'Input',
      placeholder: '请输入标题',
      rules: {
        required: true,
        requiredMessage: '请输入标题',
        minLength: 2,
        maxLength: 100,
      },
    },
    {
      key: 'description',
      title: '描述',
      component: 'Textarea',
      placeholder: '请输入描述',
      rules: {
        required: true,
        requiredMessage: '请输入描述',
        minLength: 10,
        maxLength: 1000,
      },
    },
  ],
  contextMapping: [],
}

// ======================== 配置注册表 ========================

/** 所有已注册的审批流程配置 */
export const approvalFlowRegistry: Record<string, ApprovalFlowConfig> = {
  leave: leaveFlowConfig,
  reimbursement: reimbursementFlowConfig,
  procurement: procurementFlowConfig,
  general: generalFlowConfig,
}

/**
 * 获取审批流程配置
 * 业务方扩展：调用 registerFlow() 注册新流程即可
 */
export function getFlowConfig(flowType: string): ApprovalFlowConfig | undefined {
  return approvalFlowRegistry[flowType]
}

/**
 * 注册新的审批流程（业务方自助扩展入口）
 *
 * @example
 * registerFlow({
 *   flowType: 'overtime',
 *   label: '加班审批',
 *   description: '加班需经理审批',
 *   steps: [...],
 *   guards: [...],
 *   formFields: [...],
 *   contextMapping: [...],
 * })
 */
export function registerFlow(config: ApprovalFlowConfig): void {
  approvalFlowRegistry[config.flowType] = config
}
