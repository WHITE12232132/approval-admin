import { Router } from "express";
import fs from "fs/promises";
import { getAllApprovals, createApproval } from "../data/db.js";

const router = Router();

// 获取审批列表
router.get('/', async (req, res) => {
  try {
    const approvals = getAllApprovals();  // ← 改这行
    res.json(approvals);
  } catch (error) {
    res.status(500).json({ error: '获取审批列表失败' });
  }
});

// 创建审批
router.post('/', async (req, res) => {
  try {
    const { title, type, status, time } = req.body;

    // 验证标题
    if (!title) {
      return res.status(400).json({
        success: false,
        message: '标题不能为空'
      });
    }

    // 插入数据库
    const result = createApproval(title, type, status || '待审批', time);

    // 返回成功
    res.status(201).json({
      success: true,
      data: { id: result.lastInsertRowid, title, type, status, time }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: '创建审批失败'
    });
  }
});





export default router;

