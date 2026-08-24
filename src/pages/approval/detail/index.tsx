import { useMachine } from '@xstate/react'
import { machine } from '@/store/approvalMachine'

// 把状态名转换成步骤编号
function getCurrentStep(status: string | number) {
  const steps: Record<string, number> = {
    draft: 0,
    pending: 1,
    managerApproval: 2,
    hrApproval: 3,
    approved: 4,
    rejected: 1,
  }
  return steps[status as string] ?? 0
}

export default function ApprovalDetail() {
  // 当前状态对象，以及发送事件函数
  const [state, send] = useMachine(machine)

  return (
    //width：100% gap-1 = 1*4 4px
    <div className="flex flex-col gap-4 w-full">
      {/* text-lg  font-size: 18px  font-semibold font-weight: 600    */}
      <h2 className="text-lg font-semibold">审批详情</h2>
      {/*p-4	padding: 16px  border	border: 1px solid  rounded-lg	border-radius: 8px   */}
      <div className="p-4 border rounded-lg">
        <p>当前状态：<span className="font-bold">{state.value}</span></p>
        {/* margin-top: 16px */}
        <div className="mt-4">
          {/* 字体样式 间距 */}
          <h3 className="text-sm font-medium text-gray-500 mb-2">审批流程</h3>
          {/*  水平排列，垂直居中，间距 8px  */}
          <div className="flex items-center gap-2">
            {['草稿', '待审批', '经理审批', 'HR审批', '已通过'].map((step, i) => (
              <div key={step} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs ${i <= getCurrentStep(state.value)
                  ? 'bg-violet-600 text-white'
                  : 'bg-gray-200 text-gray-500'
                  }`}>
                  {i + 1}
                </div>
                <span className="ml-1 text-xs">{step}</span>
                {i < 4 && <div className="w-8 h-0.5 bg-gray-200 mx-1" />}
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* 检查当前状态能否触发 SUBMIT 事件 如果能，就渲染后面的按钮 否则隐藏  */}
      <div className="flex gap-2">
        {state.can({ type: 'SUBMIT' }) && (
          <button
            onClick={() => send({ type: 'SUBMIT' })}
            className="px-4 py-2 bg-violet-600 text-white rounded-lg"
          >
            提交审批
          </button>
        )}
        {state.can({ type: 'APPROVE' }) && (
          <button
            onClick={() => send({ type: 'APPROVE' })}
            className="px-4 py-2 bg-green-600 text-white rounded-lg"
          >
            同意
          </button>
        )}
        {state.can({ type: 'REJECT' }) && (
          <button
            onClick={() => send({ type: 'REJECT' })}
            className="px-4 py-2 bg-red-600 text-white rounded-lg"
          >
            驳回
          </button>
        )}
      </div>





    </div>
  )
}