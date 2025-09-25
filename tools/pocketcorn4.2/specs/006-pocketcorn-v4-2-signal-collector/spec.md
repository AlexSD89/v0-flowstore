# Feature Specification: Universal Multi-Platform Signal Collector

**Feature Branch**: `006-pocketcorn-v4-2-signal-collector`  
**Created**: 2025-01-22  
**Status**: Draft  
**Input**: User description: "Pocketcorn v4.2 universal signal collector for multi-platform investment data"

## Execution Flow (main)
```
1. Parse user description from Input
   → If empty: ERROR "No feature description provided"
2. Extract key concepts from description
   → Identify: actors, actions, data, constraints
3. For each unclear aspect:
   → Mark with [NEEDS CLARIFICATION: specific question]
4. Fill User Scenarios & Testing section
   → If no clear user flow: ERROR "Cannot determine user scenarios"
5. Generate Functional Requirements
   → Each requirement must be testable
   → Mark ambiguous requirements
6. Identify Key Entities (if data involved)
7. Run Review Checklist
   → If any [NEEDS CLARIFICATION]: WARN "Spec has uncertainties"
   → If implementation details found: ERROR "Remove tech details"
8. Return: SUCCESS (spec ready for planning)
```

---

## ⚡ Quick Guidelines
- ✅ Focus on WHAT users need and WHY
- ❌ Avoid HOW to implement (no tech stack, APIs, code structure)
- 👥 Written for business stakeholders, not developers

### Section Requirements
- **Mandatory sections**: Must be completed for every feature
- **Optional sections**: Include only when relevant to the feature
- When a section doesn't apply, remove it entirely (don't leave as "N/A")

### For AI Generation
When creating this spec from a user prompt:
1. **Mark all ambiguities**: Use [NEEDS CLARIFICATION: specific question] for any assumption you'd need to make
2. **Don't guess**: If the prompt doesn't specify something (e.g., "login system" without auth method), mark it
3. **Think like a tester**: Every vague requirement should fail the "testable and unambiguous" checklist item
4. **Common underspecified areas**:
   - User types and permissions
   - Data retention/deletion policies  
   - Performance targets and scale
   - Error handling behaviors
   - Integration requirements
   - Security/compliance needs

---

## User Scenarios & Testing *(mandatory)*

### Primary User Story
A zero-code investment analyst instructs Pocketcorn to "scan for early-stage AI startups hitting 5万 RMB MRR" and expects the system to gather signals from prioritized Chinese and international platforms, normalize the findings, and present a consolidated opportunity list ready for further committee analysis within 20 minutes.

### Acceptance Scenarios
1. **Given** the analyst provides discovery criteria (industry focus, revenue threshold, geography), **When** the collector runs a scheduled scan, **Then** the analyst receives a consolidated report summarizing qualifying companies, platform evidence, and confidence scores.
2. **Given** the analyst narrows focus to one company, **When** the collector refreshes signals on-demand, **Then** the output includes latest activities (revenue mentions, hiring moves, product updates) gathered within the past 48 hours across platforms.

### Edge Cases
- What happens when platform access is temporarily unavailable or rate-limited?
- How does the system handle conflicting data points (e.g., differing revenue claims) across sources?

## Requirements *(mandatory)*

### Functional Requirements
- **FR-001**: System MUST allow analysts to define discovery missions using natural language criteria aligned with Pocketcorn scoring dimensions.
- **FR-002**: System MUST aggregate public signals from the launch CMS priority platforms (Zhihu, Weibo, Boss直聘, Xiaohongshu, LinkedIn, GitHub, Product Hunt, etc.) for each mission.
- **FR-003**: System MUST normalize and tag collected signals into Pocketcorn's universal signal schema so downstream agents can consume them without additional parsing.
- **FR-004**: System MUST compute freshness and reliability scores for each signal, surfacing only results meeting CMS quality thresholds.
- **FR-005**: System MUST deliver mission results to the Pocketcorn multi-agent coordination layer with traceable evidence and timestamps.
- **FR-006**: System MUST retain historical signal snapshots to support SPELO learning loops and trend detection.
- **FR-007**: System MUST alert analysts when required mission inputs are missing or ambiguous (e.g., geography not specified) and provide guided clarification prompts.

### Key Entities *(include if feature involves data)*
- **DiscoveryMission**: Captures user intent, criteria (industry, stage, geography, revenue threshold), scheduling preferences, and linked analyst persona.
- **SignalRecord**: Represents a single observed event with attributes for source platform, timestamp, extracted metrics (revenue, hiring, product launch), contextual summary, and confidence level.
- **SourcePlatformProfile**: Stores coverage rules, priority, expected update frequency, and compliance notes for each platform referenced in CMS and architecture documents.
- **MissionRunSummary**: Aggregated output from a mission execution including qualifying companies, key signal highlights, freshness score, and evidence links for downstream agents.

---

## Review & Acceptance Checklist
*GATE: Automated checks run during main() execution*

### Content Quality
- [x] No implementation details (languages, frameworks, APIs)
- [x] Focused on user value and business needs
- [x] Written for non-technical stakeholders
- [x] All mandatory sections completed

### Requirement Completeness
- [x] No [NEEDS CLARIFICATION] markers remain
- [x] Requirements are testable and unambiguous  
- [x] Success criteria are measurable
- [x] Scope is clearly bounded
- [x] Dependencies and assumptions identified

---

## Execution Status
*Updated by main() during processing*

- [x] User description parsed
- [x] Key concepts extracted
- [ ] Ambiguities marked
- [x] User scenarios defined
- [x] Requirements generated
- [x] Entities identified
- [ ] Review checklist passed

---
