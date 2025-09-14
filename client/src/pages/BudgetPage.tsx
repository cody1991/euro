import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Plus, Calendar, MapPin, Edit3, Trash2 } from 'lucide-react';
import { itineraryAPI, budgetAPI, budgetCategoryAPI, expenseAPI } from '../services/api';
import { Itinerary } from '../types';
import { Budget, BudgetCategory, Expense } from '../types/budget';
import './BudgetPage.css';

const BudgetPage: React.FC = () => {
  const [itinerary, setItinerary] = useState<Itinerary | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  // const [showBudgetSettings, setShowBudgetSettings] = useState(false);

  // 预算数据
  const [budget, setBudget] = useState<Budget | null>(null);
  const [budgetCategories, setBudgetCategories] = useState<BudgetCategory[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);

  const [newExpense, setNewExpense] = useState({
    category_id: '',
    city_id: '',
    attraction_id: '',
    amount: '',
    currency: 'CNY',
    description: '',
    expense_date: '',
    payment_method: '现金'
  });

  useEffect(() => {
    fetchItinerary();
  }, []);

  useEffect(() => {
    if (itinerary) {
      loadBudgetData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [itinerary]);

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

  const loadBudgetData = async () => {
    if (!itinerary) return;

    try {
      // 加载预算数据
      const budgetResponse = await budgetAPI.getByItineraryId(itinerary.id);
      if (budgetResponse.data && budgetResponse.data.length > 0) {
        setBudget(budgetResponse.data[0]);
      } else {
        // 如果没有预算数据，创建一个默认的
        const newBudget = {
          itinerary_id: itinerary.id,
          total_budget: 50000,
          spent_amount: 0,
          remaining_amount: 50000,
          currency: 'CNY'
        };
        const createResponse = await budgetAPI.create(newBudget);
        setBudget(createResponse.data);
      }

      // 加载预算分类
      const categoriesResponse = await budgetCategoryAPI.getAll();
      if (categoriesResponse.data && categoriesResponse.data.length > 0) {
        setBudgetCategories(categoriesResponse.data);
      } else {
        // 如果没有分类数据，创建默认分类
        const defaultCategories = [
          { name: '交通', budget_amount: 15000, spent_amount: 0, color: '#3498db', icon: '✈️' },
          { name: '住宿', budget_amount: 12000, spent_amount: 0, color: '#9b59b6', icon: '🏨' },
          { name: '餐饮', budget_amount: 8000, spent_amount: 0, color: '#e74c3c', icon: '🍽️' },
          { name: '门票', budget_amount: 6000, spent_amount: 0, color: '#f39c12', icon: '🎫' },
          { name: '购物', budget_amount: 5000, spent_amount: 0, color: '#2ecc71', icon: '🛍️' },
          { name: '其他', budget_amount: 4000, spent_amount: 0, color: '#95a5a6', icon: '💼' }
        ];

        const createdCategories: BudgetCategory[] = [];
        for (const category of defaultCategories) {
          const response = await budgetCategoryAPI.create(category);
          createdCategories.push(response.data);
        }
        setBudgetCategories(createdCategories);
      }

      // 加载支出记录
      if (budget) {
        const expensesResponse = await expenseAPI.getByBudgetId(budget.id);
        setExpenses(expensesResponse.data || []);
      }
    } catch (error) {
      console.error('加载预算数据失败:', error);
    }
  };

  const handleAddExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!budget) return;

    try {
      const expenseData = {
        budget_id: budget.id,
        category_id: parseInt(newExpense.category_id),
        city_id: newExpense.city_id ? parseInt(newExpense.city_id) : undefined,
        attraction_id: newExpense.attraction_id ? parseInt(newExpense.attraction_id) : undefined,
        amount: parseFloat(newExpense.amount),
        currency: newExpense.currency,
        description: newExpense.description,
        expense_date: newExpense.expense_date,
        payment_method: newExpense.payment_method
      };

      const response = await expenseAPI.create(expenseData);
      setExpenses(prev => [...prev, response.data]);

      // 更新预算统计
      updateBudgetStats(response.data);

      setNewExpense({
        category_id: '',
        city_id: '',
        attraction_id: '',
        amount: '',
        currency: 'CNY',
        description: '',
        expense_date: '',
        payment_method: '现金'
      });
      setShowAddExpense(false);
    } catch (error) {
      console.error('添加支出失败:', error);
    }
  };

  const handleEditExpense = (expense: Expense) => {
    setEditingExpense(expense);
    setNewExpense({
      category_id: expense.category_id.toString(),
      city_id: expense.city_id?.toString() || '',
      attraction_id: expense.attraction_id?.toString() || '',
      amount: expense.amount.toString(),
      currency: expense.currency,
      description: expense.description,
      expense_date: expense.expense_date,
      payment_method: expense.payment_method
    });
    setShowAddExpense(true);
  };

  const handleUpdateExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingExpense) return;

    try {
      const expenseData = {
        category_id: parseInt(newExpense.category_id),
        city_id: newExpense.city_id ? parseInt(newExpense.city_id) : undefined,
        attraction_id: newExpense.attraction_id ? parseInt(newExpense.attraction_id) : undefined,
        amount: parseFloat(newExpense.amount),
        currency: newExpense.currency,
        description: newExpense.description,
        expense_date: newExpense.expense_date,
        payment_method: newExpense.payment_method
      };

      await expenseAPI.update(editingExpense.id, expenseData);

      setExpenses(prev => prev.map(exp =>
        exp.id === editingExpense.id ? { ...exp, ...expenseData } : exp
      ));

      // 重新计算预算统计
      recalculateBudgetStats();

      setEditingExpense(null);
      setNewExpense({
        category_id: '',
        city_id: '',
        attraction_id: '',
        amount: '',
        currency: 'CNY',
        description: '',
        expense_date: '',
        payment_method: '现金'
      });
      setShowAddExpense(false);
    } catch (error) {
      console.error('更新支出失败:', error);
    }
  };

  const handleDeleteExpense = async (expenseId: number) => {
    try {
      await expenseAPI.delete(expenseId);
      setExpenses(prev => prev.filter(exp => exp.id !== expenseId));
      recalculateBudgetStats();
    } catch (error) {
      console.error('删除支出失败:', error);
    }
  };

  const updateBudgetStats = async (expense: Expense) => {
    if (!budget) return;

    const newSpentAmount = budget.spent_amount + expense.amount;
    const newRemainingAmount = budget.remaining_amount - expense.amount;

    // 更新本地状态
    setBudget(prev => prev ? {
      ...prev,
      spent_amount: newSpentAmount,
      remaining_amount: newRemainingAmount,
      updated_at: new Date().toISOString()
    } : null);

    setBudgetCategories(prev => prev.map(cat =>
      cat.id === expense.category_id
        ? { ...cat, spent_amount: cat.spent_amount + expense.amount }
        : cat
    ));

    // 更新数据库
    try {
      await budgetAPI.update(budget.id, {
        spent_amount: newSpentAmount,
        remaining_amount: newRemainingAmount
      });
    } catch (error) {
      console.error('更新预算统计失败:', error);
    }
  };

  const recalculateBudgetStats = async () => {
    if (!budget) return;

    const totalSpent = expenses.reduce((sum, exp) => sum + exp.amount, 0);
    const newRemainingAmount = budget.total_budget - totalSpent;

    // 更新本地状态
    setBudget(prev => prev ? {
      ...prev,
      spent_amount: totalSpent,
      remaining_amount: newRemainingAmount,
      updated_at: new Date().toISOString()
    } : null);

    const categorySpent: { [key: number]: number } = {};
    expenses.forEach(exp => {
      categorySpent[exp.category_id] = (categorySpent[exp.category_id] || 0) + exp.amount;
    });

    setBudgetCategories(prev => prev.map(cat => ({
      ...cat,
      spent_amount: categorySpent[cat.id] || 0
    })));

    // 更新数据库
    try {
      await budgetAPI.update(budget.id, {
        spent_amount: totalSpent,
        remaining_amount: newRemainingAmount
      });
    } catch (error) {
      console.error('重新计算预算统计失败:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-CN');
  };

  const formatCurrency = (amount: number, currency: string = 'CNY') => {
    return new Intl.NumberFormat('zh-CN', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  const calculatePercentage = (spent: number, budget: number) => {
    return Math.round((spent / budget) * 100);
  };

  const getCategoryById = (id: number) => {
    return budgetCategories.find(cat => cat.id === id);
  };

  const getCityById = (id: number) => {
    return itinerary?.cities?.find(city => city.id === id);
  };

  if (loading) {
    return (
      <div className="budget-page">
        <div className="loading">加载中...</div>
      </div>
    );
  }

  if (!budget) {
    return (
      <div className="budget-page">
        <div className="page-header">
          <Link to="/" className="back-btn">
            <ArrowLeft className="back-icon" />
            返回首页
          </Link>
          <div className="header-content">
            <h1>预算管理</h1>
            <p>管理您的旅行预算和支出</p>
          </div>
        </div>
        <div className="budget-content">
          <div className="loading">正在初始化预算数据...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="budget-page">
      <div className="page-header">
        <Link to="/" className="back-btn">
          <ArrowLeft className="back-icon" />
          返回首页
        </Link>
        <div className="header-content">
          <h1>预算管理</h1>
          <p>管理您的旅行预算和支出</p>
        </div>
        <div className="header-actions">
          <button
            className="budget-settings-btn"
            onClick={() => alert('预算设置功能即将推出！')}
          >
            预算设置
          </button>
          <button
            className="add-expense-btn"
            onClick={() => setShowAddExpense(true)}
          >
            <Plus className="btn-icon" />
            添加支出
          </button>
        </div>
      </div>

      <div className="budget-content">
        {/* 预算概览 */}
        <div className="budget-overview">
          <div className="overview-card">
            <h3>预算概览</h3>
            <div className="budget-stats">
              <div className="stat-item">
                <div className="stat-label">总预算</div>
                <div className="stat-value total">{formatCurrency(budget.total_budget)}</div>
              </div>
              <div className="stat-item">
                <div className="stat-label">已支出</div>
                <div className="stat-value spent">{formatCurrency(budget.spent_amount)}</div>
              </div>
              <div className="stat-item">
                <div className="stat-label">剩余</div>
                <div className="stat-value remaining">{formatCurrency(budget.remaining_amount)}</div>
              </div>
              <div className="stat-item">
                <div className="stat-label">使用率</div>
                <div className="stat-value percentage">
                  {calculatePercentage(budget.spent_amount, budget.total_budget)}%
                </div>
              </div>
            </div>
          </div>

          <div className="budget-progress">
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{
                  width: `${calculatePercentage(budget.spent_amount, budget.total_budget)}%`,
                  backgroundColor: calculatePercentage(budget.spent_amount, budget.total_budget) > 80 ? '#e74c3c' : '#3498db'
                }}
              ></div>
            </div>
            <div className="progress-text">
              已使用 {calculatePercentage(budget.spent_amount, budget.total_budget)}% 预算
            </div>
          </div>
        </div>

        {/* 预算分类 */}
        <div className="budget-categories">
          <h3>预算分类</h3>
          <div className="categories-grid">
            {budgetCategories.map(category => (
              <div key={category.id} className="category-card">
                <div className="category-header">
                  <div className="category-icon" style={{ backgroundColor: category.color }}>
                    {category.icon}
                  </div>
                  <div className="category-info">
                    <h4>{category.name}</h4>
                    <div className="category-amounts">
                      <span className="spent">{formatCurrency(category.spent_amount)}</span>
                      <span className="separator">/</span>
                      <span className="budget">{formatCurrency(category.budget_amount)}</span>
                    </div>
                  </div>
                </div>
                <div className="category-progress">
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{
                        width: `${calculatePercentage(category.spent_amount, category.budget_amount)}%`,
                        backgroundColor: category.color
                      }}
                    ></div>
                  </div>
                  <div className="progress-percentage">
                    {calculatePercentage(category.spent_amount, category.budget_amount)}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 支出记录 */}
        <div className="expenses-section">
          <h3>支出记录</h3>
          <div className="expenses-list">
            {expenses.map(expense => {
              const category = getCategoryById(expense.category_id);
              const city = getCityById(expense.city_id || 0);

              return (
                <div key={expense.id} className="expense-item">
                  <div className="expense-icon" style={{ backgroundColor: category?.color }}>
                    {category?.icon}
                  </div>
                  <div className="expense-details">
                    <div className="expense-header">
                      <h4>{expense.description}</h4>
                      <span className="expense-amount">{formatCurrency(expense.amount)}</span>
                    </div>
                    <div className="expense-meta">
                      <div className="expense-category">
                        <span className="category-tag" style={{ backgroundColor: category?.color }}>
                          {category?.name}
                        </span>
                      </div>
                      {city && (
                        <div className="expense-location">
                          <MapPin className="location-icon" />
                          <span>{city.name}</span>
                        </div>
                      )}
                      <div className="expense-date">
                        <Calendar className="date-icon" />
                        <span>{formatDate(expense.expense_date)}</span>
                      </div>
                      <div className="expense-payment">
                        <span className="payment-method">{expense.payment_method}</span>
                      </div>
                    </div>
                  </div>
                  <div className="expense-actions">
                    <button
                      className="edit-btn"
                      onClick={() => handleEditExpense(expense)}
                    >
                      <Edit3 className="action-icon" />
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => handleDeleteExpense(expense.id)}
                    >
                      <Trash2 className="action-icon" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 添加/编辑支出模态框 */}
      {showAddExpense && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>{editingExpense ? '编辑支出' : '添加支出'}</h3>
            <form onSubmit={editingExpense ? handleUpdateExpense : handleAddExpense}>
              <div className="form-group">
                <label>支出类别</label>
                <select
                  value={newExpense.category_id}
                  onChange={(e) => setNewExpense({ ...newExpense, category_id: e.target.value })}
                  required
                >
                  <option value="">选择类别</option>
                  {budgetCategories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.icon} {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>城市</label>
                <select
                  value={newExpense.city_id}
                  onChange={(e) => setNewExpense({ ...newExpense, city_id: e.target.value })}
                >
                  <option value="">选择城市</option>
                  {itinerary?.cities?.map(city => (
                    <option key={city.id} value={city.id}>
                      {city.name}, {city.country}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>金额</label>
                  <input
                    type="number"
                    step="0.01"
                    value={newExpense.amount}
                    onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
                    placeholder="0.00"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>货币</label>
                  <select
                    value={newExpense.currency}
                    onChange={(e) => setNewExpense({ ...newExpense, currency: e.target.value })}
                  >
                    <option value="CNY">人民币 (CNY)</option>
                    <option value="EUR">欧元 (EUR)</option>
                    <option value="USD">美元 (USD)</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>描述</label>
                <input
                  type="text"
                  value={newExpense.description}
                  onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
                  placeholder="支出描述..."
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>支出日期</label>
                  <input
                    type="date"
                    value={newExpense.expense_date}
                    onChange={(e) => setNewExpense({ ...newExpense, expense_date: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>支付方式</label>
                  <select
                    value={newExpense.payment_method}
                    onChange={(e) => setNewExpense({ ...newExpense, payment_method: e.target.value })}
                  >
                    <option value="现金">现金</option>
                    <option value="信用卡">信用卡</option>
                    <option value="借记卡">借记卡</option>
                    <option value="移动支付">移动支付</option>
                  </select>
                </div>
              </div>

              <div className="form-actions">
                <button type="button" onClick={() => {
                  setShowAddExpense(false);
                  setEditingExpense(null);
                  setNewExpense({
                    category_id: '',
                    city_id: '',
                    attraction_id: '',
                    amount: '',
                    currency: 'CNY',
                    description: '',
                    expense_date: '',
                    payment_method: '现金'
                  });
                }}>
                  取消
                </button>
                <button type="submit">{editingExpense ? '更新支出' : '添加支出'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BudgetPage;
