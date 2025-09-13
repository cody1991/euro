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

              // 插入交通数据
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
        );
      });
    }
  );
});