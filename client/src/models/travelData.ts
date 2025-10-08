// 欧洲旅游行程数据
import { Itinerary, City, Attraction, Transportation } from '../types';

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
  { id: 0, name: "武汉", country: "中国", latitude: 30.5928, longitude: 114.3055, arrival_date: "2026-02-07", departure_date: "2026-02-07" },
  { id: -1, name: "广州", country: "中国", latitude: 23.1291, longitude: 113.2644, arrival_date: "2026-02-07", departure_date: "2026-02-07" },
  { id: 1, name: "阿姆斯特丹", country: "荷兰", latitude: 52.3676, longitude: 4.9041, arrival_date: "2026-02-08", departure_date: "2026-02-09" },
  { id: 2, name: "巴黎", country: "法国", latitude: 48.8566, longitude: 2.3522, arrival_date: "2026-02-10", departure_date: "2026-02-12" },
  { id: 3, name: "里昂", country: "法国", latitude: 45.7640, longitude: 4.8357, arrival_date: "2026-02-13", departure_date: "2026-02-13" },
  { id: 4, name: "马赛", country: "法国", latitude: 43.2965, longitude: 5.3698, arrival_date: "2026-02-14", departure_date: "2026-02-14" },
  { id: 5, name: "尼斯", country: "法国", latitude: 43.7102, longitude: 7.2620, arrival_date: "2026-02-15", departure_date: "2026-02-15" },
  { id: 6, name: "摩纳哥", country: "摩纳哥", latitude: 43.7384, longitude: 7.4246, arrival_date: "2026-02-16", departure_date: "2026-02-16" },
  { id: 7, name: "米兰", country: "意大利", latitude: 45.4642, longitude: 9.1900, arrival_date: "2026-02-17", departure_date: "2026-02-18" },
  { id: 12, name: "维罗纳", country: "意大利", latitude: 45.4384, longitude: 10.9916, arrival_date: "2026-02-18", departure_date: "2026-02-18" },
  { id: 8, name: "威尼斯", country: "意大利", latitude: 45.4408, longitude: 12.3155, arrival_date: "2026-02-19", departure_date: "2026-02-20" },
  { id: 9, name: "佛罗伦萨", country: "意大利", latitude: 43.7696, longitude: 11.2558, arrival_date: "2026-02-21", departure_date: "2026-02-21" },
  { id: 13, name: "比萨", country: "意大利", latitude: 43.7228, longitude: 10.3966, arrival_date: "2026-02-22", departure_date: "2026-02-22" },
  { id: 10, name: "罗马", country: "意大利", latitude: 41.9028, longitude: 12.4964, arrival_date: "2026-02-23", departure_date: "2026-02-24" },
  { id: 11, name: "梵蒂冈", country: "梵蒂冈", latitude: 41.9029, longitude: 12.4534, arrival_date: "2026-02-24", departure_date: "2026-02-24" }
];

// 景点数据
export const attractionsData: Attraction[] = [
  // 阿姆斯特丹
  { id: 1, name: "梵高博物馆", description: "世界最大的梵高作品收藏", latitude: 52.3584, longitude: 4.8811, category: "博物馆", rating: 4.8, city_id: 1 },
  { id: 2, name: "安妮之家", description: "安妮·弗兰克故居博物馆", latitude: 52.3752, longitude: 4.8840, category: "历史", rating: 4.6, city_id: 1 },
  { id: 3, name: "运河区", description: "联合国教科文组织世界遗产", latitude: 52.3676, longitude: 4.9041, category: "风景", rating: 4.7, city_id: 1 },
  { id: 4, name: "国立博物馆", description: "荷兰国家博物馆", latitude: 52.3600, longitude: 4.8852, category: "博物馆", rating: 4.7, city_id: 1 },
  { id: 5, name: "水坝广场", description: "阿姆斯特丹中心广场", latitude: 52.3730, longitude: 4.8936, category: "地标", rating: 4.5, city_id: 1 },

  // 巴黎
  { id: 6, name: "埃菲尔铁塔", description: "巴黎地标建筑", latitude: 48.8584, longitude: 2.2945, category: "地标", rating: 4.9, city_id: 2 },
  { id: 7, name: "卢浮宫", description: "世界最大艺术博物馆", latitude: 48.8606, longitude: 2.3376, category: "博物馆", rating: 4.8, city_id: 2 },
  { id: 8, name: "圣母院", description: "哥特式建筑杰作", latitude: 48.8530, longitude: 2.3499, category: "宗教", rating: 4.7, city_id: 2 },
  { id: 9, name: "凯旋门", description: "巴黎标志性建筑", latitude: 48.8738, longitude: 2.2950, category: "地标", rating: 4.6, city_id: 2 },
  { id: 10, name: "凡尔赛宫", description: "法国王宫", latitude: 48.8049, longitude: 2.1204, category: "历史", rating: 4.8, city_id: 2 },
  { id: 11, name: "香榭丽舍大街", description: "世界最美丽的大街", latitude: 48.8698, longitude: 2.3078, category: "风景", rating: 4.5, city_id: 2 },

  // 里昂
  { id: 12, name: "富维耶圣母院", description: "里昂地标教堂", latitude: 45.7624, longitude: 4.8227, category: "宗教", rating: 4.6, city_id: 3 },
  { id: 13, name: "里昂老城", description: "联合国教科文组织世界遗产", latitude: 45.7640, longitude: 4.8279, category: "历史", rating: 4.5, city_id: 3 },
  { id: 14, name: "白莱果广场", description: "里昂中心广场", latitude: 45.7578, longitude: 4.8320, category: "风景", rating: 4.3, city_id: 3 },

  // 马赛
  { id: 15, name: "老港", description: "马赛历史港口", latitude: 43.2951, longitude: 5.3750, category: "风景", rating: 4.5, city_id: 4 },
  { id: 16, name: "守护圣母教堂", description: "马赛地标建筑", latitude: 43.2841, longitude: 5.3714, category: "宗教", rating: 4.6, city_id: 4 },
  { id: 17, name: "伊夫岛", description: "基督山伯爵故事发生地", latitude: 43.2798, longitude: 5.3256, category: "历史", rating: 4.4, city_id: 4 },

  // 尼斯
  { id: 18, name: "天使湾", description: "蔚蓝海岸最美海湾", latitude: 43.6959, longitude: 7.2716, category: "海滩", rating: 4.8, city_id: 5 },
  { id: 19, name: "尼斯老城", description: "充满魅力的历史街区", latitude: 43.6961, longitude: 7.2759, category: "历史", rating: 4.5, city_id: 5 },
  { id: 20, name: "城堡山", description: "俯瞰尼斯全景", latitude: 43.6959, longitude: 7.2817, category: "风景", rating: 4.6, city_id: 5 },

  // 摩纳哥
  { id: 21, name: "蒙特卡洛赌场", description: "世界著名赌场", latitude: 43.7404, longitude: 7.4286, category: "娱乐", rating: 4.5, city_id: 6 },
  { id: 22, name: "摩纳哥王宫", description: "格里马尔迪家族宫殿", latitude: 43.7325, longitude: 7.4208, category: "历史", rating: 4.3, city_id: 6 },
  { id: 23, name: "海洋博物馆", description: "世界知名海洋博物馆", latitude: 43.7307, longitude: 7.4254, category: "博物馆", rating: 4.4, city_id: 6 },

  // 米兰
  { id: 24, name: "米兰大教堂", description: "哥特式建筑杰作", latitude: 45.4642, longitude: 9.1900, category: "宗教", rating: 4.7, city_id: 7 },
  { id: 25, name: "斯卡拉歌剧院", description: "世界著名歌剧院", latitude: 45.4676, longitude: 9.1896, category: "文化", rating: 4.6, city_id: 7 },
  { id: 26, name: "最后的晚餐", description: "达芬奇壁画杰作", latitude: 45.4658, longitude: 9.1707, category: "艺术", rating: 4.8, city_id: 7 },
  { id: 27, name: "埃马努埃莱二世长廊", description: "世界最古老的购物中心", latitude: 45.4654, longitude: 9.1897, category: "购物", rating: 4.5, city_id: 7 },
  { id: 28, name: "斯福尔扎城堡", description: "米兰历史城堡", latitude: 45.4707, longitude: 9.1797, category: "历史", rating: 4.4, city_id: 7 },

  // 威尼斯
  { id: 29, name: "圣马可广场", description: "威尼斯中心广场", latitude: 45.4342, longitude: 12.3388, category: "历史", rating: 4.7, city_id: 8 },
  { id: 30, name: "大运河", description: "威尼斯主要水道", latitude: 45.4408, longitude: 12.3155, category: "风景", rating: 4.8, city_id: 8 },
  { id: 31, name: "里亚托桥", description: "威尼斯标志性桥梁", latitude: 45.4380, longitude: 12.3359, category: "地标", rating: 4.6, city_id: 8 },
  { id: 32, name: "圣马可大教堂", description: "拜占庭建筑杰作", latitude: 45.4345, longitude: 12.3398, category: "宗教", rating: 4.7, city_id: 8 },
  { id: 33, name: "叹息桥", description: "威尼斯著名桥梁", latitude: 45.4340, longitude: 12.3408, category: "地标", rating: 4.5, city_id: 8 },

  // 佛罗伦萨
  { id: 34, name: "圣母百花大教堂", description: "文艺复兴建筑杰作", latitude: 43.7731, longitude: 11.2560, category: "宗教", rating: 4.8, city_id: 9 },
  { id: 35, name: "乌菲兹美术馆", description: "文艺复兴艺术宝库", latitude: 43.7685, longitude: 11.2553, category: "博物馆", rating: 4.9, city_id: 9 },
  { id: 36, name: "老桥", description: "佛罗伦萨最古老的桥", latitude: 43.7679, longitude: 11.2529, category: "地标", rating: 4.5, city_id: 9 },
  { id: 37, name: "学院美术馆", description: "米开朗基罗大卫雕像", latitude: 43.7769, longitude: 11.2589, category: "博物馆", rating: 4.7, city_id: 9 },
  { id: 38, name: "米开朗基罗广场", description: "俯瞰佛罗伦萨全景", latitude: 43.7629, longitude: 11.2650, category: "风景", rating: 4.6, city_id: 9 },

  // 罗马
  { id: 39, name: "斗兽场", description: "古罗马竞技场", latitude: 41.8902, longitude: 12.4922, category: "历史", rating: 4.9, city_id: 10 },
  { id: 40, name: "古罗马广场", description: "古罗马政治中心", latitude: 41.8925, longitude: 12.4853, category: "历史", rating: 4.7, city_id: 10 },
  { id: 41, name: "特雷维喷泉", description: "罗马最著名的喷泉", latitude: 41.9009, longitude: 12.4833, category: "地标", rating: 4.6, city_id: 10 },
  { id: 42, name: "万神殿", description: "古罗马建筑奇迹", latitude: 41.8986, longitude: 12.4769, category: "历史", rating: 4.8, city_id: 10 },
  { id: 43, name: "西班牙广场", description: "罗马著名广场", latitude: 41.9058, longitude: 12.4823, category: "地标", rating: 4.5, city_id: 10 },

  // 维罗纳
  { id: 44, name: "朱丽叶故居", description: "罗密欧与朱丽叶的阳台", latitude: 45.4438, longitude: 10.9984, category: "历史", rating: 4.5, city_id: 12 },
  { id: 45, name: "圆形竞技场", description: "古罗马圆形剧场", latitude: 45.4391, longitude: 10.9944, category: "历史", rating: 4.6, city_id: 12 },
  { id: 46, name: "布拉广场", description: "维罗纳中心广场", latitude: 45.4384, longitude: 10.9945, category: "风景", rating: 4.4, city_id: 12 },

  // 比萨
  { id: 47, name: "比萨斜塔", description: "世界著名斜塔", latitude: 43.7230, longitude: 10.3966, category: "地标", rating: 4.7, city_id: 13 },
  { id: 48, name: "比萨大教堂", description: "罗马式建筑杰作", latitude: 43.7230, longitude: 10.3964, category: "宗教", rating: 4.5, city_id: 13 },
  { id: 49, name: "奇迹广场", description: "世界文化遗产", latitude: 43.7229, longitude: 10.3965, category: "风景", rating: 4.6, city_id: 13 },

  // 梵蒂冈
  { id: 50, name: "圣彼得大教堂", description: "世界最大的教堂", latitude: 41.9022, longitude: 12.4539, category: "宗教", rating: 4.9, city_id: 11 },
  { id: 51, name: "西斯廷礼拜堂", description: "米开朗基罗壁画杰作", latitude: 41.9029, longitude: 12.4545, category: "艺术", rating: 4.8, city_id: 11 },
  { id: 52, name: "梵蒂冈博物馆", description: "世界顶级艺术收藏", latitude: 41.9065, longitude: 12.4536, category: "博物馆", rating: 4.8, city_id: 11 },
  { id: 53, name: "圣彼得广场", description: "梵蒂冈主广场", latitude: 41.9022, longitude: 12.4568, category: "地标", rating: 4.7, city_id: 11 }
];

// 交通数据
export const transportationData: Transportation[] = [
  // 往返航班（地图上显示）
  { id: 0, transport_type: "飞机", from_city_id: 0, to_city_id: -1, departure_time: "2026-02-07 09:30", arrival_time: "2026-02-07 11:30", duration: "2小时" },
  { id: -1, transport_type: "飞机", from_city_id: -1, to_city_id: 1, departure_time: "2026-02-07 13:35", arrival_time: "2026-02-07 19:15", duration: "11小时40分钟" },

  // 欧洲段交通
  { id: 1, transport_type: "火车", from_city_id: 1, to_city_id: 2, departure_time: "2026-02-10 上午", arrival_time: "2026-02-10 中午", duration: "约3.5小时" },
  { id: 2, transport_type: "火车", from_city_id: 2, to_city_id: 3, departure_time: "2026-02-13 上午", arrival_time: "2026-02-13 中午", duration: "约2小时" },
  { id: 3, transport_type: "火车", from_city_id: 3, to_city_id: 4, departure_time: "2026-02-14 上午", arrival_time: "2026-02-14 上午", duration: "约1.5小时" },
  { id: 4, transport_type: "火车", from_city_id: 4, to_city_id: 5, departure_time: "2026-02-15 上午", arrival_time: "2026-02-15 上午", duration: "约2.5小时" },
  { id: 5, transport_type: "巴士", from_city_id: 5, to_city_id: 6, departure_time: "2026-02-16 上午", arrival_time: "2026-02-16 上午", duration: "约30分钟" },
  { id: 6, transport_type: "飞机", from_city_id: 6, to_city_id: 7, departure_time: "2026-02-17 上午", arrival_time: "2026-02-17 中午", duration: "约1.5小时" },
  { id: 7, transport_type: "火车", from_city_id: 7, to_city_id: 12, departure_time: "2026-02-18 下午", arrival_time: "2026-02-18 下午", duration: "约1.5小时" },
  { id: 8, transport_type: "火车", from_city_id: 12, to_city_id: 8, departure_time: "2026-02-19 上午", arrival_time: "2026-02-19 上午", duration: "约1.5小时" },
  { id: 9, transport_type: "火车", from_city_id: 8, to_city_id: 9, departure_time: "2026-02-21 上午", arrival_time: "2026-02-21 上午", duration: "约2小时" },
  { id: 10, transport_type: "火车", from_city_id: 9, to_city_id: 13, departure_time: "2026-02-22 上午", arrival_time: "2026-02-22 上午", duration: "约1小时" },
  { id: 11, transport_type: "火车", from_city_id: 13, to_city_id: 10, departure_time: "2026-02-22 下午", arrival_time: "2026-02-22 下午", duration: "约3小时" },
  { id: 12, transport_type: "地铁", from_city_id: 10, to_city_id: 11, departure_time: "2026-02-24 下午", arrival_time: "2026-02-24 下午", duration: "约20分钟" },

  // 返程航班
  { id: 13, transport_type: "飞机", from_city_id: 11, to_city_id: 1, departure_time: "2026-02-25 21:40", arrival_time: "2026-02-26 00:10", duration: "2小时30分钟" },
  { id: 14, transport_type: "飞机", from_city_id: 1, to_city_id: -1, departure_time: "2026-02-26 19:00", arrival_time: "2026-02-26 20:55", duration: "1小时55分钟" }
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

