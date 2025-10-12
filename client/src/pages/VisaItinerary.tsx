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
            <tr>
              <td style="border: 1px solid #000; padding: 8px; text-align: center;">1</td>
              <td style="border: 1px solid #000; padding: 8px; text-align: center;">2026/02/07 (Fri)</td>
              <td style="border: 1px solid #000; padding: 8px;">武汉→广州</td>
              <td style="border: 1px solid #000; padding: 8px;">1.出发前往机场<br/>2.办理登机手续</td>
              <td style="border: 1px solid #000; padding: 8px;">_______________</td>
              <td style="border: 1px solid #000; padding: 8px;">Flight 武汉→广州<br/>09:30->11:30</td>
            </tr>
            <tr>
              <td style="border: 1px solid #000; padding: 8px; text-align: center;">2</td>
              <td style="border: 1px solid #000; padding: 8px; text-align: center;">2026/02/08 (Sat)</td>
              <td style="border: 1px solid #000; padding: 8px;">广州→阿姆斯特丹</td>
              <td style="border: 1px solid #000; padding: 8px;">1.梵高博物馆<br/>2.运河区游览<br/>3.安妮之家</td>
              <td style="border: 1px solid #000; padding: 8px;">_______________</td>
              <td style="border: 1px solid #000; padding: 8px;">Flight 广州→阿姆斯特丹<br/>13:00->18:00</td>
            </tr>
            <tr>
              <td style="border: 1px solid #000; padding: 8px; text-align: center;">3</td>
              <td style="border: 1px solid #000; padding: 8px; text-align: center;">2026/02/09 (Sun)</td>
              <td style="border: 1px solid #000; padding: 8px;">阿姆斯特丹→巴黎</td>
              <td style="border: 1px solid #000; padding: 8px;">1.埃菲尔铁塔<br/>2.卢浮宫<br/>3.香榭丽舍大街</td>
              <td style="border: 1px solid #000; padding: 8px;">_______________</td>
              <td style="border: 1px solid #000; padding: 8px;">Train 阿姆斯特丹→巴黎<br/>09:00->12:00</td>
            </tr>
            <tr>
              <td style="border: 1px solid #000; padding: 8px; text-align: center;">4</td>
              <td style="border: 1px solid #000; padding: 8px; text-align: center;">2026/02/10 (Mon)</td>
              <td style="border: 1px solid #000; padding: 8px;">巴黎</td>
              <td style="border: 1px solid #000; padding: 8px;">1.巴黎圣母院<br/>2.凯旋门<br/>3.塞纳河游船</td>
              <td style="border: 1px solid #000; padding: 8px;">_______________</td>
              <td style="border: 1px solid #000; padding: 8px;">Public transport</td>
            </tr>
            <tr>
              <td style="border: 1px solid #000; padding: 8px; text-align: center;">5</td>
              <td style="border: 1px solid #000; padding: 8px; text-align: center;">2026/02/11 (Tue)</td>
              <td style="border: 1px solid #000; padding: 8px;">巴黎→里昂</td>
              <td style="border: 1px solid #000; padding: 8px;">1.凡尔赛宫<br/>2.富维耶圣母院<br/>3.里昂老城</td>
              <td style="border: 1px solid #000; padding: 8px;">_______________</td>
              <td style="border: 1px solid #000; padding: 8px;">Train 巴黎→里昂<br/>14:00->16:30</td>
            </tr>
            <tr>
              <td style="border: 1px solid #000; padding: 8px; text-align: center;">6</td>
              <td style="border: 1px solid #000; padding: 8px; text-align: center;">2026/02/12 (Wed)</td>
              <td style="border: 1px solid #000; padding: 8px;">里昂→马赛</td>
              <td style="border: 1px solid #000; padding: 8px;">1.老港<br/>2.守护圣母教堂<br/>3.马赛鱼市</td>
              <td style="border: 1px solid #000; padding: 8px;">_______________</td>
              <td style="border: 1px solid #000; padding: 8px;">Train 里昂→马赛<br/>10:00->12:00</td>
            </tr>
            <tr>
              <td style="border: 1px solid #000; padding: 8px; text-align: center;">7</td>
              <td style="border: 1px solid #000; padding: 8px; text-align: center;">2026/02/13 (Thu)</td>
              <td style="border: 1px solid #000; padding: 8px;">马赛→尼斯</td>
              <td style="border: 1px solid #000; padding: 8px;">1.天使湾<br/>2.尼斯老城<br/>3.英国人漫步大道</td>
              <td style="border: 1px solid #000; padding: 8px;">_______________</td>
              <td style="border: 1px solid #000; padding: 8px;">Train 马赛→尼斯<br/>11:00->13:30</td>
            </tr>
            <tr>
              <td style="border: 1px solid #000; padding: 8px; text-align: center;">8</td>
              <td style="border: 1px solid #000; padding: 8px; text-align: center;">2026/02/14 (Fri)</td>
              <td style="border: 1px solid #000; padding: 8px;">尼斯→摩纳哥</td>
              <td style="border: 1px solid #000; padding: 8px;">1.蒙特卡洛赌场<br/>2.摩纳哥王宫<br/>3.海洋博物馆</td>
              <td style="border: 1px solid #000; padding: 8px;">_______________</td>
              <td style="border: 1px solid #000; padding: 8px;">Bus 尼斯→摩纳哥<br/>09:00->09:30</td>
            </tr>
            <tr>
              <td style="border: 1px solid #000; padding: 8px; text-align: center;">9</td>
              <td style="border: 1px solid #000; padding: 8px; text-align: center;">2026/02/15 (Sat)</td>
              <td style="border: 1px solid #000; padding: 8px;">摩纳哥→米兰</td>
              <td style="border: 1px solid #000; padding: 8px;">1.米兰大教堂<br/>2.斯卡拉歌剧院<br/>3.斯福尔扎城堡</td>
              <td style="border: 1px solid #000; padding: 8px;">_______________</td>
              <td style="border: 1px solid #000; padding: 8px;">Flight 尼斯→米兰<br/>15:00->16:00</td>
            </tr>
            <tr>
              <td style="border: 1px solid #000; padding: 8px; text-align: center;">10</td>
              <td style="border: 1px solid #000; padding: 8px; text-align: center;">2026/02/16 (Sun)</td>
              <td style="border: 1px solid #000; padding: 8px;">米兰→维罗纳→威尼斯</td>
              <td style="border: 1px solid #000; padding: 8px;">1.最后的晚餐<br/>2.维罗纳圆形竞技场<br/>3.圣马可广场</td>
              <td style="border: 1px solid #000; padding: 8px;">_______________</td>
              <td style="border: 1px solid #000; padding: 8px;">Train 米兰→威尼斯<br/>10:00->13:00</td>
            </tr>
            <tr>
              <td style="border: 1px solid #000; padding: 8px; text-align: center;">11</td>
              <td style="border: 1px solid #000; padding: 8px; text-align: center;">2026/02/17 (Mon)</td>
              <td style="border: 1px solid #000; padding: 8px;">威尼斯→佛罗伦萨</td>
              <td style="border: 1px solid #000; padding: 8px;">1.里亚托桥<br/>2.叹息桥<br/>3.圣母百花大教堂</td>
              <td style="border: 1px solid #000; padding: 8px;">_______________</td>
              <td style="border: 1px solid #000; padding: 8px;">Train 威尼斯→佛罗伦萨<br/>11:00->14:00</td>
            </tr>
            <tr>
              <td style="border: 1px solid #000; padding: 8px; text-align: center;">12</td>
              <td style="border: 1px solid #000; padding: 8px; text-align: center;">2026/02/18 (Tue)</td>
              <td style="border: 1px solid #000; padding: 8px;">佛罗伦萨→比萨→罗马</td>
              <td style="border: 1px solid #000; padding: 8px;">1.乌菲兹美术馆<br/>2.比萨斜塔<br/>3.梵蒂冈城</td>
              <td style="border: 1px solid #000; padding: 8px;">_______________</td>
              <td style="border: 1px solid #000; padding: 8px;">Train 佛罗伦萨→罗马<br/>15:00->17:30</td>
            </tr>
            <tr>
              <td style="border: 1px solid #000; padding: 8px; text-align: center;">13</td>
              <td style="border: 1px solid #000; padding: 8px; text-align: center;">2026/02/19 (Wed)</td>
              <td style="border: 1px solid #000; padding: 8px;">罗马</td>
              <td style="border: 1px solid #000; padding: 8px;">1.斗兽场<br/>2.古罗马广场<br/>3.特雷维喷泉</td>
              <td style="border: 1px solid #000; padding: 8px;">_______________</td>
              <td style="border: 1px solid #000; padding: 8px;">Public transport</td>
            </tr>
            <tr>
              <td style="border: 1px solid #000; padding: 8px; text-align: center;">14</td>
              <td style="border: 1px solid #000; padding: 8px; text-align: center;">2026/02/20 (Thu)</td>
              <td style="border: 1px solid #000; padding: 8px;">罗马→那不勒斯</td>
              <td style="border: 1px solid #000; padding: 8px;">1.万神殿<br/>2.庞贝古城<br/>3.那不勒斯历史中心</td>
              <td style="border: 1px solid #000; padding: 8px;">_______________</td>
              <td style="border: 1px solid #000; padding: 8px;">Train 罗马→那不勒斯<br/>09:00->11:00</td>
            </tr>
            <tr>
              <td style="border: 1px solid #000; padding: 8px; text-align: center;">15</td>
              <td style="border: 1px solid #000; padding: 8px; text-align: center;">2026/02/21 (Fri)</td>
              <td style="border: 1px solid #000; padding: 8px;">那不勒斯→阿姆斯特丹</td>
              <td style="border: 1px solid #000; padding: 8px;">1.庞贝古城深度游<br/>2.维苏威火山</td>
              <td style="border: 1px solid #000; padding: 8px;">_______________</td>
              <td style="border: 1px solid #000; padding: 8px;">Flight 那不勒斯→阿姆斯特丹<br/>18:00->21:00</td>
            </tr>
            <tr>
              <td style="border: 1px solid #000; padding: 8px; text-align: center;">16</td>
              <td style="border: 1px solid #000; padding: 8px; text-align: center;">2026/02/22 (Sat)</td>
              <td style="border: 1px solid #000; padding: 8px;">阿姆斯特丹→广州→武汉</td>
              <td style="border: 1px solid #000; padding: 8px;">1.返程航班<br/>2.转机广州</td>
              <td style="border: 1px solid #000; padding: 8px;">_______________</td>
              <td style="border: 1px solid #000; padding: 8px;">Flight 阿姆斯特丹→广州<br/>12:00->05:00+1</td>
            </tr>
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

