import { Router } from 'express';
import { getMCPClient } from '../services/mcpService.js';

const router = Router();

// 获取工具列表
router.get('/tools', async (req, res) => {
    try {
        const mcpClient = getMCPClient();
        if (!mcpClient) throw new Error('MCP 未连接');

        const { tools } = await mcpClient.listTools();

        // 转换为 DeepSeek API 格式
        const formattedTools = tools.map(tool => ({
            type: 'function',
            function: {
                name: tool.name,
                description: tool.description,
                parameters: tool.inputSchema,
            }
        }));

        res.json({ tools: formattedTools });
    } catch {
        res.status(500).json({ error: '获取工具列表失败' });
    }
});

// 调用工具
router.post('/tools/call', async (req, res) => {
    try {
        const mcpClient = getMCPClient();
        if (!mcpClient) throw new Error('MCP 未连接');

        const { name, arguments: args } = req.body;
        const result = await mcpClient.callTool({ name, arguments: args });

        res.json({ result });
    } catch {
        res.status(500).json({ error: '工具调用失败' });
    }
});

// 健康检查
router.get('/health', (req, res) => {
    const mcpClient = getMCPClient();
    res.json({ status: 'ok', mcpConnected: !!mcpClient });
});

export default router;