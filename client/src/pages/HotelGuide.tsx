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
      nights: '2-3晚',
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
      nights: '3-4晚',
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
      city: '罗马',
      flag: '🇮🇹',
      nights: '2-3晚',
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
      city: '威尼斯',
      flag: '🇮🇹',
      nights: '2晚',
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
      nights: '2晚',
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
      city: '尼斯',
      flag: '🇫🇷',
      nights: '2晚',
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

  const budgetTable = [
    { city: '阿姆斯特丹', nights: '2晚', budget: '€140-200', midRange: '€200-300', note: '酒店较贵' },
    { city: '巴黎', nights: '3晚', budget: '€240-360', midRange: '€360-540', note: '看区域' },
    { city: '罗马', nights: '2-3晚', budget: '€180-280', midRange: '€220-360', note: '火车站附近性价比高' },
    { city: '威尼斯', nights: '2晚', budget: '€160-240', midRange: '€240-400', note: '岛上酒店贵' },
    { city: '佛罗伦萨', nights: '2晚', budget: '€140-200', midRange: '€200-320', note: '老城区贵' },
    { city: '尼斯', nights: '2晚', budget: '€120-180', midRange: '€180-280', note: '海边酒店贵' }
  ];

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
                    <td>{row.budget}</td>
                    <td>{row.midRange}</td>
                    <td>{row.note}</td>
                  </tr>
                ))}
                <tr className="total-row">
                  <td><strong>总计</strong></td>
                  <td><strong>12-14晚</strong></td>
                  <td><strong>€1080-1580</strong></td>
                  <td><strong>€1460-2200</strong></td>
                  <td>约¥8500-17000</td>
                </tr>
              </tbody>
            </table>
            <p className="budget-note">💡 建议：预算€1300-1800（¥10000-14000）可以住得很舒服，平均每晚约€100-130</p>
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

