# 欧洲旅游规划网站

## 项目介绍

这是一个欧洲旅游规划网站，帮助用户规划从武汉出发的 20 天欧洲之旅。网站包含完整的前后端，提供地图显示、景点推荐、交通规划等功能。

## 技术栈

- **前端**: React + TypeScript + Leaflet
- **后端**: Node.js + Express
- **数据库**: 
  - **本地开发**: SQLite (方便调试)
  - **生产环境**: Supabase (PostgreSQL)
- **部署**: Vercel
- **开发工具**: 热更新、并发运行

## 功能特性

- 🗺️ **世界地图显示**: 使用 Leaflet 显示欧洲地图
- 🏛️ **景点推荐**: 每个城市精选 3-5 个必游景点
- 🚄 **交通规划**: 飞机、火车、汽车等交通方式
- ✏️ **行程编辑**: 可编辑景点信息和行程安排
- 📱 **响应式设计**: 支持桌面和移动设备

## 行程概览

**2024 年欧洲 20 天之旅** (2024-02-09 至 2024-03-04)

- 🇳🇱 **荷兰**: 阿姆斯特丹 (梵高博物馆、安妮之家、运河区)
- 🇫🇷 **法国**: 巴黎 (埃菲尔铁塔、卢浮宫、圣母院)
- 🇫🇷 **南法**: 尼斯、戛纳、摩纳哥 (天使湾、戛纳电影节宫、蒙特卡洛赌场)
- 🇮🇹 **意大利**: 米兰、佛罗伦萨、威尼斯、五渔村、比萨、那不勒斯、罗马
- 🇭🇺 **匈牙利**: 布达佩斯 (布达城堡、国会大厦、温泉浴场)

## 在线访问

- **生产环境**: https://euro-lilac.vercel.app
- **地图页面**: https://euro-lilac.vercel.app/map
- **行程详情**: https://euro-lilac.vercel.app/itinerary/1
- **行程总结**: https://euro-lilac.vercel.app/summary

## 本地开发

### 环境要求

- Node.js 16+
- npm 或 yarn
- Supabase 账号（用于数据库）

### 环境变量设置

**本地开发（SQLite）**：无需环境变量，直接使用SQLite数据库

**生产环境（Supabase）**：在项目根目录创建 `.env` 文件：

```bash
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 安装依赖

```bash
# 安装根目录和客户端依赖
npm run install-all
```

### 开发模式

```bash
# 本地开发（SQLite）- 推荐
npm run dev

# 使用Supabase开发
npm run dev:supabase
```

### 单独运行

```bash
# 本地SQLite后端
npm run server:local

# Supabase后端
npm run server:supabase

# 前端
npm run client
```

### 构建生产版本

```bash
npm run build
```

## 本地访问地址

- **前端**: http://localhost:3000
- **后端 API**: http://localhost:5001/api
- **地图页面**: http://localhost:3000/map
- **行程详情**: http://localhost:3000/itinerary/1
- **健康检查**: http://localhost:5001/api/health

## 项目结构

```
europe-travel-planner/
├── client/                    # React 前端应用
│   ├── src/
│   │   ├── components/        # 组件
│   │   ├── pages/            # 页面
│   │   ├── services/         # API 服务
│   │   └── types/            # TypeScript 类型
│   └── public/               # 静态资源
├── server/                   # Node.js 后端
│   ├── index-sqlite.js       # 本地SQLite服务器
│   ├── index-supabase-rest.js # 生产Supabase服务器
│   ├── data-manager.js       # 数据管理工具
│   └── schema-manager.js     # 表结构管理工具
├── vercel.json              # Vercel 部署配置
├── package.json             # 根目录依赖
├── DATABASE_MANAGEMENT.md   # 数据库管理指南
├── SCHEMA_MANAGEMENT.md     # 表结构管理指南
└── README.md                # 项目说明
```

## API 接口

### 基础接口
- `GET /api/itineraries` - 获取所有行程
- `GET /api/itineraries/:id` - 获取特定行程
- `GET /api/cities` - 获取城市列表
- `GET /api/attractions` - 获取景点列表
- `GET /api/transportation` - 获取交通信息

### 数据管理接口
- `GET /api/data-stats` - 获取数据统计
- `POST /api/cities` - 添加新城市
- `POST /api/attractions` - 添加新景点
- `POST /api/transportation` - 添加新交通
- `POST /api/batch-update` - 批量更新数据

### 表结构管理接口
- `GET /api/schema/tables` - 获取所有表信息
- `GET /api/schema/table/:tableName` - 获取表结构
- `GET /api/schema/validate` - 验证表结构
- `POST /api/schema/add-column` - 添加新字段
- `POST /api/schema/create-table` - 创建新表

## 开发说明

- 使用 `concurrently` 同时运行前后端
- 前端支持热更新，修改代码自动刷新
- 后端使用 `nodemon` 自动重启
- **本地开发**: SQLite 数据库，无需配置
- **生产环境**: Supabase (PostgreSQL)，云端存储

## 数据说明

- **本地开发**: SQLite 数据库文件 (`server/travel_planner.db`)
- **生产环境**: Supabase (PostgreSQL)
- 数据初始化：服务器启动时自动初始化
- 包含完整的 20 天行程数据
- 支持景点、交通、城市信息管理
- 支持数据变更和表结构修改

## 开发优势

### 本地开发 (SQLite)
- ✅ **无需配置**: 直接运行，无需环境变量
- ✅ **快速调试**: 数据修改立即生效
- ✅ **离线开发**: 无需网络连接
- ✅ **数据安全**: 本地存储，不会影响生产数据

### 生产环境 (Supabase)
- ✅ **数据持久化**: 重新部署不会丢失数据
- ✅ **云端访问**: 支持多设备访问
- ✅ **自动备份**: Supabase 自动备份数据
- ✅ **扩展性**: 支持大量数据和并发访问

## 部署说明

- **平台**: Vercel
- **数据库**: Supabase
- **自动部署**: 推送到 GitHub 主分支自动部署
- **环境变量**: 在 Vercel 控制台设置 Supabase 相关变量

## 许可证

MIT License
