# {{client_name}} 内容与发布质量稽核清单

> 适用项目：{{client_slug}}  
> 品牌语调：{{brand_voice_keywords_display}}  
> 系列信息：LaunchX「{{series_name}}」{{series_day_label}}｜更新频率 {{series_update_cadence}}  
> 禁用词汇：{{disallowed_phrases_display}}

## 1. 结构与内容要素
{{required_modules_checklist}}
- [ ] 每段落结合 Hook 策略：{{hook_strategies_display}}
- [ ] 互动引导涵盖：{{engagement_triggers_display}}
- [ ] 数据/引用来源覆盖：{{authority_sources_display}}
- [ ] 系列链路步骤完整引用：{{series_chain_steps_display}}

## 2. SEO 与标签
- 品牌主标签：#{{seo_brand_tag_display}}
- 默认标签清单：{{seo_default_tags_display}}
{{seo_default_tags_checklist}}
- 热门/趋势标签：{{seo_trending_display}}
- 关键词：{{seo_keywords_display}}
- 搜索词覆盖：{{seo_search_terms_display}}

## 3. 图像规范
- 图像生成服务：{{image_service_display}}
- 核心参数：{{image_quality_core}}
- 样式预设：{{image_style_presets_display}}
- 品牌元素要求：{{image_brand_elements_display}}
- 兜底素材来源：{{image_fallback_sources_display}}

## 4. 自动化执行前必检
- [ ] `automation/run_client.py --client {{client_slug}} --dry-run`
- [ ] 更新 `clients/{{client_slug}}/status.json` 的最新执行记录
- [ ] 核对 `system_quality_enforcement_checklist.md` 中要求
- [ ] `verification_tracker` 已更新所有外部线索状态

## 5. 发布后跟进
- [ ] 保存 `intel_report.json` `drafts.json` `images_manifest.json` 到 `{{storage_root}}`
- [ ] 发布日志、性能数据落盘并复用
- [ ] 周报 `reports/weekly/<最新周次>.md` 更新完成
- [ ] 将本清单存档并标注执行人/日期
