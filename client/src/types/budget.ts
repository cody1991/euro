export interface Budget {
  id: number;
  itinerary_id: number;
  total_budget: number;
  spent_amount: number;
  remaining_amount: number;
  currency: string;
  created_at: string;
  updated_at: string;
}

export interface BudgetCategory {
  id: number;
  name: string;
  budget_amount: number;
  spent_amount: number;
  color: string;
  icon: string;
}

export interface Expense {
  id: number;
  budget_id: number;
  category_id: number;
  city_id?: number;
  attraction_id?: number;
  amount: number;
  currency: string;
  description: string;
  expense_date: string;
  payment_method: string;
  receipt_url?: string;
  created_at: string;
}

export interface BudgetAllocation {
  id: number;
  budget_id: number;
  category_id: number;
  allocated_amount: number;
  percentage: number;
}
