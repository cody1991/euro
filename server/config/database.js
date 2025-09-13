const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// 根据环境选择数据库路径
const getDatabasePath = () => {
  if (process.env.NODE_ENV === 'production') {
    // 生产环境：使用持久化存储路径
    return process.env.DATABASE_URL || '/tmp/travel_planner.db';
  } else {
    // 开发环境：使用项目根目录
    return path.join(__dirname, '../../travel_planner.db');
  }
};

const dbPath = getDatabasePath();
console.log('数据库路径:', dbPath);

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('数据库连接失败:', err.message);
  } else {
    console.log('数据库连接成功');
  }
});

module.exports = db;
