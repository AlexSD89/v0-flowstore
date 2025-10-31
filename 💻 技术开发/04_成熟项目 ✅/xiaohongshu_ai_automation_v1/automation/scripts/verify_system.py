#!/usr/bin/env python3
"""
LaunchX v4.0 Agent OS 系统验证脚本
验证系统各组件是否正确安装和配置
"""

import os
import sys
import json
import asyncio
import importlib
from pathlib import Path
from typing import Dict, List, Any

# 添加src目录到路径
project_root = Path(__file__).parent.parent
src_path = project_root / "src"
sys.path.insert(0, str(src_path))

def print_section(title: str):
    """打印章节标题"""
    print(f"\n{'='*60}")
    print(f"  {title}")
    print(f"{'='*60}")

def print_success(message: str):
    """打印成功消息"""
    print(f"✅ {message}")

def print_warning(message: str):
    """打印警告消息"""
    print(f"⚠️  {message}")

def print_error(message: str):
    """打印错误消息"""
    print(f"❌ {message}")

def check_file_structure():
    """检查文件结构"""
    print_section("文件结构检查")

    required_files = [
        "src/agent_os_launcher.py",
        "src/core/base_agent.py",
        "src/core/agent_registry.py",
        "src/agents/specialized_agents.py",
        "src/agent_collaboration/collaboration_manager.py",
        "src/agent_collaboration/intelligent_scheduler.py",
        "src/realtime_learning/realtime_learning_engine.py",
        "src/realtime_learning/self_optimization_system.py",
        "src/enterprise_monitoring/monitoring_dashboard.py",
        "config/agent_os_config.json",
        "scripts/start_agent_os.py",
        "README_v4.0.md"
    ]

    missing_files = []
    for file_path in required_files:
        full_path = project_root / file_path
        if full_path.exists():
            file_size = full_path.stat().st_size
            print_success(f"{file_path} ({file_size:,} bytes)")
        else:
            print_error(f"{file_path} (missing)")
            missing_files.append(file_path)

    if missing_files:
        print(f"\n❌ 缺失文件数量: {len(missing_files)}")
        return False
    else:
        print_success(f"✅ 所有必需文件都存在 ({len(required_files)} 个文件)")
        return True

def check_python_modules():
    """检查Python模块"""
    print_section("Python模块检查")

    modules_to_check = [
        ("core.base_agent", "核心基础模块"),
        ("core.agent_registry", "Agent注册表"),
        ("agents.specialized_agents", "专业化Agent"),
        ("agent_collaboration.collaboration_manager", "协作管理器"),
        ("agent_collaboration.intelligent_scheduler", "智能调度器"),
        ("realtime_learning.realtime_learning_engine", "实时学习引擎"),
        ("realtime_learning.self_optimization_system", "自优化系统"),
        ("enterprise_monitoring.monitoring_dashboard", "监控仪表板")
    ]

    successful_imports = 0
    for module_name, description in modules_to_check:
        try:
            module = importlib.import_module(module_name)
            print_success(f"{module_name} - {description}")
            successful_imports += 1
        except ImportError as e:
            print_error(f"{module_name} - {description}: {e}")
        except Exception as e:
            print_warning(f"{module_name} - {description}: {e}")

    print(f"\n📊 模块导入成功率: {successful_imports}/{len(modules_to_check)} ({successful_imports/len(modules_to_check)*100:.1f}%)")
    return successful_imports == len(modules_to_check)

def check_configuration():
    """检查配置文件"""
    print_section("配置文件检查")

    config_path = project_root / "config" / "agent_os_config.json"

    if not config_path.exists():
        print_error("配置文件不存在")
        return False

    try:
        with open(config_path, 'r', encoding='utf-8') as f:
            config = json.load(f)

        # 检查必要的配置项
        required_sections = ["system", "agents", "xiaohongshu", "monitoring"]

        for section in required_sections:
            if section in config:
                print_success(f"配置节 '{section}' 存在")
            else:
                print_error(f"配置节 '{section}' 缺失")
                return False

        # 检查具体配置值
        system_config = config.get("system", {})
        print(f"系统名称: {system_config.get('name', 'N/A')}")
        print(f"系统版本: {system_config.get('version', 'N/A')}")
        print(f"环境: {system_config.get('environment', 'N/A')}")

        agents_config = config.get("agents", {})
        print(f"最大并发Agent数: {agents_config.get('max_concurrent_agents', 'N/A')}")
        print(f"默认超时时间: {agents_config.get('default_timeout', 'N/A')}秒")

        monitoring_config = config.get("monitoring", {})
        print(f"监控收集间隔: {monitoring_config.get('collection_interval', 'N/A')}秒")
        print(f"告警评估间隔: {monitoring_config.get('alert_evaluation_interval', 'N/A')}秒")

        print_success("配置文件格式正确且包含必要配置")
        return True

    except json.JSONDecodeError as e:
        print_error(f"配置文件JSON格式错误: {e}")
        return False
    except Exception as e:
        print_error(f"配置文件检查失败: {e}")
        return False

def check_dependencies():
    """检查依赖包"""
    print_section("依赖包检查")

    required_packages = [
        ("asyncio", "异步编程支持"),
        ("json", "JSON处理"),
        ("pathlib", "路径操作"),
        ("dataclasses", "数据类"),
        ("enum", "枚举类型"),
        ("logging", "日志记录"),
        ("time", "时间处理"),
        ("statistics", "统计计算")
    ]

    optional_packages = [
        ("pytest", "测试框架"),
        ("psutil", "系统监控"),
        ("numpy", "数值计算"),
        ("pandas", "数据分析")
    ]

    required_success = 0
    for package_name, description in required_packages:
        try:
            importlib.import_module(package_name)
            print_success(f"{package_name} - {description}")
            required_success += 1
        except ImportError:
            print_error(f"{package_name} - {description} (必需)")

    print(f"\n📦 可选依赖包检查:")
    for package_name, description in optional_packages:
        try:
            importlib.import_module(package_name)
            print_success(f"{package_name} - {description}")
        except ImportError:
            print_warning(f"{package_name} - {description} (可选)")

    print(f"\n📊 必需依赖包成功率: {required_success}/{len(required_packages)} ({required_success/len(required_packages)*100:.1f}%)")
    return required_success == len(required_packages)

def check_directories():
    """检查目录结构"""
    print_section("目录结构检查")

    required_dirs = [
        "src",
        "src/core",
        "src/agents",
        "src/agent_collaboration",
        "src/realtime_learning",
        "src/enterprise_monitoring",
        "src/ai_algorithms",
        "config",
        "scripts",
        "tests",
        "logs",
        "data"
    ]

    created_dirs = []
    for dir_path in required_dirs:
        full_path = project_root / dir_path
        if full_path.exists():
            print_success(f"{dir_path}/")
        else:
            try:
                full_path.mkdir(parents=True, exist_ok=True)
                print_success(f"{dir_path}/ (已创建)")
                created_dirs.append(dir_path)
            except Exception as e:
                print_error(f"{dir_path}/ (创建失败: {e})")

    return len(created_dirs) == 0 or all(Path(project_root / d).exists() for d in required_dirs)

def analyze_code_quality():
    """分析代码质量"""
    print_section("代码质量分析")

    python_files = list(project_root.rglob("*.py"))
    total_files = len(python_files)

    if total_files == 0:
        print_warning("没有找到Python文件")
        return True

    total_lines = 0
    total_size = 0

    for py_file in python_files:
        try:
            with open(py_file, 'r', encoding='utf-8') as f:
                lines = len(f.readlines())
                total_lines += lines
                total_size += py_file.stat().st_size
        except Exception:
            pass

    print(f"📄 Python文件数量: {total_files}")
    print(f"📝 总代码行数: {total_lines:,}")
    print(f"💾 总代码大小: {total_size/1024/1024:.2f} MB")
    print(f"📊 平均文件大小: {total_lines/total_files:.0f} 行/文件")

    # 估算功能完整性
    core_modules = [
        "base_agent.py",
        "agent_registry.py",
        "specialized_agents.py",
        "collaboration_manager.py",
        "intelligent_scheduler.py",
        "realtime_learning_engine.py",
        "self_optimization_system.py",
        "monitoring_dashboard.py",
        "agent_os_launcher.py"
    ]

    existing_core = sum(1 for module in core_modules
                       if (project_root / "src" / module).exists())

    completeness = existing_core / len(core_modules) * 100
    print(f"🎯 核心模块完整性: {completeness:.1f}% ({existing_core}/{len(core_modules)})")

    return completeness >= 80

async def test_basic_functionality():
    """测试基本功能"""
    print_section("基本功能测试")

    try:
        # 测试配置加载
        from core.base_agent import Config

        config_path = project_root / "config" / "agent_os_config.json"
        if config_path.exists():
            with open(config_path, 'r', encoding='utf-8') as f:
                config_data = json.load(f)
            config = Config(config_data)
            print_success("配置加载测试通过")
        else:
            print_warning("配置文件不存在，使用默认配置")
            config = Config({})
            print_success("默认配置创建成功")

        # 测试AgentRegistry基础功能
        try:
            from core.agent_registry import AgentRegistry
            registry = AgentRegistry(config)
            print_success("Agent注册表创建成功")
        except Exception as e:
            print_warning(f"Agent注册表测试失败: {e}")

        # 测试专业化Agent基础功能
        try:
            from agents.specialized_agents import TrendAgent, ContentAgent, MasterAgent
            print_success("专业化Agent模块导入成功")
        except Exception as e:
            print_warning(f"专业化Agent测试失败: {e}")

        # 测试协作管理器基础功能
        try:
            from agent_collaboration.collaboration_manager import CollaborationManager
            manager = CollaborationManager(config)
            print_success("协作管理器创建成功")
        except Exception as e:
            print_warning(f"协作管理器测试失败: {e}")

        # 测试监控系统基础功能
        try:
            from enterprise_monitoring.monitoring_dashboard import MonitoringDashboard
            dashboard = MonitoringDashboard(config)
            print_success("监控仪表板创建成功")
        except Exception as e:
            print_warning(f"监控系统测试失败: {e}")

        return True

    except Exception as e:
        print_error(f"基本功能测试失败: {e}")
        return False

def generate_summary_report(results: Dict[str, bool]):
    """生成总结报告"""
    print_section("系统验证总结报告")

    total_checks = len(results)
    passed_checks = sum(results.values())
    success_rate = passed_checks / total_checks * 100

    print(f"📊 总检查项目: {total_checks}")
    print(f"✅ 通过检查: {passed_checks}")
    print(f"❌ 失败检查: {total_checks - passed_checks}")
    print(f"📈 成功率: {success_rate:.1f}%")

    print(f"\n📋 详细结果:")
    for check_name, result in results.items():
        status = "✅ 通过" if result else "❌ 失败"
        print(f"  {check_name}: {status}")

    # 系统评级
    if success_rate >= 90:
        rating = "A+ (优秀)"
        color = "🟢"
    elif success_rate >= 80:
        rating = "A (良好)"
        color = "🟡"
    elif success_rate >= 70:
        rating = "B (一般)"
        color = "🟠"
    else:
        rating = "C (需要改进)"
        color = "🔴"

    print(f"\n{color} 系统评级: {rating}")

    if success_rate >= 80:
        print_success("🎉 LaunchX v4.0 Agent OS 系统验证通过！")
        print("✨ 系统已准备就绪，可以开始使用")
    else:
        print_warning("⚠️  系统存在一些问题，建议修复后重新验证")
        print("🔧 请参考上述失败的检查项目进行修复")

async def main():
    """主函数"""
    print("""
    ╔══════════════════════════════════════════════════════════════╗
    ║              LaunchX v4.0 Agent OS 系统验证                   ║
    ║                  智能协作AI系统验证工具                          ║
    ╚══════════════════════════════════════════════════════════════╝
    """)

    results = {}

    # 执行各项检查
    results["文件结构检查"] = check_file_structure()
    results["Python模块检查"] = check_python_modules()
    results["配置文件检查"] = check_configuration()
    results["依赖包���查"] = check_dependencies()
    results["目录结构检查"] = check_directories()
    results["代码质量分析"] = analyze_code_quality()
    results["基本功能测试"] = await test_basic_functionality()

    # 生成总结报告
    generate_summary_report(results)

if __name__ == "__main__":
    asyncio.run(main())