---
title: Pull-Request Merge Workflow - Plan
type: docs
date: 2026-10-26
artifact_contract: ce-unified-plan/v1
product_contract_source: ce-plan-bootstrap
execution: code
---

# Pull-Request Merge Workflow - Plan

**Task:** `24_pr_merge_workflow` in `document/task/task.md`. `CLAUDE.md` wins over this plan wherever they differ.

## Goal Capsule

- **Objective:** Every future task ends the way the owner now works. After Claude says "ready to merge", the owner pushes the branch, opens a GitHub pull request and merges it. Local `main` never lacks a commit that GitHub's `main` has. Between tasks, local `main` may be one bookkeeping commit ahead.
- **Means:** rewrite the merge step and every file that restates it (KTD1). Then the next task's pull request carries the bookkeeping commit to GitHub, with no push of `main` (A1).
- **Authority:** `CLAUDE.md` first, then the task 24 steps in `document/task/task.md`, then this plan.
- **Stop and ask the owner if:** a change would let a Claude session push, open a PR or merge on its own, or would change any rule beyond how a task ends.
- **Execution profile:** docs and agent instructions only. Verify by searching for leftover old rules and by re-reading the edited sections against each other.
- **Who finishes:** the main session commits on `24_pr_merge_workflow` and stops at "ready to merge". The owner pushes, opens the PR and merges it.

## Product Contract

### Summary

Replace the local `git merge --no-ff` ending with a pull-request ending in every place that describes it, and remove the backlog paragraph that asked the owner to choose.

### Problem Frame

CLAUDE.md step 9, readme.md, task.md's "How to add a task", `document/skills/skills.md`, code-reviewer and one solution doc all describe a local merge. The owner merges on GitHub instead (tasks 02 to 06 ended as PRs #1 to #6). Following the old text made local and GitHub `main` split. Task 06 needed two PRs: PR #5 was merged at 11:54, before the review passed at 12:22, and 9 of the 18 commits it missed were written after it merged. Nothing in the owner's docs said to wait for "ready to merge". A future session reads CLAUDE.md, not task 06's learning doc, so it would follow the old rule.

### Requirements

- R1. CLAUDE.md's merge step describes the pull-request route. The owner pushes, opens the PR and merges with "Create a merge commit". Claude then pulls `main` and checks that no branch commit is missing.
- R2. A Claude session still never pushes, opens a PR or merges unless the owner asks in that session. This is unchanged from the Git rules and the Compound Engineering section.
- R3. readme.md "How we work", task.md "How to add a task", `document/skills/skills.md`, CLAUDE.md's Definition of done and the solution doc `check-new-steps-against-claude-md.md` agree with R1.
- R4. code-reviewer treats a branch that tracks GitHub as normal. It flags only a push or PR that the learning doc says Claude made unasked.
- R6. The owner's own page (readme "How we work") says to open and merge the PR only after Claude says "ready to merge".
- R7. The next session that starts a task pulls `main`, then finishes the previous task's merge step if its PR is merged, or asks the owner to merge it first.
- R5. The backlog's "Open decision" paragraph is removed, because the owner has decided.

### Key Decisions

- **GitHub pull requests, merged by the owner.** Governs R1, R3. (session-settled: user-directed — chosen over keeping local `git merge --no-ff` merges: the owner already merges on GitHub, and two routes split `main`)

### Scope Boundaries

- No change to how the review, the compound step or the learning doc work, apart from where the bookkeeping commit goes.
- Past learning docs (01 to 06) stay as they are: they record what happened then.
- No GitHub settings change (branch protection, a default merge method). That's the owner's account. A squash or rebase merge would change the commit IDs the docs cite, so step 9 names "Create a merge commit". If it was missed, the pull refuses to fast-forward and step 9 says to stop and tell the owner, not to open a second PR.
- Considered and not built:
  - **Bookkeeping as the first commit of the next task's branch.** GitHub would show each finished task as In progress for longer, and code-reviewer would need an exception for another task's rows. Revisit if the owner wants local `main` never ahead of GitHub.
  - **Pushing `main` directly.** It's an extra manual step outside pull requests, and it's what went wrong around task 06.

## Planning Contract

### Key Technical Decisions

- KTD1. **One owner per rule.** CLAUDE.md step 9 holds the full procedure. readme.md, task.md and code-reviewer cite it in a line each instead of restating the commands (`document/solutions/workflow-issues/check-new-steps-against-claude-md.md`).

### Assumptions

These are this plan's own choices. The owner hasn't confirmed them yet.

- A1. **The bookkeeping commit stays on local `main`, and nobody pushes it.** After the A3 check, Claude makes `docs(NN): mark task NN done` on local `main`, as today. The next task branches from local `main`, so that task's pull request carries the commit to GitHub. GitHub's `main` then fast-forwards past it, and `git pull --ff-only` keeps working. CLAUDE.md's "the only kind of commit made directly on main" stays true.
- A2. **Step 1 pulls first, then finishes the previous task (R7):** `git pull --ff-only origin main`, then read task.md on `main`. If an earlier task is In progress and its PR is merged, run its step 9. If it isn't merged yet, stop and ask the owner. Then branch.
- A3. **The "missing commits" check runs before the bookkeeping commit:** `git rev-list --count origin/main..NN_short_name` must print 0. If it doesn't, the owner opens a second PR from the same branch, as task 06 needed PR #6.

## Implementation Units

### U1. CLAUDE.md

- **Goal:** the workflow describes the pull-request ending.
- **Requirements:** R1, R2, R3, R7
- **Files:** `CLAUDE.md`
- **Approach:**
  1. Step 1 pulls `main`, then finishes the previous task (A2).
  2. Step 9: Claude stops at "ready to merge" and says what to push. The owner pushes, opens the PR and merges with "Create a merge commit". Claude pulls `main`, runs the A3 check, and makes the bookkeeping commit per A1.
  3. Definition of done: the PR is merged with a merge commit and the task is marked done.
- **Test expectation:** none -- docs.
- **Verification:** a search for `--no-ff` in CLAUDE.md finds nothing. The Git rules' ask-first list and the Compound Engineering rules are unchanged.

### U2. readme.md, task.md, skills.md and the workflow lesson

- **Goal:** every other place that describes the ending agrees with U1, and the decided question is gone.
- **Requirements:** R3, R5, R6
- **Files:** `readme.md`, `document/task/task.md`, `document/skills/skills.md`, `document/solutions/workflow-issues/check-new-steps-against-claude-md.md`
- **Approach:**
  - readme "How we work" step 3 tells the owner their part (R6) and cites CLAUDE.md step 9 for Claude's part.
  - task.md "How to add a task" steps 4, 7 and 8 point to CLAUDE.md steps 1 and 9 (KTD1).
  - Delete the "Open decision" paragraph.
  - skills.md: the "merges locally" line becomes the PR route.
  - The lesson's "Nothing after Merge" bullet allows step 9's pull, the A3 check and the bookkeeping commit. Its pointer to the backlog's open decision becomes a pointer to CLAUDE.md step 9. Its Context and Examples stay as history.
- **Test expectation:** none -- docs.
- **Verification:** `grep -n -A1 "Merge into main" document/task/task.md` still shows a blank line after every task's Merge step.

### U3. code-reviewer

- **Goal:** the reviewer's push check fits the new route.
- **Requirements:** R2, R4
- **Files:** `.claude/agents/code-reviewer.md`
- **Approach:** rewrite the "Nothing shipped behind the owner's back" check per R4. The agent's job doesn't change, so CLAUDE.md's Agents table stays as it is.
- **Test expectation:** none -- agent instructions.
- **Verification:** the new text reads correctly for both cases: a branch with no upstream yet (this task, before the owner pushes) and a branch the owner has pushed. This branch can't test the second case before review, so the learning doc says so.

### U4. Learning doc

- **Goal:** `document/learning/24_pr_merge_workflow.md` explains the new ending, and why the old one split `main`.
- **Requirements:** R1 to R5
- **Files:** `document/learning/24_pr_merge_workflow.md`
- **Test expectation:** none -- docs.
- **Verification:** its pasted commands match a re-run.

## Verification Contract

| Check | Passes when |
| --- | --- |
| `grep -rn -E -- '--no-ff\|merges locally\|open decision' CLAUDE.md readme.md document/task/task.md document/skills/ .claude/agents/ document/solutions/` | no hits, except history in a lesson's Context or Examples |
| The lesson's Merge check, `grep -n -A1 "Merge into main" document/task/task.md` | a blank line after every task's Merge step |
| Re-read CLAUDE.md "Task workflow", "Git rules" and "Compound Engineering" together | no rule lets Claude push, open a PR or merge unasked, and step 9 matches the Definition of done |
| code-reviewer pass, with the snapshot before and after | the snapshots match, and the verdict is recorded |

## Definition of Done

- U1 to U4 are committed on `24_pr_merge_workflow`, with docs, agent and tracker changes in separate commits.
- The Verification Contract passes.
- code-reviewer's final pass says "Ready to merge", recorded in the learning doc in the same sitting as ticking Review (`document/solutions/workflow-issues/update-learning-doc-after-later-steps.md`).
- The compound question is answered.
- The owner merges the PR after "ready to merge". Then task 24 is marked done per A1.
