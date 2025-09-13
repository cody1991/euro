# 🚀 部署指南

## 完全免费的部署方案

### 1. Render (推荐) - 完全免费

1. **访问 [render.com](https://render.com)**
2. **用 GitHub 账号登录**
3. **点击"New" → "Web Service"**
4. **连接你的仓库**
5. **设置配置**：
   - Build Command: `npm install && cd client && npm install && npm run build`
   - Start Command: `npm start`
   - Environment: `Node`
   - Plan: `Free`
6. **点击"Create Web Service"**
7. **获得链接**: `https://your-app.onrender.com`

**优点：**

- ✅ 完全免费，无时间限制
- ✅ 完美支持 SQLite 数据库
- ✅ 自动部署
- ✅ 免费额度：750 小时/月

### 2. Heroku (经典免费)

1. **访问 [heroku.com](https://heroku.com)**
2. **创建新应用**
3. **连接 GitHub 仓库**
4. **启用自动部署**
5. **获得链接**: `https://your-app.herokuapp.com`

**优点：**

- ✅ 完全免费
- ✅ 支持 SQLite
- ✅ 稳定可靠
- ⚠️ 免费计划：应用会休眠

### 3. Vercel (免费但有限制)

1. **访问 [vercel.com](https://vercel.com)**
2. **用 GitHub 账号登录**
3. **导入你的仓库**
4. **自动检测配置**：
   - Framework Preset: `Create React App`
   - Root Directory: `client`
   - Build Command: `npm run build`
   - Output Directory: `build`
5. **点击 Deploy**
6. **获得链接**: `https://your-app.vercel.app`

**优点：**

- ✅ 完全免费
- ✅ 自动部署
- ⚠️ 对 SQLite 支持有限

### 4. Netlify (免费)

1. **访问 [netlify.com](https://netlify.com)**
2. **连接 GitHub 仓库**
3. **设置构建配置**：
   - Build command: `cd client && npm run build`
   - Publish directory: `client/build`
4. **点击 Deploy**
5. **获得链接**: `https://your-app.netlify.app`

**优点：**

- ✅ 完全免费
- ✅ 自动部署
- ⚠️ 主要用于静态网站

## 本地测试部署

```bash
# 构建生产版本
npm run build

# 启动生产服务器
npm start
```

## 环境变量

如果需要，可以在部署平台设置环境变量：

- `REACT_APP_API_URL`: API 基础 URL (默认: `http://localhost:5001/api`)

## 注意事项

- ✅ 确保数据库文件 `travel_planner.db` 已包含在仓库中
- ✅ 所有页面都使用相同的数据源，确保一致性
- ✅ 部署后可以通过总结页面查看完整行程
- ✅ SQLite 数据库会持久化存储

## 故障排除

如果部署失败，检查：

1. Node.js 版本 (推荐 18+)
2. 依赖是否正确安装
3. 构建命令是否正确
4. 输出目录是否正确设置
5. 数据库文件是否在仓库中

## 推荐部署顺序

1. **Render** - 完全免费，支持 SQLite
2. **Heroku** - 经典选择，稳定
3. **Vercel** - 免费但有限制
4. **Netlify** - 免费但主要用于静态网站

## 免费额度对比

| 平台    | 免费额度    | SQLite 支持 | 自动部署 | 推荐度     |
| ------- | ----------- | ----------- | -------- | ---------- |
| Render  | 750 小时/月 | ✅ 完美     | ✅       | ⭐⭐⭐⭐⭐ |
| Heroku  | 550 小时/月 | ✅ 完美     | ✅       | ⭐⭐⭐⭐   |
| Vercel  | 无限制      | ⚠️ 有限     | ✅       | ⭐⭐⭐     |
| Netlify | 无限制      | ⚠️ 有限     | ✅       | ⭐⭐       |
