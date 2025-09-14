import { WeatherData, CurrentWeather, DailyForecast } from '../types/weather';

// OpenWeatherMap API配置
const API_KEY = 'your_api_key_here'; // 你需要注册OpenWeatherMap获取API密钥
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

// 城市坐标映射
const CITY_COORDINATES: { [key: string]: { lat: number; lon: number; country: string } } = {
  '阿姆斯特丹': { lat: 52.3676, lon: 4.9041, country: '荷兰' },
  '巴黎': { lat: 48.8566, lon: 2.3522, country: '法国' },
  '尼斯': { lat: 43.7102, lon: 7.2620, country: '法国' },
  '米兰': { lat: 45.4642, lon: 9.1900, country: '意大利' },
  '佛罗伦萨': { lat: 43.7696, lon: 11.2558, country: '意大利' },
  '威尼斯': { lat: 45.4408, lon: 12.3155, country: '意大利' },
  '罗马': { lat: 41.9028, lon: 12.4964, country: '意大利' },
  '布达佩斯': { lat: 47.4979, lon: 19.0402, country: '匈牙利' }
};

// 天气条件映射
const WEATHER_CONDITIONS: { [key: string]: string } = {
  '01d': 'Sunny', '01n': 'Sunny',
  '02d': 'Partly Cloudy', '02n': 'Partly Cloudy',
  '03d': 'Cloudy', '03n': 'Cloudy',
  '04d': 'Cloudy', '04n': 'Cloudy',
  '09d': 'Rainy', '09n': 'Rainy',
  '10d': 'Rainy', '10n': 'Rainy',
  '11d': 'Rainy', '11n': 'Rainy',
  '13d': 'Snowy', '13n': 'Snowy',
  '50d': 'Cloudy', '50n': 'Cloudy'
};

const WEATHER_DESCRIPTIONS: { [key: string]: string } = {
  'Sunny': '晴朗',
  'Partly Cloudy': '多云转晴',
  'Cloudy': '多云',
  'Rainy': '有雨',
  'Snowy': '有雪'
};

// 获取天气图标
const getWeatherIcon = (condition: string): string => {
  switch (condition) {
    case 'Sunny': return '☀️';
    case 'Cloudy': return '☁️';
    case 'Partly Cloudy': return '⛅';
    case 'Rainy': return '🌧️';
    case 'Snowy': return '❄️';
    default: return '☁️';
  }
};

// 获取风向描述
// const getWindDirection = (degrees: number): string => {
//   const directions = ['北', '东北', '东', '东南', '南', '西南', '西', '西北'];
//   const index = Math.round(degrees / 45) % 8;
//   return directions[index];
// };

// 获取UV指数描述
// const getUVIndexDescription = (index: number): string => {
//   if (index <= 2) return '低';
//   if (index <= 5) return '中等';
//   if (index <= 7) return '高';
//   if (index <= 10) return '很高';
//   return '极高';
// };

// 转换温度（从开尔文到摄氏度）
const kelvinToCelsius = (kelvin: number): number => {
  return Math.round(kelvin - 273.15);
};

// 获取当前天气
export const getCurrentWeather = async (cityName: string): Promise<CurrentWeather | null> => {
  try {
    const city = CITY_COORDINATES[cityName];
    if (!city) {
      console.error(`城市 ${cityName} 的坐标未找到`);
      return null;
    }

    const response = await fetch(
      `${BASE_URL}/weather?lat=${city.lat}&lon=${city.lon}&appid=${API_KEY}&lang=zh_cn`
    );

    if (!response.ok) {
      throw new Error(`天气API请求失败: ${response.status}`);
    }

    const data = await response.json();

    const condition = WEATHER_CONDITIONS[data.weather[0].icon] || 'Cloudy';
    const description = WEATHER_DESCRIPTIONS[condition] || data.weather[0].description;

    return {
      temperature: kelvinToCelsius(data.main.temp),
      feelsLike: kelvinToCelsius(data.main.feels_like),
      humidity: data.main.humidity,
      windSpeed: Math.round(data.wind.speed * 3.6), // 转换为km/h
      windDirection: data.wind.deg,
      pressure: data.main.pressure,
      visibility: Math.round((data.visibility || 10000) / 1000), // 转换为km
      uvIndex: 0, // 需要单独的UV API
      condition,
      icon: getWeatherIcon(condition),
      description
    };
  } catch (error) {
    console.error('获取当前天气失败:', error);
    return null;
  }
};

// 获取天气预报
export const getWeatherForecast = async (cityName: string): Promise<DailyForecast[]> => {
  try {
    const city = CITY_COORDINATES[cityName];
    if (!city) {
      console.error(`城市 ${cityName} 的坐标未找到`);
      return [];
    }

    const response = await fetch(
      `${BASE_URL}/forecast?lat=${city.lat}&lon=${city.lon}&appid=${API_KEY}&lang=zh_cn&cnt=24`
    );

    if (!response.ok) {
      throw new Error(`天气预报API请求失败: ${response.status}`);
    }

    const data = await response.json();

    // 处理5天预报数据，每天取一个代表时间点
    const dailyForecasts: DailyForecast[] = [];
    const days = ['今天', '明天', '后天', '周四', '周五'];

    for (let i = 0; i < 5; i++) {
      const forecastIndex = i * 8; // 每8个数据点代表一天（3小时间隔）
      if (forecastIndex < data.list.length) {
        const forecast = data.list[forecastIndex];
        const condition = WEATHER_CONDITIONS[forecast.weather[0].icon] || 'Cloudy';
        const description = WEATHER_DESCRIPTIONS[condition] || forecast.weather[0].description;

        // 计算当天的最高和最低温度
        let maxTemp = kelvinToCelsius(forecast.main.temp);
        let minTemp = kelvinToCelsius(forecast.main.temp);

        // 查看当天其他时间点的温度
        for (let j = 0; j < 8 && (forecastIndex + j) < data.list.length; j++) {
          const temp = kelvinToCelsius(data.list[forecastIndex + j].main.temp);
          maxTemp = Math.max(maxTemp, temp);
          minTemp = Math.min(minTemp, temp);
        }

        dailyForecasts.push({
          date: new Date(forecast.dt * 1000).toISOString().split('T')[0],
          day: days[i] || `第${i + 1}天`,
          high: maxTemp,
          low: minTemp,
          condition,
          icon: getWeatherIcon(condition),
          description,
          precipitation: Math.round((forecast.pop || 0) * 100),
          humidity: forecast.main.humidity,
          windSpeed: Math.round(forecast.wind.speed * 3.6)
        });
      }
    }

    return dailyForecasts;
  } catch (error) {
    console.error('获取天气预报失败:', error);
    return [];
  }
};

// 获取完整天气数据
export const getWeatherData = async (cityName: string): Promise<WeatherData | null> => {
  try {
    const city = CITY_COORDINATES[cityName];
    if (!city) {
      console.error(`城市 ${cityName} 的坐标未找到`);
      return null;
    }

    const [currentWeather, forecast] = await Promise.all([
      getCurrentWeather(cityName),
      getWeatherForecast(cityName)
    ]);

    if (!currentWeather) {
      return null;
    }

    return {
      city: cityName,
      country: city.country,
      current: currentWeather,
      forecast,
      lastUpdated: new Date().toISOString()
    };
  } catch (error) {
    console.error('获取天气数据失败:', error);
    return null;
  }
};

// 备用模拟数据（当API不可用时）
export const getMockWeatherData = (cityName: string): WeatherData | null => {
  const mockData: { [key: string]: WeatherData } = {
    '阿姆斯特丹': {
      city: '阿姆斯特丹',
      country: '荷兰',
      current: {
        temperature: 12,
        feelsLike: 10,
        humidity: 78,
        windSpeed: 15,
        windDirection: 225,
        pressure: 1013,
        visibility: 10,
        uvIndex: 2,
        condition: 'Cloudy',
        icon: '☁️',
        description: '多云'
      },
      forecast: [
        {
          date: new Date().toISOString().split('T')[0],
          day: '今天',
          high: 14,
          low: 8,
          condition: 'Cloudy',
          icon: '☁️',
          description: '多云',
          precipitation: 20,
          humidity: 75,
          windSpeed: 12
        },
        {
          date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
          day: '明天',
          high: 16,
          low: 9,
          condition: 'Partly Cloudy',
          icon: '⛅',
          description: '多云转晴',
          precipitation: 10,
          humidity: 70,
          windSpeed: 10
        }
      ],
      lastUpdated: new Date().toISOString()
    }
  };

  return mockData[cityName] || null;
};
