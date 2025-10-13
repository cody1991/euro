import React, { useState, useRef } from 'react';
import html2canvas from 'html2canvas';
import { Hotel, MapPin, Star, DollarSign, Calendar, Shield, Lightbulb, CheckCircle, AlertCircle } from 'lucide-react';
import ScrollButtons from '../components/ScrollButtons';
import { citiesData } from '../models/travelData';
import './HotelGuide.css';

const HotelGuide: React.FC = () => {
  const [exporting, setExporting] = useState(false);
  const guideRef = useRef<HTMLDivElement>(null);

  // 从行程数据中获取城市信息
  const getCityItinerary = (cityName: string) => {
    const city = citiesData.find(c => c.name_en === cityName || c.name === cityName);
    if (!city || !city.accommodation || !city.accommodation.check_in || !city.accommodation.check_out) return null;

    const checkIn = new Date(city.accommodation.check_in);
    const checkOut = new Date(city.accommodation.check_out);
    const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));

    return {
      checkIn: city.accommodation.check_in,
      checkOut: city.accommodation.check_out,
      nights,
      formattedCheckIn: checkIn.toLocaleDateString('zh-CN', { month: '2-digit', day: '2-digit' }),
      formattedCheckOut: checkOut.toLocaleDateString('zh-CN', { month: '2-digit', day: '2-digit' })
    };
  };

  const handleExportImage = async () => {
    if (!guideRef.current) return;

    setExporting(true);
    try {
      const canvas = await html2canvas(guideRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });

      const link = document.createElement('a');
      link.download = '欧洲酒店预订攻略.png';
      link.href = canvas.toDataURL();
      link.click();
    } catch (error) {
      console.error('导出图片失败:', error);
      alert('导出失败，请重试');
    } finally {
      setExporting(false);
    }
  };

  const hotelRecommendations = [
    {
      city: '阿姆斯特丹',
      flag: '🇳🇱',
      nights: '2晚',
      recommendedAreas: ['中央火车站（Centraal Station）周边', '博物馆区（Museumplein）', '约丹区（Jordaan）', '运河带（Canal Ring）'],
      hotels: [
        {
          name: 'citizenM Amsterdam South',
          rating: 8.8,
          price: '€70-100',
          location: '近地铁，20分钟到市中心',
          features: ['设计酒店', '现代感强', '性价比高']
        },
        {
          name: 'Hotel V Nesplein',
          rating: 8.5,
          price: '€100-150',
          location: '市中心，步行到水坝广场5分钟',
          features: ['精品酒店', '荷兰特色', '位置绝佳']
        }
      ],
      tips: ['确认有电梯（老建筑多）', '含早餐划算（€15-20）', '中央火车站最方便，博物馆区最文艺']
    },
    {
      city: '巴黎',
      flag: '🇫🇷',
      nights: '3晚',
      recommendedAreas: ['拉丁区（第5区）', '圣日耳曼（第6区）', '埃菲尔铁塔区（第7区）', '玛黑区（第4区）'],
      avoidAreas: ['第18、19、20区（较偏远不安全）'],
      hotels: [
        {
          name: 'Hotel du Danube Saint Germain',
          rating: 8.4,
          price: '€80-120',
          location: '圣日耳曼区（第6区）',
          features: ['典型巴黎小酒店', '有格调', '安全区域']
        },
        {
          name: 'Hotel Monge',
          rating: 8.6,
          price: '€120-180',
          location: '拉丁区（第5区），近巴黎圣母院',
          features: ['位置绝佳', '走到卢浮宫15分钟', '地铁方便']
        }
      ],
      tips: ['第5、6、7区最安全便利', '必须靠近地铁站', '巴黎很大，位置很重要']
    },
    {
      city: '里昂',
      flag: '🇫🇷',
      nights: '1晚',
      recommendedAreas: ['里昂帕尔迪厄站（Part-Dieu）周边', '老城区（Vieux Lyon）', '白莱果广场（Place Bellecour）', '半岛区（Presqu\'île）'],
      hotels: [
        {
          name: 'Hotel des Artistes',
          rating: 8.3,
          price: '€60-90',
          location: '帕尔迪厄站步行3分钟',
          features: ['交通便利', '现代装修', '性价比高']
        },
        {
          name: 'Hotel des Celestins',
          rating: 8.5,
          price: '€80-120',
          location: '老城区，近富维耶圣母院',
          features: ['历史建筑', '位置绝佳', '法式风情']
        }
      ],
      tips: ['帕尔迪厄站最方便转车', '老城区很有特色但贵', '里昂是美食之都，酒店含早餐划算']
    },
    {
      city: '马赛',
      flag: '🇫🇷',
      nights: '1晚',
      recommendedAreas: ['马赛圣夏勒站（Saint-Charles）周边', '老港（Vieux Port）', '卡纳比耶区（Canebière）', '新港区（Port Moderne）'],
      hotels: [
        {
          name: 'Hotel Saint Charles',
          rating: 8.2,
          price: '€55-85',
          location: '圣夏勒站步行2分钟',
          features: ['交通便利', '经济实惠', '干净整洁']
        },
        {
          name: 'Hotel Bellevue',
          rating: 8.4,
          price: '€75-110',
          location: '老港附近，步行5分钟',
          features: ['海港景观', '位置优越', '地中海风情']
        }
      ],
      tips: ['圣夏勒站最方便', '老港区安全但贵', '马赛治安一般，选择酒店要谨慎']
    },
    {
      city: '尼斯',
      flag: '🇫🇷',
      nights: '1晚',
      recommendedAreas: ['尼斯火车站（Gare de Nice-Ville）', '天使湾（Promenade des Anglais）', '老城区（Vieux Nice）', '港口区（Port）'],
      hotels: [
        {
          name: 'Hotel Vendome',
          rating: 8.3,
          price: '€60-100',
          location: '尼斯火车站步行5分钟',
          features: ['经济实惠', '交通便利', '干净整洁']
        },
        {
          name: 'Hotel de la Mer',
          rating: 8.5,
          price: '€90-150',
          location: '天使湾海滩旁',
          features: ['海景房', '位置绝佳', '法式风情']
        }
      ],
      tips: ['火车站去摩纳哥方便', '海边景观好但贵€20-30', '比巴黎便宜30%']
    },
    {
      city: '摩纳哥',
      flag: '🇲🇨',
      nights: '1晚',
      recommendedAreas: ['蒙特卡洛（Monte Carlo）', '拉孔达米讷（La Condamine）', '摩纳哥城（Monaco-Ville）', '丰维耶（Fontvieille）'],
      hotels: [
        {
          name: 'Hotel Ambassador Monaco',
          rating: 8.4,
          price: '€120-180',
          location: '蒙特卡洛，近赌场',
          features: ['位置绝佳', '豪华装修', '服务优质']
        },
        {
          name: 'Hotel de France',
          rating: 8.2,
          price: '€100-150',
          location: '拉孔达米讷，近港口',
          features: ['性价比高', '港口景观', '交通便利']
        }
      ],
      tips: ['摩纳哥酒店普遍昂贵', '可以考虑住尼斯当天往返', '蒙特卡洛最豪华但也最贵']
    },
    {
      city: '米兰',
      flag: '🇮🇹',
      nights: '1晚',
      recommendedAreas: ['米兰中央车站（Centrale）周边', '大教堂广场（Duomo）', '布雷拉区（Brera）', '纳维利区（Navigli）'],
      hotels: [
        {
          name: 'Hotel Berna',
          rating: 8.5,
          price: '€80-120',
          location: '中央车站步行3分钟',
          features: ['交通便利', '现代装修', '含早餐']
        },
        {
          name: 'Hotel Spadari al Duomo',
          rating: 8.6,
          price: '€120-180',
          location: '大教堂广场步行2分钟',
          features: ['位置绝佳', '设计酒店', '艺术装饰']
        }
      ],
      tips: ['中央车站最方便', '大教堂区最贵但最方便', '米兰是购物天堂，酒店含早餐划算']
    },
    {
      city: '维罗纳',
      flag: '🇮🇹',
      nights: '1晚',
      recommendedAreas: ['维罗纳门户新站（Porta Nuova）周边', '朱丽叶故居附近', '布拉广场（Piazza Bra）', '老城区（Centro Storico）'],
      hotels: [
        {
          name: 'Hotel Giulietta e Romeo',
          rating: 8.4,
          price: '€70-110',
          location: '朱丽叶故居步行5分钟',
          features: ['浪漫主题', '位置优越', '性价比高']
        },
        {
          name: 'Hotel Gabbia d\'Oro',
          rating: 8.7,
          price: '€120-200',
          location: '老城区中心',
          features: ['豪华装修', '历史建筑', '服务优质']
        }
      ],
      tips: ['维罗纳很小，步行即可', '朱丽叶故居必去', '从米兰过来需要住一晚，第二天去威尼斯']
    },
    {
      city: '威尼斯',
      flag: '🇮🇹',
      nights: '1晚',
      recommendedAreas: ['圣马可广场（San Marco）附近', 'Cannaregio区（安静）', 'Dorsoduro区（文艺）', 'Mestre大陆（经济实惠）'],
      hotels: [
        {
          name: 'Hotel Al Piave',
          rating: 8.7,
          price: '€80-130',
          location: '圣马可广场步行10分钟',
          features: ['家庭经营', '安静舒适', '性价比高']
        },
        {
          name: 'Ca\' Alvise',
          rating: 8.5,
          price: '€120-200',
          location: 'Cannaregio区，近火车站',
          features: ['运河景观', '传统威尼斯建筑', '含早餐']
        }
      ],
      tips: ['主岛贵，Mestre便宜一半', '提前3个月预订', '水上巴士票€7.5/次']
    },
    {
      city: '佛罗伦萨',
      flag: '🇮🇹',
      nights: '1晚',
      recommendedAreas: ['圣母百花大教堂周边', '老桥（Ponte Vecchio）附近', '圣十字广场区', 'Oltrarno区（河对岸，安静）'],
      hotels: [
        {
          name: 'Hotel Cestelli',
          rating: 8.6,
          price: '€70-120',
          location: '老城区，步行到所有景点',
          features: ['位置完美', '家庭旅馆', '性价比极高']
        },
        {
          name: 'Hotel Davanzati',
          rating: 8.4,
          price: '€100-170',
          location: '圣母百花大教堂步行5分钟',
          features: ['历史建筑', '屋顶露台', '早餐丰富']
        }
      ],
      tips: ['老城区ZTL限行（不能开车）', '佛罗伦萨小，哪里都能走到', '河对岸Oltrarno更安静便宜']
    },
    {
      city: '比萨',
      flag: '🇮🇹',
      nights: '0晚（一日游）',
      recommendedAreas: ['比萨中央车站（Centrale）周边', '奇迹广场（Piazza dei Miracoli）附近', '比萨大学区', '老城区（Centro Storico）'],
      hotels: [
        {
          name: 'Hotel Relais dell\'Orologio',
          rating: 8.5,
          price: '€80-130',
          location: '奇迹广场步行5分钟',
          features: ['位置绝佳', '历史建筑', '性价比高']
        },
        {
          name: 'Hotel di Stefano',
          rating: 8.3,
          price: '€60-100',
          location: '中央车站步行8分钟',
          features: ['交通便利', '经济实惠', '干净整洁']
        }
      ],
      tips: ['比萨很小，步行即可', '奇迹广场必去', '从佛罗伦萨当天往返（09:00-14:00），下午去罗马']
    },
    {
      city: '梵蒂冈',
      flag: '🇻🇦',
      nights: '0晚（一日游）',
      recommendedAreas: ['罗马特米尼站（Termini）周边', '梵蒂冈附近', '纳沃纳广场（Navona）', '特雷维喷泉（Trevi）'],
      hotels: [
        {
          name: 'Hotel Artemide',
          rating: 8.6,
          price: '€90-140',
          location: '中央火车站步行5分钟',
          features: ['位置优越', '屋顶露台', '含早餐']
        },
        {
          name: 'Hotel Raffaello',
          rating: 8.4,
          price: '€110-180',
          location: '共和广场附近，近地铁',
          features: ['干净舒适', '交通便利', '性价比高']
        }
      ],
      tips: ['梵蒂冈在罗马市内', '建议住罗马，当天参观', '提前预订梵蒂冈博物馆门票']
    },
    {
      city: '罗马',
      flag: '🇮🇹',
      nights: '2晚',
      recommendedAreas: ['Termini火车站周边', 'Navona广场区', 'Trevi喷泉区', 'Trastevere区（河对岸，特色餐厅多）'],
      hotels: [
        {
          name: 'Hotel Artemide',
          rating: 8.6,
          price: '€90-140',
          location: '中央火车站步行5分钟',
          features: ['位置优越', '屋顶露台', '含早餐']
        },
        {
          name: 'Hotel Raffaello',
          rating: 8.4,
          price: '€110-180',
          location: '共和广场附近，近地铁',
          features: ['干净舒适', '交通便利', '性价比高']
        }
      ],
      tips: ['Termini火车站最方便', '地铁A/B线交汇', '城市税约€3-7/人/晚']
    },
    {
      city: '那不勒斯',
      flag: '🇮🇹',
      nights: '2晚',
      recommendedAreas: ['那不勒斯中央车站（Centrale）周边', '历史中心（Centro Storico）', '港口区（Porto）', '沃梅罗区（Vomero）'],
      hotels: [
        {
          name: 'Hotel Garibaldi',
          rating: 8.2,
          price: '€50-80',
          location: '中央车站步行3分钟',
          features: ['交通便利', '经济实惠', '干净整洁']
        },
        {
          name: 'Hotel Excelsior',
          rating: 8.5,
          price: '€80-130',
          location: '港口区，海景房',
          features: ['海景房', '位置优越', '性价比高']
        }
      ],
      tips: ['中央车站最方便', '历史中心有特色但治安一般', '那不勒斯是披萨发源地', '可以参观庞贝古城']
    },
    {
      city: '阿姆斯特丹（返程）',
      flag: '🇳🇱',
      nights: '1晚',
      recommendedAreas: ['史基浦机场附近', '中央火车站（Centraal Station）周边', '机场酒店区'],
      hotels: [
        {
          name: 'citizenM Amsterdam Airport',
          rating: 8.6,
          price: '€80-120',
          location: '史基浦机场内，步行5分钟到登机口',
          features: ['机场内酒店', '转机方便', '现代设计']
        },
        {
          name: 'Holiday Inn Express Amsterdam Airport',
          rating: 8.3,
          price: '€70-100',
          location: '机场附近，免费班车',
          features: ['免费班车', '含早餐', '性价比高']
        }
      ],
      tips: ['返程前一晚住机场附近最方便', '可以寄存行李', '第二天早上直接登机']
    }
  ];

  const moneySavingTips = [
    {
      icon: '💎',
      title: 'Genius 会员折扣',
      description: '订5次自动升级，享受10-15%折扣',
      details: ['可以先订国内酒店凑次数', '针对欧洲酒店很划算', '额外享受免费升级']
    },
    {
      icon: '📅',
      title: '灵活日期选择',
      description: '周日-周四比周末便宜20-30%',
      details: ['避开欧洲假期', '提前2-3个月预订', '使用"灵活日期"功能']
    },
    {
      icon: '💳',
      title: '信用卡返现',
      description: '境外消费返现3-5%',
      details: ['招行经典白/AE白金', '中信visa/master', '叠加Booking折扣']
    },
    {
      icon: '🏠',
      title: '房间共享',
      description: '双人房平摊，每人省€20-30/晚',
      details: ['2人订双人房', '3人可加床', '长住折扣3晚+']
    }
  ];

  const bookingProcess = [
    {
      step: 1,
      title: '筛选条件设置',
      icon: '🔍',
      items: [
        '评分：8.0+',
        '免费取消：必选',
        '位置：市中心/地铁站1km内',
        '设施：WiFi、电梯'
      ]
    },
    {
      step: 2,
      title: '查看评价重点',
      icon: '⭐',
      items: [
        '位置评分（8.5+）',
        '清洁度（9.0+）',
        '安静程度（8.0+）',
        'WiFi质量'
      ]
    },
    {
      step: 3,
      title: '确认预订细节',
      icon: '✅',
      items: [
        '日期正确',
        '姓名与护照一致',
        '取消政策',
        '是否含早餐'
      ]
    },
    {
      step: 4,
      title: '下载确认单',
      icon: '📄',
      items: [
        '英文版PDF',
        '保存到文件夹',
        '截图备份',
        '打印纸质版'
      ]
    }
  ];

  const visaTips = [
    {
      icon: '📋',
      title: '预订时间线',
      content: 'Week 1-2: 预订所有酒店（选免费取消）→ Week 3: 下载确认单 → Week 4: 递交签证 → Week 6-7: 通过后检查价格'
    },
    {
      icon: '✓',
      title: '确认单必含信息',
      content: '姓名（与护照一致）、酒店地址电话、入住退房日期、预订号、总价、取消政策'
    },
    {
      icon: '🗺️',
      title: '行程匹配',
      content: '酒店日期必须覆盖整个行程，不能有空白日期，城市顺序要和申请表一致'
    },
    {
      icon: '🏆',
      title: '主要停留国家',
      content: '统计每个国家停留天数，在停留最长的国家申请签证，确保该国酒店预订最多'
    }
  ];

  const faqs = [
    {
      q: '免费取消到什么时候？',
      a: '常见的有：入住前1天（最常见）、3天、7天，或不可取消。建议签证前选"入住前1天"，灵活性最高。'
    },
    {
      q: '预授权是什么？会扣钱吗？',
      a: '预授权=冻结信用卡额度（€50-200），不是真的扣款，退房后3-7天解冻。注意不要用借记卡。'
    },
    {
      q: '城市税是什么？',
      a: '欧洲城市的住宿税，不包含在Booking价格里，入住时现场收取，通常€2-5/人/晚。阿姆斯特丹€3-7，巴黎€0.25-4，苏黎世CHF3-5。'
    },
    {
      q: '可以提前寄存行李吗？',
      a: '大部分可以，通过Booking App发消息询问或直接询问前台，通常免费，建议给小费€1-2。Check-in通常14:00-15:00。'
    },
    {
      q: '到店发现和图片不一样怎么办？',
      a: '立即拍照、联系前台要求换房，无法解决就联系Booking客服协助换酒店或退款。黄金处理时间：发现问题后1小时内。'
    }
  ];

  // 从 citiesData 动态生成预算表
  const generateBudgetTable = () => {
    const budgetConfig: { [key: string]: { budget: string; midRange: string; note: string } } = {
      '阿姆斯特丹': { budget: '€70-100', midRange: '€100-150', note: '酒店较贵' },
      '巴黎': { budget: '€80-120', midRange: '€120-180', note: '看区域' },
      '里昂': { budget: '€60-90', midRange: '€80-120', note: '美食之都' },
      '马赛': { budget: '€55-85', midRange: '€75-110', note: '治安一般' },
      '尼斯': { budget: '€60-100', midRange: '€90-150', note: '海边酒店贵' },
      '摩纳哥': { budget: '€120-180', midRange: '€150-250', note: '最昂贵' },
      '米兰': { budget: '€80-120', midRange: '€120-180', note: '购物天堂' },
      '维罗纳': { budget: '€70-110', midRange: '€120-200', note: '浪漫之城' },
      '威尼斯': { budget: '€80-130', midRange: '€120-200', note: '岛上酒店贵' },
      '佛罗伦萨': { budget: '€70-120', midRange: '€100-170', note: '老城区贵' },
      '罗马': { budget: '€90-140', midRange: '€110-180', note: '火车站附近性价比高' },
      '那不勒斯': { budget: '€50-80', midRange: '€80-130', note: '披萨发源地' }
    };

    const budgetTable = [];

    // 处理有住宿的城市，按 check_in 日期排序
    const citiesWithAccommodation = citiesData
      .filter(city => city.accommodation && city.accommodation.check_in && city.accommodation.check_out)
      .sort((a, b) => new Date(a.accommodation!.check_in!).getTime() - new Date(b.accommodation!.check_in!).getTime());

    citiesWithAccommodation.forEach(city => {
      const checkIn = new Date(city.accommodation!.check_in!);
      const checkOut = new Date(city.accommodation!.check_out!);
      const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));

      const config = budgetConfig[city.name] || { budget: '€60-100', midRange: '€80-150', note: '标准价格' };
      const budgetPerNight = config.budget;
      const midRangePerNight = config.midRange;

      // 计算总预算
      const budgetTotal = nights > 0 ? `€${parseInt(budgetPerNight.split('-')[0].replace('€', '')) * nights}-${parseInt(budgetPerNight.split('-')[1]) * nights}` : '€0';
      const midRangeTotal = nights > 0 ? `€${parseInt(midRangePerNight.split('-')[0].replace('€', '')) * nights}-${parseInt(midRangePerNight.split('-')[1]) * nights}` : '€0';

      budgetTable.push({
        city: city.name,
        nights: `${nights}晚`,
        dates: formatDateRange(checkIn, checkOut),
        checkIn: formatDateForBooking(checkIn),
        checkOut: formatDateForBooking(checkOut),
        budget: budgetTotal,
        midRange: midRangeTotal,
        note: config.note,
        accommodation: city.name,
        sortDate: checkIn // 添加排序用的日期
      });
    });

    // 添加一日游城市
    const dayTripCities = [
      { name: '比萨', date: '2026-02-21', accommodation: '比萨' },
      { name: '梵蒂冈', date: '2026-02-21', accommodation: '罗马' }
    ];

    dayTripCities.forEach(trip => {
      const date = new Date(trip.date);
      const nextDay = new Date(date);
      nextDay.setDate(nextDay.getDate() + 1);

      budgetTable.push({
        city: trip.name,
        nights: '1晚',
        dates: formatSingleDate(date),
        checkIn: formatDateForBooking(date),
        checkOut: formatDateForBooking(nextDay),
        budget: trip.name === '比萨' ? '€80-130' : '€0',
        midRange: trip.name === '比萨' ? '€120-200' : '€0',
        note: trip.name === '比萨' ? '可选择住宿' : '一日游',
        accommodation: trip.accommodation,
        sortDate: date
      });
    });

    // 添加返程住宿
    const returnDate = new Date('2026-02-26');
    const returnCheckOut = new Date('2026-02-27'); // 返程第二天
    budgetTable.push({
      city: '阿姆斯特丹（返程）',
      nights: '1晚',
      dates: formatSingleDate(returnDate),
      checkIn: formatDateForBooking(returnDate),
      checkOut: formatDateForBooking(returnCheckOut),
      budget: '€70-100',
      midRange: '€80-120',
      note: '机场酒店',
      accommodation: '阿姆斯特丹机场',
      sortDate: returnDate
    });

    return budgetTable.sort((a, b) => {
      // 直接使用 sortDate 进行排序
      return a.sortDate.getTime() - b.sortDate.getTime();
    });
  };

  // 辅助函数：格式化日期范围
  const formatDateRange = (startDate: Date, endDate: Date) => {
    const startMonth = startDate.getMonth() + 1;
    const startDay = startDate.getDate();
    const endMonth = endDate.getMonth() + 1;
    const endDay = endDate.getDate();

    if (startMonth === endMonth) {
      return `${startMonth}月${startDay}-${endDay}日`;
    } else {
      return `${startMonth}月${startDay}日-${endMonth}月${endDay}日`;
    }
  };

  // 辅助函数：格式化单个日期
  const formatSingleDate = (date: Date) => {
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${month}月${day}日`;
  };

  // 辅助函数：格式化日期用于Booking.com（YYYY-MM-DD格式）
  const formatDateForBooking = (date: Date) => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const budgetTable = generateBudgetTable();

  return (
    <div className="hotel-guide">
      <div className="hotel-guide-container" ref={guideRef}>
        {/* 页面标题 */}
        <div className="hotel-header">
          <div className="header-content">
            <Hotel size={48} className="header-icon" />
            <div>
              <h1>欧洲酒店预订完全攻略</h1>
              <p className="subtitle">Booking.com 预订指南 - 省钱技巧 - 签证材料准备</p>
            </div>
          </div>
          <button
            className="export-btn"
            onClick={handleExportImage}
            disabled={exporting}
          >
            {exporting ? '导出中...' : '📸 导出图片'}
          </button>
        </div>

        {/* 为什么选择 Booking */}
        <section className="why-booking">
          <h2>🎯 为什么全部用 Booking.com？</h2>
          <div className="reason-grid">
            <div className="reason-card">
              <Shield size={32} />
              <h3>签证超级友好</h3>
              <p>申根签证官方认可，英文确认单完整，使馆认可度最高</p>
            </div>
            <div className="reason-card">
              <Calendar size={32} />
              <h3>免费取消灵活</h3>
              <p>大部分酒店支持免费取消，可以先订签证材料，通过后再调整</p>
            </div>
            <div className="reason-card">
              <Hotel size={32} />
              <h3>欧洲资源最丰富</h3>
              <p>Booking起家于荷兰，欧洲酒店数量最多，选择最丰富</p>
            </div>
            <div className="reason-card">
              <DollarSign size={32} />
              <h3>价格透明可靠</h3>
              <p>显示价格就是最终价格，税费全包含，无隐藏费用</p>
            </div>
          </div>
        </section>

        {/* 各城市酒店推荐 */}
        <section className="hotel-recommendations">
          <h2>🏨 各城市具体酒店推荐</h2>
          {hotelRecommendations.map((city, index) => {
            const itinerary = getCityItinerary(city.city);
            return (
              <div key={index} className="city-section">
                <div className="city-header">
                  <span className="city-flag">{city.flag}</span>
                  <div className="city-info">
                    <h3>{city.city}</h3>
                    {itinerary && (
                      <div className="city-dates">
                        <Calendar size={16} />
                        <span className="date-range">
                          {itinerary.formattedCheckIn} - {itinerary.formattedCheckOut}
                        </span>
                        <span className="nights-badge">{itinerary.nights}晚</span>
                      </div>
                    )}
                    {!itinerary && (
                      <span className="city-nights-fallback">建议停留：{city.nights}</span>
                    )}
                  </div>
                </div>

                {/* 推荐区域 */}
                {city.recommendedAreas && (
                  <div className="recommended-areas">
                    <h4>🗺️ 推荐住宿区域</h4>
                    <div className="area-tags">
                      {city.recommendedAreas.map((area, aIndex) => (
                        <span key={aIndex} className="area-tag recommended">{area}</span>
                      ))}
                    </div>
                    {city.avoidAreas && (
                      <div className="avoid-areas">
                        <strong>⚠️ 避开：</strong>
                        {city.avoidAreas.map((area, aIndex) => (
                          <span key={aIndex} className="area-tag avoid">{area}</span>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* 具体酒店推荐 */}
                <div className="hotels-section">
                  <h4>🏨 具体酒店推荐</h4>
                  <div className="hotels-list">
                    {city.hotels.map((hotel, hIndex) => (
                      <div key={hIndex} className="hotel-card">
                        <div className="hotel-main">
                          <h4>{hotel.name}</h4>
                          <div className="hotel-info">
                            <span className="hotel-rating">
                              <Star size={16} fill="gold" stroke="gold" /> {hotel.rating}
                            </span>
                            <span className="hotel-price">{hotel.price}/晚</span>
                          </div>
                          <div className="hotel-location">
                            <MapPin size={14} /> {hotel.location}
                          </div>
                          <div className="hotel-features">
                            {hotel.features.map((feature, fIndex) => (
                              <span key={fIndex} className="feature-tag">{feature}</span>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="city-tips">
                  <Lightbulb size={18} />
                  <div className="tips-content">
                    <strong>💡 预订建议：</strong>
                    <ul>
                      {city.tips.map((tip, tIndex) => (
                        <li key={tIndex}>{tip}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            );
          })}
        </section>

        {/* 省钱技巧 */}
        <section className="money-saving">
          <h2>💰 省钱技巧大全</h2>
          <div className="tips-grid">
            {moneySavingTips.map((tip, index) => (
              <div key={index} className="tip-card">
                <div className="tip-icon">{tip.icon}</div>
                <h3>{tip.title}</h3>
                <p className="tip-description">{tip.description}</p>
                <ul className="tip-details">
                  {tip.details.map((detail, dIndex) => (
                    <li key={dIndex}>{detail}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* 预订流程 */}
        <section className="booking-process">
          <h2>📝 预订流程四步走</h2>
          <div className="process-timeline">
            {bookingProcess.map((step, index) => (
              <div key={index} className="process-step">
                <div className="step-number">{step.step}</div>
                <div className="step-content">
                  <div className="step-header">
                    <span className="step-icon">{step.icon}</span>
                    <h3>{step.title}</h3>
                  </div>
                  <ul className="step-items">
                    {step.items.map((item, iIndex) => (
                      <li key={iIndex}>
                        <CheckCircle size={16} /> {item}
                      </li>
                    ))}
                  </ul>
                </div>
                {index < bookingProcess.length - 1 && <div className="step-arrow">→</div>}
              </div>
            ))}
          </div>
        </section>

        {/* 签证材料准备 */}
        <section className="visa-section">
          <h2>🛂 针对申根签证的预订建议</h2>
          <div className="visa-tips-grid">
            {visaTips.map((tip, index) => (
              <div key={index} className="visa-tip-card">
                <div className="visa-tip-icon">{tip.icon}</div>
                <h3>{tip.title}</h3>
                <p>{tip.content}</p>
              </div>
            ))}
          </div>

          <div className="visa-warning">
            <AlertCircle size={24} />
            <div>
              <strong>重要提醒：</strong>
              <p>酒店日期必须覆盖整个行程，不能有"空白日期"。城市顺序要和签证申请表一致。在停留时间最长的国家申请签证。</p>
            </div>
          </div>
        </section>

        {/* 预算参考 */}
        <section className="budget-section">
          <h2>💵 预算参考表</h2>
          <div className="budget-table">
            <table>
              <thead>
                <tr>
                  <th>城市</th>
                  <th>天数</th>
                  <th>日期</th>
                  <th>Check-in</th>
                  <th>Check-out</th>
                  <th>住宿地点</th>
                  <th>经济型</th>
                  <th>中档型</th>
                  <th>备注</th>
                </tr>
              </thead>
              <tbody>
                {budgetTable.map((row, index) => (
                  <tr key={index}>
                    <td><strong>{row.city}</strong></td>
                    <td>{row.nights}</td>
                    <td>{row.dates}</td>
                    <td className="date-cell">{row.checkIn}</td>
                    <td className="date-cell">{row.checkOut}</td>
                    <td>{row.accommodation}</td>
                    <td>{row.budget}</td>
                    <td>{row.midRange}</td>
                    <td>{row.note}</td>
                  </tr>
                ))}
                <tr className="total-row">
                  <td><strong>总计</strong></td>
                  <td><strong>19晚</strong></td>
                  <td><strong>2月7-26日</strong></td>
                  <td><strong>-</strong></td>
                  <td><strong>-</strong></td>
                  <td><strong>-</strong></td>
                  <td><strong>€1525-2305</strong></td>
                  <td><strong>€2305-3485</strong></td>
                  <td>约¥12000-27000</td>
                </tr>
              </tbody>
            </table>
            <p className="budget-note">💡 建议：预算€1900-2800（¥15000-22000）可以住得很舒服，平均每晚约€100-150</p>
          </div>
        </section>

        {/* 常见问题 */}
        <section className="faq-section">
          <h2>❓ 常见问题 FAQ</h2>
          <div className="faq-list">
            {faqs.map((faq, index) => (
              <div key={index} className="faq-item">
                <h3>Q: {faq.q}</h3>
                <p>A: {faq.a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 行动清单 */}
        <section className="action-checklist">
          <h2>✅ 预订清单（Checklist）</h2>
          <div className="checklist-grid">
            <div className="checklist-card">
              <h3>预订前</h3>
              <ul>
                <li>□ 确认行程日期</li>
                <li>□ 确认每个城市停留天数</li>
                <li>□ 设定酒店预算</li>
                <li>□ 注册Booking账号</li>
                <li>□ 绑定信用卡</li>
              </ul>
            </div>
            <div className="checklist-card">
              <h3>预订时</h3>
              <ul>
                <li>□ 筛选"免费取消"</li>
                <li>□ 筛选评分8.0+</li>
                <li>□ 查看位置到地铁站距离</li>
                <li>□ 阅读最近10条评价</li>
                <li>□ 确认是否含早餐</li>
              </ul>
            </div>
            <div className="checklist-card">
              <h3>预订后</h3>
              <ul>
                <li>□ 下载预订确认单（PDF）</li>
                <li>□ 保存到专门文件夹</li>
                <li>□ 标记取消截止日期</li>
                <li>□ 下载Booking App</li>
                <li>□ 保存酒店地址和电话</li>
              </ul>
            </div>
            <div className="checklist-card">
              <h3>出发前</h3>
              <ul>
                <li>□ 再次确认所有预订</li>
                <li>□ 截图所有预订信息</li>
                <li>□ 下载离线地图</li>
                <li>□ 准备信用卡</li>
                <li>□ 查看check-in时间</li>
              </ul>
            </div>
          </div>
        </section>

        {/* 官方链接 */}
        <section className="useful-links">
          <h2>🔗 有用链接</h2>
          <div className="links-grid">
            <a href="https://www.booking.com" target="_blank" rel="noopener noreferrer" className="link-card">
              <Hotel size={24} />
              <div>
                <h3>Booking.com 官网</h3>
                <p>开始搜索和预订酒店</p>
              </div>
            </a>
            <a href="https://www.booking.com/apps.html" target="_blank" rel="noopener noreferrer" className="link-card">
              <span style={{ fontSize: '24px' }}>📱</span>
              <div>
                <h3>Booking App 下载</h3>
                <p>移动端专享优惠</p>
              </div>
            </a>
          </div>
        </section>

        {/* 免责声明 */}
        <section className="disclaimer">
          <h3>⚠️ 重要声明</h3>
          <p>本攻略内容基于经验分享，仅供参考。酒店价格、政策等信息可能随时变化，请以Booking官网实时信息为准。预订前请仔细阅读酒店的取消政策和相关条款。</p>
          <p className="update-time">最后更新：2025年10月</p>
        </section>
      </div>

      <ScrollButtons />
    </div>
  );
};

export default HotelGuide;

