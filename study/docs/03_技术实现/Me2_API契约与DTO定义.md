## Me² API 契约与 DTO 定义（MVP）

### REST
1) 创建任务
POST `/tasks`
```json
{
  "query": "string",
  "context": { "domain": "media", "sources": ["web", "kb:me2"] },
  "goals": ["insights", "actions"],
  "qualityThreshold": 0.8
}
```
响应
```json
{ "taskId": "t-xxx", "estimated_completion": "2025-08-19T12:00:00Z" }
```

2) 查询任务结果
GET `/tasks/{id}`
```json
{
  "state": "running|completed|failed",
  "progress": 75,
  "result": { /* 仅完成时存在 */ }
}
```

3) 提交反馈
POST `/feedback`
```json
{
  "taskId": "t-xxx",
  "vote": "+1",
  "reasons": ["content", "evidence"],
  "immediateAdjustments": { "tone": "more-formal" },
  "comment": "optional"
}
```

### WebSocket 事件
- `me2_task_accepted` `{ taskId, estimated_completion }`
- `me2_task_progress` `{ taskId, progress, intermediate_results }`
- `me2_task_completed` `{ taskId, final }`

### DTO（片段）
```json
// Insight
{
  "title": "string",
  "bullets": [ { "text": "string", "evidenceAnchor": "url#L12", "confidence": 0.86 } ]
}
```

```json
// QualityScore
{
  "overall": 0.83,
  "details": { "accuracy": 0.8, "completeness": 0.82, "relevance": 0.85, "professionalism": 0.81, "usability": 0.84 }
}
```


