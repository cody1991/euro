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

  const generateForm = async () => {
    try {
      // 显示加载提示
      const button = document.querySelector('.form-btn') as HTMLButtonElement;
      const originalText = button.textContent;
      button.textContent = '生成中...';
      button.disabled = true;

      // 创建一个新的表单页面内容
      const formContent = createFormContent();

      // 创建临时容器
      const tempContainer = document.createElement('div');
      tempContainer.innerHTML = formContent;
      tempContainer.style.position = 'absolute';
      tempContainer.style.left = '-9999px';
      tempContainer.style.top = '0';
      tempContainer.style.width = '210mm'; // A4宽度
      tempContainer.style.background = 'white';
      tempContainer.style.padding = '20px';
      tempContainer.style.fontFamily = 'Arial, sans-serif';
      tempContainer.style.fontSize = '12px';
      tempContainer.style.lineHeight = '1.4';
      document.body.appendChild(tempContainer);

      // 生成图片
      const canvas = await html2canvas(tempContainer, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: false,
        width: 794, // A4宽度像素
        height: 1123 // A4高度像素
      });

      // 清理临时容器
      document.body.removeChild(tempContainer);

      // 转换为blob并下载
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.download = '申根签证申请表_Schengen_Visa_Application_Form.png';
          link.href = url;
          link.click();
          URL.revokeObjectURL(url);
        }

        // 恢复按钮状态
        button.textContent = originalText;
        button.disabled = false;
      }, 'image/png');
    } catch (error) {
      console.error('生成表单失败:', error);
      alert('生成表单失败，请重试');

      // 恢复按钮状态
      const button = document.querySelector('.form-btn') as HTMLButtonElement;
      button.textContent = '生成申请表';
      button.disabled = false;
    }
  };

  const createFormContent = () => {
    if (!citiesData || citiesData.length === 0) return '';

    const formatDate = (dateString: string) => {
      const date = new Date(dateString);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const dayName = dayNames[date.getDay()];
      return `${year}/${month}/${day} (${dayName})`;
    };

    const getCityDisplay = (city: any, index: number) => {
      if (index === 0) return `${city.name_en || city.name}→${citiesData[1]?.name_en || citiesData[1]?.name}`;
      if (index === citiesData.length - 1) return `${city.name_en || city.name}→${citiesData[0]?.name_en || citiesData[0]?.name}`;

      const nextCity = citiesData[index + 1];
      if (nextCity) {
        return `${city.name_en || city.name}→${nextCity.name_en || nextCity.name}`;
      }
      return city.name_en || city.name;
    };

    const getTouringSpots = (city: any) => {
      const cityAttractions = attractionsData.filter(attr => attr.city_id === city.id);
      if (!cityAttractions || cityAttractions.length === 0) {
        return '_______________';
      }
      return cityAttractions.map((attr: any, idx: number) => 
        `${idx + 1}. ${attr.name_en || attr.name}`
      ).join('<br/>');
    };

    const getAccommodation = (city: any) => {
      if (!city.accommodation || !city.accommodation.hotel_name) {
        return '_______________';
      }
      const hotel = city.accommodation.hotel_name_en || city.accommodation.hotel_name;
      const address = city.accommodation.address || '';
      const phone = city.accommodation.phone || '';
      return `${hotel}<br/>${address}<br/>TEL: ${phone}`;
    };

    const getTransportation = (city: any, index: number) => {
      const transport = transportationData.find(t => t.from_city_id === city.id);
      if (!transport) return 'Public transport';

      const type = transport.transport_type === '飞机' ? 'Flight' :
        transport.transport_type === '火车' ? 'Train' :
          transport.transport_type === '汽车' ? 'Bus' : 'Transport';

      const from = transport.departure_location_en || transport.departure_location;
      const to = transport.arrival_location_en || transport.arrival_location;
      const departure = transport.departure_time?.split(' ')[1] || '';
      const arrival = transport.arrival_time?.split(' ')[1] || '';

      if (transport.flight_number) {
        return `${type} ${transport.flight_number}<br/>${from}→${to}<br/>${departure}→${arrival}`;
      }

      return `${type} ${from}→${to}<br/>${departure}→${arrival}`;
    };

    const rows = citiesData.map((city, index) => `
      <tr>
        <td style="border: 1px solid #000; padding: 8px; text-align: center;">${index + 1}</td>
        <td style="border: 1px solid #000; padding: 8px; text-align: center;">${formatDate(city.arrival_date)}</td>
        <td style="border: 1px solid #000; padding: 8px;">${getCityDisplay(city, index)}</td>
        <td style="border: 1px solid #000; padding: 8px;">${getTouringSpots(city)}</td>
        <td style="border: 1px solid #000; padding: 8px;">${getAccommodation(city)}</td>
        <td style="border: 1px solid #000; padding: 8px;">${getTransportation(city, index)}</td>
      </tr>
    `).join('');

    return `
      <div style="width: 100%; font-family: 'Arial', sans-serif; font-size: 14px; color: #333;">
        <!-- 标题 -->
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="font-size: 24px; margin: 0; font-weight: bold;">Trip Itinerary</h1>
        </div>

        <!-- 行程表格 -->
        <table style="width: 100%; border-collapse: collapse; border: 2px solid #000;">
          <thead>
            <tr style="background: #f0f0f0;">
              <th style="border: 1px solid #000; padding: 8px; text-align: center; font-weight: bold;">Day</th>
              <th style="border: 1px solid #000; padding: 8px; text-align: center; font-weight: bold;">Date</th>
              <th style="border: 1px solid #000; padding: 8px; text-align: center; font-weight: bold;">City</th>
              <th style="border: 1px solid #000; padding: 8px; text-align: center; font-weight: bold;">Touring Spots</th>
              <th style="border: 1px solid #000; padding: 8px; text-align: center; font-weight: bold;">Accommodation</th>
              <th style="border: 1px solid #000; padding: 8px; text-align: center; font-weight: bold;">Transportation</th>
            </tr>
          </thead>
          <tbody>
            ${rows}
          </tbody>
        </table>
      </div>
    `;
  };

  return (
    <div className="visa-itinerary">
      <div className="visa-header">
        <h1>申根签证行程单</h1>
        <h2>Schengen Visa Itinerary</h2>
        <div className="header-buttons">
          <button className="save-btn" onClick={saveAsImage}>
            💾 保存为图片
          </button>
          <button className="form-btn" onClick={generateForm}>
            📋 生成申请表
          </button>
        </div>
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
                          <h4>{city.name}{city.name_en ? ` / ${city.name_en}` : ''}</h4>
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

                        {city.accommodation && (
                          <div className="accommodation">
                            <strong>住宿 / Accommodation:</strong>
                            <div className="accommodation-details">
                              <div className="visa-detail-row">
                                <span className="visa-label">酒店名称 / Hotel:</span>
                                <span className="visa-value">
                                  {city.accommodation.hotel_name || '_________________'}
                                  {city.accommodation.hotel_name && city.accommodation.hotel_name_en && ` / ${city.accommodation.hotel_name_en}`}
                                </span>
                              </div>
                              <div className="visa-detail-row">
                                <span className="visa-label">地址 / Address:</span>
                                <span className="visa-value">{city.accommodation.address || '_________________'}</span>
                              </div>
                              <div className="visa-detail-row">
                                <span className="visa-label">电话 / Phone:</span>
                                <span className="visa-value">{city.accommodation.phone || '_________________'}</span>
                              </div>
                              <div className="visa-detail-row">
                                <span className="visa-label">入住 / Check-in:</span>
                                <span className="visa-value">{city.accommodation.check_in || '_______'}</span>
                                <span className="visa-label" style={{ marginLeft: '20px' }}>退房 / Check-out:</span>
                                <span className="visa-value">{city.accommodation.check_out || '_______'}</span>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}

                  {transportation && (
                    <div className="transportation">
                      <strong>交通 / Transportation:</strong>
                      <div className="transportation-details">
                        <div className="visa-detail-row">
                          <span className="visa-label">交通方式 / Type:</span>
                          <span className="visa-value">{transportation.transport_type}</span>
                        </div>
                        {transportation.flight_number !== undefined && (
                          <div className="visa-detail-row">
                            <span className="visa-label">航班号 / Flight:</span>
                            <span className="visa-value">{transportation.flight_number || '_________________'}</span>
                          </div>
                        )}
                        {transportation.train_number !== undefined && (
                          <div className="visa-detail-row">
                            <span className="visa-label">车次 / Train:</span>
                            <span className="visa-value">{transportation.train_number || '_________________'}</span>
                          </div>
                        )}
                        <div className="visa-detail-row">
                          <span className="visa-label">出发地 / From:</span>
                          <span className="visa-value">
                            {transportation.departure_location || '_________________'}
                            {transportation.departure_location && transportation.departure_location_en && ` / ${transportation.departure_location_en}`}
                          </span>
                        </div>
                        <div className="visa-detail-row">
                          <span className="visa-label">到达地 / To:</span>
                          <span className="visa-value">
                            {transportation.arrival_location || '_________________'}
                            {transportation.arrival_location && transportation.arrival_location_en && ` / ${transportation.arrival_location_en}`}
                          </span>
                        </div>
                        <div className="visa-detail-row">
                          <span className="visa-label">出发时间 / Departure:</span>
                          <span className="visa-value">{transportation.departure_time}</span>
                          <span className="visa-label" style={{ marginLeft: '20px' }}>到达时间 / Arrival:</span>
                          <span className="visa-value">{transportation.arrival_time}</span>
                        </div>
                        <div className="visa-detail-row">
                          <span className="visa-label">时长 / Duration:</span>
                          <span className="visa-value">{transportation.duration}</span>
                        </div>
                      </div>
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

