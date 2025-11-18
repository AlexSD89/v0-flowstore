#!/usr/bin/env python3
"""
LaunchX Spec-Kit CLI - 基于Spec-Kit架构的LaunchX开发方法论执行工具

在保留原始 Spec-Kit 能力的前提下，融合 LaunchX 5 步认知法与 Dev Docs 三文件工作流。
"""

import os
import sys
import subprocess
import shutil
from pathlib import Path
from typing import Dict, Any, List
from datetime import datetime

# 简化实现，避免外部依赖
class SimpleConsole:
    @staticmethod
    def print(text: str, color: str = "white"):
        """简化的控制台输出"""
        colors = {
            "red": "\033[31m",
            "green": "\033[32m",
            "yellow": "\033[33m",
            "blue": "\033[34m",
            "cyan": "\033[36m",
            "white": "\033[37m",
            "bright_blue": "\033[94m",
            "reset": "\033[0m"
        }

        if color in colors:
            print(f"{colors[color]}{text}{colors['reset']}")
        else:
            print(text)

    @staticmethod
    def success(text: str):
        SimpleConsole.print(f"✓ {text}", "green")

    @staticmethod
    def error(text: str):
        SimpleConsole.print(f"✗ {text}", "red")

    @staticmethod
    def info(text: str):
        SimpleConsole.print(f"ℹ {text}", "blue")

    @staticmethod
    def warning(text: str):
        SimpleConsole.print(f"⚠ {text}", "yellow")

class StepTracker:
    """简化的步骤跟踪器"""
    def __init__(self, title: str):
        self.title = title
        self.steps = []
        self.status_order = {"pending": 0, "running": 1, "done": 2, "error": 3}

    def add(self, key: str, label: str):
        if key not in [s["key"] for s in self.steps]:
            self.steps.append({"key": key, "label": label, "status": "pending", "detail": ""})

    def start(self, key: str, detail: str = ""):
        self._update(key, "running", detail)

    def complete(self, key: str, detail: str = ""):
        self._update(key, "done", detail)

    def error(self, key: str, detail: str = ""):
        self._update(key, "error", detail)

    def _update(self, key: str, status: str, detail: str):
        for s in self.steps:
            if s["key"] == key:
                s["status"] = status
                if detail:
                    s["detail"] = detail
                return
        self.steps.append({"key": key, "label": key, "status": status, "detail": detail})

    def render(self):
        SimpleConsole.print(f"\n{self.title}")
        for step in self.steps:
            status = step["status"]
            if status == "done":
                symbol = "✓"
                color = "green"
            elif status == "pending":
                symbol = "○"
                color = "white"
            elif status == "running":
                symbol = "⟳"
                color = "blue"
            elif status == "error":
                symbol = "✗"
                color = "red"
            else:
                symbol = "○"
                color = "white"

            detail_text = f" ({step['detail']})" if step["detail"] else ""
            SimpleConsole.print(f"  {symbol} {step['label']}{detail_text}", color)

class RulesManager:
    """规则文件管理器 - 负责感知和引用LaunchX规则文档"""

    def __init__(self):
        self.project_root = Path("/Users/dangsiyuan/Documents/obsidion/launch x")
        self.rules_file = self.project_root / "RULES.md"
        self.claude_file = self.project_root / "CLAUDE.md"
        self.quick_ref = self.project_root / "🧰 tools" / "LAUNCHX_TOOLS_QUICK_REFERENCE.md"

    def get_rule_reference(self, section: str, line_range: str = "") -> str:
        """获取规则引用"""
        if self.rules_file.exists():
            if line_range:
                # 若显式提供了行范围，优先使用显式配置，便于与RULES.md中的说明保持一致
                return f"@/RULES.md:{line_range}"
            return f"@/RULES.md:{self._find_section_line(self.rules_file, section)}"
        return "@/RULES.md:section"

    def get_claude_reference(self, section: str = "", line_range: str = "") -> str:
        """获取Claude协作路标引用"""
        if self.claude_file.exists():
            if section:
                if line_range:
                    return f"@/CLAUDE.md:{line_range}"
                return f"@/CLAUDE.md:{self._find_section_line(self.claude_file, section)}"
            return f"@/CLAUDE.md:section"
        return "@/CLAUDE.md"

    def check_rules_exist(self) -> bool:
        """检查规则文件是否存在"""
        return self.rules_file.exists() and self.claude_file.exists()

    def get_available_references(self) -> Dict[str, str]:
        """获取可用的规则引用"""
        if not self.check_rules_exist():
            return {}

        return {
            "rules_main": self.get_rule_reference("工具使用指南", "1746-1880"),
            "claude_guide": self.get_claude_reference("工具执行指南", "240-307"),
            "quick_reference": f"@/🧰 tools/LAUNCHX_TOOLS_QUICK_REFERENCE.md:1"
        }

    def _find_section_line(self, file_path: Path, section_name: str) -> int:
        """查找章节行号（简化实现）"""
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                lines = f.readlines()
                for i, line in enumerate(lines, 1):
                    if section_name in line and ('##' in line or '###' in line):
                        return i
        except Exception:
            pass
        return 1

    def show_rules_status(self):
        """显示规则文件状态"""
        if self.check_rules_exist():
            print(f"✅ 规则文件已就绪")
            print(f"   RULES.md: {self.rules_file}")
            print(f"   CLAUDE.md: {self.claude_file}")
            refs = self.get_available_references()
            print(f"   可用引用: {len(refs)} 个")
        else:
            print("⚠️  规则文件未找到")


class LaunchXCLI:
    """LaunchX CLI核心类"""

    def __init__(self):
        self.project_root = Path.cwd()
        self.templates_dir = Path(__file__).parent / "templates"
        self.memory_dir = Path(__file__).parent / "memory"
        self.console = SimpleConsole()
        self.rules_manager = RulesManager()

        # 确保目录存在
        self.templates_dir.mkdir(exist_ok=True)
        self.memory_dir.mkdir(exist_ok=True)

        # LaunchX 5步认知法映射
        self.cognitive_steps = [
            "collect",    # 收集信息
            "model",      # 建模分析
            "compare",    # 对比方案
            "align",      # 对齐共识
            "deliver"     # 交付执行
        ]

    def show_banner(self):
        """显示LaunchX横幅"""
        banner = """
    ███████╗ ██████╗  █████╗ ████████╗██╗   ██╗██╗███╗   ██╗    ███████╗ █████╗ ██╗
   ██╔════╝██╔══██╗██╔══██╗██╔════╝██║   ██║██║████╗  ██║    ██╔════╝██╔══██╗██║
   ███████╗██████╔╝███████║██║     ██║   ██║██║██╔██╗ ██║    █████╗  ██████╔╝██║
   ╚════██║██╔═══╝ ██╔══██║██║     ██║   ██║██║██║╚██╗██║    ██╔══╝  ██╔═══╝ ██║
   ███████║██║     ██║  ██║╚██████╗╚█████╔╝██║██║ ╚████║    ██║     ████████╗██║
   ╚══════╝╚═╝     ╚═╝  ╚═╝ ╚═════╝ ╚═════╝ ╚═╝╚═╝  ╚═══╝    ╚═╝     ╚══════╝╚═╝

        LaunchX Development Methodology CLI
        融合5步认知法与Spec-Kit执行框架
        """
        self.console.print(banner.strip(), "cyan")
        print()

    def _print_rules_references(self):
        """在CLI输出中附带规则与指南的引用，方便人工回溯"""
        try:
            if not self.rules_manager.check_rules_exist():
                self.console.warning("未检测到根级 RULES.md / CLAUDE.md，建议检查仓库路径。")
                return

            refs = self.rules_manager.get_available_references()
            if not refs:
                return

            self.console.info("关联规则参考：")
            for key, ref in refs.items():
                label = {
                    "rules_main": "工具使用指南",
                    "claude_guide": "Claude工具执行指南",
                    "quick_reference": "工具快速上手清单"
                }.get(key, key)
                self.console.print(f"  - {label}: {ref}", "cyan")
        except Exception:
            # 规则引用失败不影响CLI主流程，静默降级
            return

    def run_command(self, cmd: list[str], check_return: bool = True) -> bool:
        """执行系统命令"""
        try:
            result = subprocess.run(cmd, check=check_return, capture_output=True, text=True)
            return result.returncode == 0
        except subprocess.CalledProcessError as e:
            self.console.error(f"Command failed: {' '.join(cmd)}")
            self.console.error(f"Error: {e.stderr}")
            return False

    def init_project(self, here: bool = False):
        """初始化LaunchX项目"""
        self.show_banner()
        tracker = StepTracker("Initialize LaunchX Project")

        # 添加步骤
        for step in ["check_environment", "create_structure", "setup_templates", "initialize_dev_docs", "final"]:
            tracker.add(step, step.replace('_', ' ').title())

        tracker.start("check_environment")

        # 检查Git
        git_available = shutil.which("git") is not None
        if not git_available:
            tracker.error("check_environment", "Git not found")
        else:
            tracker.complete("check_environment", "Git available")

        tracker.start("create_structure")

        # 创建项目结构
        dirs_to_create = [
            "dev-docs",
            "memory",
            "templates",
            "scripts",
            "logs",
            "tests"
        ]

        for dir_name in dirs_to_create:
            dir_path = self.project_root / dir_name
            dir_path.mkdir(exist_ok=True)

        tracker.complete("create_structure", f"Created {len(dirs_to_create)} directories")

        tracker.start("setup_templates")

        # 创建LaunchX模板
        self._create_templates()
        tracker.complete("setup_templates", "LaunchX templates created")

        tracker.start("initialize_dev_docs")

        # 初始化Dev Docs
        self._initialize_dev_docs()
        tracker.complete("initialize_dev_docs", "Dev Docs initialized")

        tracker.complete("final", "Project ready")

        # 显示结果
        tracker.render()
        # 附带规则引用，方便后续查阅
        self._print_rules_references()
        self.console.success("LaunchX CLI项目初始化完成！")

        # 显示下一步
        self.console.print("\n下一步操作:")
        self.console.print("  1. lx collect - 开始5步认知法：收集信息")
        self.console.print("  2. lx model   - 建模分析")
        self.console.print(" 3. lx compare - 对比方案")
        self.console.print(" 4. lx align   - 对齐共识")
        self.console.print(" 5. lx deliver - 交付执行")

    def _create_templates(self):
        """创建LaunchX模板"""

        # 创建认知法模板
        collect_template = f"""---
title: "收集阶段 - 信息收集与分析"
description: "LaunchX 5步认知法第一步：收集项目信息、用户需求和现有资产"
phase: "collect"
last_updated: {datetime.now().strftime('%Y-%m-%d')}
---

## 任务概述
此阶段专注于系统性收集和分析项目相关信息。

## 核心活动
- [ ] 理解用户需求和业务背景
- [ ] 检索现有项目资产（Dev Docs、memory-bank等）
- [ ] 分析技术约束和环境要求
- [ ] 收集历史决策和经验教训
- [ ] 识别关键利益相关者

## 输出产物
- 项目背景文档
- 需求分析报告
- 资产清单和复用策略
- 风险评估

## 质量标准
- [ ] 所有信息源已验证
- [ ] 资产复用策略明确
- [ ] 风险识别完整
"""

        with open(self.templates_dir / "collect.md", 'w', encoding='utf-8') as f:
            f.write(collect_template)

        # 为其他步骤创建类似模板
        steps = ["model", "compare", "align", "deliver"]
        for step in steps:
            step_name = step.title()
            template = f"""---
title: "{step_name}阶段 - {step_name}描述"
phase: "{step}"
last_updated: {datetime.now().strftime('%Y-%m-%d')}
---

## 任务概述
此阶段专注于{step_name}描述。

## 核心活动
- [ ] {step_name}相关分析
- [ ] 方案生成和评估
- [ ] 风险评估

## 输出产物
- {step_name}分析报告
- 决策文档

## 质量标准
- [ ] 分析深度充分
- [ ] 方案可执行性验证
"""
            with open(self.templates_dir / f"{step}.md", 'w', encoding='utf-8') as f:
                f.write(template)

    def _initialize_dev_docs(self):
        """初始化Dev Docs系统"""

        dev_docs_dir = self.project_root / "dev-docs"

        # 创建plan.md
        plan_content = f"""---
title: "LaunchX项目开发计划"
owners: ["LaunchX Team"]
status: "active"
last_updated: {datetime.now().strftime('%Y-%m-%d')}
phase: "planning"
---

# 项目开发计划

## 项目概览
- **项目名称**: LaunchX CLI
- **创建日期**: {datetime.now().strftime('%Y-%m-%d')}
- **项目目标**: 融合5步认知法与Spec-Kit执行框架的企业级开发工具

## 开发阶段
### Phase 1: 基础架构 (Week 1-2)
- [x] 项目初始化
- [ ] CLI核心框架
- [ ] 模板系统
- [ ] Dev Docs集成

### Phase 2: 功能开发 (Week 3-4)
- [ ] 5步认知法命令实现
- [ ] 质量保障机制
- [ ] 用户交互优化

### Phase 3: 集成测试 (Week 5-6)
- [ ] 端到端测试
- [ ] 性能优化
- [ ] 文档完善

## 风险矩阵
| 风险 | 影响 | 概率 | 缓解措施 |
|------|------|------|----------|
| 技术复杂性 | 高 | 中 | 分阶段开发 |
| 用户接受度 | 中 | 中 | 早期用户反馈 |
| 性能要求 | 中 | 低 | 性能测试 |
"""

        with open(dev_docs_dir / "plan.md", 'w', encoding='utf-8') as f:
            f.write(plan_content)

        # 创建context.md
        context_content = f"""---
title: "LaunchX项目上下文"
owners: ["LaunchX Team"]
status: "active"
last_updated: {datetime.now().strftime('%Y-%m-%d')}
---

# 项目上下文

## SESSION PROGRESS
- ✅ **Completed**: 项目初始化
- 🟡 **In Progress**: CLI核心开发
- ⚠️ **Blockers**: 无

## 关键文件
- `/lx.py`: 主CLI入口
- `/templates/`: LaunchX模板库
- `/dev-docs/`: 开发文档
- `/memory/`: 项目记忆

## 技术栈
- **语言**: Python 3.11+
- **架构**: 基于Spec-Kit执行框架
- **理念**: LaunchX 5步认知法
"""

        with open(dev_docs_dir / "context.md", 'w', encoding='utf-8') as f:
            f.write(context_content)

        # 创建tasks.md
        tasks_content = f"""---
title: "LaunchX开发任务清单"
owners: ["LaunchX Team"]
status: "active"
last_updated: {datetime.now().strftime('%Y-%m-%d')}
---

# 开发任务清单

## Phase 1: 基础架构 (Week 1-2)
### 任务1.1: CLI核心框架 [负责人: TBD]
- [x] 创建基础CLI结构
- [ ] 实现5步认知法命令
- [ ] 添加参数解析和验证
- [ ] 集成进度跟踪

### 任务1.2: 模板系统 [负责人: TBD]
- [x] 创建基础模板结构
- [ ] 实现5步认知法模板
- [ ] 添加模板变量替换
- [ ] 验证模板一致性

### 任务1.3: Dev Docs集成 [负责人: TBD]
- [x] 创建三文件结构
- [ ] 实现文档自动更新
- [ ] 添加交叉引用检查
- [ ] 测试文档完整性

## 验收标准
- CLI命令正常执行
- 模板系统工作正常
- Dev Docs自动更新
- 用户交互友好
"""

        with open(dev_docs_dir / "tasks.md", 'w', encoding='utf-8') as f:
            f.write(tasks_content)

    def run_cognitive_step(self, step: str, *args):
        """执行认知步骤"""
        if step not in self.cognitive_steps:
            self.console.error(f"未知的认知步骤: {step}")
            return

        template_file = self.templates_dir / f"{step}.md"
        if not template_file.exists():
            self.console.error(f"模板文件不存在: {template_file}")
            return

        self.console.info(f"开始执行{step.title()}阶段...")

        # 读取模板
        with open(template_file, 'r', encoding='utf-8') as f:
            template_content = f.read()

        # 简单的变量替换
        variables = {
            "date": datetime.now().strftime('%Y-%m-%d'),
            "args": " ".join(args) if args else ""
        }

        for var, value in variables.items():
            template_content = template_content.replace("{{" + var + "}}", value)

        # 输出到Dev Docs
        output_file = self.project_root / "dev-docs" / f"{step}_output.md"
        with open(output_file, 'w', encoding='utf-8') as f:
            f.write(template_content)

        self.console.success(f"{step.title()}阶段完成！输出: {output_file}")

        # 更新context.md
        self._update_context(step, "completed", output_file)
        # 输出关联规则，便于人工追踪
        self._print_rules_references()

    def _update_context(self, step: str, status: str, output_file: Path):
        """更新context.md"""
        context_file = self.project_root / "dev-docs" / "context.md"

        with open(context_file, 'r', encoding='utf-8') as f:
            context_content = f.read()

        # 更新进度状态
        step_name = step.title()
        if status == "completed":
            progress_marker = "✅"
        elif status == "in_progress":
            progress_marker = "🟡"
        else:
            progress_marker = "⚠️"

        # 简单的文本替换
        context_content = context_content.replace(
            "- 🟡 **In Progress**: CLI核心开发",
            f"- {progress_marker} **{step_name}**: {status.title()}"
        )

        with open(context_file, 'w', encoding='utf-8') as f:
            f.write(context_content)

def main():
    """主入口函数"""
    import sys

    cli = LaunchXCLI()

    if len(sys.argv) < 2:
        cli.show_banner()
        cli.console.info("使用方法:")
        cli.console.info("  lx init [--here]              # 初始化项目")
        cli.console.info("  lx collect <args>              # 收集阶段")
        cli.console.info("  lx model <args>               # 建模阶段")
        cli.console.info("  lx compare <args>             # 对比阶段")
        cli.console.info("  lx align <args>               # 对齐阶段")
        cli.console.info("  lx deliver <args>              # 交付阶段")
        return

    command = sys.argv[1]
    args = sys.argv[2:]

    if command == "init":
        here = "--here" in args
        cli.init_project(here=here)
    elif command in cli.cognitive_steps:
        cli.run_cognitive_step(command, *args)
    else:
        cli.console.error(f"未知命令: {command}")

if __name__ == "__main__":
    main()
