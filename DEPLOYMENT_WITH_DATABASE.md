# 🚀 带数据库的部署方案

## 推荐方案：Render + PostgreSQL

### 为什么选择 PostgreSQL？

- ✅ **数据持久化**：重新部署不会丢失数据
- ✅ **完全免费**：Render 提供免费 PostgreSQL
- ✅ **在线修改**：数据修改会永久保存
- ✅ **自动备份**：Render 自动备份数据
- ✅ **扩展性强**：支持复杂查询

### 部署步骤

#### 1. 在 Render 创建 PostgreSQL 数据库

1. 访问 [render.com](https://render.com)
2. 点击 **"New +"** → **"PostgreSQL"**
3. 设置数据库名称：`europe-travel-db`
4. 选择 **"Free"** 计划
5. 点击 **"Create Database"**
6. 复制 **"External Database URL"**

#### 2. 创建 Web 服务

1. 点击 **"New +"** → **"Web Service"**
2. 连接你的 GitHub 仓库
3. 设置配置：
   - **Build Command**: `npm install && cd client && npm install && npm run build`
   - **Start Command**: `npm start`
   - **Environment**: `Node`

#### 3. 设置环境变量

在 Web 服务的 **"Environment"** 部分添加：

```
NODE_ENV=production
PORT=10000
DATABASE_URL=postgresql://username:password@host:port/database
```

#### 4. 部署

点击 **"Create Web Service"** 开始部署

### 其他免费数据库方案

#### 方案 2：MongoDB Atlas

1. 访问 [mongodb.com/atlas](https://www.mongodb.com/atlas)
2. 创建免费集群
3. 获取连接字符串
4. 设置环境变量：`MONGODB_URI=your-connection-string`

#### 方案 3：PlanetScale (MySQL)

1. 访问 [planetscale.com](https://planetscale.com)
2. 创建免费数据库
3. 获取连接字符串
4. 设置环境变量：
   ```
   DB_HOST=your-host
   DB_USER=your-username
   DB_PASSWORD=your-password
   DB_NAME=your-database
   ```

## 数据库对比

| 方案                    | 免费额度 | 数据持久化 | 易用性     | 推荐度     |
| ----------------------- | -------- | ---------- | ---------- | ---------- |
| **PostgreSQL (Render)** | 1GB      | ✅ 永久    | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **MongoDB Atlas**       | 512MB    | ✅ 永久    | ⭐⭐⭐⭐   | ⭐⭐⭐⭐   |
| **PlanetScale**         | 1GB      | ✅ 永久    | ⭐⭐⭐     | ⭐⭐⭐     |
| **SQLite**              | 无限制   | ❌ 临时    | ⭐⭐⭐⭐⭐ | ⭐⭐       |

## 推荐流程

1. **选择 PostgreSQL + Render** (最佳方案)
2. **创建数据库服务**
3. **创建 Web 服务**
4. **设置环境变量**
5. **部署完成**

## 优势

- ✅ 数据永久保存
- ✅ 支持在线修改
- ✅ 自动备份
- ✅ 完全免费
- ✅ 扩展性强

这样你的应用就真正可以投入生产使用了！
