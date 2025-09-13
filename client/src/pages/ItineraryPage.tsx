import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Plus, MapPin, Calendar, Clock, Star, Edit3, Trash2 } from 'lucide-react';
import { itineraryAPI, cityAPI, attractionAPI } from '../services/api';
import { Itinerary, City, Attraction } from '../types';
import './ItineraryPage.css';

const ItineraryPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [itinerary, setItinerary] = useState<Itinerary | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAddCity, setShowAddCity] = useState(false);
  const [showAddAttraction, setShowAddAttraction] = useState(false);
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [editingAttraction, setEditingAttraction] = useState<Attraction | null>(null);

  const [newCity, setNewCity] = useState({
    name: '',
    country: '',
    latitude: 0,
    longitude: 0,
    arrival_date: '',
    departure_date: ''
  });

  const [newAttraction, setNewAttraction] = useState({
    name: '',
    description: '',
    latitude: 0,
    longitude: 0,
    visit_date: '',
    visit_time: '',
    category: '',
    rating: 5
  });

  useEffect(() => {
    if (id) {
      fetchItinerary(parseInt(id));
    }
  }, [id]);

  const fetchItinerary = async (itineraryId: number) => {
    try {
      const response = await itineraryAPI.getById(itineraryId);
      setItinerary(response.data);
    } catch (error) {
      console.error('获取行程详情失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!itinerary) return;

    try {
      const response = await cityAPI.create({
        ...newCity,
        itinerary_id: itinerary.id
      });

      setItinerary(prev => prev ? {
        ...prev,
        cities: [...(prev.cities || []), response.data]
      } : null);

      setNewCity({
        name: '',
        country: '',
        latitude: 0,
        longitude: 0,
        arrival_date: '',
        departure_date: ''
      });
      setShowAddCity(false);
    } catch (error) {
      console.error('添加城市失败:', error);
    }
  };

  const handleAddAttraction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCity) return;

    try {
      const response = await attractionAPI.create({
        ...newAttraction,
        city_id: selectedCity.id
      });

      setItinerary(prev => prev ? {
        ...prev,
        cities: prev.cities?.map(city =>
          city.id === selectedCity.id
            ? { ...city, attractions: [...(city.attractions || []), response.data] }
            : city
        )
      } : null);

      setNewAttraction({
        name: '',
        description: '',
        latitude: 0,
        longitude: 0,
        visit_date: '',
        visit_time: '',
        category: '',
        rating: 5
      });
      setShowAddAttraction(false);
      setSelectedCity(null);
    } catch (error) {
      console.error('添加景点失败:', error);
    }
  };

  const handleDeleteAttraction = async (attractionId: number) => {
    try {
      await attractionAPI.delete(attractionId);
      setItinerary(prev => prev ? {
        ...prev,
        cities: prev.cities?.map(city => ({
          ...city,
          attractions: city.attractions?.filter(attr => attr.id !== attractionId) || []
        }))
      } : null);
    } catch (error) {
      console.error('删除景点失败:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-CN');
  };

  const formatTime = (timeString: string) => {
    return timeString || '全天';
  };

  if (loading) {
    return (
      <div className="itinerary-page">
        <div className="loading">加载中...</div>
      </div>
    );
  }

  if (!itinerary) {
    return (
      <div className="itinerary-page">
        <div className="error">行程不存在</div>
      </div>
    );
  }

  return (
    <div className="itinerary-page">
      <div className="page-header">
        <Link to="/" className="back-btn">
          <ArrowLeft className="back-icon" />
          返回首页
        </Link>
        <div className="header-content">
          <h1>{itinerary.title}</h1>
          <div className="header-dates">
            <Calendar className="date-icon" />
            <span>{formatDate(itinerary.start_date)} - {formatDate(itinerary.end_date)}</span>
          </div>
        </div>
        <button
          className="add-city-btn"
          onClick={() => setShowAddCity(true)}
        >
          <Plus className="btn-icon" />
          添加城市
        </button>
      </div>

      <div className="content">
        {itinerary.cities && itinerary.cities.length > 0 ? (
          <div className="cities-list">
            {itinerary.cities.map((city, index) => (
              <div key={city.id} className="city-card">
                <div className="city-header">
                  <div className="city-info">
                    <h2>{city.name}</h2>
                    <span className="country">{city.country}</span>
                    <div className="city-dates">
                      <Calendar className="date-icon" />
                      <span>{formatDate(city.arrival_date)} - {formatDate(city.departure_date)}</span>
                    </div>
                  </div>
                  <button
                    className="add-attraction-btn"
                    onClick={() => {
                      setSelectedCity(city);
                      setShowAddAttraction(true);
                    }}
                  >
                    <Plus className="btn-icon" />
                    添加景点
                  </button>
                </div>

                <div className="attractions-list">
                  {city.attractions && city.attractions.length > 0 ? (
                    city.attractions.map((attraction) => (
                      <div key={attraction.id} className="attraction-card">
                        <div className="attraction-info">
                          <h3>{attraction.name}</h3>
                          <p className="description">{attraction.description}</p>
                          <div className="attraction-meta">
                            <div className="visit-time">
                              <Clock className="meta-icon" />
                              <span>{formatDate(attraction.visit_date)} {formatTime(attraction.visit_time)}</span>
                            </div>
                            <div className="category">
                              <span className="category-tag">{attraction.category}</span>
                            </div>
                            <div className="rating">
                              <Star className="star-icon" />
                              <span>{attraction.rating}</span>
                            </div>
                          </div>
                        </div>
                        <div className="attraction-actions">
                          <button
                            className="edit-btn"
                            onClick={() => setEditingAttraction(attraction)}
                          >
                            <Edit3 className="action-icon" />
                          </button>
                          <button
                            className="delete-btn"
                            onClick={() => handleDeleteAttraction(attraction.id)}
                          >
                            <Trash2 className="action-icon" />
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="no-attractions">
                      <MapPin className="no-attractions-icon" />
                      <p>还没有添加景点</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-cities">
            <MapPin className="no-cities-icon" />
            <h3>还没有添加城市</h3>
            <p>开始添加你的第一个目的地吧！</p>
            <button
              className="add-city-btn"
              onClick={() => setShowAddCity(true)}
            >
              <Plus className="btn-icon" />
              添加城市
            </button>
          </div>
        )}
      </div>

      {/* 添加城市模态框 */}
      {showAddCity && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>添加城市</h3>
            <form onSubmit={handleAddCity}>
              <div className="form-group">
                <label>城市名称</label>
                <input
                  type="text"
                  value={newCity.name}
                  onChange={(e) => setNewCity({ ...newCity, name: e.target.value })}
                  placeholder="例如：阿姆斯特丹"
                  required
                />
              </div>
              <div className="form-group">
                <label>国家</label>
                <input
                  type="text"
                  value={newCity.country}
                  onChange={(e) => setNewCity({ ...newCity, country: e.target.value })}
                  placeholder="例如：荷兰"
                  required
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>纬度</label>
                  <input
                    type="number"
                    step="0.000001"
                    value={newCity.latitude}
                    onChange={(e) => setNewCity({ ...newCity, latitude: parseFloat(e.target.value) })}
                    placeholder="52.3676"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>经度</label>
                  <input
                    type="number"
                    step="0.000001"
                    value={newCity.longitude}
                    onChange={(e) => setNewCity({ ...newCity, longitude: parseFloat(e.target.value) })}
                    placeholder="4.9041"
                    required
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>到达日期</label>
                  <input
                    type="date"
                    value={newCity.arrival_date}
                    onChange={(e) => setNewCity({ ...newCity, arrival_date: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>离开日期</label>
                  <input
                    type="date"
                    value={newCity.departure_date}
                    onChange={(e) => setNewCity({ ...newCity, departure_date: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="form-actions">
                <button type="button" onClick={() => setShowAddCity(false)}>
                  取消
                </button>
                <button type="submit">添加城市</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 添加景点模态框 */}
      {showAddAttraction && selectedCity && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>添加景点 - {selectedCity.name}</h3>
            <form onSubmit={handleAddAttraction}>
              <div className="form-group">
                <label>景点名称</label>
                <input
                  type="text"
                  value={newAttraction.name}
                  onChange={(e) => setNewAttraction({ ...newAttraction, name: e.target.value })}
                  placeholder="例如：梵高博物馆"
                  required
                />
              </div>
              <div className="form-group">
                <label>描述</label>
                <textarea
                  value={newAttraction.description}
                  onChange={(e) => setNewAttraction({ ...newAttraction, description: e.target.value })}
                  placeholder="景点的详细描述..."
                  rows={3}
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>纬度</label>
                  <input
                    type="number"
                    step="0.000001"
                    value={newAttraction.latitude}
                    onChange={(e) => setNewAttraction({ ...newAttraction, latitude: parseFloat(e.target.value) })}
                    placeholder="52.3584"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>经度</label>
                  <input
                    type="number"
                    step="0.000001"
                    value={newAttraction.longitude}
                    onChange={(e) => setNewAttraction({ ...newAttraction, longitude: parseFloat(e.target.value) })}
                    placeholder="4.8811"
                    required
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>参观日期</label>
                  <input
                    type="date"
                    value={newAttraction.visit_date}
                    onChange={(e) => setNewAttraction({ ...newAttraction, visit_date: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>参观时间</label>
                  <input
                    type="time"
                    value={newAttraction.visit_time}
                    onChange={(e) => setNewAttraction({ ...newAttraction, visit_time: e.target.value })}
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>类别</label>
                  <select
                    value={newAttraction.category}
                    onChange={(e) => setNewAttraction({ ...newAttraction, category: e.target.value })}
                    required
                  >
                    <option value="">选择类别</option>
                    <option value="博物馆">博物馆</option>
                    <option value="历史建筑">历史建筑</option>
                    <option value="自然景观">自然景观</option>
                    <option value="购物">购物</option>
                    <option value="美食">美食</option>
                    <option value="娱乐">娱乐</option>
                    <option value="其他">其他</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>评分 (1-5)</label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    step="0.1"
                    value={newAttraction.rating}
                    onChange={(e) => setNewAttraction({ ...newAttraction, rating: parseFloat(e.target.value) })}
                    required
                  />
                </div>
              </div>
              <div className="form-actions">
                <button type="button" onClick={() => setShowAddAttraction(false)}>
                  取消
                </button>
                <button type="submit">添加景点</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ItineraryPage;
