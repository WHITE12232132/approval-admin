import { Router } from "express";
import jwt from "jsonwebtoken";

const router = Router();


const SECRET = process.env.SECRET || 'default-secret';

// 模拟用户数据
const users = [
  { username: 'admin', password: '123456', name: '张三', role: 'employee' },
  { username: 'manager', password: '123456', name: '李经理', role: 'manager' },
  { username: 'hr', password: '123456', name: '王HR', role: 'hr' },
  { username: 'finance', password: '123456', name: '赵财务', role: 'finance' },
];

// 登录接口
router.post('/login', (req, res) => {
  try {
    const { username, password } = req.body;

    // 1. 验证参数
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: '用户名和密码不能为空'
      });
    }

    // 2. 查找用户
    const user = users.find(u => u.username === username && u.password === password);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: '用户名或密码错误'
      });
    }

    // 3. 生成 JWT Token
    const token = jwt.sign(
      { username: user.username, role: user.role },
      SECRET,
      { expiresIn: '24h' }  // 24小时过期
    );

    // 4. 返回成功
    res.json({
      success: true,
      data: {
        token,
        username: user.name,
        role: user.role
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: '登录失败'
    });
  }
});

export default router;