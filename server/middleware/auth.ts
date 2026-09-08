import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const SECRET = 'your-secret-key';

// 扩展 Request 类型，添加 user 属性
export interface AuthRequest extends Request {
  user?: {
    username: string;
    role: string;
  };
}

// 认证中间件
export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    // 1. 从 Header 获取 Token
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: '未登录，请先登录'
      });
    }

    // 2. 提取 Token
    const token = authHeader.split(' ')[1];

    // 3. 验证 Token
    const decoded = jwt.verify(token, SECRET) as { username: string; role: string };
    
    // 4. 把用户信息挂到 req 上
    req.user = decoded;

    // 5. 继续执行下一个中间件/路由
    next();

  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Token 无效或已过期'
    });
  }
};