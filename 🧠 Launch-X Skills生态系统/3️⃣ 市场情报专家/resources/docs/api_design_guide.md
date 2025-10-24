# 市场情报专家 - API设计指南

## API设计原则

### RESTful API设计
- **资源导向**: 以名词复数形式定义资源
- **HTTP状态码**: 使用标准HTTP状态码表示操作结果
- **版本控制**: 使用语义化版本管理
- **认证授权**: JWT Token + API Key双重认证机制

### API版本管理
- **当前版本**: v1.0.0
- **版本策略**: 主版本号.子版本号，向后兼容保证
- **弃用策略**: 提前3个版本通知，渐进式弃用

## 核心API端点

### 1. 市场分析
```
POST /api/v1/market/analyze
Content-Type: application/json
Authorization: Bearer <token>

Request Body:
{
  "analysis_type": "comprehensive",
  "market_segment": "在线教育",
  "time_horizon": "12_months",
  "competitive_landscape": true,
  "trend_analysis": true
  "risk_assessment": true
}
```

### 2. 竞争对手监控
```
GET /api/v1/competitors/monitor
Authorization: Bearer <token>

Response:
{
  "competitors": [
    {
      "name": "Coursera",
      "market_share": 0.35,
      "recent_changes": ["新增AI课程", "价格调整"]
    }
  ],
  "monitoring_period": "30_days"
}
```

### 3. 趋势数据
```
GET /api/v1/trends/market
Authorization: Bearer <token>
Response:
{
  "trends": [
    {
      "trend_name": "AI个性化学习",
      "growth_rate": 0.25,
      "confidence_level": "high"
    }
  ]
}
```

## 数据模型

### 市场分析模型
```json
{
  "market_analysis": {
    "market_size": "number",
    "growth_rate": "number",
    "competition_level": "enum[low, medium, high]"
  },
  "competitor_profile": {
    "name": "string",
    "market_share": "number",
    "strengths": ["array"],
    "weaknesses": ["array"]
  },
  "trend_analysis": {
    "trend_id": "string",
    "trend_name": "string",
    "impact_level": "enum[low, medium, high]"
  }
}
```

## 错误处理

### 标准错误响应
```json
{
  "error": {
    "code": "string",
    "message": "string",
    "details": "object"
  },
  "request_id": "string",
  "timestamp": "ISO8601"
}
```

### 错误代码定义
- `INVALID_REQUEST`: 请求参数无效
- `DATA_NOT_FOUND`: 请求的数据不存在
- `ANALYSIS_LIMIT_EXCEEDED`: 分析请求超限
- `EXTERNAL_API_ERROR`: 外部API调用失败

## 使用示例

### 市场分析调用
```bash
curl -X POST "https://api.market-intelligence.com/v1/market/analyze" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your-api-key" \
  -d '{
    "analysis_type": "comprehensive",
    "market_segment": "在线教育"
    "time_horizon": "12_months"
  }'
```

### 竞争对手监控
```bash
curl -X GET "https://api.market-intelligence.com/v1/competitors/monitor" \
  -H "Authorization: Bearer your-api-key"
```

---

*基于Launch-X市场分析框架和RESTful API最佳实践*