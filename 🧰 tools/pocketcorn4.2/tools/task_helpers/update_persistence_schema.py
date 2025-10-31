"""Placeholder script for persistence schema updates.

目前仅输出提示，真实项目中可在此迁移数据库结构或生成 Alembic migration。
"""
from __future__ import annotations

from pocketcorn.collectors.models import MissionRunSummary, CoverageStats


def main() -> None:
    fields = MissionRunSummary.model_fields
    print("MissionRunSummary fields:")
    for name in fields:
        print(f"- {name}")
    print("确保数据库层对应字段已同步（analysis 字段、companies_detected 中风险/文化信息等）。")


if __name__ == "__main__":
    main()
