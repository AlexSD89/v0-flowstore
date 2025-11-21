# 智评AI - 中国专业AI产品评测与采购平台

[![Next.js](https://img.shields.io/badge/Next.js-14.0.0-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.2.0-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.3.5-38B2AC)](https://tailwindcss.com/)
[![Prisma](https://img.shields.io/badge/Prisma-5.6.0-2D3748)](https://www.prisma.io/)

中国首个"AI项目成功保障+产品评测"一体化平台，致力于解决企业AI项目42%失败率痛点，让每一个AI项目都能成功落地。

## ✨ 核心特性

### 🔍 AI产品智能评测
- **6维度科学评测框架**: 技术能力、业务价值、安全合规、成本效益、服务支持、生态兼容
- **1000+产品数据库**: 覆盖主流AI产品和解决方案
- **专业评测报告**: 深度分析和量化评估
- **智能对比分析**: 多产品横向对比和推荐

### 🛡️ AI项目成功保障
- **可行性评估服务**: 技术可行性、数据质量、ROI分析
- **全程项目监控**: 实施过程质量控制和风险管理
- **成功标准制定**: 明确的项目成功标准和KPI
- **效果验收保障**: 确保项目达到预期效果

### 💰 智能采购匹配
- **供应商智能匹配**: 基于评测结果的精准匹配
- **招投标专业支持**: 完整的采购流程服务
- **合同谈判协助**: 专业的商务谈判支持
- **价格基准分析**: 市场价格对比和分析

### 🎓 专业培训认证
- **AI评测师认证**: 专业的AI产品评测师培训
- **项目管理认证**: AI项目管理专业认证
- **企业内训定制**: 针对企业的定制化培训
- **在线学习平台**: 灵活的在线学习资源

## 🚀 技术架构

### 前端技术栈
- **框架**: Next.js 14 (App Router)
- **语言**: TypeScript
- **样式**: Tailwind CSS + 自定义设计系统
- **动画**: Framer Motion
- **组件**: Headless UI + 自定义组件
- **图标**: Heroicons
- **状态管理**: Zustand
- **表单**: React Hook Form + Zod

### 后端技术栈
- **API**: Next.js API Routes
- **数据库**: PostgreSQL + Prisma ORM
- **认证**: NextAuth.js
- **支付**: Stripe
- **邮件**: Nodemailer
- **文件存储**: 云存储集成
- **搜索**: 全文搜索引擎

### 基础设施
- **部署**: Vercel / 阿里云
- **数据库**: 云数据库服务
- **CDN**: 全球内容分发网络
- **监控**: 应用性能监控
- **日志**: 结构化日志系统

## 📁 项目结构

```
zhiping-ai-portal/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── layout.tsx         # 根布局
│   │   ├── page.tsx           # 首页
│   │   ├── globals.css        # 全局样式
│   │   └── api/               # API 路由
│   ├── components/            # React 组件
│   │   ├── layout/           # 布局组件
│   │   ├── sections/         # 页面段落组件
│   │   ├── ui/               # 基础 UI 组件
│   │   └── providers/        # 上下文提供者
│   ├── lib/                  # 工具库
│   ├── hooks/                # 自定义 Hooks
│   ├── types/                # TypeScript 类型定义
│   └── utils/                # 工具函数
├── prisma/                   # 数据库架构
├── public/                   # 静态资源
├── docs/                     # 项目文档
└── config files             # 配置文件
```

## 🛠️ 开发指南

### 环境要求
- Node.js 18.0.0+
- npm 或 yarn
- PostgreSQL 数据库

### 快速开始

1. **克隆项目**
```bash
git clone https://github.com/your-org/zhiping-ai-portal.git
cd zhiping-ai-portal
```

2. **安装依赖**
```bash
npm install
# 或
yarn install
```

3. **环境配置**
```bash
cp .env.example .env.local
# 编辑 .env.local 文件，配置必要的环境变量
```

4. **数据库设置**
```bash
# 生成 Prisma 客户端
npx prisma generate

# 执行数据库迁移
npx prisma migrate dev

# 填充测试数据（可选）
npx prisma db seed
```

5. **启动开发服务器**
```bash
npm run dev
# 或
yarn dev
```

6. **访问应用**
打开 [http://localhost:3000](http://localhost:3000) 查看应用

### 开发命令

```bash
# 开发
npm run dev

# 构建
npm run build

# 启动生产版本
npm run start

# 代码检查
npm run lint

# 类型检查
npm run type-check

# 测试
npm run test

# 测试覆盖率
npm run test:coverage
```

## 🎨 设计系统

### 色彩体系
- **主色**: 智评蓝 (#0ea5e9)
- **辅色**: 智评青 (#38bdf8)
- **深色**: 智评深蓝 (#0c4a6e)
- **浅色**: 智评浅蓝 (#e0f2fe)
- **成功**: 绿色 (#10b981)
- **警告**: 黄色 (#f59e0b)
- **错误**: 红色 (#ef4444)

### 字体系统
- **主字体**: Inter (无衬线)
- **代码字体**: JetBrains Mono (等宽)
- **中文字体**: 苹方、微软雅黑

### 间距系统
- 基于 4px 的间距系统
- Tailwind CSS 标准间距类

### 组件库
- 自定义设计的 UI 组件
- 响应式设计原则
- 无障碍访问支持

## 📱 响应式设计

支持以下设备尺寸：
- **手机**: 320px - 768px
- **平板**: 768px - 1024px
- **桌面**: 1024px - 1440px
- **大屏**: 1440px+

## 🔐 安全特性

- **数据加密**: 传输和存储全加密
- **身份认证**: 多因素认证支持
- **权限控制**: 基于角色的访问控制
- **安全审计**: 完整的操作日志
- **隐私保护**: GDPR 和个保法合规

## 📊 性能优化

- **代码分割**: 自动代码分割和懒加载
- **图片优化**: Next.js Image 组件优化
- **缓存策略**: 多层缓存机制
- **SEO 优化**: 完整的 SEO 支持
- **性能监控**: Core Web Vitals 监控

## 🧪 测试策略

- **单元测试**: Jest + Testing Library
- **集成测试**: 组件和 API 集成测试
- **E2E 测试**: Playwright 端到端测试
- **性能测试**: Lighthouse CI
- **可视化测试**: Chromatic 视觉回归测试

## 📚 API 文档

完整的 API 文档请访问：`/api/docs`

主要 API 端点：
- `/api/auth/*` - 认证相关
- `/api/evaluations/*` - 评测服务
- `/api/products/*` - 产品管理
- `/api/projects/*` - 项目管理
- `/api/users/*` - 用户管理

## 🚀 部署指南

### Vercel 部署
1. 连接 GitHub 仓库
2. 配置环境变量
3. 自动部署

### 阿里云部署
1. 构建 Docker 镜像
2. 推送到容器注册表
3. 部署到 ECS 或 ACK

### 数据库部署
- 推荐使用云数据库服务
- 配置备份和监控
- 设置安全组规则

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 🤝 贡献指南

欢迎贡献代码！请阅读 [CONTRIBUTING.md](CONTRIBUTING.md) 了解详细的贡献指南。

### 开发流程
1. Fork 本仓库
2. 创建功能分支
3. 提交代码更改
4. 创建 Pull Request
5. 代码审查和合并

## 📞 联系我们

- **官网**: https://zhiping-ai.com
- **邮箱**: contact@zhiping-ai.com
- **电话**: 400-888-0123
- **地址**: 北京市朝阳区国贸CBD核心区

## 🔗 相关链接

- [产品文档](https://docs.zhiping-ai.com)
- [API 文档](https://api.zhiping-ai.com/docs)
- [用户指南](https://help.zhiping-ai.com)
- [开发者社区](https://community.zhiping-ai.com)
- [状态页面](https://status.zhiping-ai.com)

---

© 2025 智评AI. 版权所有 | 让每一个AI项目都能成功落地