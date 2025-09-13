const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const pool = require('./config/planetscale');
const { createTables, initData } = require('./scripts/initPlanetScaleData');

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
    console.log('PlanetScale 数据库初始化完成');
  } catch (error) {
    console.error('数据库初始化失败:', error);
  }
};

// 启动时初始化数据库
initializeDatabase();

// API 路由

// 获取所有行程
app.get('/api/itineraries', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM itineraries ORDER BY created_at DESC');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 创建新行程
app.post('/api/itineraries', async (req, res) => {
  try {
    const { title, start_date, end_date } = req.body;
    const [result] = await pool.execute(
      'INSERT INTO itineraries (title, start_date, end_date) VALUES (?, ?, ?)',
      [title, start_date, end_date]
    );
    res.json({ id: result.insertId, title, start_date, end_date });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 获取特定行程的详细信息
app.get('/api/itineraries/:id', async (req, res) => {
  try {
    const itineraryId = req.params.id;

    // 获取行程信息
    const [itineraryRows] = await pool.execute('SELECT * FROM itineraries WHERE id = ?', [itineraryId]);
    if (itineraryRows.length === 0) {
      return res.status(404).json({ error: 'Itinerary not found' });
    }

    const itinerary = itineraryRows[0];

    // 获取城市信息
    const [citiesRows] = await pool.execute(
      'SELECT * FROM cities WHERE itinerary_id = ? ORDER BY arrival_date',
      [itineraryId]
    );

    // 获取每个城市的景点
    const citiesWithAttractions = await Promise.all(
      citiesRows.map(async (city) => {
        const [attractionsRows] = await pool.execute(
          'SELECT * FROM attractions WHERE city_id = ? ORDER BY visit_date, visit_time',
          [city.id]
        );
        return { ...city, attractions: attractionsRows };
      })
    );

    // 获取交通信息
    const [transportationRows] = await pool.execute(
      'SELECT * FROM transportation WHERE itinerary_id = ? ORDER BY departure_time',
      [itineraryId]
    );

    res.json({
      ...itinerary,
      cities: citiesWithAttractions,
      transportation: transportationRows
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 添加城市
app.post('/api/cities', async (req, res) => {
  try {
    const { name, country, latitude, longitude, arrival_date, departure_date, itinerary_id } = req.body;
    const [result] = await pool.execute(
      'INSERT INTO cities (name, country, latitude, longitude, arrival_date, departure_date, itinerary_id) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [name, country, latitude, longitude, arrival_date, departure_date, itinerary_id]
    );
    res.json({ id: result.insertId, name, country, latitude, longitude, arrival_date, departure_date, itinerary_id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 添加景点
app.post('/api/attractions', async (req, res) => {
  try {
    const { name, description, city_id, latitude, longitude, visit_date, visit_time, category, rating } = req.body;
    const [result] = await pool.execute(
      'INSERT INTO attractions (name, description, city_id, latitude, longitude, visit_date, visit_time, category, rating) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [name, description, city_id, latitude, longitude, visit_date, visit_time, category, rating]
    );
    res.json({ id: result.insertId, name, description, city_id, latitude, longitude, visit_date, visit_time, category, rating });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 添加交通
app.post('/api/transportation', async (req, res) => {
  try {
    const { from_city_id, to_city_id, transport_type, departure_time, arrival_time, duration, cost, booking_reference, itinerary_id } = req.body;
    const [result] = await pool.execute(
      'INSERT INTO transportation (from_city_id, to_city_id, transport_type, departure_time, arrival_time, duration, cost, booking_reference, itinerary_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [from_city_id, to_city_id, transport_type, departure_time, arrival_time, duration, cost, booking_reference, itinerary_id]
    );
    res.json({ id: result.insertId, from_city_id, to_city_id, transport_type, departure_time, arrival_time, duration, cost, booking_reference, itinerary_id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 更新城市
app.put('/api/cities/:id', async (req, res) => {
  try {
    const { name, country, latitude, longitude, arrival_date, departure_date } = req.body;
    const cityId = req.params.id;
    await pool.execute(
      'UPDATE cities SET name = ?, country = ?, latitude = ?, longitude = ?, arrival_date = ?, departure_date = ? WHERE id = ?',
      [name, country, latitude, longitude, arrival_date, departure_date, cityId]
    );
    res.json({ id: cityId, name, country, latitude, longitude, arrival_date, departure_date });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 更新景点
app.put('/api/attractions/:id', async (req, res) => {
  try {
    const { name, description, latitude, longitude, visit_date, visit_time, category, rating } = req.body;
    const attractionId = req.params.id;
    await pool.execute(
      'UPDATE attractions SET name = ?, description = ?, latitude = ?, longitude = ?, visit_date = ?, visit_time = ?, category = ?, rating = ? WHERE id = ?',
      [name, description, latitude, longitude, visit_date, visit_time, category, rating, attractionId]
    );
    res.json({ id: attractionId, name, description, latitude, longitude, visit_date, visit_time, category, rating });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 删除景点
app.delete('/api/attractions/:id', async (req, res) => {
  try {
    const attractionId = req.params.id;
    await pool.execute('DELETE FROM attractions WHERE id = ?', [attractionId]);
    res.json({ message: 'Attraction deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 删除城市
app.delete('/api/cities/:id', async (req, res) => {
  try {
    const cityId = req.params.id;
    await pool.execute('DELETE FROM cities WHERE id = ?', [cityId]);
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
    console.log('PlanetScale 连接已关闭');
    process.exit(0);
  });
});
