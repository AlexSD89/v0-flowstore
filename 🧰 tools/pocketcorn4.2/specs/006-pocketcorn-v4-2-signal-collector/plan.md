# Implementation Plan: Universal Multi-Platform Signal Collector

**Branch**: `006-pocketcorn-v4-2-signal-collector` | **Date**: 2025-01-22 | **Spec**: specs/006-pocketcorn-v4-2-signal-collector/spec.md
**Input**: Feature specification from `/Users/dangsiyuan/Documents/obsidion/launch-x/pocketcorn4.2/specs/006-pocketcorn-v4-2-signal-collector/spec.md`

## Execution Flow (/plan command scope)
```
1. Load feature spec from Input path
   → DONE
2. Fill Technical Context (scan for NEEDS CLARIFICATION)
   → Project Type detected as single backend service powering multi-agent platform
3. Evaluate Constitution Check section below
   → No blockers identified; track assumptions in Complexity Tracking
4. Execute Phase 0 → research.md
5. Execute Phase 1 → contracts/, data-model.md, quickstart.md
6. Re-evaluate Constitution Check section
7. Plan Phase 2 → Describe task generation approach (tasks.md handled by /tasks)
8. STOP - Ready for /tasks command
```

**IMPORTANT**: The /plan command STOPS at step 7. Phases 2-4 are executed by other commands.

## Summary
We will equip Pocketcorn v4.2 with a mission-oriented signal collector that can interpret analyst discovery requests, retrieve prioritized public signals across the CMS-defined Chinese and international platforms, normalize them into the universal schema, and deliver mission results with freshness and confidence scores to the multi-agent committee.

## Technical Context
**Language/Version**: Python 3.11+ (per LaunchX CMS backend baseline)  
**Primary Dependencies**: Pocketcorn agent framework, Weibo-derived data ingestion utilities, MCP tool adapters (Rube, Playwright, Tavily)  
**Storage**: LaunchX observability store + mission history repository (architecture doc references MySQL/Redis pair)  
**Testing**: pytest-driven contract + integration suites (LaunchX constitution mandates RED-GREEN cycle)  
**Target Platform**: Dockerized backend service within LaunchX universal infrastructure  
**Project Type**: single (backend library + service endpoints)  
**Performance Goals**: Complete standard discovery mission within 20 minutes; freshness threshold ≤ 48 hours; reliability score ≥ CMS requirements (>=0.8)  
**Constraints**: Respect platform rate limits; only public data; provide traceable evidence for every signal  
**Scale/Scope**: Support 50 concurrent missions, >15 platforms, expansion ready for additional sources

## Constitution Check

**Simplicity**:
- Projects: 1 (signal collector service exposed via library endpoints)
- Using framework directly? yes — leverage existing Pocketcorn collector service contracts without extra abstraction
- Single data model? yes — universal signal schema + mission metadata share same canonical definitions
- Avoiding patterns? yes — rely on SPELO + BMAD patterns already mandated by CMS, no additional layers

**Architecture**:
- EVERY feature as library? yes — collector packaged as `pocketcorn.services.collectors`
- Libraries listed: `collectors` (ingestion workflows), `normalization` (schema mapping), `mission_tracking` (history + metrics)
- CLI per library: to be provided via Pocketcorn command interface (planned in quickstart)
- Library docs: llms.txt style quickstart planned in quickstart.md

**Testing (NON-NEGOTIABLE)**:
- RED-GREEN-Refactor cycle enforced? yes — contract tests for mission API precede implementation
- Git commits show tests before implementation? requirement flagged for execution agents
- Order: Contract→Integration→Unit enforced — contract tests define mission payloads before ingestion logic
- Real dependencies used? yes — use sandbox credentials for MCP tools and staging DB
- Integration tests for shared schemas? yes — mission run integration covers signal schema and storage writes
- FORBIDDEN: Implementation before contract tests emphasized in tasks

**Observability**:
- Structured logging included? yes — mission runs emit structured events to LaunchX telemetry
- Frontend logs → backend? unified via existing LaunchX log pipeline
- Error context sufficient? plan mandates correlation IDs per mission run

**Versioning**:
- Version number assigned? Pocketcorn v4.2 → build increments tracked in release notes
- BUILD increments on every change? to be enforced during implementation
- Breaking changes handled? not expected; collector extends new capability without altering existing contracts

## Project Structure

### Documentation (this feature)
```
specs/006-pocketcorn-v4-2-signal-collector/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
└── tasks.md (created by /tasks)
```

### Source Code (repository root)
```
src/pocketcorn/
├── services/
│   ├── collectors/        # mission orchestration + adapters
│   ├── normalization/     # schema mapping + scoring utilities
│   └── mission_tracking/  # persistence & telemetry writer
├── agents/
└── api/

tests/
├── contract/
├── integration/
└── unit/
```

**Structure Decision**: Option 1 (single project) — backend service with supporting libraries.

## Phase 0: Outline & Research
- Unknowns: mission scheduling policy, platform prioritization weights, legal/compliance boundaries per platform, storage retention duration.
- Research tasks:
  - Clarify CMS guidance on platform coverage tiers and rate limits.
  - Validate cultural intelligence requirements for signal tagging.
  - Determine freshness scoring methodology from architecture doc.
  - Confirm persistence strategy for mission history (MySQL vs Redis responsibilities).
- research.md will log decisions, rationale, alternatives.

## Phase 1: Design & Contracts
- data-model.md will document entities (DiscoveryMission, SignalRecord, SourcePlatformProfile, MissionRunSummary) with fields and relationships.
- contracts/ will contain mission command contract (`mission-run.yaml`) and collector output schema.
- quickstart.md will describe how analysts invoke the collector (CLI + Task agent invocation) and expected setup steps.
- Constitution re-check ensures simplicity and observability commitments remain satisfied after detailed design.

## Phase 2 Preview (for /tasks)
- /tasks will generate:
  - Contract tests for mission creation & run results.
  - Integration tests connecting collectors to normalization pipeline.
  - Implementation tasks for adapters per platform tier.
  - Observability & retention tasks.
- Tasks will explicitly enforce test-first work sequence and highlight parallelizable items (e.g., platform adapter stubs).

## Progress Tracking
- [x] Initial Constitution Check complete
- [ ] Phase 0 research documented
- [ ] Phase 1 artifacts generated
- [ ] Post-Design Constitution Check complete
- [ ] Phase 2 handoff ready

