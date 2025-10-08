import axios from 'axios';
import { Itinerary } from '../types';

const API_BASE_URL = process.env.REACT_APP_API_URL ||
  (process.env.NODE_ENV === 'production' ? '/api' : 'http://localhost:5001/api');

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const itineraryAPI = {
  // 获取特定行程（包含城市、景点、交通信息）
  getById: (id: number) => api.get<Itinerary>(`/itineraries/${id}`),
};

export default api;
