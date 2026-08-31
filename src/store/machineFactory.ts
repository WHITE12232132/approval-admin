/**
 * 审批状态机工厂
 *
 * 根据 ApprovalFlowConfig 动态生成 XState 5 状态机。
 * UI 组件只需调用 createApprovalMachine(flowType, context) 即可获得
 * 对应流程的状态机实例，无需关心具体状态节点和转换逻辑。
 *
 * 新增审批类型 = 新增配置对象，零代码修改此文件或任何 UI 文件。
 */

import { setup } from 'xstate'
import type {
  ApprovalContext,
  ApprovalEvent,
  ApprovalFlowConfig,
  GuardConfig,
  FlowStep,
} from './types'
import { defaultContext, approvalFlowRegistry } from './types'

// ======================== 内部工具 ========================

/**
 * 将 config 中的 guards 数组转为 XState setup() 所需的 guards 映射
 */
function buildGuardsMap(guards: GuardConfig[]) {
  const map: Record<string, ({ context }: { context: ApprovalContext }) => boolean> = {}
  for (const g of guards) {
    map[g.name] = ({ context }) => g.condition(context)
  }
  return map
}

/**
 * 将单个 FlowStep 转为 XState state node 配置
 *
 * 转换规则：
 * - alwaysTransitions → XState always 数组，进入状态后自动评估
 * - transitions（有 guard）→ 放入 on，按声明顺序匹配第一个命中的
 * - transitions（无 guard）→ 同上，排在有 guard 的后面作为 fallback
 * - final 状态（approved / rejected / withdrawn）→ type: 'final'
 */
function buildStateNode(step: FlowStep, finalKeys: Set<string>) {
  if (finalKeys.has(step.key)) {
    return { type: 'final' as const }
  }

  const node: Record<string, unknown> = {}

  // 1. always 自动路由（优先级高于 on）
  if (step.alwaysTransitions && step.alwaysTransitions.length > 0) {
    // 按 priority 排序（数值小的优先）
    const sorted = [...step.alwaysTransitions].sort(
      (a, b) => (a.priority ?? 0) - (b.priority ?? 0),
    )
    node.always = sorted.map((at) => {
      const t: Record<string, unknown> = { target: at.target }
      if (at.guard) t.guard = at.guard
      return t
    })
  }

  // 2. 事件触发的 on 转换
  const on: Record<string, unknown> = {}
  for (const t of step.transitions) {
    const transition: Record<string, unknown> = { target: t.target }
    if (t.guard) {
      transition.guard = t.guard
    }

    if (on[t.event]) {
      const existing = on[t.event]
      on[t.event] = Array.isArray(existing) ? [...existing, transition] : [existing, transition]
    } else {
      on[t.event] = transition
    }
  }
  if (Object.keys(on).length > 0) {
    node.on = on
  }

  return node
}

// ======================== 核心工厂 ========================

/**
 * 根据流程配置 + 上下文创建 XState 状态机
 *
 * @param flowType - 流程类型（'leave' | 'reimbursement' | 'procurement' | 'general'）
 * @param ctx      - 初始上下文（可选，使用 defaultContext 填充缺失字段）
 * @returns XState Machine 实例，可直接传给 useMachine()
 *
 * @example
 * const machine = createApprovalMachine('leave', {
 *   approvalId: '123',
 *   type: 'leave',
 *   days: 5,
 * })
 * const [state, send] = useMachine(machine)
 */
export function createApprovalMachine(
  flowType: string,
  ctx?: Partial<ApprovalContext>,
) {
  const config = approvalFlowRegistry[flowType]
  if (!config) {
    throw new Error(
      `[machineFactory] 未知的审批流程类型: "${flowType}"。` +
      `可用类型: ${Object.keys(approvalFlowRegistry).join(', ')}`,
    )
  }

  return createMachineFromConfig(config, { ...defaultContext, ...ctx })
}

/**
 * 直接从配置对象创建状态机（用于自定义/动态注册的流程）
 */
export function createMachineFromConfig(
  config: ApprovalFlowConfig,
  ctx: ApprovalContext,
) {
  const guardsMap = buildGuardsMap(config.guards)

  // 收集所有 final 状态 key（没有出边的状态 = 终态）
  const allTargets = new Set<string>()
  for (const step of config.steps) {
    for (const t of step.transitions) {
      allTargets.add(t.target)
    }
  }
  const definedKeys = new Set(config.steps.map((s) => s.key))
  const finalKeys = new Set<string>()
  for (const key of allTargets) {
    if (!definedKeys.has(key)) {
      // 目标状态不在 steps 中定义 → 视为终态（如 approved / rejected / withdrawn）
      finalKeys.add(key)
    }
  }
  // 显式标记终态
  finalKeys.add('approved')
  finalKeys.add('rejected')
  finalKeys.add('withdrawn')

  // 构建 XState states 配置
  const states: Record<string, unknown> = {}
  for (const step of config.steps) {
    states[step.key] = buildStateNode(step, finalKeys)
  }

  // 追加终态节点（未在 steps 中声明的）
  for (const key of finalKeys) {
    if (!states[key]) {
      states[key] = { type: 'final' }
    }
  }

  const machine = setup({
    types: {
      context: {} as ApprovalContext,
      events: {} as ApprovalEvent,
    },
    guards: guardsMap,
  }).createMachine({
    id: `approval-${config.flowType}`,
    initial: config.steps[0]?.key ?? 'draft',
    context: ctx,
    states,
  })

  return machine
}

// ======================== 辅助工具 ========================

/**
 * 获取流程的步骤标签列表（用于 UI 渲染进度条）
 *
 * @example
 * const steps = getFlowSteps('leave')
 * // [{ key: 'draft', label: '草稿' }, { key: 'pending', label: '待审批' }, ...]
 */
export function getFlowSteps(flowType: string) {
  const config = approvalFlowRegistry[flowType]
  if (!config) return []

  const steps = config.steps
    .filter((s) => !['approved', 'rejected', 'withdrawn'].includes(s.key))
    .map((s) => ({ key: s.key, label: s.label, approverRole: s.approverRole }))

  // 追加终态
  steps.push({ key: 'approved', label: '已通过', approverRole: undefined })

  return steps
}

/**
 * 获取当前状态在步骤列表中的索引（用于进度条高亮）
 * 返回 -1 表示处于终态（已通过/已驳回/已撤回）
 */
export function getFlowStepIndex(flowType: string, currentState: string | number): number {
  const steps = getFlowSteps(flowType)
  const idx = steps.findIndex((s) => s.key === currentState)

  // 终态（rejected / withdrawn）特殊处理：显示为最后一步但标红
  if (idx === -1) {
    if (currentState === 'rejected' || currentState === 'withdrawn') {
      return steps.length - 1
    }
    return -1
  }
  return idx
}

// ======================== Re-exports ========================
// 统一从 machineFactory 导出，UI 页面只需导入这一个入口

export { approvalFlowRegistry, defaultContext, getFlowConfig, registerFlow } from './types'
export type {
  ApprovalContext,
  ApprovalEvent,
  ApprovalFlowConfig,
  FormFieldConfig,
  ContextFieldMapping,
} from './types'
