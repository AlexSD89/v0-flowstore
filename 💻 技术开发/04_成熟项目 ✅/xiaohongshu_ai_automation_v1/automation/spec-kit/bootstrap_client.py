#!/usr/bin/env python3
"""Bootstrap a client workspace from Spec Kit templates.

The script is intentionally dependency-free so it can run inside the
automation repo without additional installs.
"""
from __future__ import annotations

import argparse
import json
from pathlib import Path
from typing import Dict

SCRIPT_DIR = Path(__file__).resolve().parent
PROJECT_ROOT = SCRIPT_DIR.parent.parent
CLIENTS_ROOT = PROJECT_ROOT / "clients"
CLAUDE_TASKS_ROOT = PROJECT_ROOT / "automation" / "claude_tasks"
TEMPLATES_ROOT = SCRIPT_DIR / "templates"

DEFAULT_CONTEXT: Dict[str, object] = {
    "client_name": "Example Client",
    "client_slug": "example-client",
    "industry": "AI 自动化",
    "target_audience": "数字化决策者",
    "brand_vision": "让每个团队拥有自己的 AI 工作室",
    "brand_voice_keywords": "权威、可信、专业",
    "disallowed_phrases": "割韭菜,保底收益",
    "emoji_policy": "标题≤2个 emoji，正文每段≤1个",
    "visual_mood": "赛博蓝 + 清晨暖光",
    "primary_palette": "#1B6BFF / #F2B705",
    "composition_rules": "中心主体 + 留白，突出产品使用场景",
    "prompt_style_keywords": "futuristic neon, cinematic lighting",
    "content_length_rules": "图文 400-600 字，视频脚本 60-90 秒",
    "image_requirements": "3:4 竖版，最少 2 张，清晰可见产品",
    "review_policy": "高价值内容需人工抽检，敏感话题全审",
    "platform_rules_refs": "小红书社区公约 2025 版",
    "legal_refs": "《广告法》《数据安全法》",
    "privacy_policy": "严格 anonymize 用户数据",
    "daily_publish_limit": 5,
    "manual_review_cases": "医疗、金融、未成年人相关内容",
    "escalation_channels": "#ops-alerts on Slack",
    "preferred_agent": "Claude 3.5 Sonnet",
    "mcp_services": "xiaohongshu-mcp + rube",
    "data_storage": "SQLite + Parquet + S3",
    "intel_gathering_plan": "Rube 工作流并发抓取竞品/话题",
    "strategy_plan": "Subagent 军团结合品牌宪章生成周策略",
    "content_plan": "按 A/B/C/D 占比批量生成草稿",
    "image_generation_plan": "Flux + 素材库兜底",
    "publishing_plan": "XHS MCP 定时发布 + 失败重试",
    "monitoring_plan": "10 分钟轮询表现并写入数据仓",
    "claude_tasks": "automation/claude_tasks/<slug>.yaml",
    "rube_workflows": "gather_xhs_intel, capture_performance",
    "xhs_mcp_usage": "publish_content, check_login_status",
    "additional_mcp_usage": "",
    "preflight_checks": "登录态、合规检查、图片尺寸",
    "monitoring_alerting": "Prometheus + Slack 告警",
    "quality_metrics": "曝光、互动率、转化线索",
    "asset_priority": "图文 > 生图 > 视频",
    "image_ai_models": "flux-schnell",
    "asset_rights_policy": "保存 Prompt + 模型版本用于审计",
    "publish_frequency": "每日 3-5 篇",
    "report_frequency": "weekly",
    "retro_cadence": "每周一早 09:30",
    "project_goal": "搭建企业应用 AI 功能评测的权威账号矩阵",
    "success_metrics": "粉丝增长、咨询线索、GMV 转化",
    "scenario_one": "AI 功能深度评测",
    "scenario_two": "企业选型决策指导",
    "scenario_three": "生态合作线索撮合",
    "timeframe": "T0+90 天三阶段里程碑",
    "resource_limits": "人工审核 ≤ 1 人天/周",
    "platform_mix": "小红书 主阵地，微博/B站 备选",
    "recurring_outputs": "周度策略 + AI 内容包 + 报告",
    "one_time_outputs": "品牌宪章、全托管 SOP",
    "report_formats": "Markdown + 图表附件",
    "external_dependencies": "Rube 工具、XHS 登录态、图像模型",
    "key_risks": "平台风控、素材版权、模型漂移",
    "mitigations": "加强反检测、保留素材授权、定期复训",
    "post_count": 5,
    "asset_output_dir": "projects/example-client/assets/generated",
    "image_generation_tool": "image-mcp.generate",
    "image_ai_models_list": ["flux-schnell"],
    "image_fallback_sources": "Pexels",
    "primary_mcp": "xiaohongshu-mcp",
    "additional_mcp": "",
    "storage_root": "projects/example-client",
}


def _format_list_display(items, sep: str = ", ") -> str:
    values = [str(item).strip() for item in items if str(item).strip()]
    return sep.join(values) if values else "待补充"


def _format_checklist(items, prefix: str = "- [ ] ", indent: str = "") -> str:
    values = [str(item).strip() for item in items if str(item).strip()]
    if not values:
        return f"{indent}{prefix}待补充"
    return "\n".join(f"{indent}{prefix}{value}" for value in values)


def _format_prompt_lines(items, indent: str = "          - ") -> str:
    values = [str(item).strip() for item in items if str(item).strip()]
    if not values:
        return f"{indent}请补充结构模块"
    return "\n".join(f"{indent}{value}" for value in values)


def _format_node_prompt_block(nodes: list[dict[str, object]]) -> str:
    indent = "          "
    if not nodes:
        return f"{indent}- 节点信息待补充"
    lines: list[str] = []
    for node in nodes:
        name = str(node.get("name", "")).strip()
        one_liner = str(node.get("one_liner", "")).strip()
        background = str(node.get("background", "")).strip()
        role = str(node.get("role", "")).strip()
        quick_steps = node.get("quick_steps") or []
        key_traits = node.get("key_traits") or []
        metrics = str(node.get("metrics", "")).strip()
        risks = str(node.get("risks", "")).strip()
        lines.append(f"{indent}- 节点：{name}")
        if one_liner:
            lines.append(f"{indent}  一句话定位：{one_liner}")
        if background:
            lines.append(f"{indent}  背景：{background}")
        if role:
            lines.append(f"{indent}  角色：{role}")
        if key_traits:
            lines.append(f"{indent}  关键特性：")
            for trait in key_traits:
                trait_str = str(trait).strip()
                if trait_str:
                    lines.append(f"{indent}    · {trait_str}")
        if quick_steps:
            for step in quick_steps:
                step_str = str(step).strip()
                if step_str:
                    lines.append(f"{indent}  · {step_str}")
        if metrics:
            lines.append(f"{indent}  指标：{metrics}")
        if risks:
            lines.append(f"{indent}  风险：{risks}")
    return "\n".join(lines)


def load_context(path: Path | None, client_slug: str) -> Dict[str, object]:
    context = DEFAULT_CONTEXT.copy()
    if path and path.exists():
        loaded = json.loads(path.read_text(encoding="utf-8"))
        context.update(loaded)
    # Ensure slug/name fallbacks
    context.setdefault("client_slug", client_slug)
    context.setdefault("client_name", client_slug.replace("-", " ").title())
    context.setdefault("default_run_id", f"{client_slug}_automation")
    context.setdefault("claude_task_file", f"automation/claude_tasks/{client_slug}.yaml")
    # Derived fields for lists vs. human readable text
    image_models = context.get("image_ai_models_list")
    if isinstance(image_models, list):
        context["image_ai_models"] = ", ".join(image_models)
    context = _maybe_format_list(context, "brand_voice_keywords", joiner="、")
    context = _maybe_format_list(context, "disallowed_phrases", joiner="、")
    context = _maybe_format_list(context, "prompt_style_keywords", joiner=", ")
    context = _maybe_format_list(context, "image_ai_models", joiner=", ")
    context = _maybe_format_list(context, "image_fallback_sources", joiner=", ")
    additional = context.get("additional_mcp")
    if isinstance(additional, list):
        context["additional_mcp_block"] = "\n".join(
            f"        - {item}" for item in additional if str(item).strip()
        )
    elif isinstance(additional, str) and additional.strip():
        context["additional_mcp_block"] = f"        - {additional.strip()}"
    else:
        context["additional_mcp_block"] = ""
    if not context.get("asset_output_dir"):
        context["asset_output_dir"] = f"clients/{client_slug}/assets/generated"
    if not context.get("content_output_dir"):
        context["content_output_dir"] = f"clients/{client_slug}/assets/content"
    if not context.get("data_output_dir"):
        context["data_output_dir"] = f"clients/{client_slug}/data"
    if not context.get("storage_root"):
        context["storage_root"] = f"clients/{client_slug}"

    # Derived content structure fields
    content_structure = context.get("content_structure")
    if isinstance(content_structure, dict):
        required_modules = _ensure_list(content_structure.get("required_modules"))
        hook_strategies = _ensure_list(content_structure.get("hook_strategies"))
        engagement_triggers = _ensure_list(content_structure.get("engagement_triggers"))
        authority_sources = _ensure_list(content_structure.get("data_authority_sources"))
    else:
        required_modules = []
        hook_strategies = []
        engagement_triggers = []
        authority_sources = []

    context["required_modules_list"] = required_modules
    context["required_modules_display"] = _format_list_display(required_modules, " / ")
    context["required_modules_checklist"] = _format_checklist(required_modules)
    context["required_modules_prompt_block"] = _format_prompt_lines(required_modules)

    context["hook_strategies_display"] = _format_list_display(hook_strategies, " / ")
    context["hook_strategies_checklist"] = _format_checklist(hook_strategies)

    context["engagement_triggers_display"] = _format_list_display(engagement_triggers, " / ")
    context["engagement_triggers_checklist"] = _format_checklist(engagement_triggers)

    context["authority_sources_display"] = _format_list_display(authority_sources, " / ")
    context["authority_sources_checklist"] = _format_checklist(authority_sources)

    # SEO derived fields
    seo = context.get("seo_optimization")
    if isinstance(seo, dict):
        default_tags = _ensure_list(seo.get("default_tags"))
        trending_tags = _ensure_list(seo.get("trending_hashtags"))
        keywords = _ensure_list(seo.get("seo_keywords"))
        search_terms = _ensure_list(seo.get("target_search_terms"))
        brand_tag = seo.get("brand_tag")
    else:
        default_tags = trending_tags = keywords = search_terms = []
        brand_tag = None

    hashtag_prefix = [f"#{tag}" for tag in default_tags]
    context["seo_default_tags_display"] = _format_list_display(hashtag_prefix, "、")
    context["seo_default_tags_checklist"] = _format_checklist(hashtag_prefix)
    context["seo_trending_display"] = _format_list_display([f"#{tag}" for tag in trending_tags], "、")
    context["seo_keywords_display"] = _format_list_display(keywords, "、")
    context["seo_search_terms_display"] = _format_list_display(search_terms, "、")
    context["seo_brand_tag_display"] = brand_tag or "待补充"

    # Image config derived fields
    image_config = context.get("image_quality_config")
    if isinstance(image_config, dict):
        image_service = image_config.get("image_service")
        quality_settings = image_config.get("quality_settings") or {}
        style_presets = image_config.get("style_presets") or {}
        brand_elements = image_config.get("brand_elements") or {}
    else:
        image_service = None
        quality_settings = {}
        style_presets = {}
        brand_elements = {}

    context["image_service_display"] = str(image_service or context.get("image_generation_tool") or "待补充")

    quality_parts = []
    for key in ("resolution", "dpi", "format", "compression"):
        value = quality_settings.get(key)
        if value:
            if key == "dpi":
                quality_parts.append(f"{value} DPI")
            elif key == "compression":
                quality_parts.append(f"{value} 压缩")
            else:
                quality_parts.append(str(value))
    context["image_quality_core"] = "，".join(quality_parts) if quality_parts else "按项目默认参数"

    style_items = [f"{name}: {desc}" for name, desc in style_presets.items()]
    context["image_style_presets_display"] = _format_list_display(style_items, "；")

    brand_items = [f"{name}: {value}" for name, value in brand_elements.items()]
    context["image_brand_elements_display"] = _format_list_display(brand_items, "；")

    fallback_sources = _ensure_list(context.get("image_fallback_sources_list") or context.get("image_fallback_sources"))
    context["image_fallback_sources_display"] = _format_list_display(fallback_sources, "、")

    # Additional display helpers
    disallowed = context.get("disallowed_phrases_list") or context.get("disallowed_phrases") or []
    context["disallowed_phrases_display"] = _format_list_display(_ensure_list(disallowed), "、")

    voice_keywords = context.get("brand_voice_keywords_list") or context.get("brand_voice_keywords") or []
    context["brand_voice_keywords_display"] = _format_list_display(_ensure_list(voice_keywords), "、")

    # Series preset helpers
    series = context.get("series_preset")
    if isinstance(series, dict):
        series_name = series.get("name", "")
        series_slug = series.get("slug", "")
        day_label = series.get("current_day_label", "")
        palette = series.get("color_palette") or {}
        chain_steps = _ensure_list(series.get("chain_steps"))
        context["series_name"] = series_name or ""
        context["series_slug"] = series_slug or ""
        context["series_day_label"] = day_label or ""
        context["series_palette_primary"] = palette.get("primary", "")
        context["series_palette_accent"] = palette.get("accent", "")
        context["series_chain_steps_display"] = _format_list_display(chain_steps, " → ")
        context["series_chain_steps_prompt_block"] = _format_prompt_lines(chain_steps)
        context["series_value_promise"] = series.get("value_promise", "")
        context["series_opening_template"] = series.get("opening_template", "")
        context["series_update_cadence"] = series.get("update_cadence", "")
    else:
        context["series_name"] = ""
        context["series_slug"] = ""
        context["series_day_label"] = ""
        context["series_palette_primary"] = ""
        context["series_palette_accent"] = ""
        context["series_chain_steps_display"] = "待补充"
        context["series_chain_steps_prompt_block"] = _format_prompt_lines([])
        context["series_value_promise"] = ""
        context["series_opening_template"] = ""
        context["series_update_cadence"] = ""

    nodes = context.get("sales_chain_nodes")
    if isinstance(nodes, list):
        node_names = [str(node.get("name", "")).strip() for node in nodes if str(node.get("name", "")).strip()]
        context["series_node_names_display"] = _format_list_display(node_names, " / ")
        context["series_nodes_prompt_block"] = _format_node_prompt_block(nodes)
    else:
        context["series_node_names_display"] = "待补充"
        context["series_nodes_prompt_block"] = _format_node_prompt_block([])

    return context


def render_template(template_path: Path, context: Dict[str, object]) -> str:
    text = template_path.read_text(encoding="utf-8")

    # Handle simple optional blocks: {{#if key}} ... {{/if}}
    for key in ("additional_mcp", "additional_mcp_block"):
        start_token = f"{{{{#if {key}}}}}"
        end_token = "{{/if}}"
        while start_token in text:
            start_idx = text.index(start_token)
            end_idx = text.index(end_token, start_idx)
            inner = text[start_idx + len(start_token): end_idx]
            raw_value = context.get(key, "")
            value = str(raw_value)
            should_strip = key != "additional_mcp_block"
            eval_value = value.strip() if should_strip else value
            replacement = inner if eval_value else ""
            if eval_value:
                replacement = replacement.replace(
                    f"{{{{{key}}}}}", value if should_strip else value
                )
                if key == "additional_mcp_block" and replacement.startswith("\n"):
                    replacement = replacement[1:]
            text = text[:start_idx] + replacement + text[end_idx + len(end_token):]

    for key, value in context.items():
        placeholder = f"{{{{{key}}}}}"
        if placeholder in text:
            if isinstance(value, (dict, list)):
                replacement = json.dumps(value, ensure_ascii=False)
            else:
                replacement = str(value)
            text = text.replace(placeholder, replacement)
    return text


def ensure_directories(client_root: Path) -> None:
    paths = [
        client_root,
        client_root / "strategy",
        client_root / "execution",
        client_root / "reports",
        client_root / "logs",
        client_root / "assets" / "generated",
        client_root / "data" / "intel",
        client_root / "data" / "drafts",
    ]
    for path in paths:
        path.mkdir(parents=True, exist_ok=True)


def write_file(path: Path, content: str, force: bool) -> None:
    if path.exists() and not force:
        print(f"[skip] {path} already exists")
        return
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(content, encoding="utf-8")
    print(f"[write] {path}")


def dump_client_config(client_root: Path, context: Dict[str, object], force: bool) -> None:
    config_path = client_root / "client-config.json"
    if config_path.exists() and not force:
        print(f"[skip] {config_path} already exists")
        return
    config = {
        "client_name": context["client_name"],
        "client_slug": context["client_slug"],
        "industry": context.get("industry"),
        "target_audience": context.get("target_audience"),
        "brand_voice_keywords": _ensure_list(
            context.get("brand_voice_keywords_list") or context.get("brand_voice_keywords")
        ),
        "disallowed_phrases": _ensure_list(
            context.get("disallowed_phrases_list") or context.get("disallowed_phrases")
        ),
        "prompt_style_keywords": _ensure_list(
            context.get("prompt_style_keywords_list") or context.get("prompt_style_keywords")
        ),
        "daily_publish_limit": context.get("daily_publish_limit", 5),
        "post_count": context.get("post_count", 5),
        "asset_output_dir": context.get("asset_output_dir"),
        "content_output_dir": context.get("content_output_dir"),
        "data_output_dir": context.get("data_output_dir"),
        "image_generation_tool": context.get("image_generation_tool"),
        "image_ai_models": _ensure_list(
            context.get("image_ai_models_list") or context.get("image_ai_models")
        ),
        "image_fallback_sources": _ensure_list(
            context.get("image_fallback_sources_list") or context.get("image_fallback_sources")
        ),
        "primary_mcp": context.get("primary_mcp", "xiaohongshu-mcp"),
        "additional_mcp": _ensure_list(context.get("additional_mcp")),
        "report_frequency": context.get("report_frequency", "weekly"),
        "storage_root": context.get("storage_root"),
        "default_run_id": context.get("default_run_id", f"{client_root.name}_automation"),
        "claude_task_file": context.get("claude_task_file", f"automation/claude_tasks/{client_root.name}.yaml"),
    }

    if context.get("content_structure"):
        config["content_structure"] = context["content_structure"]
    if context.get("seo_optimization"):
        config["seo_optimization"] = context["seo_optimization"]
    if context.get("image_quality_config"):
        config["image_quality_config"] = context["image_quality_config"]
    if context.get("content_modes"):
        config["content_modes"] = context["content_modes"]
    if context.get("mobile_optimization"):
        config["mobile_optimization"] = context["mobile_optimization"]
    if context.get("content_templates"):
        config["content_templates"] = context["content_templates"]
    if context.get("knowledge_base_integration"):
        config["knowledge_base_integration"] = context["knowledge_base_integration"]
    if context.get("series_preset"):
        config["series_preset"] = context["series_preset"]
    if context.get("sales_chain_nodes"):
        config["sales_chain_nodes"] = context["sales_chain_nodes"]
    if context.get("customer_personas"):
        config["customer_personas"] = context["customer_personas"]
    if context.get("tool_database"):
        config["tool_database"] = context["tool_database"]

    config_path.write_text(json.dumps(config, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"[write] {config_path}")


def _maybe_format_list(context: Dict[str, object], key: str, joiner: str = ", ") -> Dict[str, object]:
    value = context.get(key)
    list_key = f"{key}_list"
    if isinstance(value, list):
        context[list_key] = value
        context[key] = joiner.join(str(item) for item in value)
    elif isinstance(value, str):
        parsed = [item.strip() for item in value.split(",") if item.strip()]
        if parsed:
            context[list_key] = parsed
            context[key] = joiner.join(parsed)
    elif value is None:
        context[list_key] = []
    else:
        context[list_key] = [value]
        context[key] = joiner.join(str(item) for item in context[list_key])
    return context


def _ensure_list(value: object) -> list:
    if value is None:
        return []
    if isinstance(value, list):
        return value
    if isinstance(value, str):
        cleaned = [v.strip() for v in value.split(",") if v.strip()]
        return cleaned
    return [value]


def main() -> None:
    parser = argparse.ArgumentParser(description="Bootstrap client workspace from templates")
    parser.add_argument("--client", required=True, help="Client slug, e.g. launch-x")
    parser.add_argument("--config", type=Path, help="Optional JSON file with template values")
    parser.add_argument("--force", action="store_true", help="Overwrite existing files")
    args = parser.parse_args()

    client_slug = args.client
    context = load_context(args.config, client_slug)

    client_root = CLIENTS_ROOT / client_slug
    ensure_directories(client_root)

    render_plan = [
        (TEMPLATES_ROOT / "constitution.md", client_root / "strategy" / f"{client_slug}_brand_constitution.md"),
        (TEMPLATES_ROOT / "spec.md", client_root / "strategy" / f"{client_slug}_project_spec.md"),
        (TEMPLATES_ROOT / "plan.md", client_root / "execution" / f"{client_slug}_implementation_plan.md"),
        (TEMPLATES_ROOT / "quality_checklist.md", client_root / "execution" / f"{client_slug}_quality_checklist.md"),
        (TEMPLATES_ROOT / "tasks.md", CLAUDE_TASKS_ROOT / f"{client_slug}.yaml"),
    ]

    for template_path, dest_path in render_plan:
        content = render_template(template_path, context)
        write_file(dest_path, content, args.force)

    dump_client_config(client_root, context, args.force)
    print("Bootstrap complete ✅")


if __name__ == "__main__":
    main()
