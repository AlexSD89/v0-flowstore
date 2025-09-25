# 任务分解 / Task Breakdown

## 核心任务列表 / Core Tasks

| Task ID | 描述 Description | 工具 / Agent | 依赖 Dependencies | 产出 Output |
|---------|-----------------|--------------|-------------------|--------------|
| T1 | 周度趋势与竞品情报 | RUBE MCP (`gather_xhs_intel`) | - | `intel/2025W40.json` |
| T2 | 生成 5 篇候选文案 | Claude `/ask` + Prompt | T1 | `drafts/2025W40.json` |
| T3 | AI 生图 / 选图 | Flux Schnell + 内部图库脚本 | T2 | `assets/generated/manifest_2025W40.json` |
| T4 | 合规审查与风格校验 | RUBE `text_guard` + `image_guard` | T2, T3 | `approved/2025W40.json` |
| T5 | 自动发帖 | 小红书 MCP `publish_content` | T4 | `logs/publish_*.json` |
| T6 | 表现监控与入库 | RUBE `capture_performance` | T5 | `performance/2025W40.csv` |

## Claude Task Blueprint

```yaml
version: 1
tasks:
  demo_fashion_automation:
    description: "Demo Fashion weekly XiaoHongShu automation"
    context:
      mcpServers:
        - xiaohongshu-mcp
        - rube
    steps:
      - run: rube.gather_xhs_intel
      - ask: |
          读取 automation/spec-kit/projects/demo/client-config.json。
          基于最新情报和品牌宪章，生成 5 篇图文内容。
          要求：标题 ≤ 20 字，正文 3 段，突出“都市轻盈穿搭”。
          JSON 输出格式：
          [{
            "title": "...",
            "body": "...",
            "tags": ["..."],
            "image_refs": ["look1.jpg", "look2.jpg"]
          }]
      - use: image-mcp.generate
        with:
          prompts: "{{step.prev.data}}"
          model: "flux-schnell"
          outputDir: "automation/spec-kit/projects/demo/assets/generated"
          fallbackLibrary: "/Users/dangsiyuan/Media/demo_fashion"
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
- [ ] 情报文件保存在 `projects/demo/data/intel/`
- [ ] 草稿存档 `projects/demo/data/drafts/`
- [ ] 生图文件 + manifest 存档 `projects/demo/assets/generated/`
- [ ] 发布日志 `projects/demo/logs/`
- [ ] 表现数据 `projects/demo/performance/`
- [ ] 周报 `projects/demo/reports/`
