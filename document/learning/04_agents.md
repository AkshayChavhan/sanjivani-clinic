# 04_agents: four project subagents

> **Branch:** 04_agents · **Date:** 2026-10-24 · **Status:** In progress

## In one minute

- We added four **subagents** in `.claude/agents/`: task-planner, ui-engineer, learning-doc-writer and code-reviewer.
- Each one is a Markdown file: settings at the top, then its job description.
- The main session keeps control of git. Subagents do one job and report back.
- From now on, every task is reviewed by code-reviewer before it is merged. This task is its first real review.

## Why: the problem we solved

One long session doing everything gets cluttered, and it is bad at checking its own work. A subagent starts with a fresh, focused context and one clear job. A reviewer that didn't write the code is more likely to spot its mistakes. Tasks 01 to 03 could only be self-reviewed; from here on, they get a second pair of eyes.

## What: what changed

| File or folder | Change | Why it exists |
| --- | --- | --- |
| `.claude/agents/task-planner.md` | Added | Splits big work into small numbered tasks in task.md |
| `.claude/agents/ui-engineer.md` | Added | Builds UI with the installed skills |
| `.claude/agents/learning-doc-writer.md` | Added | Writes a task's learning doc from the real git history |
| `.claude/agents/code-reviewer.md` | Added | Reviews a branch before merge and explains each finding |
| `CLAUDE.md` | Changed | New "Agents" section: when to use each one, and who owns git |
| `readme.md` | Changed | Repo map row for `.claude/agents/` |
| `document/task/task.md` | Changed | Task 04 status and steps. Task 06's "Update the docs" and "Write the learning doc" steps also moved before its review, so they're done when code-reviewer checks them. |

## How: step by step

1. **Check the current file format** in the official docs before writing anything. They confirmed the fields we use:
   - `tools`: a comma-separated list. If you leave it out, the agent gets every tool.
   - `model: inherit`: use the same model as the main session.
   - `color`: one of red, blue, green, yellow, purple, orange, pink or cyan.
   - `skills`: a YAML list of skills whose full text is loaded when the agent starts.
2. **Write the four files.** Each starts with frontmatter, for example:

   ```yaml
   ---
   name: code-reviewer
   description: Reviews a task branch before it is merged. ...
   tools: Read, Glob, Grep, Bash
   model: inherit
   color: orange
   ---
   ```

   Then come the instructions: read `CLAUDE.md` first, the steps, the limits (read-only git: the main session makes every change), and a "What to return" list. The `description` matters most, because the main session uses it to decide when to call the agent.
3. **Check they load, in a fresh process.** A running session only knows the agents that existed when it started, so we asked a new one:

   ```bash
   claude -p "Without using any tools, list the names of the custom subagent types defined in this project's .claude/agents folder that appear in your Agent tool's list of available agent types. Reply with just the names, one per line." --model haiku --max-turns 1
   ```

## New ideas in this task

- **Context window:** everything the model can "see" at once: the instructions, the conversation and the files it has read.
- **Subagent:** a helper Claude with its own context window, tools and instructions. It returns a report to the main session.
- **YAML:** a simple text format for settings, one `key: value` per line, and lists written with `- item`.
- **Frontmatter:** the block between the two `---` lines at the top of the file, holding settings in YAML.
- **Tool allow-list (`tools`):** which tools an agent may use. Leaving it out means all tools.
- **Preloaded skills (`skills`):** ui-engineer starts with frontend-design, ui-ux-pro-max, shadcn and gsap-react already loaded, so it doesn't have to discover them.
- **Separation of duties:** the main session owns git; each agent owns one job.

## Decisions worth knowing

- **Removing Edit and Write does not make an agent read-only.** code-reviewer has no Edit or Write tool, but it has Bash, and Bash can still change files (`echo "x" > file`) or run `git commit`. Even our review command's `--allowedTools "Bash(git *)"` allows `git commit`, because `git *` matches every git command. **The reviewer stays read-only because its instructions say so**, not because anything technically stops it. That's why the review's results are checked with `git status` afterwards.
- **The reviewer accepts an open Compound step from task 05 on.** Compound comes after the review in our workflow, so it can't be ticked yet when the review runs.

## Check that it works

Real output of the load check:

```text
code-reviewer
learning-doc-writer
task-planner
ui-engineer
```

All four are found. This session started before the agents existed, so it can't call them directly; the review below runs code-reviewer in a fresh process.

## Review and lessons

**Who reviewed it:** the code-reviewer agent, in a fresh process (`claude -p ... --agent code-reviewer`). It is the agent's first real review, and it ran twice.

**First pass, verdict "Needs changes":** one must fix and five suggestions. We fixed all six:

| Finding | Label | Fix (commit) |
| --- | --- | --- |
| task-planner left out the Compound step, and its "3 to 8 steps" limit couldn't be met | must fix | Added Compound; now "5 to 8 steps, split if more" (`e187586`) |
| The agents listed different forbidden git commands, and ui-engineer was told to wait for the owner's OK, which it can't ask for | suggestion | One read-only git rule; ask-first items become open questions (`24edc2f`) |
| The `git status` safety check was only in this doc, not in the workflow | suggestion | Added to CLAUDE.md step 5 (`c60d0a5`) |
| Task 06 listed its review before its learning doc | suggestion | Reordered task 06's steps (`1fc9b07`) |
| "YAML" and "context window" were never explained, and the exercise said "four steps" | suggestion | Added both terms; the exercise now says five (`edcf7db`) |

**Second pass, verdict "Ready to merge":** no must fix, five suggestions. We applied three:

- The check now compares `git status --short`, `git log -1 --oneline` and `git show-ref --heads` before and after (`08c54eb`).
- All agents share one read-only git list, and ui-engineer's ask-first list now says "for example" and includes `search.py --force` (`2e35b2e`).
- This doc's wording and its What table are fixed.

We didn't narrow the review command's `--allowedTools`. The command comes from the owner's setup plan, so changing it is the owner's call.

**Something unexpected during the second pass:** the reviewer noticed `git status` changing while it ran. We checked: branches 01 to 04 had been pushed to GitHub from this machine at 00:04, apparently through VS Code's git buttons, and PRs #1 and #2 were merged on GitHub. None of that came from Claude or the reviewer. It's also exactly the false alarm the improved check now avoids, because a push doesn't change `git show-ref --heads`.

## Common mistakes

- **Expecting a new agent to appear in the current session.** Start a new session, or run it with `claude -p ... --agent <name>`.
- **A vague `description`.** Then Claude never picks the agent. Say what it does *and* when to use it.
- **Giving a planner or reviewer git powers.** Keep git in one place, the main session, so nothing commits behind your back.
- **Trusting `tools` alone for safety.** Bash can do almost anything. Write the limits into the instructions too, and check `git status` after the agent runs.

## Try it yourself

About 10 minutes:

1. Run `claude -p "Plan a task to add a FAQ page. Don't edit any files; just show me the plan." --agent task-planner --max-turns 5`.
2. Check that the plan has a `NN_short_name`, 5 to 8 steps, and the five steps every task needs (Create branch, Write the learning doc, Review, Compound, Merge).
3. Run `git status`. If anything changed, undo it with `git restore document/task/task.md`.

## Learn more

- [Claude Code: subagents](https://code.claude.com/docs/en/sub-agents)
- [Claude Code: CLI reference (`--agent`, `-p`)](https://code.claude.com/docs/en/cli-reference)
