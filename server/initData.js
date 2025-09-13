const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./travel_planner.db');

// 创建示例行程数据
const sampleItinerary = {
  title: '2024年欧洲20天之旅',
  start_date: '2024-02-09',
  end_date: '2024-03-04'
};

// 示例城市数据
const sampleCities = [
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
    name: '戛纳',
    country: '法国',
    latitude: 43.5513,
    longitude: 7.0128,
    arrival_date: '2024-02-18',
    departure_date: '2024-02-19'
  },
  {
    name: '摩纳哥',
    country: '摩纳哥',
    latitude: 43.7384,
    longitude: 7.4246,
    arrival_date: '2024-02-19',
    departure_date: '2024-02-19'
  },
  {
    name: '米兰',
    country: '意大利',
    latitude: 45.4642,
    longitude: 9.1900,
    arrival_date: '2024-02-19',
    departure_date: '2024-02-21'
  },
  {
    name: '佛罗伦萨',
    country: '意大利',
    latitude: 43.7731,
    longitude: 11.2560,
    arrival_date: '2024-02-21',
    departure_date: '2024-02-23'
  },
  {
    name: '威尼斯',
    country: '意大利',
    latitude: 45.4342,
    longitude: 12.3388,
    arrival_date: '2024-02-23',
    departure_date: '2024-02-25'
  },
  {
    name: '比萨',
    country: '意大利',
    latitude: 43.7230,
    longitude: 10.3966,
    arrival_date: '2024-02-25',
    departure_date: '2024-02-25'
  },
  {
    name: '五渔村',
    country: '意大利',
    latitude: 44.1456,
    longitude: 9.6547,
    arrival_date: '2024-02-25',
    departure_date: '2024-02-26'
  },
  {
    name: '那不勒斯',
    country: '意大利',
    latitude: 40.8518,
    longitude: 14.2681,
    arrival_date: '2024-02-26',
    departure_date: '2024-02-28'
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
  }
];

// 示例景点数据
const sampleAttractions = [
  // 阿姆斯特丹
  {
    city_name: '阿姆斯特丹',
    name: '梵高博物馆',
    description: '收藏了世界上最多的梵高作品，包括《向日葵》等名作',
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
    description: '二战期间安妮·弗兰克躲藏的地方，现为博物馆',
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
    description: '联合国教科文组织世界遗产，乘船游览运河',
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
    description: '巴黎的标志性建筑，登塔俯瞰巴黎全景',
    latitude: 48.8584,
    longitude: 2.2945,
    visit_date: '2024-02-13',
    visit_time: '09:00',
    category: '历史建筑',
    rating: 4.6
  },
  {
    city_name: '巴黎',
    name: '卢浮宫',
    description: '世界最大的艺术博物馆，收藏《蒙娜丽莎》等名作',
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
    description: '哥特式建筑杰作，巴黎最著名的教堂',
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
    description: '巴黎最著名的购物街，从凯旋门到协和广场',
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
    description: '蔚蓝海岸最美丽的海湾，享受地中海阳光',
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
    description: '充满历史魅力的老城区，狭窄的街道和彩色建筑',
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
    description: '收藏马蒂斯作品的博物馆，位于西米耶山',
    latitude: 43.7200,
    longitude: 7.2750,
    visit_date: '2024-02-18',
    visit_time: '10:00',
    category: '博物馆',
    rating: 4.2
  },
  {
    city_name: '尼斯',
    name: '英国人散步道',
    description: '海滨步道，欣赏地中海美景',
    latitude: 43.6938,
    longitude: 7.2506,
    visit_date: '2024-02-17',
    visit_time: '16:00',
    category: '自然景观',
    rating: 4.5
  },
  {
    city_name: '尼斯',
    name: '城堡山',
    description: '俯瞰尼斯全景的最佳位置',
    latitude: 43.6961,
    longitude: 7.2756,
    visit_date: '2024-02-18',
    visit_time: '14:00',
    category: '自然景观',
    rating: 4.6
  },

  // 戛纳
  {
    city_name: '戛纳',
    name: '戛纳电影节宫',
    description: '世界著名电影节举办地',
    latitude: 43.5513,
    longitude: 7.0128,
    visit_date: '2024-02-18',
    visit_time: '10:00',
    category: '历史建筑',
    rating: 4.7
  },
  {
    city_name: '戛纳',
    name: '克鲁瓦塞特大道',
    description: '海滨购物街，豪华酒店林立',
    latitude: 43.5500,
    longitude: 7.0200,
    visit_date: '2024-02-18',
    visit_time: '14:00',
    category: '购物',
    rating: 4.4
  },
  {
    city_name: '戛纳',
    name: '勒苏凯老城',
    description: '中世纪建筑群，俯瞰戛纳',
    latitude: 43.5528,
    longitude: 7.0128,
    visit_date: '2024-02-18',
    visit_time: '16:00',
    category: '历史建筑',
    rating: 4.3
  },
  {
    city_name: '戛纳',
    name: '戛纳海滩',
    description: '享受地中海阳光和海水',
    latitude: 43.5500,
    longitude: 7.0100,
    visit_date: '2024-02-19',
    visit_time: '09:00',
    category: '自然景观',
    rating: 4.2
  },

  // 摩纳哥
  {
    city_name: '摩纳哥',
    name: '蒙特卡洛赌场',
    description: '世界著名赌场，奢华建筑',
    latitude: 43.7396,
    longitude: 7.4278,
    visit_date: '2024-02-19',
    visit_time: '10:00',
    category: '娱乐',
    rating: 4.6
  },
  {
    city_name: '摩纳哥',
    name: '摩纳哥王宫',
    description: '格里马尔迪家族宫殿',
    latitude: 43.7325,
    longitude: 7.4208,
    visit_date: '2024-02-19',
    visit_time: '14:00',
    category: '历史建筑',
    rating: 4.5
  },
  {
    city_name: '摩纳哥',
    name: '海洋博物馆',
    description: '海洋生物展览，建筑独特',
    latitude: 43.7300,
    longitude: 7.4250,
    visit_date: '2024-02-19',
    visit_time: '16:00',
    category: '博物馆',
    rating: 4.4
  },
  {
    city_name: '摩纳哥',
    name: '摩纳哥大教堂',
    description: '格蕾丝王妃安息地',
    latitude: 43.7314,
    longitude: 7.4203,
    visit_date: '2024-02-19',
    visit_time: '17:00',
    category: '历史建筑',
    rating: 4.3
  },
  {
    city_name: '摩纳哥',
    name: '摩纳哥港',
    description: '豪华游艇聚集地',
    latitude: 43.7350,
    longitude: 7.4300,
    visit_date: '2024-02-19',
    visit_time: '18:00',
    category: '自然景观',
    rating: 4.5
  },

  // 米兰
  {
    city_name: '米兰',
    name: '米兰大教堂',
    description: '哥特式建筑的杰作，米兰的象征',
    latitude: 45.4642,
    longitude: 9.1900,
    visit_date: '2024-02-20',
    visit_time: '09:00',
    category: '历史建筑',
    rating: 4.6
  },
  {
    city_name: '米兰',
    name: '斯卡拉歌剧院',
    description: '世界最著名的歌剧院之一，意大利歌剧的殿堂',
    latitude: 45.4676,
    longitude: 9.1900,
    visit_date: '2024-02-20',
    visit_time: '19:30',
    category: '娱乐',
    rating: 4.5
  },
  {
    city_name: '米兰',
    name: '斯福尔扎城堡',
    description: '米兰的历史城堡，现为博物馆群',
    latitude: 45.4700,
    longitude: 9.1800,
    visit_date: '2024-02-21',
    visit_time: '10:00',
    category: '历史建筑',
    rating: 4.3
  },
  {
    city_name: '米兰',
    name: '埃马努埃莱二世拱廊',
    description: '米兰的购物中心，玻璃拱顶建筑',
    latitude: 45.4654,
    longitude: 9.1900,
    visit_date: '2024-02-21',
    visit_time: '14:00',
    category: '购物',
    rating: 4.4
  },

  // 佛罗伦萨
  {
    city_name: '佛罗伦萨',
    name: '圣母百花大教堂',
    description: '文艺复兴建筑杰作，佛罗伦萨地标',
    latitude: 43.7731,
    longitude: 11.2560,
    visit_date: '2024-02-22',
    visit_time: '09:00',
    category: '历史建筑',
    rating: 4.8
  },
  {
    city_name: '佛罗伦萨',
    name: '乌菲兹美术馆',
    description: '世界顶级艺术博物馆，收藏文艺复兴杰作',
    latitude: 43.7685,
    longitude: 11.2558,
    visit_date: '2024-02-22',
    visit_time: '14:00',
    category: '博物馆',
    rating: 4.7
  },
  {
    city_name: '佛罗伦萨',
    name: '老桥',
    description: '中世纪石桥，珠宝店林立',
    latitude: 43.7679,
    longitude: 11.2530,
    visit_date: '2024-02-22',
    visit_time: '16:00',
    category: '历史建筑',
    rating: 4.5
  },
  {
    city_name: '佛罗伦萨',
    name: '米开朗基罗广场',
    description: '俯瞰佛罗伦萨全景的最佳位置',
    latitude: 43.7629,
    longitude: 11.2650,
    visit_date: '2024-02-23',
    visit_time: '09:00',
    category: '自然景观',
    rating: 4.6
  },
  {
    city_name: '佛罗伦萨',
    name: '领主广场',
    description: '露天雕塑博物馆，大卫像复制品',
    latitude: 43.7696,
    longitude: 11.2558,
    visit_date: '2024-02-23',
    visit_time: '14:00',
    category: '历史建筑',
    rating: 4.4
  },

  // 威尼斯
  {
    city_name: '威尼斯',
    name: '圣马可广场',
    description: '威尼斯的心脏，欧洲最美的客厅',
    latitude: 45.4342,
    longitude: 12.3388,
    visit_date: '2024-02-24',
    visit_time: '09:00',
    category: '历史建筑',
    rating: 4.8
  },
  {
    city_name: '威尼斯',
    name: '圣马可大教堂',
    description: '拜占庭建筑杰作，金碧辉煌',
    latitude: 45.4342,
    longitude: 12.3388,
    visit_date: '2024-02-24',
    visit_time: '10:00',
    category: '历史建筑',
    rating: 4.7
  },
  {
    city_name: '威尼斯',
    name: '总督宫',
    description: '威尼斯共和国权力中心，哥特式建筑',
    latitude: 45.4339,
    longitude: 12.3400,
    visit_date: '2024-02-24',
    visit_time: '14:00',
    category: '历史建筑',
    rating: 4.6
  },
  {
    city_name: '威尼斯',
    name: '叹息桥',
    description: '连接监狱和法院的桥，浪漫传说',
    latitude: 45.4336,
    longitude: 12.3408,
    visit_date: '2024-02-24',
    visit_time: '16:00',
    category: '历史建筑',
    rating: 4.5
  },
  {
    city_name: '威尼斯',
    name: '大运河',
    description: '乘坐贡多拉游览威尼斯',
    latitude: 45.4342,
    longitude: 12.3388,
    visit_date: '2024-02-25',
    visit_time: '09:00',
    category: '自然景观',
    rating: 4.7
  },

  // 比萨
  {
    city_name: '比萨',
    name: '比萨斜塔',
    description: '世界著名地标，倾斜的奇迹',
    latitude: 43.7230,
    longitude: 10.3966,
    visit_date: '2024-02-25',
    visit_time: '14:00',
    category: '历史建筑',
    rating: 4.6
  },
  {
    city_name: '比萨',
    name: '比萨大教堂',
    description: '罗马式建筑，比萨斜塔的配套建筑',
    latitude: 43.7230,
    longitude: 10.3966,
    visit_date: '2024-02-25',
    visit_time: '15:00',
    category: '历史建筑',
    rating: 4.4
  },
  {
    city_name: '比萨',
    name: '圣若望洗礼堂',
    description: '圆形洗礼堂，比萨建筑群的一部分',
    latitude: 43.7230,
    longitude: 10.3966,
    visit_date: '2024-02-25',
    visit_time: '16:00',
    category: '历史建筑',
    rating: 4.3
  },

  // 五渔村
  {
    city_name: '五渔村',
    name: '蒙特罗索',
    description: '五渔村之一，最大的村庄',
    latitude: 44.1456,
    longitude: 9.6547,
    visit_date: '2024-02-26',
    visit_time: '09:00',
    category: '自然景观',
    rating: 4.7
  },
  {
    city_name: '五渔村',
    name: '韦尔纳扎',
    description: '彩色房屋，悬崖上的村庄',
    latitude: 44.1350,
    longitude: 9.6847,
    visit_date: '2024-02-26',
    visit_time: '11:00',
    category: '自然景观',
    rating: 4.6
  },
  {
    city_name: '五渔村',
    name: '马纳罗拉',
    description: '最上镜的村庄，彩色房屋',
    latitude: 44.1039,
    longitude: 9.7300,
    visit_date: '2024-02-26',
    visit_time: '14:00',
    category: '自然景观',
    rating: 4.8
  },

  // 那不勒斯
  {
    city_name: '那不勒斯',
    name: '那不勒斯老城',
    description: '联合国世界遗产，历史建筑群',
    latitude: 40.8518,
    longitude: 14.2681,
    visit_date: '2024-02-27',
    visit_time: '09:00',
    category: '历史建筑',
    rating: 4.5
  },
  {
    city_name: '那不勒斯',
    name: '庞贝古城',
    description: '古罗马城市遗址，被火山掩埋',
    latitude: 40.7489,
    longitude: 14.5038,
    visit_date: '2024-02-27',
    visit_time: '14:00',
    category: '历史建筑',
    rating: 4.8
  },
  {
    city_name: '那不勒斯',
    name: '维苏威火山',
    description: '活火山，庞贝古城的毁灭者',
    latitude: 40.8222,
    longitude: 14.4269,
    visit_date: '2024-02-28',
    visit_time: '09:00',
    category: '自然景观',
    rating: 4.4
  },
  {
    city_name: '那不勒斯',
    name: '那不勒斯国家考古博物馆',
    description: '庞贝文物收藏，世界顶级考古博物馆',
    latitude: 40.8534,
    longitude: 14.2500,
    visit_date: '2024-02-28',
    visit_time: '14:00',
    category: '博物馆',
    rating: 4.6
  },

  // 罗马
  {
    city_name: '罗马',
    name: '斗兽场',
    description: '古罗马的象征，世界七大奇迹之一',
    latitude: 41.8902,
    longitude: 12.4922,
    visit_date: '2024-03-01',
    visit_time: '09:00',
    category: '历史建筑',
    rating: 4.7
  },
  {
    city_name: '罗马',
    name: '梵蒂冈城',
    description: '世界上最小的国家，圣彼得大教堂和西斯廷教堂',
    latitude: 41.9022,
    longitude: 12.4539,
    visit_date: '2024-03-01',
    visit_time: '14:00',
    category: '历史建筑',
    rating: 4.8
  },
  {
    city_name: '罗马',
    name: '特雷维喷泉',
    description: '罗马最著名的喷泉，许愿池',
    latitude: 41.9009,
    longitude: 12.4833,
    visit_date: '2024-03-02',
    visit_time: '10:00',
    category: '历史建筑',
    rating: 4.4
  },
  {
    city_name: '罗马',
    name: '万神殿',
    description: '古罗马建筑杰作，保存最完好的古罗马建筑',
    latitude: 41.8986,
    longitude: 12.4769,
    visit_date: '2024-03-02',
    visit_time: '15:00',
    category: '历史建筑',
    rating: 4.6
  },
  {
    city_name: '罗马',
    name: '西班牙广场',
    description: '罗马最著名的广场，西班牙台阶',
    latitude: 41.9058,
    longitude: 12.4822,
    visit_date: '2024-03-02',
    visit_time: '16:00',
    category: '历史建筑',
    rating: 4.5
  },
  {
    city_name: '罗马',
    name: '古罗马广场',
    description: '古罗马政治中心，历史遗迹',
    latitude: 41.8925,
    longitude: 12.4853,
    visit_date: '2024-03-01',
    visit_time: '16:00',
    category: '历史建筑',
    rating: 4.6
  },

  // 布达佩斯
  {
    city_name: '布达佩斯',
    name: '布达城堡',
    description: '俯瞰多瑙河的历史城堡，现为博物馆',
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
    description: '匈牙利国会所在地，多瑙河畔的宏伟建筑',
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
    description: '欧洲最大的温泉浴场，体验匈牙利温泉文化',
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
    to_city: '戛纳',
    transport_type: '火车',
    departure_time: '2024-02-18 09:00',
    arrival_time: '2024-02-18 09:30',
    duration: '30分钟',
    cost: 15,
    booking_reference: 'THA1234'
  },
  {
    from_city: '戛纳',
    to_city: '摩纳哥',
    transport_type: '火车',
    departure_time: '2024-02-19 09:00',
    arrival_time: '2024-02-19 10:00',
    duration: '1小时',
    cost: 20,
    booking_reference: 'THA2345'
  },
  {
    from_city: '摩纳哥',
    to_city: '米兰',
    transport_type: '火车',
    departure_time: '2024-02-19 20:00',
    arrival_time: '2024-02-19 23:00',
    duration: '3小时',
    cost: 50,
    booking_reference: 'THA3456'
  },
  {
    from_city: '米兰',
    to_city: '佛罗伦萨',
    transport_type: '火车',
    departure_time: '2024-02-21 09:00',
    arrival_time: '2024-02-21 12:00',
    duration: '3小时',
    cost: 50,
    booking_reference: 'THA3456'
  },
  {
    from_city: '佛罗伦萨',
    to_city: '威尼斯',
    transport_type: '火车',
    departure_time: '2024-02-23 09:00',
    arrival_time: '2024-02-23 12:00',
    duration: '3小时',
    cost: 50,
    booking_reference: 'THA4567'
  },
  {
    from_city: '威尼斯',
    to_city: '比萨',
    transport_type: '火车',
    departure_time: '2024-02-25 09:00',
    arrival_time: '2024-02-25 12:00',
    duration: '3小时',
    cost: 50,
    booking_reference: 'THA5678'
  },
  {
    from_city: '比萨',
    to_city: '五渔村',
    transport_type: '火车',
    departure_time: '2024-02-25 14:00',
    arrival_time: '2024-02-25 16:00',
    duration: '2小时',
    cost: 30,
    booking_reference: 'THA6789'
  },
  {
    from_city: '五渔村',
    to_city: '那不勒斯',
    transport_type: '火车',
    departure_time: '2024-02-26 09:00',
    arrival_time: '2024-02-26 15:00',
    duration: '6小时',
    cost: 80,
    booking_reference: 'THA7890'
  },
  {
    from_city: '那不勒斯',
    to_city: '罗马',
    transport_type: '火车',
    departure_time: '2024-02-28 09:00',
    arrival_time: '2024-02-28 11:00',
    duration: '2小时',
    cost: 40,
    booking_reference: 'THA8901'
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

db.serialize(() => {
  // 创建表
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
    latitude REAL,
    longitude REAL,
    arrival_date TEXT,
    departure_date TEXT,
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

  // 清空现有数据
  db.run('DELETE FROM attractions');
  db.run('DELETE FROM transportation');
  db.run('DELETE FROM cities');
  db.run('DELETE FROM itineraries');

  // 插入示例行程
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

      sampleCities.forEach((city, index) => {
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

                        // 插入交通数据
                        let transportInsertCount = 0;
                        sampleTransportation.forEach(transport => {
                          const fromCityId = cityMap.get(transport.from_city) || null;
                          const toCityId = cityMap.get(transport.to_city) || null;

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
                        });
                      }
                    }
                  );
                }
              });
            }
          }
        );
      });
    }
  );
});
