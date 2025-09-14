export interface WeatherData {
  city: string;
  country: string;
  current: CurrentWeather;
  forecast: DailyForecast[];
  lastUpdated: string;
}

export interface CurrentWeather {
  temperature: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  windDirection: number;
  pressure: number;
  visibility: number;
  uvIndex: number;
  condition: string;
  icon: string;
  description: string;
}

export interface DailyForecast {
  date: string;
  day: string;
  high: number;
  low: number;
  condition: string;
  icon: string;
  description: string;
  precipitation: number;
  humidity: number;
  windSpeed: number;
}

export interface WeatherAlert {
  id: string;
  type: string;
  severity: 'minor' | 'moderate' | 'severe' | 'extreme';
  title: string;
  description: string;
  areas: string[];
  effective: string;
  expires: string;
}
