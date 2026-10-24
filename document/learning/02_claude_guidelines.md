# 02_claude_guidelines: CLAUDE.md, the rules Claude follows here

> **Branch:** 02_claude_guidelines · **Date:** 2026-10-24 · **Status:** Done

## In one minute

- We wrote `CLAUDE.md`, a file Claude Code reads automatically at the start of every session.
- It holds the project facts, the task workflow, the git rules, the definition of done and how to talk to the owner.
- Now every new session follows the same rules, without anyone repeating them.
- Tasks 03 to 06 will each add their own section (skills, agents, the plugin, the app commands).

## Why: the problem we solved

Every Claude session starts with no memory of earlier ones. Without written rules, each session might branch differently, commit secrets or forget the learning docs. `CLAUDE.md` is the project's shared memory: it is checked into git, so everyone (and every session) gets the same rules.

## What: what changed

| File or folder | Change | Why it exists |
| --- | --- | --- |
| `CLAUDE.md` | Added | The rules Claude follows in this repo |
| `readme.md` | Changed | Links to CLAUDE.md and adds it to the repo map |
| `document/task/task.md` | Changed | Task 02 status and ticked steps |
| `document/learning/02_claude_guidelines.md` | Added | This file |

## How: step by step

1. **Create the branch** from main: `git switch main`, then `git switch -c 02_claude_guidelines`.
2. **Write `CLAUDE.md` at the repo root.** Claude Code looks for it there when a session starts. Its sections:
   - **The project:** name, description, stage, stack, and the fact that the owner is learning.
   - **Repo map:** what each path is for.
   - **Task workflow:** the 7 steps every task follows (branch, tracker, commits, learning doc, review, compound, merge).
   - **Learning docs:** Why, What and How, written plainly and honestly.
   - **Git rules:** commit types, no secrets, no generated folders, and the "ask the owner first" list.
   - **Definition of done:** a checklist that must be true before a task counts as finished.
   - **Talking to the owner:** lead with the result; ask only when the choice is the owner's.
3. **Only write what applies now.** Rules for skills, agents and the plugin don't exist yet. Their tasks add those sections, so this file never describes tools that aren't installed.
4. **Link it from `readme.md`**, so humans can find it too.

## New ideas in this task

- **CLAUDE.md:** a "memory" file. Claude Code loads it into the session automatically, so its rules apply from the first message.
- **Project memory vs personal memory:** `CLAUDE.md` is committed and shared. Personal notes (`CLAUDE.local.md`) and personal settings (`.claude/settings.local.json`) stay on one machine. Our `.gitignore` already ignores both.
- **Definition of done:** a checklist that turns "I think it's finished" into "these 9 things are true".
- **Conventional Commits types:** `feat`, `fix`, `docs`, `chore`, `refactor`, `style`, `test`. The type tells a reader what kind of change it is before they open it.
- **Print mode (`claude -p`):** runs Claude Code once, prints the answer and exits. We use it to test the rules in a *fresh* session.

## Check that it works

We asked a brand-new session a question only CLAUDE.md can answer:

```bash
claude -p "Without using any tools: according to the project instructions you were given, what is this project's stage, and what is the only kind of commit made directly on main? Answer in two short lines." --model haiku --max-turns 1
```

- `-p "..."`: print mode. Run this one prompt, print the answer, exit.
- `--model haiku`: use a small, fast model. It's enough for a simple check.
- `--max-turns 1`: stop after one reply, so it can't wander off.

Real output:

```text
Stage: setup only, with no app code yet.
The only commit made directly on main is the bookkeeping commit `docs(NN): mark task NN done`.
```

Both answers come straight from `CLAUDE.md`, so the file is loaded.

## Review and lessons

**Who reviewed it:** Claude reviewed its own work against the rules (a self-review). The code-reviewer agent arrives in task 04.

**Verdict:** ready to merge after one fix.

| Finding | Fix |
| --- | --- |
| Both Claude Code links pointed at old `docs.anthropic.com` addresses, which now redirect (HTTP 301) | Switched them to the current `code.claude.com` addresses, which answer HTTP 200 |

Also checked and fine:
- `CLAUDE.md` has every part the plan asked for: project, repo map, workflow, learning docs, git rules, definition of done (9 items) and talking to the owner.
- The `CLAUDE.local.md` claim matches the official memory page, which describes it as "Personal project-specific preferences; add to `.gitignore`".
- The commits are small and in Conventional Commits form.

## Common mistakes

- **Putting the file in the wrong place.** It must be at the repo root, named exactly `CLAUDE.md`.
- **Making it too long.** It is loaded into every session, so every line costs attention. Keep rules short, and move long explanations into `document/`.
- **Describing tools that aren't installed yet.** Claude may try to use them. Add each section in the task that installs the tool.
- **Writing secrets or personal paths into it.** It is committed, so anyone with the repo can read it.

## Try it yourself

About 5 minutes:

1. Run the same `claude -p` check, but ask: "What must you ask the owner before doing?"
2. Compare the answer with the "Ask the owner first" list in `CLAUDE.md`. Did it list them all?
3. Nothing to undo: print mode changes no files.

## Learn more

- [Claude Code: memory (CLAUDE.md)](https://code.claude.com/docs/en/memory)
- [Claude Code: CLI reference (`-p`, `--model`, `--max-turns`)](https://code.claude.com/docs/en/cli-reference)
- [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/)
