-- 欧洲旅游规划数据库结构
-- 在 Supabase SQL Editor 中执行这些语句

-- 1. 行程表
CREATE TABLE IF NOT EXISTS itineraries (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. 城市表
CREATE TABLE IF NOT EXISTS cities (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  country VARCHAR(100) NOT NULL,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  arrival_date DATE NOT NULL,
  departure_date DATE NOT NULL,
  itinerary_id INTEGER REFERENCES itineraries(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. 景点表
CREATE TABLE IF NOT EXISTS attractions (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  city_id INTEGER REFERENCES cities(id) ON DELETE CASCADE,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  visit_date DATE NOT NULL,
  visit_time TIME,
  category VARCHAR(50),
  rating DECIMAL(2, 1) DEFAULT 5.0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. 交通表
CREATE TABLE IF NOT EXISTS transportation (
  id SERIAL PRIMARY KEY,
  from_city_id INTEGER REFERENCES cities(id) ON DELETE CASCADE,
  to_city_id INTEGER REFERENCES cities(id) ON DELETE CASCADE,
  transport_type VARCHAR(50) NOT NULL,
  departure_time TIME NOT NULL,
  arrival_time TIME NOT NULL,
  duration VARCHAR(50),
  cost DECIMAL(10, 2),
  booking_reference VARCHAR(100),
  itinerary_id INTEGER REFERENCES itineraries(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. 预算表
CREATE TABLE IF NOT EXISTS budgets (
  id SERIAL PRIMARY KEY,
  itinerary_id INTEGER REFERENCES itineraries(id) ON DELETE CASCADE,
  total_budget DECIMAL(12, 2) NOT NULL DEFAULT 0,
  spent_amount DECIMAL(12, 2) NOT NULL DEFAULT 0,
  remaining_amount DECIMAL(12, 2) NOT NULL DEFAULT 0,
  currency VARCHAR(10) NOT NULL DEFAULT 'CNY',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. 预算分类表
CREATE TABLE IF NOT EXISTS budget_categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  budget_amount DECIMAL(12, 2) NOT NULL DEFAULT 0,
  spent_amount DECIMAL(12, 2) NOT NULL DEFAULT 0,
  color VARCHAR(7) NOT NULL DEFAULT '#3498db',
  icon VARCHAR(10) NOT NULL DEFAULT '💼',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. 支出记录表
CREATE TABLE IF NOT EXISTS expenses (
  id SERIAL PRIMARY KEY,
  budget_id INTEGER REFERENCES budgets(id) ON DELETE CASCADE,
  category_id INTEGER REFERENCES budget_categories(id) ON DELETE CASCADE,
  city_id INTEGER REFERENCES cities(id) ON DELETE SET NULL,
  attraction_id INTEGER REFERENCES attractions(id) ON DELETE SET NULL,
  amount DECIMAL(12, 2) NOT NULL,
  currency VARCHAR(10) NOT NULL DEFAULT 'CNY',
  description TEXT NOT NULL,
  expense_date DATE NOT NULL,
  payment_method VARCHAR(50) NOT NULL DEFAULT '现金',
  receipt_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. 旅行笔记表
CREATE TABLE IF NOT EXISTS travel_notes (
  id SERIAL PRIMARY KEY,
  itinerary_id INTEGER REFERENCES itineraries(id) ON DELETE CASCADE,
  city_id INTEGER REFERENCES cities(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  note_date DATE NOT NULL,
  weather VARCHAR(100),
  mood VARCHAR(50),
  photos TEXT[], -- 存储照片URL数组
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. 照片表
CREATE TABLE IF NOT EXISTS photos (
  id SERIAL PRIMARY KEY,
  itinerary_id INTEGER REFERENCES itineraries(id) ON DELETE CASCADE,
  city_id INTEGER REFERENCES cities(id) ON DELETE CASCADE,
  attraction_id INTEGER REFERENCES attractions(id) ON DELETE SET NULL,
  filename VARCHAR(255) NOT NULL,
  url TEXT NOT NULL,
  caption TEXT,
  taken_date DATE NOT NULL,
  taken_time TIME,
  location_lat DECIMAL(10, 8),
  location_lng DECIMAL(11, 8),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 10. 行前准备清单表
CREATE TABLE IF NOT EXISTS checklists (
  id SERIAL PRIMARY KEY,
  itinerary_id INTEGER REFERENCES itineraries(id) ON DELETE CASCADE,
  category VARCHAR(100) NOT NULL,
  item VARCHAR(255) NOT NULL,
  is_checked BOOLEAN DEFAULT FALSE,
  priority INTEGER DEFAULT 1, -- 1=高, 2=中, 3=低
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建索引以提高查询性能
CREATE INDEX IF NOT EXISTS idx_cities_itinerary_id ON cities(itinerary_id);
CREATE INDEX IF NOT EXISTS idx_attractions_city_id ON attractions(city_id);
CREATE INDEX IF NOT EXISTS idx_transportation_itinerary_id ON transportation(itinerary_id);
CREATE INDEX IF NOT EXISTS idx_expenses_budget_id ON expenses(budget_id);
CREATE INDEX IF NOT EXISTS idx_expenses_category_id ON expenses(category_id);
CREATE INDEX IF NOT EXISTS idx_travel_notes_itinerary_id ON travel_notes(itinerary_id);
CREATE INDEX IF NOT EXISTS idx_photos_itinerary_id ON photos(itinerary_id);

-- 创建更新时间触发器
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 为需要更新时间的表添加触发器
CREATE TRIGGER update_itineraries_updated_at BEFORE UPDATE ON itineraries FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_budgets_updated_at BEFORE UPDATE ON budgets FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_travel_notes_updated_at BEFORE UPDATE ON travel_notes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
