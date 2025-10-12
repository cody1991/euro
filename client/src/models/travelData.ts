// 欧洲旅游行程数据
import { Itinerary, City, Attraction, Transportation, Accommodation } from '../types';

// 行程基本信息
export const itineraryData: Itinerary = {
  id: 1,
  title: "2026年欧洲20天深度游",
  start_date: "2026-02-07",
  end_date: "2026-02-26",
  cities: [],
  transportation: []
};

// 城市数据
export const citiesData: City[] = [
  {
    id: 0,
    name: "武汉",
    country: "中国",
    latitude: 30.5928,
    longitude: 114.3055,
    arrival_date: "2026-02-07",
    departure_date: "2026-02-07"
  },
  {
    id: -1,
    name: "广州",
    country: "中国",
    latitude: 23.1291,
    longitude: 113.2644,
    arrival_date: "2026-02-07",
    departure_date: "2026-02-07"
  },
  {
    id: 1,
    name: "阿姆斯特丹",
    name_en: "Amsterdam",
    country: "荷兰",
    latitude: 52.3676,
    longitude: 4.9041,
    arrival_date: "2026-02-08",
    departure_date: "2026-02-08",
    accommodation: {
      hotel_name: "",
      hotel_name_en: "",
      address: "",
      phone: "",
      check_in: "2026-02-08",
      check_out: "2026-02-09"
    }
  },
  {
    id: 2,
    name: "巴黎",
    name_en: "Paris",
    country: "法国",
    latitude: 48.8566,
    longitude: 2.3522,
    arrival_date: "2026-02-09",
    departure_date: "2026-02-11",
    accommodation: {
      hotel_name: "",
      hotel_name_en: "",
      address: "",
      phone: "",
      check_in: "2026-02-09",
      check_out: "2026-02-12"
    }
  },
  {
    id: 3,
    name: "里昂",
    name_en: "Lyon",
    country: "法国",
    latitude: 45.7640,
    longitude: 4.8357,
    arrival_date: "2026-02-12",
    departure_date: "2026-02-12",
    accommodation: {
      hotel_name: "",
      hotel_name_en: "",
      address: "",
      phone: "",
      check_in: "2026-02-12",
      check_out: "2026-02-13"
    }
  },
  {
    id: 4,
    name: "马赛",
    name_en: "Marseille",
    country: "法国",
    latitude: 43.2965,
    longitude: 5.3698,
    arrival_date: "2026-02-13",
    departure_date: "2026-02-13",
    accommodation: {
      hotel_name: "",
      hotel_name_en: "",
      address: "",
      phone: "",
      check_in: "2026-02-13",
      check_out: "2026-02-14"
    }
  },
  {
    id: 5,
    name: "尼斯",
    name_en: "Nice",
    country: "法国",
    latitude: 43.7102,
    longitude: 7.2620,
    arrival_date: "2026-02-14",
    departure_date: "2026-02-14",
    accommodation: {
      hotel_name: "",
      hotel_name_en: "",
      address: "",
      phone: "",
      check_in: "2026-02-14",
      check_out: "2026-02-15"
    }
  },
  {
    id: 6,
    name: "摩纳哥",
    name_en: "Monaco",
    country: "摩纳哥",
    latitude: 43.7384,
    longitude: 7.4246,
    arrival_date: "2026-02-15",
    departure_date: "2026-02-15",
    accommodation: {
      hotel_name: "",
      hotel_name_en: "",
      address: "",
      phone: "",
      check_in: "2026-02-15",
      check_out: "2026-02-16"
    }
  },
  {
    id: 7,
    name: "米兰",
    name_en: "Milan",
    country: "意大利",
    latitude: 45.4642,
    longitude: 9.1900,
    arrival_date: "2026-02-16",
    departure_date: "2026-02-17",
    accommodation: {
      hotel_name: "",
      hotel_name_en: "",
      address: "",
      phone: "",
      check_in: "2026-02-16",
      check_out: "2026-02-18"
    }
  },
  {
    id: 12,
    name: "维罗纳",
    name_en: "Verona",
    country: "意大利",
    latitude: 45.4384,
    longitude: 10.9916,
    arrival_date: "2026-02-17",
    departure_date: "2026-02-17"
  },
  {
    id: 8,
    name: "威尼斯",
    name_en: "Venice",
    country: "意大利",
    latitude: 45.4408,
    longitude: 12.3155,
    arrival_date: "2026-02-18",
    departure_date: "2026-02-19",
    accommodation: {
      hotel_name: "",
      hotel_name_en: "",
      address: "",
      phone: "",
      check_in: "2026-02-18",
      check_out: "2026-02-20"
    }
  },
  {
    id: 9,
    name: "佛罗伦萨",
    name_en: "Florence",
    country: "意大利",
    latitude: 43.7696,
    longitude: 11.2558,
    arrival_date: "2026-02-20",
    departure_date: "2026-02-20",
    accommodation: {
      hotel_name: "",
      hotel_name_en: "",
      address: "",
      phone: "",
      check_in: "2026-02-20",
      check_out: "2026-02-21"
    }
  },
  {
    id: 13,
    name: "比萨",
    name_en: "Pisa",
    country: "意大利",
    latitude: 43.7228,
    longitude: 10.3966,
    arrival_date: "2026-02-21",
    departure_date: "2026-02-21"
  },
  {
    id: 11,
    name: "梵蒂冈",
    name_en: "Vatican City",
    country: "梵蒂冈",
    latitude: 41.9029,
    longitude: 12.4534,
    arrival_date: "2026-02-21",
    departure_date: "2026-02-21"
  },
  {
    id: 10,
    name: "罗马",
    name_en: "Rome",
    country: "意大利",
    latitude: 41.9028,
    longitude: 12.4964,
    arrival_date: "2026-02-21",
    departure_date: "2026-02-23",
    accommodation: {
      hotel_name: "",
      hotel_name_en: "",
      address: "",
      phone: "",
      check_in: "2026-02-21",
      check_out: "2026-02-24"
    }
  },
  {
    id: 15,
    name: "那不勒斯",
    name_en: "Naples",
    country: "意大利",
    latitude: 40.8518,
    longitude: 14.2681,
    arrival_date: "2026-02-24",
    departure_date: "2026-02-24",
    accommodation: {
      hotel_name: "",
      hotel_name_en: "",
      address: "",
      phone: "",
      check_in: "2026-02-24",
      check_out: "2026-02-25"
    }
  },
  {
    id: 14,
    name: "阿姆斯特丹",
    name_en: "Amsterdam",
    country: "荷兰",
    latitude: 52.3676,
    longitude: 4.9041,
    arrival_date: "2026-02-26",
    departure_date: "2026-02-26"
  }
];

// 景点数据
export const attractionsData: Attraction[] = [
  // 阿姆斯特丹
  { id: 1, name: "梵高博物馆", name_en: "Van Gogh Museum", description: "世界最大的梵高作品收藏", latitude: 52.3584, longitude: 4.8811, category: "博物馆", rating: 4.8, city_id: 1 },
  { id: 2, name: "安妮之家", name_en: "Anne Frank House", description: "安妮·弗兰克故居博物馆", latitude: 52.3752, longitude: 4.8840, category: "历史", rating: 4.6, city_id: 1 },
  { id: 3, name: "运河区", name_en: "Canal Ring", description: "联合国教科文组织世界遗产", latitude: 52.3676, longitude: 4.9041, category: "风景", rating: 4.7, city_id: 1 },
  { id: 4, name: "国立博物馆", name_en: "Rijksmuseum", description: "荷兰国家博物馆", latitude: 52.3600, longitude: 4.8852, category: "博物馆", rating: 4.7, city_id: 1 },
  { id: 5, name: "水坝广场", name_en: "Dam Square", description: "阿姆斯特丹中心广场", latitude: 52.3730, longitude: 4.8936, category: "地标", rating: 4.5, city_id: 1 },
  { id: 54, name: "桑斯安斯风车村", description: "荷兰传统风车村，体验经典荷兰风光", latitude: 52.4748, longitude: 4.8175, category: "风景", rating: 4.6, city_id: 14 },
  { id: 55, name: "阿姆斯特丹花市", description: "世界唯一的水上花市", latitude: 52.3665, longitude: 4.8913, category: "市场", rating: 4.4, city_id: 14 },
  { id: 56, name: "喜力啤酒体验馆", description: "了解喜力啤酒历史与酿造过程", latitude: 52.3578, longitude: 4.8917, category: "娱乐", rating: 4.3, city_id: 14 },
  { id: 57, name: "运河游船", description: "乘船游览阿姆斯特丹运河，欣赏城市美景", latitude: 52.3702, longitude: 4.8952, category: "活动", rating: 4.7, city_id: 14 },

  // 巴黎
  { id: 6, name: "埃菲尔铁塔", name_en: "Eiffel Tower", description: "巴黎地标建筑", latitude: 48.8584, longitude: 2.2945, category: "地标", rating: 4.9, city_id: 2 },
  { id: 7, name: "卢浮宫", name_en: "Louvre Museum", description: "世界最大艺术博物馆", latitude: 48.8606, longitude: 2.3376, category: "博物馆", rating: 4.8, city_id: 2 },
  { id: 8, name: "圣母院", name_en: "Notre-Dame Cathedral", description: "哥特式建筑杰作", latitude: 48.8530, longitude: 2.3499, category: "宗教", rating: 4.7, city_id: 2 },
  { id: 9, name: "凯旋门", name_en: "Arc de Triomphe", description: "巴黎标志性建筑", latitude: 48.8738, longitude: 2.2950, category: "地标", rating: 4.6, city_id: 2 },
  { id: 10, name: "凡尔赛宫", name_en: "Palace of Versailles", description: "法国王宫", latitude: 48.8049, longitude: 2.1204, category: "历史", rating: 4.8, city_id: 2 },
  { id: 11, name: "香榭丽舍大街", name_en: "Champs-Élysées", description: "世界最美丽的大街", latitude: 48.8698, longitude: 2.3078, category: "风景", rating: 4.5, city_id: 2 },

  // 里昂
  { id: 12, name: "富维耶圣母院", name_en: "Basilica of Notre-Dame de Fourvière", description: "里昂地标教堂", latitude: 45.7624, longitude: 4.8227, category: "宗教", rating: 4.6, city_id: 3 },
  { id: 13, name: "里昂老城", name_en: "Vieux Lyon", description: "联合国教科文组织世界遗产", latitude: 45.7640, longitude: 4.8279, category: "历史", rating: 4.5, city_id: 3 },
  { id: 14, name: "白莱果广场", name_en: "Place Bellecour", description: "里昂中心广场", latitude: 45.7578, longitude: 4.8320, category: "风景", rating: 4.3, city_id: 3 },

  // 马赛
  { id: 15, name: "老港", name_en: "Old Port", description: "马赛历史港口", latitude: 43.2951, longitude: 5.3750, category: "风景", rating: 4.5, city_id: 4 },
  { id: 16, name: "守护圣母教堂", name_en: "Notre-Dame de la Garde", description: "马赛地标建筑", latitude: 43.2841, longitude: 5.3714, category: "宗教", rating: 4.6, city_id: 4 },
  { id: 17, name: "伊夫岛", name_en: "Château d'If", description: "基督山伯爵故事发生地", latitude: 43.2798, longitude: 5.3256, category: "历史", rating: 4.4, city_id: 4 },

  // 尼斯
  { id: 18, name: "天使湾", name_en: "Baie des Anges", description: "蔚蓝海岸最美海湾", latitude: 43.6959, longitude: 7.2716, category: "海滩", rating: 4.8, city_id: 5 },
  { id: 19, name: "尼斯老城", name_en: "Vieux Nice", description: "充满魅力的历史街区", latitude: 43.6961, longitude: 7.2759, category: "历史", rating: 4.5, city_id: 5 },
  { id: 20, name: "城堡山", name_en: "Castle Hill", description: "俯瞰尼斯全景", latitude: 43.6959, longitude: 7.2817, category: "风景", rating: 4.6, city_id: 5 },

  // 摩纳哥
  { id: 21, name: "蒙特卡洛赌场", name_en: "Monte Carlo Casino", description: "世界著名赌场", latitude: 43.7404, longitude: 7.4286, category: "娱乐", rating: 4.5, city_id: 6 },
  { id: 22, name: "摩纳哥王宫", name_en: "Prince's Palace of Monaco", description: "格里马尔迪家族宫殿", latitude: 43.7325, longitude: 7.4208, category: "历史", rating: 4.3, city_id: 6 },
  { id: 23, name: "海洋博物馆", name_en: "Oceanographic Museum", description: "世界知名海洋博物馆", latitude: 43.7307, longitude: 7.4254, category: "博物馆", rating: 4.4, city_id: 6 },

  // 米兰
  { id: 24, name: "米兰大教堂", name_en: "Duomo di Milano", description: "哥特式建筑杰作", latitude: 45.4642, longitude: 9.1900, category: "宗教", rating: 4.7, city_id: 7 },
  { id: 25, name: "斯卡拉歌剧院", name_en: "Teatro alla Scala", description: "世界著名歌剧院", latitude: 45.4676, longitude: 9.1896, category: "文化", rating: 4.6, city_id: 7 },
  { id: 26, name: "最后的晚餐", name_en: "The Last Supper", description: "达芬奇壁画杰作", latitude: 45.4658, longitude: 9.1707, category: "艺术", rating: 4.8, city_id: 7 },
  { id: 27, name: "埃马努埃莱二世长廊", name_en: "Galleria Vittorio Emanuele II", description: "世界最古老的购物中心", latitude: 45.4654, longitude: 9.1897, category: "购物", rating: 4.5, city_id: 7 },
  { id: 28, name: "斯福尔扎城堡", name_en: "Castello Sforzesco", description: "米兰历史城堡", latitude: 45.4707, longitude: 9.1797, category: "历史", rating: 4.4, city_id: 7 },

  // 威尼斯
  { id: 29, name: "圣马可广场", name_en: "Piazza San Marco", description: "威尼斯中心广场", latitude: 45.4342, longitude: 12.3388, category: "历史", rating: 4.7, city_id: 8 },
  { id: 30, name: "大运河", name_en: "Grand Canal", description: "威尼斯主要水道", latitude: 45.4408, longitude: 12.3155, category: "风景", rating: 4.8, city_id: 8 },
  { id: 31, name: "里亚托桥", name_en: "Rialto Bridge", description: "威尼斯标志性桥梁", latitude: 45.4380, longitude: 12.3359, category: "地标", rating: 4.6, city_id: 8 },
  { id: 32, name: "圣马可大教堂", name_en: "St. Mark's Basilica", description: "拜占庭建筑杰作", latitude: 45.4345, longitude: 12.3398, category: "宗教", rating: 4.7, city_id: 8 },
  { id: 33, name: "叹息桥", name_en: "Bridge of Sighs", description: "威尼斯著名桥梁", latitude: 45.4340, longitude: 12.3408, category: "地标", rating: 4.5, city_id: 8 },

  // 佛罗伦萨
  { id: 34, name: "圣母百花大教堂", name_en: "Cathedral of Santa Maria del Fiore", description: "文艺复兴建筑杰作", latitude: 43.7731, longitude: 11.2560, category: "宗教", rating: 4.8, city_id: 9 },
  { id: 35, name: "乌菲兹美术馆", name_en: "Uffizi Gallery", description: "文艺复兴艺术宝库", latitude: 43.7685, longitude: 11.2553, category: "博物馆", rating: 4.9, city_id: 9 },
  { id: 36, name: "老桥", name_en: "Ponte Vecchio", description: "佛罗伦萨最古老的桥", latitude: 43.7679, longitude: 11.2529, category: "地标", rating: 4.5, city_id: 9 },
  { id: 37, name: "学院美术馆", name_en: "Accademia Gallery", description: "米开朗基罗大卫雕像", latitude: 43.7769, longitude: 11.2589, category: "博物馆", rating: 4.7, city_id: 9 },
  { id: 38, name: "米开朗基罗广场", name_en: "Piazzale Michelangelo", description: "俯瞰佛罗伦萨全景", latitude: 43.7629, longitude: 11.2650, category: "风景", rating: 4.6, city_id: 9 },

  // 罗马
  { id: 39, name: "斗兽场", name_en: "Colosseum", description: "古罗马竞技场", latitude: 41.8902, longitude: 12.4922, category: "历史", rating: 4.9, city_id: 10 },
  { id: 40, name: "古罗马广场", name_en: "Roman Forum", description: "古罗马政治中心", latitude: 41.8925, longitude: 12.4853, category: "历史", rating: 4.7, city_id: 10 },
  { id: 41, name: "特雷维喷泉", name_en: "Trevi Fountain", description: "罗马最著名的喷泉", latitude: 41.9009, longitude: 12.4833, category: "地标", rating: 4.6, city_id: 10 },
  { id: 42, name: "万神殿", name_en: "Pantheon", description: "古罗马建筑奇迹", latitude: 41.8986, longitude: 12.4769, category: "历史", rating: 4.8, city_id: 10 },
  { id: 43, name: "西班牙广场", name_en: "Spanish Steps", description: "罗马著名广场", latitude: 41.9058, longitude: 12.4823, category: "地标", rating: 4.5, city_id: 10 },

  // 维罗纳
  { id: 44, name: "朱丽叶故居", name_en: "Juliet's House", description: "罗密欧与朱丽叶的阳台", latitude: 45.4438, longitude: 10.9984, category: "历史", rating: 4.5, city_id: 12 },
  { id: 45, name: "圆形竞技场", name_en: "Verona Arena", description: "古罗马圆形剧场", latitude: 45.4391, longitude: 10.9944, category: "历史", rating: 4.6, city_id: 12 },
  { id: 46, name: "布拉广场", name_en: "Piazza Bra", description: "维罗纳中心广场", latitude: 45.4384, longitude: 10.9945, category: "风景", rating: 4.4, city_id: 12 },

  // 比萨
  { id: 47, name: "比萨斜塔", name_en: "Leaning Tower of Pisa", description: "世界著名斜塔", latitude: 43.7230, longitude: 10.3966, category: "地标", rating: 4.7, city_id: 13 },
  { id: 48, name: "比萨大教堂", name_en: "Pisa Cathedral", description: "罗马式建筑杰作", latitude: 43.7230, longitude: 10.3964, category: "宗教", rating: 4.5, city_id: 13 },
  { id: 49, name: "奇迹广场", name_en: "Piazza dei Miracoli", description: "世界文化遗产", latitude: 43.7229, longitude: 10.3965, category: "风景", rating: 4.6, city_id: 13 },

  // 梵蒂冈
  { id: 50, name: "圣彼得大教堂", name_en: "St. Peter's Basilica", description: "世界最大的教堂", latitude: 41.9022, longitude: 12.4539, category: "宗教", rating: 4.9, city_id: 11 },
  { id: 51, name: "西斯廷礼拜堂", name_en: "Sistine Chapel", description: "米开朗基罗壁画杰作", latitude: 41.9029, longitude: 12.4545, category: "艺术", rating: 4.8, city_id: 11 },
  { id: 52, name: "梵蒂冈博物馆", name_en: "Vatican Museums", description: "世界顶级艺术收藏", latitude: 41.9065, longitude: 12.4536, category: "博物馆", rating: 4.8, city_id: 11 },
  { id: 53, name: "圣彼得广场", name_en: "St. Peter's Square", description: "梵蒂冈主广场", latitude: 41.9022, longitude: 12.4568, category: "地标", rating: 4.7, city_id: 11 },

  // 那不勒斯
  { id: 58, name: "庞贝古城", name_en: "Pompeii", description: "被维苏威火山掩埋的古罗马城市", latitude: 40.7510, longitude: 14.4989, category: "历史", rating: 4.9, city_id: 15 },
  { id: 59, name: "那不勒斯历史中心", name_en: "Historic Centre of Naples", description: "世界文化遗产，充满活力的老城", latitude: 40.8518, longitude: 14.2681, category: "历史", rating: 4.5, city_id: 15 },
  { id: 60, name: "新堡", name_en: "Castel Nuovo", description: "那不勒斯标志性城堡", latitude: 40.8387, longitude: 14.2486, category: "历史", rating: 4.4, city_id: 15 },
  { id: 61, name: "那不勒斯国家考古博物馆", name_en: "National Archaeological Museum", description: "收藏庞贝出土文物", latitude: 40.8534, longitude: 14.2508, category: "博物馆", rating: 4.6, city_id: 15 },
  { id: 62, name: "圣卡洛歌剧院", name_en: "Teatro di San Carlo", description: "欧洲最古老的歌剧院之一", latitude: 40.8376, longitude: 14.2496, category: "文化", rating: 4.5, city_id: 15 }
];

// 交通数据
export const transportationData: Transportation[] = [
  // 往返航班（地图上显示）
  {
    id: 0,
    transport_type: "飞机",
    from_city_id: 0,
    to_city_id: -1,
    departure_time: "2026-02-07 09:30",
    arrival_time: "2026-02-07 11:30",
    duration: "2小时",
    flight_number: "",
    departure_location: "武汉天河国际机场",
    departure_location_en: "Wuhan Tianhe International Airport",
    arrival_location: "广州白云国际机场",
    arrival_location_en: "Guangzhou Baiyun International Airport"
  },
  {
    id: -1,
    transport_type: "飞机",
    from_city_id: -1,
    to_city_id: 1,
    departure_time: "2026-02-07 13:35",
    arrival_time: "2026-02-07 19:15",
    duration: "11小时40分钟",
    flight_number: "",
    departure_location: "广州白云国际机场",
    departure_location_en: "Guangzhou Baiyun International Airport",
    arrival_location: "阿姆斯特丹史基浦机场",
    arrival_location_en: "Amsterdam Schiphol Airport"
  },

  // 欧洲段交通
  {
    id: 1,
    transport_type: "火车",
    from_city_id: 1,
    to_city_id: 2,
    departure_time: "2026-02-09 09:00",
    arrival_time: "2026-02-09 12:30",
    duration: "约3.5小时",
    train_number: "",
    departure_location: "阿姆斯特丹中央车站",
    departure_location_en: "Amsterdam Centraal Station",
    arrival_location: "巴黎北站",
    arrival_location_en: "Paris Gare du Nord"
  },
  {
    id: 2,
    transport_type: "火车",
    from_city_id: 2,
    to_city_id: 3,
    departure_time: "2026-02-12 08:30",
    arrival_time: "2026-02-12 10:30",
    duration: "约2小时",
    train_number: "",
    departure_location: "巴黎里昂火车站",
    departure_location_en: "Paris Gare de Lyon",
    arrival_location: "里昂帕尔迪厄站",
    arrival_location_en: "Lyon Part-Dieu Station"
  },
  {
    id: 3,
    transport_type: "火车",
    from_city_id: 3,
    to_city_id: 4,
    departure_time: "2026-02-13 09:00",
    arrival_time: "2026-02-13 10:30",
    duration: "约1.5小时",
    train_number: "",
    departure_location: "里昂帕尔迪厄站",
    departure_location_en: "Lyon Part-Dieu Station",
    arrival_location: "马赛圣夏勒站",
    arrival_location_en: "Marseille Saint-Charles Station"
  },
  {
    id: 4,
    transport_type: "火车",
    from_city_id: 4,
    to_city_id: 5,
    departure_time: "2026-02-14 09:00",
    arrival_time: "2026-02-14 11:30",
    duration: "约2.5小时",
    train_number: "",
    departure_location: "马赛圣夏勒站",
    departure_location_en: "Marseille Saint-Charles Station",
    arrival_location: "尼斯车站",
    arrival_location_en: "Nice Ville Station"
  },
  {
    id: 5,
    transport_type: "巴士",
    from_city_id: 5,
    to_city_id: 6,
    departure_time: "2026-02-15 09:00",
    arrival_time: "2026-02-15 09:30",
    duration: "约30分钟",
    departure_location: "尼斯市区",
    departure_location_en: "Nice City Center",
    arrival_location: "摩纳哥蒙特卡洛",
    arrival_location_en: "Monte Carlo, Monaco"
  },
  {
    id: 6,
    transport_type: "飞机",
    from_city_id: 6,
    to_city_id: 7,
    departure_time: "2026-02-16 10:00",
    arrival_time: "2026-02-16 11:30",
    duration: "约1.5小时",
    flight_number: "",
    departure_location: "尼斯蓝色海岸机场",
    departure_location_en: "Nice Côte d'Azur Airport",
    arrival_location: "米兰马尔彭萨机场",
    arrival_location_en: "Milan Malpensa Airport"
  },
  {
    id: 7,
    transport_type: "火车",
    from_city_id: 7,
    to_city_id: 12,
    departure_time: "2026-02-17 14:00",
    arrival_time: "2026-02-17 15:30",
    duration: "约1.5小时",
    train_number: "",
    departure_location: "米兰中央车站",
    departure_location_en: "Milano Centrale Station",
    arrival_location: "维罗纳门户新站",
    arrival_location_en: "Verona Porta Nuova Station"
  },
  {
    id: 8,
    transport_type: "火车",
    from_city_id: 12,
    to_city_id: 8,
    departure_time: "2026-02-18 09:00",
    arrival_time: "2026-02-18 10:30",
    duration: "约1.5小时",
    train_number: "",
    departure_location: "维罗纳门户新站",
    departure_location_en: "Verona Porta Nuova Station",
    arrival_location: "威尼斯圣露西亚站",
    arrival_location_en: "Venezia Santa Lucia Station"
  },
  {
    id: 9,
    transport_type: "火车",
    from_city_id: 8,
    to_city_id: 9,
    departure_time: "2026-02-20 09:00",
    arrival_time: "2026-02-20 11:00",
    duration: "约2小时",
    train_number: "",
    departure_location: "威尼斯圣露西亚站",
    departure_location_en: "Venezia Santa Lucia Station",
    arrival_location: "佛罗伦萨新圣母玛利亚站",
    arrival_location_en: "Firenze Santa Maria Novella Station"
  },
  {
    id: 10,
    transport_type: "火车",
    from_city_id: 9,
    to_city_id: 13,
    departure_time: "2026-02-21 09:00",
    arrival_time: "2026-02-21 10:00",
    duration: "约1小时",
    train_number: "",
    departure_location: "佛罗伦萨新圣母玛利亚站",
    departure_location_en: "Firenze Santa Maria Novella Station",
    arrival_location: "比萨中央车站",
    arrival_location_en: "Pisa Centrale Station"
  },
  {
    id: 11,
    transport_type: "火车",
    from_city_id: 13,
    to_city_id: 10,
    departure_time: "2026-02-21 14:00",
    arrival_time: "2026-02-21 17:00",
    duration: "约3小时",
    train_number: "",
    departure_location: "比萨中央车站",
    departure_location_en: "Pisa Centrale Station",
    arrival_location: "罗马特米尼车站",
    arrival_location_en: "Roma Termini Station"
  },
  {
    id: 12,
    transport_type: "地铁",
    from_city_id: 10,
    to_city_id: 11,
    departure_time: "2026-02-21 下午",
    arrival_time: "2026-02-21 下午",
    duration: "约20分钟",
    departure_location: "罗马市区",
    departure_location_en: "Rome City Center",
    arrival_location: "梵蒂冈",
    arrival_location_en: "Vatican City"
  },
  {
    id: 15,
    transport_type: "火车",
    from_city_id: 10,
    to_city_id: 15,
    departure_time: "2026-02-24 09:00",
    arrival_time: "2026-02-24 10:10",
    duration: "约1小时10分钟",
    train_number: "",
    departure_location: "罗马特米尼车站",
    departure_location_en: "Roma Termini Station",
    arrival_location: "那不勒斯中央车站",
    arrival_location_en: "Napoli Centrale Station"
  },

  // 返程航班
  {
    id: 13,
    transport_type: "飞机",
    from_city_id: 15,
    to_city_id: 14,
    departure_time: "2026-02-25 21:40",
    arrival_time: "2026-02-26 00:10",
    duration: "2小时30分钟",
    flight_number: "",
    departure_location: "那不勒斯国际机场",
    departure_location_en: "Naples International Airport",
    arrival_location: "阿姆斯特丹史基浦机场",
    arrival_location_en: "Amsterdam Schiphol Airport"
  },
  {
    id: 14,
    transport_type: "飞机",
    from_city_id: 14,
    to_city_id: -1,
    departure_time: "2026-02-26 19:00",
    arrival_time: "2026-02-26 20:55",
    duration: "1小时55分钟",
    flight_number: "",
    departure_location: "阿姆斯特丹史基浦机场",
    departure_location_en: "Amsterdam Schiphol Airport",
    arrival_location: "广州白云国际机场",
    arrival_location_en: "Guangzhou Baiyun International Airport"
  }
];

// 组装完整数据
export const getItineraryData = (): Itinerary => {
  // 为每个城市添加景点
  const citiesWithAttractions = citiesData.map(city => ({
    ...city,
    attractions: attractionsData.filter(attr => attr.city_id === city.id)
  }));

  return {
    ...itineraryData,
    cities: citiesWithAttractions,
    transportation: transportationData
  };
};

