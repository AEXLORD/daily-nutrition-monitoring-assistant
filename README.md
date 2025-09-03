# 营养监测助手 (Daily Nutrition Monitoring Assistant)

一个基于Next.js的智能营养监测Web应用，帮助用户跟踪和分析每日营养摄入。

## 🚀 功能特性

### 已完成功能 (Phase 1)
- ✅ 用户认证系统（注册/登录/退出）
- ✅ 用户个人资料管理
- ✅ 基础食物数据库（10种常见食物）
- ✅ 摄入记录API
- ✅ 响应式UI设计
- ✅ MongoDB数据库集成

### 技术栈
- **前端**: Next.js 15 + TypeScript + Tailwind CSS
- **后端**: Next.js API Routes
- **数据库**: MongoDB with Mongoose ODM
- **认证**: JWT Token-based Authentication
- **部署**: Vercel + MongoDB Atlas

## 🛠️ 开发环境设置

### 前置要求
- Node.js 18+ 
- MongoDB Atlas 账户
- npm 或 yarn

### 安装步骤

1. **克隆项目**
   ```bash
   git clone <repository-url>
   cd daily-nutrition-monitoring-assistant
   ```

2. **安装依赖**
   ```bash
   npm install
   ```

3. **环境配置**
   复制 `.env.example` 为 `.env.local` 并配置：
   ```bash
   cp .env.example .env.local
   ```
   
   编辑 `.env.local` 文件：
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/nutrition-monitoring?retryWrites=true&w=majority
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   NEXTAUTH_URL=http://localhost:3000
   ```

4. **启动开发服务器**
   ```bash
   npm run dev
   ```

5. **访问应用**
   打开浏览器访问 http://localhost:3000

### 数据库初始化

项目包含样本食物数据，可以通过API端点初始化：

```bash
curl -X POST http://localhost:3000/api/foods/seed
```

## 📁 项目结构

```
src/
├── app/                 # Next.js App Router
│   ├── api/            # API 路由
│   │   ├── auth/       # 认证相关API
│   │   ├── foods/      # 食物数据API
│   │   └── intake/     # 摄入记录API
│   └── page.tsx        # 主页
├── components/         # React 组件
│   ├── auth/          # 认证相关组件
│   ├── profile/       # 个人资料组件
│   └── ui/            # 基础UI组件
├── lib/               # 工具库
│   ├── auth.ts        # 认证工具
│   └── mongodb.ts     # 数据库连接
└── models/            # 数据模型
    ├── User.ts        # 用户模型
    ├── Food.ts        # 食物模型
    └── IntakeRecord.ts # 摄入记录模型
```

## 🎯 API 端点

### 认证相关
- `POST /api/auth/register` - 用户注册
- `POST /api/auth/login` - 用户登录  
- `POST /api/auth/logout` - 用户退出
- `GET /api/auth/me` - 获取当前用户信息

### 用户资料
- `GET /api/user/profile` - 获取用户资料
- `PUT /api/user/profile` - 更新用户资料

### 食物数据
- `GET /api/foods` - 获取食物列表（支持搜索和分类）
- `GET /api/foods/categories` - 获取食物分类
- `POST /api/foods/seed` - 初始化样本食物数据

### 摄入记录
- `GET /api/intake` - 获取摄入记录
- `POST /api/intake` - 创建摄入记录
- `GET /api/intake/summary` - 获取摄入汇总数据

## 🚧 开发计划

### Phase 2 (智能功能开发)
- [ ] 自然语言食物输入解析
- [ ] 量词转换系统
- [ ] 烹饪方式识别
- [ ] 营养计算引擎

### Phase 3 (数据分析可视化)  
- [ ] ECharts数据可视化
- [ ] 营养达标率分析
- [ ] 趋势图表和报告
- [ ] 移动端优化

## 📊 数据模型

### 用户 (User)
- 基本信息、健康数据、饮食偏好
- 认证信息和设置

### 食物 (Food) 
- 营养成分数据（热量、蛋白质、碳水、脂肪等）
- 维生素和矿物质含量
- 烹饪方式影响系数
- 常见量词转换

### 摄入记录 (IntakeRecord)
- 每日饮食记录
- 分餐次营养计算
- 总营养汇总

## 🐛 故障排除

### 常见问题

1. **MongoDB连接失败**
   - 检查MONGODB_URI环境变量
   - 确认MongoDB Atlas白名单设置

2. **JWT认证问题**
   - 确保JWT_SECRET环境变量已设置

3. **CORS问题**
   - 检查middleware.ts配置

## 📄 许可证

MIT License - 详见 LICENSE 文件

## 🤝 贡献

欢迎提交Issue和Pull Request！

## 📞 支持

如有问题请创建Issue或联系开发团队。