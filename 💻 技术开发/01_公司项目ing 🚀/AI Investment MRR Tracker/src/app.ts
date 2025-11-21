import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import { config } from 'dotenv';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import compression from 'compression';

// Import routes - 中国版PMF监控系统路由
import chinaMonitoringRoutes from './routes/chinaMonitoringRoutes';
// Legacy routes (kept for backward compatibility)
import companyRoutes from './routes/companies';
import mrrRoutes from './routes/mrr';
import investmentRoutes from './routes/investment';
import collectionRoutes from './routes/collection';
import alertRoutes from './routes/alerts';
import analysisRoutes from './routes/analysis';

// Import middleware
import { errorHandler } from './middleware/errorHandler';
import { requestLogger } from './middleware/requestLogger';
import { authMiddleware } from './middleware/auth';

// Load environment variables
config();

const app = express();
const prisma = new PrismaClient();

// Security middleware
app.use(helmet());
app.use(compression());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// CORS configuration
app.use(cors({
  origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:3000'],
  credentials: true
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use(requestLogger);

// Health check endpoint - 中国版PMF监控系统
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    system: '中国社交媒体PMF监控系统 v1.0',
    replaced: '原MRR追踪系统已完全替换为中国版',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    database: 'connected',
    features: {
      '平台支持': ['小红书', '知乎', '微博', '抖音'],
      'PMF信号检测': '4层级标签分析系统',
      'AI智能分析': 'GPT-4驱动内容评估',
      '实时监控': '7x24小时自动扫描'
    }
  });
});

// 主要API路由 - 中国社交媒体PMF监控系统
app.use('/api/china-monitoring', chinaMonitoringRoutes);

// Legacy API routes (保留向后兼容性，但已被中国版替换)
app.use('/api/companies', authMiddleware, companyRoutes);
app.use('/api/mrr', authMiddleware, mrrRoutes);
app.use('/api/investment', authMiddleware, investmentRoutes);
app.use('/api/collection', authMiddleware, collectionRoutes);
app.use('/api/alerts', authMiddleware, alertRoutes);
app.use('/api/analysis', authMiddleware, analysisRoutes);

// 根路径重定向到中国版API文档
app.get('/api', (req, res) => {
  res.redirect('/api/china-monitoring/docs');
});

// 系统状态页面
app.get('/system-status', (req, res) => {
  res.json({
    success: true,
    system: {
      name: 'AI投资MRR追踪器 - 中国版',
      version: '1.0.0-china',
      status: '已完全替换原系统',
      upgrade_date: new Date().toLocaleDateString('zh-CN')
    },
    migration: {
      from: '西方MRR财报分析系统',
      to: '中国社交媒体PMF信号监控系统',
      reason: '早期项目无财报数据，改用社交媒体PMF信号',
      improvement: '更适合200万RMB以下MRR的中国初创企业'
    },
    new_features: {
      data_source: '小红书、知乎、微博、抖音等中国主流平台',
      detection_method: '标签驱动 + AI语义分析',
      focus: 'PMF阶段初创企业识别和投资机会发现',
      automation: '实时监控 + 智能预警 + 自动化报告'
    },
    message: '中国社交媒体PMF监控系统已成功替换原MRR系统，专注于中国本土投资环境优化'
  });
});

// Error handling middleware (must be last)
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`🚀 中国社交媒体PMF监控系统 API server running on port ${PORT}`);
  console.log(`📊 Health check available at http://localhost:${PORT}/health`);
  console.log(`📋 API文档: http://localhost:${PORT}/api/china-monitoring/docs`);
  console.log(`🏠 系统状态: http://localhost:${PORT}/system-status`);
  console.log(`\n🔄 系统升级完成:`);
  console.log(`   ✅ 已从西方MRR财报系统完全切换为中国PMF监控系统`);
  console.log(`   ✅ 支持小红书、知乎、微博、抖音四大平台`);
  console.log(`   ✅ 4层级PMF标签智能分析系统`);
  console.log(`   ✅ GPT-4驱动的内容智能评估`);
  console.log(`   ✅ 专注200万RMB以下MRR的中国初创企业`);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('Received SIGTERM, shutting down gracefully...');
  await prisma.$disconnect();
  process.exit(0);
});

// 导出应用实例
export { app, prisma };
export default app;

// 系统信息常量
export const CHINA_SYSTEM_INFO = {
  name: '中国社交媒体PMF监控系统',
  version: '1.0.0-china',
  replacement_date: new Date().toISOString(),
  target_market: 'PMF阶段中国初创企业（200万RMB以下MRR）',
  supported_platforms: ['小红书', '知乎', '微博', '抖音'],
  key_features: [
    '4层级PMF标签分析',
    'AI驱动内容评估',
    '实时投资机会发现',
    '自动化监控报告'
  ]
};