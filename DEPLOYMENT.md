# 部署指南

## Vercel 部署

### 1. 准备部署

确保完成以下步骤：

1. **环境变量配置**
   ```bash
   # 在Vercel项目中设置以下环境变量
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/nutrition-monitoring?retryWrites=true&w=majority
   JWT_SECRET=your-super-secret-jwt-key-at-least-32-characters-long
   NEXTAUTH_URL=https://your-app.vercel.app
   ```

2. **MongoDB Atlas 配置**
   - 创建MongoDB Atlas账户
   - 创建集群和数据库
   - 设置网络访问（添加0.0.0.0/0到IP白名单）
   - 创建数据库用户

### 2. Vercel 部署步骤

#### 方法一：通过GitHub连接（推荐）

1. **推送代码到GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/your-username/daily-nutrition-monitoring-assistant.git
   git push -u origin main
   ```

2. **在Vercel中部署**
   - 登录 [Vercel](https://vercel.com)
   - 点击 "New Project"
   - 连接GitHub账户
   - 选择你的仓库
   - 配置环境变量
   - 点击 "Deploy"

#### 方法二：通过Vercel CLI

1. **安装Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **部署项目**
   ```bash
   vercel
   vercel --prod  # 部署到生产环境
   ```

### 3. 环境变量设置

在Vercel仪表板中：

1. 进入项目设置
2. 选择 "Environment Variables"
3. 添加以下变量：

```env
MONGODB_URI=你的MongoDB连接字符串
JWT_SECRET=强密码（至少32字符）
NEXTAUTH_URL=你的Vercel应用URL
```

## MongoDB Atlas 设置

### 1. 创建集群

1. 登录 [MongoDB Atlas](https://www.mongodb.com/atlas)
2. 创建新项目
3. 创建免费集群（M0）
4. 选择云提供商和区域

### 2. 数据库访问配置

1. **创建数据库用户**
   - 进入 "Database Access"
   - 点击 "Add New Database User"
   - 设置用户名和密码
   - 选择权限 "Atlas admin"

2. **网络访问配置**
   - 进入 "Network Access"
   - 点击 "Add IP Address"
   - 选择 "Allow Access from Anywhere" (0.0.0.0/0)
   - 或者添加Vercel的IP范围

### 3. 获取连接字符串

1. 进入 "Clusters"
2. 点击 "Connect"
3. 选择 "Connect your application"
4. 复制连接字符串
5. 替换密码和数据库名：
   ```
   mongodb+srv://username:<password>@cluster.mongodb.net/nutrition-monitoring?retryWrites=true&w=majority
   ```

## 本地开发与生产差异

### 环境变量

**.env.local** (开发环境):
```env
MONGODB_URI=mongodb://localhost:27017/nutrition-dev
JWT_SECRET=dev-secret-key
NEXTAUTH_URL=http://localhost:3000
```

**Vercel环境变量** (生产环境):
```env
MONGODB_URI=mongodb+srv://...
JWT_SECRET=production-secret-key
NEXTAUTH_URL=https://your-app.vercel.app
```

### 数据库配置

- **开发**: 可以使用本地MongoDB或Atlas
- **生产**: 必须使用MongoDB Atlas

## 故障排除

### 常见部署问题

1. **MongoDB连接失败**
   - 检查MONGODB_URI格式
   - 确认网络访问配置
   - 验证数据库用户权限

2. **环境变量问题**
   - 确保所有必需变量都已设置
   - 检查变量名称拼写
   - 重新部署使变量生效

3. **构建失败**
   - 检查TypeScript错误
   - 运行 `npm run build` 本地测试

### 性能优化

1. **数据库索引**
   ```javascript
   // 确保重要查询字段有索引
   db.users.createIndex({ email: 1 })
   db.intakeRecords.createIndex({ userId: 1, date: 1 })
   ```

2. **Vercel配置**
   - 使用合适的地区
   - 启用性能监控
   - 设置合适的缓存策略

## 监控和维护

### 应用监控

1. **Vercel Analytics**
   - 页面性能监控
   - 用户行为分析
   - 错误跟踪

2. **MongoDB Atlas 监控**
   - 数据库性能指标
   - 存储使用情况
   - 查询性能分析

### 定期维护

1. **数据库备份**
   - 设置自动备份
   - 定期测试恢复流程

2. **依赖更新**
   - 定期更新npm包
   - 检查安全漏洞

3. **日志监控**
   - 检查应用日志
   - 监控错误率

## 扩展建议

### 后续扩展方向

1. **CDN配置**
   - 配置自定义域名
   - 设置CDN缓存

2. **数据库优化**
   - 考虑分片集群
   - 优化查询性能

3. **监控告警**
   - 设置性能告警
   - 配置错误通知

### 成本优化

1. **免费层级**
   - Vercel Hobby计划
   - MongoDB Atlas M0免费集群

2. **按需扩展**
   - 根据用户量逐步升级
   - 监控资源使用情况

## 支持资源

- [Vercel Documentation](https://vercel.com/docs)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com)
- [Next.js Deployment Guide](https://nextjs.org/docs/deployment)