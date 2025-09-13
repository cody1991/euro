const pool = require('../config/supabase');

// 创建表结构
const createTables = async () => {
  try {
    // 行程表
    await pool.query(`
      CREATE TABLE IF NOT EXISTS itineraries (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        start_date DATE NOT NULL,
        end_date DATE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 城市表
    await pool.query(`
      CREATE TABLE IF NOT EXISTS cities (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        country VARCHAR(255) NOT NULL,
        latitude DECIMAL(10, 8),
        longitude DECIMAL(11, 8),
        arrival_date DATE,
        departure_date DATE,
        itinerary_id INTEGER REFERENCES itineraries(id)
      )
    `);

    // 景点表
    await pool.query(`
      CREATE TABLE IF NOT EXISTS attractions (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        city_id INTEGER REFERENCES cities(id),
        latitude DECIMAL(10, 8),
        longitude DECIMAL(11, 8),
        visit_date DATE,
        visit_time TIME,
        category VARCHAR(100),
        rating DECIMAL(3, 1)
      )
    `);

    // 交通表
    await pool.query(`
      CREATE TABLE IF NOT EXISTS transportation (
        id SERIAL PRIMARY KEY,
        from_city_id INTEGER REFERENCES cities(id),
        to_city_id INTEGER REFERENCES cities(id),
        transport_type VARCHAR(50) NOT NULL,
        departure_time TIMESTAMP,
        arrival_time TIMESTAMP,
        duration VARCHAR(50),
        cost DECIMAL(10, 2),
        booking_reference VARCHAR(100),
        itinerary_id INTEGER REFERENCES itineraries(id)
      )
    `);

    console.log('Supabase 表结构创建完成');
  } catch (err) {
    console.error('创建表结构失败:', err);
  }
};

// 初始化数据
const initData = async () => {
  try {
    // 检查是否已有数据
    const result = await pool.query('SELECT COUNT(*) as count FROM itineraries');
    if (result.rows[0].count > 0) {
      console.log('数据已存在，跳过初始化');
      return;
    }

    console.log('开始初始化 Supabase 数据...');

    // 插入行程
    const itineraryResult = await pool.query(
      'INSERT INTO itineraries (title, start_date, end_date) VALUES ($1, $2, $3) RETURNING id',
      ['20天欧洲深度游', '2024-02-09', '2024-03-08']
    );
    const itineraryId = itineraryResult.rows[0].id;

    // 城市数据
    const cities = [
      { name: '武汉', country: '中国', latitude: 30.5928, longitude: 114.3055, arrival_date: '2024-02-09', departure_date: '2024-02-09' },
      { name: '阿姆斯特丹', country: '荷兰', latitude: 52.3676, longitude: 4.9041, arrival_date: '2024-02-09', departure_date: '2024-02-12' },
      { name: '巴黎', country: '法国', latitude: 48.8566, longitude: 2.3522, arrival_date: '2024-02-12', departure_date: '2024-02-16' },
      { name: '尼斯', country: '法国', latitude: 43.7102, longitude: 7.2620, arrival_date: '2024-02-16', departure_date: '2024-02-18' },
      { name: '马赛', country: '法国', latitude: 43.2965, longitude: 5.3698, arrival_date: '2024-02-18', departure_date: '2024-02-20' },
      { name: '阿维尼翁', country: '法国', latitude: 43.9493, longitude: 4.8055, arrival_date: '2024-02-20', departure_date: '2024-02-22' },
      { name: '阿尔勒', country: '法国', latitude: 43.6766, longitude: 4.6278, arrival_date: '2024-02-22', departure_date: '2024-02-24' },
      { name: '圣特罗佩', country: '法国', latitude: 43.2671, longitude: 6.6392, arrival_date: '2024-02-24', departure_date: '2024-02-26' },
      { name: '米兰', country: '意大利', latitude: 45.4642, longitude: 9.1900, arrival_date: '2024-02-26', departure_date: '2024-02-28' },
      { name: '佛罗伦萨', country: '意大利', latitude: 43.7696, longitude: 11.2558, arrival_date: '2024-02-28', departure_date: '2024-03-01' },
      { name: '威尼斯', country: '意大利', latitude: 45.4408, longitude: 12.3155, arrival_date: '2024-03-01', departure_date: '2024-03-03' },
      { name: '罗马', country: '意大利', latitude: 41.9028, longitude: 12.4964, arrival_date: '2024-03-03', departure_date: '2024-03-05' },
      { name: '布达佩斯', country: '匈牙利', latitude: 47.4979, longitude: 19.0402, arrival_date: '2024-03-05', departure_date: '2024-03-07' },
      { name: '武汉', country: '中国', latitude: 30.5928, longitude: 114.3055, arrival_date: '2024-03-08', departure_date: '2024-03-08' }
    ];

    // 插入城市
    for (const city of cities) {
      await pool.query(
        'INSERT INTO cities (name, country, latitude, longitude, arrival_date, departure_date, itinerary_id) VALUES ($1, $2, $3, $4, $5, $6, $7)',
        [city.name, city.country, city.latitude, city.longitude, city.arrival_date, city.departure_date, itineraryId]
      );
    }

    console.log('Supabase 数据初始化完成');
  } catch (err) {
    console.error('初始化数据失败:', err);
  }
};

module.exports = { createTables, initData };
