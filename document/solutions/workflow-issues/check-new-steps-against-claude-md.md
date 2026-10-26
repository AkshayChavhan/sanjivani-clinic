---
title: Check every new agent rule or tracker step against the CLAUDE.md workflow
date: 2026-10-25
category: workflow-issues
module: task-workflow
problem_type: workflow_issue
component: development_workflow
severity: medium
applies_when:
  - Adding or changing a step in document/task/task.md
  - Adding or changing a rule or a step list in a .claude/agents/ file
  - Writing a step that runs on main, or one that comes after "Merge into main"
  - Writing a step that settles something the owner has not decided yet
tags: [claude-md, task-tracker, agents, workflow-rules, code-review, bookkeeping-commit, main-branch]
---

# Check every new agent rule or tracker step against the CLAUDE.md workflow

## Context

`CLAUDE.md` holds the workflow rules. Other files restate parts of them in their own words: the agent files in `.claude/agents/` and the task steps in `document/task/task.md`. Three times in a row, a step or rule written into one of those files broke a rule it restated. Only the code-reviewer agent caught it, each time as a "must fix".

1. **Task 04: task-planner left out the Compound step.** `task-planner.md` said every task "always includes" four steps: Create branch, Write the learning doc, Review, Merge. It also allowed "3 to 8 checkbox steps". CLAUDE.md already had a Compound step (from task 05 on) when the agent was written. So every task the planner made would have had no Compound step. The review also said its "3 to 8 steps" limit couldn't be met. Fixed in `e187586`: five required steps in workflow order, Merge last, "5 to 8 steps; if it needs more, split the task".
2. **Task 05: a tracker step would have made a non-bookkeeping commit on main.** Commit `6fc5df5` added a step to task 06, *after* "Merge into main": `git fetch origin`, then on main `git merge origin/main`. That makes a merge commit on main. CLAUDE.md says the bookkeeping commit `docs(NN): mark task NN done` "is the only kind of commit made directly on main". The step also settled how `main` relates to GitHub, which is the owner's call. Fixed in `8cb3a9f`: the step was removed, and the question became an open owner decision in the task.md backlog, which task 24 settled.

3. **Task 05 again: a new agent rule broke the agent's own tool list.** Commit `a040c93` told code-reviewer to run `git branch -vv`, but its read-only git list allows only `git branch --list` and `git branch --show-current`. code-reviewer's second pass caught it, in the same branch that saved this lesson. Fixed by using `git branch --list -vv`, which prints the same tracking info.

The shared cause: the new text was written from what the task needed, not checked against the rules it restated. Each file read fine on its own. The conflict only showed up when someone compared it with CLAUDE.md.

## Guidance

Before you commit a new or changed step or rule in `.claude/agents/*.md` or `document/task/task.md`, re-read these CLAUDE.md sections: **Task workflow**, **Git rules** (the ask-first list) and **Agents**. Then check the new text against this list:

- **The five required steps.** From task 05 on, every task has Create branch, Write the learning doc, Review with code-reviewer, Compound, and Merge into main. They come in that order, and Merge is the last step.
- **Nothing after Merge.** "Merge into main" is the last step. After the owner merges the pull request, CLAUDE.md step 9 allows only these: pull GitHub's `main` with `--ff-only`, check that no branch commit was left out, and make the bookkeeping commit `docs(NN): mark task NN done` on local `main`. A step that merges, commits or pulls anything else into main breaks the rule. (This rule changed in task 24. Before that, the merge itself was a local `git merge --no-ff`.)
- **Owner decisions stay open.** Push, adding a remote, pull requests, global installs, anything paid, publishing, and choices about the stack or product belong to the owner. A step that does one of these, or quietly picks an answer, becomes an open question or a backlog decision instead.
- **Agents never change git.** A step or rule that has a subagent branch, commit or merge breaks "the main session owns git".
- **Limits must be reachable.** A step count, file limit or tool list in an agent file must leave room for everything CLAUDE.md requires.

If a rule really has to change, change CLAUDE.md first, in its own small task. Then update the files that restate it. Task 24 did this for the merge step: it changed CLAUDE.md step 9, then readme.md, task.md, skills.md, code-reviewer and this lesson.

A quick check for "nothing after Merge": every line after a `Merge into main` step should be blank.

```bash
grep -n -A1 "Merge into main" document/task/task.md
```

The line after every task's Merge step should be blank. At `6fc5df5`, the line after task 06's Merge step was the "Sync with GitHub" step.

## Why This Matters

Agent files and tracker steps are instructions that a later session follows as written, often without the context that produced them. Task 06 runs in a new session, so it would have run the sync step as written. A wrong rule in task-planner would have repeated in every task it planned. Both slips were caught at review, but each cost a must-fix round, and the review is the last check before merge.

## When to Apply

- Adding a step to any task in `document/task/task.md`, including steps for a future session
- Changing an agent's job, step list or limits in `.claude/agents/`
- Writing down a decision as a step, when the decision may not be yours to make

## Examples

Task-planner's step rule, before (`1de235a`) and after (`e187586`):

```markdown
<!-- before -->
- **Steps:** give each task 3 to 8 checkbox steps under a `### NN_short_name` heading. Every task always includes:
  - Create branch
  - Write the learning doc
  - Review with code-reviewer and fix what it finds
  - Merge into main

<!-- after -->
- **Steps:** give each task 5 to 8 checkbox steps under a `### NN_short_name` heading: the five steps every task needs, plus up to three work steps. If it needs more, split the task. The five, in workflow order:
  - Create branch (first)
  - Write the learning doc (after the work steps)
  - Review with code-reviewer and fix what it finds
  - Compound: save a lesson in document/solutions/ if one passes the counterfactual question
  - Merge into main (last)
```

Task 06's steps, before (`6fc5df5`) and after (`8cb3a9f`):

```markdown
<!-- before -->
- [ ] Merge into main
- [ ] Sync with GitHub (...): `git fetch origin`, then on main `git merge origin/main` (...)

<!-- after: Merge is last; the sync is an open owner decision in the backlog -->
- [ ] Merge into main
```

## Related

- `document/learning/04_agents.md`, "Review and lessons": the task-planner finding
- `document/learning/05_compound_engineering.md`, "Review and lessons": the sync-step finding
- `CLAUDE.md`, "Task workflow" steps 8 (Compound) and 9 (Merge)
