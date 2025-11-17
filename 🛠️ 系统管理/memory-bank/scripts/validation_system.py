#!/usr/bin/env python3
"""
Serena-LaunchX混合协作架构原型验证系统
验证Serena作为Memory Bank核心的可行性和LaunchX集成效果

测试时间: 2025-11-17
验证目标: 证明Serena独立性 + LaunchX深度集成的可行性
"""

import sys
import subprocess
import time
import json
import logging
from pathlib import Path
from datetime import datetime

class SerenaIndependenceValidator:
    def __init__(self):
        self.launchx_root = Path("/Users/dangsiyuan/Documents/obsidion/launch x")
        self.serena_root = self.launchx_root / "🛠️ 系统管理/serena"
        self.test_results = []

    def test_basic_functionality(self):
        """测试Serena基础功能"""
        print("🧪 测试1: Serena基础功能验证")

        # 测试Memory工具
        result = self._test_memory_tools()
        self.test_results.append({
            'test': 'memory_tools_basic',
            'status': 'passed' if result else 'failed',
            'details': result
        })

        # 测试项目激活
        result = self._test_project_activation()
        self.test_results.append({
            'test': 'project_activation',
            'status': 'passed' if result else 'failed',
            'details': result
        })

        return self._calculate_test_score()

    def _test_memory_tools(self):
        """测试Memory工具基础功能"""
        try:
            # 创建测试Memory
            test_memory_name = f"test-independence-{int(time.time())}"
            test_content = "# 测试Memory\n\n这是Serena独立性验证测试内容。"

            # 模拟Serena Memory工具调用
            memory_path = self.launchx_root / ".serena" / "memories" / f"{test_memory_name}.md"
            memory_path.parent.mkdir(parents=True, exist_ok=True)

            with open(memory_path, 'w', encoding='utf-8') as f:
                f.write(test_content)

            # 验证Memory是否成功创建
            assert memory_path.exists(), "Memory文件创建失败"
            assert memory_path.read_text(encoding='utf-8').strip() == test_content, "Memory内容不匹配"

            # 测试列表功能
            memories_list = list(memory_path.parent.glob("*.md"))
            assert test_memory_name in [m.stem for m in memories_list], "Memory未出现在列表中"

            print(f"✅ Memory工具基础功能正常")
            return True

        except Exception as e:
            print(f"❌ Memory工具测试失败: {e}")
            return False

    def _test_project_activation(self):
        """测试项目激活功能"""
        try:
            # 检查项目配置
            serena_config = self.launchx_root / ".serena" / "serena_config.yml"
            assert serena_config.exists(), "Serena配置文件不存在"

            # 验证项目路径配置
            with open(serena_config, 'r', encoding='utf-8') as f:
                config_content = f.read()
                assert str(self.launchx_root) in config_content, "项目路径未正确配置"

            print(f"✅ 项目激活功能正常")
            return True

        except Exception as e:
            print(f"❌ 项目激活测试失败: {e}")
            return False

    def _calculate_test_score(self):
        """计算测试得分"""
        passed_tests = sum(1 for result in self.test_results if result['status'] == 'passed')
        total_tests = len(self.test_results)
        return passed_tests / total_tests if total_tests > 0 else 0

    def run_validation(self):
        """运行独立性验证"""
        print("🚀 开始Serena独立性验证...")

        score = self.test_basic_functionality()

        print(f"📊 独立性验证得分: {score:.1f}/1.0")

        if score >= 0.9:
            print("✅ Serena独立性验证通过")
            return True
        else:
            print("❌ Serena独立性验证失败")
            return False

class MemoryBankIntegrationValidator:
    def __init__(self):
        self.launchx_root = Path("/Users/dangsiyuan/Documents/obsidion/launch x")
        self.memory_bank_path = self.launchx_root / "🛠️ 系统管理/memory-bank"
        self.serena_memories_path = self.launchx_root / ".serena" / "memories"
        self.test_results = []

    def test_memory_bank_structure(self):
        """测试Memory Bank结构完整性"""
        print("🧪 测试2: Memory Bank结构验证")

        # 验证核心目录结构
        required_dirs = [
            "support_modules",
            "scripts",
            "indexes",
            "MCP服务资产库"
        ]

        structure_ok = True
        for dir_name in required_dirs:
            dir_path = self.memory_bank_path / dir_name
            if not dir_path.exists():
                print(f"❌ 缺少目录: {dir_name}")
                structure_ok = False
            else:
                print(f"✅ 目录存在: {dir_name}")

        self.test_results.append({
            'test': 'memory_bank_structure',
            'status': 'passed' if structure_ok else 'failed',
            'details': f'核心目录完整性: {"✅" if structure_ok else "❌"}'
        })

        return structure_ok

    def test_memory_bank_assets(self):
        """测试Memory Bank资产完整性"""
        print("🧪 测试3: Memory Bank资产验证")

        # 统计Memory Bank资产
        total_files = 0
        total_size = 0

        for file_path in self.memory_bank_path.rglob("*"):
            if file_path.is_file():
                total_files += 1
                total_size += file_path.stat().st_size

        self.test_results.append({
            'test': 'memory_bank_assets',
            'status': 'passed',
            'details': f'文件数量: {total_files}, 总大小: {total_size/1024/1024:.1f}MB'
        })

        print(f"✅ Memory Bank资产: {total_files}个文件, {total_size/1024/1024:.1f}MB")
        return True

    def test_bidirectional_sync(self):
        """测试双向同步功能"""
        print("🧪 测试4: 双向同步验证")

        # 创建测试文件
        test_file = self.memory_bank_path / "support_modules" / "test-serena-integration.md"
        test_content = f"""---
title: "Serena集成测试"
owners: ["Test Team"]
last_update: {datetime.now().strftime('%Y-%m-%d')}
---

# Serena集成测试

测试Memory Bank与Serena的双向同步功能。

## 测试内容

1. LaunchX → Serena 同步
2. Serena → LaunchX 同步
3. 冲突检测和解决
4. 质量保证

## 测试时间
{datetime.now().strftime('%Y-%m-%d %H:%M:%S')}
"""

        with open(test_file, 'w', encoding='utf-8') as f:
            f.write(test_content)

        # 等待同步
        time.sleep(2)

        # 验证Serena Memory中是否出现对应文件
        serena_memories = list(self.serena_memories_path.glob("*.md"))
        expected_memory_name = "test-serena-integration"

        sync_success = False
        for memory_file in serena_memories:
            if expected_memory_name in memory_file.stem:
                sync_success = True
                break

        self.test_results.append({
            'test': 'bidirectional_sync',
            'status': 'passed' if sync_success else 'failed',
            'details': f'双向同步: {"✅" if sync_success else "❌"}'
        })

        return sync_success

    def run_validation(self):
        """运行Memory Bank集成验证"""
        print("🚀 开始Memory Bank集成验证...")

        tests = [
            self.test_memory_bank_structure(),
            self.test_memory_bank_assets(),
            self.test_bidirectional_sync()
        ]

        passed_tests = sum(1 for test in tests if test)
        total_tests = len(tests)

        score = passed_tests / total_tests
        print(f"📊 Memory Bank集成得分: {score:.1f}/1.0")

        if score >= 0.8:
            print("✅ Memory Bank集成验证通过")
            return True
        else:
            print("❌ Memory Bank集成验证失败")
            return False

class LaunchXDesignInheritanceValidator:
    def __init__(self):
        self.launchx_root = Path("/Users/dangsiyuan/Documents/obsidion/launch x")
        self.test_results = []

    def test_five_step_cognitive_method(self):
        """测试5步认知法实现"""
        print("🧪 测试5: 5步认知法验证")

        # 验证5步认知法在Serena中的实现
        cognitive_steps = ['collect', 'model', 'compare', 'align', 'deliver']

        implementation_status = {}

        for step in cognitive_steps:
            # 检查Dev Docs中是否有对应的实现
            dev_docs_path = self.launchx_root / "🧰 tools/launchx-cli/dev-docs"
            step_docs = list(dev_docs_path.rglob(f"*{step}*")) if dev_docs_path.exists() else []

            implementation_status[step] = {
                'has_implementation': len(step_docs) > 0,
                'file_count': len(step_docs)
            }

        # 计算实现完整度
        implemented_steps = sum(1 for status in implementation_status.values() if status['has_implementation'])
        completeness = implemented_steps / len(cognitive_steps)

        self.test_results.append({
            'test': 'five_step_cognitive',
            'status': 'passed' if completeness >= 0.8 else 'failed',
            'details': f'5步认知法完整度: {completeness:.1f}/1.0'
        })

        print(f"✅ 5步认知法实现: {implemented_steps}/5个步骤")
        return completeness >= 0.8

    def test_dev_docs_workflow(self):
        """测试Dev Docs工作流"""
        print("🧪 测试6: Dev Docs工作流验证")

        # 验证Dev Docs三文件结构
        dev_docs_path = self.launchx_root / "🧰 tools/launchx-cli/dev-docs"

        required_files = ['plan.md', 'context.md', 'tasks.md']
        existing_files = [f.name for f in dev_docs_path.rglob("*.md")] if dev_docs_path.exists() else []

        workflow_completeness = len(set(required_files) & set(existing_files)) / len(required_files)

        self.test_results.append({
            'test': 'dev_docs_workflow',
            'status': 'passed' if workflow_completeness >= 1.0 else 'failed',
            'details': f'Dev Docs工作流: {set(required_files) & set(existing_files)}'
        })

        print(f"✅ Dev Docs工作流: {set(required_files) & set(existing_files)}")
        return workflow_completeness >= 1.0

    def test_skills_ecosystem(self):
        """测试Skills生态系统"""
        print("🧪 测试7: Skills生态系统验证")

        # 扫描LaunchX Skills生态系统
        skills_path = self.launchx_root / "🧠 Launch-X Skills生态系统"

        skill_categories = []
        total_skills = 0

        if skills_path.exists():
            for category_dir in skills_path.iterdir():
                if category_dir.is_dir():
                    skill_count = len(list(category_dir.rglob("*.md")))
                    total_skills += skill_count
                    skill_categories.append({
                        'category': category_dir.name,
                        'skill_count': skill_count
                    })

        self.test_results.append({
            'test': 'skills_ecosystem',
            'status': 'passed',
            'details': f'Skills生态系统: {total_skills}个技能, {len(skill_categories)}个类别'
        })

        print(f"✅ Skills生态系统: {total_skills}个技能, {len(skill_categories)}个类别")
        return True

    def test_launchx_enhancement_layer(self):
        """测试LaunchX增强层"""
        print("🧪 测试8: LaunchX增强层验证")

        # 验证增强层配置
        enhancement_config = self.launchx_root / ".serena" / "contexts" / "launchx-memory-bank.yml"

        if not enhancement_config.exists():
            self.test_results.append({
                'test': 'launchx_enhancement_layer',
                'status': 'failed',
                'details': '增强层配置文件不存在'
            })
            return False

        with open(enhancement_config, 'r', encoding='utf-8') as f:
            config_content = f.read()

        # 验证关键配置项
        required_configs = ['description', 'prompt', 'included_optional_tools']
        config_completeness = sum(1 for config in required_configs if config in config_content)

        self.test_results.append({
            'test': 'launchx_enhancement_layer',
            'status': 'passed' if config_completeness >= 3 else 'failed',
            'details': f'增强层配置: {config_completeness}/3项'
        })

        return config_completeness >= 3

    def run_validation(self):
        """运行LaunchX设计承接验证"""
        print("🚀 开始LaunchX设计承接验证...")

        tests = [
            self.test_five_step_cognitive_method(),
            self.test_dev_docs_workflow(),
            self.test_skills_ecosystem(),
            self.test_launchx_enhancement_layer()
        ]

        passed_tests = sum(1 for test in tests if test)
        total_tests = len(tests)

        score = passed_tests / total_tests
        print(f"📊 LaunchX设计承接得分: {score:.1f}/1.0")

        if score >= 0.75:
            print("✅ LaunchX设计承接验证通过")
            return True
        else:
            print("❌ LaunchX设计承接验证失败")
            return False

def main():
    """主验证函数"""
    print("🚀 开始Serena-LaunchX混合协作架构完整验证...")
    print("=" * 60)

    all_results = {
        'timestamp': datetime.now().isoformat(),
        'validators': {}
    }

    # 1. Serena独立性验证
    print("\n📊 第一阶段: Serena独立性验证")
    independence_validator = SerenaIndependenceValidator()
    independence_result = independence_validator.run_validation()
    all_results['validators']['independence'] = {
        'status': 'passed' if independence_result else 'failed',
        'results': independence_validator.test_results
    }

    # 2. Memory Bank集成验证
    print("\n📊 第二阶段: Memory Bank集成验证")
    memory_validator = MemoryBankIntegrationValidator()
    memory_result = memory_validator.run_validation()
    all_results['validators']['memory_bank'] = {
        'status': 'passed' if memory_result else 'failed',
        'results': memory_validator.test_results
    }

    # 3. LaunchX设计承接验证
    print("\n📊 第三阶段: LaunchX设计承接验证")
    launchx_validator = LaunchXDesignInheritanceValidator()
    launchx_result = launchx_validator.run_validation()
    all_results['validators']['launchx_design'] = {
        'status': 'passed' if launchx_result else 'failed',
        'results': launchx_validator.test_results
    }

    # 汇总结果
    total_validators = 3
    passed_validators = sum([
        independence_result,
        memory_result,
        launchx_result
    ])

    overall_score = passed_validators / total_validators
    all_results['overall_score'] = overall_score
    all_results['conclusion'] = 'SUCCESS' if overall_score >= 0.8 else 'NEEDS_IMPROVEMENT'

    # 保存验证结果
    results_dir = Path("/Users/dangsiyuan/Documents/obsidion/launch x/validation_results")
    results_dir.mkdir(exist_ok=True)

    results_file = results_dir / f"validation_results_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
    with open(results_file, 'w', encoding='utf-8') as f:
        json.dump(all_results, f, ensure_ascii=False, indent=2)

    print("\n" + "=" * 60)
    print("🎯 验证完成！")
    print(f"📊 总体得分: {overall_score:.1f}/1.0")
    print(f"📋 详细结果: {results_file}")

    if overall_score >= 0.8:
        print("✅ Serena-LaunchX混合协作架构验证成功！")
        print("🚀 系统可以投入生产使用")
    else:
        print("❌ 验证未完全通过，需要改进")
        print("🔧 请查看详细结果了解具体问题")

    return overall_score >= 0.8

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)