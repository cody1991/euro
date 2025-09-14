# 配置说明

## 环境变量配置

创建 `.env` 文件在项目根目录：

```bash
# Supabase 配置
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here

# 可选：天气API配置
OPENWEATHER_API_KEY=your-openweather-api-key

# 开发环境配置
NODE_ENV=development
PORT=5001
```

## 获取 Supabase 配置

1. 访问 [Supabase Dashboard](https://supabase.com/dashboard)
2. 选择你的项目
3. 进入 Settings > API
4. 复制以下信息：
   - Project URL → `SUPABASE_URL`
   - anon public key → `SUPABASE_ANON_KEY`

## 数据库管理

### 1. 使用 Supabase Dashboard（推荐）

- 访问你的 Supabase 项目
- 进入 "Table Editor" 查看和编辑数据
- 进入 "SQL Editor" 执行 SQL 语句

### 2. 使用命令行工具

```bash
# 安装依赖
npm install

# 查看所有表
node database/db-manager.js list

# 查看表结构
node database/db-manager.js describe cities

# 添加列
node database/db-manager.js add-column cities new_field VARCHAR(100)

# 删除列
node database/db-manager.js drop-column cities old_field

# 插入测试数据
node database/db-manager.js test-data
```

### 3. 执行 SQL 文件

在 Supabase SQL Editor 中执行 `database/schema.sql` 来创建完整的数据库结构。

## 开发工作流

### 1. 数据库结构变更

1. 在 Supabase Dashboard 的 SQL Editor 中执行 SQL
2. 或者使用命令行工具进行修改
3. 更新应用代码以匹配新的结构

### 2. 数据迁移

如果需要迁移数据，可以：

1. 导出现有数据
2. 修改表结构
3. 重新导入数据

### 3. 备份

Supabase 自动备份，但建议定期导出重要数据。

## 常见操作

### 添加新表

```sql
CREATE TABLE new_table (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 添加新列

```sql
ALTER TABLE existing_table ADD COLUMN new_column VARCHAR(100);
```

### 修改列类型

```sql
ALTER TABLE existing_table ALTER COLUMN existing_column TYPE VARCHAR(200);
```

### 添加索引

```sql
CREATE INDEX idx_table_column ON table_name(column_name);
```

### 删除表

```sql
DROP TABLE table_name CASCADE;
```
