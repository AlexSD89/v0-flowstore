# Manual Testing Checklist

1. **Mission Creation**
   - Run `python -m pocketcorn.cli.mission_commands create --criteria criteria.json --name "Smoke Mission"` with valid criteria payload.
   - Confirm output includes mission ID and Tier 1 platforms in `coverage_platforms`.
2. **On-Demand Run**
   - Execute `python -m pocketcorn.cli.mission_commands run <mission_id>`.
   - Verify CLI returns `run_id` and repository stores MissionRunSummary.
3. **Report Retrieval**
   - Run `python -m pocketcorn.cli.mission_commands report <mission_id>` and ensure response lists companies and signal highlights.
4. **Rate Limit Handling**
   - In a Python shell inject `CollectorRegistry.inject_transient_error("weibo", RateLimitError("test"))` before running mission.
   - Confirm report `audit_trail` contains a `rate_limit` entry.
5. **Telemetry**
   - Check logs emitted during mission run (using structured output) include `mission_id`, `run_id`, and metric events.
