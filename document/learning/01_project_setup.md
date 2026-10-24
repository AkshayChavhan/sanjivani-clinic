# 01_project_setup: Git repo, readme, .gitignore and task tracker

> **Branch:** 01_project_setup · **Date:** 2026-10-24 · **Status:** In progress

## In one minute

- We set up the git repository and made the first commit.
- We added a `.gitignore`, so secrets and generated files never get committed.
- We added a task tracker (`document/task/task.md`) and a template for learning docs like this one.
- From now on, every piece of work is a numbered task on its own branch, merged into `main` with `--no-ff`.

## Why: the problem we solved

An empty folder gives you no way to track changes, undo mistakes or see why something was done. Git records every change. The tracker and learning docs record *why*, so future you (and Claude) can follow along.

## What: what changed

| File or folder | Change | Why it exists |
| --- | --- | --- |
| `readme.md` | Changed (it was empty) | The front page: what the project is, how we work, a repo map and the prerequisites |
| `.gitignore` | Added | Tells git which files it must never track |
| `document/task/task.md` | Added | The list of tasks, their status and their steps |
| `document/learning/TEMPLATE.md` | Added | The starting point for every learning doc. It has one extra section beyond the planned list, "Review and lessons", because each task must record its review verdict somewhere. |
| `document/learning/01_project_setup.md` | Added | This file |

## How: step by step

1. **Start the repository**

   ```bash
   git init -b main
   ```

   - `init` creates a **repository**: a hidden `.git` folder that stores every version of every file.
   - `-b main` names the first branch `main`.

   Real output:

   ```text
   warning: re-init: ignored --initial-branch=main
   Reinitialized existing Git repository in /Users/rtlecl910010/Desktop/Projects/Project/sanjivani-clinic/.git/
   ```

   The folder already had a `.git` folder, linked to GitHub, so git *re-initialized* it. That is safe: it deletes no commits or files. It ignored `-b main` because the branch was already called `main`.

2. **Make the first commit**

   ```bash
   : > readme.md          # create an empty file (":" is a shell command that does nothing)
   git add readme.md      # stage it: put it in the next commit
   git commit -m "chore: initial commit"
   ```

   - A **commit** is a saved snapshot of your files, with a message.
   - `-m` gives the message on the command line.
   - We need a commit before branching, because a branch is just a name that points at a commit.

   **What really happened:** a few minutes earlier the owner had already made a first commit, `f1f6c4a Initial commit`, containing the line `# Sanjivani Clinic Website`, and pushed it to GitHub. So our `chore: initial commit` (`9756ec8`) became the *second* commit, and emptying the file removed that line. We kept both commits instead of rewriting history, because rewriting history is on the ask-first list. The heading is back in the new readme.

3. **Create the task branch**

   ```bash
   git switch -c 01_project_setup
   ```

   Real output: `Switched to a new branch '01_project_setup'`

   - `switch` moves you to a branch. `-c` creates it first.

4. **Add the files in small commits.** Code, docs and tracker changes go in separate commits. The messages follow **Conventional Commits** (a `type:` prefix such as `chore:` or `docs:`). Real `git log --oneline main..HEAD`, taken before this doc was committed:

   ```text
   959af9d docs(01): add learning-doc template
   355137e docs: write readme with how we work, repo map and prerequisites
   3932726 chore: add .gitignore
   2acbf32 docs(01): add task tracker with task 01 in progress
   ```

5. **Merge into main (the last step of the task)**

   ```bash
   git switch main && git merge --no-ff 01_project_setup
   ```

   - `--no-ff` means "no fast-forward": always create a merge commit, even when git could simply move `main` forward. The merge commit marks where the task ends, so `git log --graph` shows each task as its own bump in the history.

## New ideas in this task

- **Repository:** the `.git` folder holding the full history of the project.
- **Commit:** one saved snapshot, with a message and an ID like `9756ec8`.
- **Branch:** a movable name for a line of commits. `main` is the shared one, and each task gets its own.
- **Remote / origin:** a copy of the repo somewhere else. `origin` points to GitHub here. We never push to it without asking.
- **.gitignore:** a list of patterns (`.env`, `node_modules/`). Matching files are left out of git.
- **`!` in .gitignore:** an exception. `.env.*` ignores every `.env.something` file, then `!.env.example` brings that one file back.
- **Fast-forward:** when `main` has no new commits, git can merge by just moving the `main` label forward. `--no-ff` prevents that.

## Check that it works

```bash
git check-ignore -v .env
```

Real output: `.gitignore:16:.env	.env`. This means line 16 (`.env`) matches, so `.env` is **ignored**.

```bash
git check-ignore -v .env.example
```

Real output: `.gitignore:18:!.env.example	.env.example`. **Careful:** it still prints a line and exits with 0, but the rule starts with `!`, so `.env.example` is **NOT** ignored. Without `-v`, git prints nothing and exits with 1 ("not ignored"). We confirmed this with real files:

```text
$ git status --short --ignored
?? .env.example        <- untracked: git would commit it
!! .env                <- ignored: git will never commit it
```

## Review and lessons

Self-review: pending. This section is filled in after the review.

## Common mistakes

- **Committing `.env` before `.gitignore` exists.** Once a file is tracked, `.gitignore` no longer hides it. Fix: `git rm --cached .env`, commit, and change the leaked key.
- **Misreading `check-ignore -v`.** A printed line that starts with `!` means "not ignored".
- **Working on `main` by accident.** Run `git branch --show-current` before you commit.
- **Forgetting `--no-ff`.** The history becomes one straight line, and you can no longer see where a task began.
- **Expecting `README.md` and `readme.md` to be two files on macOS.** The disk ignores letter case, so they are the same file.

## Try it yourself

About 10 minutes, in a throwaway folder outside this repo:

1. `mkdir ~/git-practice && cd ~/git-practice && git init -b main`
2. Create `.gitignore` with two lines, `.env*` and `!.env.example`. Then create the files `.env`, `.env.example` and `notes.txt`.
3. Run `git status --short --ignored` and predict which files show `!!` before you look.
4. Commit everything, then `git switch -c 01_try`, change `notes.txt`, and commit again.
5. `git switch main && git merge --no-ff 01_try`, then `git log --oneline --graph`. Can you see the merge commit?
6. Undo: delete the `~/git-practice` folder.

## Learn more

- [git init](https://git-scm.com/docs/git-init), [git switch](https://git-scm.com/docs/git-switch), [git merge (`--no-ff`)](https://git-scm.com/docs/git-merge)
- [gitignore patterns](https://git-scm.com/docs/gitignore) and [git check-ignore](https://git-scm.com/docs/git-check-ignore)
- [Pro Git: Branches in a Nutshell](https://git-scm.com/book/en/v2/Git-Branching-Branches-in-a-Nutshell)
- [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/)
