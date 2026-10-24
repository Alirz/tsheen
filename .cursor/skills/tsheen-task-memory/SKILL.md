---
name: tsheen-task-memory
description: >-
  Shared task ledger contract for chief subagents: what to read, the handoff
  to return, and how to report evidence. Run-state rules live in the chief skill.
---

# Shared Task Memory (`tsheen`)

**Announce:** "Using tsheen-task-memory."

> On init, replace every `tsheen` with the workspace root slug (e.g. `my-app`).

Subagents do **not** inherit chat history. `.cursor/state/tasks/active-task.md`
is the source of truth.

## Ownership

- **Chief:** sole writer of frontmatter, run ledger, handoffs, verdict
  sections, decision log, and closeout.
- **Manager:** writes only `## Manager plan`, and only before implementation.
- **Every other agent:** reads the ledger and returns the handoff below. Never
  edit `active-task.md`; that prevents concurrent write loss.

## Reading

Read the frontmatter plus only the sections your agent contract lists, and
start from the files, symbols, and findings named in your dispatch prompt.
Open other sections only when those do not answer a question you must resolve.

## Handoff contract

Every execution or evaluation agent returns:

```markdown
## {Role} handoff
- Work item: {ID}
- Status: passed | failed | blocked
- Attempt: {n}/{max}
- Requirements: {R1, R2}
- Artifacts changed: {paths or none}
- Evidence: {commands + exit codes, report/log paths, or exact observations}
- Risks / blockers: {none or details}
- Next action: {specific owner and action}
```

Never claim a pass from activity, prose confidence, or file existence alone.

## Command output

Keep full build, test, lint, and scan output on disk, not in context:

```bash
mkdir -p .cursor/state/tasks/logs
{command} > .cursor/state/tasks/logs/{work-item}-{step}.log 2>&1; echo "exit=$?"
```

Then read only the summary and failing entries from the log (for example with
`tail` or a search for `error|fail`). Open the full log only when that excerpt
does not explain a failure. In the handoff, cite the command, exit code, the
summary line, failing items verbatim, and the log path.

## Context rules

1. Preserve requirement IDs, user constraints, and decisions verbatim.
2. Reference artifacts and log paths instead of pasting large outputs or transcripts.
3. Do not place credentials, secrets, or unrelated personal data in the ledger or logs.
4. Record short decision rationale and evidence, never hidden reasoning traces.
