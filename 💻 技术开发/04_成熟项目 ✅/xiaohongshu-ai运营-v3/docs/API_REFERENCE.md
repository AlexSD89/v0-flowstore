# LaunchX V3.0 API接口文档

**版本**: 3.0.0
**更新日期**: 2025-10-15
**Base URL**: `http://localhost:8000/api/v3`

## 1. 概述

LaunchX V3.0提供RESTful API接口，支持客户管理、策略生成、内容运营、效果分析等核心功能。所有API遵循REST规范，使用JSON格式进行数据交换。

### 1.1 认证方式

```http
Authorization: Bearer <access_token>
Content-Type: application/json
```

### 1.2 通用响应格式

**成功响应**:
```json
{
  "success": true,
  "data": {},
  "message": "操作成功",
  "timestamp": "2025-10-15T10:30:00Z"
}
```

**错误响应**:
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "错误描述",
    "details": {}
  },
  "timestamp": "2025-10-15T10:30:00Z"
}
```

## 2. 客户管理API

### 2.1 创建客户

```http
POST /customers
```

**请求体**:
```json
{
  "company_name": "示例公司",
  "industry": "科技",
  "company_size": "中型",
  "contact_person": "张三",
  "contact_info": "zhangsan@example.com",
  "brand_positioning": {
    "brand_name": "示例品牌",
    "brand_value": "创新科技",
    "market_position": "行业领先"
  },
  "target_audience": {
    "primary_demographic": "25-35岁城市白领",
    "interests": ["科技", "生活", "效率"],
    "pain_points": ["时间管理", "效率提升"]
  },
  "business_goals": {
    "primary_goals": ["品牌曝光", "用户增长"],
    "success_metrics": ["粉丝数量", "互动率"],
    "timeline": "6个月"
  }
}
```

**响应**:
```json
{
  "success": true,
  "data": {
    "customer_id": "cust_12345",
    "status": "active",
    "created_at": "2025-10-15T10:30:00Z",
    "maturity_level": 2
  }
}
```

### 2.2 获取客户信息

```http
GET /customers/{customer_id}
```

**响应**:
```json
{
  "success": true,
  "data": {
    "customer_id": "cust_12345",
    "basic_info": {...},
    "brand_positioning": {...},
    "target_audience": {...},
    "business_goals": {...},
    "status": "active",
    "created_at": "2025-10-15T10:30:00Z",
    "updated_at": "2025-10-15T11:00:00Z"
  }
}
```

### 2.3 更新客户信息

```http
PUT /customers/{customer_id}
```

### 2.4 删除客户

```http
DELETE /customers/{customer_id}
```

## 3. 策略生成API

### 3.1 生成综合策略

```http
POST /customers/{customer_id}/strategies
```

**请求体**:
```json
{
  "strategy_type": "comprehensive",
  "time_horizon": "3_months",
  "focus_areas": ["brand_awareness", "lead_generation"],
  "content_preferences": ["图文", "视频"],
  "budget_constraints": {
    "monthly_budget": 10000,
    "content_frequency": "daily"
  }
}
```

**响应**:
```json
{
  "success": true,
  "data": {
    "strategy_id": "strategy_12345",
    "customer_id": "cust_12345",
    "market_analysis": {
      "trends": [
        "AI工具应用",
        "效率提升需求"
      ],
      "competitors": [
        {
          "name": "竞品A",
          "strategy": "技术导向",
          "performance": "高互动"
        }
      ],
      "opportunities": [
        "细分市场深耕",
        "跨界合作"
      ]
    },
    "content_strategy": {
      "pillars": [
        {
          "name": "效率工具",
          "topics": ["时间管理", "任务规划"],
          "content_types": ["教程", "测评"]
        },
        {
          "name": "科技前沿",
          "topics": ["AI应用", "创新产品"],
          "content_types": ["评测", "行业分析"]
        }
      ],
      "publishing_schedule": {
        "frequency": "每日1-2篇",
        "best_times": ["09:00", "18:00", "21:00"],
        "content_mix": {
          "教程": "30%",
          "测评": "40%",
          "行业分析": "30%"
        }
      }
    },
    "confidence_score": 0.85,
    "expected_outcomes": {
      "engagement_rate": 0.08,
      "follower_growth": 0.15,
      "conversion_rate": 0.03
    },
    "created_at": "2025-10-15T10:30:00Z"
  }
}
```

### 3.2 获取策略详情

```http
GET /strategies/{strategy_id}
```

### 3.3 更新策略

```http
PUT /strategies/{strategy_id}
```

### 3.4 策略效果分析

```http
GET /strategies/{strategy_id}/performance?period=30d
```

**响应**:
```json
{
  "success": true,
  "data": {
    "strategy_id": "strategy_12345",
    "performance_period": "30d",
    "metrics": {
      "total_posts": 45,
      "total_engagement": 1250,
      "engagement_rate": 0.089,
      "follower_growth": 1234,
      "conversion_events": 89,
      "conversion_rate": 0.028
    },
    "content_performance": [
      {
        "content_type": "教程",
        "posts_count": 15,
        "avg_engagement": 45,
        "conversion_rate": 0.035
      },
      {
        "content_type": "测评",
        "posts_count": 20,
        "avg_engagement": 52,
        "conversion_rate": 0.025
      }
    ],
    "optimization_suggestions": [
      {
        "area": "发布时间",
        "suggestion": "增加午间12:00发布",
        "expected_impact": "+15%互动率"
      }
    ]
  }
}
```

## 4. 内容运营API

### 4.1 生成内容计划

```http
POST /customers/{customer_id}/content-plans
```

**请求体**:
```json
{
  "strategy_id": "strategy_12345",
  "time_horizon": "7_days",
  "content_types": ["图文", "视频"],
  "topics": ["效率工具", "AI应用"],
  "publishing_schedule": {
    "daily_posts": 2,
    "preferred_times": ["09:00", "18:00"]
  }
}
```

**响应**:
```json
{
  "success": true,
  "data": {
    "plan_id": "plan_12345",
    "content_calendar": [
      {
        "date": "2025-10-16",
        "posts": [
          {
            "time": "09:00",
            "content_type": "图文",
            "topic": "AI效率工具推荐",
            "title": "5款提升工作效率的AI工具",
            "hashtags": ["AI工具", "效率", "工作"],
            "estimated_engagement": 150
          }
        ]
      }
    ],
    "total_posts": 14,
    "estimated_reach": 5000,
    "created_at": "2025-10-15T10:30:00Z"
  }
}
```

### 4.2 内容生成

```http
POST /content/generate
```

**请求体**:
```json
{
  "content_spec": {
    "type": "图文",
    "topic": "AI效率工具",
    "angle": "实用推荐",
    "target_audience": "职场人士",
    "word_count": 800,
    "tone": "专业但亲切",
    "include_hashtags": true,
    "call_to_action": "关注获取更多"
  }
}
```

**响应**:
```json
{
  "success": true,
  "data": {
    "content_id": "content_12345",
    "generated_content": {
      "title": "5款提升工作效率的AI工具，职场必备！",
      "body": "【内容正文】",
      "hashtags": ["AI工具", "效率提升", "职场必备", "科技好物"],
      "images": [
        {
          "url": "generated_image_1.jpg",
          "alt_text": "AI工具界面截图"
        }
      ],
      "word_count": 850,
      "reading_time": "3分钟"
    },
    "quality_score": 0.92,
    "seo_score": 0.88,
    "generated_at": "2025-10-15T10:30:00Z"
  }
}
```

### 4.3 内容发布

```http
POST /content/publish
```

**请求体**:
```json
{
  "content_id": "content_12345",
  "customer_id": "cust_12345",
  "publish_time": "2025-10-16T09:00:00Z",
  "platforms": ["xiaohongshu"],
  "additional_options": {
    "notify_followers": true,
    "allow_comments": true,
    "enable_sharing": true
  }
}
```

### 4.4 获取内容状态

```http
GET /content/{content_id}/status
```

## 5. 工作流管理API

### 5.1 创建工作流

```http
POST /customers/{customer_id}/workflows
```

**请求体**:
```json
{
  "workflow_type": "customer_onboarding",
  "parameters": {
    "include_strategy_generation": true,
    "include_content_planning": true,
    "enable_automated_execution": true
  }
}
```

**响应**:
```json
{
  "success": true,
  "data": {
    "workflow_id": "workflow_12345",
    "customer_id": "cust_12345",
    "status": "running",
    "current_stage": "customer_analysis",
    "progress_percentage": 15,
    "estimated_completion": "2025-10-15T11:00:00Z",
    "stages": [
      {
        "name": "customer_analysis",
        "status": "completed",
        "duration": "5分钟"
      },
      {
        "name": "market_research",
        "status": "running",
        "estimated_duration": "10分钟"
      }
    ],
    "created_at": "2025-10-15T10:30:00Z"
  }
}
```

### 5.2 获取工作流状态

```http
GET /workflows/{workflow_id}
```

### 5.3 暂停/恢复工作流

```http
POST /workflows/{workflow_id}/control
```

**请求体**:
```json
{
  "action": "pause"  // "pause" | "resume" | "cancel"
}
```

### 5.4 获取工作流结果

```http
GET /workflows/{workflow_id}/results
```

## 6. 数据分析API

### 6.1 获取客户仪表板

```http
GET /customers/{customer_id}/dashboard?period=30d
```

**响应**:
```json
{
  "success": true,
  "data": {
    "overview": {
      "total_posts": 45,
      "total_engagement": 1250,
      "follower_growth": 1234,
      "engagement_rate": 0.089,
      "reach": 15000
    },
    "trends": {
      "daily_engagement": [
        {"date": "2025-10-01", "engagement": 45},
        {"date": "2025-10-02", "engagement": 52}
      ],
      "follower_growth": [
        {"date": "2025-10-01", "followers": 10000},
        {"date": "2025-10-02", "followers": 10056}
      ]
    },
    "top_content": [
      {
        "content_id": "content_123",
        "title": "AI工具推荐",
        "engagement": 234,
        "engagement_rate": 0.156
      }
    ],
    "audience_insights": {
      "demographics": {
        "age_groups": {"25-34": 0.45, "35-44": 0.30},
        "genders": {"female": 0.65, "male": 0.35},
        "regions": {"上海": 0.20, "北京": 0.18}
      },
      "interests": ["科技", "效率", "职场"],
      "activity_patterns": ["晚间活跃", "周末互动高"]
    }
  }
}
```

### 6.2 获取内容分析

```http
GET /customers/{customer_id}/content-analytics?period=30d&group_by=type
```

### 6.3 竞品分析

```http
POST /analytics/competitor-analysis
```

**请求体**:
```json
{
  "customer_id": "cust_12345",
  "competitors": ["竞品A", "竞品B"],
  "analysis_period": "30d",
  "metrics": ["engagement", "growth", "content_strategy"]
}
```

## 7. 学习优化API

### 7.1 获取学习洞察

```http
GET /customers/{customer_id}/learning-insights?period=90d
```

**响应**:
```json
{
  "success": true,
  "data": {
    "performance_patterns": [
      {
        "pattern": "教程类内容互动率高",
        "confidence": 0.92,
        "impact": "positive",
        "recommendation": "增加教程内容比例至40%"
      }
    ],
    "audience_preferences": {
      "preferred_content_types": ["教程", "测评"],
      "optimal_posting_times": ["09:00", "21:00"],
      "trending_topics": ["AI工具", "效率提升"]
    },
    "strategy_adjustments": [
      {
        "area": "内容策略",
        "adjustment": "增加实用性内容",
        "expected_improvement": "+20%互动率"
      }
    ],
    "learning_score": 0.87
  }
}
```

### 7.2 应用优化建议

```http
POST /customers/{customer_id}/apply-optimizations
```

**请求体**:
```json
{
  "optimization_ids": ["opt_123", "opt_456"],
  "auto_apply": true,
  "review_required": false
}
```

## 8. 系统管理API

### 8.1 系统健康检查

```http
GET /system/health
```

**响应**:
```json
{
  "success": true,
  "data": {
    "status": "healthy",
    "timestamp": "2025-10-15T10:30:00Z",
    "services": {
      "api": "healthy",
      "database": "healthy",
      "mcp_services": {
        "tavily": "healthy",
        "xiaohongshu": "healthy",
        "filesystem": "healthy"
      },
      "cache": "healthy"
    },
    "metrics": {
      "uptime": "15d 8h 30m",
      "cpu_usage": "45%",
      "memory_usage": "68%",
      "active_workflows": 3
    }
  }
}
```

### 8.2 获取系统统计

```http
GET /system/stats
```

### 8.3 日志查询

```http
GET /system/logs?level=error&start_time=2025-10-14T00:00:00Z&end_time=2025-10-15T00:00:00Z
```

## 9. 错误代码

| 错误代码 | HTTP状态码 | 描述 |
|---------|-----------|------|
| CUSTOMER_NOT_FOUND | 404 | 客户不存在 |
| STRATEGY_NOT_FOUND | 404 | 策略不存在 |
| INVALID_REQUEST | 400 | 请求参数无效 |
| AUTHENTICATION_FAILED | 401 | 认证失败 |
| AUTHORIZATION_DENIED | 403 | 权限不足 |
| MCP_SERVICE_ERROR | 503 | MCP服务异常 |
| WORKFLOW_FAILED | 500 | 工作流执行失败 |
| CONTENT_GENERATION_FAILED | 500 | 内容生成失败 |
| RATE_LIMIT_EXCEEDED | 429 | 请求频率超限 |

## 10. 使用限制

### 10.1 频率限制

- API调用频率：1000次/小时
- 内容生成：100次/小时
- 策略生成：10次/小时

### 10.2 数据限制

- 单次生成内容最大字数：2000字
- 批量操作最大数量：100个
- 数据查询时间范围：最大365天

## 11. SDK和示例代码

### 11.1 Python SDK

```python
from launchx_sdk import LaunchXClient

# 初始化客户端
client = LaunchXClient(api_key="your_api_key")

# 创建客户
customer = client.customers.create({
    "company_name": "示例公司",
    "industry": "科技"
})

# 生成策略
strategy = client.strategies.generate(
    customer_id=customer.id,
    strategy_type="comprehensive"
)

# 生成内容
content = client.content.generate({
    "content_spec": {
        "type": "图文",
        "topic": "AI工具",
        "word_count": 800
    }
})
```

### 11.2 JavaScript SDK

```javascript
import { LaunchXClient } from 'launchx-sdk';

// 初始化客户端
const client = new LaunchXClient({ apiKey: 'your_api_key' });

// 创建客户
const customer = await client.customers.create({
    companyName: "示例公司",
    industry: "科技"
});

// 生成策略
const strategy = await client.strategies.generate(customer.id, {
    strategyType: "comprehensive"
});
```

---

**© 2025 LaunchX. All rights reserved.**