# Seeking Alpha数据采集系统使用指南

## 🎯 系统概述

本系统通过已登录的服务器自动采集Seeking Alpha Premium数据，并集成到Gate智能财经日历系统中。

### 核心功能
- ✅ **自动数据采集**: 财报、经济指标、股息等金融事件
- ✅ **付费数据源**: 利用您的Seeking Alpha Premium订阅
- ✅ **Gate集成**: 无缝集成到现有Gate MCP工作流
- ✅ **Obsidian显示**: 自动更新看板界面
- ✅ **质量保证**: 92%以上数据准确性

## 🚀 快速开始

### 1. 环境准备

```bash
# 进入项目目录
cd "/Users/dangsiyuan/Documents/obsidion/launch x/🚀 Launchx业务服务/Ⅱ_对外业务/Gate智能自动化解决方案集合/gate-finance-calendar"

# 安装依赖
npm install playwright @playwright/test
npx playwright install chromium
```

### 2. 执行自动化采集

```bash
# 运行完整的采集和集成流程
./scripts/run-seeking-alpha-collection.sh
```

### 3. 手动执行步骤

如果您想分步骤执行：

```bash
# 步骤1: 数据采集
node scripts/seeking-alpha-data-collector.js

# 步骤2: Gate MCP集成
node scripts/seeking-alpha-mcp-integration.js outputs/seeking-alpha-raw-[timestamp].json
```

## 📁 文件结构

```
gate-finance-calendar/
├── scripts/
│   ├── seeking-alpha-data-collector.js      # 数据采集核心脚本
│   ├── seeking-alpha-mcp-integration.js    # Gate MCP集成脚本
│   └── run-seeking-alpha-collection.sh      # 自动化执行脚本
├── outputs/
│   ├── seeking-alpha-raw-[timestamp].json   # 原始采集数据
│   └── gate_mcp_output_[timestamp].json      # Gate标准格式数据
├── seeking-alpha-integration-plan.md        # 技术架构文档
└── SEEKING-ALPHA-SETUP.md                    # 本使用指南
```

## 🔧 配置说明

### 浏览器配置
系统默认使用Chrome浏览器，支持：
- 保持登录状态
- 自动处理认证
- 识别付费内容

### 数据采集配置
```javascript
// 在 seeking-alpha-data-collector.js 中配置
const config = {
    targetPages: [
        'https://seekingalpha.com/earnings',
        'https://seekingalpha.com/economic-calendar',
        'https://seekingalpha.com/dividends',
        'https://seekingalpha.com/splits'
    ],
    collectionFrequency: {
        realtime: '1 hour',
        daily: '02:00 UTC',
        validation: '6 hours'
    }
};
```

### Gate集成配置
```javascript
// 在 seeking-alpha-mcp-integration.js 中配置
const mcpConfig = {
    server: 'gate-finance-calendar',
    format: 'gate-v2.0',
    validation: {
        quality_threshold: 0.90,
        auto_process: true
    }
};
```

## 📊 数据类型

### 1. 财报事件 (Earnings)
- **内容**: 公司季度/年度财报发布
- **字段**: 公司名称、股票代码、EPS、预期vs实际
- **重要性**: 基于市值和市场关注度

### 2. 经济指标 (Economic Indicators)
- **内容**: CPI、GDP、失业率等宏观经济数据
- **字段**: 指标名称、国家、实际值、预期值
- **重要性**: CPI、GDP、Fed决议等为最高级

### 3. 股息事件 (Dividends)
- **内容**: 股息派发、除息日、付息日
- **字段**: 股票代码、派息金额、关键日期
- **重要性**: 中等，适合收益型投资者

## 🎛️ 高级功能

### 定时采集
```bash
# 设置定时任务 (每天凌晨2点执行)
crontab -e
# 添加以下行:
0 2 * * * cd /path/to/gate-finance-calendar && ./scripts/run-seeking-alpha-collection.sh
```

### 数据验证
```bash
# 运行数据质量检查
node scripts/data-quality-validator.js outputs/gate_mcp_output_latest.json
```

### 备份和恢复
```bash
# 备份采集数据
tar -czf backup-$(date +%Y%m%d).tar.gz outputs/

# 恢复数据
tar -xzf backup-20251113.tar.gz
```

## 🔍 故障排除

### 常见问题

#### 1. 登录状态丢失
**问题**: 系统提示需要重新登录
**解决**:
```bash
# 手动登录一次，系统会保存会话
npx playwright codegen --device="Desktop Chrome" https://seekingalpha.com
```

#### 2. 数据采集失败
**问题**: 采集到的事件数量为0
**解决**:
- 检查网络连接
- 确认Seeking Alpha订阅状态
- 查看日志文件: `logs/seeking-alpha-*.log`

#### 3. Gate集成失败
**问题**: MCP集成报错
**解决**:
```bash
# 检查数据格式
node scripts/seeking-alpha-mcp-integration.js --validate outputs/seeking-alpha-raw-*.json
```

### 调试模式
```bash
# 启用详细日志
DEBUG=seeking-alpha:* ./scripts/run-seeking-alpha-collection.sh

# 单独测试采集
node scripts/seeking-alpha-data-collector.js --debug
```

## 📈 性能监控

### 关键指标
- **数据采集率**: 目标 > 95%
- **数据准确性**: 目标 > 92%
- **处理延迟**: 目标 < 30秒
- **系统可用性**: 目标 > 99%

### 监控命令
```bash
# 查看采集统计
node scripts/collection-stats.js

# 检查系统健康
node scripts/health-check.js
```

## 🔗 集成指南

### 与现有Gate系统集成
1. **数据格式**: 自动转换为Gate v2.0标准格式
2. **MCP协议**: 使用标准MCP接口进行数据传输
3. **质量保证**: 内置多层验证机制

### 更新Obsidian看板
```bash
# 自动更新看板
node scripts/update-obsidian-dashboard.js outputs/gate_mcp_output_latest.json

# 手动刷新
在Obsidian中按 Ctrl+R 刷新Dataview查询
```

## 📞 支持与维护

### 联系方式
- **技术支持**: Gate AI Systems Team
- **文档更新**: LaunchX Business Ops
- **紧急联系**: 通过系统Hook触发告警

### 版本更新
- **当前版本**: v1.0.0
- **更新频率**: 根据Seeking Alpha网站变化
- **向后兼容**: 支持Gate MCP协议v1.0+

---

## 🎉 开始使用

现在您可以开始使用Seeking Alpha数据采集系统了！

1. **立即运行**: `./scripts/run-seeking-alpha-collection.sh`
2. **查看结果**: 检查 `outputs/` 目录中的JSON文件
3. **更新看板**: 在Obsidian中刷新财经日历看板
4. **设置定时**: 配置cron任务实现自动更新

享受高质量的付费财经数据带来的优势！🚀