## Me² 系统与微服务技术实现

### 1. 微服务拆分（与总规一致）
- 用户管理：Node.js + PostgreSQL + Redis（JWT/OAuth）。
- 分身管理：FastAPI + PostgreSQL + Chroma（WS）
- 智慧提取：Python NLP + Vector DB（gRPC）
- 信息处理：Chroma + ES + Redis（MQ/Kafka）
- 协作指导：Python + Celery + Redis
- 价值分成：Java Spring Boot + PostgreSQL + Kafka
- 质量保证：Python + 评测流水线

### 2. 接口与事件（摘要）
REST/GraphQL：
- POST /avatars, GET /avatars/:id
- POST /tasks, GET /tasks/:id
- POST /feedback

WS 事件：
- me2_task_accepted, me2_task_progress, me2_task_completed
- collaboration_feedback, presence_update

Kafka 主题：
- me2.tasks, me2.quality, me2.revenue, me2.feedback

### 3. 数据存储
- 事务型：PostgreSQL（用户、分身、结算、日志索引）。
- 检索型：Elasticsearch（全文/过滤）。
- 向量：Chroma（专属与共享集合）。
- 缓存：Redis（会话、分布式锁、热点缓存）。

### 4. 性能与扩展
- HPA：基于 CPU/Mem 指标 70/80 自动伸缩。
- 冷热分层：近 30 天向量集合在内存优先；历史落冷存储。
- 检索混排：稀疏（ES）× 稠密（向量）结果融合与重排序。

### 5. 运行与观测
- Prometheus + Grafana：API/模型/任务三组看板。
- 追踪：OpenTelemetry；跨服务 TraceId 贯穿。
- 告警：响应时间 >10s、准确率跌幅 >5%、满意度 <4.0。

### 6. DevOps
- 镜像：多阶段构建；SBOM 与镜像签名。
- 部署：Compose 用于开发，K8s 用于生产；Ingress + TLS + 速率限制。
- 回滚：蓝绿或金丝雀；模型版本由 Model Manager 管控。


