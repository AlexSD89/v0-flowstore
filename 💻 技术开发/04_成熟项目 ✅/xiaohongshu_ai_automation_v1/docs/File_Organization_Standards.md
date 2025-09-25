# LaunchX AI自动化系统文件组织标准

> **版本**: v1.0  
> **创建日期**: 2025-09-24  
> **适用项目**: xiaohongshu_ai_automation_v1  
> **更新时间**: `date "+%Y-%m-%d_%H%M%S"`

---

## 📁 目录结构标准

### 🏗️ 项目根目录架构
```yaml
xiaohongshu_ai_automation_v1/
├── clients/                    # 客户专属配置与资产
│   ├── {client-name}/         # 客户目录命名格式
│   │   ├── assets/            # 客户资产文件
│   │   ├── data/              # 客户数据文件  
│   │   ├── execution/         # 执行记录与日志
│   │   ├── logs/              # 运行日志
│   │   └── questions.md       # 客户配置问题单
│   └── templates/             # 客户模板库
├── automation/                # 自动化引擎核心
│   ├── claude_tasks/          # Claude任务配置
│   ├── spec-kit/              # 规格化工具包
│   └── core/                  # 核心自动化引擎
├── docs/                      # 系统文档
│   ├── api/                   # API文档
│   ├── guides/                # 使用指南
│   └── standards/             # 标准规范
├── src/                       # 源代码
│   ├── subagents/             # Subagent定义
│   ├── mcp_integrations/      # MCP集成
│   └── utils/                 # 工具函数
└── config/                    # 系统配置
    ├── mcp.json               # MCP服务配置
    └── system.yaml            # 系统配置
```

### 📋 客户目录详细结构
```yaml
clients/{client-name}/
├── client-config.json          # 客户配置文件 (核心)
├── LaunchX_{ProductName}_PRD_{date}.md  # 产品需求文档
├── assets/                     # 客户资产管理
│   ├── content/               # 内容资产
│   │   ├── Day{N}_{主题}_{date}_updated.md
│   │   └── generated/         # AI生成内容
│   ├── images/                # 图像资产
│   └── templates/             # 客户专属模板
├── data/                      # 客户数据存储
│   ├── intel/                 # 情报数据
│   ├── drafts/                # 草稿数据
│   ├── performance/           # 性能数据
│   └── analytics/             # 分析数据
├── execution/                 # 执行管理
│   ├── {client}_run_checklist.md
│   ├── automation_logs/       # 自动化日志
│   └── status.json            # 执行状态
└── logs/                      # 客户专属日志
    ├── {client}_{timestamp}.log
    └── error_reports/         # 错误报告
```

---

## 🏷️ 文件命名规范

### 📝 文档命名标准
```yaml
PRD文档:
  格式: "LaunchX_{ProductName}_PRD_{YYYY-MM-DD}.md"
  示例: "LaunchX_AI_Evaluation_Platform_PRD_2025-01-25.md"

内容策略文档:
  格式: "Day{N}_{主题描述}_{YYYY-MM-DD}_updated.md"
  示例: "Day3_企业应用AI功能专业文案内容_2025-09-24_updated.md"

运行清单:
  格式: "{client}_run_checklist.md"
  示例: "launch-x_run_checklist.md"

配置文件:
  格式: "{client}-config.json"
  示例: "launch-x-config.json"
```

### 🗂️ 资产文件命名
```yaml
图像资产:
  格式: "{功能}_{类型}_{序号}_{YYYY-MM-DD}.{ext}"
  示例: "logo_primary_01_2025-09-24.png"

内容模板:
  格式: "{平台}_{内容类型}_template_{version}.md"
  示例: "xiaohongshu_深度评测_template_v1.md"

数据文件:
  格式: "{数据类型}_{来源}_{YYYY-MM-DD}.json"
  示例: "analytics_xiaohongshu_2025-09-24.json"
```

### ⏰ 时间戳标准
```yaml
标准格式: "YYYY-MM-DD_HHMMSS"
时区: "CST (中国标准时间)"
获取命令: 'date "+%Y-%m-%d_%H%M%S"'

应用场景:
  - 日志文件: "{module}_{timestamp}.log"
  - 备份文件: "{original}_{timestamp}.backup"
  - 版本文件: "{filename}_{timestamp}.{ext}"
```

---

## 📊 文件分类与权限管理

### 🔒 安全等级分类
```yaml
核心配置文件 (Level 1):
  文件类型: "client-config.json, mcp.json, system.yaml"
  权限要求: "只读访问，需要管理员权限修改"
  备份策略: "每次修改前自动备份"
  
业务文档 (Level 2):
  文件类型: "PRD文档, 策略文档, 运行清单"
  权限要求: "读写访问，支持版本控制"
  备份策略: "重要更新时创建版本备份"
  
临时文件 (Level 3):
  文件类型: "日志文件, 缓存文件, 临时数据"
  权限要求: "系统自动管理"
  清理策略: "定期自动清理"
```

### 🗄️ 存储位置映射
```yaml
客户配置文件:
  位置: "clients/{client-name}/"
  用途: "客户专属配置和资产管理"
  访问: "客户隔离，独立管理"

系统文档:
  位置: "docs/"
  用途: "系统级文档和标准规范"
  访问: "全局共享，版本控制"

自动化引擎:
  位置: "automation/"
  用途: "核心自动化逻辑和工具"
  访问: "系统级权限，谨慎修改"

源代码:
  位置: "src/"
  用途: "核心代码和MCP集成"
  访问: "开发环境，严格版本控制"
```

---

## 🔄 自动化文件管理

### 🤖 自动生成文件规范
```yaml
自动文件生成规则:
  时间戳: "所有生成文件必须包含准确时间戳"
  项目标识: "文件名必须包含项目或客户标识"
  版本管理: "支持版本迭代和历史追踪"
  元数据: "包含完整的创建信息和用途说明"

生成文件位置验证:
  检查规则: "生成前验证目标路径存在且可写"
  权限确认: "确认MCP服务器具有访问权限"
  自动创建: "目录不存在时自动创建完整路径"
  错误处理: "路径错误时提供明确错误信息"
```

### 📋 模板系统规范
```yaml
模板文件管理:
  位置: "clients/templates/"
  命名: "{模板类型}_{平台}_{版本}.template"
  版本: "支持模板版本管理和更新"
  
模板变量标准:
  客户信息: "{{client_name}}, {{client_id}}, {{project_name}}"
  时间变量: "{{current_date}}, {{timestamp}}, {{year}}"
  内容变量: "{{title}}, {{content}}, {{tags}}"
  
模板继承规则:
  基础模板: "定义通用结构和样式"
  专业模板: "基于基础模板的专业化扩展"
  客户模板: "基于专业模板的客户定制"
```

---

## 🧹 文件生命周期管理

### ♻️ 自动清理规则
```yaml
临时文件清理:
  清理周期: "每日自动清理"
  保留期限: "临时文件保留24小时"
  清理范围: "*.tmp, *~, .cache/"
  
日志文件管理:
  压缩归档: "日志文件7天后自动压缩"
  清理周期: "压缩日志30天后删除"
  关键日志: "错误日志长期保存"
  
版本文件管理:
  版本保留: "重要文件保留5个历史版本"
  自动清理: "超过版本限制的文件自动删除"
  手动保护: "标记为重要的版本永久保留"
```

### 📈 存储空间优化
```yaml
空间监控:
  阈值设置: "存储使用率超过80%时告警"
  自动优化: "自动识别和清理大文件"
  压缩策略: "非活跃文件自动压缩"
  
备份策略:
  增量备份: "每日增量备份重要文件"
  全量备份: "每周全量备份配置文件"
  云端同步: "关键数据自动云端备份"
```

---

## ⚠️ 文件安全与合规

### 🛡️ 数据保护规范
```yaml
敏感信息保护:
  API密钥: "加密存储，不得明文保存"
  用户数据: "遵循数据保护法规"
  日志脱敏: "日志中自动脱敏敏感信息"
  
文件完整性:
  校验机制: "重要文件MD5校验"
  版本验证: "修改时验证文件完整性"
  恢复机制: "损坏文件自动恢复"
```

### 📋 合规要求
```yaml
文件审计:
  访问日志: "记录所有文件访问操作"
  修改追踪: "追踪文件修改历史"
  权限审查: "定期审查文件访问权限"
  
数据留存:
  保留政策: "按法规要求设置数据保留期"
  删除确认: "敏感数据删除需二次确认"
  审计记录: "数据删除操作完整记录"
```

---

## 🎯 实施指导

### ✅ 文件组织检查清单
```yaml
新建文件时:
  ✅ 确认文件命名符合规范
  ✅ 验证存储位置正确
  ✅ 添加必要的元数据信息
  ✅ 设置适当的访问权限
  
文件修改时:
  ✅ 创建版本备份
  ✅ 更新修改时间戳
  ✅ 记录修改原因和内容
  ✅ 验证文件完整性
  
文件删除时:
  ✅ 确认删除必要性
  ✅ 创建删除前备份
  ✅ 记录删除操作日志
  ✅ 验证关联文件影响
```

### 🔧 工具与自动化
```yaml
推荐工具:
  文件管理: "使用MCP filesystem服务"
  版本控制: "Git版本管理"
  备份工具: "rsync增量备份"
  监控工具: "inotify文件变化监控"
  
自动化脚本:
  文件命名: "auto_rename_files.py"
  路径验证: "validate_file_paths.py"
  清理任务: "cleanup_temp_files.py"
  备份任务: "backup_important_files.py"
```

---

## 📚 附录

### 🔗 相关文档
- `automation/spec-kit/bootstrap_client.py`: 客户配置自动化
- `clients/launch-x/client-config.json`: LaunchX客户配置
- `docs/api/mcp_integration.md`: MCP集成文档

### 📊 统计信息
- 标准制定日期: 2025-09-24
- 适用项目数: 1 (xiaohongshu_ai_automation_v1)
- 客户数量: 1 (launch-x)
- 预计文件数量: 100+ (首个客户完整实施)

---

**文档版本历史**:
- v1.0 (2025-09-24): 初版文件组织标准建立
- 下一版本: 基于实际使用情况优化和完善

**维护责任**: LaunchX系统管理团队
**更新频率**: 根据需求变化定期更新