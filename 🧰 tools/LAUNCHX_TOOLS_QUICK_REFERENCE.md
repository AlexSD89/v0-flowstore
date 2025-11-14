---
title: "LaunchX Spec-Kit工具快速参考"
owners: ["LaunchX Team"]
status: "active"
last_updated: 2025-11-14
related:
  - "../RULES.md"
  - "../CLAUDE.md"
  - "launchx-cli/README.md"
  - "launchx-spec-kit/README.md"
tags: ["tools", "cli", "spec-kit", "dev-docs"]
---

# LaunchX Spec-Kit工具快速参考

## 🎯 一句话定位
LaunchX Spec-Kit是**LaunchX 5步认知法的CLI执行工具**，融合思维指导与自动化执行，实现企业级AI增强开发。

## 📍 核心文件位置

### 主要工具
- **LaunchX CLI**: `@/🧰 tools/launchx-cli/lx_fixed.py`
- **Spec-Kit集成**: `@/🧰 tools/launchx-spec-kit/`
- **规则文档**: `@/RULES.md:1746-1880` (工具使用指南)
- **协作路标**: `@/CLAUDE.md:240-307` (Claude使用指南)

### Dev Docs三文件
- **计划文档**: `@/🧰 tools/launchx-cli/dev-docs/plan.md`
- **上下文**: `@/🧰 tools/launchx-cli/dev-docs/context.md`
- **任务清单**: `@/🧰 tools/launchx-cli/dev-docs/tasks.md`
- **对齐报告**: `@/🧰 tools/launchx-cli/dev-docs/rules-alignment-report.md`

## ⚡ 5分钟上手

### 1. 启动项目
```bash
cd "/Users/dangsiyuan/Documents/obsidion/launch x/🧰 tools/launchx-cli"
python3 lx_fixed.py init --here
```

### 2. 执行认知步骤
```bash
python3 lx_fixed.py collect "收集用户需求"
python3 lx_fixed.py model "设计系统架构"
python3 lx_fixed.py compare "对比技术方案"
python3 lx_fixed.py align "团队共识对齐"
python3 lx_fixed.py deliver "执行交付验证"
```

### 3. 查看结果
```bash
# 检查自动生成的文档
cat dev-docs/context.md  # SESSION PROGRESS
cat dev-docs/plan.md     # 分析和决策
cat dev-docs/tasks.md    # 任务分配
```

## 🔄 Dev Docs映射规则

| 认知步骤 | 更新文件 | 关键内容 |
|---------|---------|----------|
| **Collect** | `context.md` | SESSION PROGRESS状态 + 需求背景 |
| **Model** | `plan.md` | 系统分析 + 技术方案 |
| **Compare** | `plan.md` | 方案对比 + 风险评估 |
| **Align** | `tasks.md` | 团队共识 + 任务分配 |
| **Deliver** | 三文件 | 执行进度 + 交付成果 |

## 📋 @引用标准格式

### 必须引用的核心文件
```markdown
- CLI实现: @/🧰 tools/launchx-cli/lx_fixed.py:line_number
- 规则文档: @/RULES.md:1746-1880
- 协作路标: @/CLAUDE.md:240-307
- 功能规范: @/🧰 tools/launchx-spec-kit/specs/001-launchx-tools-domain.md
```

### Dev Docs引用格式
```markdown
- 计划更新: @/🧰 tools/launchx-cli/dev-docs/plan.md:line_number
- 上下文: @/🧰 tools/launchx-cli/dev-docs/context.md:line_number
- 任务状态: @/🧰 tools/launchx-cli/dev-docs/tasks.md:line_number
```

## 🔧 MCP工具集成

### 集成示例
```python
# 在认知步骤中集成MCP工具
def enhance_cognitive_phase(phase, input_data):
    if phase == "collect":
        return mcp__rube__RUBE_SEARCH_TOOLS(
            use_case="信息收集分析",
            known_fields=f"query:{input_data}"
        )
    elif phase == "model":
        return mcp__gemini-cli__ask-gemini(
            prompt=f"系统建模分析：{input_data}",
            changeMode=True
        )
```

### 支持的MCP工具
- **RUBE**: 企业级工具搜索和执行
- **Gate**: 金融和投资分析工具
- **Tavily**: 网络搜索和数据收集
- **Gemini**: AI分析和建模支持

## ⚙️ 配置和扩展

### 技能激活配置
```json
// .claude/settings.local.json
{
  "hooks": ["user-prompt-submit", "dev-docs-workflow"],
  "skills": {
    "trigger_words": ["launchx", "认知", "建模"],
    "config_file": "@/🧰 tools/launchx-cli/config.json"
  }
}
```

### 自定义模板
1. 编辑: `@/🧰 tools/launchx-spec-kit/templates/commands/`
2. 变量格式: `{{variable_name}}`
3. 测试: `python3 lx_fixed.py collect "测试模板"`

## 🎯 质量检查清单

### 引用验证
- [ ] 所有@引用路径存在且可访问
- [ ] 使用标准`@/path:line_number`格式
- [ ] 关键决策都有引用支撑

### 文档同步
- [ ] Dev Docs三文件自动更新
- [ ] SESSION PROGRESS状态正确
- [ ] 交叉引用链接有效

### 工具执行
- [ ] CLI命令正常执行
- [ ] 模板变量正确替换
- [ ] MCP工具集成工作正常

## 🚨 常见问题解决

### Q: 如何验证工具是否正常工作？
```bash
# 基础功能测试
python3 lx_fixed.py --test

# 检查文档生成
ls -la dev-docs/
```

### Q: MCP工具调用失败怎么办？
1. 检查MCP服务状态
2. 验证session_id格式
3. 参考`@/RULES.md:900-1000`调用规范

### Q: Dev Docs没有自动更新？
1. 检查文件权限
2. 验证模板格式
3. 查看错误日志: `logs/launchx-cli.log`

## 📚 深入学习

### 完整文档体系
- **规则总览**: `@/RULES.md` - 完整操作规程
- **协作指南**: `@/CLAUDE.md` - Claude使用指南
- **工具指南**: `@/🧰 tools/launchx-spec-kit/README.md` - 详细使用说明
- **功能规范**: `@/🧰 tools/launchx-spec-kit/specs/` - 技术需求文档

### 最佳实践参考
- **成功案例**: `@/RULES.md:1800-1890` - LaunchX集成案例
- **对齐报告**: `@/🧰 tools/launchx-cli/dev-docs/rules-alignment-report.md` - 规则对齐分析

---

**快速使用**: 复制上方命令即可开始使用LaunchX Spec-Kit工具
**技术支持**: 参考@RULES.md和@CLAUDE.md获取详细指导