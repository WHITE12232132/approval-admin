/**
 * 审批状态机 — 兼容入口
 *
 * 底层已迁移到 machineFactory，此处保留默认导出供旧代码兼容。
 * 新代码请直接使用 createApprovalMachine() 或 createMachineFromConfig()。
 */

import { createApprovalMachine } from './machineFactory'
import type { ApprovalContext } from './types'

/**
 * 默认状态机实例（请假审批，空上下文）
 * 仅供快速演示使用，生产代码请通过工厂按流程类型创建
 */
const machine = createApprovalMachine('leave')

export { machine }

// 同时导出工厂和类型，方便新代码使用
export { createApprovalMachine, createMachineFromConfig } from './machineFactory'
export { getFlowSteps, getFlowStepIndex } from './machineFactory'
export type { ApprovalContext, ApprovalEvent, AlwaysTransitionConfig } from './types'
export {
  approvalFlowRegistry,
  getFlowConfig,
  registerFlow,
  leaveFlowConfig,
  reimbursementFlowConfig,
  procurementFlowConfig,
  generalFlowConfig,
} from './types'