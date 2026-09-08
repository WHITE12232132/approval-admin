import { Client } from '@modelcontextprotocol/client';
import { StdioClientTransport } from '@modelcontextprotocol/client/stdio';
const MCP_SERVER_PATH = '../mcp-server/index.ts';
let mcpClient: Client | null = null;
export async function connectMCP() {
    console.log('🔄 开始连接 MCP Server...');

    try {
        const transport = new StdioClientTransport({
            command: 'npx',
            args: ['tsx', MCP_SERVER_PATH],
        });

        mcpClient = new Client({ name: 'approval-backend', version: '1.0.0' });
        await mcpClient.connect(transport);

        console.log('✅ MCP Server 连接成功');
    } catch (error) {
        console.error('❌ MCP Server 连接失败:', error);
        throw error;
    }
}

// 获取 MCP 客户端
export function getMCPClient() {
    return mcpClient;
}