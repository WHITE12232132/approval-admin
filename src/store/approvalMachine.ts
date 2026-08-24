import { setup } from 'xstate'

interface ApprovalContext {
    approvalId: string
    type: string
    amount: number
    days: number
    currentApprover: string
}
type ApprovalEvent =
    | { type: 'SUBMIT' }
    | { type: 'APPROVE' }
    | { type: 'REJECT' }

const machine = setup({
    // 定义数据结构
    types: {
        context: {} as ApprovalContext,
        events: {} as ApprovalEvent,
    },
    //定义判断函数
    guards: {
        checkDays: ({ context }) => {
            return context.days <= 3
        },
        needManagerApproval: ({ context }) => {
            return context.days > 3
        },
    },
}).createMachine({
    id: 'approval',
    // 初始状态
    initial: 'draft',
    // 实际数据
    context: {
        approvalId: '',
        type: '',
        amount: 0,
        days: 0,
        currentApprover: '',
    },
    //状态机所有的状态
    states: {
        draft: {
            // on对应的是 是事件名以及对应转换的状态
            on: { SUBMIT: 'pending' }
        },
        pending: {
            //触发事件，guard执行 true转换，false不转换
            on: {
                APPROVE: {
                    target: 'approved',
                    guard: 'checkDays',
                },
                REJECT: 'rejected',
            },
            // 一进入pending状态立刻执行函数，成功转换，否则相反
            always: [
                { target: 'managerApproval', guard: 'needManagerApproval' },
            ],
        },
        managerApproval: {
            on: {
                APPROVE: 'hrApproval',
                REJECT: 'rejected',
            }
        },
        hrApproval: {
            on: {
                APPROVE: 'approved',
                REJECT: 'rejected',
            }
        },
        approved: { type: 'final' },
        rejected: { type: 'final' },
    },
})

export { machine }