# 05_compound_engineering: the Compound Engineering plugin, pinned and configured

> **Branch:** 05_compound_engineering · **Date:** 2026-10-25 · **Status:** In progress

## In one minute

- We installed the **Compound Engineering plugin** (36 `ce-*` workflow skills) for this project only, **pinned** to one checked version.
- Every task now follows a loop: **plan, work, review, compound**. "Compound" means saving a short reusable lesson in `document/solutions/`.
- A small config file turns off the risky parts: sending code to other AI companies, outside coding tools, and automatic PR watching.
- `CLAUDE.md` now has rules that override the plugin: it never pushes, opens PRs or merges, and only the private "lightweight" compound mode is used.

## Why: the problem we solved

Without a habit of writing lessons down, every session starts from zero and can repeat the same mistake. The plugin brings ready-made skills for planning, reviewing and capturing lessons.

But the plugin can do much more than we want: push code, open PRs, send code to other AI models, and read your session history. So we pinned it, checked it, and fenced it in with config and rules.

## What: what changed

| File or folder | Change | Why it exists |
| --- | --- | --- |
| `.claude/settings.json` | Added | Tells Claude Code which plugin to use, at which tag, for this project |
| `.compound-engineering/config.yaml` | Added | Our 4 settings, each with a comment saying what it really does |
| `.compound-engineering/config.example.yaml` | Added | The plugin's full template, every setting explained (an exact copy) |
| `.gitignore` | Changed | Ignores personal config, scratch files and worktrees |
| `CLAUDE.md` | Changed | The plan, work, review, compound workflow; the Compound Engineering section; the override rules; repo map |
| `.claude/agents/` (3 files) | Changed | task-planner leaves single-task detail to ce-plan; learning-doc-writer links plans and solution docs; code-reviewer checks for a plan, for pushes and for solution docs |
| `document/skills/skills.md` | Changed | New Compound Engineering section: install, commands, what we don't use, how to update |
| `readme.md` | Changed | "How we work" and the repo map |
| `document/task/task.md` | Changed | Task 05 status and steps |

## How: step by step

1. **Check the pin.** A **tag** is a name for a commit, but someone can move a tag later, so we compared it with the commit we expected:

   ```bash
   git ls-remote https://github.com/EveryInc/compound-engineering-plugin "refs/tags/compound-engineering-v3.32.0*"
   ```

   Real output: `786ac0194183fadc3d0e2525b2ba6d40353926d3	refs/tags/compound-engineering-v3.32.0`. That's the commit we reviewed.

2. **Check the plugin before installing.** We cloned that tag into a scratch folder and looked for anything that runs on its own:
   - **What it contains:** 36 skills, and **no** hooks, MCP servers, agents or commands. No skill runs a command when it loads.
   - **Skills that pre-approve tools:** four of them, including `ce-resolve-pr-feedback` (`gh`, `git`, `bash`) and `ce-proof` (Bash, WebFetch). We don't use them.
   - **The health-check script:** it would download packages only with a `--warm-acpx` flag, which we don't pass.

3. **Install it for this project only.**

   ```bash
   claude plugin marketplace add "EveryInc/compound-engineering-plugin#compound-engineering-v3.32.0" --scope project
   claude plugin install compound-engineering@compound-engineering-plugin --scope project
   ```

   - A **marketplace** is a list of plugins, here a GitHub repo.
   - `#compound-engineering-v3.32.0` picks the tag.
   - `--scope project` writes the choice into the repo's `.claude/settings.json`, so every clone gets the same version.

   Real output of the second command: `✔ Successfully installed plugin: compound-engineering@compound-engineering-plugin (scope: project)`. The only file it changed in the repo was `.claude/settings.json`.

4. **Configure it.** We wrote `.compound-engineering/config.yaml` with our four settings, copied the plugin's template as `config.example.yaml`, and added three `.gitignore` lines.

5. **Write the rules into `CLAUDE.md`.** The config switches only cover some paths. For example, `lfg` runs its own PR watching even with `auto_babysit: false`. So `CLAUDE.md` says plainly:
   - commit on the task branch, then stop: no push, PR or merge
   - no other AI vendors
   - only the lightweight compound command
   - no publishing
   - check the pin

## New ideas in this task

- **Plugin:** a package of skills (and sometimes hooks, agents or servers) that Claude Code installs and keeps outside the repo. The repo stores only which plugin and version to use.
- **Pinning to a tag *and* a commit:** the tag is a friendly name; the commit ID is the real identity. We check both.
- **Solution doc vs learning doc:** a learning doc teaches a *person* one task. A solution doc is a short lesson for *future sessions*: the problem, the cause and the fix.
- **The counterfactual question:** "If this lesson weren't written down, would a future session repeat the mistake or redo the investigation?" Only a "yes" earns a solution doc.
- **Cross-model review:** asking a different AI company's model to review your code. It's useful, but it sends your code to them, so it's off here.

## Decisions worth knowing

- **Override rules instead of trusting switches.** The plugin's own docs say some switches don't cover every path, so the real protection is written rules in `CLAUDE.md`.
- **Optional tools stay uninstalled.** The health check suggests agent-browser, ast-grep, ffmpeg and a newer Node. All are global installs, which are on the ask-first list.
- **task-planner already had the Compound step.** The plan was to add it in this task, but task 04's review asked for it early.
- **No ce-plan plan for this task.** This task *installs* ce-plan, and a plugin only loads when a session starts. So the "bigger tasks need a plan" rule starts with task 06.
- **`main` and GitHub have split, and that's the owner's decision.** Branches 01 to 04 were pushed, and PRs #1 to #3 merged, from the owner's account on GitHub. So GitHub's `main` has three merge commits that local `main` lacks, and local `main` has the bookkeeping commits GitHub lacks. Claude first wrote a "sync with GitHub" step into task 06. The review showed it broke the "only bookkeeping commits on main" rule, so it's now an open decision in the backlog instead.

## Check that it works

`claude plugin list` (real output):

```text
  ❯ compound-engineering@compound-engineering-plugin
    Version: 3.32.0
    Scope: project
    Status: ✔ enabled
    Note: The packages it lists were not installed, because it needs bun, which is not installed on this computer
```

The bun note is expected and harmless: bun is only needed to develop the plugin. `~/.claude/plugins/installed_plugins.json` records `gitCommitSha: 786ac0194183fadc3d0e2525b2ba6d40353926d3` for this project. That file lists every project that installed the plugin; we read only this project's entry.

The "Project config" part of the health check (`bash ~/.claude/plugins/cache/compound-engineering-plugin/compound-engineering/3.32.0/skills/ce-setup/scripts/check-health --version 3.32.0`), real output:

```text
 Project config
  🟢  No obsolete compound-engineering.local.md
  🟢  .compound-engineering/config.yaml exists
  ➖  No local override yet (.compound-engineering/config.local.yaml)
  🟢  CE scratch space is gitignored
  🟢  Artifact root: document/ (from config.yaml)
  🟢  CE Work implementation engine: native (standing preference is off)
  🟢  Example config is current
```

It ended with `✅  Project config healthy. Optional capabilities available: 2/6`.

## Review and lessons

**Who reviewed it:** the code-reviewer agent, in a fresh process. Before and after, we saved `git status --short`, `git log -1 --oneline` and `git show-ref --heads`; they matched, so the reviewer changed nothing.

**Verdict: "Needs changes"**, with one must fix and four suggestions:

| Finding | Label | What we did |
| --- | --- | --- |
| The "sync with GitHub" step added to task 06 would make a non-bookkeeping commit on `main`. It came after the merge step, and its PR count was already out of date. | must fix | Removed it from task 06; it's now an open owner decision in the backlog (`8cb3a9f`) |
| No plan for a 12-file task, and no reason given | suggestion | Explained under "Decisions worth knowing" |
| `grep ... document/solutions/` errors (exit 2) while the folder doesn't exist | suggestion | Noted in CLAUDE.md and the repo maps (`740b69e`) |
| One commit held two ideas (`6fc5df5`) | suggestion | Not rewritten, since that needs the owner's OK. We'll split such commits next time. |
| The vetting record didn't say that `check-health` reads `~/.codex/AGENTS.md` | suggestion | Added to skills.md (`20e2ea3`) |

**Compound:** pending. This part is filled in after the lesson is saved.

## Common mistakes

- **Installing without `--scope project`.** The plugin then lives only in your user settings, and the repo doesn't record it.
- **Trusting the tag alone.** A tag can be moved. Compare the commit ID too.
- **Running plain `/ce-compound`.** Full mode scans your session history in the home folder. Use the lightweight command from `CLAUDE.md`.
- **Accepting a skill's "next step" offer** to push or open a PR. Our workflow stops at a commit on the task branch.
- **Installing the optional tools to make the health check green.** They're global installs; ask first.

## Try it yourself

About 5 minutes, and it changes nothing:

1. Run the `git ls-remote` command from step 1. Does it still print `786ac01...`?
2. Run the health check command, and find the "Project config" section.
3. Open `.compound-engineering/config.example.yaml` and find one setting we didn't set. Write one sentence on what it does.

## Learn more

- [Claude Code: plugins](https://code.claude.com/docs/en/plugins) and [plugin marketplaces](https://code.claude.com/docs/en/plugin-marketplaces)
- [Claude Code: settings (`.claude/settings.json`)](https://code.claude.com/docs/en/settings)
- [Compound Engineering plugin](https://github.com/EveryInc/compound-engineering-plugin) and [the v3.32.0 release](https://github.com/EveryInc/compound-engineering-plugin/releases/tag/compound-engineering-v3.32.0)
