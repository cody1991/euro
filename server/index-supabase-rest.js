const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
const DataManager = require('./data-manager');
const SchemaManager = require('./schema-manager');

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
      console.log('数据库连接错误:', checkError.message);
      console.log('请检查：');
      console.log('1. Supabase项目是否正常运行');
      console.log('2. 环境变量 SUPABASE_URL 和 SUPABASE_ANON_KEY 是否正确设置');
      console.log('3. 表结构是否已创建');
      console.log('4. RLS策略是否已设置');
      return;
    }

    if (existingItineraries && existingItineraries.length > 0) {
      console.log('检测到已有行程数据，但继续初始化景点和交通数据...');
      // 不直接返回，继续执行景点和交通数据初始化
    }

    // 获取或创建行程
    let itinerary;
    if (existingItineraries && existingItineraries.length > 0) {
      // 使用现有行程
      itinerary = existingItineraries[0];
      console.log('使用现有行程，ID:', itinerary.id);
    } else {
      // 创建新行程
      const { data: newItinerary, error: itineraryError } = await supabase
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

      itinerary = newItinerary;
      console.log('行程创建成功，ID:', itinerary.id);
    }

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

    // 检查城市是否已存在
    const { data: existingCities, error: citiesCheckError } = await supabase
      .from('cities')
      .select('id, name')
      .eq('itinerary_id', itinerary.id);

    let insertedCities;
    if (citiesCheckError) {
      console.error('检查城市失败:', citiesCheckError);
      return;
    }

    if (existingCities && existingCities.length > 0) {
      console.log('城市已存在，使用现有城市数据，数量:', existingCities.length);
      insertedCities = existingCities;
    } else {
      // 插入城市
      const citiesWithItineraryId = cities.map(city => ({
        ...city,
        itinerary_id: itinerary.id
      }));

      const { data: newCities, error: citiesError } = await supabase
        .from('cities')
        .insert(citiesWithItineraryId)
        .select();

      if (citiesError) {
        console.error('插入城市失败:', citiesError);
        return;
      }

      insertedCities = newCities;
      console.log('城市创建成功，数量:', insertedCities.length);
    }

    // 创建城市名称到ID的映射
    const cityMap = {};
    insertedCities.forEach(city => {
      cityMap[city.name] = city.id;
    });

    console.log('城市映射:', cityMap);

    // 先清理现有景点数据，避免重复
    console.log('清理现有景点数据...');
    await supabase
      .from('attractions')
      .delete()
      .neq('id', 0); // 删除所有景点数据

    // 添加景点数据
    const attractions = [
      // 阿姆斯特丹景点
      { name: '安妮之家', description: '安妮·弗兰克博物馆', city_id: cityMap['阿姆斯特丹'], latitude: 52.3751, longitude: 4.8840, visit_date: '2024-02-10', visit_time: '09:00', category: '历史', rating: 4.6 },
      { name: '梵高博物馆', description: '梵高作品收藏', city_id: cityMap['阿姆斯特丹'], latitude: 52.3584, longitude: 4.8811, visit_date: '2024-02-10', visit_time: '14:00', category: '博物馆', rating: 4.8 },
      { name: '运河游船', description: '阿姆斯特丹运河观光', city_id: cityMap['阿姆斯特丹'], latitude: 52.3676, longitude: 4.9041, visit_date: '2024-02-11', visit_time: '10:00', category: '体验', rating: 4.5 },
      
      // 巴黎景点
      { name: '埃菲尔铁塔', description: '巴黎标志性建筑', city_id: cityMap['巴黎'], latitude: 48.8584, longitude: 2.2945, visit_date: '2024-02-13', visit_time: '09:00', category: '地标', rating: 4.8 },
      { name: '卢浮宫', description: '世界著名博物馆', city_id: cityMap['巴黎'], latitude: 48.8606, longitude: 2.3376, visit_date: '2024-02-14', visit_time: '10:00', category: '博物馆', rating: 4.9 },
      { name: '凯旋门', description: '拿破仑凯旋门', city_id: cityMap['巴黎'], latitude: 48.8738, longitude: 2.2950, visit_date: '2024-02-15', visit_time: '14:00', category: '地标', rating: 4.5 },
      
      // 尼斯景点
      { name: '天使湾', description: '美丽的海湾', city_id: cityMap['尼斯'], latitude: 43.6959, longitude: 7.2644, visit_date: '2024-02-17', visit_time: '10:00', category: '自然', rating: 4.7 },
      { name: '尼斯老城', description: '历史悠久的城区', city_id: cityMap['尼斯'], latitude: 43.6961, longitude: 7.2759, visit_date: '2024-02-17', visit_time: '15:00', category: '历史', rating: 4.3 },
      
      // 马赛景点
      { name: '马赛老港', description: '历史悠久的港口', city_id: cityMap['马赛'], latitude: 43.2947, longitude: 5.3741, visit_date: '2024-02-19', visit_time: '09:00', category: '历史', rating: 4.4 },
      { name: '圣母加德大教堂', description: '马赛地标建筑', city_id: cityMap['马赛'], latitude: 43.2907, longitude: 5.3711, visit_date: '2024-02-19', visit_time: '14:00', category: '宗教', rating: 4.3 },
      
      // 阿维尼翁景点
      { name: '教皇宫', description: '中世纪教皇宫殿', city_id: cityMap['阿维尼翁'], latitude: 43.9509, longitude: 4.8084, visit_date: '2024-02-21', visit_time: '09:00', category: '历史', rating: 4.5 },
      { name: '阿维尼翁桥', description: '著名的断桥', city_id: cityMap['阿维尼翁'], latitude: 43.9519, longitude: 4.8081, visit_date: '2024-02-21', visit_time: '15:00', category: '历史', rating: 4.2 },
      
      // 阿尔勒景点
      { name: '古罗马竞技场', description: '保存完好的古罗马建筑', city_id: cityMap['阿尔勒'], latitude: 43.6777, longitude: 4.6306, visit_date: '2024-02-23', visit_time: '09:00', category: '历史', rating: 4.6 },
      { name: '梵高咖啡馆', description: '梵高画作中的咖啡馆', city_id: cityMap['阿尔勒'], latitude: 43.6766, longitude: 4.6278, visit_date: '2024-02-23', visit_time: '14:00', category: '文化', rating: 4.4 },
      
      // 圣特罗佩景点
      { name: '圣特罗佩港口', description: '豪华游艇港口', city_id: cityMap['圣特罗佩'], latitude: 43.2671, longitude: 6.6392, visit_date: '2024-02-25', visit_time: '09:00', category: '体验', rating: 4.3 },
      { name: '圣特罗佩海滩', description: '著名的海滩', city_id: cityMap['圣特罗佩'], latitude: 43.2644, longitude: 6.6369, visit_date: '2024-02-25', visit_time: '14:00', category: '自然', rating: 4.5 },
      
      // 米兰景点
      { name: '米兰大教堂', description: '哥特式建筑杰作', city_id: cityMap['米兰'], latitude: 45.4642, longitude: 9.1900, visit_date: '2024-02-27', visit_time: '09:00', category: '宗教', rating: 4.8 },
      { name: '斯福尔扎城堡', description: '历史城堡', city_id: cityMap['米兰'], latitude: 45.4700, longitude: 9.1797, visit_date: '2024-02-27', visit_time: '14:00', category: '历史', rating: 4.2 },
      
      // 佛罗伦萨景点
      { name: '圣母百花大教堂', description: '文艺复兴建筑', city_id: cityMap['佛罗伦萨'], latitude: 43.7731, longitude: 11.2560, visit_date: '2024-02-29', visit_time: '09:00', category: '宗教', rating: 4.9 },
      { name: '乌菲兹美术馆', description: '世界著名艺术馆', city_id: cityMap['佛罗伦萨'], latitude: 43.7685, longitude: 11.2559, visit_date: '2024-02-29', visit_time: '14:00', category: '博物馆', rating: 4.8 },
      
      // 威尼斯景点
      { name: '圣马可广场', description: '威尼斯中心广场', city_id: cityMap['威尼斯'], latitude: 45.4342, longitude: 12.3388, visit_date: '2024-03-02', visit_time: '09:00', category: '地标', rating: 4.6 },
      { name: '大运河', description: '威尼斯主要水道', city_id: cityMap['威尼斯'], latitude: 45.4408, longitude: 12.3155, visit_date: '2024-03-02', visit_time: '15:00', category: '自然', rating: 4.5 },
      
      // 罗马景点
      { name: '斗兽场', description: '古罗马竞技场', city_id: cityMap['罗马'], latitude: 41.8902, longitude: 12.4922, visit_date: '2024-03-04', visit_time: '09:00', category: '历史', rating: 4.9 },
      { name: '梵蒂冈', description: '天主教中心', city_id: cityMap['罗马'], latitude: 41.9022, longitude: 12.4539, visit_date: '2024-03-04', visit_time: '14:00', category: '宗教', rating: 4.8 },
      
      // 布达佩斯景点
      { name: '布达城堡', description: '历史悠久的城堡', city_id: cityMap['布达佩斯'], latitude: 47.4965, longitude: 19.0398, visit_date: '2024-03-06', visit_time: '09:00', category: '历史', rating: 4.7 },
      { name: '多瑙河游船', description: '多瑙河夜景游船', city_id: cityMap['布达佩斯'], latitude: 47.4979, longitude: 19.0402, visit_date: '2024-03-06', visit_time: '19:00', category: '体验', rating: 4.6 }
    ];

    console.log('准备插入景点数据，数量:', attractions.length);
    console.log('景点数据示例:', attractions[0]);

    const { data: insertedAttractions, error: attractionsError } = await supabase
      .from('attractions')
      .insert(attractions)
      .select();

    if (attractionsError) {
      console.error('插入景点失败:', attractionsError);
      console.error('错误详情:', JSON.stringify(attractionsError, null, 2));
    } else {
      console.log('景点创建成功，数量:', insertedAttractions ? insertedAttractions.length : 0);
    }

    // 先清理现有交通数据，避免重复
    console.log('清理现有交通数据...');
    await supabase
      .from('transportation')
      .delete()
      .neq('id', 0); // 删除所有交通数据

    // 添加交通数据
    const transportation = [
      { from_city_id: cityMap['武汉'], to_city_id: cityMap['阿姆斯特丹'], transport_type: '飞机', departure_time: '2024-02-09T08:00:00', arrival_time: '2024-02-09T14:00:00', duration: '6小时', cost: 800, booking_reference: 'CA1234', itinerary_id: itinerary.id },
      { from_city_id: cityMap['阿姆斯特丹'], to_city_id: cityMap['巴黎'], transport_type: '火车', departure_time: '2024-02-12T10:00:00', arrival_time: '2024-02-12T16:00:00', duration: '6小时', cost: 120, booking_reference: 'TGV456', itinerary_id: itinerary.id },
      { from_city_id: cityMap['巴黎'], to_city_id: cityMap['尼斯'], transport_type: '飞机', departure_time: '2024-02-16T09:00:00', arrival_time: '2024-02-16T11:00:00', duration: '2小时', cost: 150, booking_reference: 'AF789', itinerary_id: itinerary.id },
      { from_city_id: cityMap['尼斯'], to_city_id: cityMap['马赛'], transport_type: '火车', departure_time: '2024-02-18T08:00:00', arrival_time: '2024-02-18T10:00:00', duration: '2小时', cost: 80, booking_reference: 'TER123', itinerary_id: itinerary.id },
      { from_city_id: cityMap['马赛'], to_city_id: cityMap['阿维尼翁'], transport_type: '汽车', departure_time: '2024-02-20T09:00:00', arrival_time: '2024-02-20T11:00:00', duration: '2小时', cost: 60, booking_reference: 'RENTAL1', itinerary_id: itinerary.id },
      { from_city_id: cityMap['阿维尼翁'], to_city_id: cityMap['阿尔勒'], transport_type: '汽车', departure_time: '2024-02-22T10:00:00', arrival_time: '2024-02-22T11:00:00', duration: '1小时', cost: 40, booking_reference: 'RENTAL2', itinerary_id: itinerary.id },
      { from_city_id: cityMap['阿尔勒'], to_city_id: cityMap['圣特罗佩'], transport_type: '汽车', departure_time: '2024-02-24T09:00:00', arrival_time: '2024-02-24T11:00:00', duration: '2小时', cost: 50, booking_reference: 'RENTAL3', itinerary_id: itinerary.id },
      { from_city_id: cityMap['圣特罗佩'], to_city_id: cityMap['米兰'], transport_type: '飞机', departure_time: '2024-02-26T08:00:00', arrival_time: '2024-02-26T10:00:00', duration: '2小时', cost: 200, booking_reference: 'AZ456', itinerary_id: itinerary.id },
      { from_city_id: cityMap['米兰'], to_city_id: cityMap['佛罗伦萨'], transport_type: '火车', departure_time: '2024-02-28T09:00:00', arrival_time: '2024-02-28T11:00:00', duration: '2小时', cost: 90, booking_reference: 'FRECCIAROSSA', itinerary_id: itinerary.id },
      { from_city_id: cityMap['佛罗伦萨'], to_city_id: cityMap['威尼斯'], transport_type: '火车', departure_time: '2024-03-01T08:00:00', arrival_time: '2024-03-01T12:00:00', duration: '4小时', cost: 110, booking_reference: 'ITALO789', itinerary_id: itinerary.id },
      { from_city_id: cityMap['威尼斯'], to_city_id: cityMap['罗马'], transport_type: '火车', departure_time: '2024-03-03T09:00:00', arrival_time: '2024-03-03T13:00:00', duration: '4小时', cost: 100, booking_reference: 'FRECCIAROSSA2', itinerary_id: itinerary.id },
      { from_city_id: cityMap['罗马'], to_city_id: cityMap['布达佩斯'], transport_type: '飞机', departure_time: '2024-03-05T10:00:00', arrival_time: '2024-03-05T12:00:00', duration: '2小时', cost: 180, booking_reference: 'WIZZ123', itinerary_id: itinerary.id },
      { from_city_id: cityMap['布达佩斯'], to_city_id: cityMap['武汉'], transport_type: '飞机', departure_time: '2024-03-08T08:00:00', arrival_time: '2024-03-08T20:00:00', duration: '12小时', cost: 1200, booking_reference: 'CA5678', itinerary_id: itinerary.id }
    ];

    console.log('准备插入交通数据，数量:', transportation.length);
    console.log('交通数据示例:', transportation[0]);

    const { data: insertedTransportation, error: transportationError } = await supabase
      .from('transportation')
      .insert(transportation)
      .select();

    if (transportationError) {
      console.error('插入交通失败:', transportationError);
      console.error('错误详情:', JSON.stringify(transportationError, null, 2));
    } else {
      console.log('交通创建成功，数量:', insertedTransportation ? insertedTransportation.length : 0);
    }

    console.log('Supabase REST API 数据初始化完成');
  } catch (error) {
    console.error('初始化数据失败:', error);
  }
};

// 启动时初始化数据库
initializeDatabase();

// API 路由

// 测试Supabase连接
app.get('/api/test-supabase', async (req, res) => {
  try {
    console.log('测试Supabase连接...');
    console.log('SUPABASE_URL:', supabaseUrl);
    console.log('SUPABASE_ANON_KEY:', supabaseKey ? '已设置' : '未设置');

    // 测试简单查询
    const { data, error } = await supabase
      .from('itineraries')
      .select('count')
      .limit(1);

    if (error) {
      console.error('Supabase查询错误:', error);
      return res.status(500).json({
        error: error.message,
        details: error,
        supabase_url: supabaseUrl,
        has_key: !!supabaseKey
      });
    }

    res.json({
      message: 'Supabase连接成功',
      supabase_url: supabaseUrl,
      has_key: !!supabaseKey,
      data: data
    });
  } catch (error) {
    console.error('Supabase连接测试失败:', error);
    res.status(500).json({
      error: error.message,
      supabase_url: supabaseUrl,
      has_key: !!supabaseKey
    });
  }
});

// 测试插入单条景点数据
app.post('/api/test-attraction', async (req, res) => {
  try {
    console.log('测试插入单条景点数据...');

    // 先获取一个城市ID
    const { data: cities, error: citiesError } = await supabase
      .from('cities')
      .select('id, name')
      .limit(1);

    if (citiesError) {
      return res.status(500).json({ error: '获取城市失败', details: citiesError });
    }

    if (!cities || cities.length === 0) {
      return res.status(500).json({ error: '没有找到城市数据' });
    }

    console.log('找到城市:', cities[0]);

    // 插入一条测试景点数据
    const { data: attraction, error: attractionError } = await supabase
      .from('attractions')
      .insert([{
        name: '测试景点',
        description: '这是一个测试景点',
        city_id: cities[0].id,
        latitude: 48.8566,
        longitude: 2.3522,
        visit_date: '2024-02-13',
        visit_time: '09:00',
        category: '测试',
        rating: 4.5
      }])
      .select();

    if (attractionError) {
      console.error('插入测试景点失败:', attractionError);
      return res.status(500).json({
        error: '插入测试景点失败',
        details: attractionError,
        city_id: cities[0].id
      });
    }

    res.json({
      message: '测试景点插入成功',
      attraction: attraction[0],
      city: cities[0]
    });
  } catch (error) {
    console.error('测试插入景点失败:', error);
    res.status(500).json({ error: error.message });
  }
});

// 手动触发数据初始化
app.post('/api/init-data', async (req, res) => {
  try {
    console.log('手动触发数据初始化...');
    await initializeDatabase();
    res.json({ message: '数据初始化完成' });
  } catch (error) {
    console.error('数据初始化失败:', error);
    res.status(500).json({ error: error.message });
  }
});

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

// ==================== 数据管理API ====================

// 初始化数据管理器
const dataManager = new DataManager();
const schemaManager = new SchemaManager();

// 获取数据统计
app.get('/api/data-stats', async (req, res) => {
  try {
    const stats = await dataManager.getDataStats();
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 添加新城市
app.post('/api/cities', async (req, res) => {
  try {
    const result = await dataManager.addCity(req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 添加新景点
app.post('/api/attractions', async (req, res) => {
  try {
    const result = await dataManager.addAttraction(req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 添加新交通
app.post('/api/transportation', async (req, res) => {
  try {
    const result = await dataManager.addTransportation(req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 批量更新数据
app.post('/api/batch-update', async (req, res) => {
  try {
    const { operations } = req.body;
    const results = [];
    
    for (const operation of operations) {
      let result;
      switch (operation.type) {
        case 'add_city':
          result = await dataManager.addCity(operation.data);
          break;
        case 'add_attraction':
          result = await dataManager.addAttraction(operation.data);
          break;
        case 'add_transportation':
          result = await dataManager.addTransportation(operation.data);
          break;
        case 'update_attraction':
          result = await dataManager.updateAttraction(operation.id, operation.data);
          break;
        default:
          result = { error: 'Unknown operation type' };
      }
      results.push({ operation: operation.type, result });
    }
    
    res.json({ success: true, results });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 重新初始化数据库（谨慎使用）
app.post('/api/reinitialize', async (req, res) => {
  try {
    // 清空所有表
    await supabase.from('transportation').delete().neq('id', 0);
    await supabase.from('attractions').delete().neq('id', 0);
    await supabase.from('cities').delete().neq('id', 0);
    await supabase.from('itineraries').delete().neq('id', 0);
    
    // 重新初始化
    await initializeDatabase();
    
    res.json({ success: true, message: '数据库重新初始化完成' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== 表结构管理API ====================

// 获取所有表信息
app.get('/api/schema/tables', async (req, res) => {
  try {
    const tables = await schemaManager.getAllTables();
    res.json(tables);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 获取表结构
app.get('/api/schema/table/:tableName', async (req, res) => {
  try {
    const { tableName } = req.params;
    const schema = await schemaManager.getTableSchema(tableName);
    res.json(schema);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 验证表结构
app.get('/api/schema/validate', async (req, res) => {
  try {
    const validation = await schemaManager.validateSchema();
    res.json(validation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 添加新字段
app.post('/api/schema/add-column', async (req, res) => {
  try {
    const { tableName, columnName, dataType, options } = req.body;
    const result = await schemaManager.addColumn(tableName, columnName, dataType, options);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 创建新表
app.post('/api/schema/create-table', async (req, res) => {
  try {
    const { tableName, columns } = req.body;
    const result = await schemaManager.createTable(tableName, columns);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 添加外键约束
app.post('/api/schema/add-foreign-key', async (req, res) => {
  try {
    const { tableName, columnName, referencedTable, referencedColumn } = req.body;
    const result = await schemaManager.addForeignKey(tableName, columnName, referencedTable, referencedColumn);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 添加索引
app.post('/api/schema/add-index', async (req, res) => {
  try {
    const { tableName, columnName, indexName } = req.body;
    const result = await schemaManager.addIndex(tableName, columnName, indexName);
    res.json(result);
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
