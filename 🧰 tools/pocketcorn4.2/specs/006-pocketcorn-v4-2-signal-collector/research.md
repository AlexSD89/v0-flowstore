# Research Log: Universal Multi-Platform Signal Collector

## Mission Scheduling Policy
- **Decision**: Support two modes — on-demand refresh and scheduled daily sweeps per analyst-defined mission.
- **Rationale**: CMS highlights continuous monitoring and real-time responsiveness; daily sweeps maintain freshness while on-demand covers ad-hoc deep dives.
- **Alternatives Considered**: Real-time streaming (rejected for this iteration because Pocketcorn v4.2 targets 15–30 minute analysis cycles, not second-level latency).

## Platform Prioritization Weights
- **Decision**: Adopt LaunchX CMS tiered coverage — Tier 1 (Zhihu, Weibo, Boss直聘, LinkedIn, GitHub) weighted highest; Tier 2 (Xiaohongshu, Product Hunt, V2EX, Indie Hackers) secondary; Tier 3 (Hacker News, B站, others) opportunistic.
- **Rationale**: CMS identifies these platforms as primary signal sources for Chinese and international AI startups; architecture doc emphasizes reuse of MindSpider 7+ platform connectors.
- **Alternatives Considered**: Uniform weighting (rejected due to differing signal quality) and paid data feeds (out of scope, conflicts with public data constraint).

## Freshness & Reliability Scoring
- **Decision**: Freshness score decays after 48 hours; reliability combines source credibility, signal corroboration count, and confidence provided by MCP tools.
- **Rationale**: Spec requirement references 48-hour expectation; CMS success criteria demand 99.9% collection reliability with <30s data freshness for active monitoring — this feature seeds that metric via decay model.
- **Alternatives Considered**: Binary stale/fresh flag (insufficient for prioritization), manual analyst scoring (breaks zero-code promise).

## Persistence Strategy
- **Decision**: Mission metadata and historical signals stored in MySQL (transactional history), with Redis caching for active missions.
- **Rationale**: Architecture.md positions MySQL + Redis as canonical pairing for LaunchX services; suits requirement to retain snapshots for SPELO learning and deliver responsive mission updates.
- **Alternatives Considered**: Document store (would diverge from architecture baseline) and file-based storage (fails scalability and audit trail needs).

## Compliance & Rate Limits
- **Decision**: Respect per-platform public data policies; throttle missions according to CMS guidance (e.g., Weibo ≤ 200 requests/hour, LinkedIn reliance on cached MCP data, GitHub GraphQL rate caps).
- **Rationale**: CMS warns about anti-detection; adherence prevents mission failure and keeps risk controls intact.
- **Alternatives Considered**: Aggressive scraping (rejected; conflicts with MCP integration ethics).

## Cultural Intelligence Tagging
- **Decision**: Each signal annotated with cultural context tags (language, regional cues, payment behaviors) to feed Cultural Intelligence Agent.
- **Rationale**: CMS core innovation demands cultural compatibility insights; architecture lists cultural analyzer as critical dependency.
- **Alternatives Considered**: Delay tagging to downstream agent (rejected as it duplicates normalization effort).

