import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Calendar, MapPin, Clock, Star, Plane, Train, Car, Ship, Users, DollarSign, Route } from 'lucide-react';
import { itineraryAPI } from '../services/api';
import { Itinerary, City, Attraction, Transportation } from '../types';
import './SummaryPage.css';

const SummaryPage: React.FC = () => {
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
    return new Date(dateString).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString: string) => {
    return timeString || '全天';
  };

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

  const calculateTotalDays = () => {
    if (!itinerary) return 0;
    const start = new Date(itinerary.start_date);
    const end = new Date(itinerary.end_date);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  };

  const calculateTotalCities = () => {
    return itinerary?.cities?.length || 0;
  };

  const calculateTotalAttractions = () => {
    if (!itinerary?.cities) return 0;
    return itinerary.cities.reduce((total, city) => {
      return total + (city.attractions?.length || 0);
    }, 0);
  };

  const calculateTotalCost = () => {
    if (!itinerary?.transportation) return 0;
    return itinerary.transportation.reduce((total, transport) => {
      return total + (transport.cost || 0);
    }, 0);
  };

  const groupCitiesByCountry = () => {
    if (!itinerary?.cities) return {};

    const grouped: { [key: string]: City[] } = {};
    itinerary.cities.forEach(city => {
      if (!grouped[city.country]) {
        grouped[city.country] = [];
      }
      grouped[city.country].push(city);
    });

    return grouped;
  };

  if (loading) {
    return (
      <div className="summary-page">
        <div className="loading">加载中...</div>
      </div>
    );
  }

  if (!itinerary) {
    return (
      <div className="summary-page">
        <div className="error">行程加载失败</div>
      </div>
    );
  }

  const citiesByCountry = groupCitiesByCountry();
  const totalDays = calculateTotalDays();
  const totalCities = calculateTotalCities();
  const totalAttractions = calculateTotalAttractions();
  const totalCost = calculateTotalCost();

  return (
    <div className="summary-page">
      <div className="page-header">
        <Link to="/" className="back-btn">
          <ArrowLeft className="back-icon" />
          返回首页
        </Link>
        <h1>行程总结</h1>
      </div>

      <div className="summary-content">
        {/* 行程概览 */}
        <div className="overview-section">
          <h2>{itinerary.title}</h2>
          <div className="overview-stats">
            <div className="stat-card">
              <Calendar className="stat-icon" />
              <div className="stat-content">
                <span className="stat-number">{totalDays}</span>
                <span className="stat-label">总天数</span>
              </div>
            </div>
            <div className="stat-card">
              <MapPin className="stat-icon" />
              <div className="stat-content">
                <span className="stat-number">{totalCities}</span>
                <span className="stat-label">城市数量</span>
              </div>
            </div>
            <div className="stat-card">
              <Star className="stat-icon" />
              <div className="stat-content">
                <span className="stat-number">{totalAttractions}</span>
                <span className="stat-label">景点数量</span>
              </div>
            </div>
            <div className="stat-card">
              <DollarSign className="stat-icon" />
              <div className="stat-content">
                <span className="stat-number">¥{totalCost.toLocaleString()}</span>
                <span className="stat-label">交通费用</span>
              </div>
            </div>
          </div>
          <div className="date-range">
            <Calendar className="date-icon" />
            <span>{formatDate(itinerary.start_date)} - {formatDate(itinerary.end_date)}</span>
          </div>
        </div>

        {/* 按国家分组的城市 */}
        <div className="countries-section">
          <h3>行程路线</h3>
          {Object.entries(citiesByCountry).map(([country, cities]) => (
            <div key={country} className="country-group">
              <div className="country-header">
                <h4>{country}</h4>
                <span className="city-count">{cities.length} 个城市</span>
              </div>
              <div className="cities-timeline">
                {cities.map((city, index) => (
                  <div key={city.id} className="city-timeline-item">
                    <div className="timeline-marker">
                      <div className="marker-number">{index + 1}</div>
                    </div>
                    <div className="city-details">
                      <div className="city-name">{city.name}</div>
                      <div className="city-dates">
                        {formatDate(city.arrival_date)} - {formatDate(city.departure_date)}
                      </div>
                      {city.attractions && city.attractions.length > 0 && (
                        <div className="attractions-preview">
                          <Star className="attraction-icon" />
                          <span>{city.attractions.length} 个景点</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* 交通路线 */}
        {itinerary.transportation && itinerary.transportation.length > 0 && (
          <div className="transportation-section">
            <h3>交通路线</h3>
            <div className="transportation-list">
              {itinerary.transportation.map((transport, index) => {
                const fromCity = itinerary.cities?.find(city => city.id === transport.from_city_id);
                const toCity = itinerary.cities?.find(city => city.id === transport.to_city_id);

                if (!fromCity || !toCity) return null;

                return (
                  <div key={index} className="transport-item">
                    <div className="transport-icon-container" style={{ color: getTransportColor(transport.transport_type) }}>
                      {getTransportIcon(transport.transport_type)}
                    </div>
                    <div className="transport-details">
                      <div className="transport-route">
                        {fromCity.name} → {toCity.name}
                      </div>
                      <div className="transport-meta">
                        <span className="transport-type">{transport.transport_type}</span>
                        <span className="transport-duration">{transport.duration}</span>
                        {transport.cost && (
                          <span className="transport-cost">¥{transport.cost}</span>
                        )}
                      </div>
                      <div className="transport-time">
                        {transport.departure_time} - {transport.arrival_time}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 景点统计 */}
        <div className="attractions-section">
          <h3>景点分布</h3>
          {Object.entries(citiesByCountry).map(([country, cities]) => {
            const countryAttractions = cities.reduce((total, city) => {
              return total + (city.attractions?.length || 0);
            }, 0);

            if (countryAttractions === 0) return null;

            return (
              <div key={country} className="country-attractions">
                <div className="country-attractions-header">
                  <h4>{country}</h4>
                  <span className="attraction-count">{countryAttractions} 个景点</span>
                </div>
                <div className="attractions-grid">
                  {cities.map(city =>
                    city.attractions?.map(attraction => (
                      <div key={attraction.id} className="attraction-card">
                        <div className="attraction-name">{attraction.name}</div>
                        <div className="attraction-location">{city.name}</div>
                        <div className="attraction-rating">
                          <Star className="star-icon" />
                          <span>{attraction.rating}</span>
                        </div>
                        <div className="attraction-category">{attraction.category}</div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* 快速导航 */}
        <div className="navigation-section">
          <h3>快速导航</h3>
          <div className="nav-buttons">
            <Link to="/itinerary/1" className="nav-btn">
              <MapPin className="btn-icon" />
              详细行程
            </Link>
            <Link to="/map" className="nav-btn">
              <Route className="btn-icon" />
              地图视图
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SummaryPage;
