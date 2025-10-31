#!/usr/bin/env python3
"""
Agent OS System Transformation - Codebase Inventory Analysis
Agent OS系统转型 - 代码库清单分析

分析当前系统架构，评估转型准备状态，识别重构关键点
Version: 1.0
Created: 2025-01-22
"""

import os
import json
import sys
from datetime import datetime
from pathlib import Path
from typing import Dict, List, Any, Tuple
import importlib.util

class CodebaseInventory:
    """代码库清单分析系统"""

    def __init__(self, project_root: str):
        self.project_root = Path(project_root)
        self.analysis_results = {
            "timestamp": datetime.now().isoformat(),
            "project_root": str(project_root),
            "directory_structure": {},
            "python_modules": {},
            "core_components": {},
            "mcp_integration": {},
            "transformation_gaps": [],
            "phase1_readiness": {}
        }

    def analyze_directory_structure(self) -> Dict[str, Any]:
        """分析项目目录结构"""
        print("🔍 分析项目目录结构...")

        structure = {}
        exclude_patterns = {
            '.git', '__pycache__', 'node_modules', '.DS_Store',
            '.pytest_cache', '.venv', 'venv', 'env'
        }

        for root, dirs, files in os.walk(self.project_root):
            # 过滤排除目录
            dirs[:] = [d for d in dirs if d not in exclude_patterns]

            rel_path = str(Path(root).relative_to(self.project_root))
            if rel_path == '.':
                rel_path = 'root'

            structure[rel_path] = {
                "directories": dirs,
                "files": [f for f in files if not f.startswith('.')],
                "file_count": len([f for f in files if not f.startswith('.')]),
                "python_files": len([f for f in files if f.endswith('.py')]),
                "config_files": len([f for f in files if f.endswith(('.json', '.yaml', '.yml', '.toml'))])
            }

        self.analysis_results["directory_structure"] = structure
        return structure

    def analyze_python_modules(self) -> Dict[str, Any]:
        """分析Python模块结构"""
        print("🐍 分析Python模块结构...")

        modules = {}
        python_files = list(self.project_root.rglob("*.py"))

        for py_file in python_files:
            if any(part in str(py_file) for part in ['.git', '__pycache__', 'venv']):
                continue

            rel_path = py_file.relative_to(self.project_root)
            module_name = str(rel_path.with_suffix('')).replace(os.sep, '.')

            try:
                with open(py_file, 'r', encoding='utf-8') as f:
                    content = f.read()

                # 分析模块内容
                module_info = {
                    "file_path": str(rel_path),
                    "file_size": len(content),
                    "line_count": len(content.splitlines()),
                    "imports": self._extract_imports(content),
                    "classes": self._extract_classes(content),
                    "functions": self._extract_functions(content),
                    "has_main": "__main__" in content,
                    "architecture_layer": self._identify_architecture_layer(str(rel_path))
                }

                modules[module_name] = module_info

            except Exception as e:
                print(f"⚠️ 分析文件失败 {py_file}: {e}")
                continue

        self.analysis_results["python_modules"] = modules
        return modules

    def analyze_core_components(self) -> Dict[str, Any]:
        """分析核心系统组件"""
        print("🏗️ 分析核心系统组件...")

        components = {
            "agent_os_core": {},
            "automation_system": {},
            "mcp_integrations": {},
            "data_processing": {},
            "client_management": {},
            "quality_control": {}
        }

        # 查找核心组件文件
        core_patterns = {
            "agent_os_core": ["agent_os_launcher.py", "core/", "framework/"],
            "automation_system": ["automation/", "one_command_automation.py", "run_client.py"],
            "mcp_integrations": ["mcp_", "servers/", "tools/"],
            "data_processing": ["data/", "analysis/", "processing/"],
            "client_management": ["clients/", "customer/"],
            "quality_control": ["quality/", "validation/", "control/"]
        }

        for component_name, patterns in core_patterns.items():
            component_files = []

            for pattern in patterns:
                if pattern.endswith(".py"):
                    # 具体文件
                    file_path = self.project_root / pattern
                    if file_path.exists():
                        component_files.append(str(file_path.relative_to(self.project_root)))
                else:
                    # 目录模式
                    for file_path in self.project_root.rglob("*.py"):
                        if pattern in str(file_path):
                            rel_path = file_path.relative_to(self.project_root)
                            component_files.append(str(rel_path))

            components[component_name] = {
                "files": component_files,
                "file_count": len(component_files),
                "status": "found" if component_files else "missing"
            }

        self.analysis_results["core_components"] = components
        return components

    def analyze_mcp_integration(self) -> Dict[str, Any]:
        """分析MCP集成状态"""
        print("🔌 分析MCP集成状态...")

        mcp_status = {
            "mcp_config_files": [],
            "mcp_servers": {},
            "mcp_tools_usage": {},
            "integration_score": 0
        }

        # 查找MCP配置文件
        mcp_configs = list(self.project_root.rglob("mcp*.json"))
        mcp_configs.extend(list(self.project_root.rglob("*mcp*.json")))

        for config_file in mcp_configs:
            rel_path = config_file.relative_to(self.project_root)
            mcp_status["mcp_config_files"].append(str(rel_path))

            try:
                with open(config_file, 'r', encoding='utf-8') as f:
                    config_data = json.load(f)

                # 分析配置内容
                if "mcpServers" in config_data:
                    for server_name, server_config in config_data["mcpServers"].items():
                        mcp_status["mcp_servers"][server_name] = {
                            "command": server_config.get("command", ""),
                            "args": server_config.get("args", []),
                            "env": server_config.get("env", {}),
                            "status": "configured"
                        }

            except Exception as e:
                print(f"⚠️ 分析MCP配置失败 {config_file}: {e}")

        # 查找MCP工具使用
        for py_file in self.project_root.rglob("*.py"):
            try:
                with open(py_file, 'r', encoding='utf-8') as f:
                    content = f.read()

                # 检查MCP工具使用模式
                mcp_patterns = [
                    "mcp__", "ModelContextProtocol",
                    "@tool", "use_mcp", "call_mcp"
                ]

                file_mcp_usage = []
                for pattern in mcp_patterns:
                    if pattern in content:
                        file_mcp_usage.append(pattern)

                if file_mcp_usage:
                    rel_path = str(py_file.relative_to(self.project_root))
                    mcp_status["mcp_tools_usage"][rel_path] = file_mcp_usage

            except Exception:
                continue

        # 计算集成评分
        config_score = len(mcp_status["mcp_config_files"]) * 20
        server_score = len(mcp_status["mcp_servers"]) * 15
        usage_score = len(mcp_status["mcp_tools_usage"]) * 10

        mcp_status["integration_score"] = min(config_score + server_score + usage_score, 100)

        self.analysis_results["mcp_integration"] = mcp_status
        return mcp_status

    def identify_transformation_gaps(self) -> List[Dict[str, Any]]:
        """识别系统转型关键差距"""
        print("🎯 识别系统转型关键差距...")

        gaps = []

        # 检查四层架构组件
        layer_requirements = {
            "Layer1_Interaction": [
                "context_management", "intent_analysis",
                "dynamic_routing", "user_interface"
            ],
            "Layer2_Learning": [
                "behavior_analysis", "knowledge_graph",
                "adaptive_weights", "experience_bank"
            ],
            "Layer3_Collaboration": [
                "human_ai_boundary", "quality_gates",
                "decision_making", "feedback_loops"
            ],
            "Layer4_Persistence": [
                "data_lifecycle", "knowledge_storage",
                "version_control", "backup_recovery"
            ]
        }

        for layer, requirements in layer_requirements.items():
            missing_components = []

            for component in requirements:
                # 检查组件是否存在
                found = False
                for file_path in self.project_root.rglob("*.py"):
                    try:
                        with open(file_path, 'r', encoding='utf-8') as f:
                            content = f.read()
                            if component.replace("_", " ") in content.lower():
                                found = True
                                break
                    except Exception:
                        continue

                if not found:
                    missing_components.append(component)

            if missing_components:
                gaps.append({
                    "type": "architecture_layer",
                    "layer": layer,
                    "missing_components": missing_components,
                    "priority": "high" if layer == "Layer1_Interaction" else "medium",
                    "impact": "Core functionality missing" if layer == "Layer1_Interaction" else "Advanced functionality missing"
                })

        # 检查MCP集成差距
        mcp_integration = self.analysis_results.get("mcp_integration", {})
        if mcp_integration.get("integration_score", 0) < 50:
            gaps.append({
                "type": "mcp_integration",
                "current_score": mcp_integration.get("integration_score", 0),
                "target_score": 80,
                "priority": "high",
                "impact": "Limited tool ecosystem integration",
                "recommendation": "Enhance MCP server configuration and tool usage"
            })

        # 检查自动化系统差距
        automation_status = self.analysis_results.get("core_components", {}).get("automation_system", {})
        if automation_status.get("file_count", 0) < 3:
            gaps.append({
                "type": "automation_system",
                "current_files": automation_status.get("file_count", 0),
                "target_files": 5,
                "priority": "high",
                "impact": "Insufficient automation capabilities",
                "recommendation": "Implement comprehensive automation framework"
            })

        self.analysis_results["transformation_gaps"] = gaps
        return gaps

    def assess_phase1_readiness(self) -> Dict[str, Any]:
        """评估Phase 1准备状态"""
        print("📊 评估Phase 1准备状态...")

        readiness = {
            "overall_score": 0,
            "dimension_scores": {},
            "recommendations": [],
            "blocking_issues": []
        }

        # 评估各维度
        dimensions = {
            "codebase_structure": {
                "weight": 0.2,
                "assessment": "good" if len(self.analysis_results.get("directory_structure", {})) > 5 else "needs_improvement"
            },
            "core_components": {
                "weight": 0.25,
                "assessment": "good" if self.analysis_results.get("core_components", {}).get("agent_os_core", {}).get("file_count", 0) > 0 else "critical"
            },
            "mcp_integration": {
                "weight": 0.25,
                "assessment": "good" if self.analysis_results.get("mcp_integration", {}).get("integration_score", 0) > 50 else "needs_improvement"
            },
            "automation_system": {
                "weight": 0.2,
                "assessment": "good" if self.analysis_results.get("core_components", {}).get("automation_system", {}).get("file_count", 0) >= 3 else "needs_improvement"
            },
            "transformation_gaps": {
                "weight": 0.1,
                "assessment": "good" if len([g for g in self.analysis_results.get("transformation_gaps", []) if g["priority"] == "high"]) <= 2 else "critical"
            }
        }

        total_score = 0
        for dim_name, dim_config in dimensions.items():
            score_map = {
                "good": 4.0,
                "needs_improvement": 2.5,
                "critical": 1.0
            }

            dim_score = score_map[dim_config["assessment"]]
            weighted_score = dim_score * dim_config["weight"]
            total_score += weighted_score

            readiness["dimension_scores"][dim_name] = {
                "score": dim_score,
                "weighted_score": weighted_score,
                "assessment": dim_config["assessment"]
            }

        readiness["overall_score"] = total_score

        # 生成建议
        if total_score >= 3.5:
            readiness["recommendations"].append("✅ 系统准备状态良好，可以开始Phase 1实施")
        elif total_score >= 2.5:
            readiness["recommendations"].append("⚠️ 系统需要小幅改进后开始Phase 1")
            readiness["recommendations"].append("🔧 优先解决关键差距问题")
        else:
            readiness["recommendations"].append("❌ 系统需要重大改进才能开始Phase 1")
            readiness["recommendations"].append("🚨 建议先完成基础架构重构")

        # 识别阻塞性问题
        for gap in self.analysis_results.get("transformation_gaps", []):
            if gap["priority"] == "high":
                readiness["blocking_issues"].append(gap)

        self.analysis_results["phase1_readiness"] = readiness
        return readiness

    def _extract_imports(self, content: str) -> List[str]:
        """提取Python导入语句"""
        imports = []
        for line in content.split('\n'):
            line = line.strip()
            if line.startswith(('import ', 'from ')):
                imports.append(line)
        return imports

    def _extract_classes(self, content: str) -> List[str]:
        """提取Python类定义"""
        import re
        classes = re.findall(r'^\s*class\s+(\w+)', content, re.MULTILINE)
        return classes

    def _extract_functions(self, content: str) -> List[str]:
        """提取Python函数定义"""
        import re
        functions = re.findall(r'^\s*def\s+(\w+)', content, re.MULTILINE)
        return functions

    def _identify_architecture_layer(self, file_path: str) -> str:
        """识别架构层级"""
        layer_indicators = {
            "Layer1_Interaction": ["interface", "ui", "interaction", "routing", "context"],
            "Layer2_Learning": ["learning", "adaptive", "intelligence", "analysis", "behavior"],
            "Layer3_Collaboration": ["collaboration", "decision", "quality", "control", "feedback"],
            "Layer4_Persistence": ["data", "storage", "database", "persistence", "backup"],
            "Unknown": []
        }

        file_path_lower = file_path.lower()
        for layer, indicators in layer_indicators.items():
            if any(indicator in file_path_lower for indicator in indicators):
                return layer

        return "Unknown"

    def run_full_analysis(self) -> Dict[str, Any]:
        """执行完整分析"""
        print("🚀 开始Agent OS系统转型代码库分析...")
        print(f"📁 项目根目录: {self.project_root}")
        print("=" * 60)

        # 执行各项分析
        self.analyze_directory_structure()
        self.analyze_python_modules()
        self.analyze_core_components()
        self.analyze_mcp_integration()
        self.identify_transformation_gaps()
        self.assess_phase1_readiness()

        print("=" * 60)
        print("✅ 代码库分析完成!")

        return self.analysis_results

    def generate_report(self, output_file: str = None) -> str:
        """生成分析报告"""
        if not output_file:
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            output_file = f"codebase_analysis_report_{timestamp}.json"

        # 保存详细分析结果
        report_path = self.project_root / "analysis" / output_file

        with open(report_path, 'w', encoding='utf-8') as f:
            json.dump(self.analysis_results, f, indent=2, ensure_ascii=False)

        print(f"📊 详细分析报告已保存: {report_path}")

        # 生成摘要报告
        summary_file = report_path.with_suffix('.md')
        self._generate_summary_report(summary_file)

        return str(report_path)

    def _generate_summary_report(self, output_file: Path):
        """生成摘要报告"""
        readiness = self.analysis_results.get("phase1_readiness", {})
        gaps = self.analysis_results.get("transformation_gaps", [])
        components = self.analysis_results.get("core_components", {})
        mcp_status = self.analysis_results.get("mcp_integration", {})

        report_content = f"""# Agent OS System Transformation - Codebase Analysis Summary\n\n## 📊 Overall Assessment\n\n**Readiness Score**: {readiness.get('overall_score', 0):.1f}/4.0\n\n**Status**: {self._get_status_emoji(readiness.get('overall_score', 0))} {self._get_status_text(readiness.get('overall_score', 0))}\n\n---\n\n## 🏗️ Core Components Status\n\n"""

        for comp_name, comp_info in components.items():
            status_emoji = "✅" if comp_info.get('status') == 'found' else "❌"
            report_content += f"**{comp_name}**: {status_emoji} {comp_info.get('file_count', 0)} files\n"

        report_content += f"""\n## 🔌 MCP Integration\n\n**Integration Score**: {mcp_status.get('integration_score', 0)}/100\n**Configured Servers**: {len(mcp_status.get('mcp_servers', {}))}\n**Tool Usage Files**: {len(mcp_status.get('mcp_tools_usage', {}))}\n\n---\n\n## 🎯 Critical Transformation Gaps\n\n"""

        high_priority_gaps = [g for g in gaps if g.get('priority') == 'high']
        for gap in high_priority_gaps[:5]:  # 显示前5个关键差距
            report_content += f"**{gap.get('type', 'Unknown')}**: {gap.get('impact', 'No impact')}\n"

        report_content += f"""\n## 📋 Phase 1 Recommendations\n\n"""

        for rec in readiness.get('recommendations', []):
            report_content += f"{rec}\n"

        if readiness.get('blocking_issues'):
            report_content += "\n### 🚨 Blocking Issues\n\n"
            for issue in readiness.get('blocking_issues', []):
                report_content += f"- {issue.get('impact', 'Unknown issue')}\n"

        report_content += f"""\n---\n\n**Generated**: {self.analysis_results.get('timestamp', 'Unknown')}\n**Analysis Tool**: Agent OS Transformation Analyzer v1.0\n"""

        with open(output_file, 'w', encoding='utf-8') as f:
            f.write(report_content)

        print(f"📋 摘要报告已保存: {output_file}")

    def _get_status_emoji(self, score: float) -> str:
        """获取状态emoji"""
        if score >= 3.5:
            return "🟢"
        elif score >= 2.5:
            return "🟡"
        else:
            return "🔴"

    def _get_status_text(self, score: float) -> str:
        """获取状态文本"""
        if score >= 3.5:
            return "Ready for Phase 1"
        elif score >= 2.5:
            return "Minor improvements needed"
        else:
            return "Major improvements required"


def main():
    """主函数"""
    # 确定项目根目录
    script_dir = Path(__file__).parent
    project_root = script_dir.parent

    print("🔍 Agent OS System Transformation - Codebase Inventory")
    print(f"📁 Project Root: {project_root}")
    print("=" * 60)

    # 创建分析器
    analyzer = CodebaseInventory(str(project_root))

    try:
        # 执行完整分析
        results = analyzer.run_full_analysis()

        # 生成报告
        report_path = analyzer.generate_report()

        # 显示关键结果
        readiness = results.get("phase1_readiness", {})
        overall_score = readiness.get("overall_score", 0)

        print("\n" + "=" * 60)
        print("📊 ANALYSIS SUMMARY")
        print("=" * 60)
        print(f"Overall Readiness Score: {overall_score:.1f}/4.0")
        print(f"Status: {analyzer._get_status_emoji(overall_score)} {analyzer._get_status_text(overall_score)}")

        # 显示核心统计
        directory_count = len(results.get("directory_structure", {}))
        python_files = len(results.get("python_modules", {}))
        gaps_count = len(results.get("transformation_gaps", []))
        mcp_score = results.get("mcp_integration", {}).get("integration_score", 0)

        print(f"\n📁 Directories: {directory_count}")
        print(f"🐍 Python Files: {python_files}")
        print(f"🎯 Transformation Gaps: {gaps_count}")
        print(f"🔌 MCP Integration: {mcp_score}/100")

        # 显示关键建议
        print("\n💡 KEY RECOMMENDATIONS:")
        for rec in readiness.get("recommendations", []):
            print(f"  {rec}")

    except Exception as e:
        print(f"❌ Analysis failed: {e}")
        import traceback
        traceback.print_exc()
        return 1

    return 0


if __name__ == "__main__":
    sys.exit(main())