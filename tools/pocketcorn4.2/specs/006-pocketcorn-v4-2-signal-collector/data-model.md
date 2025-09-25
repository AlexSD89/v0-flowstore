# Data Model: Universal Multi-Platform Signal Collector

## DiscoveryMission
- **Description**: Analyst-defined intent describing what investment signals to gather.
- **Fields**:
  - `mission_id` (UUID) — unique identifier
  - `analyst_id` — reference to user persona invoking mission
  - `criteria` — structured payload with industry, geography, revenue threshold, growth markers
  - `priority_tier` — derived from analyst urgency (standard, high, audit)
  - `schedule` — cron-like configuration for recurring scans
  - `last_run_at` / `next_run_at`
  - `status` — draft, scheduled, running, completed, paused
- **Relationships**: One-to-many with MissionRunSummary; references SourcePlatformProfile for coverage inclusion.

## SourcePlatformProfile
- **Description**: Metadata describing each supported platform.
- **Fields**:
  - `platform_id`
  - `name`
  - `tier` — 1, 2, 3 based on CMS prioritization
  - `rate_limit_policy`
  - `signal_types` — e.g., revenue, hiring, product update
  - `language_profile`
  - `compliance_notes`
  - `update_frequency`
- **Relationships**: Linked to DiscoveryMission via coverage map; referenced by SignalRecord entries.

## SignalRecord
- **Description**: Individual signal extracted from a platform.
- **Fields**:
  - `signal_id`
  - `mission_id`
  - `platform_id`
  - `company_identifier` — normalized entity name or ID
  - `signal_category` — revenue, team, product, fundraising, cultural
  - `content_summary`
  - `numeric_metrics` — optional structured values (MRR, headcount, etc.)
  - `source_link`
  - `captured_at`
  - `freshness_score`
  - `reliability_score`
  - `cultural_tags` — localization + payment behavior cues
- **Relationships**: Aggregates into MissionRunSummary; consumed by downstream agents.

## MissionRunSummary
- **Description**: Consolidated report from a mission execution.
- **Fields**:
  - `run_id`
  - `mission_id`
  - `run_timestamp`
  - `companies_detected` — structured list with aggregated scores
  - `signal_highlights` — top findings per company
  - `coverage_stats` — platform coverage, latency, data gaps
  - `confidence_interval`
  - `next_actions` — recommendations for multi-agent follow-up
- **Relationships**: One-to-many with SignalRecord; attaches to DiscoveryMission timeline and stored for SPELO learning.

## AuditTrailEvent
- **Description**: Traceability record for compliance and observability.
- **Fields**:
  - `event_id`
  - `mission_id`
  - `run_id`
  - `event_type` — rate-limit hit, data quality warning, mission failure, manual override
  - `details`
  - `recorded_at`
- **Relationships**: Supports observability pipelines; ensures compliance reviews.

