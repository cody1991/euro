import axios from 'axios';
import { Itinerary, City, Attraction, Transportation } from '../types';
import { Budget, BudgetCategory, Expense } from '../types/budget';

const API_BASE_URL = process.env.REACT_APP_API_URL ||
  (process.env.NODE_ENV === 'production' ? '/api' : 'http://localhost:5001/api');

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

export const budgetAPI = {
  // 获取预算
  getByItineraryId: (itineraryId: number) => api.get<Budget[]>(`/budgets?itinerary_id=${itineraryId}`),

  // 创建预算
  create: (data: Omit<Budget, 'id' | 'created_at' | 'updated_at'>) =>
    api.post<Budget>('/budgets', data),

  // 更新预算
  update: (id: number, data: Partial<Budget>) => api.put<Budget>(`/budgets?id=${id}`, data),
};

export const budgetCategoryAPI = {
  // 获取所有预算分类
  getAll: () => api.get<BudgetCategory[]>('/budget_categories'),

  // 创建预算分类
  create: (data: Omit<BudgetCategory, 'id' | 'created_at'>) =>
    api.post<BudgetCategory>('/budget_categories', data),

  // 更新预算分类
  update: (id: number, data: Partial<BudgetCategory>) =>
    api.put<BudgetCategory>(`/budget_categories?id=${id}`, data),

  // 删除预算分类
  delete: (id: number) => api.delete(`/budget_categories?id=${id}`),
};

export const expenseAPI = {
  // 获取支出记录
  getByBudgetId: (budgetId: number) => api.get<Expense[]>(`/expenses?budget_id=${budgetId}`),

  // 创建支出记录
  create: (data: Omit<Expense, 'id' | 'created_at'>) =>
    api.post<Expense>('/expenses', data),

  // 更新支出记录
  update: (id: number, data: Partial<Expense>) =>
    api.put<Expense>(`/expenses?id=${id}`, data),

  // 删除支出记录
  delete: (id: number) => api.delete(`/expenses?id=${id}`),
};

export default api;
