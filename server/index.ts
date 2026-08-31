import express from 'express';
import cors from 'cors';
import { Client } from '@modelcontextprotocol/client';
import { StdioClientTransport } from '@modelcontextprotocol/client/stdio';

const app = express();
app.use(cors());
app.use(express.json());

const MCP_SERVER_PATH = '../mcp-server/index.ts';

let mcpClient: Client | null = null;

// 连接 MCP Server
async function connectMCP() {
    console.log('🔄 开始连接 MCP Server...');
    console.log('📂 MCP Server 路径:', MCP_SERVER_PATH);

    try {
        // 创建一个 stdio（标准输入输出）传输层实例
        const transport = new StdioClientTransport({
            command: 'npx',
            args: ['tsx', MCP_SERVER_PATH],
        });

        console.log('🚀 正在启动 MCP Server 子进程...');

        // 创建一个 MCP 客户端实例
        mcpClient = new Client({ name: 'approval-backend', version: '1.0.0' });

        console.log('🔗 正在建立连接...');
        await mcpClient.connect(transport);

        console.log('✅ MCP Server 连接成功');
    } catch (error) {
        console.error('❌ MCP Server 连接失败:', error);
        throw error;
    }
}

// 获取工具列表
app.get('/api/tools', async (req, res) => {
    try {
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
app.post('/api/tools/call', async (req, res) => {
    try {
        if (!mcpClient) throw new Error('MCP 未连接');

        const { name, arguments: args } = req.body;
        const result = await mcpClient.callTool({ name, arguments: args });

        res.json({ result });
    } catch {
        res.status(500).json({ error: '工具调用失败' });
    }
});

// 健康检查
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', mcpConnected: !!mcpClient });
});

// 启动服务
const PORT = 3001;

async function start() {
    console.log('='.repeat(50));
    console.log('🎯 后端服务启动中...');
    console.log('='.repeat(50));

    try {
        await connectMCP();
        app.listen(PORT, () => {
            console.log('='.repeat(50));
            console.log(`✅ 后端服务运行在 http://localhost:${PORT}`);
            console.log('='.repeat(50));
        });
    } catch (error) {
        console.error('❌ 启动失败:', error);
        process.exit(1);
    }
}

start();