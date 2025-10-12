import React, { useRef } from 'react';
import html2canvas from 'html2canvas';
import { citiesData, transportationData, attractionsData } from '../models/travelData';
import './VisaItinerary.css';

const VisaItinerary: React.FC = () => {
  const itineraryRef = useRef<HTMLDivElement>(null);
  // 按日期整理行程
  const getDailyItinerary = () => {
    const startDate = new Date('2026-02-07');
    const endDate = new Date('2026-02-26');
    const dailyPlan = [];

    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      const dateStr = d.toISOString().split('T')[0];
      const citiesOnThisDay = citiesData.filter(city => {
        const arrival = new Date(city.arrival_date);
        const departure = new Date(city.departure_date);
        return d >= arrival && d <= departure;
      });

      if (citiesOnThisDay.length > 0) {
        dailyPlan.push({
          date: dateStr,
          dayOfWeek: d.toLocaleDateString('zh-CN', { weekday: 'long' }),
          cities: citiesOnThisDay,
          dayNumber: Math.floor((d.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1
        });
      }
    }

    return dailyPlan;
  };

  const dailyItinerary = getDailyItinerary();

  // 统计各国停留天数
  const getCountryStats = () => {
    const countryDays: { [key: string]: number } = {};

    dailyItinerary.forEach(day => {
      day.cities.forEach(city => {
        // 排除中转城市
        if (city.id >= 1 && city.id !== 14) {
          const country = city.country;
          if (!countryDays[country]) {
            countryDays[country] = 0;
          }
          countryDays[country]++;
        }
      });
    });

    return Object.entries(countryDays)
      .map(([country, days]) => ({ country, days }))
      .sort((a, b) => b.days - a.days);
  };

  const countryStats = getCountryStats();

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const saveAsImage = async () => {
    if (!itineraryRef.current) return;

    try {
      // 显示加载提示
      const button = document.querySelector('.save-btn') as HTMLButtonElement;
      const originalText = button.textContent;
      button.textContent = '生成中...';
      button.disabled = true;

      // 使用html2canvas生成图片
      const canvas = await html2canvas(itineraryRef.current, {
        scale: 2, // 提高清晰度
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: false,
        windowWidth: itineraryRef.current.scrollWidth,
        windowHeight: itineraryRef.current.scrollHeight
      });

      // 转换为blob并下载
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.download = '申根签证行程单_Schengen_Visa_Itinerary.png';
          link.href = url;
          link.click();
          URL.revokeObjectURL(url);
        }

        // 恢复按钮状态
        button.textContent = originalText;
        button.disabled = false;
      }, 'image/png');
    } catch (error) {
      console.error('生成图片失败:', error);
      alert('生成图片失败，请重试');

      // 恢复按钮状态
      const button = document.querySelector('.save-btn') as HTMLButtonElement;
      button.textContent = '保存为图片';
      button.disabled = false;
    }
  };

  return (
    <div className="visa-itinerary">
      <div className="visa-header">
        <h1>申根签证行程单</h1>
        <h2>Schengen Visa Itinerary</h2>
        <button className="save-btn" onClick={saveAsImage}>
          💾 保存为图片
        </button>
      </div>

      <div ref={itineraryRef} className="visa-content">

        <div className="visa-summary">
          <div className="summary-item">
            <strong>申请人姓名 / Applicant Name:</strong>
            <span className="editable">_______________</span>
          </div>
          <div className="summary-item">
            <strong>护照号码 / Passport No.:</strong>
            <span className="editable">_______________</span>
          </div>
          <div className="summary-item">
            <strong>旅行日期 / Travel Dates:</strong>
            <span>2026年2月7日 - 2026年2月26日 (共20天 / 20 days)</span>
          </div>
          <div className="summary-item">
            <strong>主要目的地国家 / Main Destination:</strong>
            <span className="highlight">意大利 / Italy (停留{countryStats[0]?.days}天)</span>
          </div>
        </div>

        <div className="country-breakdown">
          <h3>各国停留时间统计 / Country Breakdown</h3>
          <table className="country-table">
            <thead>
              <tr>
                <th>国家 / Country</th>
                <th>停留天数 / Days</th>
                <th>占比 / Percentage</th>
              </tr>
            </thead>
            <tbody>
              {countryStats.map((stat, index) => (
                <tr key={index} className={index === 0 ? 'main-destination' : ''}>
                  <td>{stat.country}</td>
                  <td>{stat.days}天</td>
                  <td>{((stat.days / 15) * 100).toFixed(1)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="note">
            * 根据申根签证规定，应向停留时间最长的国家（意大利）申请签证
          </p>
        </div>

        <div className="detailed-itinerary">
          <h3>详细行程安排 / Detailed Itinerary</h3>

          {dailyItinerary.map((day, index) => {
            const transportation = transportationData.find(
              t => t.departure_time.includes(day.date.substring(5))
            );

            return (
              <div key={index} className="day-card">
                <div className="day-header">
                  <div className="day-number">第{day.dayNumber}天</div>
                  <div className="day-date">
                    <div>{formatDate(day.date)}</div>
                    <div className="day-of-week">{day.dayOfWeek}</div>
                  </div>
                </div>

                <div className="day-content">
                  {day.cities.map((city, cityIndex) => {
                    const attractions = attractionsData.filter(attr => attr.city_id === city.id);
                    const isMainCity = city.id >= 1 && city.id !== 14;

                    if (!isMainCity) return null;

                    return (
                      <div key={cityIndex} className="city-section">
                        <div className="city-header">
                          <h4>{city.name} / {city.name === '阿姆斯特丹' ? 'Amsterdam' :
                            city.name === '巴黎' ? 'Paris' :
                              city.name === '里昂' ? 'Lyon' :
                                city.name === '马赛' ? 'Marseille' :
                                  city.name === '尼斯' ? 'Nice' :
                                    city.name === '摩纳哥' ? 'Monaco' :
                                      city.name === '米兰' ? 'Milan' :
                                        city.name === '维罗纳' ? 'Verona' :
                                          city.name === '威尼斯' ? 'Venice' :
                                            city.name === '佛罗伦萨' ? 'Florence' :
                                              city.name === '比萨' ? 'Pisa' :
                                                city.name === '罗马' ? 'Rome' :
                                                  city.name === '梵蒂冈' ? 'Vatican City' :
                                                    city.name === '那不勒斯' ? 'Naples' : city.name}</h4>
                          <span className="country-tag">{city.country}</span>
                        </div>

                        {attractions.length > 0 && (
                          <div className="attractions">
                            <strong>游览景点 / Attractions:</strong>
                            <ul>
                              {attractions.slice(0, 5).map((attr, attrIndex) => (
                                <li key={attrIndex}>
                                  {attr.name} - {attr.description}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        <div className="accommodation">
                          <strong>住宿 / Accommodation:</strong>
                          <span className="editable">_________________ (待填写酒店名称)</span>
                        </div>
                      </div>
                    );
                  })}

                  {transportation && (
                    <div className="transportation">
                      <strong>交通 / Transportation:</strong>
                      <span>{transportation.transport_type} - {transportation.duration}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="visa-footer">
          <div className="declaration">
            <h3>申请人声明 / Declaration</h3>
            <p>
              本人声明以上行程安排真实有效，将严格按照行程计划在申根区旅行，并在签证到期前离开申根区。
            </p>
            <p>
              I declare that the above itinerary is genuine and I will strictly follow this travel plan
              within the Schengen Area and leave before the visa expires.
            </p>
            <div className="signature-area">
              <div className="signature-line">
                <span>申请人签名 / Signature: _______________</span>
              </div>
              <div className="signature-line">
                <span>日期 / Date: _______________</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VisaItinerary;

