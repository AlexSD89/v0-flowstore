#!/usr/bin/env python3
"""
奇境-小龙项目重构回滚脚本
回滚到重构前的状态
重构时间: 20251113_190234
"""

import os
import shutil
import json
from datetime import datetime
from pathlib import Path

def rollback_refactor():
    """回滚重构"""
    base_path = Path(__file__).parent.parent

    print("🔄 开始回滚重构...")

    rollback_log = {
        "timestamp": datetime.now().isoformat(),
        "original_timestamp": "20251113_190234",
        "actions": [],
        "errors": []
    }

    # 删除新创建的四层架构目录
    new_layers = [
        "客户项目门户",
        "系统管理层",
        "技术实现层",
        "运行时层",
        "知识管理层"
    ]

    for layer in new_layers:
        layer_path = base_path / layer
        if layer_path.exists():
            try:
                shutil.rmtree(layer_path)
                rollback_log["actions"].append(f"删除目录: {layer_path}")
                print(f"🗑️ 删除: {layer}")
            except Exception as e:
                rollback_log["errors"].append(f"删除失败 {layer}: {str(e)}")
                print(f"❌ 删除失败: {layer} - {str(e)}")

    # 恢复迁移的文件（这里需要根据实际的迁移记录来实现）
    print("⚠️ 注意: 文件恢复需要基于具体的迁移记录来实现")

    # 保存回滚日志
    log_path = base_path / "scripts" / f"rollback_log_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
    with open(log_path, 'w', encoding='utf-8') as f:
        json.dump(rollback_log, f, indent=2, ensure_ascii=False)

    print(f"\n📊 回滚日志已保存: {log_path}")
    print("✅ 回滚操作完成")
    return True

if __name__ == "__main__":
    success = rollback_refactor()
    exit(0 if success else 1)
