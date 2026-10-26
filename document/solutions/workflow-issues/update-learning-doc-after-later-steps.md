---
title: Update the learning doc after each step that runs after it
date: 2026-10-26
category: workflow-issues
module: task-workflow
problem_type: workflow_issue
component: development_workflow
severity: medium
applies_when:
  - ce-code-review, a code-reviewer pass, the compound step or the merge has just finished
  - A code-reviewer must fix has been fixed, and the next pass is about to run
  - Leaving a placeholder in a learning doc for a step that hasn't run
root_cause: missing_workflow_step
related_components: [documentation]
tags: [learning-doc, stale-status, code-review, compound, task-tracker, must-fix]
---

# Update the learning doc after each step that runs after it

## Context

The task workflow in CLAUDE.md writes the learning doc at step 6. Review (step 7), compound (step 8) and merge (step 9) all come after it. So the doc starts with placeholders for things that haven't happened yet. That's by design: `.claude/agents/learning-doc-writer.md` says "Leave 'Review and lessons' as pending unless the main session gave you the real verdict", and the header says `In progress` until the merge.

Each later step makes one of those placeholders false, and nothing reminds you to replace it. In task 06, code-reviewer found a stale placeholder twice, each time as a must fix, and each one cost a review pass:

1. **First pass.** "Review and lessons" still said "**Pending.** ce-code-review and the code-reviewer agent haven't run yet, and the compound question isn't answered yet." But ce-code-review had run, and task.md had ticked its step (`681bd76`). Fixed in `4e2a694`.
2. **Second pass.** The line under the header still said "No solution doc yet: the compound question comes after the review." But ce-compound had written `tailwind-source-limit-in-global-css.md` (`02504d4`), and task.md had ticked the Compound step (`2c4aa66`). The compound answer had gone into "Review and lessons" (`59145ae`), but the top line was missed. Fixed in `dae85a0`.

The cause both times: one step's result belongs in more than one place in the doc, and the placeholders use different words. Updating the section you have in mind leaves the others stale.

## Guidance

**After each step below, update the learning doc in the same sitting, before you start the next step.** Commit the doc change next to the step's tick in task.md.

| Step that just finished | What to change in the learning doc |
| --- | --- |
| ce-code-review | "Review and lessons": its verdict, and what you did about each finding |
| Each code-reviewer pass | A new entry for that pass: its verdict, each must fix and how you fixed it. The second pass gets its own entry |
| Compound | The top line: link the solution doc, or say there is none and why. "Review and lessons": the compound question and its answer |
| Merge | The header's Status becomes `Done`, in the bookkeeping commit `docs(NN): mark task NN done` |

**Before every code-reviewer pass, search the doc for leftover placeholders:**

```bash
grep -n -i -E 'pending|not run|\byet\b' document/learning/NN_short_name.md
```

Read each hit; the search finds candidates, not failures. A hit is fine when it describes the app ("no components yet") or quotes history ("still said pending"). It is stale when it says a workflow step hasn't happened, but task.md or `git log` says it has.

**Then compare the doc with the two records it must agree with:**

```bash
grep -n -A25 '^### NN_short_name' document/task/task.md   # which steps are ticked (stop at the next heading)
git diff --stat main...HEAD -- document/solutions/        # did this task save a solution doc?
```

Every ticked step needs its result in the doc. If the second command lists a file, the top line must link it.

**Start every placeholder with the word "Pending".** Then one search finds them all. Task 06's top-line placeholder said "No solution doc yet", which the search only catches through the word "yet".

## Why This Matters

code-reviewer checks the learning doc against task.md and `git log`, and a contradiction is a must fix. Each one costs a full pass: a fresh process, the before-and-after git snapshot, and a new verdict. If the reviewer misses one, the merged doc tells the owner something false, which breaks the "Be honest" rule in CLAUDE.md.

The trap is built into the workflow, so it comes back every task: the doc has to exist before the review, and learning-doc-writer is told to leave placeholders.

## When to Apply

- Every task, after steps 7, 8 and 9 of the CLAUDE.md task workflow
- Right after fixing a must fix, before the next code-reviewer pass. The fix may be a step whose result belongs somewhere else in the doc too

## Examples

The search on task 06's learning doc at `2c4aa66` (Compound ticked, before the second pass). Long lines are cut with `[...]`:

```text
5:**Plan:** [...]. No solution doc yet: the compound question comes after the review.
10:- **shadcn/ui** is set up (Base UI, the `nova` preset) with no components yet. [...]
60:   - `--no-install`, `--no-git`: don't install packages or start a git repo yet.
256:| Nothing imports through `@/` yet, so the alias was untested. | [...]
260:- **Must fix:** this section still said "pending" after ce-code-review had run. Fixed by writing it.
```

Line 5 is stale: task.md had ticked Compound, and `02504d4` had added the solution doc. Lines 10, 60 and 256 describe the app, and line 260 quotes history.

At `681bd76` (ce-code-review ticked, before the first pass), the same search also listed line 253, "**Pending.** ce-code-review and the code-reviewer agent haven't run yet, [...]". That was the first must fix.

At `dae85a0`, after both fixes, only the four harmless hits (lines 10, 60, 256 and 260) remain.

## Related

- `document/solutions/workflow-issues/check-new-steps-against-claude-md.md`: other slips that only code-reviewer caught
- `document/learning/06_react_app_setup.md`, "Review and lessons"
- `.claude/agents/learning-doc-writer.md`: the rule to leave "Review and lessons" as pending
- `CLAUDE.md`, "Task workflow" steps 6 to 9, and "Learning docs" ("Be honest")
