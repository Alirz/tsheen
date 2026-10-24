---
task_id: {uuid-or-timestamp}
run_id: {uuid-or-timestamp}
feature: {feature-name}
feature_kebab: {feature-kebab}
module: {module-or-area}
base_branch: {pending-or-recorded-review-base}
branch: {current-or-user-approved-branch}
topology: {pending|micro|standard|quality-loop|incident|variants}
status: planning
blocked_from: none
resume_to: none
current_owner: chief
next_actor: manager
default_max_attempts: 3
gate_implementation: pending
gate_verification: pending
gate_review: pending
created: {ISO-8601}
updated: {ISO-8601}
---

# Task: {feature-name}

## User request

## Immutable constraints

## Manager plan

### Intent

### Requirements (authoritative)

### Clarifications resolved

### Technical approach

### Topology and role selection

security_review: {required|skip} — {reason}

| Role | Why needed | Receives | Produces | Depends on |
|------|------------|----------|----------|------------|

### Work items

| ID | Owner | Deliverable | Requirements | Dependencies | Acceptance evidence | Attempt / max | Status |
|----|-------|-------------|--------------|--------------|---------------------|---------------|--------|

### Verification commands

### Risks, assumptions, and user decisions

## Run ledger

| Time | Actor | Work item | From → To | Attempt | Evidence / reason |
|------|-------|-----------|-----------|---------|-------------------|

## Handoffs

## Variants verdict

## Verification summary

| Requirement (verbatim) | Evidence (test name / file / command) |
|------------------------|----------------------------------------|

## Security verdict

| Finding | Severity | Evidence | Owner | Required fix |
|---------|----------|----------|-------|--------------|

## Review verdict

| Finding | Severity | Evidence | Owner | Required fix |
|---------|----------|----------|-------|--------------|

## Decision log

| Time | Decision | Authority | Rationale / evidence | Revisit trigger |
|------|----------|-----------|----------------------|-----------------|

## Closeout

- Final status: `done | blocked | canceled`
- Requirements satisfied: `{R1, R2, ...}`
- Verification and review evidence: `{references}`
- Unresolved risks: `{none or list}`
- User decisions needed: `{none or one concrete request}`
