const db = require('../config/database');
const fs = require('fs');
const path = require('path');

// 检查是否需要初始化数据
const checkIfDataExists = () => {
  return new Promise((resolve) => {
    db.get('SELECT COUNT(*) as count FROM itineraries', (err, row) => {
      if (err) {
        console.error('检查数据失败:', err);
        resolve(false);
      } else {
        resolve(row.count > 0);
      }
    });
  });
};

// 初始化数据
const initData = async () => {
  try {
    const dataExists = await checkIfDataExists();

    if (dataExists) {
      console.log('数据已存在，跳过初始化');
      return;
    }

    console.log('开始初始化数据...');

    // 示例行程数据
    const sampleItinerary = {
      title: '20天欧洲深度游',
      start_date: '2024-02-09',
      end_date: '2024-03-08'
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
        departure_date: '2024-02-18'
      },
      {
        name: '马赛',
        country: '法国',
        latitude: 43.2965,
        longitude: 5.3698,
        arrival_date: '2024-02-18',
        departure_date: '2024-02-20'
      },
      {
        name: '阿维尼翁',
        country: '法国',
        latitude: 43.9493,
        longitude: 4.8055,
        arrival_date: '2024-02-20',
        departure_date: '2024-02-22'
      },
      {
        name: '阿尔勒',
        country: '法国',
        latitude: 43.6766,
        longitude: 4.6278,
        arrival_date: '2024-02-22',
        departure_date: '2024-02-24'
      },
      {
        name: '圣特罗佩',
        country: '法国',
        latitude: 43.2671,
        longitude: 6.6392,
        arrival_date: '2024-02-24',
        departure_date: '2024-02-26'
      },
      {
        name: '米兰',
        country: '意大利',
        latitude: 45.4642,
        longitude: 9.1900,
        arrival_date: '2024-02-26',
        departure_date: '2024-02-28'
      },
      {
        name: '佛罗伦萨',
        country: '意大利',
        latitude: 43.7696,
        longitude: 11.2558,
        arrival_date: '2024-02-28',
        departure_date: '2024-03-01'
      },
      {
        name: '威尼斯',
        country: '意大利',
        latitude: 45.4408,
        longitude: 12.3155,
        arrival_date: '2024-03-01',
        departure_date: '2024-03-03'
      },
      {
        name: '罗马',
        country: '意大利',
        latitude: 41.9028,
        longitude: 12.4964,
        arrival_date: '2024-03-03',
        departure_date: '2024-03-05'
      },
      {
        name: '布达佩斯',
        country: '匈牙利',
        latitude: 47.4979,
        longitude: 19.0402,
        arrival_date: '2024-03-05',
        departure_date: '2024-03-07'
      },
      {
        name: '武汉',
        country: '中国',
        latitude: 30.5928,
        longitude: 114.3055,
        arrival_date: '2024-03-08',
        departure_date: '2024-03-08'
      }
    ];

    // 插入行程
    db.run(
      'INSERT INTO itineraries (title, start_date, end_date) VALUES (?, ?, ?)',
      [sampleItinerary.title, sampleItinerary.start_date, sampleItinerary.end_date],
      function (err) {
        if (err) {
          console.error('插入行程失败:', err);
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
                console.log('数据初始化完成！');
              }
            }
          );
        });
      }
    );
  } catch (error) {
    console.error('初始化数据失败:', error);
  }
};

// 如果直接运行此脚本
if (require.main === module) {
  initData().then(() => {
    db.close();
  });
}

module.exports = { initData };
