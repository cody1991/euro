const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const app = express();
const PORT = process.env.PORT || 5001;

// 中间件
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../client/build')));

// Supabase 客户端配置
const supabaseUrl = process.env.SUPABASE_URL || 'https://dqkvszoabqwogljoerrk.supabase.co';
const supabaseKey = process.env.SUPABASE_ANON_KEY || 'your-anon-key';
const supabase = createClient(supabaseUrl, supabaseKey);

// 初始化数据库
const initializeDatabase = async () => {
  try {
    console.log('开始初始化 Supabase REST API 数据...');
    
    // 检查是否已有数据
    const { data: existingItineraries, error: checkError } = await supabase
      .from('itineraries')
      .select('id');
    
    if (checkError) {
      console.log('创建表结构...');
      // 这里需要手动在Supabase控制台创建表，或者使用SQL编辑器
      console.log('请在Supabase控制台的SQL编辑器中运行以下SQL来创建表：');
      console.log(`
        -- 创建行程表
        CREATE TABLE IF NOT EXISTS itineraries (
          id SERIAL PRIMARY KEY,
          title VARCHAR(255) NOT NULL,
          start_date DATE NOT NULL,
          end_date DATE NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        -- 创建城市表
        CREATE TABLE IF NOT EXISTS cities (
          id SERIAL PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          country VARCHAR(255) NOT NULL,
          latitude DECIMAL(10, 8),
          longitude DECIMAL(11, 8),
          arrival_date DATE,
          departure_date DATE,
          itinerary_id INTEGER REFERENCES itineraries(id)
        );

        -- 创建景点表
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
        );

        -- 创建交通表
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
        );
      `);
      return;
    }

    if (existingItineraries && existingItineraries.length > 0) {
      console.log('数据已存在，跳过初始化');
      return;
    }

    // 插入行程
    const { data: itinerary, error: itineraryError } = await supabase
      .from('itineraries')
      .insert([
        {
          title: '20天欧洲深度游',
          start_date: '2024-02-09',
          end_date: '2024-03-08'
        }
      ])
      .select()
      .single();

    if (itineraryError) {
      console.error('插入行程失败:', itineraryError);
      return;
    }

    console.log('行程创建成功，ID:', itinerary.id);

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
    const citiesWithItineraryId = cities.map(city => ({
      ...city,
      itinerary_id: itinerary.id
    }));

    const { data: insertedCities, error: citiesError } = await supabase
      .from('cities')
      .insert(citiesWithItineraryId)
      .select();

    if (citiesError) {
      console.error('插入城市失败:', citiesError);
      return;
    }

    console.log('城市创建成功，数量:', insertedCities.length);
    console.log('Supabase REST API 数据初始化完成');
  } catch (error) {
    console.error('初始化数据失败:', error);
  }
};

// 启动时初始化数据库
initializeDatabase();

// API 路由

// 数据库状态检查
app.get('/api/health', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('itineraries')
      .select('id, title, created_at');
    
    if (error) {
      return res.status(500).json({ 
        status: 'unhealthy',
        database: 'disconnected',
        error: error.message 
      });
    }

    res.json({
      status: 'healthy',
      database: 'connected',
      supabase_url: supabaseUrl,
      itineraries_count: data.length,
      message: 'Supabase REST API 连接正常'
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
    const { data, error } = await supabase
      .from('itineraries')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 创建新行程
app.post('/api/itineraries', async (req, res) => {
  try {
    const { title, start_date, end_date } = req.body;
    const { data, error } = await supabase
      .from('itineraries')
      .insert([{ title, start_date, end_date }])
      .select()
      .single();
    
    if (error) throw error;
    res.json(data);
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
    const { data: itinerary, error: itineraryError } = await supabase
      .from('itineraries')
      .select('*')
      .eq('id', itineraryId)
      .single();

    if (itineraryError) {
      console.log(`[DEBUG] 行程查询错误: ${itineraryError.message}`);
      return res.status(404).json({ error: 'Itinerary not found' });
    }

    console.log(`[DEBUG] 找到行程: ${itinerary.title}`);

    // 获取城市信息
    const { data: cities, error: citiesError } = await supabase
      .from('cities')
      .select('*')
      .eq('itinerary_id', itineraryId)
      .order('arrival_date');

    if (citiesError) {
      console.log(`[DEBUG] 城市查询错误: ${citiesError.message}`);
      return res.status(500).json({ error: citiesError.message });
    }

    console.log(`[DEBUG] 找到城市数量: ${cities.length}`);

    // 获取每个城市的景点
    const citiesWithAttractions = await Promise.all(
      cities.map(async (city) => {
        const { data: attractions, error: attractionsError } = await supabase
          .from('attractions')
          .select('*')
          .eq('city_id', city.id)
          .order('visit_date');

        if (attractionsError) {
          console.log(`[DEBUG] 景点查询错误: ${attractionsError.message}`);
          return { ...city, attractions: [] };
        }

        return { ...city, attractions: attractions || [] };
      })
    );

    // 获取交通信息
    const { data: transportation, error: transportationError } = await supabase
      .from('transportation')
      .select('*')
      .eq('itinerary_id', itineraryId)
      .order('departure_time');

    if (transportationError) {
      console.log(`[DEBUG] 交通查询错误: ${transportationError.message}`);
    }

    res.json({
      ...itinerary,
      cities: citiesWithAttractions,
      transportation: transportation || []
    });
  } catch (error) {
    console.error('获取行程详情失败:', error);
    res.status(500).json({ error: error.message });
  }
});

// 添加城市
app.post('/api/cities', async (req, res) => {
  try {
    const { name, country, latitude, longitude, arrival_date, departure_date, itinerary_id } = req.body;
    const { data, error } = await supabase
      .from('cities')
      .insert([{ name, country, latitude, longitude, arrival_date, departure_date, itinerary_id }])
      .select()
      .single();
    
    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 添加景点
app.post('/api/attractions', async (req, res) => {
  try {
    const { name, description, city_id, latitude, longitude, visit_date, visit_time, category, rating } = req.body;
    const { data, error } = await supabase
      .from('attractions')
      .insert([{ name, description, city_id, latitude, longitude, visit_date, visit_time, category, rating }])
      .select()
      .single();
    
    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 添加交通
app.post('/api/transportation', async (req, res) => {
  try {
    const { from_city_id, to_city_id, transport_type, departure_time, arrival_time, duration, cost, booking_reference, itinerary_id } = req.body;
    const { data, error } = await supabase
      .from('transportation')
      .insert([{ from_city_id, to_city_id, transport_type, departure_time, arrival_time, duration, cost, booking_reference, itinerary_id }])
      .select()
      .single();
    
    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 更新城市
app.put('/api/cities/:id', async (req, res) => {
  try {
    const { name, country, latitude, longitude, arrival_date, departure_date } = req.body;
    const cityId = req.params.id;
    const { data, error } = await supabase
      .from('cities')
      .update({ name, country, latitude, longitude, arrival_date, departure_date })
      .eq('id', cityId)
      .select()
      .single();
    
    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 更新景点
app.put('/api/attractions/:id', async (req, res) => {
  try {
    const { name, description, latitude, longitude, visit_date, visit_time, category, rating } = req.body;
    const attractionId = req.params.id;
    const { data, error } = await supabase
      .from('attractions')
      .update({ name, description, latitude, longitude, visit_date, visit_time, category, rating })
      .eq('id', attractionId)
      .select()
      .single();
    
    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 删除景点
app.delete('/api/attractions/:id', async (req, res) => {
  try {
    const attractionId = req.params.id;
    const { error } = await supabase
      .from('attractions')
      .delete()
      .eq('id', attractionId);
    
    if (error) throw error;
    res.json({ message: 'Attraction deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 删除城市
app.delete('/api/cities/:id', async (req, res) => {
  try {
    const cityId = req.params.id;
    const { error } = await supabase
      .from('cities')
      .delete()
      .eq('id', cityId);
    
    if (error) throw error;
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
  console.log(`Supabase URL: ${supabaseUrl}`);
});
