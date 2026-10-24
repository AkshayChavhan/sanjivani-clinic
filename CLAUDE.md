# CLAUDE.md: rules for working in this repo

Claude reads this file at the start of every session. Follow it over your defaults.

## The project

- **Name:** Sanjivani Clinic Website
- **What it is:** a fast, multilingual website where patients see the doctor, services and timings, and book an appointment.
- **Stage:** setup only. There is no app code yet.
- **Stack (confirmed):** Astro 7 with React islands (TypeScript), Tailwind CSS v4, shadcn/ui and GSAP. The site will be hosted on Vercel later. The app needs Node 22.23.4 or newer.
- **The owner is a junior software engineer who is learning.** Every task must teach: explain why, use plain words, and explain each new term the first time it appears.

## Repo map

| Path | What it is for |
| --- | --- |
| `readme.md` | What the project is, how we work, the repo map and the prerequisites |
| `CLAUDE.md` | This file: the rules Claude follows here |
| `.gitignore` | Files git must never track |
| `document/task/task.md` | The task tracker: tasks, statuses, steps, backlog |
| `document/learning/TEMPLATE.md` | The template for learning docs |
| `document/learning/NN_name.md` | One learning doc per task |

## Task workflow

- Split a big request into small tasks (each one reviewable in about 15 minutes), and show the owner the plan before starting.
- Do one task at a time. Unrelated work goes to the backlog in `document/task/task.md`.
- A task's name, its branch and its learning doc's file name are the same: `NN_short_name`.

Every task runs these steps:

1. **Branch:** `git switch main`, then `git switch -c NN_short_name`.
2. **Tracker:** set the task's row in `document/task/task.md` to `In progress`. Tick a step only after it's done.
3. **Commits:** small Conventional Commits (`chore:`, `docs:`, `feat:`, `fix:`; add a scope when it helps, like `docs(03):`). Put code, docs and tracker changes in separate commits.
4. **Learning doc:** write `document/learning/NN_short_name.md` from `document/learning/TEMPLATE.md`. Its header says `In progress` until the merge.
5. **Review:**
   - Tasks 01 to 03: the reviewer agent doesn't exist yet. Review the work yourself against these rules, and say so in the learning doc.
   - From task 04 on: run the code-reviewer agent in a fresh process. (A running session only sees agents that existed when it started.)

     ```bash
     claude -p "Review the current branch (NN_short_name) against main, following your instructions." --agent code-reviewer --allowedTools "Read" "Glob" "Grep" "Bash(git *)" "Bash(ls *)" "Bash(grep *)" "Bash(cat *)" "Bash(head *)" "Bash(wc *)" "Bash(find *)" "Bash(test *)" "Bash(npm run *)"
     ```

   - Fix every "must fix". Then write the real verdict, and what you fixed, into the learning doc.
6. **Compound (from task 05 on):** ask, "If this lesson weren't written down, would a future session repeat the mistake or redo the investigation?" Review findings are the usual source of lessons. If the answer is yes, run:

   ```bash
   claude -p '/compound-engineering:ce-compound mode:non-interactive depth:lightweight <one-line lesson>' --allowedTools "Read" "Glob" "Grep" "Write" "Edit" "Bash(python3 *)" "Bash(ls *)" "Bash(git log *)" "Bash(git show *)" "Bash(mkdir *)" "Bash(cat *)"
   ```

   Read the whole file it writes before you commit it. If the answer is no, write no lesson and say why in the learning doc.
7. **Merge:** `git switch main && git merge --no-ff NN_short_name`. Then make one bookkeeping commit on main, `docs(NN): mark task NN done`: tick "Merge into main" and set `Done` in task.md and in the learning doc's header. This is the only kind of commit made directly on main. Keep the branches; don't delete them.

## Learning docs

- Every learning doc answers three questions: **Why** (the problem), **What** (what changed) and **How** (the real steps and commands).
- It also includes: new terms, how to check it works, the review result, common mistakes, a short exercise, and official links.
- Write plainly, in short sentences, and keep it to one or two screens.
- **Be honest.** Run a command before you show or describe its output, and paste what it really printed. Never write that a review, test or merge happened before it did. If something went wrong, was skipped or couldn't be run, say so.

## Git rules

- **Commit types:** `feat` (new feature), `fix` (bug fix), `docs` (documentation), `chore` (setup and tooling), `refactor` (restructure without changing behaviour), `style` (formatting only), `test` (tests).
- Keep commits small, with one idea per commit.
- **Never commit secrets.** They go in `.env`, which git ignores. Commit a `.env.example` with fake values instead.
- **Never commit generated folders** (`node_modules/`, `dist/`, `.astro/`, `.next/`, `coverage/`).
- Read third-party files (skills, plugins, scaffolds) before you commit them.
- **Ask the owner first** before you:
  - push, add a remote, or open a pull request
  - delete a branch, use `--force`, or rewrite history
  - install anything globally (`npm -g`, `brew`)
  - use anything paid
  - publish anything (21st.dev, Proof, any website)
  - send code or docs to another AI provider

## Definition of done

- [ ] The work is on its own branch, in small commits.
- [ ] It works, and it was checked.
- [ ] task.md links the learning doc, and every step is ticked except Merge.
- [ ] The learning doc answers Why, What and How.
- [ ] readme.md and CLAUDE.md are updated if the task changed how the repo works.
- [ ] No secrets and no generated folders were committed.
- [ ] The review passed, or every "must fix" is fixed.
- [ ] The compound question was asked.
- [ ] The task is merged with `--no-ff` and marked done.

## Talking to the owner

- Lead with the result, then the details.
- Ask when the choice belongs to the owner: the stack, product direction, anything paid or public. Otherwise pick a sensible default and say which one you picked.
