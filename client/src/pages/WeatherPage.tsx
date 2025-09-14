import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Cloud, Sun, CloudRain, Wind, Droplets, Eye, Gauge, RefreshCw } from 'lucide-react';
import { itineraryAPI } from '../services/api';
import { getWeatherData, getMockWeatherData } from '../services/weatherAPI';
import { Itinerary } from '../types';
import { WeatherData, CurrentWeather } from '../types/weather';
import './WeatherPage.css';

const WeatherPage: React.FC = () => {
  const [itinerary, setItinerary] = useState<Itinerary | null>(null);
  const [loading, setLoading] = useState(true);
  const [weatherData, setWeatherData] = useState<{ [key: string]: WeatherData }>({});
  const [selectedCity, setSelectedCity] = useState<string>('');
  const [refreshing, setRefreshing] = useState(false);


  useEffect(() => {
    fetchItinerary();
  }, []);

  useEffect(() => {
    if (itinerary?.cities) {
      loadWeatherData();
      if (!selectedCity && itinerary.cities.length > 0) {
        setSelectedCity(itinerary.cities[0].name);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [itinerary, selectedCity]);

  const loadWeatherData = async () => {
    if (!itinerary?.cities) return;

    const newWeatherData: { [key: string]: WeatherData } = {};

    for (const city of itinerary.cities) {
      // 尝试获取真实天气数据，如果失败则使用模拟数据
      const weatherData = await getWeatherData(city.name);
      newWeatherData[city.name] = weatherData || getMockWeatherData(city.name) || {
        city: city.name,
        country: city.country,
        current: {
          temperature: 20,
          feelsLike: 18,
          humidity: 60,
          windSpeed: 10,
          windDirection: 180,
          pressure: 1013,
          visibility: 10,
          uvIndex: 3,
          condition: 'Sunny',
          icon: '☀️',
          description: '晴朗'
        },
        forecast: [],
        lastUpdated: new Date().toISOString()
      };
    }

    setWeatherData(newWeatherData);
  };

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

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      if (itinerary?.cities) {
        const newWeatherData: { [key: string]: WeatherData } = {};

        for (const city of itinerary.cities) {
          // 尝试获取真实天气数据，如果失败则使用模拟数据
          const weatherData = await getWeatherData(city.name);
          newWeatherData[city.name] = weatherData || getMockWeatherData(city.name) || {
            city: city.name,
            country: city.country,
            current: {
              temperature: 20,
              feelsLike: 18,
              humidity: 60,
              windSpeed: 10,
              windDirection: 180,
              pressure: 1013,
              visibility: 10,
              uvIndex: 3,
              condition: 'Sunny',
              icon: '☀️',
              description: '晴朗'
            },
            forecast: [],
            lastUpdated: new Date().toISOString()
          };
        }

        setWeatherData(newWeatherData);
      }
    } catch (error) {
      console.error('刷新天气数据失败:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const getWeatherIcon = (condition: string) => {
    switch (condition) {
      case 'Sunny':
        return <Sun className="weather-icon sunny" />;
      case 'Cloudy':
        return <Cloud className="weather-icon cloudy" />;
      case 'Partly Cloudy':
        return <Cloud className="weather-icon partly-cloudy" />;
      case 'Rainy':
        return <CloudRain className="weather-icon rainy" />;
      case 'Snowy':
        return <Cloud className="weather-icon snowy" />;
      default:
        return <Cloud className="weather-icon" />;
    }
  };

  const getWindDirection = (degrees: number) => {
    const directions = ['北', '东北', '东', '东南', '南', '西南', '西', '西北'];
    const index = Math.round(degrees / 45) % 8;
    return directions[index];
  };

  const getUVIndexDescription = (index: number) => {
    if (index <= 2) return '低';
    if (index <= 5) return '中等';
    if (index <= 7) return '高';
    if (index <= 10) return '很高';
    return '极高';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-CN', {
      month: 'short',
      day: 'numeric'
    });
  };

  const getTravelAdvice = (weather: CurrentWeather) => {
    const advice = [];

    if (weather.temperature < 10) {
      advice.push('建议穿厚外套和保暖衣物');
    } else if (weather.temperature > 25) {
      advice.push('建议穿轻薄透气的衣物');
    }

    if (weather.humidity > 80) {
      advice.push('湿度较高，注意防潮');
    }

    if (weather.windSpeed > 15) {
      advice.push('风力较大，注意防风');
    }

    if (weather.uvIndex > 5) {
      advice.push('紫外线较强，注意防晒');
    }

    return advice.length > 0 ? advice : ['天气适宜，享受美好旅行！'];
  };

  if (loading) {
    return (
      <div className="weather-page">
        <div className="loading">加载中...</div>
      </div>
    );
  }

  const currentWeather = selectedCity ? weatherData[selectedCity] : null;

  return (
    <div className="weather-page">
      <div className="page-header">
        <Link to="/" className="back-btn">
          <ArrowLeft className="back-icon" />
          返回首页
        </Link>
        <div className="header-content">
          <h1>天气预报</h1>
          <p>查看各城市的天气情况和出行建议</p>
        </div>
        <button
          className="refresh-btn"
          onClick={handleRefresh}
          disabled={refreshing}
        >
          <RefreshCw className={`refresh-icon ${refreshing ? 'spinning' : ''}`} />
          刷新
        </button>
      </div>

      <div className="weather-content">
        {/* 城市选择器 */}
        {itinerary?.cities && (
          <div className="city-selector">
            <h3>选择城市</h3>
            <div className="city-tabs">
              {itinerary.cities.map(city => (
                <button
                  key={city.id}
                  className={`city-tab ${selectedCity === city.name ? 'active' : ''}`}
                  onClick={() => setSelectedCity(city.name)}
                >
                  <span className="city-name">{city.name}</span>
                  <span className="city-country">{city.country}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {currentWeather && (
          <>
            {/* 当前天气 */}
            <div className="current-weather">
              <div className="weather-main">
                <div className="weather-icon-large">
                  {getWeatherIcon(currentWeather.current.condition)}
                </div>
                <div className="weather-info">
                  <div className="temperature">
                    <span className="temp-value">{currentWeather.current.temperature}</span>
                    <span className="temp-unit">°C</span>
                  </div>
                  <div className="weather-condition">
                    {currentWeather.current.description}
                  </div>
                  <div className="feels-like">
                    体感温度 {currentWeather.current.feelsLike}°C
                  </div>
                </div>
              </div>

              <div className="weather-details">
                <div className="detail-item">
                  <Wind className="detail-icon" />
                  <div className="detail-content">
                    <span className="detail-label">风速</span>
                    <span className="detail-value">
                      {currentWeather.current.windSpeed} km/h {getWindDirection(currentWeather.current.windDirection)}
                    </span>
                  </div>
                </div>
                <div className="detail-item">
                  <Droplets className="detail-icon" />
                  <div className="detail-content">
                    <span className="detail-label">湿度</span>
                    <span className="detail-value">{currentWeather.current.humidity}%</span>
                  </div>
                </div>
                <div className="detail-item">
                  <Eye className="detail-icon" />
                  <div className="detail-content">
                    <span className="detail-label">能见度</span>
                    <span className="detail-value">{currentWeather.current.visibility} km</span>
                  </div>
                </div>
                <div className="detail-item">
                  <Gauge className="detail-icon" />
                  <div className="detail-content">
                    <span className="detail-label">气压</span>
                    <span className="detail-value">{currentWeather.current.pressure} hPa</span>
                  </div>
                </div>
                <div className="detail-item">
                  <Sun className="detail-icon" />
                  <div className="detail-content">
                    <span className="detail-label">紫外线</span>
                    <span className="detail-value">
                      {currentWeather.current.uvIndex} ({getUVIndexDescription(currentWeather.current.uvIndex)})
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* 未来几天预报 */}
            <div className="forecast-section">
              <h3>未来几天预报</h3>
              <div className="forecast-list">
                {currentWeather.forecast.map((day, index) => (
                  <div key={index} className="forecast-item">
                    <div className="forecast-date">
                      <span className="day">{day.day}</span>
                      <span className="date">{formatDate(day.date)}</span>
                    </div>
                    <div className="forecast-icon">
                      {getWeatherIcon(day.condition)}
                    </div>
                    <div className="forecast-temps">
                      <span className="high">{day.high}°</span>
                      <span className="low">{day.low}°</span>
                    </div>
                    <div className="forecast-condition">
                      {day.description}
                    </div>
                    <div className="forecast-details">
                      <div className="forecast-detail">
                        <Droplets className="detail-icon" />
                        <span>{day.humidity}%</span>
                      </div>
                      <div className="forecast-detail">
                        <CloudRain className="detail-icon" />
                        <span>{day.precipitation}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 出行建议 */}
            <div className="travel-advice">
              <h3>出行建议</h3>
              <div className="advice-list">
                {getTravelAdvice(currentWeather.current).map((advice, index) => (
                  <div key={index} className="advice-item">
                    <div className="advice-icon">💡</div>
                    <span className="advice-text">{advice}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 最后更新时间 */}
            <div className="last-updated">
              <span>最后更新: {new Date(currentWeather.lastUpdated).toLocaleString('zh-CN')}</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default WeatherPage;
