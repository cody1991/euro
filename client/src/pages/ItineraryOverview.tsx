import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Star, Plane, Train, Car, Navigation } from 'lucide-react';
import { itineraryAPI } from '../services/api';
import { Itinerary } from '../types';
import './ItineraryOverview.css';

const ItineraryOverview: React.FC = () => {
  const [itinerary, setItinerary] = useState<Itinerary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchItinerary();
  }, []);

  const fetchItinerary = async () => {
    try {
      const response = await itineraryAPI.getById(1);
      setItinerary(response.data);
    } catch (error) {
      console.error('获取行程失败:', error);
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
    <div className="itinerary-overview">
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

      {/* 导出按钮 */}
      <button 
        className="export-button"
        onClick={() => window.print()}
      >
        📄 导出/打印行程
      </button>
    </div>
  );
};

export default ItineraryOverview;

