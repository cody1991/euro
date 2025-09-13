const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const pool = require('./config/supabase');
const { createTables, initData } = require('./scripts/initSupabaseData');

const app = express();
const PORT = process.env.PORT || 5001;

// 中间件
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../client/build')));

// 初始化数据库
const initializeDatabase = async () => {
  try {
    await createTables();
    await initData();
    console.log('Supabase 数据库初始化完成');
  } catch (error) {
    console.error('数据库初始化失败:', error);
  }
};

// 启动时初始化数据库
initializeDatabase();

// API 路由

// 数据库状态检查
app.get('/api/health', async (req, res) => {
  try {
    // 测试数据库连接
    const result = await pool.query('SELECT NOW() as current_time, version() as db_version');
    const tableCounts = await pool.query(`
      SELECT 
        (SELECT COUNT(*) FROM itineraries) as itineraries_count,
        (SELECT COUNT(*) FROM cities) as cities_count,
        (SELECT COUNT(*) FROM attractions) as attractions_count,
        (SELECT COUNT(*) FROM transportation) as transportation_count
    `);
    
    res.json({
      status: 'healthy',
      database: 'connected',
      current_time: result.rows[0].current_time,
      db_version: result.rows[0].db_version,
      table_counts: tableCounts.rows[0]
    });
  } catch (error) {
    res.status(500).json({ 
      status: 'unhealthy',
      database: 'disconnected',
      error: error.message 
    });
  }
});

// 获取所有行程
app.get('/api/itineraries', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM itineraries ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 创建新行程
app.post('/api/itineraries', async (req, res) => {
  try {
    const { title, start_date, end_date } = req.body;
    const result = await pool.query(
      'INSERT INTO itineraries (title, start_date, end_date) VALUES ($1, $2, $3) RETURNING *',
      [title, start_date, end_date]
    );
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 获取特定行程的详细信息
app.get('/api/itineraries/:id', async (req, res) => {
  try {
    const itineraryId = req.params.id;
    console.log(`[DEBUG] 获取行程ID: ${itineraryId}`);

    // 获取行程信息
    const itineraryResult = await pool.query('SELECT * FROM itineraries WHERE id = $1', [itineraryId]);
    console.log(`[DEBUG] 行程查询结果: ${itineraryResult.rows.length} 条记录`);
    if (itineraryResult.rows.length === 0) {
      return res.status(404).json({ error: 'Itinerary not found' });
    }

    const itinerary = itineraryResult.rows[0];
    console.log(`[DEBUG] 找到行程: ${itinerary.title}`);

    // 获取城市信息
    const citiesResult = await pool.query(
      'SELECT * FROM cities WHERE itinerary_id = $1 ORDER BY arrival_date',
      [itineraryId]
    );

    // 获取每个城市的景点
    const citiesWithAttractions = await Promise.all(
      citiesResult.rows.map(async (city) => {
        const attractionsResult = await pool.query(
          'SELECT * FROM attractions WHERE city_id = $1 ORDER BY visit_date, visit_time',
          [city.id]
        );
        return { ...city, attractions: attractionsResult.rows };
      })
    );

    // 获取交通信息
    const transportationResult = await pool.query(
      'SELECT * FROM transportation WHERE itinerary_id = $1 ORDER BY departure_time',
      [itineraryId]
    );

    res.json({
      ...itinerary,
      cities: citiesWithAttractions,
      transportation: transportationResult.rows
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 添加城市
app.post('/api/cities', async (req, res) => {
  try {
    const { name, country, latitude, longitude, arrival_date, departure_date, itinerary_id } = req.body;
    const result = await pool.query(
      'INSERT INTO cities (name, country, latitude, longitude, arrival_date, departure_date, itinerary_id) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [name, country, latitude, longitude, arrival_date, departure_date, itinerary_id]
    );
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 添加景点
app.post('/api/attractions', async (req, res) => {
  try {
    const { name, description, city_id, latitude, longitude, visit_date, visit_time, category, rating } = req.body;
    const result = await pool.query(
      'INSERT INTO attractions (name, description, city_id, latitude, longitude, visit_date, visit_time, category, rating) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *',
      [name, description, city_id, latitude, longitude, visit_date, visit_time, category, rating]
    );
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 添加交通
app.post('/api/transportation', async (req, res) => {
  try {
    const { from_city_id, to_city_id, transport_type, departure_time, arrival_time, duration, cost, booking_reference, itinerary_id } = req.body;
    const result = await pool.query(
      'INSERT INTO transportation (from_city_id, to_city_id, transport_type, departure_time, arrival_time, duration, cost, booking_reference, itinerary_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *',
      [from_city_id, to_city_id, transport_type, departure_time, arrival_time, duration, cost, booking_reference, itinerary_id]
    );
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 更新城市
app.put('/api/cities/:id', async (req, res) => {
  try {
    const { name, country, latitude, longitude, arrival_date, departure_date } = req.body;
    const cityId = req.params.id;
    const result = await pool.query(
      'UPDATE cities SET name = $1, country = $2, latitude = $3, longitude = $4, arrival_date = $5, departure_date = $6 WHERE id = $7 RETURNING *',
      [name, country, latitude, longitude, arrival_date, departure_date, cityId]
    );
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 更新景点
app.put('/api/attractions/:id', async (req, res) => {
  try {
    const { name, description, latitude, longitude, visit_date, visit_time, category, rating } = req.body;
    const attractionId = req.params.id;
    const result = await pool.query(
      'UPDATE attractions SET name = $1, description = $2, latitude = $3, longitude = $4, visit_date = $5, visit_time = $6, category = $7, rating = $8 WHERE id = $9 RETURNING *',
      [name, description, latitude, longitude, visit_date, visit_time, category, rating, attractionId]
    );
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 删除景点
app.delete('/api/attractions/:id', async (req, res) => {
  try {
    const attractionId = req.params.id;
    await pool.query('DELETE FROM attractions WHERE id = $1', [attractionId]);
    res.json({ message: 'Attraction deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 删除城市
app.delete('/api/cities/:id', async (req, res) => {
  try {
    const cityId = req.params.id;
    await pool.query('DELETE FROM cities WHERE id = $1', [cityId]);
    res.json({ message: 'City deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 服务静态文件
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`服务器运行在端口 ${PORT}`);
});

// 优雅关闭
process.on('SIGINT', () => {
  pool.end(() => {
    console.log('Supabase 连接已关闭');
    process.exit(0);
  });
});
