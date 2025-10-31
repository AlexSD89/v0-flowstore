import { Router } from 'express';
import { ChinaMonitoringController } from '../controllers/chinaMonitoringController';
import { rateLimiter } from '../middleware/rateLimiter';
import { validateQuery } from '../middleware/validation';

const router = Router();
const chinaController = new ChinaMonitoringController();

// 中国社交媒体PMF监控API路由 - 完全替换原MRR路由

/**
 * @route GET /api/china-monitoring/search-pmf
 * @desc 搜索PMF阶段初创企业信号
 * @access Public
 * @example /api/china-monitoring/search-pmf?platforms=xiaohongshu&tags=#MVP,#产品验证&minScore=6.0&limit=50
 */
router.get('/search-pmf', 
  rateLimiter({ windowMs: 15 * 60 * 1000, max: 30 }), // 15分钟30次
  validateQuery({
    platforms: { type: 'array', optional: true },
    tags: { type: 'array', optional: true },
    minScore: { type: 'number', optional: true, min: 0, max: 10 },
    limit: { type: 'number', optional: true, min: 1, max: 100 }
  }),
  chinaController.searchPMFSignals.bind(chinaController)
);

/**
 * @route GET /api/china-monitoring/generate-report
 * @desc 生成PMF监控分析报告
 * @access Public
 * @example /api/china-monitoring/generate-report?platforms=xiaohongshu,zhihu&days=7&minScore=6.0
 */
router.get('/generate-report',
  rateLimiter({ windowMs: 30 * 60 * 1000, max: 10 }), // 30分钟10次
  validateQuery({
    platforms: { type: 'array', optional: true },
    days: { type: 'number', optional: true, min: 1, max: 30 },
    minScore: { type: 'number', optional: true, min: 0, max: 10 }
  }),
  chinaController.generatePMFReport.bind(chinaController)
);

/**
 * @route GET /api/china-monitoring/investment-opportunities
 * @desc 获取投资机会列表
 * @access Public
 * @example /api/china-monitoring/investment-opportunities?minScore=7.0&stage=A轮&technology=AI&limit=20
 */
router.get('/investment-opportunities',
  rateLimiter({ windowMs: 15 * 60 * 1000, max: 60 }), // 15分钟60次
  validateQuery({
    minScore: { type: 'number', optional: true, min: 0, max: 10 },
    platform: { type: 'string', optional: true },
    stage: { type: 'string', optional: true },
    technology: { type: 'string', optional: true },
    limit: { type: 'number', optional: true, min: 1, max: 100 },
    offset: { type: 'number', optional: true, min: 0 }
  }),
  chinaController.getInvestmentOpportunities.bind(chinaController)
);

/**
 * @route GET /api/china-monitoring/pmf-tags
 * @desc 获取PMF标签层级配置
 * @access Public
 */
router.get('/pmf-tags',
  rateLimiter({ windowMs: 15 * 60 * 1000, max: 100 }), // 15分钟100次
  chinaController.getPMFTagConfig.bind(chinaController)
);

/**
 * @route GET /api/china-monitoring/stats
 * @desc 获取监控统计数据
 * @access Public
 * @example /api/china-monitoring/stats?days=30
 */
router.get('/stats',
  rateLimiter({ windowMs: 15 * 60 * 1000, max: 100 }), // 15分钟100次
  validateQuery({
    days: { type: 'number', optional: true, min: 1, max: 90 }
  }),
  chinaController.getMonitoringStats.bind(chinaController)
);

/**
 * @route POST /api/china-monitoring/trigger-task
 * @desc 手动触发PMF监控任务
 * @access Public
 */
router.post('/trigger-task',
  rateLimiter({ windowMs: 60 * 60 * 1000, max: 5 }), // 1小时5次
  chinaController.triggerMonitoringTask.bind(chinaController)
);

// 健康检查端点
router.get('/health', (req, res) => {
  res.json({
    success: true,
    service: '中国社交媒体PMF监控系统',
    status: 'healthy',
    version: '1.0.0-china',
    timestamp: new Date().toISOString(),
    features: {
      平台支持: ['小红书', '知乎', '微博', '抖音'],
      标签层级: 4,
      AI分析: '启用',
      实时监控: '启用'
    }
  });
});

// 获取系统信息
router.get('/info', (req, res) => {
  res.json({
    success: true,
    data: {
      系统名称: 'AI投资MRR追踪器 - 中国版',
      版本: '1.0.0-china',
      替换日期: new Date().toLocaleDateString('zh-CN'),
      核心功能: {
        社交媒体监控: '小红书、知乎、微博、抖音',
        PMF信号识别: '4层级标签分析系统',
        AI智能分析: 'GPT-4驱动的内容评估',
        投资机会发现: '自动化高分机会推荐',
        实时监控: '7x24小时自动扫描'
      },
      目标市场: {
        地区: '中国大陆',
        阶段: 'PMF阶段初创企业',
        投资规模: '200万RMB以下 MRR',
        重点行业: 'AI、SaaS、新消费'
      },
      技术特色: {
        数据源: '中国主流社交媒体平台',
        分析模式: '标签驱动 + AI语义分析',
        监控范围: 'PMF信号、团队动态、融资信息',
        更新频率: '实时更新 + 定时扫描'
      }
    },
    message: '中国社交媒体PMF监控系统已完全替换原MRR系统'
  });
});

// API文档端点
router.get('/docs', (req, res) => {
  res.json({
    success: true,
    data: {
      基础路径: '/api/china-monitoring',
      端点列表: [
        {
          路径: '/search-pmf',
          方法: 'GET',
          功能: 'PMF信号搜索',
          参数: 'platforms, tags, minScore, limit',
          限流: '15分钟30次'
        },
        {
          路径: '/generate-report',
          方法: 'GET',
          功能: '生成分析报告',
          参数: 'platforms, days, minScore',
          限流: '30分钟10次'
        },
        {
          路径: '/investment-opportunities',
          方法: 'GET',
          功能: '投资机会列表',
          参数: 'minScore, platform, stage, technology, limit, offset',
          限流: '15分钟60次'
        },
        {
          路径: '/pmf-tags',
          方法: 'GET',
          功能: 'PMF标签配置',
          参数: '无',
          限流: '15分钟100次'
        },
        {
          路径: '/stats',
          方法: 'GET',
          功能: '监控统计',
          参数: 'days',
          限流: '15分钟100次'
        },
        {
          路径: '/trigger-task',
          方法: 'POST',
          功能: '手动触发监控',
          参数: 'platforms, tags, priority',
          限流: '1小时5次'
        }
      ],
      使用示例: {
        搜索MVP信号: 'GET /api/china-monitoring/search-pmf?tags=#MVP,#产品验证&minScore=7.0',
        生成周报: 'GET /api/china-monitoring/generate-report?days=7&minScore=6.0',
        获取AI项目: 'GET /api/china-monitoring/investment-opportunities?technology=AI&minScore=7.5',
        手动扫描: 'POST /api/china-monitoring/trigger-task {"platforms": ["xiaohongshu"], "tags": ["#MVP"]}'
      }
    },
    message: 'API文档 - 中国社交媒体PMF监控系统'
  });
});

export default router;