# Claude Code Agent 配置管理工具 🎛️

## 🎯 核心功能：智能Agent配置和部署管理

**功能定位**：为Claude Code提供完整的Agent生成、配置、部署和管理工具链
**使用场景**：快速创建、测试、部署和维护各种类型的AI Agent
**核心价值**：标准化Agent开发流程，提升Agent质量和维护效率

---

## 🚀 Agent生成器

### 智能Agent生成脚本

```python
#!/usr/bin/env python3
"""
Claude Code Agent Generator
智能生成符合Claude Code标准的Agent配置文件
"""

import os
import yaml
from typing import Dict, List, Optional
from dataclasses import dataclass
from pathlib import Path

@dataclass
class AgentConfig:
    """Agent配置数据模型"""
    name: str
    description: str
    category: str
    tools: List[str]
    model: str = "sonnet"
    priority: str = "medium"
    color: Optional[str] = None
    department: Optional[str] = None
    trigger_keywords: List[str] = None

class ClaudeCodeAgentGenerator:
    """Claude Code Agent生成器"""
    
    AGENT_TEMPLATES = {
        "command": {
            "model": "haiku",
            "priority": "high", 
            "tools": ["Read", "Write", "Edit"],
            "description_template": "当用户说\"{keywords}\"时自动触发"
        },
        "professional": {
            "model": "sonnet",
            "priority": "medium",
            "tools": ["Read", "Write", "Edit", "Grep", "Bash"],
            "description_template": "当用户需要{domain}专业支持时触发"
        },
        "architecture": {
            "model": "opus", 
            "priority": "highest",
            "tools": ["*"],
            "description_template": "当用户需要{capability}时触发"
        }
    }
    
    CATEGORY_MAPPING = {
        # 命令层类别
        "git": "version-control",
        "docs": "documentation", 
        "test": "testing",
        "analysis": "code-analysis",
        
        # 专业层类别
        "backend": "engineering-architecture",
        "frontend": "engineering-ui", 
        "design": "design-system",
        "product": "product-management",
        "marketing": "growth-marketing",
        
        # 架构层类别
        "fullstack": "full-stack-architecture",
        "system": "system-architecture",
        "enterprise": "enterprise-architecture"
    }
    
    def generate_agent(
        self, 
        agent_type: str,
        name: str,
        domain: str,
        keywords: List[str] = None,
        **custom_config
    ) -> str:
        """
        生成Agent配置文件
        
        Args:
            agent_type: Agent类型 (command/professional/architecture)
            name: Agent名称
            domain: 专业领域
            keywords: 触发关键词
            **custom_config: 自定义配置
        
        Returns:
            生成的Agent Markdown内容
        """
        
        # 获取模板配置
        template = self.AGENT_TEMPLATES[agent_type]
        
        # 构建基础配置
        config = AgentConfig(
            name=name,
            description=self._generate_description(agent_type, domain, keywords),
            category=self._infer_category(domain),
            tools=template["tools"],
            model=template["model"],
            priority=template["priority"],
            trigger_keywords=keywords
        )
        
        # 应用自定义配置
        for key, value in custom_config.items():
            if hasattr(config, key):
                setattr(config, key, value)
        
        # 生成Markdown内容
        return self._render_agent_markdown(config, agent_type, domain)
    
    def _generate_description(
        self, 
        agent_type: str, 
        domain: str, 
        keywords: List[str]
    ) -> str:
        """生成Agent描述"""
        template = self.AGENT_TEMPLATES[agent_type]["description_template"]
        
        if agent_type == "command" and keywords:
            keyword_str = "\"、\"".join(keywords)
            return template.format(keywords=keyword_str)
        elif agent_type == "professional":
            return template.format(domain=domain)
        else:  # architecture
            capability = f"{domain}端到端解决方案"
            return template.format(capability=capability)
    
    def _infer_category(self, domain: str) -> str:
        """推断Agent类别"""
        for key, category in self.CATEGORY_MAPPING.items():
            if key.lower() in domain.lower():
                return category
        return "general-purpose"
    
    def _render_agent_markdown(
        self, 
        config: AgentConfig, 
        agent_type: str, 
        domain: str
    ) -> str:
        """渲染Agent Markdown文件"""
        
        # YAML前置部分
        yaml_config = {
            "name": config.name,
            "description": config.description,
            "category": config.category,
            "tools": config.tools,
            "model": config.model,
            "priority": config.priority
        }
        
        if config.color:
            yaml_config["color"] = config.color
        if config.department:
            yaml_config["department"] = config.department
            
        yaml_header = yaml.dump(yaml_config, default_flow_style=False)
        
        # 系统提示部分
        system_prompt = self._generate_system_prompt(agent_type, domain, config)
        
        return f"""---
{yaml_header.strip()}
---

{system_prompt}"""

    def _generate_system_prompt(
        self, 
        agent_type: str, 
        domain: str, 
        config: AgentConfig
    ) -> str:
        """生成系统提示"""
        
        if agent_type == "command":
            return self._generate_command_prompt(domain, config)
        elif agent_type == "professional":
            return self._generate_professional_prompt(domain, config)
        else:  # architecture
            return self._generate_architecture_prompt(domain, config)
    
    def _generate_command_prompt(self, domain: str, config: AgentConfig) -> str:
        """生成命令型Agent提示"""
        return f"""你是{domain}专家，专门处理{domain}相关的快速任务执行。

**核心职责**：
1. 快速识别用户意图
2. 执行标准化操作流程
3. 提供简洁的执行反馈

**工作模式**：
- 优先使用预定义流程
- 避免过度分析和讨论
- 注重执行效率和结果准确性

**示例任务**：
- [具体任务示例1]
- [具体任务示例2] 
- [具体任务示例3]"""

    def _generate_professional_prompt(self, domain: str, config: AgentConfig) -> str:
        """生成专业型Agent提示"""
        return f"""你是{domain}专家，在{domain}领域拥有深度专业知识。

**专业能力**：
- {domain}核心技术和最佳实践
- 行业标准和规范遵循
- 专业问题诊断和解决方案

**工作方法**：
1. 深度理解专业需求
2. 运用领域最佳实践
3. 提供专业化解决方案
4. 确保输出质量和标准

**协作模式**：
- 可以与其他专业Agent协作
- 在{domain}领域内有专业决策权
- 负责{domain}专业质量把关

**示例场景**：
1. **场景一**：[具体专业场景描述]
   - 输入：[典型输入示例]
   - 处理：[专业处理流程]  
   - 输出：[预期输出结果]

2. **场景二**：[另一个专业场景]
   - [详细场景说明...]"""

    def _generate_architecture_prompt(self, domain: str, config: AgentConfig) -> str:
        """生成架构型Agent提示"""
        return f"""你是{domain}架构师，负责端到端的{domain}解决方案设计和实施。

**架构能力**：
基于5阶段状态机的完整{domain}生命周期：
Discovery → Planning → Execution → Verification → Summarization

**核心组件**：
1. **需求发现**：深度理解{domain}需求和约束
2. **架构规划**：设计可扩展的{domain}架构
3. **执行协调**：并行执行和质量控制
4. **质量验证**：全面测试和性能优化
5. **交付总结**：完整文档和知识沉淀

**技术栈矩阵**：
- 简单场景：[轻量级技术栈]
- 中等场景：[均衡型技术栈]
- 复杂场景：[企业级技术栈]

**示例项目**：
完整的{domain}项目开发案例，展示从需求到交付的全流程能力。"""

# 使用示例
def main():
    generator = ClaudeCodeAgentGenerator()
    
    # 生成命令型Agent
    git_agent = generator.generate_agent(
        agent_type="command",
        name="git-commit-helper", 
        domain="Git版本控制",
        keywords=["提交代码", "commit", "生成提交信息"]
    )
    
    # 生成专业型Agent  
    backend_agent = generator.generate_agent(
        agent_type="professional",
        name="backend-architect",
        domain="后端架构",
        color="#8b5cf6",
        department="engineering"
    )
    
    # 生成架构型Agent
    fullstack_agent = generator.generate_agent(
        agent_type="architecture", 
        name="fullstack-project-architect",
        domain="全栈项目"
    )
    
    # 保存到文件
    agents_dir = Path("~/.claude/agents").expanduser()
    agents_dir.mkdir(parents=True, exist_ok=True)
    
    with open(agents_dir / "git-commit-helper.md", "w") as f:
        f.write(git_agent)
        
    with open(agents_dir / "backend-architect.md", "w") as f:
        f.write(backend_agent)
        
    with open(agents_dir / "fullstack-project-architect.md", "w") as f:
        f.write(fullstack_agent)
    
    print("✅ Agents生成完成！")

if __name__ == "__main__":
    main()
```

---

## 🔧 Agent配置验证工具

```python
class AgentValidator:
    """Agent配置验证器"""
    
    REQUIRED_FIELDS = ["name", "description", "category"]
    VALID_MODELS = ["haiku", "sonnet", "opus"]
    VALID_PRIORITIES = ["low", "medium", "high", "highest"]
    
    def validate_agent_file(self, file_path: Path) -> Dict[str, List[str]]:
        """
        验证Agent配置文件
        
        Returns:
            验证结果字典 {"errors": [...], "warnings": [...]}
        """
        errors = []
        warnings = []
        
        try:
            content = file_path.read_text()
            yaml_part, prompt_part = content.split("---\n", 2)[1:]
            
            # 验证YAML配置
            config = yaml.safe_load(yaml_part)
            errors.extend(self._validate_yaml_config(config))
            
            # 验证提示内容
            warnings.extend(self._validate_prompt_content(prompt_part))
            
        except Exception as e:
            errors.append(f"文件解析错误: {str(e)}")
        
        return {"errors": errors, "warnings": warnings}
    
    def _validate_yaml_config(self, config: dict) -> List[str]:
        """验证YAML配置"""
        errors = []
        
        # 检查必需字段
        for field in self.REQUIRED_FIELDS:
            if field not in config:
                errors.append(f"缺少必需字段: {field}")
        
        # 验证模型选择
        if "model" in config and config["model"] not in self.VALID_MODELS:
            errors.append(f"无效的模型选择: {config['model']}")
        
        # 验证优先级
        if "priority" in config and config["priority"] not in self.VALID_PRIORITIES:
            errors.append(f"无效的优先级: {config['priority']}")
        
        # 验证工具配置
        if "tools" in config:
            tools = config["tools"]
            if isinstance(tools, str) and tools != "*":
                errors.append("工具配置应为列表或'*'")
        
        return errors
    
    def _validate_prompt_content(self, prompt: str) -> List[str]:
        """验证提示内容"""
        warnings = []
        
        # 检查提示长度
        if len(prompt) < 200:
            warnings.append("提示内容可能过短，建议添加更多详细说明")
        
        # 检查示例场景
        if "示例" not in prompt and "场景" not in prompt:
            warnings.append("建议添加具体使用示例或场景说明")
        
        # 检查工作流程
        if "工作流程" not in prompt and "职责" not in prompt:
            warnings.append("建议明确说明工作流程或核心职责")
        
        return warnings

# 批量验证工具
def validate_all_agents(agents_dir: Path = Path("~/.claude/agents")):
    """批量验证所有Agent配置"""
    validator = AgentValidator()
    agents_dir = agents_dir.expanduser()
    
    results = {}
    for agent_file in agents_dir.glob("*.md"):
        result = validator.validate_agent_file(agent_file)
        if result["errors"] or result["warnings"]:
            results[agent_file.name] = result
    
    # 输出验证报告
    if results:
        print("🔍 Agent配置验证报告:")
        for filename, result in results.items():
            print(f"\n📄 {filename}:")
            
            if result["errors"]:
                print("  ❌ 错误:")
                for error in result["errors"]:
                    print(f"    - {error}")
            
            if result["warnings"]:
                print("  ⚠️  警告:")
                for warning in result["warnings"]:
                    print(f"    - {warning}")
    else:
        print("✅ 所有Agent配置验证通过！")
```

---

## 📊 Agent性能监控

```python
import time
import json
from datetime import datetime
from collections import defaultdict

class AgentMonitor:
    """Agent性能监控器"""
    
    def __init__(self, log_file: Path = Path("~/.claude/logs/agent-metrics.json")):
        self.log_file = log_file.expanduser()
        self.log_file.parent.mkdir(parents=True, exist_ok=True)
        self.metrics = defaultdict(list)
    
    def log_agent_usage(
        self, 
        agent_name: str, 
        task_type: str,
        execution_time: float,
        success: bool,
        user_rating: Optional[int] = None
    ):
        """记录Agent使用情况"""
        
        metric = {
            "timestamp": datetime.now().isoformat(),
            "agent_name": agent_name,
            "task_type": task_type, 
            "execution_time": execution_time,
            "success": success,
            "user_rating": user_rating
        }
        
        # 内存中累积
        self.metrics[agent_name].append(metric)
        
        # 持久化到文件
        self._save_metrics()
    
    def generate_performance_report(self) -> Dict:
        """生成性能报告"""
        
        report = {
            "generated_at": datetime.now().isoformat(),
            "agents": {}
        }
        
        for agent_name, metrics in self.metrics.items():
            total_uses = len(metrics)
            successful_uses = sum(1 for m in metrics if m["success"])
            avg_execution_time = sum(m["execution_time"] for m in metrics) / total_uses
            
            ratings = [m["user_rating"] for m in metrics if m["user_rating"]]
            avg_rating = sum(ratings) / len(ratings) if ratings else None
            
            report["agents"][agent_name] = {
                "total_uses": total_uses,
                "success_rate": successful_uses / total_uses,
                "avg_execution_time": avg_execution_time,
                "avg_user_rating": avg_rating,
                "last_used": max(m["timestamp"] for m in metrics)
            }
        
        return report
    
    def _save_metrics(self):
        """保存指标到文件"""
        with open(self.log_file, "w") as f:
            json.dump(dict(self.metrics), f, indent=2)
    
    def load_metrics(self):
        """从文件加载指标"""
        if self.log_file.exists():
            with open(self.log_file) as f:
                data = json.load(f)
                self.metrics = defaultdict(list, data)

# 使用示例
monitor = AgentMonitor()

# 记录Agent使用
monitor.log_agent_usage(
    agent_name="git-commit-helper",
    task_type="commit_generation", 
    execution_time=1.2,
    success=True,
    user_rating=5
)

# 生成性能报告
report = monitor.generate_performance_report()
print("📊 Agent性能报告:")
print(json.dumps(report, indent=2))
```

---

## 🚀 一键部署脚本

```bash
#!/bin/bash
# Claude Code Agent 一键部署脚本

set -e

echo "🚀 开始部署Claude Code Agent系统..."

# 创建目录结构
echo "📁 创建目录结构..."
mkdir -p ~/.claude/agents/{command-layer,professional-layer,architecture-layer}
mkdir -p ~/.claude/commands/
mkdir -p ~/.claude/logs/
mkdir -p ~/.claude/templates/

# 下载Agent模板
echo "📥 下载Agent模板..."
curl -sSL https://raw.githubusercontent.com/launchx/claude-agents/main/templates.tar.gz | tar -xz -C ~/.claude/templates/

# 生成基础Agent
echo "🤖 生成基础Agent..."
python3 ~/.claude/templates/generate_base_agents.py

# 验证配置
echo "✅ 验证Agent配置..."
python3 ~/.claude/templates/validate_agents.py

# 设置权限
echo "🔒 设置文件权限..."
chmod 755 ~/.claude/agents/*.md
chmod 755 ~/.claude/commands/*.md

# 重启Claude Code（如果在运行）
echo "🔄 重启Claude Code以加载新Agent..."
if pgrep -f "claude-code" > /dev/null; then
    echo "检测到Claude Code正在运行，请手动重启以加载新Agent"
else
    echo "Claude Code未运行，Agent已准备就绪"
fi

echo "🎉 Agent系统部署完成！"
echo ""
echo "📋 已部署的Agent："
echo "  命令层: $(ls ~/.claude/agents/command-layer/*.md | wc -l) 个"
echo "  专业层: $(ls ~/.claude/agents/professional-layer/*.md | wc -l) 个"  
echo "  架构层: $(ls ~/.claude/agents/architecture-layer/*.md | wc -l) 个"
echo ""
echo "🔧 管理命令："
echo "  验证配置: python3 ~/.claude/templates/validate_agents.py"
echo "  性能报告: python3 ~/.claude/templates/performance_report.py"
echo "  生成新Agent: python3 ~/.claude/templates/agent_generator.py"
```

---

## 📋 Agent管理最佳实践

### 1. Agent命名规范
```yaml
命名格式: {domain}-{role}-{type}

示例:
  git-commit-helper     # Git领域的提交助手
  backend-architect     # 后端领域的架构师  
  fullstack-project-architect # 全栈项目架构师

规则:
  - 使用小写字母和连字符
  - 名称要简洁但描述清晰
  - 避免与现有Agent重名
```

### 2. 类别组织策略
```yaml
目录结构:
  ~/.claude/agents/
    command-layer/        # 命令型Agent
      git-*.md
      docs-*.md
      test-*.md
    professional-layer/   # 专业型Agent
      engineering/
      design/ 
      product/
      marketing/
    architecture-layer/   # 架构型Agent
      fullstack-*.md
      system-*.md
```

### 3. 配置更新流程
```bash
# Agent配置更新流程
1. 修改Agent配置文件
2. 运行验证检查
   python3 ~/.claude/templates/validate_agents.py
3. 测试Agent功能
4. 重启Claude Code
5. 监控性能表现
```

### 4. 版本控制
```bash
# 将Agent配置纳入版本控制
cd ~/.claude/
git init
git add agents/ commands/ templates/
git commit -m "feat: initialize Claude Code agent system"

# 配置变更时
git add .
git commit -m "feat(agents): add new backend-architect agent"
```

---

## 🎯 总结

这套Agent配置管理工具为Claude Code提供了：

1. **标准化生成**：三种Agent类型的模板化生成
2. **质量保证**：配置验证和最佳实践检查  
3. **性能监控**：使用情况和效果跟踪
4. **一键部署**：自动化安装和配置流程
5. **版本管理**：配置变更的版本控制

通过这套工具链，可以快速构建、部署和维护高质量的Claude Code Agent生态系统！

---

*最后更新: 2025-01-27*
*工具版本: v1.0*