# LaunchX 内容与发布质量稽核清单

> 适用项目：launch-x  
> 品牌语调：权威、专业、洞察  
> 系列信息：LaunchX「企业AI武器库」Day1｜更新频率 每周三 18:00  
> 禁用词汇：割韭菜、稳赚不赔、无风险

## 1. 结构与内容要素
- [ ] 功能亮点
- [ ] 差异化优势
- [ ] 受众场景
- [ ] 获取方式/地址
- [ ] 最新市场表现
- [ ] 头部信号引用
- [ ] 行动建议
- [ ] 每段落结合 Hook 策略：数据震撼 / 真实实测开箱 / 竞争对比悬念 / 行业趋势预警 / 用户故事切入
- [ ] 互动引导涵盖：评论问题 / 私信引导 / 收藏提示 / 关注提醒
- [ ] 数据/引用来源覆盖：CB Insights / IDC / Gartner / 艾瑞咨询 / 官方案例链接
- [ ] 系列链路步骤完整引用：线索捕获 → 互动培育 → 成交辅导 → 团队扩编 → 数据回流

## 2. SEO 与标签
- 品牌主标签：#LaunchX
- 默认标签清单：#LaunchX、#AI工具评测、#企业数字化
- [ ] #LaunchX
- [ ] #AI工具评测
- [ ] #企业数字化
- 热门/趋势标签：#智能办公、#AI选型、#企业效率提升
- 关键词：AI工具对比、企业AI评测、SaaS选型指南
- 搜索词覆盖：AI工具哪个强、企业AI工具推荐、AI效率平台

## 3. 图像规范
- 图像生成服务：flux-schnell
- 核心参数：1080x1440，300 DPI，PNG，lossless 压缩
- 样式预设：data_radar: futuristic radar chart, neon blue accents, clean background；comparison_bar: dual-tone bar chart, LaunchX blue & gold, minimal grid；scenario_focus: business professional in action, soft depth of field
- 品牌元素要求：logo_position: bottom-right；watermark_opacity: 0.78；brand_color_integration: True
- 兜底素材来源：Pexels、LaunchXBrandKit

## 4. 自动化执行前必检
- [ ] `automation/run_client.py --client launch-x --dry-run`
- [ ] 更新 `clients/launch-x/status.json` 的最新执行记录
- [ ] 核对 `system_quality_enforcement_checklist.md` 中要求
- [ ] `verification_tracker` 已更新所有外部线索状态

## 5. 发布后跟进
- [ ] 保存 `intel_report.json` `drafts.json` `images_manifest.json` 到 `clients/launch-x`
- [ ] 发布日志、性能数据落盘并复用
- [ ] 周报 `reports/weekly/<最新周次>.md` 更新完成
- [ ] 将本清单存档并标注执行人/日期
