# Skills guide

This project has 16 Claude Code **skills** for UI work. This guide explains what a skill is, what each one is for, how they work together, and how to manage them.

It also has the **Compound Engineering plugin**, which adds 36 workflow skills (34 named `ce-*`, plus `lfg` and `wtf`) for planning, building, reviewing and saving lessons. See [Compound Engineering](#compound-engineering) at the end.

## What a skill is

- A **skill** is a folder with a `SKILL.md` file inside. The top of that file (the *frontmatter*) has a `name` and a `description`. The rest is instructions, sometimes with extra files and scripts.
- At the start of a session, Claude sees only each skill's name and description. It loads the full text **only when your request matches** the description. So 16 skills don't fill up Claude's memory.
- You can also call a skill yourself by typing `/name`, for example `/frontend-design`.
- **Project skills** live in the repo (`.claude/skills/`), are committed to git, and work for everyone who clones the repo. **User skills** live in `~/.claude/skills/` on one machine only. We use project skills only.

## All 16 skills

| Skill | Source | Use it for |
| --- | --- | --- |
| frontend-design | anthropics/skills | Choosing a distinctive visual direction: palette, type, layout, then reviewing the plan |
| ui-ux-pro-max | nextlevelbuilder/ui-ux-pro-max-skill | Searchable design data (styles, palettes, fonts, UX rules, stack tips) and a pre-delivery checklist |
| shadcn | shadcn-ui/ui | Adding, searching and composing shadcn/ui components through its CLI |
| 21st-cli-use | 21st-dev/skill | Searching and installing components, themes and logos from 21st.dev |
| 21st-ai | 21st-dev/skill | 21st's hosted AI sketches (**paid**, needs AI enabled on the account) |
| 21st-ui-build | 21st-dev/skill | Building a page or section in an existing project, with a known direction |
| 21st-ui-explore | 21st-dev/skill | Producing three design options when the direction is still open |
| 21st-ui-review | 21st-dev/skill | UI audits and accessibility review, with safe automatic fixes |
| gsap-core | greensock/gsap-skills | GSAP basics: tweens, easing, `gsap.matchMedia()` and reduced motion |
| gsap-timeline | greensock/gsap-skills | Sequencing several animations with timelines |
| gsap-scrolltrigger | greensock/gsap-skills | Scroll-driven animation |
| gsap-plugins | greensock/gsap-skills | GSAP plugins (SplitText, Flip and others), all free |
| gsap-utils | greensock/gsap-skills | GSAP helper functions (`gsap.utils.*`) |
| gsap-react | greensock/gsap-skills | GSAP inside React with the `useGSAP` hook |
| gsap-performance | greensock/gsap-skills | Smooth animation: transforms, `will-change`, `quickTo` |
| gsap-frameworks | greensock/gsap-skills | GSAP in Vue, Svelte, Nuxt and others (not needed for our React islands) |

## frontend-design

- Think of it as the design lead. It asks what the subject is (here: a clinic, its patients, its city), then picks a direction specific to that brief.
- It works in **two passes**: first a plan with 4 to 6 named colors, typefaces and an ASCII wireframe; then a review of that plan against the brief before any code.
- It warns against generic "AI-looking" designs: fade-up on every section, the same SaaS card kit, default fonts.
- It has a quality floor: works on mobile, visible keyboard focus, reduced motion respected, readable contrast.
- **The brief's own words win** over its style advice.

## ui-ux-pro-max

A local search tool over design data. It uses only Python's standard library and never touches the network.

**Path note:** its `SKILL.md` writes commands as `python "${CLAUDE_PLUGIN_ROOT}/.claude/skills/ui-ux-pro-max/scripts/search.py" ...`. That variable exists only when the skill comes from a plugin. Here, ignore the prefix and run the script **from the repo root**:

```bash
# A full recommended design system (prints only, writes nothing)
python3 .claude/skills/ui-ux-pro-max/scripts/search.py "A fast, multilingual website where patients see the doctor, services and timings, and book an appointment." --design-system -p "Sanjivani Clinic"

# One topic: --domain is style, color, chart, landing, product, ux, typography, google-fonts, icons, gsap, react or web
python3 .claude/skills/ui-ux-pro-max/scripts/search.py "form validation errors" --domain ux -n 3

# Tips for one stack, such as astro, react or shadcn
python3 .claude/skills/ui-ux-pro-max/scripts/search.py "islands hydration" --stack astro -n 2
```

- `-n 3` caps the results at 3.
- Add `-B` after `python3` (`python3 -B ...`) so Python doesn't leave `__pycache__` folders inside `.claude/skills/`.
- **Saving results:** add `--persist --output-dir .` to a `--design-system` run. It writes `design-system/<slug>/MASTER.md` at the repo root. Add `--page "home"` for a page file in `design-system/<slug>/pages/`.
- **Never use `--force` without asking the owner.** It overwrites `MASTER.md` and page files. Without it, existing files are never overwritten.
- **Its results are input and a checklist, not a decision.** For this clinic, its first suggestion was an "Enterprise Gateway" layout with EB Garamond, a font it describes as best for law firms. That's a poor fit, and frontend-design makes the call.
- The **pre-delivery checklist** is printed at the end of every `--design-system` run: no emoji icons, contrast of 4.5:1, visible focus, reduced motion, and the widths 375, 768, 1024 and 1440 px. A longer version is in `.claude/skills/ui-ux-pro-max/references/pro-rules.md`.

## shadcn

- shadcn/ui components are copied into our code as source files **by its CLI**, never written by hand and never copied from GitHub.
- It reads the project's **`components.json`**, which `shadcn init` created in task 06: Base UI (`base`), the `nova` preset, Lucide icons and CSS variables. `npx shadcn@latest info` shows this setup and the installed components (none yet).
- **When the skill loads, it runs `npx shadcn@latest info --json` automatically, and it pre-approves every `npx shadcn@latest ...` command.** So Claude won't ask before running them. Our CLAUDE.md adds the guard rails (see "Skills" there).
- Key rules from the skill:
  - Use existing components first: check `npx shadcn@latest search` before writing custom UI. Don't re-add installed components, and read every file it adds.
  - Use semantic color tokens (`bg-primary`, `text-muted-foreground`), never raw values like `bg-blue-500`, and no manual `dark:` color overrides.
  - Use `flex` with `gap-*`, not `space-x-*` / `space-y-*`. Write `size-10`, not `w-10 h-10`.
  - Forms use `FieldGroup` + `Field`.
  - Every Dialog, Sheet and Drawer needs a Title (use `sr-only` to hide it visually).
  - Use the project's icon library (from `info --json`), and never assume `lucide-react`.
  - Never use `--overwrite` without the owner's approval, and never guess a third-party registry.

## 21st.dev

[21st.dev](https://21st.dev) is a library of community React components, plus a hosted AI that sketches UI.

- **Log in** with `npx @21st-dev/cli login`. It opens the browser and saves a token on your machine in `~/.config/21st/auth.json`, outside the repo. Or set an API key in the `TWENTYFIRST_TOKEN` environment variable. **Never commit the key**; keep it in `.env`, which git ignores.
- **Free vs paid:**
  - Search, previews, theme CSS and logos are free.
  - Getting component code (`21st get`, `21st add`) has a free daily quota.
  - Hosted AI (`21st generate`, `21st iterate`) needs AI switched on for the account, and uses paid credits. `21st usage` shows whether AI is enabled and the free quota left, but not your credit balance.
- **Which skill when:**
  - `21st-cli-use`: find or install a component or theme.
  - `21st-ui-explore`: you want three directions to choose from.
  - `21st-ui-build`: you know the direction and want the page built.
  - `21st-ui-review`: check finished UI.
  - `21st-ai`: only for paid hosted sketches.
- **Care points:**
  - `21st add` installs code written by community users, plus their npm packages. Read the diff and `package.json` changes.
  - `--context auto` may send design context from the project to 21st.dev. This wasn't verified.
- **Left out on purpose:** `21st-registry` and `21st-design-sync`. They publish to the **public** 21st.dev site (components default to public, and themes are always public). We never publish without asking.

## GSAP

- **Start with `gsap-react`.** Register the hook once (`gsap.registerPlugin(useGSAP)`). Then use `useGSAP(() => { ... }, { scope: containerRef })`, always with a scope ref. It cleans up automatically when the component unmounts.
- **Always handle `prefers-reduced-motion`.** Only `gsap-core` covers it, so this is our rule for every animation: use `gsap.matchMedia()` with a `(prefers-reduced-motion: reduce)` condition, and show the final state with no movement.
- **All GSAP plugins are free**, including for commercial use. There's no membership, token, `.npmrc` or private registry. The skills say never to create one.
- **Known slip:** the horizontal-scroll example in `gsap-scrolltrigger` (around line 235) has a typo (`Max.max`) and wouldn't run. Don't copy it as-is.

## How the skills work together

1. **Direction:** frontend-design plans the look. ui-ux-pro-max supplies data. 21st-ui-explore offers options when the direction is open.
2. **Components:** shadcn (always through its CLI), then 21st-cli-use to search before hand-writing a section, and 21st-ui-build for pages.
3. **Motion:** gsap-react with `useGSAP`, plus gsap-timeline or gsap-scrolltrigger when needed, always with a reduced-motion fallback.
4. **Review:** 21st-ui-review and the ui-ux-pro-max pre-delivery checklist.

**When they disagree:** accessibility wins. After that, frontend-design and the product brief make the final call.

## Managing skills

We installed with a pinned version of the installer: `npx -y skills@1.5.18 ...`. We first pinned it because newer versions needed Node 22.20 or newer, and this machine had Node 20 then. Node is now 24, but we keep the pin: 1.5.18 is the installer version we used, and newer versions haven't been checked. (The vetting record below covers the skill sources, not the installer.) Moving to a newer installer means reading it first, in its own task. We also set `DISABLE_TELEMETRY=1` in front of each command, so the installer doesn't report installs to Vercel.

```bash
DISABLE_TELEMETRY=1 npx -y skills@1.5.18 list                     # show installed skills (should be 16)
DISABLE_TELEMETRY=1 npx -y skills@1.5.18 update -p                # update project skills to the newest upstream versions
DISABLE_TELEMETRY=1 npx -y skills@1.5.18 add <owner/repo> --agent claude-code --skill <name> --copy -y
DISABLE_TELEMETRY=1 npx -y skills@1.5.18 remove <name>
DISABLE_TELEMETRY=1 npx -y skills@1.5.18 experimental_install     # restore the skills listed in skills-lock.json
```

- `--copy` stores real files instead of symlinks, so git commits the actual content.
- `skills-lock.json` records each skill's source and a content hash, but not the commit it came from. The commits we checked are listed below.
- **An update pulls new, unchecked text.** Do it in its own task: read `git diff .claude/skills` (and any new scripts) before you commit.
- Never edit files in `.claude/skills/`. Project rules go in `CLAUDE.md`.
- A new skill: read it first, install it with the project command above, and add it to this guide.

## Vetting record

Before installing, we cloned each source and read every `SKILL.md` and script, running nothing. We also searched for risky patterns: network calls, `rm -rf`, secret paths, hidden instructions. After installing, `diff -rq` showed the installed files were **identical** to the checked ones.

| Source | Commit checked | Skills | Verdict |
| --- | --- | --- | --- |
| greensock/gsap-skills | `aed9cfd3277740755f6bfc1155c7aa645403b760` | 8 gsap-* | Safe. Plain Markdown, no scripts. One broken example (above). |
| shadcn-ui/ui | `ffd225775bbb7955a673f08bb9be4a63600d9dfb` | shadcn | Safe with notes. It auto-runs and pre-approves `shadcn@latest` commands. |
| anthropics/skills | `dbd4588f9e1033efb41dad4bef2f7947c8993d44` | frontend-design | Safe. Two text files, Apache-2.0. |
| nextlevelbuilder/ui-ux-pro-max-skill | `d14efff8ed1faa4187f004f79926f428c8074ec7` | ui-ux-pro-max | Safe with notes. Local Python, no network. The path prefix needs a fix (above). Writes only with `--persist`. |
| 21st-dev/skill | `15c7436c41dc88c54094f1be93ce53bda456b114` | 5 x 21st-* | Safe with notes. No code, but it runs the 21st CLI: paid AI, community installs. |

## Compound Engineering

**What it is:** a **plugin**, EveryInc/compound-engineering-plugin (MIT licence). A plugin is a package of skills (it could also hold hooks, agents, commands or MCP servers) that Claude Code installs with `claude plugin`. Unlike our project skills, its files live on your machine in `~/.claude/plugins/cache/...`. The repo stores only *which* plugin and version to use, in `.claude/settings.json`.

It adds a loop to every task: **plan, work, review, compound**. "Compound" means saving a reusable lesson in `document/solutions/` so future sessions don't repeat a mistake.

**What we checked** (tag `compound-engineering-v3.32.0`, commit `786ac0194183fadc3d0e2525b2ba6d40353926d3`):

- **What it contains:** 36 skills (34 `ce-*`, plus `lfg` and `wtf`, a plain-language "explain this" skill), and no hooks, MCP servers, agents or commands. No skill runs anything on its own when it loads.
- **Skills that pre-approve tools:**
  - `ce-resolve-pr-feedback`: `gh`, `git`, `bash`, `python3`, Read, Write
  - `ce-proof`: Bash, Read, Write, WebFetch
  - `ce-sweep` and `ce-product-pulse`: file tools and Bash
  - We don't use any of them.
- **`check-health`** downloads packages only with a `--warm-acpx` flag, which we never pass.
- **`check-health` also reads `~/.codex/AGENTS.md`**, if it exists, to look for an old marker block. It's read-only, reports yes or no, and touches no session transcripts.
- **The cached copy:** the skills in `~/.claude/plugins/cache/` are identical to the clone we read (`diff -rq`).

**How it's installed** (writes `.claude/settings.json`, which is committed):

```bash
claude plugin marketplace add "EveryInc/compound-engineering-plugin#compound-engineering-v3.32.0" --scope project
claude plugin install compound-engineering@compound-engineering-plugin --scope project
claude plugin list     # shows: Version 3.32.0, Scope project, enabled
```

- `--scope project`: the setting goes into this repo, so every clone gets the same plugin.
- `#compound-engineering-v3.32.0`: install that tag, not the latest code.
- A note in `claude plugin list` that bun is missing is harmless. Bun is only needed to develop the plugin.
- Because a tag can be moved, also check that `gitCommitSha` in `~/.claude/plugins/installed_plugins.json` is `786ac01...`.

**Config:** `.compound-engineering/config.yaml` sets four things:
- `docs_root: document`: its documents go under `document/`.
- `cross_model_review_mode: off`: no review content goes to other AI providers.
- `work_engine_mode: off`: no outside coding tool writes our code.
- `auto_babysit: false`: no automatic PR watching.

`config.example.yaml` is the plugin's full template, with every setting explained. Personal overrides go in `config.local.yaml`, which git ignores.

**The command for each step:**

| Step | Command |
| --- | --- |
| Read past lessons | `grep -ril "<topic>" document/solutions/` |
| Shape a fuzzy idea | `/compound-engineering:ce-brainstorm` |
| Plan one task (writes `document/plans/`) | `/compound-engineering:ce-plan`. When it offers next steps, stop. |
| Build | by hand, or `/compound-engineering:ce-work` |
| Code review (report only) | `/compound-engineering:ce-code-review` |
| Final gate | the code-reviewer command in CLAUDE.md |
| Save a lesson | `claude -p '/compound-engineering:ce-compound mode:non-interactive depth:lightweight <one-line lesson>' --allowedTools ...`. Copy the full command from CLAUDE.md. |
| Health check | `bash ~/.claude/plugins/cache/compound-engineering-plugin/compound-engineering/3.32.0/skills/ce-setup/scripts/check-health --version 3.32.0` |

**What we don't use, and why:**

- **`lfg`, `ce-commit-push-pr`, `ce-babysit-pr`, `ce-resolve-pr-feedback`:** they push, open or watch PRs, or merge. Our workflow commits on the task branch and stops at "ready to merge". The owner pushes, opens the pull request and merges it (CLAUDE.md step 9).
- **Plain `/ce-compound` (full mode):** it scans session transcripts in your home folder. So do the compound calls made by `lfg`, `ce-debug`, `ce-optimize`, `ce-polish` and `ce-pov`. You can use those skills, but decline their offer to compound, and run the lightweight command yourself.
- **`ce-proof`:** it publishes documents to Proof, a website.
- **Cross-model review and outside work engines:** they would send our code to other AI companies, so the config turns them off.
- **The optional tools** `check-health` suggests (agent-browser, ast-grep, ffmpeg, a newer Node): they are global installs, so ask the owner first.

**How to update it** (always in its own task):

1. Read the release notes (`CHANGELOG.md`) and the changed files between the old and the new tag.
2. Check the new tag's commit: `git ls-remote https://github.com/EveryInc/compound-engineering-plugin "refs/tags/<new tag>*"`.
3. Re-run the two install commands with the new tag, then check `claude plugin list` and `gitCommitSha`.
4. Update the pinned tag and commit in CLAUDE.md and in this guide.

Never point it at an unpinned branch like `main`.
