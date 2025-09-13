const { Pool } = require('pg');

// 数据库连接配置
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://localhost:5432/travel_planner',
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// 测试连接
pool.on('connect', () => {
  console.log('PostgreSQL数据库连接成功');
});

pool.on('error', (err) => {
  console.error('PostgreSQL数据库连接错误:', err);
});

module.exports = pool;
