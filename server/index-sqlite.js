const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 5001;

// 中间件
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../client/build')));

// SQLite 数据库配置
const dbPath = path.join(__dirname, 'travel_planner.db');
const db = new sqlite3.Database(dbPath);

// 初始化数据库
const initializeDatabase = () => {
  console.log('初始化 SQLite 数据库...');

  // 创建表
  db.serialize(() => {
    // 行程表
    db.run(`CREATE TABLE IF NOT EXISTS itineraries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      start_date TEXT,
      end_date TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // 城市表
    db.run(`CREATE TABLE IF NOT EXISTS cities (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      country TEXT,
      latitude REAL,
      longitude REAL,
      visit_date TEXT,
      itinerary_id INTEGER,
      FOREIGN KEY (itinerary_id) REFERENCES itineraries (id)
    )`);

    // 景点表
    db.run(`CREATE TABLE IF NOT EXISTS attractions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      latitude REAL,
      longitude REAL,
      visit_date TEXT,
      visit_time TEXT,
      category TEXT,
      rating REAL,
      city_id INTEGER,
      FOREIGN KEY (city_id) REFERENCES cities (id)
    )`);

    // 交通表
    db.run(`CREATE TABLE IF NOT EXISTS transportation (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      type TEXT NOT NULL,
      from_city_id INTEGER,
      to_city_id INTEGER,
      departure_time TEXT,
      arrival_time TEXT,
      cost REAL,
      booking_reference TEXT,
      FOREIGN KEY (from_city_id) REFERENCES cities (id),
      FOREIGN KEY (to_city_id) REFERENCES cities (id)
    )`);

    // 检查是否有数据
    db.get("SELECT COUNT(*) as count FROM itineraries", (err, row) => {
      if (err) {
        console.error('检查数据时出错:', err);
        return;
      }

      if (row.count === 0) {
        console.log('插入初始数据...');
        insertInitialData();
      } else {
        console.log('数据库已有数据，跳过初始化');
      }
    });
  });
};

// 插入初始数据
const insertInitialData = () => {
  const itineraryData = {
    title: "2024年欧洲20天之旅",
    description: "从武汉出发的欧洲深度游",
    start_date: "2024-02-09",
    end_date: "2024-03-04"
  };

  db.run(
    "INSERT INTO itineraries (title, description, start_date, end_date) VALUES (?, ?, ?, ?)",
    [itineraryData.title, itineraryData.description, itineraryData.start_date, itineraryData.end_date],
    function(err) {
      if (err) {
        console.error('插入行程数据时出错:', err);
        return;
      }

      const itineraryId = this.lastID;
      console.log('行程ID:', itineraryId);

      // 插入城市数据
      const cities = [
        { name: "武汉", country: "中国", latitude: 30.5928, longitude: 114.3055, visit_date: "2024-02-09" },
        { name: "阿姆斯特丹", country: "荷兰", latitude: 52.3676, longitude: 4.9041, visit_date: "2024-02-10" },
        { name: "巴黎", country: "法国", latitude: 48.8566, longitude: 2.3522, visit_date: "2024-02-13" },
        { name: "尼斯", country: "法国", latitude: 43.7102, longitude: 7.2620, visit_date: "2024-02-16" },
        { name: "戛纳", country: "法国", latitude: 43.5528, longitude: 7.0174, visit_date: "2024-02-17" },
        { name: "摩纳哥", country: "摩纳哥", latitude: 43.7384, longitude: 7.4246, visit_date: "2024-02-18" },
        { name: "米兰", country: "意大利", latitude: 45.4642, longitude: 9.1900, visit_date: "2024-02-19" },
        { name: "佛罗伦萨", country: "意大利", latitude: 43.7696, longitude: 11.2558, visit_date: "2024-02-21" },
        { name: "威尼斯", country: "意大利", latitude: 45.4408, longitude: 12.3155, visit_date: "2024-02-23" },
        { name: "五渔村", country: "意大利", latitude: 44.1270, longitude: 9.7089, visit_date: "2024-02-25" },
        { name: "比萨", country: "意大利", latitude: 43.7228, longitude: 10.4017, visit_date: "2024-02-26" },
        { name: "那不勒斯", country: "意大利", latitude: 40.8518, longitude: 14.2681, visit_date: "2024-02-27" },
        { name: "罗马", country: "意大利", latitude: 41.9028, longitude: 12.4964, visit_date: "2024-02-28" },
        { name: "布达佩斯", country: "匈牙利", latitude: 47.4979, longitude: 19.0402, visit_date: "2024-03-01" },
        { name: "武汉", country: "中国", latitude: 30.5928, longitude: 114.3055, visit_date: "2024-03-04" }
      ];

      cities.forEach((city, index) => {
        db.run(
          "INSERT INTO cities (name, country, latitude, longitude, visit_date, itinerary_id) VALUES (?, ?, ?, ?, ?, ?)",
          [city.name, city.country, city.latitude, city.longitude, city.visit_date, itineraryId],
          function(err) {
            if (err) {
              console.error(`插入城市 ${city.name} 时出错:`, err);
              return;
            }
            console.log(`城市 ${city.name} 插入成功，ID: ${this.lastID}`);
          }
        );
      });

      // 插入景点数据
      setTimeout(() => {
        insertAttractions(itineraryId);
      }, 1000);
    }
  );
};

// 插入景点数据
const insertAttractions = (itineraryId) => {
  const attractions = [
    // 阿姆斯特丹
    { name: "梵高博物馆", description: "世界最大的梵高作品收藏", latitude: 52.3584, longitude: 4.8811, visit_date: "2024-02-10", visit_time: "09:00", category: "博物馆", rating: 4.8, city_name: "阿姆斯特丹" },
    { name: "安妮之家", description: "安妮·弗兰克故居博物馆", latitude: 52.3752, longitude: 4.8840, visit_date: "2024-02-10", visit_time: "14:00", category: "历史", rating: 4.6, city_name: "阿姆斯特丹" },
    { name: "运河区", description: "联合国教科文组织世界遗产", latitude: 52.3676, longitude: 4.9041, visit_date: "2024-02-11", visit_time: "10:00", category: "风景", rating: 4.7, city_name: "阿姆斯特丹" },
    
    // 巴黎
    { name: "埃菲尔铁塔", description: "巴黎地标建筑", latitude: 48.8584, longitude: 2.2945, visit_date: "2024-02-13", visit_time: "09:00", category: "地标", rating: 4.9, city_name: "巴黎" },
    { name: "卢浮宫", description: "世界最大艺术博物馆", latitude: 48.8606, longitude: 2.3376, visit_date: "2024-02-14", visit_time: "10:00", category: "博物馆", rating: 4.8, city_name: "巴黎" },
    { name: "圣母院", description: "哥特式建筑杰作", latitude: 48.8530, longitude: 2.3499, visit_date: "2024-02-14", visit_time: "15:00", category: "宗教", rating: 4.7, city_name: "巴黎" },
    
    // 尼斯
    { name: "天使湾", description: "蔚蓝海岸最美海湾", latitude: 43.6959, longitude: 7.2716, visit_date: "2024-02-16", visit_time: "10:00", category: "海滩", rating: 4.8, city_name: "尼斯" },
    { name: "老城区", description: "尼斯历史中心", latitude: 43.6961, longitude: 7.2759, visit_date: "2024-02-16", visit_time: "14:00", category: "历史", rating: 4.5, city_name: "尼斯" },
    
    // 戛纳
    { name: "戛纳电影节宫", description: "戛纳电影节举办地", latitude: 43.5448, longitude: 7.0194, visit_date: "2024-02-17", visit_time: "10:00", category: "文化", rating: 4.6, city_name: "戛纳" },
    { name: "星光大道", description: "戛纳海滨大道", latitude: 43.5528, longitude: 7.0174, visit_date: "2024-02-17", visit_time: "15:00", category: "风景", rating: 4.4, city_name: "戛纳" },
    
    // 摩纳哥
    { name: "蒙特卡洛赌场", description: "世界著名赌场", latitude: 43.7404, longitude: 7.4286, visit_date: "2024-02-18", visit_time: "20:00", category: "娱乐", rating: 4.5, city_name: "摩纳哥" },
    { name: "摩纳哥王宫", description: "格里马尔迪家族宫殿", latitude: 43.7325, longitude: 7.4208, visit_date: "2024-02-18", visit_time: "10:00", category: "历史", rating: 4.3, city_name: "摩纳哥" },
    
    // 米兰
    { name: "米兰大教堂", description: "哥特式建筑杰作", latitude: 45.4642, longitude: 9.1900, visit_date: "2024-02-19", visit_time: "09:00", category: "宗教", rating: 4.7, city_name: "米兰" },
    { name: "斯卡拉歌剧院", description: "世界著名歌剧院", latitude: 45.4676, longitude: 9.1896, visit_date: "2024-02-19", visit_time: "15:00", category: "文化", rating: 4.6, city_name: "米兰" },
    
    // 佛罗伦萨
    { name: "圣母百花大教堂", description: "文艺复兴建筑杰作", latitude: 43.7731, longitude: 11.2560, visit_date: "2024-02-21", visit_time: "09:00", category: "宗教", rating: 4.8, city_name: "佛罗伦萨" },
    { name: "乌菲兹美术馆", description: "文艺复兴艺术宝库", latitude: 43.7685, longitude: 11.2553, visit_date: "2024-02-21", visit_time: "14:00", category: "博物馆", rating: 4.9, city_name: "佛罗伦萨" },
    
    // 威尼斯
    { name: "圣马可广场", description: "威尼斯中心广场", latitude: 45.4342, longitude: 12.3388, visit_date: "2024-02-23", visit_time: "09:00", category: "历史", rating: 4.7, city_name: "威尼斯" },
    { name: "大运河", description: "威尼斯主要水道", latitude: 45.4408, longitude: 12.3155, visit_date: "2024-02-23", visit_time: "15:00", category: "风景", rating: 4.8, city_name: "威尼斯" },
    
    // 五渔村
    { name: "马纳罗拉", description: "五渔村最美村庄", latitude: 44.1080, longitude: 9.7300, visit_date: "2024-02-25", visit_time: "10:00", category: "风景", rating: 4.9, city_name: "五渔村" },
    { name: "韦尔纳扎", description: "五渔村历史村庄", latitude: 44.1350, longitude: 9.6833, visit_date: "2024-02-25", visit_time: "14:00", category: "历史", rating: 4.6, city_name: "五渔村" },
    
    // 比萨
    { name: "比萨斜塔", description: "世界著名斜塔", latitude: 43.7230, longitude: 10.3966, visit_date: "2024-02-26", visit_time: "10:00", category: "地标", rating: 4.5, city_name: "比萨" },
    { name: "比萨大教堂", description: "罗马式建筑杰作", latitude: 43.7230, longitude: 10.3966, visit_date: "2024-02-26", visit_time: "14:00", category: "宗教", rating: 4.4, city_name: "比萨" },
    
    // 那不勒斯
    { name: "庞贝古城", description: "古罗马城市遗址", latitude: 40.7489, longitude: 14.4848, visit_date: "2024-02-27", visit_time: "09:00", category: "历史", rating: 4.8, city_name: "那不勒斯" },
    { name: "维苏威火山", description: "活火山", latitude: 40.8220, longitude: 14.4289, visit_date: "2024-02-27", visit_time: "15:00", category: "自然", rating: 4.6, city_name: "那不勒斯" },
    
    // 罗马
    { name: "斗兽场", description: "古罗马竞技场", latitude: 41.8902, longitude: 12.4922, visit_date: "2024-02-28", visit_time: "09:00", category: "历史", rating: 4.9, city_name: "罗马" },
    { name: "梵蒂冈", description: "天主教中心", latitude: 41.9022, longitude: 12.4539, visit_date: "2024-02-28", visit_time: "14:00", category: "宗教", rating: 4.8, city_name: "罗马" },
    { name: "万神殿", description: "古罗马建筑杰作", latitude: 41.8986, longitude: 12.4769, visit_date: "2024-03-01", visit_time: "10:00", category: "历史", rating: 4.7, city_name: "罗马" },
    
    // 布达佩斯
    { name: "布达城堡", description: "匈牙利历史建筑", latitude: 47.4960, longitude: 19.0399, visit_date: "2024-03-01", visit_time: "09:00", category: "历史", rating: 4.6, city_name: "布达佩斯" },
    { name: "国会大厦", description: "匈牙利议会大厦", latitude: 47.5079, longitude: 19.0458, visit_date: "2024-03-01", visit_time: "14:00", category: "政治", rating: 4.5, city_name: "布达佩斯" },
    { name: "温泉浴场", description: "布达佩斯温泉文化", latitude: 47.4979, longitude: 19.0402, visit_date: "2024-03-02", visit_time: "10:00", category: "休闲", rating: 4.4, city_name: "布达佩斯" }
  ];

  // 获取城市ID映射
  db.all("SELECT id, name FROM cities WHERE itinerary_id = ?", [itineraryId], (err, cities) => {
    if (err) {
      console.error('获取城市数据时出错:', err);
      return;
    }

    const cityMap = {};
    cities.forEach(city => {
      cityMap[city.name] = city.id;
    });

    attractions.forEach(attraction => {
      const cityId = cityMap[attraction.city_name];
      if (cityId) {
        db.run(
          "INSERT INTO attractions (name, description, latitude, longitude, visit_date, visit_time, category, rating, city_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
          [attraction.name, attraction.description, attraction.latitude, attraction.longitude, attraction.visit_date, attraction.visit_time, attraction.category, attraction.rating, cityId],
          function(err) {
            if (err) {
              console.error(`插入景点 ${attraction.name} 时出错:`, err);
              return;
            }
            console.log(`景点 ${attraction.name} 插入成功，ID: ${this.lastID}`);
          }
        );
      }
    });

    // 插入交通数据
    setTimeout(() => {
      insertTransportation(itineraryId, cityMap);
    }, 2000);
  });
};

// 插入交通数据
const insertTransportation = (itineraryId, cityMap) => {
  const transportation = [
    { type: "飞机", from_city: "武汉", to_city: "阿姆斯特丹", departure_time: "2024-02-09 20:00", arrival_time: "2024-02-10 08:00", cost: 800, booking_reference: "CA123" },
    { type: "火车", from_city: "阿姆斯特丹", to_city: "巴黎", departure_time: "2024-02-13 09:00", arrival_time: "2024-02-13 12:00", cost: 120, booking_reference: "TGV456" },
    { type: "火车", from_city: "巴黎", to_city: "尼斯", departure_time: "2024-02-16 08:00", arrival_time: "2024-02-16 14:00", cost: 80, booking_reference: "TGV789" },
    { type: "汽车", from_city: "尼斯", to_city: "戛纳", departure_time: "2024-02-17 09:00", arrival_time: "2024-02-17 10:00", cost: 20, booking_reference: "BUS001" },
    { type: "汽车", from_city: "戛纳", to_city: "摩纳哥", departure_time: "2024-02-18 09:00", arrival_time: "2024-02-18 10:00", cost: 15, booking_reference: "BUS002" },
    { type: "飞机", from_city: "摩纳哥", to_city: "米兰", departure_time: "2024-02-19 08:00", arrival_time: "2024-02-19 09:30", cost: 150, booking_reference: "AZ123" },
    { type: "火车", from_city: "米兰", to_city: "佛罗伦萨", departure_time: "2024-02-21 09:00", arrival_time: "2024-02-21 11:00", cost: 60, booking_reference: "TGV321" },
    { type: "火车", from_city: "佛罗伦萨", to_city: "威尼斯", departure_time: "2024-02-23 09:00", arrival_time: "2024-02-23 12:00", cost: 70, booking_reference: "TGV654" },
    { type: "火车", from_city: "威尼斯", to_city: "五渔村", departure_time: "2024-02-25 08:00", arrival_time: "2024-02-25 11:00", cost: 50, booking_reference: "TGV987" },
    { type: "火车", from_city: "五渔村", to_city: "比萨", departure_time: "2024-02-26 09:00", arrival_time: "2024-02-26 10:30", cost: 30, booking_reference: "TGV147" },
    { type: "火车", from_city: "比萨", to_city: "那不勒斯", departure_time: "2024-02-27 08:00", arrival_time: "2024-02-27 12:00", cost: 80, booking_reference: "TGV258" },
    { type: "火车", from_city: "那不勒斯", to_city: "罗马", departure_time: "2024-02-28 09:00", arrival_time: "2024-02-28 10:30", cost: 40, booking_reference: "TGV369" },
    { type: "飞机", from_city: "罗马", to_city: "布达佩斯", departure_time: "2024-03-01 08:00", arrival_time: "2024-03-01 10:00", cost: 120, booking_reference: "WZ456" },
    { type: "飞机", from_city: "布达佩斯", to_city: "武汉", departure_time: "2024-03-04 12:00", arrival_time: "2024-03-05 06:00", cost: 900, booking_reference: "CA789" }
  ];

  transportation.forEach(transport => {
    const fromCityId = cityMap[transport.from_city];
    const toCityId = cityMap[transport.to_city];
    
    if (fromCityId && toCityId) {
      db.run(
        "INSERT INTO transportation (type, from_city_id, to_city_id, departure_time, arrival_time, cost, booking_reference) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [transport.type, fromCityId, toCityId, transport.departure_time, transport.arrival_time, transport.cost, transport.booking_reference],
        function(err) {
          if (err) {
            console.error(`插入交通 ${transport.type} 时出错:`, err);
            return;
          }
          console.log(`交通 ${transport.type} 插入成功，ID: ${this.lastID}`);
        }
      );
    }
  });
};

// API 路由
app.get('/api/itineraries', (req, res) => {
  db.all("SELECT * FROM itineraries", (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

app.get('/api/itineraries/:id', (req, res) => {
  const id = req.params.id;
  db.get("SELECT * FROM itineraries WHERE id = ?", [id], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (!row) {
      res.status(404).json({ error: 'Itinerary not found' });
      return;
    }
    res.json(row);
  });
});

app.get('/api/cities', (req, res) => {
  db.all("SELECT * FROM cities ORDER BY visit_date", (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

app.get('/api/cities/:id', (req, res) => {
  const id = req.params.id;
  db.get("SELECT * FROM cities WHERE id = ?", [id], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (!row) {
      res.status(404).json({ error: 'City not found' });
      return;
    }
    res.json(row);
  });
});

app.get('/api/attractions', (req, res) => {
  db.all("SELECT * FROM attractions ORDER BY visit_date, visit_time", (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

app.get('/api/attractions/:id', (req, res) => {
  const id = req.params.id;
  db.get("SELECT * FROM attractions WHERE id = ?", [id], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (!row) {
      res.status(404).json({ error: 'Attraction not found' });
      return;
    }
    res.json(row);
  });
});

app.get('/api/transportation', (req, res) => {
  db.all("SELECT * FROM transportation ORDER BY departure_time", (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

app.get('/api/transportation/:id', (req, res) => {
  const id = req.params.id;
  db.get("SELECT * FROM transportation WHERE id = ?", [id], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (!row) {
      res.status(404).json({ error: 'Transportation not found' });
      return;
    }
    res.json(row);
  });
});

// 健康检查
app.get('/api/health', (req, res) => {
  db.get("SELECT COUNT(*) as count FROM itineraries", (err, row) => {
    if (err) {
      res.status(500).json({ error: 'Database connection failed' });
      return;
    }
    res.json({ 
      status: 'healthy', 
      database: 'sqlite',
      itineraries: row.count 
    });
  });
});

// 服务静态文件
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`SQLite 服务器运行在端口 ${PORT}`);
  console.log(`数据库路径: ${dbPath}`);
  initializeDatabase();
});

// 优雅关闭
process.on('SIGINT', () => {
  console.log('\n正在关闭服务器...');
  db.close((err) => {
    if (err) {
      console.error('关闭数据库时出错:', err);
    } else {
      console.log('数据库连接已关闭');
    }
    process.exit(0);
  });
});
