import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, CircleMarker, Tooltip } from 'react-leaflet';
import { Star, Calendar, Plane, Train, Car, Ship, MapPin } from 'lucide-react';
import { itineraryAPI } from '../services/api';
import { Itinerary, City, Attraction } from '../types';
import 'leaflet/dist/leaflet.css';
import './MapPage.css';

// 修复 Leaflet 默认图标问题
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

// 创建自定义交通工具图标
const createTransportIcon = (transportType: string) => {
  const iconColor = getTransportColor(transportType);

  const iconHtml = `
    <div style="
      background: ${iconColor};
      width: 30px;
      height: 30px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 16px;
      border: 3px solid white;
      box-shadow: 0 2px 8px rgba(0,0,0,0.3);
    ">
      ${transportType === '飞机' ? '✈️' :
      transportType === '火车' ? '🚂' :
        transportType === '汽车' ? '🚗' :
          transportType === '轮船' ? '🚢' : '🚌'}
    </div>
  `;

  return L.divIcon({
    html: iconHtml,
    className: 'custom-transport-icon',
    iconSize: [30, 30],
    iconAnchor: [15, 15],
    popupAnchor: [0, -15]
  });
};

// 创建城市标签图标
const createCityLabelIcon = (cityName: string, isMajor: boolean = false) => {
  const fontSize = isMajor ? '16px' : '14px';
  const fontWeight = isMajor ? 'bold' : '600';
  const padding = isMajor ? '8px 12px' : '6px 10px';
  const borderRadius = '20px';

  const iconHtml = `
    <div style="
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      font-size: ${fontSize};
      font-weight: ${fontWeight};
      padding: ${padding};
      border-radius: ${borderRadius};
      border: 2px solid white;
      box-shadow: 0 3px 10px rgba(0,0,0,0.3);
      white-space: nowrap;
      text-align: center;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      letter-spacing: 0.5px;
    ">
      ${cityName}
    </div>
  `;

  return L.divIcon({
    html: iconHtml,
    className: 'city-label-icon',
    iconSize: [isMajor ? 120 : 100, 30],
    iconAnchor: [isMajor ? 60 : 50, 15],
    popupAnchor: [0, -15]
  });
};

// 获取交通工具图标
const getTransportIcon = (transportType: string) => {
  switch (transportType) {
    case '飞机':
      return <Plane className="transport-icon" />;
    case '火车':
      return <Train className="transport-icon" />;
    case '汽车':
      return <Car className="transport-icon" />;
    case '轮船':
      return <Ship className="transport-icon" />;
    default:
      return <Train className="transport-icon" />;
  }
};

// 获取交通路线颜色
const getTransportColor = (transportType: string) => {
  switch (transportType) {
    case '飞机':
      return '#e74c3c';
    case '火车':
      return '#3498db';
    case '汽车':
      return '#f39c12';
    case '轮船':
      return '#9b59b6';
    default:
      return '#667eea';
  }
};

const MapPage: React.FC = () => {
  const [itineraries, setItineraries] = useState<Itinerary[]>([]);
  const [selectedItinerary, setSelectedItinerary] = useState<Itinerary | null>(null);
  const [loading, setLoading] = useState(true);
  const [mapCenter] = useState<[number, number]>([50.0, 10.0]); // 欧洲中心
  const [mapZoom] = useState(6);

  // 主要城市列表（显示大标签）
  const majorCities = ['阿姆斯特丹', '巴黎', '尼斯', '米兰', '佛罗伦萨', '威尼斯', '罗马', '布达佩斯'];

  // 推荐的欧洲景点数据
  const recommendedAttractions: { [key: string]: Attraction[] } = {
    '阿姆斯特丹': [
      {
        id: 0,
        name: '梵高博物馆',
        description: '收藏了世界上最多的梵高作品',
        city_id: 0,
        latitude: 52.3584,
        longitude: 4.8811,
        visit_date: '',
        visit_time: '',
        category: '博物馆',
        rating: 4.8
      },
      {
        id: 0,
        name: '安妮·弗兰克之家',
        description: '二战期间安妮·弗兰克躲藏的地方',
        city_id: 0,
        latitude: 52.3752,
        longitude: 4.8841,
        visit_date: '',
        visit_time: '',
        category: '历史建筑',
        rating: 4.5
      },
      {
        id: 0,
        name: '运河区',
        description: '联合国教科文组织世界遗产',
        city_id: 0,
        latitude: 52.3676,
        longitude: 4.9041,
        visit_date: '',
        visit_time: '',
        category: '历史建筑',
        rating: 4.7
      }
    ],
    '巴黎': [
      {
        id: 0,
        name: '埃菲尔铁塔',
        description: '巴黎的标志性建筑',
        city_id: 0,
        latitude: 48.8584,
        longitude: 2.2945,
        visit_date: '',
        visit_time: '',
        category: '历史建筑',
        rating: 4.6
      },
      {
        id: 0,
        name: '卢浮宫',
        description: '世界最大的艺术博物馆',
        city_id: 0,
        latitude: 48.8606,
        longitude: 2.3376,
        visit_date: '',
        visit_time: '',
        category: '博物馆',
        rating: 4.7
      },
      {
        id: 0,
        name: '圣母院',
        description: '哥特式建筑杰作',
        city_id: 0,
        latitude: 48.8530,
        longitude: 2.3499,
        visit_date: '',
        visit_time: '',
        category: '历史建筑',
        rating: 4.5
      },
      {
        id: 0,
        name: '香榭丽舍大街',
        description: '巴黎最著名的购物街',
        city_id: 0,
        latitude: 48.8698,
        longitude: 2.3076,
        visit_date: '',
        visit_time: '',
        category: '购物',
        rating: 4.3
      }
    ],
    '尼斯': [
      {
        id: 0,
        name: '天使湾',
        description: '蔚蓝海岸最美丽的海湾',
        city_id: 0,
        latitude: 43.6959,
        longitude: 7.2644,
        visit_date: '',
        visit_time: '',
        category: '自然景观',
        rating: 4.8
      },
      {
        id: 0,
        name: '尼斯老城',
        description: '充满历史魅力的老城区',
        city_id: 0,
        latitude: 43.6961,
        longitude: 7.2756,
        visit_date: '',
        visit_time: '',
        category: '历史建筑',
        rating: 4.4
      },
      {
        id: 0,
        name: '马蒂斯博物馆',
        description: '收藏马蒂斯作品的博物馆',
        city_id: 0,
        latitude: 43.7200,
        longitude: 7.2750,
        visit_date: '',
        visit_time: '',
        category: '博物馆',
        rating: 4.2
      },
      {
        id: 0,
        name: '英国人散步道',
        description: '海滨步道，欣赏地中海美景',
        city_id: 0,
        latitude: 43.6938,
        longitude: 7.2506,
        visit_date: '',
        visit_time: '',
        category: '自然景观',
        rating: 4.5
      },
      {
        id: 0,
        name: '城堡山',
        description: '俯瞰尼斯全景的最佳位置',
        city_id: 0,
        latitude: 43.6961,
        longitude: 7.2756,
        visit_date: '',
        visit_time: '',
        category: '自然景观',
        rating: 4.6
      }
    ],
    '戛纳': [
      {
        id: 0,
        name: '戛纳电影节宫',
        description: '世界著名电影节举办地',
        city_id: 0,
        latitude: 43.5513,
        longitude: 7.0128,
        visit_date: '',
        visit_time: '',
        category: '历史建筑',
        rating: 4.7
      },
      {
        id: 0,
        name: '克鲁瓦塞特大道',
        description: '海滨购物街，豪华酒店林立',
        city_id: 0,
        latitude: 43.5500,
        longitude: 7.0200,
        visit_date: '',
        visit_time: '',
        category: '购物',
        rating: 4.4
      },
      {
        id: 0,
        name: '勒苏凯老城',
        description: '中世纪建筑群，俯瞰戛纳',
        city_id: 0,
        latitude: 43.5528,
        longitude: 7.0128,
        visit_date: '',
        visit_time: '',
        category: '历史建筑',
        rating: 4.3
      },
      {
        id: 0,
        name: '戛纳海滩',
        description: '享受地中海阳光和海水',
        city_id: 0,
        latitude: 43.5500,
        longitude: 7.0100,
        visit_date: '',
        visit_time: '',
        category: '自然景观',
        rating: 4.2
      }
    ],
    '摩纳哥': [
      {
        id: 0,
        name: '蒙特卡洛赌场',
        description: '世界著名赌场，奢华建筑',
        city_id: 0,
        latitude: 43.7396,
        longitude: 7.4278,
        visit_date: '',
        visit_time: '',
        category: '娱乐',
        rating: 4.6
      },
      {
        id: 0,
        name: '摩纳哥王宫',
        description: '格里马尔迪家族宫殿',
        city_id: 0,
        latitude: 43.7325,
        longitude: 7.4208,
        visit_date: '',
        visit_time: '',
        category: '历史建筑',
        rating: 4.5
      },
      {
        id: 0,
        name: '海洋博物馆',
        description: '海洋生物展览，建筑独特',
        city_id: 0,
        latitude: 43.7300,
        longitude: 7.4250,
        visit_date: '',
        visit_time: '',
        category: '博物馆',
        rating: 4.4
      },
      {
        id: 0,
        name: '摩纳哥大教堂',
        description: '格蕾丝王妃安息地',
        city_id: 0,
        latitude: 43.7314,
        longitude: 7.4203,
        visit_date: '',
        visit_time: '',
        category: '历史建筑',
        rating: 4.3
      },
      {
        id: 0,
        name: '摩纳哥港',
        description: '豪华游艇聚集地',
        city_id: 0,
        latitude: 43.7350,
        longitude: 7.4300,
        visit_date: '',
        visit_time: '',
        category: '自然景观',
        rating: 4.5
      }
    ],
    '圣保罗德旺斯': [
      {
        id: 0,
        name: '马蒂斯教堂',
        description: '马蒂斯设计的现代教堂',
        city_id: 0,
        latitude: 43.7000,
        longitude: 7.1200,
        visit_date: '',
        visit_time: '',
        category: '历史建筑',
        rating: 4.6
      },
      {
        id: 0,
        name: '艺术画廊区',
        description: '众多艺术工作室和画廊',
        city_id: 0,
        latitude: 43.7000,
        longitude: 7.1200,
        visit_date: '',
        visit_time: '',
        category: '博物馆',
        rating: 4.4
      },
      {
        id: 0,
        name: '中世纪城墙',
        description: '保存完好的古城墙',
        city_id: 0,
        latitude: 43.7000,
        longitude: 7.1200,
        visit_date: '',
        visit_time: '',
        category: '历史建筑',
        rating: 4.3
      }
    ],
    '格拉斯': [
      {
        id: 0,
        name: '香水博物馆',
        description: '世界香水之都，了解香水历史',
        city_id: 0,
        latitude: 43.6667,
        longitude: 6.9167,
        visit_date: '',
        visit_time: '',
        category: '博物馆',
        rating: 4.5
      },
      {
        id: 0,
        name: '花宫娜香水厂',
        description: '传统香水制作工艺展示',
        city_id: 0,
        latitude: 43.6667,
        longitude: 6.9167,
        visit_date: '',
        visit_time: '',
        category: '博物馆',
        rating: 4.3
      },
      {
        id: 0,
        name: '格拉斯老城',
        description: '中世纪建筑群',
        city_id: 0,
        latitude: 43.6667,
        longitude: 6.9167,
        visit_date: '',
        visit_time: '',
        category: '历史建筑',
        rating: 4.2
      }
    ],
    '昂蒂布': [
      {
        id: 0,
        name: '毕加索博物馆',
        description: '毕加索作品收藏，位于格里马尔迪城堡',
        city_id: 0,
        latitude: 43.5808,
        longitude: 7.1256,
        visit_date: '',
        visit_time: '',
        category: '博物馆',
        rating: 4.6
      },
      {
        id: 0,
        name: '昂蒂布老城',
        description: '历史建筑群，海滨风光',
        city_id: 0,
        latitude: 43.5808,
        longitude: 7.1256,
        visit_date: '',
        visit_time: '',
        category: '历史建筑',
        rating: 4.4
      },
      {
        id: 0,
        name: '昂蒂布港',
        description: '游艇港口，海滨步道',
        city_id: 0,
        latitude: 43.5808,
        longitude: 7.1256,
        visit_date: '',
        visit_time: '',
        category: '自然景观',
        rating: 4.3
      }
    ],
    '马赛': [
      {
        id: 0,
        name: '马赛老港',
        description: '历史悠久的港口，鱼市场',
        city_id: 0,
        latitude: 43.2947,
        longitude: 5.3744,
        visit_date: '',
        visit_time: '',
        category: '历史建筑',
        rating: 4.5
      },
      {
        id: 0,
        name: '圣母加德大教堂',
        description: '马赛地标建筑，俯瞰全城',
        city_id: 0,
        latitude: 43.2900,
        longitude: 5.3700,
        visit_date: '',
        visit_time: '',
        category: '历史建筑',
        rating: 4.6
      },
      {
        id: 0,
        name: '伊夫岛',
        description: '《基督山伯爵》中的监狱岛',
        city_id: 0,
        latitude: 43.2800,
        longitude: 5.3200,
        visit_date: '',
        visit_time: '',
        category: '历史建筑',
        rating: 4.4
      },
      {
        id: 0,
        name: '马赛鱼汤',
        description: '品尝当地特色美食',
        city_id: 0,
        latitude: 43.2947,
        longitude: 5.3744,
        visit_date: '',
        visit_time: '',
        category: '美食',
        rating: 4.3
      }
    ],
    '阿维尼翁': [
      {
        id: 0,
        name: '教皇宫殿',
        description: '中世纪教皇宫殿，世界文化遗产',
        city_id: 0,
        latitude: 43.9500,
        longitude: 4.8000,
        visit_date: '',
        visit_time: '',
        category: '历史建筑',
        rating: 4.7
      },
      {
        id: 0,
        name: '阿维尼翁桥',
        description: '著名的断桥，历史遗迹',
        city_id: 0,
        latitude: 43.9500,
        longitude: 4.8000,
        visit_date: '',
        visit_time: '',
        category: '历史建筑',
        rating: 4.5
      },
      {
        id: 0,
        name: '阿维尼翁老城',
        description: '中世纪建筑群，城墙环绕',
        city_id: 0,
        latitude: 43.9500,
        longitude: 4.8000,
        visit_date: '',
        visit_time: '',
        category: '历史建筑',
        rating: 4.4
      }
    ],
    '阿尔勒': [
      {
        id: 0,
        name: '古罗马竞技场',
        description: '保存完好的古罗马竞技场',
        city_id: 0,
        latitude: 43.6767,
        longitude: 4.6278,
        visit_date: '',
        visit_time: '',
        category: '历史建筑',
        rating: 4.6
      },
      {
        id: 0,
        name: '梵高咖啡馆',
        description: '梵高名画《夜间的咖啡馆》原型',
        city_id: 0,
        latitude: 43.6767,
        longitude: 4.6278,
        visit_date: '',
        visit_time: '',
        category: '历史建筑',
        rating: 4.5
      },
      {
        id: 0,
        name: '阿尔勒古罗马剧院',
        description: '古罗马时期剧院遗址',
        city_id: 0,
        latitude: 43.6767,
        longitude: 4.6278,
        visit_date: '',
        visit_time: '',
        category: '历史建筑',
        rating: 4.4
      }
    ],
    '米兰': [
      {
        id: 0,
        name: '米兰大教堂',
        description: '哥特式建筑的杰作',
        city_id: 0,
        latitude: 45.4642,
        longitude: 9.1900,
        visit_date: '',
        visit_time: '',
        category: '历史建筑',
        rating: 4.6
      },
      {
        id: 0,
        name: '斯卡拉歌剧院',
        description: '世界最著名的歌剧院之一',
        city_id: 0,
        latitude: 45.4676,
        longitude: 9.1900,
        visit_date: '',
        visit_time: '',
        category: '娱乐',
        rating: 4.5
      },
      {
        id: 0,
        name: '斯福尔扎城堡',
        description: '米兰的历史城堡',
        city_id: 0,
        latitude: 45.4700,
        longitude: 9.1800,
        visit_date: '',
        visit_time: '',
        category: '历史建筑',
        rating: 4.3
      },
      {
        id: 0,
        name: '埃马努埃莱二世拱廊',
        description: '米兰的购物中心，玻璃拱顶建筑',
        city_id: 0,
        latitude: 45.4654,
        longitude: 9.1900,
        visit_date: '',
        visit_time: '',
        category: '购物',
        rating: 4.4
      }
    ],
    '佛罗伦萨': [
      {
        id: 0,
        name: '圣母百花大教堂',
        description: '文艺复兴建筑杰作，佛罗伦萨地标',
        city_id: 0,
        latitude: 43.7731,
        longitude: 11.2560,
        visit_date: '',
        visit_time: '',
        category: '历史建筑',
        rating: 4.8
      },
      {
        id: 0,
        name: '乌菲兹美术馆',
        description: '世界顶级艺术博物馆，收藏文艺复兴杰作',
        city_id: 0,
        latitude: 43.7685,
        longitude: 11.2558,
        visit_date: '',
        visit_time: '',
        category: '博物馆',
        rating: 4.7
      },
      {
        id: 0,
        name: '老桥',
        description: '中世纪石桥，珠宝店林立',
        city_id: 0,
        latitude: 43.7679,
        longitude: 11.2530,
        visit_date: '',
        visit_time: '',
        category: '历史建筑',
        rating: 4.5
      },
      {
        id: 0,
        name: '米开朗基罗广场',
        description: '俯瞰佛罗伦萨全景的最佳位置',
        city_id: 0,
        latitude: 43.7629,
        longitude: 11.2650,
        visit_date: '',
        visit_time: '',
        category: '自然景观',
        rating: 4.6
      },
      {
        id: 0,
        name: '领主广场',
        description: '露天雕塑博物馆，大卫像复制品',
        city_id: 0,
        latitude: 43.7696,
        longitude: 11.2558,
        visit_date: '',
        visit_time: '',
        category: '历史建筑',
        rating: 4.4
      }
    ],
    '威尼斯': [
      {
        id: 0,
        name: '圣马可广场',
        description: '威尼斯的心脏，欧洲最美的客厅',
        city_id: 0,
        latitude: 45.4342,
        longitude: 12.3388,
        visit_date: '',
        visit_time: '',
        category: '历史建筑',
        rating: 4.8
      },
      {
        id: 0,
        name: '圣马可大教堂',
        description: '拜占庭建筑杰作，金碧辉煌',
        city_id: 0,
        latitude: 45.4342,
        longitude: 12.3388,
        visit_date: '',
        visit_time: '',
        category: '历史建筑',
        rating: 4.7
      },
      {
        id: 0,
        name: '总督宫',
        description: '威尼斯共和国权力中心，哥特式建筑',
        city_id: 0,
        latitude: 45.4339,
        longitude: 12.3400,
        visit_date: '',
        visit_time: '',
        category: '历史建筑',
        rating: 4.6
      },
      {
        id: 0,
        name: '叹息桥',
        description: '连接监狱和法院的桥，浪漫传说',
        city_id: 0,
        latitude: 45.4336,
        longitude: 12.3408,
        visit_date: '',
        visit_time: '',
        category: '历史建筑',
        rating: 4.5
      },
      {
        id: 0,
        name: '大运河',
        description: '乘坐贡多拉游览威尼斯',
        city_id: 0,
        latitude: 45.4342,
        longitude: 12.3388,
        visit_date: '',
        visit_time: '',
        category: '自然景观',
        rating: 4.7
      }
    ],
    '比萨': [
      {
        id: 0,
        name: '比萨斜塔',
        description: '世界著名地标，倾斜的奇迹',
        city_id: 0,
        latitude: 43.7230,
        longitude: 10.3966,
        visit_date: '',
        visit_time: '',
        category: '历史建筑',
        rating: 4.6
      },
      {
        id: 0,
        name: '比萨大教堂',
        description: '罗马式建筑，比萨斜塔的配套建筑',
        city_id: 0,
        latitude: 43.7230,
        longitude: 10.3966,
        visit_date: '',
        visit_time: '',
        category: '历史建筑',
        rating: 4.4
      },
      {
        id: 0,
        name: '圣若望洗礼堂',
        description: '圆形洗礼堂，比萨建筑群的一部分',
        city_id: 0,
        latitude: 43.7230,
        longitude: 10.3966,
        visit_date: '',
        visit_time: '',
        category: '历史建筑',
        rating: 4.3
      }
    ],
    '五渔村': [
      {
        id: 0,
        name: '蒙特罗索',
        description: '五渔村之一，最大的村庄',
        city_id: 0,
        latitude: 44.1456,
        longitude: 9.6547,
        visit_date: '',
        visit_time: '',
        category: '自然景观',
        rating: 4.7
      },
      {
        id: 0,
        name: '韦尔纳扎',
        description: '彩色房屋，悬崖上的村庄',
        city_id: 0,
        latitude: 44.1350,
        longitude: 9.6847,
        visit_date: '',
        visit_time: '',
        category: '自然景观',
        rating: 4.6
      },
      {
        id: 0,
        name: '科尔尼利亚',
        description: '山顶村庄，需要爬台阶到达',
        city_id: 0,
        latitude: 44.1200,
        longitude: 9.7100,
        visit_date: '',
        visit_time: '',
        category: '自然景观',
        rating: 4.5
      },
      {
        id: 0,
        name: '马纳罗拉',
        description: '最上镜的村庄，彩色房屋',
        city_id: 0,
        latitude: 44.1039,
        longitude: 9.7300,
        visit_date: '',
        visit_time: '',
        category: '自然景观',
        rating: 4.8
      },
      {
        id: 0,
        name: '里奥马焦雷',
        description: '爱情之路的起点',
        city_id: 0,
        latitude: 44.1000,
        longitude: 9.7400,
        visit_date: '',
        visit_time: '',
        category: '自然景观',
        rating: 4.6
      }
    ],
    '那不勒斯': [
      {
        id: 0,
        name: '那不勒斯老城',
        description: '联合国世界遗产，历史建筑群',
        city_id: 0,
        latitude: 40.8518,
        longitude: 14.2681,
        visit_date: '',
        visit_time: '',
        category: '历史建筑',
        rating: 4.5
      },
      {
        id: 0,
        name: '庞贝古城',
        description: '古罗马城市遗址，被火山掩埋',
        city_id: 0,
        latitude: 40.7489,
        longitude: 14.5038,
        visit_date: '',
        visit_time: '',
        category: '历史建筑',
        rating: 4.8
      },
      {
        id: 0,
        name: '维苏威火山',
        description: '活火山，庞贝古城的毁灭者',
        city_id: 0,
        latitude: 40.8222,
        longitude: 14.4269,
        visit_date: '',
        visit_time: '',
        category: '自然景观',
        rating: 4.4
      },
      {
        id: 0,
        name: '那不勒斯国家考古博物馆',
        description: '庞贝文物收藏，世界顶级考古博物馆',
        city_id: 0,
        latitude: 40.8534,
        longitude: 14.2500,
        visit_date: '',
        visit_time: '',
        category: '博物馆',
        rating: 4.6
      }
    ],
    '罗马': [
      {
        id: 0,
        name: '斗兽场',
        description: '古罗马的象征',
        city_id: 0,
        latitude: 41.8902,
        longitude: 12.4922,
        visit_date: '',
        visit_time: '',
        category: '历史建筑',
        rating: 4.7
      },
      {
        id: 0,
        name: '梵蒂冈城',
        description: '世界上最小的国家',
        city_id: 0,
        latitude: 41.9022,
        longitude: 12.4539,
        visit_date: '',
        visit_time: '',
        category: '历史建筑',
        rating: 4.8
      },
      {
        id: 0,
        name: '特雷维喷泉',
        description: '罗马最著名的喷泉',
        city_id: 0,
        latitude: 41.9009,
        longitude: 12.4833,
        visit_date: '',
        visit_time: '',
        category: '历史建筑',
        rating: 4.4
      },
      {
        id: 0,
        name: '万神殿',
        description: '古罗马建筑杰作',
        city_id: 0,
        latitude: 41.8986,
        longitude: 12.4769,
        visit_date: '',
        visit_time: '',
        category: '历史建筑',
        rating: 4.6
      },
      {
        id: 0,
        name: '西班牙广场',
        description: '罗马最著名的广场，西班牙台阶',
        city_id: 0,
        latitude: 41.9058,
        longitude: 12.4822,
        visit_date: '',
        visit_time: '',
        category: '历史建筑',
        rating: 4.5
      },
      {
        id: 0,
        name: '古罗马广场',
        description: '古罗马政治中心，历史遗迹',
        city_id: 0,
        latitude: 41.8925,
        longitude: 12.4853,
        visit_date: '',
        visit_time: '',
        category: '历史建筑',
        rating: 4.6
      }
    ],
    '布达佩斯': [
      {
        id: 0,
        name: '布达城堡',
        description: '俯瞰多瑙河的历史城堡',
        city_id: 0,
        latitude: 47.4960,
        longitude: 19.0399,
        visit_date: '',
        visit_time: '',
        category: '历史建筑',
        rating: 4.6
      },
      {
        id: 0,
        name: '国会大厦',
        description: '匈牙利国会所在地',
        city_id: 0,
        latitude: 47.5079,
        longitude: 19.0456,
        visit_date: '',
        visit_time: '',
        category: '历史建筑',
        rating: 4.7
      },
      {
        id: 0,
        name: '塞切尼温泉浴场',
        description: '欧洲最大的温泉浴场',
        city_id: 0,
        latitude: 47.5156,
        longitude: 19.0800,
        visit_date: '',
        visit_time: '',
        category: '娱乐',
        rating: 4.4
      }
    ]
  };

  useEffect(() => {
    fetchItineraries();
  }, []);

  const fetchItineraries = async () => {
    try {
      // 直接获取ID为4的完整欧洲行程
      const response = await itineraryAPI.getById(4);
      setItineraries([response.data]);
      setSelectedItinerary(response.data);
    } catch (error) {
      console.error('获取行程失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRouteCoordinates = (cities: City[]) => {
    return cities.map(city => [city.latitude, city.longitude] as [number, number]);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-CN');
  };

  if (loading) {
    return (
      <div className="map-page">
        <div className="loading">加载中...</div>
      </div>
    );
  }

  return (
    <div className="map-page">
      <div className="map-sidebar">
        <h2>欧洲旅游地图</h2>

        <div className="itinerary-selector">
          <label>当前行程：</label>
          <div className="current-itinerary">
            {selectedItinerary?.title || '加载中...'}
          </div>
        </div>

        {selectedItinerary && (
          <div className="itinerary-info">
            <h3>{selectedItinerary.title}</h3>
            <div className="itinerary-dates">
              <Calendar className="date-icon" />
              <span>{formatDate(selectedItinerary.start_date)} - {formatDate(selectedItinerary.end_date)}</span>
            </div>

            {selectedItinerary.cities && selectedItinerary.cities.length > 0 && (
              <div className="cities-list">
                <h4>行程城市</h4>
                {selectedItinerary.cities.map((city, index) => (
                  <div key={city.id} className="city-item">
                    <div className="city-number">{index + 1}</div>
                    <div className="city-details">
                      <div className="city-name">{city.name}</div>
                      <div className="city-country">{city.country}</div>
                      <div className="city-dates">
                        {formatDate(city.arrival_date)} - {formatDate(city.departure_date)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {selectedItinerary.transportation && selectedItinerary.transportation.length > 0 && (
              <div className="transportation-list">
                <h4>交通方式</h4>
                {selectedItinerary.transportation.map((transport, index) => {
                  const fromCity = selectedItinerary.cities?.find(city => city.id === transport.from_city_id);
                  const toCity = selectedItinerary.cities?.find(city => city.id === transport.to_city_id);

                  if (!fromCity || !toCity) return null;

                  return (
                    <div key={index} className="transport-item">
                      <div className="transport-icon-container">
                        {getTransportIcon(transport.transport_type)}
                      </div>
                      <div className="transport-details">
                        <div className="transport-route">
                          {fromCity.name} → {toCity.name}
                        </div>
                        <div className="transport-type">{transport.transport_type}</div>
                        <div className="transport-time">
                          {transport.departure_time} - {transport.arrival_time}
                        </div>
                        <div className="transport-duration">
                          行程时间: {transport.duration}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        <div className="recommended-attractions">
          <h4>推荐景点</h4>
          <div className="attractions-list">
            {Object.entries(recommendedAttractions).map(([city, attractions]) => (
              <div key={city} className="city-attractions">
                <h5>{city}</h5>
                {attractions.map((attraction, index) => (
                  <div key={index} className="attraction-item">
                    <div className="attraction-name">{attraction.name}</div>
                    <div className="attraction-rating">
                      <Star className="star-icon" />
                      <span>{attraction.rating}</span>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="map-container">
        <MapContainer
          center={mapCenter}
          zoom={mapZoom}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />

          {/* 显示选中的行程路线 */}
          {selectedItinerary && selectedItinerary.cities && selectedItinerary.cities.length > 0 && (
            <>
              {/* 绘制交通路线 */}
              {selectedItinerary.transportation && selectedItinerary.transportation.map((transport, index) => {
                const fromCity = selectedItinerary.cities?.find(city => city.id === transport.from_city_id);
                const toCity = selectedItinerary.cities?.find(city => city.id === transport.to_city_id);

                if (!fromCity || !toCity) return null;

                // 计算路线中点位置，用于放置交通工具图标
                const midLat = (fromCity.latitude + toCity.latitude) / 2;
                const midLng = (fromCity.longitude + toCity.longitude) / 2;

                return (
                  <React.Fragment key={index}>
                    {/* 交通路线 */}
                    <Polyline
                      positions={[
                        [fromCity.latitude, fromCity.longitude],
                        [toCity.latitude, toCity.longitude]
                      ]}
                      color={getTransportColor(transport.transport_type)}
                      weight={6}
                      opacity={0.8}
                    />

                    {/* 交通工具图标 */}
                    <Marker
                      position={[midLat, midLng]}
                      icon={createTransportIcon(transport.transport_type)}
                    >
                      <Popup>
                        <div className="transport-popup">
                          <h3>{transport.transport_type}</h3>
                          <p><strong>路线:</strong> {fromCity.name} → {toCity.name}</p>
                          <p><strong>时间:</strong> {transport.departure_time} - {transport.arrival_time}</p>
                          <p><strong>行程时间:</strong> {transport.duration}</p>
                        </div>
                      </Popup>
                    </Marker>
                  </React.Fragment>
                );
              })}

              {/* 城市标记 */}
              {selectedItinerary.cities.map((city, index) => (
                <Marker key={city.id} position={[city.latitude, city.longitude]}>
                  <Popup>
                    <div className="city-popup">
                      <h3>{city.name}</h3>
                      <p>{city.country}</p>
                      <div className="popup-dates">
                        <Calendar className="popup-icon" />
                        <span>{formatDate(city.arrival_date)} - {formatDate(city.departure_date)}</span>
                      </div>
                      {city.attractions && city.attractions.length > 0 && (
                        <div className="popup-attractions">
                          <h4>景点：</h4>
                          {city.attractions.map(attraction => (
                            <div key={attraction.id} className="popup-attraction">
                              <span>{attraction.name}</span>
                              <div className="popup-rating">
                                <Star className="popup-star" />
                                <span>{attraction.rating}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </Popup>
                </Marker>
              ))}

              {/* 城市标签 */}
              {selectedItinerary.cities.map((city, index) => {
                const isMajor = majorCities.includes(city.name);
                const labelOffset: [number, number] = isMajor ? [0, -25] : [0, -20];

                return (
                  <Marker
                    key={`label-${city.id}`}
                    position={[city.latitude, city.longitude]}
                    icon={createCityLabelIcon(city.name, isMajor)}
                  >
                    <Tooltip
                      direction="top"
                      offset={labelOffset}
                      opacity={1}
                      permanent={true}
                      className="city-tooltip"
                    >
                      {city.name}
                    </Tooltip>
                  </Marker>
                );
              })}

              {/* 绘制完整的行程路线（连接所有城市） */}
              {selectedItinerary.cities && selectedItinerary.cities.length > 1 && (
                <Polyline
                  positions={selectedItinerary.cities.map(city => [city.latitude, city.longitude] as [number, number])}
                  color="#667eea"
                  weight={3}
                  opacity={0.6}
                  dashArray="10, 10"
                />
              )}
            </>
          )}

          {/* 显示推荐景点 */}
          {Object.entries(recommendedAttractions).map(([cityName, attractions]) =>
            attractions.map((attraction, index) => (
              <Marker
                key={`${cityName}-${index}`}
                position={[attraction.latitude, attraction.longitude]}
                opacity={0.7}
              >
                <Popup>
                  <div className="attraction-popup">
                    <h3>{attraction.name}</h3>
                    <p>{attraction.description}</p>
                    <div className="popup-meta">
                      <span className="popup-category">{attraction.category}</span>
                      <div className="popup-rating">
                        <Star className="popup-star" />
                        <span>{attraction.rating}</span>
                      </div>
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))
          )}
        </MapContainer>
      </div>
    </div>
  );
};

export default MapPage;
