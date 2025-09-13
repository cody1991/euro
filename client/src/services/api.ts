import axios from 'axios';
import { Itinerary, City, Attraction, Transportation } from '../types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const itineraryAPI = {
  // 获取所有行程
  getAll: () => api.get<Itinerary[]>('/itineraries'),

  // 获取特定行程
  getById: (id: number) => api.get<Itinerary>(`/itineraries/${id}`),

  // 创建新行程
  create: (data: { title: string; start_date: string; end_date: string }) =>
    api.post<Itinerary>('/itineraries', data),
};

export const cityAPI = {
  // 添加城市
  create: (data: Omit<City, 'id'>) => api.post<City>('/cities', data),

  // 更新城市
  update: (id: number, data: Partial<City>) => api.put<City>(`/cities/${id}`, data),

  // 删除城市
  delete: (id: number) => api.delete(`/cities/${id}`),
};

export const attractionAPI = {
  // 添加景点
  create: (data: Omit<Attraction, 'id'>) => api.post<Attraction>('/attractions', data),

  // 更新景点
  update: (id: number, data: Partial<Attraction>) => api.put<Attraction>(`/attractions/${id}`, data),

  // 删除景点
  delete: (id: number) => api.delete(`/attractions/${id}`),
};

export const transportationAPI = {
  // 添加交通
  create: (data: Omit<Transportation, 'id'>) => api.post<Transportation>('/transportation', data),
};

export default api;
