import database from 'better-sqlite3';

const dbPath = process.env.DB_PATH || './data/approvals.db';  // ← 新增
const db = new database(dbPath);

db.exec(`
  CREATE TABLE IF NOT EXISTS approvals (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    type TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT '待审批',
      time TEXT NOT NULL
  );
`)


const count = db.prepare('SELECT COUNT(*) as count FROM approvals').get() as { count: number };


if (count.count === 0) {
  db.prepare('INSERT INTO approvals (title, type, status, time) VALUES (?, ?, ?, ?)').run('请假申请', '请假', '待审批', '2024-01-15');
  db.prepare('INSERT INTO approvals (title, type, status, time) VALUES (?, ?, ?, ?)').run('报销申请', '报销', '已完成', '2024-01-14');
  db.prepare('INSERT INTO approvals (title, type, status, time) VALUES (?, ?, ?, ?)').run('采购申请', '采购', '待审批', '2024-01-13');
}

// 查询所有审批
export const getAllApprovals = () => {
  return db.prepare('SELECT * FROM approvals').all();
};

// 根据 id 查询单个审批
export const getApprovalById = (id: number) => {
  return db.prepare('SELECT * FROM approvals WHERE id = ?').get(id);
};

// 插入新审批
export const createApproval = (title: string, type: string, status: string, time: string) => {
  return db.prepare('INSERT INTO approvals (title, type, status, time) VALUES (?, ?, ?, ?)').run(title, type, status, time);
};

export default db;