#!/usr/bin/env python3
"""
Knowledge domain audit helper.

Scans the 🟣 knowledge workspace, validates frontmatter completeness,
reports structural issues, and surfaces duplicate content candidates.

Outputs both Markdown and JSON reports that can be consumed by
other automation or referenced in weekly reviews.
"""

from __future__ import annotations

import argparse
import json
import re
from collections import Counter, defaultdict
from dataclasses import dataclass, field
from datetime import datetime, timezone
from pathlib import Path
from typing import Dict, List, Optional, Tuple

import yaml

# Required frontmatter fields for compliance.
REQUIRED_FIELDS = ("title", "owners", "status", "last_update", "related", "source", "impact")

# Valid status values recognised by the knowledge governance guidelines.
VALID_STATUS = {"draft", "review", "published", "active", "archived"}

# Simple ISO date check (YYYY-MM-DD).
DATE_PATTERN = re.compile(r"^\d{4}-\d{2}-\d{2}$")

# Recommended title format (YYYYMMDD-Topic). Mixed cases are accepted.
TITLE_PATTERN = re.compile(r"^\d{8}[-_].+")

# Common suffixes that usually indicate staging variants.
TRIM_SUFFIX = re.compile(r"[-_](temp|draft|updated|final|latest|v\d+)$")


@dataclass
class FileAudit:
    path: Path
    top_level: str
    frontmatter: Optional[Dict] = None
    frontmatter_error: Optional[str] = None
    missing_fields: List[str] = field(default_factory=list)
    status_warning: Optional[str] = None
    date_warning: Optional[str] = None
    title_warning: Optional[str] = None


def parse_frontmatter(path: Path) -> Tuple[Optional[Dict], Optional[str]]:
    text = path.read_text(encoding="utf-8", errors="ignore")
    lines = text.splitlines()

    if not lines:
        return None, "empty file"

    if lines[0].strip() != "---":
        return None, "frontmatter delimiter not found"

    closing_idx = None
    for idx in range(1, len(lines)):
        if lines[idx].strip() == "---":
            closing_idx = idx
            break

    if closing_idx is None:
        return None, "frontmatter closing delimiter missing"

    frontmatter_block = "\n".join(lines[1:closing_idx]).strip()
    if not frontmatter_block:
        return None, "frontmatter block empty"

    try:
        data = yaml.safe_load(frontmatter_block)
    except yaml.YAMLError as exc:
        return None, f"yaml parse error: {exc}"

    if data is None:
        return None, "frontmatter parsed as None"

    if not isinstance(data, dict):
        return None, "frontmatter is not a mapping"

    return data, None


def normalise_slug(path: Path) -> str:
    name = path.stem.lower()
    name = TRIM_SUFFIX.sub("", name)
    return name


def audit_directory(knowledge_root: Path) -> Dict:
    audits: List[FileAudit] = []
    directory_stats: Dict[str, Counter] = defaultdict(Counter)
    missing_by_field: Counter = Counter()

    for md_path in sorted(knowledge_root.rglob("*.md")):
        rel = md_path.relative_to(knowledge_root)
        top_level = rel.parts[0] if len(rel.parts) > 1 else rel.parts[0]

        if md_path.name == ".DS_Store":
            continue

        frontmatter, error = parse_frontmatter(md_path)
        audit = FileAudit(path=md_path, top_level=top_level, frontmatter=frontmatter, frontmatter_error=error)

        if error is None and frontmatter:
            for field in REQUIRED_FIELDS:
                if field not in frontmatter or frontmatter[field] in (None, "", []):
                    audit.missing_fields.append(field)
                    missing_by_field[field] += 1

            status = frontmatter.get("status")
            if status and status not in VALID_STATUS:
                audit.status_warning = f"unexpected status '{status}'"

            last_update = frontmatter.get("last_update")
            if last_update and not DATE_PATTERN.match(str(last_update)):
                audit.date_warning = f"invalid date '{last_update}'"

            title = frontmatter.get("title")
            if title and not TITLE_PATTERN.match(str(title)):
                audit.title_warning = f"non-standard title '{title}'"

        directory_stats[top_level]["files"] += 1
        if error:
            directory_stats[top_level]["frontmatter_issues"] += 1
        if audit.missing_fields:
            directory_stats[top_level]["missing_required_fields"] += 1

        audits.append(audit)

    duplicates = defaultdict(list)
    for audit in audits:
        slug = f"{audit.top_level}:{normalise_slug(audit.path)}"
        duplicates[slug].append(str(audit.path.relative_to(knowledge_root)))

    duplicate_candidates = [
        {"slug": slug, "files": paths}
        for slug, paths in duplicates.items()
        if len(paths) > 1
    ]

    summary = {
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "knowledge_root": str(knowledge_root),
        "totals": {
            "files": len(audits),
            "frontmatter_issues": sum(1 for audit in audits if audit.frontmatter_error),
            "missing_required_fields": sum(1 for audit in audits if audit.missing_fields),
        },
        "missing_field_counts": dict(missing_by_field),
        "directory_stats": [
            {
                "directory": directory,
                "files": stats.get("files", 0),
                "frontmatter_issues": stats.get("frontmatter_issues", 0),
                "missing_required_fields": stats.get("missing_required_fields", 0),
            }
            for directory, stats in sorted(directory_stats.items())
        ],
        "files_with_issues": [
            {
                "path": str(audit.path.relative_to(knowledge_root)),
                "frontmatter_error": audit.frontmatter_error,
                "missing_fields": audit.missing_fields,
                "status_warning": audit.status_warning,
                "date_warning": audit.date_warning,
                "title_warning": audit.title_warning,
            }
            for audit in audits
            if audit.frontmatter_error or audit.missing_fields or audit.status_warning or audit.date_warning or audit.title_warning
        ],
        "duplicate_candidates": sorted(duplicate_candidates, key=lambda item: item["slug"]),
    }

    return summary


def render_markdown(summary: Dict) -> str:
    header = [
        "# 🟣 Knowledge Audit Report",
        "",
        f"- 生成时间：{summary['generated_at']}",
        f"- 扫描目录：`{summary['knowledge_root']}`",
        "",
        "## 1. 基础统计",
        f"- 总 Markdown 数量：{summary['totals']['files']}",
        f"- Frontmatter 异常：{summary['totals']['frontmatter_issues']}",
        f"- 缺失必填字段：{summary['totals']['missing_required_fields']}",
        "",
    ]

    directory_table = ["## 2. 目录概览", "", "| 目录 | 文件数 | Frontmatter 异常 | 缺失必填字段 |", "| --- | ---: | ---: | ---: |"]
    for stats in summary["directory_stats"]:
        directory_table.append(
            f"| {stats['directory']} | {stats['files']} | {stats['frontmatter_issues']} | {stats['missing_required_fields']} |"
        )

    missing_fields_section = ["", "## 3. 必填字段缺口", ""]
    if summary["missing_field_counts"]:
        for field, count in sorted(summary["missing_field_counts"].items(), key=lambda item: item[1], reverse=True):
            missing_fields_section.append(f"- `{field}` 缺失 {count} 篇")
    else:
        missing_fields_section.append("- 所有必填字段已完成 ✅")

    issue_lines = ["", "## 4. 重点关注文件", ""]
    issue_entries = summary["files_with_issues"][:80]  # Limit verbosity.
    if issue_entries:
        for item in issue_entries:
            notes = []
            if item["frontmatter_error"]:
                notes.append(item["frontmatter_error"])
            if item["missing_fields"]:
                notes.append(f"缺失字段：{', '.join(item['missing_fields'])}")
            if item["status_warning"]:
                notes.append(item["status_warning"])
            if item["date_warning"]:
                notes.append(item["date_warning"])
            if item["title_warning"]:
                notes.append(item["title_warning"])
            issue_lines.append(f"- `{item['path']}` → " + "；".join(notes))

        if len(summary["files_with_issues"]) > len(issue_entries):
            issue_lines.append("")
            issue_lines.append(f"> 其余 {len(summary['files_with_issues']) - len(issue_entries)} 条已写入 JSON 报告。")
    else:
        issue_lines.append("- 暂无异常条目。")

    duplicates_section = ["", "## 5. 重复候选", ""]
    if summary["duplicate_candidates"]:
        for item in summary["duplicate_candidates"][:40]:
            file_list = ", ".join(item["files"])
            duplicates_section.append(f"- `{item['slug']}` → {file_list}")
        if len(summary["duplicate_candidates"]) > 40:
            duplicates_section.append("")
            duplicates_section.append("> 更多重复候选查看 JSON 报告。")
    else:
        duplicates_section.append("- 未发现疑似重复文件 ✅")

    return "\n".join(header + directory_table + missing_fields_section + issue_lines + duplicates_section) + "\n"


def main() -> None:
    parser = argparse.ArgumentParser(description="Audit the 🟣 knowledge workspace for governance compliance.")
    parser.add_argument(
        "--knowledge-root",
        type=Path,
        default=Path(__file__).resolve().parents[5] / "🟣 knowledge",
        help="Path to the knowledge root directory.",
    )
    parser.add_argument(
        "--output-dir",
        type=Path,
        default=Path(__file__).resolve().parents[1] / "reports",
        help="Directory to store audit reports.",
    )
    args = parser.parse_args()

    knowledge_root = args.knowledge_root.resolve()
    if not knowledge_root.exists():
        raise SystemExit(f"Knowledge root not found: {knowledge_root}")

    summary = audit_directory(knowledge_root)
    args.output_dir.mkdir(parents=True, exist_ok=True)

    markdown_report = render_markdown(summary)
    md_path = args.output_dir / "knowledge_audit_report.md"
    md_path.write_text(markdown_report, encoding="utf-8")

    json_path = args.output_dir / "knowledge_audit_report.json"
    json_path.write_text(json.dumps(summary, indent=2, ensure_ascii=False), encoding="utf-8")

    print(f"Audit complete.\n- Markdown: {md_path}\n- JSON: {json_path}")


if __name__ == "__main__":
    main()
