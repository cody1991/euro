# 数据库管理指南

## 概述
本项目使用 Supabase 作为云端数据库，支持多种数据变更方式。

## 数据变更方法

### 1. 通过API端点（推荐）

#### 获取数据统计
```bash
curl https://euro-lilac.vercel.app/api/data-stats
```

#### 添加新城市
```bash
curl -X POST https://euro-lilac.vercel.app/api/cities \
  -H "Content-Type: application/json" \
  -d '{
    "name": "新城市",
    "country": "国家",
    "latitude": 48.8566,
    "longitude": 2.3522,
    "visit_date": "2024-06-15",
    "itinerary_id": 1
  }'
```

#### 添加新景点
```bash
curl -X POST https://euro-lilac.vercel.app/api/attractions \
  -H "Content-Type: application/json" \
  -d '{
    "name": "新景点",
    "description": "景点描述",
    "latitude": 48.8566,
    "longitude": 2.3522,
    "visit_date": "2024-06-15",
    "visit_time": "10:00",
    "category": "博物馆",
    "rating": 4.5,
    "city_id": 1
  }'
```

#### 添加新交通
```bash
curl -X POST https://euro-lilac.vercel.app/api/transportation \
  -H "Content-Type: application/json" \
  -d '{
    "type": "飞机",
    "from_city_id": 1,
    "to_city_id": 2,
    "departure_time": "2024-06-15 14:00",
    "arrival_time": "2024-06-15 16:00",
    "cost": 150,
    "booking_reference": "ABC123"
  }'
```

#### 批量更新数据
```bash
curl -X POST https://euro-lilac.vercel.app/api/batch-update \
  -H "Content-Type: application/json" \
  -d '{
    "operations": [
      {
        "type": "add_city",
        "data": {
          "name": "城市1",
          "country": "国家1",
          "latitude": 48.8566,
          "longitude": 2.3522,
          "visit_date": "2024-06-15",
          "itinerary_id": 1
        }
      },
      {
        "type": "add_attraction",
        "data": {
          "name": "景点1",
          "description": "描述",
          "latitude": 48.8566,
          "longitude": 2.3522,
          "visit_date": "2024-06-15",
          "visit_time": "10:00",
          "category": "博物馆",
          "rating": 4.5,
          "city_id": 1
        }
      }
    ]
  }'
```

### 2. 通过Supabase Dashboard

1. 访问 [Supabase Dashboard](https://supabase.com/dashboard)
2. 选择你的项目
3. 进入 "Table Editor"
4. 直接编辑数据

### 3. 重新初始化数据库（谨慎使用）

```bash
curl -X POST https://euro-lilac.vercel.app/api/reinitialize
```

⚠️ **警告**: 这会删除所有现有数据并重新插入初始数据！

## 数据变更最佳实践

### 1. 添加新数据
- 使用API端点，系统会自动检查重复
- 先测试在本地环境
- 小批量添加，避免一次性大量数据

### 2. 修改现有数据
- 优先使用Supabase Dashboard进行小量修改
- 大量修改使用批量更新API
- 修改前先备份重要数据

### 3. 数据结构变更
- 在Supabase Dashboard中添加新字段
- 更新代码中的类型定义
- 测试所有相关功能

## 常见问题

### Q: 如何添加新的行程？
A: 目前系统设计为单行程，如需多行程，需要修改数据库结构和代码。

### Q: 如何修改景点信息？
A: 使用现有的PUT API端点：
```bash
curl -X PUT https://euro-lilac.vercel.app/api/attractions/1 \
  -H "Content-Type: application/json" \
  -d '{"name": "新名称", "rating": 5.0}'
```

### Q: 如何删除数据？
A: 使用现有的DELETE API端点：
```bash
curl -X DELETE https://euro-lilac.vercel.app/api/attractions/1
```

### Q: 数据变更后多久生效？
A: 通过API变更立即生效，通过Dashboard变更也立即生效。

## 监控和维护

### 1. 数据统计
定期检查数据统计：
```bash
curl https://euro-lilac.vercel.app/api/data-stats
```

### 2. 数据备份
- Supabase自动备份
- 重要变更前手动导出数据

### 3. 性能监控
- 监控API响应时间
- 检查数据库连接状态

## 环境变量

确保以下环境变量正确设置：
- `SUPABASE_URL`: Supabase项目URL
- `SUPABASE_ANON_KEY`: Supabase匿名密钥

## 联系支持

如遇到问题，请检查：
1. Supabase项目状态
2. 环境变量配置
3. API端点响应
4. 浏览器控制台错误
