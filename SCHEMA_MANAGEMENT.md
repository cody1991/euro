# 表结构管理指南

## 概述
本指南详细说明如何安全地修改数据库表结构，包括添加字段、创建新表、添加约束等操作。

## 重要说明

⚠️ **Supabase REST API 限制**: Supabase的REST API不支持DDL（数据定义语言）操作，如 `ALTER TABLE`、`CREATE TABLE` 等。这些操作必须在 Supabase Dashboard 的 SQL Editor 中执行。

## 表结构修改流程

### 1. 检查当前表结构

#### 通过API检查
```bash
# 获取所有表
curl https://euro-lilac.vercel.app/api/schema/tables

# 获取特定表结构
curl https://euro-lilac.vercel.app/api/schema/table/cities

# 验证表结构
curl https://euro-lilac.vercel.app/api/schema/validate
```

#### 通过Supabase Dashboard
1. 访问 [Supabase Dashboard](https://supabase.com/dashboard)
2. 选择你的项目
3. 进入 "Table Editor" 或 "SQL Editor"

### 2. 常见的表结构修改

#### A. 添加新字段

**示例：为城市表添加时区字段**
```sql
-- 在 Supabase Dashboard 的 SQL Editor 中执行
ALTER TABLE cities ADD COLUMN timezone VARCHAR(50);
```

**通过API生成SQL**
```bash
curl -X POST https://euro-lilac.vercel.app/api/schema/add-column \
  -H "Content-Type: application/json" \
  -d '{
    "tableName": "cities",
    "columnName": "timezone",
    "dataType": "VARCHAR(50)",
    "options": {
      "nullable": true,
      "default": null
    }
  }'
```

**示例：为景点表添加价格字段**
```sql
ALTER TABLE attractions ADD COLUMN price DECIMAL(10,2);
ALTER TABLE attractions ADD COLUMN currency VARCHAR(3) DEFAULT 'EUR';
```

**示例：为交通表添加座位号字段**
```sql
ALTER TABLE transportation ADD COLUMN seat_number VARCHAR(10);
ALTER TABLE transportation ADD COLUMN gate VARCHAR(10);
```

#### B. 创建新表

**示例：创建评论表**
```sql
CREATE TABLE reviews (
  id SERIAL PRIMARY KEY,
  attraction_id INTEGER REFERENCES attractions(id) ON DELETE CASCADE,
  user_name VARCHAR(100) NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

**通过API生成SQL**
```bash
curl -X POST https://euro-lilac.vercel.app/api/schema/create-table \
  -H "Content-Type: application/json" \
  -d '{
    "tableName": "reviews",
    "columns": [
      { "name": "id", "type": "SERIAL", "primaryKey": true },
      { "name": "attraction_id", "type": "INTEGER" },
      { "name": "user_name", "type": "VARCHAR(100)", "nullable": false },
      { "name": "rating", "type": "INTEGER" },
      { "name": "comment", "type": "TEXT" },
      { "name": "created_at", "type": "TIMESTAMP", "default": "NOW()" }
    ]
  }'
```

**示例：创建用户表**
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  last_login TIMESTAMP
);
```

#### C. 添加索引

**示例：为常用查询字段添加索引**
```sql
-- 为城市表添加索引
CREATE INDEX idx_cities_country ON cities(country);
CREATE INDEX idx_cities_visit_date ON cities(visit_date);

-- 为景点表添加索引
CREATE INDEX idx_attractions_category ON attractions(category);
CREATE INDEX idx_attractions_rating ON attractions(rating);
CREATE INDEX idx_attractions_city_id ON attractions(city_id);

-- 为交通表添加索引
CREATE INDEX idx_transportation_type ON transportation(type);
CREATE INDEX idx_transportation_departure_time ON transportation(departure_time);
```

**通过API生成SQL**
```bash
curl -X POST https://euro-lilac.vercel.app/api/schema/add-index \
  -H "Content-Type: application/json" \
  -d '{
    "tableName": "cities",
    "columnName": "country",
    "indexName": "idx_cities_country"
  }'
```

#### D. 添加外键约束

**示例：为评论表添加外键约束**
```sql
ALTER TABLE reviews ADD CONSTRAINT fk_reviews_attraction 
  FOREIGN KEY (attraction_id) REFERENCES attractions(id) ON DELETE CASCADE;
```

**通过API生成SQL**
```bash
curl -X POST https://euro-lilac.vercel.app/api/schema/add-foreign-key \
  -H "Content-Type: application/json" \
  -d '{
    "tableName": "reviews",
    "columnName": "attraction_id",
    "referencedTable": "attractions",
    "referencedColumn": "id"
  }'
```

### 3. 高级表结构修改

#### A. 修改字段类型
```sql
-- 修改评分字段为更精确的数值
ALTER TABLE attractions ALTER COLUMN rating TYPE DECIMAL(3,2);

-- 修改日期字段
ALTER TABLE cities ALTER COLUMN visit_date TYPE DATE;
```

#### B. 添加检查约束
```sql
-- 为评分添加范围检查
ALTER TABLE attractions ADD CONSTRAINT chk_rating_range 
  CHECK (rating >= 0 AND rating <= 5);

-- 为价格添加正数检查
ALTER TABLE attractions ADD CONSTRAINT chk_price_positive 
  CHECK (price >= 0);
```

#### C. 添加唯一约束
```sql
-- 为城市名称添加唯一约束（在同一行程内）
ALTER TABLE cities ADD CONSTRAINT uk_city_name_itinerary 
  UNIQUE (name, itinerary_id);
```

### 4. 数据迁移

#### A. 为现有数据添加默认值
```sql
-- 为现有记录添加默认值
UPDATE cities SET timezone = 'Europe/Paris' WHERE timezone IS NULL;
UPDATE attractions SET currency = 'EUR' WHERE currency IS NULL;
```

#### B. 数据转换
```sql
-- 将字符串评分转换为数值
UPDATE attractions SET rating = CAST(rating AS DECIMAL(3,2)) 
WHERE rating ~ '^[0-9]+\.?[0-9]*$';
```

### 5. 表结构修改的最佳实践

#### A. 修改前准备
1. **备份数据**: 在Supabase Dashboard中导出重要数据
2. **测试环境**: 先在测试环境中验证修改
3. **检查依赖**: 确认没有其他表或应用依赖要修改的字段

#### B. 修改步骤
1. **生成SQL**: 使用API生成SQL语句
2. **审查SQL**: 仔细检查生成的SQL语句
3. **执行SQL**: 在Supabase Dashboard的SQL Editor中执行
4. **验证结果**: 使用API验证修改结果
5. **更新代码**: 更新应用代码以支持新字段

#### C. 修改后验证
```bash
# 验证表结构
curl https://euro-lilac.vercel.app/api/schema/validate

# 检查数据完整性
curl https://euro-lilac.vercel.app/api/data-stats
```

### 6. 常见问题和解决方案

#### Q: 如何安全地删除字段？
A: 分步骤进行：
1. 先备份数据
2. 在应用中停止使用该字段
3. 确认没有数据依赖
4. 执行 `ALTER TABLE table_name DROP COLUMN column_name;`

#### Q: 如何重命名字段？
A: 使用 `ALTER TABLE` 语句：
```sql
ALTER TABLE table_name RENAME COLUMN old_name TO new_name;
```

#### Q: 如何修改字段约束？
A: 先删除旧约束，再添加新约束：
```sql
-- 删除旧约束
ALTER TABLE table_name DROP CONSTRAINT old_constraint_name;
-- 添加新约束
ALTER TABLE table_name ADD CONSTRAINT new_constraint_name CHECK (condition);
```

### 7. 监控和维护

#### A. 定期检查表结构
```bash
# 每周检查表结构
curl https://euro-lilac.vercel.app/api/schema/validate
```

#### B. 性能监控
- 监控查询性能
- 检查索引使用情况
- 优化慢查询

#### C. 数据完整性检查
```bash
# 检查数据统计
curl https://euro-lilac.vercel.app/api/data-stats
```

## 总结

表结构修改需要谨慎操作，建议：

1. **使用API生成SQL**: 减少手动错误
2. **在Supabase Dashboard执行**: 确保操作安全
3. **分步骤进行**: 避免一次性大量修改
4. **充分测试**: 在测试环境验证
5. **备份数据**: 重要修改前先备份
6. **更新代码**: 及时更新应用代码

通过遵循这些最佳实践，可以安全、高效地管理数据库表结构。
