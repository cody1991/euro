const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const db = require('./config/database');
const { initData } = require('./scripts/initData');

const app = express();
const PORT = process.env.PORT || 5001;

// 中间件
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../client/build')));

// 初始化数据
initData();

// 创建表
db.serialize(() => {
  // 行程表
  db.run(`CREATE TABLE IF NOT EXISTS itineraries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    start_date TEXT NOT NULL,
    end_date TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // 城市表
  db.run(`CREATE TABLE IF NOT EXISTS cities (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    country TEXT NOT NULL,
    latitude REAL,
    longitude REAL,
    arrival_date TEXT,
    departure_date TEXT,
    itinerary_id INTEGER,
    FOREIGN KEY (itinerary_id) REFERENCES itineraries (id)
  )`);

  // 景点表
  db.run(`CREATE TABLE IF NOT EXISTS attractions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    city_id INTEGER,
    latitude REAL,
    longitude REAL,
    visit_date TEXT,
    visit_time TEXT,
    category TEXT,
    rating REAL,
    FOREIGN KEY (city_id) REFERENCES cities (id)
  )`);

  // 交通表
  db.run(`CREATE TABLE IF NOT EXISTS transportation (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    from_city_id INTEGER,
    to_city_id INTEGER,
    transport_type TEXT NOT NULL,
    departure_time TEXT,
    arrival_time TEXT,
    duration TEXT,
    cost REAL,
    booking_reference TEXT,
    itinerary_id INTEGER,
    FOREIGN KEY (from_city_id) REFERENCES cities (id),
    FOREIGN KEY (to_city_id) REFERENCES cities (id),
    FOREIGN KEY (itinerary_id) REFERENCES itineraries (id)
  )`);
});

// API 路由

// 获取所有行程
app.get('/api/itineraries', (req, res) => {
  db.all('SELECT * FROM itineraries ORDER BY created_at DESC', (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// 创建新行程
app.post('/api/itineraries', (req, res) => {
  const { title, start_date, end_date } = req.body;
  db.run(
    'INSERT INTO itineraries (title, start_date, end_date) VALUES (?, ?, ?)',
    [title, start_date, end_date],
    function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ id: this.lastID, title, start_date, end_date });
    }
  );
});

// 获取特定行程的详细信息
app.get('/api/itineraries/:id', (req, res) => {
  const itineraryId = req.params.id;

  db.get('SELECT * FROM itineraries WHERE id = ?', [itineraryId], (err, itinerary) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (!itinerary) {
      res.status(404).json({ error: 'Itinerary not found' });
      return;
    }

    // 获取城市信息
    db.all(
      'SELECT * FROM cities WHERE itinerary_id = ? ORDER BY arrival_date',
      [itineraryId],
      (err, cities) => {
        if (err) {
          res.status(500).json({ error: err.message });
          return;
        }

        // 获取每个城市的景点
        const cityPromises = cities.map(city => {
          return new Promise((resolve) => {
            db.all(
              'SELECT * FROM attractions WHERE city_id = ? ORDER BY visit_date, visit_time',
              [city.id],
              (err, attractions) => {
                if (err) {
                  resolve({ ...city, attractions: [] });
                } else {
                  resolve({ ...city, attractions });
                }
              }
            );
          });
        });

        Promise.all(cityPromises).then(citiesWithAttractions => {
          // 获取交通信息
          db.all(
            'SELECT * FROM transportation WHERE itinerary_id = ? ORDER BY departure_time',
            [itineraryId],
            (err, transportation) => {
              if (err) {
                res.status(500).json({ error: err.message });
                return;
              }

              res.json({
                ...itinerary,
                cities: citiesWithAttractions,
                transportation
              });
            }
          );
        });
      }
    );
  });
});

// 添加城市
app.post('/api/cities', (req, res) => {
  const { name, country, latitude, longitude, arrival_date, departure_date, itinerary_id } = req.body;
  db.run(
    'INSERT INTO cities (name, country, latitude, longitude, arrival_date, departure_date, itinerary_id) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [name, country, latitude, longitude, arrival_date, departure_date, itinerary_id],
    function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ id: this.lastID, name, country, latitude, longitude, arrival_date, departure_date, itinerary_id });
    }
  );
});

// 添加景点
app.post('/api/attractions', (req, res) => {
  const { name, description, city_id, latitude, longitude, visit_date, visit_time, category, rating } = req.body;
  db.run(
    'INSERT INTO attractions (name, description, city_id, latitude, longitude, visit_date, visit_time, category, rating) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [name, description, city_id, latitude, longitude, visit_date, visit_time, category, rating],
    function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ id: this.lastID, name, description, city_id, latitude, longitude, visit_date, visit_time, category, rating });
    }
  );
});

// 添加交通
app.post('/api/transportation', (req, res) => {
  const { from_city_id, to_city_id, transport_type, departure_time, arrival_time, duration, cost, booking_reference, itinerary_id } = req.body;
  db.run(
    'INSERT INTO transportation (from_city_id, to_city_id, transport_type, departure_time, arrival_time, duration, cost, booking_reference, itinerary_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [from_city_id, to_city_id, transport_type, departure_time, arrival_time, duration, cost, booking_reference, itinerary_id],
    function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ id: this.lastID, from_city_id, to_city_id, transport_type, departure_time, arrival_time, duration, cost, booking_reference, itinerary_id });
    }
  );
});

// 更新城市
app.put('/api/cities/:id', (req, res) => {
  const { name, country, latitude, longitude, arrival_date, departure_date } = req.body;
  const cityId = req.params.id;

  db.run(
    'UPDATE cities SET name = ?, country = ?, latitude = ?, longitude = ?, arrival_date = ?, departure_date = ? WHERE id = ?',
    [name, country, latitude, longitude, arrival_date, departure_date, cityId],
    function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ id: cityId, name, country, latitude, longitude, arrival_date, departure_date });
    }
  );
});

// 更新景点
app.put('/api/attractions/:id', (req, res) => {
  const { name, description, latitude, longitude, visit_date, visit_time, category, rating } = req.body;
  const attractionId = req.params.id;

  db.run(
    'UPDATE attractions SET name = ?, description = ?, latitude = ?, longitude = ?, visit_date = ?, visit_time = ?, category = ?, rating = ? WHERE id = ?',
    [name, description, latitude, longitude, visit_date, visit_time, category, rating, attractionId],
    function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ id: attractionId, name, description, latitude, longitude, visit_date, visit_time, category, rating });
    }
  );
});

// 删除景点
app.delete('/api/attractions/:id', (req, res) => {
  const attractionId = req.params.id;

  db.run('DELETE FROM attractions WHERE id = ?', [attractionId], function (err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ message: 'Attraction deleted successfully' });
  });
});

// 删除城市
app.delete('/api/cities/:id', (req, res) => {
  const cityId = req.params.id;

  db.run('DELETE FROM cities WHERE id = ?', [cityId], function (err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ message: 'City deleted successfully' });
  });
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
  db.close((err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('数据库连接已关闭');
    process.exit(0);
  });
});
