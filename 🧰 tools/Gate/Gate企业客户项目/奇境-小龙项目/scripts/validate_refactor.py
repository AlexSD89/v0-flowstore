#!/usr/bin/env python3
"""
奇境-小龙项目重构验证脚本
验证四层架构重构的正确性和完整性
"""

import os
import json
import logging
from datetime import datetime
from pathlib import Path

def validate_refactor():
    """验证重构结果"""
    base_path = Path(__file__).parent.parent

    # 验证四层架构目录是否存在
    required_layers = [
        "客户项目门户",
        "系统管理层",
        "技术实现层",
        "运行时层"
    ]

    validation_results = {
        "timestamp": datetime.now().isoformat(),
        "total_checks": 0,
        "passed_checks": 0,
        "failed_checks": [],
        "structure_validation": {}
    }

    print("🔍 开始验证重构结果...")

    for layer in required_layers:
        layer_path = base_path / layer
        validation_results["total_checks"] += 1

        if layer_path.exists() and layer_path.is_dir():
            validation_results["passed_checks"] += 1
            validation_results["structure_validation"][layer] = "✅ 存在"
            print(f"✅ 层级验证通过: {layer}")
        else:
            validation_results["failed_checks"].append(f"缺失层级: {layer}")
            validation_results["structure_validation"][layer] = "❌ 缺失"
            print(f"❌ 层级验证失败: {layer}")

    # 验证核心组件
    core_components = {
        "客户项目门户": ["项目分类管理", "专业化服务", "成果交付"],
        "系统管理层": ["安全合规管理", "学习数据管理", "项目分类器"],
        "技术实现层": ["技能发现器", "技能组合器", "技能执行器", "技能监控器"]
    }

    for layer, components in core_components.items():
        for component in components:
            component_path = base_path / layer / component
            validation_results["total_checks"] += 1

            if component_path.exists() and component_path.is_dir():
                validation_results["passed_checks"] += 1
                print(f"✅ 组件验证通过: {layer}/{component}")
            else:
                validation_results["failed_checks"].append(f"缺失组件: {layer}/{component}")
                print(f"❌ 组件验证失败: {layer}/{component}")

    # 保存验证报告
    report_path = base_path / "scripts" / f"validation_report_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
    with open(report_path, 'w', encoding='utf-8') as f:
        json.dump(validation_results, f, indent=2, ensure_ascii=False)

    print(f"\n📊 验证报告已保存: {report_path}")
    print(f"✅ 通过验证: {validation_results['passed_checks']}/{validation_results['total_checks']}")

    if validation_results["failed_checks"]:
        print(f"❌ 验证失败项: {len(validation_results['failed_checks'])}")
        for failure in validation_results["failed_checks"]:
            print(f"   - {failure}")
        return False
    else:
        print("🎉 所有验证项目通过!")
        return True

if __name__ == "__main__":
    success = validate_refactor()
    exit(0 if success else 1)
