# Tasks: Universal Multi-Platform Signal Collector

**Input**: Design documents from `/specs/006-pocketcorn-v4-2-signal-collector/`
**Prerequisites**: plan.md, research.md, data-model.md, contracts/

## Phase 3.1: Setup
- [ ] T001 Ensure project skeleton present under `pocketcorn4.2/src/collectors/` and `pocketcorn4.2/tests/` per plan.md (create missing `normalization/` and `mission_tracking/` packages).
- [ ] T002 Configure structured logging context helpers for mission runs in `pocketcorn4.2/src/common/logging.py` (create file if absent) referencing LaunchX observability conventions.

## Phase 3.2: Tests First (TDD)
- [ ] T003 [P] Contract test for mission creation (`POST /missions`) using `specs/006-pocketcorn-v4-2-signal-collector/contracts/mission-create.yaml` in `pocketcorn4.2/tests/contract/test_mission_create.py`.
- [ ] T004 [P] Contract test for mission run retrieval (`GET /missions/runs/{run_id}`) using `mission-run.yaml` in `pocketcorn4.2/tests/contract/test_mission_run.py`.
- [ ] T005 [P] Integration test covering end-to-end mission execution flow (mission -> collector -> normalized summary) in `pocketcorn4.2/tests/integration/test_mission_execution.py` with sandbox MCP fixtures.
- [ ] T006 [P] Integration test for rate-limit and error handling emitting `AuditTrailEvent` in `pocketcorn4.2/tests/integration/test_mission_rate_limits.py`.

## Phase 3.3: Core Implementation (after tests fail)
- [ ] T007 Implement data models (DiscoveryMission, SourcePlatformProfile, SignalRecord, MissionRunSummary, AuditTrailEvent) using Pydantic dataclasses in `pocketcorn4.2/src/collectors/models.py`.
- [ ] T008 Build mission repository + scheduling helper in `pocketcorn4.2/src/mission_tracking/mission_repository.py` with MySQL + Redis orchestration.
- [ ] T009 Implement platform adapter interface and Tier 1 connectors (Zhihu, Weibo, Boss直聘, LinkedIn, GitHub) in `pocketcorn4.2/src/collectors/adapters/tier1/*.py`.
- [ ] T010 Implement Tier 2 adapters (Xiaohongshu, Product Hunt, V2EX, Indie Hackers) in `pocketcorn4.2/src/collectors/adapters/tier2/*.py`.
- [ ] T011 Implement normalization pipeline mapping raw signals into universal schema with cultural tagging in `pocketcorn4.2/src/normalization/signal_normalizer.py`.
- [ ] T012 Implement mission orchestrator service coordinating adapters, scoring, and persistence in `pocketcorn4.2/src/collectors/mission_orchestrator.py`.
- [ ] T013 Wire orchestrator into Pocketcorn API (mission create/run endpoints) in `pocketcorn4.2/src/api/missions.py`.
- [ ] T014 Add CLI commands `mission create/run/report` in `pocketcorn4.2/src/cli/mission_commands.py` supporting quickstart flows.

## Phase 3.4: Integration & Observability
- [ ] T015 Connect orchestrator telemetry to LaunchX structured logging + metrics in `pocketcorn4.2/src/mission_tracking/telemetry.py`.
- [ ] T016 Implement persistence of MissionRunSummary + AuditTrailEvent to MySQL with retention policy in `pocketcorn4.2/src/mission_tracking/persistence.py`.
- [ ] T017 Integrate Redis caching layer for active missions in `pocketcorn4.2/src/mission_tracking/cache.py`.
- [ ] T018 Add scheduler configuration (daily cadence + on-demand triggers) in `pocketcorn4.2/src/collectors/scheduler.py` respecting rate limits.

## Phase 3.5: Polish
- [ ] T019 [P] Unit tests for normalization scoring + cultural tagging in `pocketcorn4.2/tests/unit/test_signal_normalizer.py`.
- [ ] T020 [P] Unit tests for mission repository scheduling edge cases in `pocketcorn4.2/tests/unit/test_mission_repository.py`.
- [ ] T021 Update documentation: append mission collector instructions to `pocketcorn4.2/docs/mission-collector.md` and refresh README mission section.
- [ ] T022 Performance verification script measuring 20-minute SLA in `pocketcorn4.2/tests/performance/test_mission_throughput.py`.
- [ ] T023 Final QA checklist ensuring quickstart commands operate end-to-end (`pocketcorn4.2/docs/manual-testing.md`).

## Dependencies
- T001 before any implementation touching new packages.
- Contract tests (T003-T006) must fail before starting T007-T014.
- T007 prerequisite for T008, T011, T012.
- Adapter tasks (T009-T010) depend on normalization (T011) before integration tests pass.
- Scheduler/config tasks (T018) depend on orchestrator (T012) and repository (T008).
- Observability + persistence (T015-T017) require MissionRunSummary model (T007) and repository (T008).
- Polish tasks (T019-T023) run after previous phases green.

## Parallel Execution Examples
```
# After setup:
- Run T003, T004, T005, T006 in parallel (different test files).

# During implementation:
- After T007 completes, T009 and T010 can proceed in parallel (different adapter directories).
- After T011 completes, T014 (CLI) can proceed in parallel with T013 (API) if orchestrator (T012) is ready.
```

## Validation Checklist
- [x] All contracts mapped to contract tests (T003, T004).
- [x] Each entity in data-model has corresponding implementation task (T007, T008, T011, T016).
- [x] Tests precede implementation work.
- [x] Parallel tasks marked only when touching independent files/directories.
- [x] Each task specifies concrete file paths.

