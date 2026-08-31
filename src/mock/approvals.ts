export const mockApprovals = [
    // 技术部 - 前几天每天1人请假，最后一天突然8人请假（触发2σ异常）
    { id: '1', userId: '1', userName: '张三', department: '技术部', type: '请假', status: '已通过', approver: '李经理', date: '2024-01-10' },
    { id: '2', userId: '2', userName: '李四', department: '技术部', type: '请假', status: '已通过', approver: '李经理', date: '2024-01-11' },
    { id: '3', userId: '3', userName: '王五', department: '技术部', type: '请假', status: '已通过', approver: '李经理', date: '2024-01-12' },
    { id: '4', userId: '4', userName: '赵六', department: '技术部', type: '请假', status: '已通过', approver: '李经理', date: '2024-01-13' },
    { id: '5', userId: '5', userName: '孙七', department: '技术部', type: '请假', status: '已通过', approver: '李经理', date: '2024-01-14' },
    { id: '6', userId: '6', userName: '周八', department: '技术部', type: '请假', status: '已通过', approver: '李经理', date: '2024-01-15' },
    { id: '7', userId: '7', userName: '吴九', department: '技术部', type: '请假', status: '已通过', approver: '李经理', date: '2024-01-16' },
    { id: '8', userId: '8', userName: '郑十', department: '技术部', type: '请假', status: '已通过', approver: '李经理', date: '2024-01-17' },
    // 最后一天8人请假（异常高）
    { id: '9', userId: '9', userName: '冯一', department: '技术部', type: '请假', status: '已通过', approver: '李经理', date: '2024-01-18' },
    { id: '10', userId: '10', userName: '陈二', department: '技术部', type: '请假', status: '已通过', approver: '李经理', date: '2024-01-18' },
    { id: '11', userId: '11', userName: '褚三', department: '技术部', type: '请假', status: '已通过', approver: '李经理', date: '2024-01-18' },
    { id: '12', userId: '12', userName: '卫四', department: '技术部', type: '请假', status: '已通过', approver: '李经理', date: '2024-01-18' },
    { id: '13', userId: '13', userName: '蒋五', department: '技术部', type: '请假', status: '已通过', approver: '李经理', date: '2024-01-18' },
    { id: '14', userId: '14', userName: '沈六', department: '技术部', type: '请假', status: '已通过', approver: '李经理', date: '2024-01-18' },
    { id: '15', userId: '15', userName: '韩七', department: '技术部', type: '请假', status: '已通过', approver: '李经理', date: '2024-01-18' },
    { id: '16', userId: '16', userName: '杨八', department: '技术部', type: '请假', status: '已通过', approver: '李经理', date: '2024-01-18' },
    // 王总监连续驳回3次（触发连续驳回检测）
    { id: '17', userId: '17', userName: '朱九', department: '技术部', type: '请假', status: '已驳回', approver: '王总监', date: '2024-01-15' },
    { id: '18', userId: '18', userName: '秦十', department: '技术部', type: '请假', status: '已驳回', approver: '王总监', date: '2024-01-16' },
    { id: '19', userId: '19', userName: '许一', department: '技术部', type: '请假', status: '已驳回', approver: '王总监', date: '2024-01-17' },
    // 人事部、财务部正常数据
    { id: '20', userId: '20', userName: '何二', department: '人事部', type: '请假', status: '已通过', approver: '赵经理', date: '2024-01-15' },
    { id: '21', userId: '21', userName: '吕三', department: '财务部', type: '请假', status: '已通过', approver: '钱经理', date: '2024-01-16' },
]