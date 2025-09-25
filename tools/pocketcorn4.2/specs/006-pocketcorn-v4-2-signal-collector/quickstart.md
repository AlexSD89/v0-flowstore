# Quickstart: Universal Multi-Platform Signal Collector

## Prerequisites
- Pocketcorn v4.2 environment configured per CMS master plan (Docker services running, MCP credentials provisioned for Rube, Playwright, Tavily).
- Analyst persona defined in Pocketcorn access control with permission to create missions.
- SourcePlatformProfile entries populated for Tier 1–3 platforms, including rate-limit and compliance metadata.

## Create a Discovery Mission (CLI)
```
pocketcorn mission create \
  --name "AI Startups 50k MRR" \
  --industry "enterprise AI" \
  --geography "CN, HK, SG" \
  --revenue-threshold 50000 \
  --schedule daily@03:00 \
  --priority high
```
- CLI confirms mission_id and displays platforms covered based on SourcePlatformProfile tiers.
- If required inputs missing, CLI prompts with guided questions (e.g., specify geography before scheduling).

## Run On-Demand Refresh
```
pocketcorn mission run --mission-id <MISSION_ID> --mode on-demand
```
- Triggers immediate signal sweep.
- Upon completion, outputs MissionRunSummary with:
  - Companies detected + aggregated scores
  - Top signals per company with freshness/reliability
  - Links to evidence stored in Pocketcorn knowledge base

## Access Mission Reports
```
pocketcorn mission report --mission-id <MISSION_ID> --last-run
```
- Streams structured report to console or JSON (`--format json`).
- Highlights coverage stats and recommended next actions for investment committee agents.

## Continuous Monitoring Pipeline
1. Daily scheduler triggers missions according to defined cadence (minimum every 24 hours).
2. Completed runs publish MissionRunSummary to multi-agent forum channel; agents use data for Study and Plan phases.
3. AuditTrailEvents logged to observability pipeline for compliance review.
4. Historical signals retained for at least 180 days to support SPELO Learn/Optimize cycles.

## Troubleshooting
- **Rate limit warning**: Mission pauses and logs AuditTrailEvent; rerun after cooldown.
- **Missing platform credentials**: CLI returns guidance referencing SourcePlatformProfile configuration.
- **Low reliability score**: Analyst can adjust mission criteria or request enrichment from specialized agents.

