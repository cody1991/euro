import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Clock, Plane, Star } from 'lucide-react';
import { itineraryAPI } from '../services/api';
import { Itinerary } from '../types';
import './HomePage.css';

const HomePage: React.FC = () => {
  const [itinerary, setItinerary] = useState<Itinerary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchItinerary();
  }, []);

  const fetchItinerary = async () => {
    try {
      // 获取最新的行程（ID为4的完整欧洲行程）
      const response = await itineraryAPI.getById(4);
      setItinerary(response.data);
    } catch (error) {
      console.error('获取行程失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-CN');
  };

  const calculateDuration = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (loading) {
    return (
      <div className="home-page">
        <div className="loading">加载中...</div>
      </div>
    );
  }

  if (!itinerary) {
    return (
      <div className="home-page">
        <div className="loading">行程加载失败</div>
      </div>
    );
  }

  return (
    <div className="home-page">
      <div className="hero-section">
        <div className="hero-content">
          <h1>欧洲20天深度游</h1>
          <p>从武汉出发，探索荷兰、法国、意大利、匈牙利等美丽国家，体验最纯正的欧洲文化</p>
          <div className="hero-stats">
            <div className="stat">
              <MapPin className="stat-icon" />
              <span>8个国家</span>
            </div>
            <div className="stat">
              <Calendar className="stat-icon" />
              <span>{calculateDuration(itinerary.start_date, itinerary.end_date)} 天</span>
            </div>
            <div className="stat">
              <Plane className="stat-icon" />
              <span>完整规划</span>
            </div>
            <div className="stat">
              <Star className="stat-icon" />
              <span>精选景点</span>
            </div>
          </div>
        </div>
      </div>

      <div className="content-section">
        <div className="section-header">
          <h2>行程概览</h2>
        </div>

        <div className="itinerary-showcase">
          <div className="showcase-card">
            <div className="card-header">
              <h3>{itinerary.title}</h3>
              <div className="card-dates">
                <span>{formatDate(itinerary.start_date)}</span>
                <span>至</span>
                <span>{formatDate(itinerary.end_date)}</span>
              </div>
            </div>
            <div className="card-content">
              <div className="duration">
                <Clock className="duration-icon" />
                <span>{calculateDuration(itinerary.start_date, itinerary.end_date)} 天完整行程</span>
              </div>
              <div className="cities-count">
                <MapPin className="cities-icon" />
                <span>{itinerary.cities?.length || 0} 个城市</span>
              </div>
              <div className="route-preview">
                <h4>行程路线</h4>
                <div className="route-cities">
                  {itinerary.cities?.slice(0, 5).map((city, index) => (
                    <span key={city.id} className="route-city">
                      {city.name}
                      {index < 4 && <span className="route-arrow">→</span>}
                    </span>
                  ))}
                  {itinerary.cities && itinerary.cities.length > 5 && (
                    <span className="route-more">...等{itinerary.cities.length}个城市</span>
                  )}
                </div>
              </div>
            </div>
            <div className="card-actions">
              <Link
                to={`/itinerary/${itinerary.id}`}
                className="view-btn primary"
              >
                查看完整行程
              </Link>
              <Link
                to="/map"
                className="view-btn secondary"
              >
                查看地图
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
