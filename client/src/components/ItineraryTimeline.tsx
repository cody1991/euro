import React from 'react';
import { citiesData, transportationData, cityArrivalTimes } from '../models/travelData';
import ScrollButtons from './ScrollButtons';
import './ItineraryTimeline.css';

const ItineraryTimeline: React.FC = () => {
  // 按日期和到达时间排序城市
  const sortedCities = [...citiesData].sort((a, b) => {
    const dateA = new Date(a.arrival_date).getTime();
    const dateB = new Date(b.arrival_date).getTime();

    // 如果日期不同，按日期排序
    if (dateA !== dateB) {
      return dateA - dateB;
    }

    // 如果日期相同，按到达时间排序
    const transportA = transportationData.find(t => t.to_city_id === a.id);
    const transportB = transportationData.find(t => t.to_city_id === b.id);

    if (transportA && transportB) {
      const timeA = new Date(transportA.arrival_time).getTime();
      const timeB = new Date(transportB.arrival_time).getTime();
      return timeA - timeB;
    }

    // 如果没有交通信息，使用城市到达时间配置
    const timeA = cityArrivalTimes[a.name] || 12;
    const timeB = cityArrivalTimes[b.name] || 12;
    return timeA - timeB;
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${month}/${day}`;
  };

  const getTransportationIcon = (transportType: string) => {
    switch (transportType) {
      case 'Flight': return '✈️';
      case 'Train': return '🚄';
      case 'Car': return '🚗';
      case 'Bus': return '🚌';
      default: return '🚌';
    }
  };

  const getCountryFlag = (country: string) => {
    switch (country) {
      case '中国': return '🇨🇳';
      case '荷兰': return '🇳🇱';
      case '法国': return '🇫🇷';
      case '摩纳哥': return '🇲🇨';
      case '意大利': return '🇮🇹';
      case '梵蒂冈': return '🇻🇦';
      default: return '🏳️';
    }
  };

  return (
    <div className="timeline-container">
      <div className="timeline-header">
        <h2>🗺️ 行程路线</h2>
        <p>欧洲之旅 · 20天精彩行程</p>
      </div>

      <div className="timeline">
        {sortedCities.map((city, index) => {
          const isLast = index === sortedCities.length - 1;
          const transport = transportationData.find(t => t.to_city_id === city.id);
          const nextTransport = !isLast ? transportationData.find(t =>
            t.from_city_id === city.id && t.to_city_id === sortedCities[index + 1]?.id
          ) : null;

          return (
            <div key={city.id} className="timeline-item">
              <div className="timeline-marker">
                <div className="marker-icon">
                  <span className="city-icon">📍</span>
                </div>
                <div className="marker-line" />
              </div>

              <div className="timeline-content">
                <div className="city-card">
                  <div className="city-header">
                    <h3 className="city-name">
                      {city.name}
                      {city.name_en && <span className="city-name-en">{city.name_en}</span>}
                    </h3>
                    <div className="city-dates">
                      <span className="arrival-date">{formatDate(city.arrival_date)}</span>
                      {city.departure_date !== city.arrival_date && (
                        <span className="departure-date">- {formatDate(city.departure_date)}</span>
                      )}
                    </div>
                  </div>

                  <div className="city-country">
                    <span className="country-flag">{getCountryFlag(city.country)}</span>
                    <span className="country-name">{city.country}</span>
                  </div>

                  {/* 到达交通信息 */}
                  {transport && (
                    <div className="transport-info arrival">
                      <span className="transport-icon">{getTransportationIcon(transport.transport_type)}</span>
                      <span className="transport-detail">
                        {transport.departure_location_en || transport.departure_location} → {city.name_en || city.name}
                      </span>
                      <span className="transport-time">{transport.arrival_time}</span>
                    </div>
                  )}

                  {/* 离开交通信息 */}
                  {nextTransport && (
                    <div className="transport-info departure">
                      <span className="transport-icon">{getTransportationIcon(nextTransport.transport_type)}</span>
                      <span className="transport-detail">
                        {city.name_en || city.name} → {nextTransport.arrival_location_en || nextTransport.arrival_location}
                      </span>
                      <span className="transport-time">{nextTransport.departure_time}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 滚动按钮 */}
      <ScrollButtons />
    </div>
  );
};

export default ItineraryTimeline;
