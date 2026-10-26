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
| `document/task/task.md` | Changed | "How to add a task" steps 4, 7 and 8 point to CLAUDE.md. The decided "Open decision" paragraph is gone. Tasks 24 and 25 added |
| `document/skills/skills.md` | Changed | "merges locally" became "stops at ready to merge" |
| `.claude/agents/code-reviewer.md` | Changed | A branch you pushed is normal now. Only a push or PR that Claude made unasked is a must fix |
| `document/solutions/workflow-issues/check-new-steps-against-claude-md.md` | Changed | Its "Nothing after Merge" rule allows step 9's pull and check |
| `document/plans/2026-10-26-1250-docs-pr-merge-workflow-plan.md` | Added | The plan |

## How: step by step

1. **Planned with ce-plan**, then reviewed the plan with four reviewers. They changed it in three important ways:
   - **Where the "mark done" commit goes.** The first draft pushed `main` directly when no task came next, which adds a push outside the pull-request route. Now the commit stays on local `main` and travels with the next task's PR.
   - **A trigger.** After you merge, the session has already stopped, so step 1 of the *next* task now pulls `main`, then finishes the previous task's step 9 (or asks you to merge it first).
   - **Two more files** still described the old route: `skills.md` and a saved lesson.
2. **Rewrote CLAUDE.md** step 1, step 9 and the Definition of done, then each file that restates them. Each of those files points back to CLAUDE.md instead of copying the commands, so there's one place to change next time.
3. **Checked** for leftovers (below).

## New ideas in this task

- **Pull request (PR):** a request on GitHub to merge one branch into another. You can see the changes, then press merge.
- **GitHub CLI (`gh`):** a command-line tool for GitHub. `gh pr list` shows a branch's pull requests without opening the website. Step 1 now uses it, so it's in the readme's Prerequisites, and it needs `gh auth login` once.
- **Create a merge commit / squash / rebase:** GitHub's three ways to merge a PR. Only "Create a merge commit" keeps every commit's ID. The docs cite commit IDs (like `5ff1eff`), so we always use it.
- **Fast-forward (`git pull --ff-only`):** updating a branch by moving it forward to newer commits, with no merge of its own. `--ff-only` refuses anything else, so a pull can never quietly create a merge.
- **Ahead / behind:** "local `main` is one ahead" means it has one commit GitHub doesn't have yet. That's expected between tasks now.

## Check that it works

Leftover old rules. `-i` ignores letter case, so the search also catches "Open decision"; run on `main`, it finds that paragraph at `task.md:136`. On this branch the hits are task 24's own step title and a history note in the lesson, both allowed:

```text
$ grep -rn -i -E -- '--no-ff|merges locally|open decision' CLAUDE.md readme.md document/task/task.md document/skills/ .claude/agents/ document/solutions/
document/task/task.md:108:- [x] Remove the decided "Open decision" paragraph from the backlog
document/solutions/workflow-issues/check-new-steps-against-claude-md.md:35:- **Nothing after Merge.** "Merge into main" [...]
```

Every task's Merge step is still the last step: `grep -n -A1 "Merge into main" document/task/task.md` shows a blank line after all 8 of them.

The new step 1 command, for a merged task and for this one (no PR yet, so step 1 would stop and ask you to merge it):

```text
$ gh pr list --state all --head 06_react_app_setup --json number,state
[{"number":6,"state":"MERGED"},{"number":5,"state":"MERGED"}]
$ gh pr list --state all --head 24_pr_merge_workflow --json number,state
[]
```

Not testable here: code-reviewer's new push check for a branch you've already pushed. This branch has no copy on GitHub until you push it.

## Review and lessons

**ce-code-review:** not run. This task changes docs and agent instructions only, and CLAUDE.md runs it "for code changes".

**code-reviewer, first pass** (fresh process; `git status --short`, `git log -1 --oneline` and `git show-ref --heads` matched before and after). Verdict: **Needs changes**, two must fixes and two suggestions, all fixed:

| What it found | Fix |
| --- | --- |
| Step 9's only remedy for missing commits was a second PR. After a squash or rebase merge, that would add the whole task again under new IDs, and the pull wouldn't even fast-forward. | Step 9 now says: if the pull won't fast-forward, stop and tell the owner. A second PR only after a real merge commit (`8fb205e`) |
| The lesson I edited still said "six" Merge steps (it's eight) and called the GitHub question "now open" | Both reworded (`b6a11a4`) |
| Step 1 read task.md before pulling, so it couldn't see the task that was just merged, and it didn't say what to do if that PR isn't merged yet | Pull first, then check; if not merged, ask the owner (`8fb205e`, `bbb1210`) |
| This doc said `--no-ff` was in files that never had it, and quoted a rule that exists nowhere | Reworded |

**code-reviewer, second pass** (snapshots matched). Verdict: **Needs changes**, two must fixes and two suggestions, all done:

| What it found | Fix |
| --- | --- |
| Step 1's pull had no instruction for when it fails. After a squash, that's where a session would break first, so it would skip the merged task and branch from an old `main`. | Step 1 says: if the pull won't fast-forward, stop and tell the owner |
| `gh` is now needed at every task's start, but the readme didn't list it and this doc didn't explain it | A Prerequisites row (`gh auth status`) and a "New ideas" entry |
| The leftover-rules search was case-sensitive, so it couldn't find "**Open** decision" | Added `-i`, and showed it finds the paragraph on `main` |
| Where the "mark done" commit goes (assumption A1) is the owner's call | **The owner confirmed A1:** the commit stays on local `main`, and the next PR carries it |

**Lesson from pass 2:** when you add a failure rule, add it at every place that runs the command. And run a new check once against the "before" version, to watch it catch the problem.

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
