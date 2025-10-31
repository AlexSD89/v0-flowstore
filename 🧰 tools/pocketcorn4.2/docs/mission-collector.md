# Pocketcorn Mission Collector

This guide explains how to operate the universal multi-platform signal collector delivered in Pocketcorn v4.2.

## Mission Lifecycle
1. **Create a mission** describing industry focus, geography, revenue targets and cadence. Supply either a natural-language brief or a structured criteria file via the CLI, or integrate with the API defined in `specs/006-pocketcorn-v4-2-signal-collector/contracts/`.
2. **Run on-demand** when analysts request immediate refreshes, or rely on the scheduler to execute daily sweeps.
3. **Review mission reports** containing company rankings, cultural intelligence tags, and evidence links before passing to the investment committee agents.

## Quickstart
```
# Option A: Free-form description
python -m pocketcorn.cli.mission_commands create \
  --name "AI Startups 50k MRR" \
  --description "Scan mainland China AI startups hitting 60k MRR and expanding hiring" \
  --priority high

# Option B: Structured criteria payload (criteria.json)
{
  "name": "AI Startups 50k MRR",
  "criteria": {
    "industry": "enterprise AI",
    "geography": ["CN", "HK", "SG"],
    "revenue_threshold": 50000,
    "growth_signals": ["hiring", "revenue"],
    "cultural_focus": "mainland"
  },
  "schedule": {"cadence": "daily", "time_window": "03:00"},
  "priority": "high"
}

python -m pocketcorn.cli.mission_commands create \
  --criteria criteria.json \
  --name "AI Startups 50k MRR"

# Run now
python -m pocketcorn.cli.mission_commands run <mission_id>

# Fetch latest report (includes insight tags + evidence links)
python -m pocketcorn.cli.mission_commands report <mission_id>
```

## API Endpoints
- `POST /missions`: create missions from natural language or structured criteria.
- `POST /missions/{mission_id}/run`: trigger on-demand or scheduled runs (supports temporary `override_criteria`).
- `GET /missions/runs/{run_id}`: fetch normalized mission output payload.

Enable the background scheduler by exporting `POCKETCORN_ENABLE_SCHEDULER=true`. Adjust cadence with `POCKETCORN_SCHEDULER_INTERVAL` (seconds).

## Observability
- Structured logs include `mission_id` and `run_id` fields to simplify traceability.
- Metrics emitted via `mission.signals_collected` include mission/run tags for dashboards.
- Rate limit or collector errors produce audit trail events stored with each mission run for later review.

## Manual Test Checklist
1. Create a mission with a natural-language description and confirm the response includes inferred criteria and empty `validation_messages`.
2. Trigger a run and verify the resulting JSON includes `companies_detected` with `insight_tags`, `evidence_links`, and `recommendations` populated.
3. Simulate a rate limit by calling `CollectorRegistry.inject_transient_error("weibo", RateLimitError("test"))` and re-running the mission; confirm the audit trail logs the issue with matching `run_id`.
4. Review structured logs or emitted metrics to ensure mission context (IDs, mode) is recorded.
