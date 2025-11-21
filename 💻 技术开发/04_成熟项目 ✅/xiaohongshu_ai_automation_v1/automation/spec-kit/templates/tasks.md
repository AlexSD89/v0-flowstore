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
      - id: gather_intel
        run: rube.gather_xhs_intel
      - id: generate_payload
        ask: |
          系列信息：LaunchX「{{series_name}}」{{series_day_label}}｜{{series_value_promise}}
          链路步骤：{{series_chain_steps_display}}
          节点分工：{{series_node_names_display}}
          颜色要求：主色 {{series_palette_primary}} ，强调色 {{series_palette_accent}}
          请基于最新情报为 {{client_name}} 生成 {{post_count}} 篇图文内容。
          每篇需输出如下 JSON 结构（所有字段必填，按顺序输出 {{post_count}} 项）：
          {
            "title": "20 字以内标题",
            "body": "三段正文，突出 {{brand_voice_keywords}}，并依次覆盖 {{required_modules_display}}",
            "tags": ["标签1", "标签2", "标签3"],
            "image_prompt": "英文生图提示词，结合 {{prompt_style_keywords}}，强调主色 {{series_palette_primary}} 与强调色 {{series_palette_accent}}",
            "safety_notes": "需要在合规审查中特别关注的要点（如是否涉及敏感行业、隐私数据等）",
            "tool_breakdown": {
              "线索捕获": "对应节点与量化指标",
              "互动培育": "对应节点与量化指标",
              "成交辅导": "对应节点与量化指标",
              "团队扩编": "对应节点与量化指标",
              "数据回流": "对应节点与量化指标"
            },
            "action_calls": {
              "comment": "评论区问题",
              "dm": "私信引导语",
              "save": "收藏提示",
              "follow": "关注提醒"
            },
            "citations": ["引用来源 1", "引用来源 2"]
          }
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
          输出 JSON：{"posts": [...], "meta": {"generated_at": "{{now}}", "intel_step": "gather_intel"}}
      - id: generate_images
        use: {{image_generation_tool}}
        foreach: "{{steps.generate_payload.data.posts}}"
        with:
          prompt: "{{item.image_prompt}}"
          style: "{{prompt_style_keywords}}"
          outputDir: "{{asset_output_dir}}"
      - id: image_safety
        use: rube.image_guard
        with:
          payload: "{{step.prev.data}}"
      - id: assemble_payload
        ask: |
          你将获得两份 JSON 数据。
          1) 原始图文草稿：{{steps.generate_payload.data.posts}}
          2) 生图结果 manifest：{{steps.generate_images.data}}
          请按照 `post_id` 或数组顺序将图片路径写回对应的图文草稿，输出新的数组：
          [{
            "title": "...",
            "body": "...",
            "tags": ["..."],
            "generated_images": ["/abs/path/img1.png", "..."]
          }]
      - id: text_safety
        use: rube.text_guard
        with:
          payload: "{{step.prev.data}}"
      - id: publish_batch
        use: xiaohongshu-mcp.publish_content
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
