// 审核详情页
import { useState } from 'react'
import { useMachine } from '@xstate/react'
import type { AnyStateMachine } from 'xstate'
import { useLocation } from 'react-router-dom'
import { Card, CardContent } from '@/components/ui/card'
import {
  createApprovalMachine,
  getFlowSteps,
  getFlowStepIndex,
  getFlowConfig,
  approvalFlowRegistry,
} from '@/store/machineFactory'
import type { ApprovalContext } from '@/store/types'
import { defaultContext } from '@/store/types'


export default function ApprovalDetail() {
  const location = useLocation()
  const routeState = (location.state ?? {}) as {
    flowType?: string
    context?: Partial<ApprovalContext>
  }

  // detail页面接收路由参数
  const [flowType, setFlowType] = useState<string>(
    routeState.flowType || 'leave',
  )
  
  const machine = createApprovalMachine(flowType, {
    ...defaultContext,
    ...routeState.context,
    approvalId: routeState.context?.approvalId || '1',
  }) as unknown as AnyStateMachine
  const [state, send] = useMachine(machine)

  // ==================== 从配置读取步骤信息 ====================
  const flowSteps = getFlowSteps(flowType)
  const currentStepIndex = getFlowStepIndex(flowType, state.value)
  const flowConfig = getFlowConfig(flowType)
  const isRejected = state.value === 'rejected'
  const isWithdrawn = state.value === 'withdrawn'
  const isTerminal = isRejected || isWithdrawn || state.value === 'approved'

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* ===== 流程类型切换（演示用，生产环境可移除） ===== */}
      <Card>
        <CardContent className="flex items-center gap-3 py-3">
          <span className="text-sm text-gray-500">切换流程类型（演示）：</span>
          {Object.entries(approvalFlowRegistry).map(([key, cfg]) => (
            <button
              key={key}
              onClick={() => setFlowType(key)}
              className={`px-3 py-1 text-xs rounded-lg transition-colors ${flowType === key
                ? 'bg-violet-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
            >
              {cfg.label}
            </button>
          ))}
        </CardContent>
      </Card>

      {/* ===== 审批详情 ===== */}
      <Card>
        <CardContent className="py-6">
          {/* 标题栏 */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">
              {flowConfig?.label ?? '审批详情'}
            </h2>
            <span className="text-sm text-gray-400">
              ID: {state.context.approvalId || '-'}
            </span>
          </div>

          {/* 审批上下文摘要 */}
          <div className="flex flex-wrap gap-4 mb-4 text-sm">
            {state.context.days > 0 && (
              <span className="text-gray-500">请假天数：<strong>{state.context.days}</strong> 天</span>
            )}
            {state.context.amount > 0 && (
              <span className="text-gray-500">报销金额：<strong>¥{state.context.amount.toLocaleString()}</strong></span>
            )}
            {state.context.itemName && (
              <span className="text-gray-500">采购物品：<strong>{state.context.itemName}</strong></span>
            )}
          </div>

          {/* 当前状态 */}
          <div className="mb-4">
            <span className="text-sm text-gray-500">当前状态：</span>
            <span className={`font-bold ml-1 ${isRejected ? 'text-red-600' :
              isWithdrawn ? 'text-orange-500' :
                state.value === 'approved' ? 'text-green-600' :
                  'text-violet-600'
              }`}>
              {isRejected ? '已驳回' :
                isWithdrawn ? '已撤回' :
                  state.value === 'approved' ? '已通过' :
                    String(state.value)}
            </span>
          </div>

          {/* ===== 进度条 — 完全从配置驱动 ===== */}
          <div className="mt-4">
            <h3 className="text-sm font-medium text-gray-500 mb-3">审批流程</h3>
            <div className="flex items-center gap-1 flex-wrap">
              {flowSteps.map((step, i) => {
                const isActive = i <= currentStepIndex && !isTerminal
                const isCurrent = i === currentStepIndex && !isTerminal

                let circleClass = 'bg-gray-200 text-gray-500'
                if (isTerminal && i === flowSteps.length - 1) {
                  circleClass = isRejected || isWithdrawn
                    ? 'bg-red-500 text-white'
                    : 'bg-green-500 text-white'
                } else if (isActive) {
                  circleClass = 'bg-violet-600 text-white'
                } else if (isCurrent) {
                  circleClass = 'bg-violet-600 text-white ring-2 ring-violet-300'
                }

                return (
                  <div key={step.key} className="flex items-center">
                    <div className="flex flex-col items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs transition-all ${circleClass}`}>
                        {i + 1}
                      </div>
                      <span className={`mt-1 text-xs text-center max-w-[64px] ${isCurrent ? 'font-semibold text-violet-600' : 'text-gray-500'
                        }`}>
                        {step.label}
                      </span>
                    </div>
                    {i < flowSteps.length - 1 && (
                      <div className={`w-8 h-0.5 mx-1 mt-[-18px] ${i < currentStepIndex && !isTerminal ? 'bg-violet-600' : 'bg-gray-200'
                        }`} />
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ===== 操作按钮 — 根据状态机 can() 动态渲染 ===== */}
      {!isTerminal && (
        <Card>
          <CardContent className="flex gap-3 py-4">
            {state.can({ type: 'SUBMIT' }) && (
              <button
                onClick={() => send({ type: 'SUBMIT' })}
                className="px-5 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors text-sm font-medium"
              >
                📤 提交审批
              </button>
            )}
            {state.can({ type: 'APPROVE' }) && (
              <button
                onClick={() => send({ type: 'APPROVE' })}
                className="px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
              >
                ✅ 同意
              </button>
            )}
            {state.can({ type: 'REJECT' }) && (
              <button
                onClick={() => send({ type: 'REJECT' })}
                className="px-5 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm font-medium"
              >
                ❌ 驳回
              </button>
            )}
            {state.can({ type: 'WITHDRAW' }) && (
              <button
                onClick={() => send({ type: 'WITHDRAW' })}
                className="px-5 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors text-sm font-medium"
              >
                ↩️ 撤回
              </button>
            )}
          </CardContent>
        </Card>
      )}

      {/* ===== 终态提示 ===== */}
      {isTerminal && (
        <Card className={
          isRejected ? 'border-red-200 bg-red-50' :
            isWithdrawn ? 'border-orange-200 bg-orange-50' :
              'border-green-200 bg-green-50'
        }>
          <CardContent className="py-4">
            <p className={`text-sm font-medium ${isRejected ? 'text-red-700' :
              isWithdrawn ? 'text-orange-700' :
                'text-green-700'
              }`}>
              {isRejected && '❌ 审批已被驳回'}
              {isWithdrawn && '↩️ 审批已被撤回'}
              {state.value === 'approved' && '✅ 审批已通过'}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
