---
title: Walk a new procedure through every case before the review
date: 2026-10-26
category: workflow-issues
module: task-workflow
problem_type: workflow_issue
component: development_workflow
severity: medium
applies_when:
  - Writing or changing a step list that a fresh session will follow, such as the CLAUDE.md task workflow or an agent's steps
  - Adding a check, a failure branch or a stop rule to such a step list
  - Writing a step that runs after an earlier step has already changed the repo
  - Restating a CLAUDE.md procedure in task.md, readme.md or an agent file
root_cause: missing_workflow_step
related_components: [documentation]
tags: [claude-md, procedure, failure-paths, stop-rule, code-review, pull-request, git-branch-no-merged]
---

# Walk a new procedure through every case before the review

## Context

Task 24 rewrote CLAUDE.md step 1 (start a task) and step 9 (merge through a GitHub pull request). A fresh session follows these steps as written, with no memory of why they say what they say.

It took seven code-reviewer passes to reach "Ready to merge". Each of the first six found one new hole in the procedure, as a must fix. Each pass cost a fresh process, the before-and-after git snapshot and a new verdict. The full list is in `document/learning/24_pr_merge_workflow.md`, "Review and lessons". The commit IDs below are on task 24's branch. CLAUDE.md step 9 has the owner merge with a merge commit, which keeps these IDs.

Every hole was a case nobody had walked through by hand:

1. **The step read the repo before it was up to date** (pass 1). The first draft read task.md first and pulled `main` after it, so it read a stale `main` (CLAUDE.md as it was at `1da1f33`). The same pass found that after a squash merge, the only remedy, a second PR, would add the whole task again under new commit IDs. Fixed in `8fb205e`.
2. **A command had no failure rule** (pass 2). Step 1's `git pull --ff-only` said nothing about a refusal. Fixed in `0b5aae4`.
3. **A check looked where the answer can't be yet** (pass 3). Step 1 looked for an unmerged task in task.md on `main`. But a task is set `In progress` on its own branch, so that status reaches `main` only through the merge. task.md on `main` can never show an unmerged task. Fixed in `ecbaa81` by asking git: `git branch --list --no-merged origin/main`.
4. **A failure branch didn't say "stop"** (pass 4). "Ask the owner to open a second PR" ended there. A session could go on to the bookkeeping commit before the second PR was merged, and split local `main` from GitHub's. Fixed in `2e6e29b`.
5. **The success test misfired on the normal path** (pass 5). Step 9 said "go on only if the pull fast-forwarded". But step 1 has already pulled, so step 9's pull prints `Already up to date.`, which isn't a fast-forward. The normal path would have stopped. Fixed in `7680a59`: go on only if the pull *didn't refuse*.
6. **A short copy dropped a case** (pass 6). task.md's "How to add a task" step 4 summed up CLAUDE.md step 1 in one line. It left out the check that catches a normal merge (the task still `In progress` on `main`). Fixed in `c006e4a`: it now points to CLAUDE.md step 1. `e9cc601` also gave `gh` a failure rule.

## Guidance

**Before the first review, walk the new procedure through every case by hand.** Write a small table: one row per case, and four columns.

- **Case:** the normal path first, then each way it can fail.
- **Repo state when the step runs:** what earlier steps have already done, and which files hold what at that moment.
- **What the commands print:** for each command, in that state.
- **What the text tells the session to do:** quote the procedure's own words.

Then check every row against these five rules:

1. **Every failure row ends in "stop".** Say what not to do as well, such as "make no bookkeeping commit, and start no new task". A failure branch that only asks the owner for something lets the session carry on.
2. **Every check reads from a place where the answer already is.** For each check, ask where that information lives at that moment. If it only arrives later, an earlier check can't see it. (A task's `In progress` reaches task.md on `main` only when the merge brings it.) Ask git or `gh` instead.
3. **The normal path runs in order, with what earlier steps did.** If an earlier step already pulled, the next pull prints `Already up to date.` Write success as "didn't refuse" or "didn't fail", not as one exact output.
4. **Every command that can fail has a rule at each place that runs it.** That includes `git pull`, `gh` (missing, not logged in, offline) and any count you test.
5. **Other files point to the rule; they don't copy it.** A one-line summary drops cases. After the change, search the files that restate it. No hits means nothing copies the commands:

   ```bash
   grep -rn -E -- 'no-merged|ff-only|second PR|Already up to date' readme.md document/task/task.md document/skills/ .claude/agents/
   ```

   On task 24's branch this prints nothing. It leaves out `document/solutions/`, where lessons like this one quote the rules on purpose. Change the search words to match the procedure you changed.

Run each new check once on the real repo, and once against the "before" version if you can, to see it catch the problem. The learning doc's "Check that it works" shows step 1's checks run on task 24's own branch.

## Why This Matters

A review finds one hole at a time, because each fix changes the text the next pass reads. Six holes meant six extra passes. The walk-through finds them all in one sitting, before the first pass.

The cost of a hole that gets through is high. The session that runs step 9 is new, and nobody watches it. Holes 4 and 5 fail in opposite directions: one makes a commit too early, the other stops a merge that worked. Both happen without anyone noticing at the time.

## When to Apply

- Any change to CLAUDE.md's task workflow, especially steps that run in a later session (step 1, and step 9's after-merge part)
- Any agent step list in `.claude/agents/` that has checks or failure branches
- Any time you summarize a procedure in another file. Point to it instead

## Examples

The case table for task 24's step 1 and the after-merge part of step 9, as they read now (CLAUDE.md lines 68 to 107):

| Case | Repo state when the step runs | What the commands print | What the text says |
| --- | --- | --- | --- |
| Normal merge | Step 1 pulled `main`; task NN is `In progress` on `main` | step 9's pull: `Already up to date.`; count: `0` | Go on: make the bookkeeping commit |
| PR not merged yet | The branch is listed by `--no-merged`; task.md on `main` doesn't show it | `gh`: `[]`, or a PR with `"state":"OPEN"` | Stop, ask the owner to merge first |
| PR merged too early | Branch listed; its PR is `MERGED`, none open; `main` has its "Merge pull request #N" commit | step 9's count isn't `0` | Ask for a second PR, and stop there |
| Squash or rebase | GitHub's `main` has the task under new commit IDs | usually the pull refuses; if not, the count isn't `0` and there's no "Merge pull request #N" commit | Stop and tell the owner ("The pull refused" or "Anything else"); no second PR |
| `gh` fails | Missing, not logged in, or offline | an error | Stop and tell the owner |
| Bookkeeping commit not pushed | `main` is one commit ahead of GitHub's | `main` is listed by `--no-merged` | Expected; not a task branch |

Earlier drafts in task 24 failed rows 2, 3 and 1, by breaking rules 2, 1 and 3:

```markdown
<!-- rule 2, before ecbaa81: looks where the answer can't be yet -->
2. Read `document/task/task.md` on `main`. If an earlier task is still `In progress`, ...
<!-- after -->
2. Find unfinished tasks: `git branch --list --no-merged origin/main` lists every branch ...

<!-- rule 1, before 2e6e29b: no stop -->
... Ask the owner to open a second PR from the same branch.
<!-- after -->
... Otherwise stop, make no bookkeeping commit, and start no new task: [...] Ask the owner to open a second PR from the same branch, and run this step again once it's merged.

<!-- rule 3, before 7680a59: misfires on the normal path -->
Go on only if the pull fast-forwarded and the count is `0`.
<!-- after -->
Go on only if the pull didn't refuse (it fast-forwarded, or printed `Already up to date.`) and the count is `0`.
```

## Related

- `document/solutions/workflow-issues/check-new-steps-against-claude-md.md`: check a new step against the rules CLAUDE.md already has. This lesson checks a new procedure against its own cases
- `document/learning/24_pr_merge_workflow.md`, "Review and lessons": all eight passes
- `CLAUDE.md`, "Task workflow" steps 1 and 9
