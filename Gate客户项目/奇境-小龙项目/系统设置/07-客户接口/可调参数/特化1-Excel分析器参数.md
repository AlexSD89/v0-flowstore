# 特化1-Excel分析器参数配置

> **客户可直接修改此文件来调整Excel分析器的行为和输出格式**

## 📊 数据质量标准

### 基础质量要求
```yaml
quality_standards:
  # 数据完整性要求 (最低百分比)
  completeness_threshold: 95

  # 数据准确性要求 (最低百分比)
  accuracy_threshold: 98

  # 数据一致性要求 (最低百分比)
  consistency_threshold: 90

  # 必须包含的列 (客户可根据业务需求修改)
  required_columns:
    - "品牌"
    - "产品名称"
    - "价格"
    - "库存数量"

  # 可选列 (增加这些列会获得更详细的分析)
  optional_columns:
    - "产品分类"
    - "供应商"
    - "上架时间"
    - "销售数量"
    - "成本价"
```

### 数据验证规则
```yaml
validation_rules:
  # 价格范围验证
  price_range:
    min: 0
    max: 999999
    allow_decimal: true

  # 库存数量验证
  stock_range:
    min: 0
    max: 999999
    allow_decimal: false

  # 品牌名称格式
  brand_format:
    min_length: 1
    max_length: 100
    allowed_characters: "中文、英文、数字、-_"
```

## 🏭 行业适配规则

### 制造业
```yaml
manufacturing:
  # 重点关注指标
  priority_metrics:
    - "库存周转率"
    - "生产效率"
    - "质量合格率"
    - "成本控制"

  # 报告格式偏好
  report_preferences:
    format: "详细分析报告"
    include_charts: true
    include_recommendations: true

  # 特殊字段映射
  field_mapping:
    "库存": "库存数量"
    "单价": "价格"
    "产品编号": "产品名称"
```

### 服务业
```yaml
service:
  # 重点关注指标
  priority_metrics:
    - "客户满意度"
    - "服务效率"
    - "成本收益比"
    - "人员利用率"

  # 报告格式偏好
  report_preferences:
    format: "简洁分析报告"
    include_charts: false
    include_recommendations: true
```

### 零售业
```yaml
retail:
  # 重点关注指标
  priority_metrics:
    - "销售额"
    - "毛利率"
    - "库存周转"
    - "客户复购率"

  # 报告格式偏好
  report_preferences:
    format: "销售分析报告"
    include_charts: true
    include_recommendations: true
```

## ⚙️ 分析优先级设置

### 分析深度
```yaml
analysis_depth:
  # 基础分析 (总是执行)
  basic_analysis:
    - "数据统计"
    - "缺失值分析"
    - "数据类型检查"

  # 标准分析 (默认执行)
  standard_analysis:
    - "品牌分析"
    - "价格分析"
    - "库存分析"
    - "趋势分析"

  # 深度分析 (可选，耗时较长)
  deep_analysis:
    - "相关性分析"
    - "异常值检测"
    - "预测模型"
    - "优化建议"
```

### 处理优先级
```yaml
processing_priority:
  # 高优先级任务 (优先处理)
  high_priority:
    - "数据清洗"
    - "关键字段提取"
    - "基础统计"

  # 中优先级任务 (正常处理)
  medium_priority:
    - "品牌分析"
    - "价格分析"
    - "库存分析"

  # 低优先级任务 (后台处理)
  low_priority:
    - "深度分析"
    - "报告生成"
    - "数据归档"
```

## 📄 输出格式规范

### 报告格式
```yaml
output_format:
  # 主报告格式
  main_report:
    format: "markdown"  # 可选: markdown, html, pdf, json
    language: "chinese"
    include_toc: true
    include_summary: true

  # 数据表格格式
  data_tables:
    format: "markdown"  # 可选: markdown, csv, excel
    include_headers: true
    max_rows: 1000

  # 图表设置
  charts:
    generate: true
    format: "png"  # 可选: png, svg, pdf
    size: "medium"  # 可选: small, medium, large
```

### 输出内容控制
```yaml
output_content:
  # 必须包含的内容
  required_sections:
    - "执行摘要"
    - "数据概览"
    - "关键发现"
    - "建议行动"

  # 可选内容
  optional_sections:
    - "详细数据分析"
    - "图表说明"
    - "技术附录"
    - "原始数据摘要"

  # 内容详细程度
  detail_level: "standard"  # 可选: brief, standard, detailed
```

## 🚀 性能优化设置

### 处理限制
```yaml
performance_limits:
  # 文件大小限制 (MB)
  max_file_size: 100

  # 行数限制
  max_rows: 100000

  # 处理时间限制 (秒)
  max_processing_time: 300

  # 内存使用限制 (MB)
  max_memory_usage: 512
```

### 并发设置
```yaml
concurrency:
  # 最大并发任务数
  max_concurrent_tasks: 3

  # 队列大小
  queue_size: 10

  # 任务超时时间 (秒)
  task_timeout: 600
```

## 🔔 通知和提醒设置

### 完成通知
```yaml
notifications:
  # 邮件通知
  email:
    enabled: false
    recipients: []

  # 系统通知
  system:
    enabled: true
    on_completion: true
    on_error: true

  # 进度报告
  progress_report:
    enabled: true
    interval: 30  # 秒
```

## 🛡️ 安全和隐私设置

### 数据隐私
```yaml
privacy:
  # 敏感信息检测
  sensitive_data_detection:
    enabled: true
    patterns:
      - "身份证号"
      - "手机号"
      - "邮箱地址"

  # 数据脱敏
  data_masking:
    enabled: false
    mask_fields: []
```

### 访问控制
```yaml
access_control:
  # 访问日志
  access_logging:
    enabled: true
    log_level: "info"

  # 操作审计
  audit_trail:
    enabled: true
    retain_days: 90
```

---

## 📝 使用说明

### 如何修改配置
1. **直接编辑**: 直接修改此文件中的参数值
2. **保存文件**: 保存后系统会自动加载新配置
3. **验证配置**: 系统会自动验证配置的有效性
4. **查看效果**: 下次分析时将使用新配置

### 配置生效时间
- **立即生效**: 质量标准、验证规则、输出格式
- **下次任务生效**: 性能优化、并发设置、通知设置
- **需要重启**: 安全和隐私设置

### 配置验证
系统会自动验证以下内容：
- 数值范围是否合理
- 格式是否正确
- 必填项是否完整
- 配置冲突检测

如有配置错误，系统会在日志中显示详细信息并提供修复建议。