import { McpServer } from '@modelcontextprotocol/server';
import { serveStdio } from '@modelcontextprotocol/server/stdio';
import * as z from 'zod/v4';

serveStdio(() => {
    const server = new McpServer({
        name: 'approval-server',
        version: '1.0.0'
    });

    server.registerTool(
        'fillApprovalForm',
        {
            description: '根据用户描述，自动填充审批表单',
            inputSchema: z.object({
                approvalType: z.enum(['请假', '报销', '采购', '通用']),
                reason: z.string(),
                leaveType: z.enum(['事假', '病假', '年假']).optional(),
                startDate: z.string().optional(),
                endDate: z.string().optional(),
                amount: z.string().optional(),
                itemName: z.string().optional(),
                quantity: z.string().optional(),
                title: z.string().optional(),
            })
        },
        async (params) => ({
            content: [{
                type: 'text',
                text: JSON.stringify(params)
            }]
        })
    );

    return server;
});