## Me² 业务域模型与用例流

### 1. 业务域与上下文
- 创作者：创建/调优分身，选择可见性与分成策略。
- 使用者：使用分身完成任务，提供反馈，升级为创作者。
- 平台：任务编排、质量保障、结算与合规。

### 2. 域模型（简化）
```yaml
User { id, role[creator|user|admin], profileId }
Profile { id, domain, expertiseLevel, valueSystem, judgmentFramework }
Avatar { id, creatorId, name, domain, wisdomModelId, visibility, performance }
WisdomModel { id, userProfileId, version, wisdomData, scores, status }
Task { id, avatarId, userId, type, state, params, result, qualityScore }
UsageLog { id, taskId, avatarId, userId, execTimeMs, feedbackScore }
RevenueShare { id, avatarId, creatorId, userId, amount, split{70/30}, status }
```

### 3. 关键用例
1) 创建分身（Creator）
- 访谈 → 提取 → 引擎集成 → 验证 → 激活（可见性设置）。

2) 信息分析（User）
- 提交需求 → WS 实时进度 → 洞见/证据/建议 → 反馈与导出。

3) 投资分析（User）
- 7 维评估 → 风险与匹配 → 条款建议 → 生成备忘录。

4) 价值分成（Platform）
- 按使用量聚合 → 结算分成 → 对账与报表。

### 4. 业务规则
- 可见性：private/friends/public；分享前需二次确认。
- 质量阈值：默认 0.8；低于阈值触发二次优化。
- 反馈：结构化 + 即时调整项；纳入模型迭代。

### 5. 领域事件（摘要）
```yaml
AvatarCreated, AvatarActivated, TaskCreated, TaskProgressed, TaskCompleted,
FeedbackSubmitted, QualityImprovementTriggered, RevenueShareCalculated
```


