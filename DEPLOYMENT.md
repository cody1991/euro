# 部署说明

## Vercel 部署

### 1. 环境变量配置

在 Vercel 项目设置中添加以下环境变量：

```
SUPABASE_URL=你的Supabase项目URL
SUPABASE_ANON_KEY=你的Supabase匿名密钥
```

### 2. 获取 Supabase 配置

1. 访问 [Supabase Dashboard](https://supabase.com/dashboard)
2. 选择你的项目
3. 进入 Settings > API
4. 复制以下信息：
   - Project URL (SUPABASE_URL)
   - anon public key (SUPABASE_ANON_KEY)

### 3. 在 Vercel 中设置环境变量

1. 登录 [Vercel Dashboard](https://vercel.com/dashboard)
2. 选择你的项目
3. 进入 Settings > Environment Variables
4. 添加以下变量：
   - `SUPABASE_URL` = 你的 Supabase 项目 URL
   - `SUPABASE_ANON_KEY` = 你的 Supabase 匿名密钥

### 4. 重新部署

设置环境变量后，重新触发部署：

- 在 Vercel Dashboard 中点击 "Redeploy"
- 或者推送新的代码到 GitHub

## 本地开发

### 1. 安装依赖

```bash
npm run install-all
```

### 2. 启动开发服务器

```bash
# 使用 Supabase 后端
npm run dev:supabase

# 或使用本地 SQLite 后端
npm run dev
```

### 3. 访问应用

- 前端: http://localhost:3000
- 后端 API: http://localhost:5001

## 功能说明

### 已实现功能

1. **行程管理** - 查看和管理旅游行程
2. **地图视图** - 在地图上查看行程路线
3. **预算管理** - 管理旅行预算和支出记录
4. **天气预报** - 查看各城市天气情况
5. **旅行贴士** - 签证、货币、语言等实用信息

### 天气 API 配置

要使用真实天气数据，需要：

1. 注册 [OpenWeatherMap](https://openweathermap.org/api)
2. 获取免费 API 密钥
3. 在 `client/src/services/weatherAPI.ts` 中替换 `your_api_key_here`

### 数据库

项目支持两种数据库：

- **Supabase** (生产环境推荐)
- **SQLite** (本地开发)

## 故障排除

### 部署失败

1. 检查环境变量是否正确设置
2. 确保 Supabase 项目可访问
3. 查看 Vercel 构建日志

### 天气数据不显示

1. 检查 OpenWeatherMap API 密钥
2. 确认网络连接正常
3. 查看浏览器控制台错误

### 预算功能异常

1. 检查数据库连接
2. 确认 Supabase 表结构正确
3. 查看服务器日志
