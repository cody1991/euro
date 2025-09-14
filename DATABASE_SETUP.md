# 数据库表结构设置

## 当前状态

目前 Supabase 中只有以下 4 个表：

- ✅ `itineraries` (行程表)
- ✅ `cities` (城市表)
- ✅ `attractions` (景点表)
- ✅ `transportation` (交通表)

## 需要创建的表

以下表需要手动在 Supabase Dashboard 中创建：

- ❌ `budgets` (预算表)
- ❌ `budget_categories` (预算分类表)
- ❌ `expenses` (支出表)
- ❌ `travel_notes` (旅行笔记表)
- ❌ `photos` (照片表)
- ❌ `checklists` (行前准备清单表)

## 创建步骤

### 1. 访问 Supabase Dashboard

1. 打开 [Supabase Dashboard](https://supabase.com/dashboard)
2. 选择你的项目
3. 进入 "SQL Editor"

### 2. 执行 SQL 语句

1. 点击 "New query"
2. 复制 `database/create-missing-tables.sql` 文件中的所有内容
3. 粘贴到 SQL Editor 中
4. 点击 "Run" 执行

### 3. 验证创建结果

1. 进入 "Table Editor"
2. 检查是否出现了新的表：
   - budgets
   - budget_categories
   - expenses
   - travel_notes
   - photos
   - checklists

## 表结构说明

### budgets (预算表)

- 管理每个行程的预算信息
- 包含总预算、已支出、剩余金额等

### budget_categories (预算分类表)

- 预算分类管理
- 如交通、住宿、餐饮等

### expenses (支出表)

- 记录具体的支出项目
- 关联预算分类和城市

### travel_notes (旅行笔记表)

- 记录旅行中的笔记和感想
- 支持照片和天气信息

### photos (照片表)

- 管理旅行照片
- 支持地理位置信息

### checklists (清单表)

- 行前准备清单
- 支持分类和优先级

## 测试数据

创建表后，可以运行以下命令插入测试数据：

```bash
npm run db:test-data
```

## 故障排除

如果遇到错误：

1. **权限问题**: 确保使用正确的 API 密钥
2. **表已存在**: 可以删除现有表后重新创建
3. **外键约束**: 确保引用的表已存在

## 下一步

表创建完成后，你就可以：

1. 使用预算管理功能
2. 添加旅行笔记
3. 上传和管理照片
4. 创建行前准备清单

所有功能都会自动连接到 Supabase 数据库！
