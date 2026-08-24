const tools = [
  {
    type: 'function',
    function: {
      name: 'fillApprovalForm',
      description: '根据用户描述，自动填充审批表单。支持请假、报销、采购、通用四种类型。',
      parameters: {
        type: 'object',
        properties: {
          approvalType: {
            type: 'string',
            enum: ['请假', '报销', '采购', '通用'],
            description: '审批类型',
          },
          leaveType: {
            type: 'string',
            enum: ['事假', '病假', '年假'],
            description: '请假类型（仅请假时填写）',
          },
          startDate: {
            type: 'string',
            description: '开始时间，格式 YYYY-MM-DD（请假/采购时填写）',
          },
          endDate: {
            type: 'string',
            description: '结束时间，格式 YYYY-MM-DD（请假时填写）',
          },
          amount: {
            type: 'string',
            description: '金额（报销/采购时填写）',
          },
          itemName: {
            type: 'string',
            description: '物品名称（采购时填写）',
          },
          quantity: {
            type: 'string',
            description: '数量（采购时填写）',
          },
          title: {
            type: 'string',
            description: '标题（通用类型时填写）',
          },
          reason: {
            type: 'string',
            description: '事由/描述（所有类型都填写）',
          },
        },
        required: ['approvalType', 'reason'],
      },
    },
  },
]

export { tools }
