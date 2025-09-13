const mysql = require('mysql2/promise');

// PlanetScale 连接配置
const pool = mysql.createPool({
  host: process.env.DATABASE_HOST || 'localhost',
  username: process.env.DATABASE_USERNAME || 'root',
  password: process.env.DATABASE_PASSWORD || '',
  database: process.env.DATABASE_NAME || 'travel_planner',
  ssl: {
    rejectUnauthorized: false
  },
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// 测试连接
pool.getConnection()
  .then(connection => {
    console.log('PlanetScale MySQL 数据库连接成功');
    connection.release();
  })
  .catch(err => {
    console.error('PlanetScale MySQL 数据库连接失败:', err);
  });

module.exports = pool;
