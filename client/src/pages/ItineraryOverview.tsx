import React, { useState, useEffect, useRef } from 'react';
import { Calendar, MapPin, Star, Plane, Train, Car, Navigation, Download, FileText } from 'lucide-react';
import { getItineraryData } from '../models/travelData';
import { Itinerary } from '../types';
import html2canvas from 'html2canvas';
import ScrollButtons from '../components/ScrollButtons';
import './ItineraryOverview.css';

const ItineraryOverview: React.FC = () => {
  const [itinerary, setItinerary] = useState<Itinerary | null>(null);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const overviewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadItinerary();
  }, []);

  const loadItinerary = () => {
    try {
      const data = getItineraryData();
      setItinerary(data);
    } catch (error) {
      console.error('加载行程数据失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-CN', { month: 'long', day: 'numeric' });
  };

  const calculateDays = (arrivalDate: string, departureDate: string) => {
    const arrival = new Date(arrivalDate);
    const departure = new Date(departureDate);
    return Math.ceil((departure.getTime() - arrival.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  };

  // 导出图片功能
  const handleExportImage = async () => {
    if (!overviewRef.current) return;

    setExporting(true);
    try {
      // 滚动到顶部
      window.scrollTo(0, 0);
      await new Promise(resolve => setTimeout(resolve, 300));

      const canvas = await html2canvas(overviewRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#f8f9fa',
        scrollY: 0,
        scrollX: 0,
        windowHeight: overviewRef.current.scrollHeight + 100
      });

      const link = document.createElement('a');
      link.download = `欧洲行程总览_${new Date().toLocaleDateString()}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (error) {
      console.error('导出失败:', error);
      alert('导出失败，请重试');
    } finally {
      setExporting(false);
    }
  };

  // 生成Markdown文本
  const generateMarkdown = () => {
    if (!itinerary) return '';

    let md = `# ${itinerary.title}\n\n`;
    md += `📅 **时间**：${formatDate(itinerary.start_date)} - ${formatDate(itinerary.end_date)}\n`;
    md += `⏱️ **总计**：${calculateDays(itinerary.start_date, itinerary.end_date)} 天\n\n`;
    md += `---\n\n`;

    // 路线概览
    md += `## 🗺️ 路线概览\n\n`;
    const route = itinerary.cities?.map(c => c.name).join(' → ') || '';
    md += `${route}\n\n`;
    md += `---\n\n`;

    // 详细行程
    md += `## 📅 详细行程\n\n`;
    itinerary.cities?.forEach((city, index) => {
      const days = calculateDays(city.arrival_date, city.departure_date);
      md += `### Day ${index + 1} - ${city.name} ${city.country}\n\n`;
      md += `📍 **停留时间**：${formatDate(city.arrival_date)} - ${formatDate(city.departure_date)} (${days}天)\n\n`;

      // 景点
      if (city.attractions && city.attractions.length > 0) {
        md += `**🏛️ 推荐景点** (${city.attractions.length}个)：\n\n`;
        city.attractions.forEach((attr, i) => {
          md += `${i + 1}. **${attr.name}** ⭐${attr.rating}\n`;
          md += `   - ${attr.description}\n`;
          md += `   - 类型：${attr.category}\n\n`;
        });
      }

      // 交通
      const cityTransports = itinerary.transportation?.filter(t => t.from_city_id === city.id);
      if (cityTransports && cityTransports.length > 0) {
        cityTransports.forEach(trans => {
          const toCity = itinerary.cities?.find(c => c.id === trans.to_city_id);
          if (toCity) {
            md += `**🚄 前往** ${toCity.name}：${trans.transport_type} (${trans.duration})\n`;
            md += `   - 出发：${trans.departure_time}\n`;
            md += `   - 到达：${trans.arrival_time}\n\n`;
          }
        });
      }

      md += `---\n\n`;
    });

    // 统计信息
    md += `## 📊 行程统计\n\n`;
    md += `- 🏙️ 城市数量：${itinerary.cities?.length || 0} 个\n`;
    md += `- 🏛️ 景点数量：${itinerary.cities?.reduce((sum, city) => sum + (city.attractions?.length || 0), 0) || 0} 个\n`;
    md += `- 🚄 交通段数：${itinerary.transportation?.length || 0} 段\n`;
    md += `- ⏱️ 总天数：${calculateDays(itinerary.start_date, itinerary.end_date)} 天\n\n`;

    return md;
  };

  // 导出Markdown
  const handleExportMarkdown = () => {
    const markdown = generateMarkdown();

    // 复制到剪贴板
    navigator.clipboard.writeText(markdown).then(() => {
      alert('✅ Markdown 文本已复制到剪贴板！\n可以直接粘贴到微信或其他地方。');
    }).catch(() => {
      // 如果复制失败，下载为文件
      const blob = new Blob([markdown], { type: 'text/markdown' });
      const link = document.createElement('a');
      link.download = `欧洲行程_${new Date().toLocaleDateString()}.md`;
      link.href = URL.createObjectURL(blob);
      link.click();
      alert('✅ Markdown 文件已下载！');
    });
  };

  const getTransportIcon = (transportType: string) => {
    switch (transportType) {
      case '飞机':
        return <Plane className="transport-icon-small" />;
      case '火车':
        return <Train className="transport-icon-small" />;
      case '汽车':
      case '地铁':
        return <Car className="transport-icon-small" />;
      default:
        return <Navigation className="transport-icon-small" />;
    }
  };

  if (loading) {
    return <div className="overview-loading">加载中...</div>;
  }

  if (!itinerary) {
    return <div className="overview-error">无法加载行程数据</div>;
  }

  return (
    <div className="itinerary-overview" ref={overviewRef}>
      <div className="overview-header">
        <h1>{itinerary.title}</h1>
        <div className="overview-dates">
          <Calendar className="header-icon" />
          <span>{formatDate(itinerary.start_date)} - {formatDate(itinerary.end_date)}</span>
          <span className="total-days">
            （共 {calculateDays(itinerary.start_date, itinerary.end_date)} 天）
          </span>
        </div>
      </div>

      <div className="overview-content">
        {/* 行程路线概览 */}
        <section className="route-overview">
          <h2>📍 行程路线</h2>
          <div className="route-path">
            {itinerary.cities?.map((city, index) => (
              <React.Fragment key={city.id}>
                <div className="route-city">
                  <MapPin className="route-icon" />
                  <span>{city.name}</span>
                </div>
                {index < (itinerary.cities?.length || 0) - 1 && (
                  <div className="route-arrow">→</div>
                )}
              </React.Fragment>
            ))}
          </div>
        </section>

        {/* 详细行程 */}
        <section className="detailed-itinerary">
          <h2>📅 详细行程安排</h2>
          {itinerary.cities?.map((city, index) => {
            const days = calculateDays(city.arrival_date, city.departure_date);
            const cityTransports = itinerary.transportation?.filter(
              t => t.from_city_id === city.id
            );

            return (
              <div key={city.id} className="day-section">
                <div className="day-header">
                  <div className="day-number">Day {index + 1}</div>
                  <div className="day-info">
                    <h3>
                      {city.name} <span className="country-flag">{city.country}</span>
                    </h3>
                    <div className="day-meta">
                      <span className="day-date">
                        {formatDate(city.arrival_date)} - {formatDate(city.departure_date)}
                      </span>
                      <span className="day-duration">停留 {days} 天</span>
                    </div>
                  </div>
                </div>

                {/* 景点列表 */}
                {city.attractions && city.attractions.length > 0 && (
                  <div className="attractions-section">
                    <h4>🏛️ 推荐景点 ({city.attractions.length}个)</h4>
                    <div className="attractions-grid">
                      {city.attractions.map((attraction, idx) => (
                        <div key={attraction.id} className="attraction-card">
                          <div className="attraction-header">
                            <span className="attraction-number">{idx + 1}</span>
                            <span className="attraction-name">{attraction.name}</span>
                          </div>
                          <p className="attraction-desc">{attraction.description}</p>
                          <div className="attraction-meta">
                            <span className="attraction-category">{attraction.category}</span>
                            <div className="attraction-rating">
                              <Star className="star-icon" />
                              <span>{attraction.rating}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 交通信息 */}
                {cityTransports && cityTransports.length > 0 && (
                  <div className="transport-section">
                    <h4>🚄 前往下一站</h4>
                    {cityTransports.map((transport, idx) => {
                      const toCity = itinerary.cities?.find(c => c.id === transport.to_city_id);
                      return (
                        <div key={idx} className="transport-card">
                          <div className="transport-type">
                            {getTransportIcon(transport.transport_type)}
                            <span>{transport.transport_type}</span>
                          </div>
                          <div className="transport-route">
                            {city.name} → {toCity?.name}
                          </div>
                          <div className="transport-details">
                            <span>{transport.departure_time} - {transport.arrival_time}</span>
                            <span className="duration">行程 {transport.duration}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </section>

        {/* 统计信息 */}
        <section className="statistics">
          <h2>📊 行程统计</h2>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-number">{itinerary.cities?.length || 0}</div>
              <div className="stat-label">城市</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">
                {itinerary.cities?.reduce((sum, city) => sum + (city.attractions?.length || 0), 0) || 0}
              </div>
              <div className="stat-label">景点</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{itinerary.transportation?.length || 0}</div>
              <div className="stat-label">交通段</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">
                {calculateDays(itinerary.start_date, itinerary.end_date)}
              </div>
              <div className="stat-label">总天数</div>
            </div>
          </div>
        </section>
      </div>

      {/* 导出按钮组 */}
      <div className="export-buttons">
        <button
          className="export-button export-markdown"
          onClick={handleExportMarkdown}
        >
          <FileText size={20} />
          复制文本
        </button>
        <button
          className="export-button export-image"
          onClick={handleExportImage}
          disabled={exporting}
        >
          <Download size={20} />
          {exporting ? '导出中...' : '导出图片'}
        </button>
      </div>

      {/* 滚动按钮 */}
      <ScrollButtons />
    </div>
  );
};

export default ItineraryOverview;

