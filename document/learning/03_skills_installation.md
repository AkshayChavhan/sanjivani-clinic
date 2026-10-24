# 03_skills_installation: 16 UI skills, checked before installing

> **Branch:** 03_skills_installation · **Date:** 2026-10-24 · **Status:** In progress

## In one minute

- We installed 16 Claude Code **skills** for UI work: design direction, components (shadcn, 21st.dev), animation (GSAP) and review.
- **Before** installing, we read every file in every skill and searched for anything dangerous. Nothing was unsafe.
- After installing, we proved the installed files are byte-for-byte the files we read.
- We wrote [document/skills/skills.md](../skills/skills.md), the guide to all 16, and added a short "Skills" section to `CLAUDE.md`.

## Why: the problem we solved

Claude knows a lot, but not the latest rules of every library. A skill is a folder of expert instructions Claude loads only when needed, for example "how to use GSAP inside React".

But a skill is someone else's text, and Claude follows it with your permissions. A bad skill could tell Claude to delete files or send your code somewhere. That's why we **vet** (check) each skill before installing it, the same way you'd read a script before running it.

## What: what changed

| File or folder | Change | Why it exists |
| --- | --- | --- |
| `.claude/skills/` (16 folders) | Added | The skills themselves. Third-party files that we never edit. |
| `skills-lock.json` | Added | Records each skill's source and a content hash |
| `document/skills/skills.md` | Added | What each skill is for, how they work together, how to manage them, and the vetting record |
| `CLAUDE.md` | Changed | New "Skills" section: the order for UI work and the safety rules |
| `readme.md` | Changed | Repo map rows and the 21st.dev login note |
| `document/task/task.md` | Changed | Task 03 status and steps |

## How: step by step

1. **Vet the five sources.** We cloned each source repo into a scratch folder **outside** this repo, with five helper agents working in parallel. Each one read every `SKILL.md` and script, searched for risky patterns (`curl`, `rm -rf`, `~/.ssh`, "ignore previous instructions" and more), and **ran nothing**. All 16 came back "safe" or "safe with notes". The notes are listed in the guide's vetting record. The two most important:
   - The shadcn skill pre-approves every `npx shadcn@latest` command, so Claude won't ask before running them.
   - The 21st skills can spend paid AI credits.

2. **Deal with a surprise: the installer needs a newer Node.** `npm view skills name version description repository.url bin engines` printed `version = '1.7.4'` and `engines = { node: '>=22.20.0' }`. So the latest installer needs Node 22.20 or newer, and this machine has Node 20.20.2. We listed the older releases:

   ```bash
   npm view 'skills@>=1.5.0 <1.6.0' engines
   ```

   That showed `skills@1.5.18 { node: '>=18' }` as the last one that runs on Node 20, and `1.5.19` already needs `>=22.20.0`. Its `--help` lists every flag we need, so we **pinned** it: we used that exact version instead of "latest".

3. **Deal with a second surprise: the installer sends usage data.** Reading its code (not running it) showed it sends install events to Vercel unless `DISABLE_TELEMETRY` or `DO_NOT_TRACK` is set. So every command starts with `DISABLE_TELEMETRY=1`.

4. **Install, one source per commit.** For example:

   ```bash
   DISABLE_TELEMETRY=1 npx -y skills@1.5.18 add greensock/gsap-skills --agent claude-code --skill '*' --copy -y
   ```

   - `DISABLE_TELEMETRY=1`: an environment variable set only for this one command, which turns usage reports off.
   - `npx -y skills@1.5.18`: download and run that exact version once, without installing it globally. `-y` skips npx's "download it?" question.
   - `add greensock/gsap-skills`: the GitHub repo to install from.
   - `--agent claude-code`: put the skills where Claude Code looks (`.claude/skills/`).
   - `--skill '*'`: which skills to install (`*` means all). The quotes stop the shell from expanding `*`.
   - `--copy`: copy real files instead of making **symlinks** (links to files elsewhere), so git commits the actual content.
   - `-y`: no confirmation prompts.

   We left out `21st-registry` and `21st-design-sync`, because they publish to the public 21st.dev site.

5. **Prove the installed files are the checked files.**

   ```bash
   diff -rq <scratch>/vet/greensock__gsap-skills/skills/gsap-core .claude/skills/gsap-core
   ```

   - `-r`: compare whole folders.
   - `-q`: only say *whether* files differ.

   It printed nothing for all 16 skills, which means identical. `git status` showed only `.claude/skills/` and `skills-lock.json`, so the installer created nothing else.

## New ideas in this task

- **Skill:** a folder with a `SKILL.md`. Claude sees only its name and description until a request matches; then it loads the full text.
- **Project skill vs user skill:** project skills live in the repo and travel with it. User skills live on one machine.
- **Vetting:** reading third-party code or instructions before you trust them.
- **Supply chain:** everything you didn't write but run anyway (packages, skills, installers). Each link is a place where something bad could get in.
- **Pinning:** using an exact version (`skills@1.5.18`) instead of "latest", so you get exactly what you checked.
- **Telemetry:** a program reporting usage data to its makers.
- **Lock file:** `skills-lock.json` records what is installed. Ours stores a content hash but **not** the commit, so the guide lists the commits we checked.

## Check that it works

`DISABLE_TELEMETRY=1 npx -y skills@1.5.18 list` printed 16 project skills, from `21st-ai` to `ui-ux-pro-max`, each with "Agents: Claude Code". `ls -d .claude/skills/*/ | wc -l` printed `16`.

The design-system search ran:

```bash
python3 -B .claude/skills/ui-ux-pro-max/scripts/search.py "A fast, multilingual website where patients see the doctor, services and timings, and book an appointment." --design-system -p "Sanjivani Clinic"
```

(`-B` stops Python from writing `__pycache__` folders inside `.claude/skills/`.) Three lines from near the top of the real output (border lines left out):

```text
║  TARGET: Sanjivani Clinic - RECOMMENDED DESIGN SYSTEM                                   ║
├─── PATTERN ─────────────────────────────────────────────────────────────────────────────┤
│  Name: Enterprise Gateway                                                               │
```

It went on to suggest the "Accessible & Ethical" style, a blue and green palette, the **EB Garamond / Lato** fonts ("Best For: Law firms…") and a pre-delivery checklist. The fonts and the "Contact Sales" layout are a poor fit for a clinic. That's exactly why our rule says this tool gives *input*, and frontend-design makes the call.

A fresh Claude session also listed the 16 skill names when asked, from `21st-ai` to `ui-ux-pro-max`. It added a caveat that its skill list doesn't show which folder each skill comes from.

## Review and lessons

**Who reviewed it:** Claude reviewed its own work against the rules (a self-review). The code-reviewer agent arrives in task 04.

**Verdict:** ready to merge after two fixes.

| Finding | Fix |
| --- | --- |
| This doc quoted `npm view skills engines`, but the command really run asked for more fields | Showed the real command and the two lines it printed |
| It called three lines "the first lines" of the search output, but the border lines had been skipped | Reworded to "three lines from near the top (border lines left out)" |

Also checked and fine:
- Every step of the plan for this task was done.
- The two deviations are written down in skills.md and CLAUDE.md: the pinned installer version, and telemetry switched off.
- `git ls-files` contains no `node_modules`, `__pycache__`, `.env` or `dist`.
- The installer touched only `.claude/skills/` and `skills-lock.json`.
- The commits follow Conventional Commits, one per skill source.
- **A note, not fixed:** this doc is longer than two screens, because the task had two surprises worth explaining.

## Common mistakes

- **Forgetting `--copy`.** You get symlinks to files outside the repo, and nobody else gets the real skills.
- **Adding `-g`.** That installs to your user folder instead of the project.
- **Editing a skill to "fix" it.** The next update overwrites your change. Put project rules in `CLAUDE.md` instead.
- **Updating without reading.** `update` pulls new, unchecked text. Read `git diff .claude/skills` before committing.
- **Copying the `${CLAUDE_PLUGIN_ROOT}/...` path** from the ui-ux-pro-max SKILL.md. Here, run `python3 .claude/skills/ui-ux-pro-max/scripts/search.py` from the repo root.
- **Committing a 21st.dev API key.** Keep it in `.env` or use `npx @21st-dev/cli login`.

## Try it yourself

About 10 minutes, and nothing to undo, because these commands only print:

1. Run `python3 -B .claude/skills/ui-ux-pro-max/scripts/search.py "appointment booking form" --domain ux -n 3`.
2. Then run it again with `--stack astro` instead of `--domain ux`.
3. Read the results. Which advice would you use for the clinic's booking form, and which would you ignore? Write two sentences on why.

## Learn more

- [Claude Code: skills](https://code.claude.com/docs/en/skills)
- [The `skills` installer (vercel-labs/skills)](https://github.com/vercel-labs/skills)
- [shadcn/ui docs](https://ui.shadcn.com/docs) and [shadcn/ui with Astro](https://ui.shadcn.com/docs/installation/astro)
- [GSAP with React](https://gsap.com/resources/React/)
- [MDN: prefers-reduced-motion](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-motion)
