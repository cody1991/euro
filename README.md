# 欧洲旅游地图

## 项目介绍

这是一个欧洲旅游地图网站，展示从武汉出发的 20 天欧洲之旅的完整路线。网站以地图形式呈现城市、景点、交通路线等信息。

## 技术栈

- **前端**: React + TypeScript + Leaflet
- **后端**: Node.js + Express
- **数据库**: SQLite
- **地图**: OpenStreetMap + Leaflet

## 功能特性

- 🗺️ **交互式地图**: 使用 Leaflet 显示欧洲地图
- 📍 **城市标记**: 显示所有途经城市及其信息
- 🏛️ **景点展示**: 每个城市的主要景点位置和信息
- 🚄 **交通路线**: 可视化飞机、火车、汽车等交通方式
- 📱 **响应式设计**: 支持桌面和移动设备

## 行程概览

**2024 年欧洲 20 天之旅** (2024-02-09 至 2024-03-04)

- 🇨🇳 **中国**: 武汉
- 🇳🇱 **荷兰**: 阿姆斯特丹
- 🇫🇷 **法国**: 巴黎、尼斯、戛纳
- 🇲🇨 **摩纳哥**: 摩纳哥
- 🇮🇹 **意大利**: 米兰、佛罗伦萨、威尼斯、五渔村、比萨、那不勒斯、罗马
- 🇭🇺 **匈牙利**: 布达佩斯

## 本地开发

### 环境要求

- Node.js 16+
- npm 或 yarn

### 安装依赖

```bash
# 安装根目录依赖
npm install

# 安装客户端依赖
cd client && npm install
```

### 开发模式

```bash
# 同时启动前后端
npm run dev

# 或者单独运行
npm run server:local  # 后端
npm run client        # 前端
```

### 访问地址

- **前端**: http://localhost:3000
- **后端 API**: http://localhost:5001/api
- **健康检查**: http://localhost:5001/api/health

## 项目结构

```
euro/
├── client/                   # React 前端应用
│   ├── src/
│   │   ├── pages/           # 页面组件
│   │   │   └── MapPage.tsx  # 地图页面
│   │   ├── services/        # API 服务
│   │   └── types/           # TypeScript 类型
│   └── public/              # 静态资源
├── server/                  # Node.js 后端
│   ├── index-sqlite.js      # SQLite 服务器
│   └── travel_planner.db    # SQLite 数据库
├── package.json             # 根目录依赖
└── README.md                # 项目说明
```

## API 接口

### 获取行程详情

```
GET /api/itineraries/:id
```

返回完整的行程信息，包括：

- 行程基本信息
- 所有城市及其坐标
- 每个城市的景点列表
- 城市间的交通方式

## 数据说明

- **数据库**: SQLite 文件存储在 `server/travel_planner.db`
- **初始化**: 服务器启动时自动创建表并插入示例数据
- **数据内容**: 包含完整的 20 天欧洲行程数据，包括 15 个城市、35+ 景点、14 段交通

## 构建生产版本

```bash
# 构建前端
cd client && npm run build

# 启动后端
npm run server:local
```

## 许可证

MIT License
