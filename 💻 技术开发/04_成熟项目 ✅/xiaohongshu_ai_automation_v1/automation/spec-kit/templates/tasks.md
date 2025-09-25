# 任务分解 / Task Breakdown

## 核心任务列表 / Core Tasks

| Task ID | 描述 Description | 工具 / Agent | 依赖 Dependencies | 产出 Output |
|---------|-----------------|--------------|-------------------|--------------|
| T1 | 收集市场与竞品情报 Gather intel | RUBE MCP (`gather_xhs_intel`) | - | `intel_report.json` |
| T2 | 生成文案候选稿 Draft copy | Claude `/ask` + custom prompt | T1 | `drafts.json` |
| T3 | AI 生成/检索图片 Image generation | {{image_generation_tool}} | T2 | `images_manifest.json` |
| T4 | 合规与风格审查 Compliance pass | RUBE `text_guard` / `image_guard` | T2, T3 | `approved_content.json` |
| T5 | 多渠道发布 Multi-channel publish | {{primary_mcp}} (`publish_content`) | T4 | 发布结果日志 |
| T6 | 表现监控与回写 Monitor & log | RUBE analytics + 数据仓库 | T5 | `performance_log.csv` |

## Claude Task Blueprint

```yaml
version: 1
tasks:
  {{client_slug}}_automation:
    description: "{{client_name}} end-to-end automation"
    context:
      mcpServers:
        - xiaohongshu-mcp
        - rube
{{#if additional_mcp_block}}
{{additional_mcp_block}}
{{/if}}
    steps:
      - run: rube.gather_xhs_intel
      - ask: |
          系列信息：LaunchX「{{series_name}}」{{series_day_label}}｜{{series_value_promise}}
          链路步骤：{{series_chain_steps_display}}
          节点分工：{{series_node_names_display}}
          颜色要求：主色 {{series_palette_primary}} ，强调色 {{series_palette_accent}}
          请基于最新情报为 {{client_name}} 生成 {{post_count}} 篇图文内容，每篇包含：
          1. 20 字以内标题
          2. 三段正文（突出 {{brand_voice_keywords}}）
          3. 3-5 个标签，避免 {{disallowed_phrases}}
          文案结构要求（逐条覆盖）：
{{required_modules_prompt_block}}
          Hook 策略参考：{{hook_strategies_display}}
          互动触发请至少包含：{{engagement_triggers_display}}
          引用来源需覆盖：{{authority_sources_display}}
          对链路中每个 AI 工具，必须输出：
{{series_chain_steps_prompt_block}}
            - 工具背景速览（定位、典型客户、行业口碑）
            - 三步即用指南（入口、配置、验证指标）
            - 实测指标（用数据支撑）
            - 客户在乎的风险/合规提醒
          节点详细说明：
{{series_nodes_prompt_block}}
          系列开场白需要复用：{{series_opening_template}}
          写作语言要求：面向企业业务负责人，避免行业黑话与内部术语，用真实数据和案例说服。
          输出 JSON：[{"title":...,"body":...,"tags":[],"image_refs":[]}]
      - use: {{image_generation_tool}}
        with:
          prompts: "{{step.prev.data}}"
          style: "{{prompt_style_keywords}}"
          outputDir: "{{asset_output_dir}}"
      - use: rube.text_guard
        with:
          payload: "{{step.prev.data}}"
      - use: rube.image_guard
        with:
          payload: "{{step.prev.data}}"
      - use: xiaohongshu-mcp.publish_content
        foreach: "{{step.prev.data}}"
        with:
          title: "{{item.title}}"
          content: "{{item.body}}"
          images: "{{item.generated_images}}"
          tags: "{{item.tags}}"
      - use: xiaohongshu-mcp.check_login_status
      - run: rube.capture_performance
```

## 数据留痕 / Logging Checklist
- [ ] 保存 `intel_report.json` → `{{storage_root}}/data/intel/`
- [ ] 保存 `drafts.json` → `{{storage_root}}/data/drafts/`
- [ ] 保存 `images_manifest.json` 与生成图片 → `{{asset_output_dir}}`
- [ ] 发布结果 `publish_log.json`
- [ ] 表现跟踪 `performance/YYYY-MM-DD.csv`
- [ ] 生成周报 `reports/weekly/{{week_id}}.md`
- [ ] 质量稽核表：`execution/{{client_slug}}_quality_checklist.md` 完成勾选
