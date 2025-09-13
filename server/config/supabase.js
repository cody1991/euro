const { Pool } = require('pg');

// Supabase PostgreSQL 连接配置
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || process.env.SUPABASE_URL,
  ssl: {
    rejectUnauthorized: false
  },
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// 测试连接
pool.connect()
  .then(client => {
    console.log('Supabase PostgreSQL 数据库连接成功');
    client.release();
  })
  .catch(err => {
    console.error('Supabase PostgreSQL 数据库连接失败:', err);
  });

module.exports = pool;
