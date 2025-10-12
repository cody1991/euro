import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, Tooltip } from 'react-leaflet';
import { Star, Calendar, Plane, Train, Car, Ship } from 'lucide-react';
import { getItineraryData } from '../models/travelData';
import { Itinerary, Attraction } from '../types';
import 'leaflet/dist/leaflet.css';
import './MapPage.css';

// 修复 Leaflet 默认图标问题
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

// 创建自定义交通工具图标
const createTransportIcon = (transportType: string) => {
  const iconColor = getTransportColor(transportType);

  const iconHtml = `
    <div style="
      background: ${iconColor};
      width: 30px;
      height: 30px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 16px;
      border: 3px solid white;
      box-shadow: 0 2px 8px rgba(0,0,0,0.3);
    ">
      ${transportType === 'Flight' ? '✈️' :
      transportType === 'Train' ? '🚂' :
        transportType === 'Car' ? '🚗' :
          transportType === 'Ship' ? '🚢' : '🚌'}
    </div>
  `;

  return L.divIcon({
    html: iconHtml,
    className: 'custom-transport-icon',
    iconSize: [30, 30],
    iconAnchor: [15, 15],
    popupAnchor: [0, -15]
  });
};

// 创建城市标签图标
const createCityLabelIcon = (cityName: string, isMajor: boolean = false) => {
  const fontSize = isMajor ? '16px' : '14px';
  const fontWeight = isMajor ? 'bold' : '600';
  const padding = isMajor ? '8px 12px' : '6px 10px';
  const borderRadius = '20px';

  const iconHtml = `
    <div style="
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      font-size: ${fontSize};
      font-weight: ${fontWeight};
      padding: ${padding};
      border-radius: ${borderRadius};
      border: 2px solid white;
      box-shadow: 0 3px 10px rgba(0,0,0,0.3);
      white-space: nowrap;
      text-align: center;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      letter-spacing: 0.5px;
    ">
      ${cityName}
    </div>
  `;

  return L.divIcon({
    html: iconHtml,
    className: 'city-label-icon',
    iconSize: [isMajor ? 120 : 100, 30],
    iconAnchor: [isMajor ? 60 : 50, 15],
    popupAnchor: [0, -15]
  });
};

// 获取交通工具图标
const getTransportIcon = (transportType: string) => {
  switch (transportType) {
    case 'Flight':
      return <Plane className="transport-icon" />;
    case 'Train':
      return <Train className="transport-icon" />;
    case 'Car':
      return <Car className="transport-icon" />;
    case 'Ship':
      return <Ship className="transport-icon" />;
    default:
      return <Train className="transport-icon" />;
  }
};

// 获取交通路线颜色
const getTransportColor = (transportType: string) => {
  switch (transportType) {
    case 'Flight':
      return '#e74c3c';
    case 'Train':
      return '#3498db';
    case 'Car':
      return '#f39c12';
    case 'Ship':
      return '#9b59b6';
    default:
      return '#667eea';
  }
};

const MapPage: React.FC = () => {
  const [selectedItinerary, setSelectedItinerary] = useState<Itinerary | null>(null);
  const [loading, setLoading] = useState(true);
  const [mapCenter] = useState<[number, number]>([45.5, 7.0]); // 法国南部和意大利北部之间
  const [mapZoom] = useState(5.5);

  // 主要城市列表（显示大标签）
  const majorCities = ['阿姆斯特丹', '巴黎', '里昂', '马赛', '尼斯', '摩纳哥', '米兰', '维罗纳', '威尼斯', '佛罗伦萨', '比萨', '罗马', '梵蒂冈'];

  // 从数据库获取的景点数据
  const [recommendedAttractions, setRecommendedAttractions] = useState<{ [key: string]: Attraction[] }>({});

  useEffect(() => {
    loadItineraryData();
  }, []);

  const loadItineraryData = () => {
    try {
      // 直接从本地数据获取行程
      const data = getItineraryData();
      setSelectedItinerary(data);

      // 处理景点数据，按城市分组
      const attractionsByCity: { [key: string]: Attraction[] } = {};
      if (data.cities) {
        data.cities.forEach(city => {
          if (city.attractions && city.attractions.length > 0) {
            attractionsByCity[city.name] = city.attractions;
          }
        });
      }
      setRecommendedAttractions(attractionsByCity);
    } catch (error) {
      console.error('加载行程数据失败:', error);
    } finally {
      setLoading(false);
    }
  };

  // const getRouteCoordinates = (cities: City[]) => {
  //   return cities.map(city => [city.latitude, city.longitude] as [number, number]);
  // };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-CN');
  };

  if (loading) {
    return (
      <div className="map-page">
        <div className="loading">加载中...</div>
      </div>
    );
  }

  return (
    <div className="map-page">
      <div className="map-sidebar">
        <h2>欧洲旅游地图</h2>

        {selectedItinerary && (
          <div className="itinerary-info">
            <h3>{selectedItinerary.title}</h3>
            <div className="itinerary-dates">
              <Calendar className="date-icon" />
              <span>{formatDate(selectedItinerary.start_date)} - {formatDate(selectedItinerary.end_date)}</span>
            </div>

            {selectedItinerary.cities && selectedItinerary.cities.length > 0 && (
              <div className="cities-list">
                <h4>行程城市</h4>
                {selectedItinerary.cities.map((city, index) => {
                  // 计算停留天数
                  const arrival = new Date(city.arrival_date);
                  const departure = new Date(city.departure_date);
                  const days = Math.ceil((departure.getTime() - arrival.getTime()) / (1000 * 60 * 60 * 24)) + 1;

                  return (
                    <div key={city.id} className="city-item">
                      <div className="city-number">{index + 1}</div>
                      <div className="city-details">
                        <div className="city-name">
                          {city.name}
                          <span className="city-duration"> ({days}天)</span>
                        </div>
                        <div className="city-country">{city.country}</div>
                        <div className="city-dates">
                          {formatDate(city.arrival_date)} - {formatDate(city.departure_date)}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {selectedItinerary.transportation && selectedItinerary.transportation.length > 0 && (
              <div className="transportation-list">
                <h4>交通方式</h4>
                {selectedItinerary.transportation.map((transport, index) => {
                  const fromCity = selectedItinerary.cities?.find(city => city.id === transport.from_city_id);
                  const toCity = selectedItinerary.cities?.find(city => city.id === transport.to_city_id);

                  if (!fromCity || !toCity) return null;

                  return (
                    <div key={index} className="transport-item">
                      <div className="transport-icon-container">
                        {getTransportIcon(transport.transport_type)}
                      </div>
                      <div className="transport-details">
                        <div className="transport-main">
                          <div className="transport-route">
                            {fromCity.name} → {toCity.name}
                          </div>
                          <div className="transport-type-badge">{transport.transport_type}</div>
                        </div>
                        <div className="transport-meta">
                          <span className="transport-duration">{transport.duration}</span>
                          <span className="transport-time-simple">
                            {transport.departure_time.split(' ')[1]} - {transport.arrival_time.split(' ')[1]}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        <div className="recommended-attractions">
          <h4>推荐景点</h4>
          <div className="attractions-list">
            {Object.entries(recommendedAttractions).map(([city, attractions]) => (
              <div key={city} className="city-attractions">
                <h5>{city}</h5>
                {attractions.map((attraction, index) => (
                  <div key={index} className="attraction-item">
                    <div className="attraction-name">{attraction.name}</div>
                    <div className="attraction-rating">
                      <Star className="star-icon" />
                      <span>{attraction.rating}</span>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="map-container">
        <MapContainer
          center={mapCenter}
          zoom={mapZoom}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />

          {/* 显示选中的行程路线 */}
          {selectedItinerary && selectedItinerary.cities && selectedItinerary.cities.length > 0 && (
            <>
              {/* 绘制交通路线 */}
              {selectedItinerary.transportation && selectedItinerary.transportation.map((transport, index) => {
                const fromCity = selectedItinerary.cities?.find(city => city.id === transport.from_city_id);
                const toCity = selectedItinerary.cities?.find(city => city.id === transport.to_city_id);

                if (!fromCity || !toCity) return null;

                // 计算路线中点位置，用于放置交通工具图标
                const midLat = (fromCity.latitude + toCity.latitude) / 2;
                const midLng = (fromCity.longitude + toCity.longitude) / 2;

                return (
                  <React.Fragment key={index}>
                    {/* 交通路线 */}
                    <Polyline
                      positions={[
                        [fromCity.latitude, fromCity.longitude],
                        [toCity.latitude, toCity.longitude]
                      ]}
                      color={getTransportColor(transport.transport_type)}
                      weight={6}
                      opacity={0.8}
                    />

                    {/* 交通工具图标 */}
                    <Marker
                      position={[midLat, midLng]}
                      icon={createTransportIcon(transport.transport_type)}
                    >
                      <Popup>
                        <div className="transport-popup">
                          <h3>{transport.transport_type}</h3>
                          <p><strong>路线:</strong> {fromCity.name} → {toCity.name}</p>
                          <p><strong>时间:</strong> {transport.departure_time} - {transport.arrival_time}</p>
                          <p><strong>行程时间:</strong> {transport.duration}</p>
                        </div>
                      </Popup>
                    </Marker>
                  </React.Fragment>
                );
              })}

              {/* 城市标记 */}
              {selectedItinerary.cities.map((city, index) => (
                <Marker key={city.id} position={[city.latitude, city.longitude]}>
                  <Popup>
                    <div className="city-popup">
                      <h3>{city.name}</h3>
                      <p>{city.country}</p>
                      <div className="popup-dates">
                        <Calendar className="popup-icon" />
                        <span>{formatDate(city.arrival_date)} - {formatDate(city.departure_date)}</span>
                      </div>
                      {city.attractions && city.attractions.length > 0 && (
                        <div className="popup-attractions">
                          <h4>景点：</h4>
                          {city.attractions.map(attraction => (
                            <div key={attraction.id} className="popup-attraction">
                              <span>{attraction.name}</span>
                              <div className="popup-rating">
                                <Star className="popup-star" />
                                <span>{attraction.rating}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </Popup>
                </Marker>
              ))}

              {/* 城市标签 */}
              {selectedItinerary.cities.map((city, index) => {
                const isMajor = majorCities.includes(city.name);
                const labelOffset: [number, number] = isMajor ? [0, -25] : [0, -20];

                return (
                  <Marker
                    key={`label-${city.id}`}
                    position={[city.latitude, city.longitude]}
                    icon={createCityLabelIcon(city.name, isMajor)}
                  >
                    <Tooltip
                      direction="top"
                      offset={labelOffset}
                      opacity={1}
                      permanent={true}
                      className="city-tooltip"
                    >
                      {city.name}
                    </Tooltip>
                  </Marker>
                );
              })}

              {/* 绘制完整的行程路线（连接所有城市） */}
              {selectedItinerary.cities && selectedItinerary.cities.length > 1 && (
                <Polyline
                  positions={selectedItinerary.cities.map(city => [city.latitude, city.longitude] as [number, number])}
                  color="#667eea"
                  weight={3}
                  opacity={0.6}
                  dashArray="10, 10"
                />
              )}
            </>
          )}

          {/* 显示推荐景点 */}
          {Object.entries(recommendedAttractions).map(([cityName, attractions]) =>
            attractions.map((attraction, index) => (
              <Marker
                key={`${cityName}-${index}`}
                position={[attraction.latitude, attraction.longitude]}
                opacity={0.7}
              >
                <Popup>
                  <div className="attraction-popup">
                    <h3>{attraction.name}</h3>
                    <p>{attraction.description}</p>
                    <div className="popup-meta">
                      <span className="popup-category">{attraction.category}</span>
                      <div className="popup-rating">
                        <Star className="popup-star" />
                        <span>{attraction.rating}</span>
                      </div>
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))
          )}
        </MapContainer>
      </div>
    </div>
  );
};

export default MapPage;
