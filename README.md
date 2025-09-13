# 欧洲旅游规划网站

## 项目介绍

这是一个欧洲旅游规划网站，帮助用户规划从武汉出发的 20 天欧洲之旅。网站包含完整的前后端，提供地图显示、景点推荐、交通规划等功能。

## 技术栈

- **前端**: React + TypeScript + Leaflet
- **后端**: Node.js + Express
- **数据库**: SQLite
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

## 安装和运行

### 环境要求

- Node.js 16+
- npm 或 yarn

### 安装依赖

```bash
# 安装根目录和客户端依赖
npm run install-all
```

### 开发模式

```bash
# 同时启动前端和后端
npm run dev
```

### 单独运行

```bash
# 只启动后端
npm run server

# 只启动前端
npm run client
```

### 构建生产版本

```bash
npm run build
```

## 访问地址

- **前端**: http://localhost:3000
- **后端 API**: http://localhost:5001/api
- **地图页面**: http://localhost:3000/map
- **行程详情**: http://localhost:3000/itinerary/4

## 项目结构

```
europe-travel-planner/
├── client/                 # React 前端应用
│   ├── src/
│   │   ├── components/     # 组件
│   │   ├── pages/         # 页面
│   │   ├── services/      # API 服务
│   │   └── types/         # TypeScript 类型
│   └── public/            # 静态资源
├── server/                # Node.js 后端
│   ├── index.js          # 服务器入口
│   ├── initData.js       # 数据库初始化
│   └── travel.db         # SQLite 数据库
├── package.json          # 根目录依赖
└── README.md             # 项目说明
```

## API 接口

- `GET /api/itineraries` - 获取所有行程
- `GET /api/itineraries/:id` - 获取特定行程
- `GET /api/cities` - 获取城市列表
- `GET /api/attractions` - 获取景点列表
- `GET /api/transportation` - 获取交通信息

## 开发说明

- 使用 `concurrently` 同时运行前后端
- 前端支持热更新，修改代码自动刷新
- 后端使用 `nodemon` 自动重启
- 数据库使用 SQLite，无需额外安装

## 数据说明

- 数据库文件：`server/travel.db`
- 初始化脚本：`server/initData.js`
- 包含完整的 20 天行程数据
- 支持景点、交通、城市信息管理

## 许可证

MIT License
