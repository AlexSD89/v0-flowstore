# 小红书AI自动化平台 - 能力使用指南

> **最后更新**: 2025-10-14
> **适用对象**: Claude Code / AI Assistant
> **核心能力**: Agent OS驱动的智能代运营系统

---

## 🎯 系统能力概览

### 核心定位
**企业级小红书智能代运营SaaS平台** - Agent OS架构，95%+ AI自主运营

### 主要Agent能力
- **TrendAnalystAgent**: 趋势分析专家，爆款识别准确率>85%
- **ContentCreatorAgent**: 内容创作专家，品牌调性匹配度>90%
- **QualityControllerAgent**: 质量控制专家，AI+人工双重保障
- **DataAnalystAgent**: 数据分析专家，实时业务洞察
- **CustomerServiceAgent**: 客户服务专家，自动回复和互动

## 🔧 如何调用系统能力

### 1. Agent OS系统调用 (优先)
```python
# 优先使用 automation/ 目录下的现成自动化脚本
from automation.one_command_automation import XiaoHongShuAutomation

# 可用核心功能 (不要重新实现):
- analyze_trends()              # 趋势分析
- create_content()             # 内容创作
- quality_control()            # 质量控制
- publish_content()            # 内容发布
- data_analysis()              # 数据分析
```

### 2. 智能Agent路由
```python
# 使用 clients/launch-x/ 中的智能路由系统
from clients.launch_x.execution.launch_x_implementation_plan import LaunchXImplementation

# 自动识别任务类型并路由到最佳Agent组合
result = await launch_x.route_and_execute(
    '创建一个小红书爆款内容',
    { agent_type: 'ContentCreatorAgent', quality_check: True }
)
```

### 3. 现有工具集成
```python
# 不要重新实现这些工具，直接复用:
- automation/one_command_automation.py    # 一键自动化
- automation/claude_os_manager.py         # Claude OS管理器
- clients/launch-x/client-config.json     # 客户端配置
- automation/daily_intel_task.py          # 每日情报任务
```

## ❌ 禁止事项 (常见陷阱)

1. **不要重新实现Agent** - 优先使用 `automation/` 下的现有Agent
2. **不要绕过质量检查** - 必须通过 `QualityControllerAgent`
3. **不要忽略品牌调性** - 使用品牌匹配算法
4. **不要直接操作小红书API** - 通过Agent OS路由
5. **不要跳过数据备份** - 使用现有的备份机制

## ✅ 推荐模式

### 复用现有Agent
```python
# ✅ 正确: 复用现有Agent
automation = XiaoHongShuAutomation()
result = automation.analyze_trends(query)

# ❌ 错误: 重新造轮子
# 不要自己实现小红书趋势分析逻辑
```

### 使用智能路由
```python
# ✅ 正确: 让系统自动路由
result = await launch_x.route_and_execute(
    user_request, options
)

# ❌ 错误: 直接调用小红书API
# 不要绕过Agent OS系统
```

## 🔗 相关文件索引

- **核心自动化**: `automation/one_command_automation.py`
- **Agent管理**: `automation/claude_os_manager.py`
- **客户端配置**: `clients/launch-x/client-config.json`
- **执行计划**: `clients/launch-x/execution/launch-x_implementation_plan.md`
- **质量检查**: `clients/launch-x/execution/launch-x_quality_checklist.md`

## 📊 性能指标

- **爆款识别准确率**: >85%
- **趋势预测准确率**: >80%
- **品牌调性匹配度**: >90%
- **AI自主运营率**: 95%+
- **并发支持**: 1000+客户

## 🚀 快速开始

```bash
# 查看演示
python automation/one_command_automation.py

# 运行质量检查
python clients/launch-x/execution/launch-x_quality_checklist.md
```

## 🔐 重要限制

- **数据安全**: 客户数据严格隔离
- **API限制**: 遵守小红书API调用限制
- **内容合规**: 自动检测违规内容
- **品牌保护**: 品牌调性不可偏离

---

> **重要**: 在开发新功能前，请先检查 `automation/` 目录是否已有对应实现。优先复用现有Agent和工具，确保系统稳定性和数据安全。