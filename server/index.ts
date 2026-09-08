import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import approvalsRouter from './routes/approvals.js';
import mcpRouter from './routes/mcp.js';
import { connectMCP } from './services/mcpService.js';
import authRouter from './routes/auth.js';
import { authMiddleware } from './middleware/auth.js';

const app = express();
app.use(cors());
app.use(express.json());

// 注册路由
app.use('/approvals', authMiddleware, approvalsRouter);
app.use('/api', mcpRouter);
app.use('/auth', authRouter);

// 启动服务
const PORT = process.env.PORT || 3001;

async function start() {
    console.log('='.repeat(50));
    console.log('🎯 后端服务启动中...');
    console.log('='.repeat(50));

    try {
        await connectMCP();
    } catch {
        console.warn('⚠️ MCP 连接失败，服务继续启动（AI 功能不可用）');
    }

    app.listen(PORT, () => {
        console.log('='.repeat(50));
        console.log(`✅ 后端服务运行在 http://localhost:${PORT}`);
        console.log('='.repeat(50));
    });
}

start();