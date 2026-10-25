# Sanjivani Clinic Website

A fast, multilingual website where patients see the doctor, services and timings, and book an appointment.

> **Stage:** setup only. There is no app code yet.

## How we work

We build this project in small, numbered **tasks**. The full list is in [document/task/task.md](document/task/task.md).

1. Every task has a number and a short name, like `01_project_setup`.
2. Every task gets its own **branch** (a separate line of work in git) with the same name.
3. When a task is finished, it is merged into `main` with `git merge --no-ff`. That way the history shows where each task starts and ends.
4. Every task gets one **learning doc** in [document/learning/](document/learning/). It explains why we did the task, what changed and how we did it.
5. Inside each task we follow the **Compound Engineering** loop: **plan** (bigger tasks get a written plan in `document/plans/`), **work**, **review** (an automatic code review, then the code-reviewer agent), and **compound** (save a reusable lesson in `document/solutions/` if it would stop a future mistake).

The rules Claude follows in this repo (the workflow, git rules and definition of done) are in [CLAUDE.md](CLAUDE.md).

## Repo map

| Path | What it is |
| --- | --- |
| `readme.md` | This file: what the project is and how we work |
| `CLAUDE.md` | The rules Claude reads at the start of every session |
| `.gitignore` | The list of files git must never track: dependencies, build output, secrets |
| `document/task/task.md` | The task tracker: every task, its status and its steps |
| `document/learning/TEMPLATE.md` | The template every learning doc starts from |
| `document/learning/NN_name.md` | One learning doc per task, for example `01_project_setup.md` |
| `document/skills/skills.md` | The skills guide: the 16 UI skills, how they work together, how to manage them |
| `.claude/skills/` | The 16 Claude Code skills installed for this project (third-party files; never edit them) |
| `skills-lock.json` | Which skills are installed and where they came from |
| `.claude/agents/` | 4 project subagents: task-planner, ui-engineer, learning-doc-writer, code-reviewer (see the Agents section in CLAUDE.md) |
| `.claude/settings.json` | Project settings for Claude Code: the pinned Compound Engineering plugin |
| `.compound-engineering/` | Compound Engineering config (`config.yaml`) and the plugin's full template (`config.example.yaml`) |
| `document/plans/` | Plans for single tasks, written by ce-plan (the folder appears with the first plan) |
| `document/solutions/` | Solution docs: short lessons for future sessions, written by ce-compound (the folder appears with the first lesson) |

## Prerequisites

| Tool | Version | Check it with |
| --- | --- | --- |
| Git | any recent version | `git --version` |
| Node.js | 22.23.4 or newer (Astro 7 needs it) | `node -v` |
| npm | comes with Node.js | `npm -v` |
| Python | 3 | `python3 --version` |
| Claude Code | latest | `claude --version` |

- The app (task 06 on) needs Node 22.23.4 or newer. The setup tasks were started on Node 20.20.2, so upgrade before task 06 (Node 24 LTS is a good choice).
- The first time you open this repo in Claude Code, it asks whether you **trust this folder**. Accept, so Claude Code can use this project's settings.
- Optional: a free [21st.dev](https://21st.dev) account for the 21st.dev skills. Log in with `npx @21st-dev/cli login`. Your login stays on your machine, never in the repo. See [document/skills/skills.md](document/skills/skills.md).
- The skills were installed with `npx -y skills@1.5.18` (no global install). That version runs on Node 20; newer versions need Node 22.20 or newer.
