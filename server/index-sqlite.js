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
    // 城市表
    db.run(`CREATE TABLE IF NOT EXISTS cities (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      country TEXT NOT NULL,
      latitude REAL NOT NULL,
      longitude REAL NOT NULL,
      arrival_date TEXT NOT NULL,
      departure_date TEXT NOT NULL
    )`);

    // 景点表
    db.run(`CREATE TABLE IF NOT EXISTS attractions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      latitude REAL NOT NULL,
      longitude REAL NOT NULL,
      category TEXT,
      rating REAL,
      city_id INTEGER,
      FOREIGN KEY (city_id) REFERENCES cities (id)
    )`);

    // 交通表
    db.run(`CREATE TABLE IF NOT EXISTS transportation (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      transport_type TEXT NOT NULL,
      from_city_id INTEGER NOT NULL,
      to_city_id INTEGER NOT NULL,
      departure_time TEXT,
      arrival_time TEXT,
      duration TEXT,
      FOREIGN KEY (from_city_id) REFERENCES cities (id),
      FOREIGN KEY (to_city_id) REFERENCES cities (id)
    )`);

    // 检查是否有数据
    db.get("SELECT COUNT(*) as count FROM cities", (err, row) => {
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
  // 插入城市数据 - 每个城市只插入一次
  const cities = [
    { name: "阿姆斯特丹", country: "荷兰", latitude: 52.3676, longitude: 4.9041, arrival_date: "2026-02-08", departure_date: "2026-02-09" },
    { name: "巴黎", country: "法国", latitude: 48.8566, longitude: 2.3522, arrival_date: "2026-02-10", departure_date: "2026-02-12" },
    { name: "里昂", country: "法国", latitude: 45.7640, longitude: 4.8357, arrival_date: "2026-02-13", departure_date: "2026-02-13" },
    { name: "马赛", country: "法国", latitude: 43.2965, longitude: 5.3698, arrival_date: "2026-02-14", departure_date: "2026-02-14" },
    { name: "尼斯", country: "法国", latitude: 43.7102, longitude: 7.2620, arrival_date: "2026-02-15", departure_date: "2026-02-15" },
    { name: "摩纳哥", country: "摩纳哥", latitude: 43.7384, longitude: 7.4246, arrival_date: "2026-02-16", departure_date: "2026-02-16" },
    { name: "米兰", country: "意大利", latitude: 45.4642, longitude: 9.1900, arrival_date: "2026-02-17", departure_date: "2026-02-18" },
    { name: "威尼斯", country: "意大利", latitude: 45.4408, longitude: 12.3155, arrival_date: "2026-02-19", departure_date: "2026-02-20" },
    { name: "佛罗伦萨", country: "意大利", latitude: 43.7696, longitude: 11.2558, arrival_date: "2026-02-21", departure_date: "2026-02-22" },
    { name: "罗马", country: "意大利", latitude: 41.9028, longitude: 12.4964, arrival_date: "2026-02-23", departure_date: "2026-02-24" },
    { name: "梵蒂冈", country: "梵蒂冈", latitude: 41.9029, longitude: 12.4534, arrival_date: "2026-02-24", departure_date: "2026-02-24" }
  ];

  cities.forEach((city, index) => {
    db.run(
      "INSERT INTO cities (name, country, latitude, longitude, arrival_date, departure_date) VALUES (?, ?, ?, ?, ?, ?)",
      [city.name, city.country, city.latitude, city.longitude, city.arrival_date, city.departure_date],
      function (err) {
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
    insertAttractions();
  }, 1000);
};

// 插入景点数据
const insertAttractions = () => {
  const attractions = [
    // 阿姆斯特丹
    { name: "梵高博物馆", description: "世界最大的梵高作品收藏", latitude: 52.3584, longitude: 4.8811, category: "博物馆", rating: 4.8, city_name: "阿姆斯特丹" },
    { name: "安妮之家", description: "安妮·弗兰克故居博物馆", latitude: 52.3752, longitude: 4.8840, category: "历史", rating: 4.6, city_name: "阿姆斯特丹" },
    { name: "运河区", description: "联合国教科文组织世界遗产", latitude: 52.3676, longitude: 4.9041, category: "风景", rating: 4.7, city_name: "阿姆斯特丹" },
    { name: "国立博物馆", description: "荷兰国家博物馆", latitude: 52.3600, longitude: 4.8852, category: "博物馆", rating: 4.7, city_name: "阿姆斯特丹" },
    { name: "水坝广场", description: "阿姆斯特丹中心广场", latitude: 52.3730, longitude: 4.8936, category: "地标", rating: 4.5, city_name: "阿姆斯特丹" },

    // 巴黎
    { name: "埃菲尔铁塔", description: "巴黎地标建筑", latitude: 48.8584, longitude: 2.2945, category: "地标", rating: 4.9, city_name: "巴黎" },
    { name: "卢浮宫", description: "世界最大艺术博物馆", latitude: 48.8606, longitude: 2.3376, category: "博物馆", rating: 4.8, city_name: "巴黎" },
    { name: "圣母院", description: "哥特式建筑杰作", latitude: 48.8530, longitude: 2.3499, category: "宗教", rating: 4.7, city_name: "巴黎" },
    { name: "凯旋门", description: "巴黎标志性建筑", latitude: 48.8738, longitude: 2.2950, category: "地标", rating: 4.6, city_name: "巴黎" },
    { name: "凡尔赛宫", description: "法国王宫", latitude: 48.8049, longitude: 2.1204, category: "历史", rating: 4.8, city_name: "巴黎" },
    { name: "香榭丽舍大街", description: "世界最美丽的大街", latitude: 48.8698, longitude: 2.3078, category: "风景", rating: 4.5, city_name: "巴黎" },

    // 里昂
    { name: "富维耶圣母院", description: "里昂地标教堂", latitude: 45.7624, longitude: 4.8227, category: "宗教", rating: 4.6, city_name: "里昂" },
    { name: "里昂老城", description: "联合国教科文组织世界遗产", latitude: 45.7640, longitude: 4.8279, category: "历史", rating: 4.5, city_name: "里昂" },
    { name: "白莱果广场", description: "里昂中心广场", latitude: 45.7578, longitude: 4.8320, category: "风景", rating: 4.3, city_name: "里昂" },

    // 马赛
    { name: "老港", description: "马赛历史港口", latitude: 43.2951, longitude: 5.3750, category: "风景", rating: 4.5, city_name: "马赛" },
    { name: "守护圣母教堂", description: "马赛地标建筑", latitude: 43.2841, longitude: 5.3714, category: "宗教", rating: 4.6, city_name: "马赛" },
    { name: "伊夫岛", description: "基督山伯爵故事发生地", latitude: 43.2798, longitude: 5.3256, category: "历史", rating: 4.4, city_name: "马赛" },

    // 尼斯
    { name: "天使湾", description: "蔚蓝海岸最美海湾", latitude: 43.6959, longitude: 7.2716, category: "海滩", rating: 4.8, city_name: "尼斯" },
    { name: "尼斯老城", description: "充满魅力的历史街区", latitude: 43.6961, longitude: 7.2759, category: "历史", rating: 4.5, city_name: "尼斯" },
    { name: "城堡山", description: "俯瞰尼斯全景", latitude: 43.6959, longitude: 7.2817, category: "风景", rating: 4.6, city_name: "尼斯" },

    // 摩纳哥
    { name: "蒙特卡洛赌场", description: "世界著名赌场", latitude: 43.7404, longitude: 7.4286, category: "娱乐", rating: 4.5, city_name: "摩纳哥" },
    { name: "摩纳哥王宫", description: "格里马尔迪家族宫殿", latitude: 43.7325, longitude: 7.4208, category: "历史", rating: 4.3, city_name: "摩纳哥" },
    { name: "海洋博物馆", description: "世界知名海洋博物馆", latitude: 43.7307, longitude: 7.4254, category: "博物馆", rating: 4.4, city_name: "摩纳哥" },

    // 米兰
    { name: "米兰大教堂", description: "哥特式建筑杰作", latitude: 45.4642, longitude: 9.1900, category: "宗教", rating: 4.7, city_name: "米兰" },
    { name: "斯卡拉歌剧院", description: "世界著名歌剧院", latitude: 45.4676, longitude: 9.1896, category: "文化", rating: 4.6, city_name: "米兰" },
    { name: "最后的晚餐", description: "达芬奇壁画杰作", latitude: 45.4658, longitude: 9.1707, category: "艺术", rating: 4.8, city_name: "米兰" },
    { name: "埃马努埃莱二世长廊", description: "世界最古老的购物中心", latitude: 45.4654, longitude: 9.1897, category: "购物", rating: 4.5, city_name: "米兰" },
    { name: "斯福尔扎城堡", description: "米兰历史城堡", latitude: 45.4707, longitude: 9.1797, category: "历史", rating: 4.4, city_name: "米兰" },

    // 威尼斯
    { name: "圣马可广场", description: "威尼斯中心广场", latitude: 45.4342, longitude: 12.3388, category: "历史", rating: 4.7, city_name: "威尼斯" },
    { name: "大运河", description: "威尼斯主要水道", latitude: 45.4408, longitude: 12.3155, category: "风景", rating: 4.8, city_name: "威尼斯" },
    { name: "里亚托桥", description: "威尼斯标志性桥梁", latitude: 45.4380, longitude: 12.3359, category: "地标", rating: 4.6, city_name: "威尼斯" },
    { name: "圣马可大教堂", description: "拜占庭建筑杰作", latitude: 45.4345, longitude: 12.3398, category: "宗教", rating: 4.7, city_name: "威尼斯" },
    { name: "叹息桥", description: "威尼斯著名桥梁", latitude: 45.4340, longitude: 12.3408, category: "地标", rating: 4.5, city_name: "威尼斯" },

    // 佛罗伦萨
    { name: "圣母百花大教堂", description: "文艺复兴建筑杰作", latitude: 43.7731, longitude: 11.2560, category: "宗教", rating: 4.8, city_name: "佛罗伦萨" },
    { name: "乌菲兹美术馆", description: "文艺复兴艺术宝库", latitude: 43.7685, longitude: 11.2553, category: "博物馆", rating: 4.9, city_name: "佛罗伦萨" },
    { name: "老桥", description: "佛罗伦萨最古老的桥", latitude: 43.7679, longitude: 11.2529, category: "地标", rating: 4.5, city_name: "佛罗伦萨" },
    { name: "学院美术馆", description: "米开朗基罗大卫雕像", latitude: 43.7769, longitude: 11.2589, category: "博物馆", rating: 4.7, city_name: "佛罗伦萨" },
    { name: "米开朗基罗广场", description: "俯瞰佛罗伦萨全景", latitude: 43.7629, longitude: 11.2650, category: "风景", rating: 4.6, city_name: "佛罗伦萨" },

    // 罗马
    { name: "斗兽场", description: "古罗马竞技场", latitude: 41.8902, longitude: 12.4922, category: "历史", rating: 4.9, city_name: "罗马" },
    { name: "古罗马广场", description: "古罗马政治中心", latitude: 41.8925, longitude: 12.4853, category: "历史", rating: 4.7, city_name: "罗马" },
    { name: "特雷维喷泉", description: "罗马最著名的喷泉", latitude: 41.9009, longitude: 12.4833, category: "地标", rating: 4.6, city_name: "罗马" },
    { name: "万神殿", description: "古罗马建筑奇迹", latitude: 41.8986, longitude: 12.4769, category: "历史", rating: 4.8, city_name: "罗马" },
    { name: "西班牙广场", description: "罗马著名广场", latitude: 41.9058, longitude: 12.4823, category: "地标", rating: 4.5, city_name: "罗马" },

    // 梵蒂冈
    { name: "圣彼得大教堂", description: "世界最大的教堂", latitude: 41.9022, longitude: 12.4539, category: "宗教", rating: 4.9, city_name: "梵蒂冈" },
    { name: "西斯廷礼拜堂", description: "米开朗基罗壁画杰作", latitude: 41.9029, longitude: 12.4545, category: "艺术", rating: 4.8, city_name: "梵蒂冈" },
    { name: "梵蒂冈博物馆", description: "世界顶级艺术收藏", latitude: 41.9065, longitude: 12.4536, category: "博物馆", rating: 4.8, city_name: "梵蒂冈" },
    { name: "圣彼得广场", description: "梵蒂冈主广场", latitude: 41.9022, longitude: 12.4568, category: "地标", rating: 4.7, city_name: "梵蒂冈" }
  ];

  // 获取城市ID映射
  db.all("SELECT id, name FROM cities", (err, cities) => {
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
          "INSERT INTO attractions (name, description, latitude, longitude, category, rating, city_id) VALUES (?, ?, ?, ?, ?, ?, ?)",
          [attraction.name, attraction.description, attraction.latitude, attraction.longitude, attraction.category, attraction.rating, cityId],
          function (err) {
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
      insertTransportation(cityMap);
    }, 2000);
  });
};

// 插入交通数据 - 只包含欧洲段主要交通
const insertTransportation = (cityMap) => {
  const transportation = [
    { transport_type: "火车", from_city: "阿姆斯特丹", to_city: "巴黎", departure_time: "2026-02-10 09:00", arrival_time: "2026-02-10 12:30", duration: "3.5小时" },
    { transport_type: "火车", from_city: "巴黎", to_city: "里昂", departure_time: "2026-02-13 10:00", arrival_time: "2026-02-13 12:00", duration: "2小时" },
    { transport_type: "火车", from_city: "里昂", to_city: "马赛", departure_time: "2026-02-14 09:00", arrival_time: "2026-02-14 10:45", duration: "1.75小时" },
    { transport_type: "火车", from_city: "马赛", to_city: "尼斯", departure_time: "2026-02-15 08:30", arrival_time: "2026-02-15 11:00", duration: "2.5小时" },
    { transport_type: "汽车", from_city: "尼斯", to_city: "摩纳哥", departure_time: "2026-02-16 14:00", arrival_time: "2026-02-16 14:30", duration: "30分钟" },
    { transport_type: "火车", from_city: "摩纳哥", to_city: "米兰", departure_time: "2026-02-17 08:00", arrival_time: "2026-02-17 12:30", duration: "4.5小时" },
    { transport_type: "火车", from_city: "米兰", to_city: "威尼斯", departure_time: "2026-02-19 09:00", arrival_time: "2026-02-19 11:30", duration: "2.5小时" },
    { transport_type: "火车", from_city: "威尼斯", to_city: "佛罗伦萨", departure_time: "2026-02-21 09:00", arrival_time: "2026-02-21 11:00", duration: "2小时" },
    { transport_type: "火车", from_city: "佛罗伦萨", to_city: "罗马", departure_time: "2026-02-23 08:00", arrival_time: "2026-02-23 09:30", duration: "1.5小时" },
    { transport_type: "地铁", from_city: "罗马", to_city: "梵蒂冈", departure_time: "2026-02-24 14:00", arrival_time: "2026-02-24 14:20", duration: "20分钟" }
  ];

  transportation.forEach(transport => {
    const fromCityId = cityMap[transport.from_city];
    const toCityId = cityMap[transport.to_city];

    if (fromCityId && toCityId) {
      db.run(
        "INSERT INTO transportation (transport_type, from_city_id, to_city_id, departure_time, arrival_time, duration) VALUES (?, ?, ?, ?, ?, ?)",
        [transport.transport_type, fromCityId, toCityId, transport.departure_time, transport.arrival_time, transport.duration],
        function (err) {
          if (err) {
            console.error(`插入交通 ${transport.transport_type} 时出错:`, err);
            return;
          }
          console.log(`交通 ${transport.transport_type} 插入成功，ID: ${this.lastID}`);
        }
      );
    }
  });
};

// API 路由 - 只保留地图功能需要的接口
app.get('/api/itineraries/:id', (req, res) => {
  // 固定的行程信息
  const itinerary = {
    id: 1,
    title: "2026年欧洲20天深度游",
    start_date: "2026-02-07",
    end_date: "2026-02-26"
  };

  // 获取所有城市数据
  db.all("SELECT * FROM cities ORDER BY arrival_date", (err, cities) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }

    // 为每个城市获取关联的景点数据
    const citiesWithAttractions = [];
    let processedCities = 0;

    if (cities.length === 0) {
      // 获取交通数据
      db.all("SELECT * FROM transportation ORDER BY departure_time", (err, transportation) => {
        if (err) {
          console.error('获取交通数据时出错:', err);
          transportation = [];
        }
        res.json({ ...itinerary, cities: [], transportation: transportation || [] });
      });
      return;
    }

    cities.forEach((city, index) => {
      db.all("SELECT * FROM attractions WHERE city_id = ?", [city.id], (err, attractions) => {
        if (err) {
          console.error(`获取城市 ${city.name} 的景点时出错:`, err);
          attractions = [];
        }

        citiesWithAttractions[index] = {
          ...city,
          attractions: attractions || []
        };

        processedCities++;
        if (processedCities === cities.length) {
          // 所有城市数据都处理完成，获取交通数据
          db.all("SELECT * FROM transportation ORDER BY departure_time", (err, transportation) => {
            if (err) {
              console.error('获取交通数据时出错:', err);
              transportation = [];
            }
            res.json({
              ...itinerary,
              cities: citiesWithAttractions,
              transportation: transportation || []
            });
          });
        }
      });
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
