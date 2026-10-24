---
name: tsheen-chief-of-staff
description: >-
  Project chief-of-staff: manager plans, applicable specialists implement,
  verification runs after dependencies converge, then review and bounded
  remediation. Prefer this over the global skill when present.
---

# Project Chief of Staff (`tsheen`)

**Announce:** "I'm using the tsheen-chief-of-staff skill."

## Repository

- Solution: `Tsheen.slnx` (ABP layered .NET, net10.0). Frontend: `apps/react`.
- Backend: `dotnet build Tsheen.slnx` and `dotnet test Tsheen.slnx` (xUnit + Shouldly).
- Frontend, from `apps/react`: `npm run build` and `npm test` (`vitest run`).
- Layers installed: `tsheen-backend`, `tsheen-frontend`, `tsheen-test`.
- This repository has no commits yet. Record the live branch at run time; use `main` as the review base once that branch exists.
- No coverage percentage gate unless a task sets one.

> On init, replace every `tsheen` with the workspace root slug (e.g. `my-app`).

## Graphify preflight

1. Follow Graphify preflight in `/c/Users/fatem/.cursor/skills/chief-of-staff/SKILL.md`.
2. `graphify query` / `explain` / `path` before Read/Grep/Glob.
3. Include graphify rule in every exploring subagent prompt.
4. After code changes: `graphify update .`

Dispatch every stage per `/c/Users/fatem/.cursor/skills/chief-of-staff/templates/dispatch-protocol.md`.
Subagents follow `.cursor/skills/tsheen-task-memory/SKILL.md`.

## Run state (chief only)

| Path | Purpose |
|------|---------|
| `.cursor/state/tasks/active-task.md` | Live task ledger |
| `.cursor/state/tasks/_template.md` | New-task template |
| `.cursor/state/tasks/logs/` | Command output referenced by handoffs |
| `.cursor/state/tasks/archive/` | Completed tasks |

Gitignore `active-task.md`, `archive/`, and `logs/`. The chief is the sole
writer of frontmatter, `## Run ledger`, `## Handoffs`, verdict sections,
`## Decision log`, and `## Closeout`. Only the chief changes `status`.

### States

Primary path: `planning → ready → in_progress → verifying → reviewing → done`

- `verifying → in_progress` when failed evidence names an implementation owner.
- `reviewing → in_progress` when `CHANGES_REQUIRED` names an implementation
  owner; rerun affected verification before returning to `reviewing`.
- Any active state may become `blocked` or `canceled`.
- A mandatory failed or inconclusive gate never advances. Remediation
  increments that work item's attempt and stays within its maximum.
- Stage 5a security rides on `reviewing` / `gate_review` (no separate field);
  `gate_review` covers 5a and 5b.

Before entering `blocked`, record the current state in `blocked_from`, choose
`resume_to` from the required next action, and record the unresolved decision
or failure in the ledger:

- approval or dependency resolved before work starts → `ready`;
- implementation or gate failure requiring a code/content fix → `in_progress`;
- transient verifier failure after implementation passed → `verifying`;
- transient reviewer failure after verification passed → `reviewing`.

After the user resolves the blocker, only `blocked → resume_to` is allowed, and
only after constraints and evidence are updated. Clear `blocked_from` and
`resume_to` after resuming. Never restore the prior state blindly or resume
automatically.

### Recording handoffs

Record each returned handoff under `## Handoffs` as
`### {actor} → {consumer}: {work-item}` with the handoff fields, before
dispatching its consumer. Reject an incomplete handoff and request the missing fields once.
Record evidence as commands, exit codes, summary lines, failing items, and log
or report paths — never pasted full output. Verdict sections hold:

| Section | Contents |
|---------|----------|
| `## Variants verdict` | Winner, base commit/path, judge agree/disagree, grafts and rejections, status |
| `## Verification summary` | Strategy; files created/extended + test counts; final build/test commands and exit codes (exit 0 unless a documented, reproducible, unchanged, unrelated pre-existing-failure baseline); coverage table when a threshold was set; gate results; suspected production bugs; `Requirement \| Evidence` table |
| `## Security verdict` | Verdict + findings table, recorded before code review |
| `## Review verdict` | Verdict + findings table |

### Retry and escalation

1. Retry only when feedback identifies a specific owner and fix.
2. Increment the work item's attempt before redispatch.
3. Stop early when the same failure repeats without material progress.
4. After `max_attempts`, keep the gate failed and set `status: blocked`.
5. Escalate one concrete decision with impact, evidence, recommendation, and
   the safest fallback. Never silently skip a mandatory gate.

A Task launch failure has no handoff: record `dispatch_failed` in the run
ledger and retry the same dispatch at most twice without consuming an
implementation attempt. After that, use a different available agent only when
it has equivalent scope and permissions; otherwise set `status: blocked` and
escalate. Never widen permissions as a fallback.

## Orchestration

### Stage 0 — Task ledger + manager

If `.cursor/state/tasks/active-task.md` exists, read it before doing anything:

- active status (`planning` through `reviewing`) → resume it when it matches the
  request; otherwise ask whether to resume, archive, or cancel;
- `blocked` → surface its recorded decision before replacing it;
- `done` → archive it;
- `canceled` → archive or replace only with user confirmation.

Never overwrite an existing task ledger. Create one only when absent:

```bash
test -e .cursor/state/tasks/active-task.md || \
  cp .cursor/state/tasks/_template.md .cursor/state/tasks/active-task.md
```

Before manager dispatch, initialize every frontmatter field: unique `task_id`
and `run_id`, `feature`, `feature_kebab`, `module`, current `branch`,
`base_branch: pending`, `topology: pending`, `status: planning`,
`blocked_from: none`, `resume_to: none`, chief/manager ownership, attempt limit,
pending gates, and timestamps. No frontmatter placeholder may remain.

Fill `## User request` (exact request) and `## Immutable constraints` (exact
user constraints, approval boundaries, and out-of-scope work). **Launch a Task**
(`subagent_type: tsheen-manager`) to fill `## Manager plan`; never write it inline.

Validate the plan before `ready`:

| Section | `micro` | `standard` / `quality-loop` / `incident` / `variants` |
|---------|---------|------------------------------------------|
| `### Intent` | `n/a` or one line OK | Required (short bullets) |
| `### Requirements (authoritative)` | Required | Required |
| `### Clarifications resolved` | `none` OK | Required (`none` or Q→A) |
| `### Technical approach` | `n/a` or one line OK | Required (short bullets) |
| Work items + verification + risks | Required | Required |
| `security_review: required\|skip` + reason | Required (`skip` OK with reason) | Required — must be `required` |

Reject plans that omit a required section, leave Intent/Approach empty on
non-`micro` topologies, omit `security_review` + reason, use `skip` on a
non-`micro` topology, or fail to map every requirement to one owner and
measurable evidence. A `variants` plan must also name 2–4 candidates, the
checkable rubric, one `tsheen-variants` work item, and a dependent synthesis work
item for the primary-tree implementer. Do not invent Spec Kit / `specs/` files
— keep intent in this ledger.

### Stage 1 — Choose the smallest topology

| Topology | Use when | Flow |
|----------|----------|------|
| `micro` | One localized owner and narrow verification | manager → implementer → verify → [security if required] → review |
| `standard` | Multiple layers with clear dependencies | manager → ready implementers → verify → security → review |
| `quality-loop` | High-risk behavior or difficult acceptance | manager → implementer ↔ evaluator → verify → security → review |
| `incident` | Active failure where diagnosis can fan out | parallel diagnosis → one mitigation owner → verify → security → review |
| `variants` | A smaller topology would lock in one approach, and 3–6 criteria can rank alternatives | manager → variants → synthesis implementer → verify → security → review |

Dispatch only agents that exist and own a concrete deliverable. Never create
work merely to use an available specialist.

After validating the manager plan, record the selected `topology`, set
`status: ready`, and update owner/next-actor fields before dispatch.

Optional specialists are useful only when triggered by the plan:

| Need | Preferred role |
|------|----------------|
| Cross-cutting or high-risk design | Software Architect |
| Complex general implementation | Senior Developer |
| Visual system and interface detail | UI Designer |
| Uncertain user needs or workflows | UX Researcher |
| Navigation and information architecture | UX Architect |
| Schema, query, or database performance | Database Optimizer |
| Measured runtime or resource bottleneck | Performance Optimizer |
| CI/CD, deployment, infrastructure, observability | DevOps Automator |
| Public docs, migration guides, runbooks | Technical Writer |

Do not use a vague autonomous optimizer. Optimization requires a named metric,
baseline, target, evidence, and approval for risky changes. If a preferred role
is unavailable, assign its concrete deliverable to the closest installed agent
or ask the user when that changes quality or risk materially.

### Stage 2 — Prepare safely

Use the current branch unless the user asked for a new branch or approved the
manager's recommendation. Record both the current branch and the review base
branch before implementation. Do not commit or push unless asked. Record any
branch decision in the decision log.

### Stage 3 — Implement ready work

**Launch Task subagents** (`tsheen-backend`, `tsheen-frontend`, … per the manager
plan). Dispatch only work items whose dependencies are satisfied. Independent
implementers may run as **parallel Task launches** when boundaries are
explicit. Backend and frontend are optional layers, not mandatory waves.

Record returned handoffs sequentially and advance only work items with
sufficient evidence.

When `topology` is `variants`, launch `tsheen-variants` before any primary-tree
edit. It may launch 2–4 isolated candidate children and one read-only judge;
those children must not launch further subagents. A `passed` handoff names the
winner and synthesis brief. Then dispatch the synthesis work item to its
declared implementer on the primary tree. `blocked`, fewer than two usable
candidates, or a missing `tsheen-variants` agent stops the flow; tell the user to
run `/chief refresh` when the agent file is missing. Variants does not replace
verification, security, or review.

### Stage 4 — Verify after implementation converges

Start verification only after every required implementation dependency has
passed. Never run the final test agent in parallel with code it must validate.

**Launch a Task** (`subagent_type: tsheen-test`). When present, `tsheen-test.md` runs
the full `code-testing-agent` pipeline and the pre-completion gate
(`test-gap-analysis` + `assertion-quality` + requirement coverage), using only
the languages listed under its **Allowed extension languages**.

Do not pass verification without a `Requirement | Evidence` table and required
command/exit-code evidence. Commands must exit 0 unless `tsheen-test.md` documents
a reproducible, unchanged, unrelated pre-existing-failure baseline. Production
bugs found by tests return to the owning implementer.

If `tsheen-test.md` is absent, run the manager's verification commands directly or
dispatch an available read-only verifier with a concrete contract, and record
the same command, exit-code, and requirement-evidence handoff. If the manager
supplied no adequate verification, return to planning; never self-certify from
implementation claims.

### Stage 5a — Security (conditional)

Run after verification converges and **before** code review when required:

| Topology | Security gate |
|----------|---------------|
| `standard`, `quality-loop`, `incident`, `variants` | **Always** — manager must set `security_review: required` |
| `micro` | Only if manager set `security_review: required` |
| Any | If required and `tsheen-security` is missing → failed gate; tell user to `/chief refresh` |

**Launch a Task** (`subagent_type: tsheen-security`) when the gate is required.

- `APPROVE` → proceed to Stage 5b.
- `CHANGES_REQUIRED` → route each actionable finding to its owner, then rerun
  affected verification and Stage 5a before Stage 5b.
- `BLOCKED` or inconclusive evidence → stop and escalate (do not start 5b).

If `/c/Users/fatem/.cursor/skills/security-review/SKILL.md` is missing when the gate is required,
the gate fails — recreate it from the AI-Features pack; never vendor it into
the project.

### Stage 5b — Review and bounded remediation

**Launch a Task** (`subagent_type: tsheen-code-reviewer`) after Stage 5a passes
(or was correctly skipped on `micro`). Never self-review or skip this stage
when the agent exists.

- `APPROVE` → finish.
- `CHANGES_REQUIRED` → route each actionable finding to its owner, then rerun
  affected verification, Stage 5a (if required for this topology), and 5b.
- `BLOCKED` or inconclusive evidence → stop and escalate.

Default to at most 3 implementation/evaluation attempts per the retry rules.

### Stage 6 — Finish

Confirm every authoritative requirement maps to evidence, record unresolved
risks and decisions, set `status: done`, and archive. Report the outcome, not
agent activity. Do not commit or push unless asked.

```bash
stamp="$(date +%Y%m%d-%H%M)-{feature-kebab}"
mkdir -p .cursor/state/tasks/archive
mv .cursor/state/tasks/active-task.md ".cursor/state/tasks/archive/$stamp.md"
test -d .cursor/state/tasks/logs && \
  mv .cursor/state/tasks/logs ".cursor/state/tasks/archive/$stamp-logs"
```

## Escalation filter

- **Escalate now:** irreversible or external action, security/compliance risk,
  high blast radius, contradictory requirements, or exhausted retries.
- **Handle and brief at closeout:** reversible implementation details within
  the approved plan.
- **Park:** unrelated cleanup, speculative optimization, and nice-to-have work
  without an acceptance requirement.

An escalation contains one decision, impact, evidence, recommendation, and
safest fallback.
