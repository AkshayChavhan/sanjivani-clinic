# 24_pr_merge_workflow: every task ends with a GitHub pull request

> **Branch:** 24_pr_merge_workflow · **Date:** 2026-10-26 · **Status:** In progress

**Plan:** [2026-10-26-1250-docs-pr-merge-workflow-plan.md](../plans/2026-10-26-1250-docs-pr-merge-workflow-plan.md). **Solution doc:** Pending (the compound question comes after the review).

## In one minute

- Tasks now end the way you already work: Claude says **"ready to merge"**, then you push the branch, open a **pull request** on GitHub and merge it with **Create a merge commit**.
- After your merge, Claude pulls `main`, checks that no commit was left out, and makes the "mark task done" commit on local `main`. Nobody pushes that commit. The next task's pull request carries it to GitHub.
- The old local-merge route is gone from CLAUDE.md, the readme, the tracker, the skills guide, code-reviewer and a saved lesson.

## Why: the problem we solved

The docs said Claude merges locally with `git merge --no-ff`. You merged on GitHub instead: tasks 02 to 06 ended as pull requests #1 to #6. Two routes for one job caused trouble twice:

- Local `main` and GitHub's `main` split after PRs #1 to #4 and needed two "sync" merges.
- Task 06 needed two pull requests. PR #5 was merged at 11:54, before the final review passed at 12:22, so 18 commits weren't in it, and PR #6 brought them in. Nothing in your docs said to wait for "ready to merge".

A new session reads CLAUDE.md, not old learning docs, so it would have followed the old rule again.

## What: what changed

| File | Change | Why |
| --- | --- | --- |
| `CLAUDE.md` | Changed | Step 1 pulls `main`, then finishes the previous task's merge. Step 9 is the pull-request route, including what to do after a squash. The Definition of done matches |
| `readme.md` | Changed | "How we work" step 3 tells you your part: wait for "ready to merge", then push, open the PR and merge with a merge commit |
| `document/task/task.md` | Changed | "How to add a task" steps 4, 7 and 8 point to CLAUDE.md. The decided "Open decision" paragraph is gone. Tasks 24 and 25 added. Task 25 groups the four small cleanups the backlog had listed one by one: each is a few lines, and with pull requests every task costs you a merge, so Claude grouped them and said so when it set the order |
| `document/skills/skills.md` | Changed | "merges locally" became "stops at ready to merge" |
| `.claude/agents/code-reviewer.md` | Changed | A branch you pushed is normal now. Only a push or PR that Claude made unasked is a must fix |
| `document/solutions/workflow-issues/check-new-steps-against-claude-md.md` | Changed | Its "Nothing after Merge" rule allows step 9's pull and check |
| `document/plans/2026-10-26-1250-docs-pr-merge-workflow-plan.md` | Added | The plan |

## How: step by step

1. **Planned with ce-plan**, then reviewed the plan with four reviewers. They changed it in three important ways:
   - **Where the "mark done" commit goes.** The first draft pushed `main` directly when no task came next, which adds a push outside the pull-request route. Now the commit stays on local `main` and travels with the next task's PR.
   - **A trigger.** After you merge, the session has already stopped, so step 1 of the *next* task now pulls `main` and finishes the previous task. After a normal merge, task.md on `main` still shows that task `In progress`, and that starts its step 9. `git branch --no-merged` catches the other cases: a PR that left commits out, or one not merged yet (then it asks you to merge first).
   - **Two more files** still described the old route: `skills.md` and a saved lesson.
2. **Rewrote CLAUDE.md** step 1, step 9 and the Definition of done, then each file that restates them. Each of those files points back to CLAUDE.md instead of copying the commands, so there's one place to change next time.
3. **Checked** for leftovers (below).

## New ideas in this task

- **Pull request (PR):** a request on GitHub to merge one branch into another. You can see the changes, then press merge.
- **GitHub CLI (`gh`):** a command-line tool for GitHub. `gh pr list` shows a branch's pull requests without opening the website. Step 1 now uses it, so it's in the readme's Prerequisites, and it needs `gh auth login` once.
- **Create a merge commit / squash / rebase:** GitHub's three ways to merge a PR. Only "Create a merge commit" keeps every commit's ID. The docs cite commit IDs (like `5ff1eff`), so we always use it.
- **Fast-forward (`git pull --ff-only`):** updating a branch by moving it forward to newer commits, with no merge of its own. `--ff-only` refuses anything else, so a pull can never quietly create a merge.
- **`git branch --no-merged origin/main`:** lists local branches that have commits GitHub's `main` doesn't have yet. A finished task's branch drops off the list once its PR is merged.
- **Ahead / behind:** "local `main` is one ahead" means it has one commit GitHub doesn't have yet. That's expected between tasks now.

## Check that it works

Leftover old rules. `-i` ignores letter case, so the search also catches "Open decision"; run on `main`, it finds that paragraph at `task.md:136`. On this branch the hits are task 24's own step title and a history note in the lesson, both allowed:

```text
$ grep -rn -i -E -- '--no-ff|merges locally|open decision' CLAUDE.md readme.md document/task/task.md document/skills/ .claude/agents/ document/solutions/
document/task/task.md:108:- [x] Remove the decided "Open decision" paragraph from the backlog
document/solutions/workflow-issues/check-new-steps-against-claude-md.md:35:- **Nothing after Merge.** "Merge into main" [...]
```

Every task's Merge step is still the last step: `grep -n -A1 "Merge into main" document/task/task.md` shows a blank line after all 8 of them.

The new step 1 checks, run now. Git lists this branch as not yet on GitHub's `main` (`main` itself is listed because of task 06's unpushed bookkeeping commit), and this branch has no PR yet, so a new session would stop and ask you to merge it. Task 06's branch isn't listed, and its PRs show as merged:

```text
$ git branch --list --no-merged origin/main
* 24_pr_merge_workflow
  main
$ gh pr list --state all --head 24_pr_merge_workflow --json number,state
[]
$ gh pr list --state all --head 06_react_app_setup --json number,state
[{"number":6,"state":"MERGED"},{"number":5,"state":"MERGED"}]
```

Not testable here: code-reviewer's new push check for a branch you've already pushed. This branch has no copy on GitHub until you push it.

## Review and lessons

**ce-code-review:** not run. This task changes docs and agent instructions only, and CLAUDE.md runs it "for code changes".

**code-reviewer** ran in a fresh process each time. `git status --short`, `git log -1 --oneline` and `git show-ref --heads` matched before and after every pass, so it changed nothing. Each pass found a real hole in the new procedure:

| Pass | Verdict | The main must fix | Fixed in |
| --- | --- | --- | --- |
| 1 | Needs changes | After a squash merge, step 9's only remedy (a second PR) would add the whole task again. Step 1 read task.md before pulling. Two stale lines in the lesson | `8fb205e`, `b6a11a4`, `bbb1210` |
| 2 | Needs changes | Step 1's pull had no instruction for when it fails. `gh` was needed but not listed or explained | `0b5aae4`, `0f051bd` |
| 3 | Needs changes | Step 1 looked for an unmerged task in task.md on `main`, which can never show one: a task becomes `In progress` only on its own branch | `ecbaa81` (ask git with `--no-merged`) |
| 4 | Needs changes | Asking for a second PR didn't say "stop", so a session could make the bookkeeping commit too early and split `main` | `2e6e29b` |
| 5 | Needs changes | Step 9 would stop on the normal path: step 1 has already pulled, so step 9's pull prints `Already up to date.`, which isn't a fast-forward. Now it goes on unless the pull *refused* | `7680a59` |
| 6 | Needs changes | task.md's short copy of step 1 left out the check that catches a normal merge (the task still `In progress` on `main`). It now just points to CLAUDE.md. `gh` got a failure rule too | `c006e4a`, `e9cc601` |

Smaller fixes from the same passes: the leftover search ignores letter case (`-i`). Step 9 gives you the last commit ID to match in the PR, and readme step 3 says so. Step 9 starts only after the compound step. The plan matches CLAUDE.md.

**Your decision:** the "mark done" commit stays on local `main`, and the next PR carries it (assumption A1, confirmed on 2026-10-26).

**Lessons from the passes:**
- Put a failure rule at every place that runs the command.
- Run a new check once against the "before" version, to watch it catch the problem.
- When you add a check, ask where the information really lives when the check runs.
- Every failure branch should say "stop".
- A short copy of a rule drifts. Point to the rule instead of copying it.

Pending: the next code-reviewer pass, then the compound question.

## Common mistakes

- **Merging the PR before "ready to merge".** The review may still change things, and those commits then need a second PR.
- **Choosing Squash or Rebase on GitHub.** The commits get new IDs, and the docs' commit references break.
- **Pushing `main` by hand.** The "mark done" commit doesn't need it: the next task's PR carries it.

## Try it yourself

About 5 minutes, and it changes nothing:

1. Run `git status -sb` on `main`. Is it ahead of `origin/main`? By how many commits, and which ones (`git log origin/main..main --oneline`)?
2. Run `gh pr list --state merged --json number,title` and match each PR to a task in `document/task/task.md`.

## Learn more

- [GitHub: About pull requests](https://docs.github.com/en/pull-requests/reference/pull-requests)
- [GitHub: About merge methods](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/configuring-pull-request-merges/about-merge-methods-on-github)
- [Git: git pull `--ff-only`](https://git-scm.com/docs/git-pull)
