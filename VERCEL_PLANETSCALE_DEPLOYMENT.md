# 🚀 Vercel + PlanetScale 永久免费部署

## 为什么选择这个方案？

- ✅ **Vercel**: 永久免费，无时间限制
- ✅ **PlanetScale**: 永久免费MySQL，5GB存储
- ✅ **数据持久化**: 重新部署不会丢失数据
- ✅ **在线修改**: 数据修改会永久保存
- ✅ **自动部署**: 每次推送代码自动部署

## 部署步骤

### 1. 创建PlanetScale数据库

1. **访问 [planetscale.com](https://planetscale.com)**
2. **注册账号** (用GitHub登录)
3. **创建新数据库**:
   - 点击 "Create database"
   - 数据库名称: `europe-travel-db`
   - 选择 "Free" 计划
   - 点击 "Create database"
4. **获取连接信息**:
   - 点击 "Connect" → "Connect with"
   - 选择 "Node.js"
   - 复制连接字符串

### 2. 部署到Vercel

1. **访问 [vercel.com](https://vercel.com)**
2. **用GitHub账号登录**
3. **导入你的仓库**:
   - 点击 "New Project"
   - 选择你的 `euro` 仓库
   - 点击 "Import"

4. **设置环境变量**:
   - 在项目设置中找到 "Environment Variables"
   - 添加以下变量:
     ```
     DATABASE_HOST=你的数据库主机
     DATABASE_USERNAME=你的用户名
     DATABASE_PASSWORD=你的密码
     DATABASE_NAME=europe-travel-db
     ```

5. **部署**:
   - 点击 "Deploy"
   - 等待部署完成

### 3. 验证部署

部署完成后，访问你的应用链接，检查：
- ✅ 首页正常加载
- ✅ 行程总结页面正常显示
- ✅ 地图页面正常显示
- ✅ 数据持久化（刷新页面数据不丢失）

## 环境变量说明

| 变量名 | 说明 | 示例值 |
|--------|------|--------|
| `DATABASE_HOST` | 数据库主机 | `aws.connect.psdb.cloud` |
| `DATABASE_USERNAME` | 数据库用户名 | `your-username` |
| `DATABASE_PASSWORD` | 数据库密码 | `your-password` |
| `DATABASE_NAME` | 数据库名称 | `europe-travel-db` |

## 优势

- ✅ **完全免费**: 无时间限制，无使用限制
- ✅ **数据持久化**: 重新部署不会丢失数据
- ✅ **在线修改**: 通过应用修改的数据会永久保存
- ✅ **自动备份**: PlanetScale自动备份数据
- ✅ **扩展性**: 支持更复杂的查询和功能
- ✅ **全球CDN**: Vercel提供全球CDN加速

## 故障排除

如果遇到问题：

1. **检查环境变量**: 确保所有数据库连接信息正确
2. **检查构建日志**: 在Vercel控制台查看详细错误信息
3. **检查数据库连接**: 确保PlanetScale数据库正常运行
4. **检查代码**: 确保所有依赖都正确安装

## 完成！

配置完成后，你的应用就真正可以投入生产使用了！数据会永久保存，支持在线修改，重新部署也不会丢失数据，而且完全免费！
