const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./travel_planner.db');

// 示例行程数据
const sampleItinerary = {
  title: '20天欧洲深度游',
  start_date: '2024-02-09',
  end_date: '2024-03-04'
};

// 示例城市数据
const sampleCities = [
  {
    name: '武汉',
    country: '中国',
    latitude: 30.5928,
    longitude: 114.3055,
    arrival_date: '2024-02-09',
    departure_date: '2024-02-09'
  },
  {
    name: '阿姆斯特丹',
    country: '荷兰',
    latitude: 52.3676,
    longitude: 4.9041,
    arrival_date: '2024-02-09',
    departure_date: '2024-02-12'
  },
  {
    name: '巴黎',
    country: '法国',
    latitude: 48.8566,
    longitude: 2.3522,
    arrival_date: '2024-02-12',
    departure_date: '2024-02-16'
  },
  {
    name: '尼斯',
    country: '法国',
    latitude: 43.7102,
    longitude: 7.2620,
    arrival_date: '2024-02-16',
    departure_date: '2024-02-20'
  },
  {
    name: '米兰',
    country: '意大利',
    latitude: 45.4642,
    longitude: 9.1900,
    arrival_date: '2024-02-20',
    departure_date: '2024-02-22'
  },
  {
    name: '佛罗伦萨',
    country: '意大利',
    latitude: 43.7696,
    longitude: 11.2558,
    arrival_date: '2024-02-22',
    departure_date: '2024-02-24'
  },
  {
    name: '威尼斯',
    country: '意大利',
    latitude: 45.4408,
    longitude: 12.3155,
    arrival_date: '2024-02-24',
    departure_date: '2024-02-26'
  },
  {
    name: '罗马',
    country: '意大利',
    latitude: 41.9028,
    longitude: 12.4964,
    arrival_date: '2024-02-28',
    departure_date: '2024-03-02'
  },
  {
    name: '布达佩斯',
    country: '匈牙利',
    latitude: 47.4979,
    longitude: 19.0402,
    arrival_date: '2024-03-02',
    departure_date: '2024-03-04'
  },
  {
    name: '武汉',
    country: '中国',
    latitude: 30.5928,
    longitude: 114.3055,
    arrival_date: '2024-03-05',
    departure_date: '2024-03-05'
  }
];

// 示例景点数据
const sampleAttractions = [
  // 阿姆斯特丹
  {
    city_name: '阿姆斯特丹',
    name: '梵高博物馆',
    description: '收藏了世界上最多的梵高作品',
    latitude: 52.3584,
    longitude: 4.8811,
    visit_date: '2024-02-10',
    visit_time: '10:00',
    category: '博物馆',
    rating: 4.8
  },
  {
    city_name: '阿姆斯特丹',
    name: '安妮·弗兰克之家',
    description: '二战期间安妮·弗兰克躲藏的地方',
    latitude: 52.3752,
    longitude: 4.8841,
    visit_date: '2024-02-10',
    visit_time: '14:00',
    category: '历史建筑',
    rating: 4.5
  },
  {
    city_name: '阿姆斯特丹',
    name: '运河区',
    description: '联合国教科文组织世界遗产',
    latitude: 52.3676,
    longitude: 4.9041,
    visit_date: '2024-02-11',
    visit_time: '09:00',
    category: '历史建筑',
    rating: 4.7
  },

  // 巴黎
  {
    city_name: '巴黎',
    name: '埃菲尔铁塔',
    description: '巴黎的标志性建筑',
    latitude: 48.8584,
    longitude: 2.2945,
    visit_date: '2024-02-13',
    visit_time: '10:00',
    category: '历史建筑',
    rating: 4.6
  },
  {
    city_name: '巴黎',
    name: '卢浮宫',
    description: '世界最大的艺术博物馆',
    latitude: 48.8606,
    longitude: 2.3376,
    visit_date: '2024-02-13',
    visit_time: '14:00',
    category: '博物馆',
    rating: 4.7
  },
  {
    city_name: '巴黎',
    name: '圣母院',
    description: '哥特式建筑杰作',
    latitude: 48.8530,
    longitude: 2.3499,
    visit_date: '2024-02-14',
    visit_time: '10:00',
    category: '历史建筑',
    rating: 4.5
  },
  {
    city_name: '巴黎',
    name: '香榭丽舍大街',
    description: '巴黎最著名的购物街',
    latitude: 48.8698,
    longitude: 2.3076,
    visit_date: '2024-02-14',
    visit_time: '16:00',
    category: '购物',
    rating: 4.3
  },

  // 尼斯
  {
    city_name: '尼斯',
    name: '天使湾',
    description: '蔚蓝海岸最美丽的海湾',
    latitude: 43.6959,
    longitude: 7.2644,
    visit_date: '2024-02-17',
    visit_time: '10:00',
    category: '自然景观',
    rating: 4.8
  },
  {
    city_name: '尼斯',
    name: '尼斯老城',
    description: '充满历史魅力的老城区',
    latitude: 43.6961,
    longitude: 7.2756,
    visit_date: '2024-02-17',
    visit_time: '14:00',
    category: '历史建筑',
    rating: 4.4
  },
  {
    city_name: '尼斯',
    name: '马蒂斯博物馆',
    description: '收藏马蒂斯作品的博物馆',
    latitude: 43.7200,
    longitude: 7.2750,
    visit_date: '2024-02-18',
    visit_time: '10:00',
    category: '博物馆',
    rating: 4.2
  },

  // 米兰
  {
    city_name: '米兰',
    name: '米兰大教堂',
    description: '哥特式建筑的杰作',
    latitude: 45.4642,
    longitude: 9.1900,
    visit_date: '2024-02-21',
    visit_time: '10:00',
    category: '历史建筑',
    rating: 4.6
  },
  {
    city_name: '米兰',
    name: '斯卡拉歌剧院',
    description: '世界最著名的歌剧院之一',
    latitude: 45.4676,
    longitude: 9.1900,
    visit_date: '2024-02-21',
    visit_time: '14:00',
    category: '娱乐',
    rating: 4.5
  },

  // 佛罗伦萨
  {
    city_name: '佛罗伦萨',
    name: '圣母百花大教堂',
    description: '文艺复兴建筑杰作，佛罗伦萨地标',
    latitude: 43.7731,
    longitude: 11.2560,
    visit_date: '2024-02-23',
    visit_time: '10:00',
    category: '历史建筑',
    rating: 4.8
  },
  {
    city_name: '佛罗伦萨',
    name: '乌菲兹美术馆',
    description: '世界顶级艺术博物馆，收藏文艺复兴杰作',
    latitude: 43.7685,
    longitude: 11.2558,
    visit_date: '2024-02-23',
    visit_time: '14:00',
    category: '博物馆',
    rating: 4.7
  },

  // 威尼斯
  {
    city_name: '威尼斯',
    name: '圣马可广场',
    description: '威尼斯的心脏，欧洲最美的客厅',
    latitude: 45.4342,
    longitude: 12.3388,
    visit_date: '2024-02-25',
    visit_time: '10:00',
    category: '历史建筑',
    rating: 4.8
  },
  {
    city_name: '威尼斯',
    name: '圣马可大教堂',
    description: '拜占庭建筑杰作，金碧辉煌',
    latitude: 45.4342,
    longitude: 12.3388,
    visit_date: '2024-02-25',
    visit_time: '14:00',
    category: '历史建筑',
    rating: 4.7
  },

  // 罗马
  {
    city_name: '罗马',
    name: '斗兽场',
    description: '古罗马的象征',
    latitude: 41.8902,
    longitude: 12.4922,
    visit_date: '2024-02-28',
    visit_time: '10:00',
    category: '历史建筑',
    rating: 4.7
  },
  {
    city_name: '罗马',
    name: '梵蒂冈城',
    description: '世界上最小的国家',
    latitude: 41.9022,
    longitude: 12.4539,
    visit_date: '2024-02-28',
    visit_time: '14:00',
    category: '历史建筑',
    rating: 4.8
  },
  {
    city_name: '罗马',
    name: '特雷维喷泉',
    description: '罗马最著名的喷泉',
    latitude: 41.9009,
    longitude: 12.4833,
    visit_date: '2024-03-01',
    visit_time: '10:00',
    category: '历史建筑',
    rating: 4.4
  },

  // 布达佩斯
  {
    city_name: '布达佩斯',
    name: '布达城堡',
    description: '俯瞰多瑙河的历史城堡',
    latitude: 47.4960,
    longitude: 19.0399,
    visit_date: '2024-03-03',
    visit_time: '09:00',
    category: '历史建筑',
    rating: 4.6
  },
  {
    city_name: '布达佩斯',
    name: '国会大厦',
    description: '匈牙利国会所在地',
    latitude: 47.5079,
    longitude: 19.0456,
    visit_date: '2024-03-03',
    visit_time: '14:00',
    category: '历史建筑',
    rating: 4.7
  },
  {
    city_name: '布达佩斯',
    name: '塞切尼温泉浴场',
    description: '欧洲最大的温泉浴场',
    latitude: 47.5156,
    longitude: 19.0800,
    visit_date: '2024-03-03',
    visit_time: '16:00',
    category: '娱乐',
    rating: 4.4
  }
];

// 示例交通数据
const sampleTransportation = [
  {
    from_city: '武汉',
    to_city: '阿姆斯特丹',
    transport_type: '飞机',
    departure_time: '2024-02-09 08:00',
    arrival_time: '2024-02-09 14:00',
    duration: '12小时',
    cost: 5000,
    booking_reference: 'CA1234'
  },
  {
    from_city: '阿姆斯特丹',
    to_city: '巴黎',
    transport_type: '火车',
    departure_time: '2024-02-12 09:00',
    arrival_time: '2024-02-12 12:30',
    duration: '3.5小时',
    cost: 120,
    booking_reference: 'THA1234'
  },
  {
    from_city: '巴黎',
    to_city: '尼斯',
    transport_type: '火车',
    departure_time: '2024-02-16 08:00',
    arrival_time: '2024-02-16 13:00',
    duration: '5小时',
    cost: 80,
    booking_reference: 'THA5678'
  },
  {
    from_city: '尼斯',
    to_city: '米兰',
    transport_type: '火车',
    departure_time: '2024-02-20 09:00',
    arrival_time: '2024-02-20 14:00',
    duration: '5小时',
    cost: 60,
    booking_reference: 'THA9012'
  },
  {
    from_city: '米兰',
    to_city: '佛罗伦萨',
    transport_type: '火车',
    departure_time: '2024-02-22 09:00',
    arrival_time: '2024-02-22 12:00',
    duration: '3小时',
    cost: 50,
    booking_reference: 'THA3456'
  },
  {
    from_city: '佛罗伦萨',
    to_city: '威尼斯',
    transport_type: '火车',
    departure_time: '2024-02-24 09:00',
    arrival_time: '2024-02-24 12:00',
    duration: '3小时',
    cost: 50,
    booking_reference: 'THA4567'
  },
  {
    from_city: '威尼斯',
    to_city: '罗马',
    transport_type: '火车',
    departure_time: '2024-02-26 09:00',
    arrival_time: '2024-02-26 14:00',
    duration: '5小时',
    cost: 70,
    booking_reference: 'THA5678'
  },
  {
    from_city: '罗马',
    to_city: '布达佩斯',
    transport_type: '飞机',
    departure_time: '2024-03-02 10:00',
    arrival_time: '2024-03-02 12:00',
    duration: '2小时',
    cost: 200,
    booking_reference: 'WZ7890'
  },
  {
    from_city: '布达佩斯',
    to_city: '武汉',
    transport_type: '飞机',
    departure_time: '2024-03-04 15:00',
    arrival_time: '2024-03-05 08:00',
    duration: '11小时',
    cost: 4500,
    booking_reference: 'CA5678'
  }
];

// 创建表
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS itineraries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    start_date TEXT NOT NULL,
    end_date TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS cities (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    country TEXT NOT NULL,
    latitude REAL NOT NULL,
    longitude REAL NOT NULL,
    arrival_date TEXT NOT NULL,
    departure_date TEXT NOT NULL,
    itinerary_id INTEGER,
    FOREIGN KEY (itinerary_id) REFERENCES itineraries (id)
  )`);

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

  db.run(`CREATE TABLE IF NOT EXISTS transportation (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    from_city_id INTEGER,
    to_city_id INTEGER,
    transport_type TEXT NOT NULL,
    departure_time TEXT NOT NULL,
    arrival_time TEXT NOT NULL,
    duration TEXT NOT NULL,
    cost REAL,
    booking_reference TEXT,
    itinerary_id INTEGER,
    FOREIGN KEY (from_city_id) REFERENCES cities (id),
    FOREIGN KEY (to_city_id) REFERENCES cities (id),
    FOREIGN KEY (itinerary_id) REFERENCES itineraries (id)
  )`);

  // 插入示例行程
  db.run(
    'INSERT INTO itineraries (title, start_date, end_date) VALUES (?, ?, ?)',
    [sampleItinerary.title, sampleItinerary.start_date, sampleItinerary.end_date],
    function (err) {
      if (err) {
        console.error('插入行程失败:', err);
        db.close();
        return;
      }

      const itineraryId = this.lastID;
      console.log('创建示例行程，ID:', itineraryId);

      // 插入城市数据
      let cityInsertCount = 0;
      const cityMap = new Map();

      sampleCities.forEach((city) => {
        db.run(
          'INSERT INTO cities (name, country, latitude, longitude, arrival_date, departure_date, itinerary_id) VALUES (?, ?, ?, ?, ?, ?, ?)',
          [city.name, city.country, city.latitude, city.longitude, city.arrival_date, city.departure_date, itineraryId],
          function (err) {
            if (err) {
              console.error('插入城市失败:', err);
              return;
            }

            cityMap.set(city.name, this.lastID);
            cityInsertCount++;

            if (cityInsertCount === sampleCities.length) {
              console.log('所有城市插入完成');

              // 插入景点数据
              let attractionInsertCount = 0;
              sampleAttractions.forEach(attraction => {
                const cityId = cityMap.get(attraction.city_name);
                if (cityId) {
                  db.run(
                    'INSERT INTO attractions (name, description, city_id, latitude, longitude, visit_date, visit_time, category, rating) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
                    [attraction.name, attraction.description, cityId, attraction.latitude, attraction.longitude, attraction.visit_date, attraction.visit_time, attraction.category, attraction.rating],
                    function (err) {
                      if (err) {
                        console.error('插入景点失败:', err);
                        return;
                      }
                      attractionInsertCount++;
                      if (attractionInsertCount === sampleAttractions.length) {
                        console.log('所有景点插入完成');

                        // 景点插入完成后，插入交通数据
                        insertTransportationData();
                      }
                    }
                  );
                } else {
                  console.error('找不到城市:', attraction.city_name);
                  attractionInsertCount++;
                  if (attractionInsertCount === sampleAttractions.length) {
                    console.log('所有景点插入完成');
                    insertTransportationData();
                  }
                }
              });

              // 插入交通数据的函数
              function insertTransportationData() {
                let transportInsertCount = 0;
                sampleTransportation.forEach(transport => {
                  const fromCityId = cityMap.get(transport.from_city);
                  const toCityId = cityMap.get(transport.to_city);

                  if (fromCityId && toCityId) {
                    db.run(
                      'INSERT INTO transportation (from_city_id, to_city_id, transport_type, departure_time, arrival_time, duration, cost, booking_reference, itinerary_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
                      [fromCityId, toCityId, transport.transport_type, transport.departure_time, transport.arrival_time, transport.duration, transport.cost, transport.booking_reference, itineraryId],
                      function (err) {
                        if (err) {
                          console.error('插入交通失败:', err);
                          return;
                        }
                        transportInsertCount++;
                        if (transportInsertCount === sampleTransportation.length) {
                          console.log('所有交通信息插入完成');
                          console.log('示例数据初始化完成！');
                          db.close();
                        }
                      }
                    );
                  } else {
                    console.error('找不到城市ID:', transport.from_city, transport.to_city);
                    transportInsertCount++;
                    if (transportInsertCount === sampleTransportation.length) {
                      console.log('所有交通信息插入完成');
                      console.log('示例数据初始化完成！');
                      db.close();
                    }
                  }
                });
              }
            }
          }
        );
      });
    }
  );
});