# Tasks

This file tracks every task in this project.

- **Task name = branch name = learning-doc file name.** Task `01_project_setup` is built on the branch `01_project_setup` and explained in `document/learning/01_project_setup.md`.
- **Statuses:** `To do` (not started), `In progress` (being worked on now), `Done` (merged into `main`).
- **Small** means a change you can review in about 15 minutes.

## Tasks

| # | Task (= branch) | Goal | Status | Learning doc |
| --- | --- | --- | --- | --- |
| 01 | 01_project_setup | Git repo, readme, .gitignore, task tracker, learning-doc template | Done | [01_project_setup](../learning/01_project_setup.md) |
| 02 | 02_claude_guidelines | CLAUDE.md: the rules Claude follows in this repo | Done | [02_claude_guidelines](../learning/02_claude_guidelines.md) |
| 03 | 03_skills_installation | 16 Claude skills for UI work, plus a skills guide | Done | [03_skills_installation](../learning/03_skills_installation.md) |
| 04 | 04_agents | 4 project subagents | Done | [04_agents](../learning/04_agents.md) |
| 05 | 05_compound_engineering | The Compound Engineering plugin, pinned and configured | Done | [05_compound_engineering](../learning/05_compound_engineering.md) |
| 06 | 06_react_app_setup | The Astro + React app, shadcn init, GSAP (runs in a new session) | Done | [06_react_app_setup](../learning/06_react_app_setup.md) |
| 24 | 24_pr_merge_workflow | Every task ends with a GitHub pull request the owner merges, not a local merge | Done | [24_pr_merge_workflow](../learning/24_pr_merge_workflow.md) |
| 25 | 25_small_cleanups | `.nvmrc`, stale notes, old `.next/` lines, and a lockfile check for code-reviewer | In progress | [25_small_cleanups](../learning/25_small_cleanups.md) |

## Task steps

### 01_project_setup

- [x] Create branch
- [x] Add .gitignore
- [x] Write readme.md (name, description, How we work, repo map, prerequisites)
- [x] Add this task tracker
- [x] Add the learning-doc template
- [x] Write the learning doc
- [x] Review (self-review: the reviewer agent doesn't exist yet)
- [x] Merge into main

### 02_claude_guidelines

- [x] Create branch
- [x] Write CLAUDE.md (project, repo map, task workflow, learning docs, git rules, definition of done, talking to the user)
- [x] Link CLAUDE.md from readme.md
- [x] Write the learning doc
- [x] Review (self-review: the reviewer agent doesn't exist yet)
- [x] Merge into main

### 03_skills_installation

- [x] Create branch
- [x] Vet the 5 skill sources: read every SKILL.md and script, search for risky patterns, run nothing
- [x] Install the skills into the project (one commit per source) and compare them with the vetted copies
- [x] Check: `npx skills list` shows 16 skills, and the ui-ux-pro-max search script runs
- [x] Write document/skills/skills.md
- [x] Add a Skills section to CLAUDE.md and update readme.md
- [x] Write the learning doc
- [x] Review (self-review: the reviewer agent doesn't exist yet)
- [x] Merge into main

### 04_agents

- [x] Create branch
- [x] Write the 4 agents in .claude/agents/ (task-planner, ui-engineer, learning-doc-writer, code-reviewer)
- [x] Check that they load in a fresh process
- [x] Add an Agents section to CLAUDE.md and update readme.md
- [x] Write the learning doc
- [x] Review with code-reviewer and fix what it finds
- [x] Merge into main

### 05_compound_engineering

- [x] Create branch
- [x] Check the pin (tag `compound-engineering-v3.32.0` → commit `786ac01…`) and vet the plugin
- [x] Install the plugin for the project and check it
- [x] Configure it: .compound-engineering/, .gitignore lines, health check
- [x] Update CLAUDE.md, the agents, skills.md and readme.md
- [x] Write the learning doc
- [x] Review with code-reviewer and fix what it finds
- [x] Compound: save a lesson in document/solutions/ if one passes the counterfactual question
- [x] Merge into main

### 06_react_app_setup

Runs in a **new** Claude Code session, because agents and the plugin load only when a session starts.

- [x] Before starting: `node -v` shows 22.23.4 or newer (Astro 7 needs it)
- [x] Create branch
- [x] Plan with `/compound-engineering:ce-plan`: "Scaffold the Astro + React app at the repo root, run shadcn init, install gsap and @gsap/react. No features." Link the plan here. When ce-plan offers next steps, choose to stop. Nothing may push or open a PR. Plan: [2026-10-25-1400-chore-astro-react-app-setup-plan.md](../plans/2026-10-25-1400-chore-astro-react-app-setup-plan.md)
- [x] Check the scaffold's current flags: `npm create astro@latest -- --help`
- [x] Scaffold into a scratch folder outside the repo (for example `npm create astro@latest <scratch>/sanjivani-clinic -- --template minimal --no-install --no-git --yes`, adjusted to the flags you just checked)
- [x] Copy everything into the repo except README.md, .gitignore, node_modules/ and .git/. Merge the scaffold's .gitignore lines into ours and keep our comments.
- [x] If the scaffold made its own AGENTS.md or CLAUDE.md, never let it replace ours. Read it, keep AGENTS.md if it helps, and import it from CLAUDE.md with an `@AGENTS.md` line. Explain the choice in the learning doc.
- [x] Run `npm install`
- [x] Add React, Tailwind and the `@/*` path alias by following the shadcn Astro guide
- [x] Replace the starter page with a minimal placeholder: a "Sanjivani Clinic" heading and one line of text. Nothing else.
- [x] shadcn: follow the shadcn skill. Run `npx shadcn@latest init --help` first, then init with the defaults (CSS variables). Add no components. Check that `npx shadcn@latest info --json` finds components.json.
- [x] Run `npm install gsap @gsap/react`. Write no animation code yet.
- [x] Add ESLint (eslint-plugin-astro + typescript-eslint) with an `npm run lint` script, and `npm run typecheck` (`astro check`)
- [x] Check it works and paste the real output into the learning doc: `npm run lint`; `npm run build`; `npm run dev` in the background, then `curl -sI http://localhost:4321` returns 200, then stop the server; `git status` shows no node_modules/, dist/ or .astro/
- [x] Update the docs: CLAUDE.md (stage "app scaffolded, no features yet", stack set, commands `npm run dev`, `npm run build`, `npm run lint`); readme.md ("Run it locally": `npm install`, `npm run dev`, http://localhost:4321); the backlog below
- [x] Write the learning doc: Astro basics and islands, the folder layout, Tailwind, what shadcn init changed, package.json vs package-lock.json, the npm scripts
- [x] Run ce-code-review (report only; most code is generated, so focus on config)
- [x] Review with code-reviewer and fix what it finds
- [x] Compound: save a lesson in document/solutions/ if one passes the counterfactual question
- [x] Merge into main

### 24_pr_merge_workflow

- [x] Create branch
- [x] Plan with `/compound-engineering:ce-plan` and link the plan here: [2026-10-26-1250-docs-pr-merge-workflow-plan.md](../plans/2026-10-26-1250-docs-pr-merge-workflow-plan.md)
- [x] Rewrite CLAUDE.md steps 1 and 9 and the Definition of done for the pull-request route, and update every file that restates them (readme.md, this file's "How to add a task", skills.md, code-reviewer, the workflow lesson)
- [x] Remove the decided "Open decision" paragraph from the backlog
- [x] Write the learning doc
- [x] Review with code-reviewer and fix what it finds
- [x] Compound: save a lesson in document/solutions/ if one passes the counterfactual question
- [x] Merge into main

### 25_small_cleanups

- [x] Create branch
- [x] Plan with `/compound-engineering:ce-plan` and link the plan here: [2026-10-26-1526-chore-small-cleanups-plan.md](../plans/2026-10-26-1526-chore-small-cleanups-plan.md)
- [x] Add `.nvmrc`, fix the stale `skills@1.5.18` note (CLAUDE.md, readme.md, skills.md), and remove the `.next/` and `next-env.d.ts` lines (`.gitignore`, CLAUDE.md, code-reviewer)
- [x] Teach code-reviewer how to check `package-lock.json` without reading it in full
- [x] Write the learning doc
- [x] Review with code-reviewer and fix what it finds
- [x] Compound: save a lesson in document/solutions/ if one passes the counterfactual question
- [ ] Merge into main

## Backlog (proposed)

Ideas for later. **Proposed only: confirm each one with the product brief before it becomes a task.**

| # | Task | Goal | Depends on |
| --- | --- | --- | --- |
| 07 | 07_design_system | Colors, type and spacing from ui-ux-pro-max + frontend-design, saved in design-system/sanjivani-clinic/ | 06 |
| 08 | 08_layout_shell | Header, footer and the page layout every page uses | 07 |
| 09 | 09_home_page | Home page with one GSAP entrance animation and a reduced-motion fallback | 08 |
| 10 | 10_clinic_data_and_i18n | Clinic data files (contact, timings, doctor, services) and English / Hindi / Marathi pages | 08 |
| 11 | 11_info_pages | Doctor, Services, Timings, Contact & Location and FAQ pages | 10 |
| 12 | 12_patient_quick_actions | Click-to-call, WhatsApp, directions, emergency strip, mobile action bar | 10 |
| 13 | 13_open_now_badge | "Open now / Closed" badge in clinic time (IST), a React island | 10 |
| 14 | 14_appointment_form | Appointment form with time slots built from the clinic timings, a React island | 10 |
| 15 | 15_booking_backends | Send bookings to a Google Sheet, to email (Web3Forms), or to WhatsApp as the fallback | 14 |
| 16 | 16_bmi_calculator | BMI calculator using Asian-Indian cut-offs | 08 |
| 17 | 17_testimonials_slider | Testimonials slider (real, consented testimonials only) | 08 |
| 18 | 18_dark_mode | Dark mode toggle with no flash on reload | 08 |
| 19 | 19_gallery | Clinic photo gallery with a lightbox | 08 |
| 20 | 20_health_blog | Health blog written in Markdown | 08 |
| 21 | 21_seo_schema_sitemap | Page titles and descriptions, clinic schema (JSON-LD), sitemap, robots.txt | 11 |
| 22 | 22_admin_panel | Decap CMS at /admin, with GitHub login through Vercel | 10, 23 |
| 23 | 23_deploy_vercel | Deploy the site to Vercel | 09 |

**Notes from task 06 for later tasks** (to fold into a task when it is planned):

- **07:** the shadcn `nova` preset uses the Geist font, which has no Devanagari letters, so Hindi and Marathi text would fall back to a system font. Pick fonts that cover Devanagari. The `design-system/` folder is already kept out of lint and the Tailwind scan.
- **08:** the layout's viewport tag should be `width=device-width, initial-scale=1`. The Astro template's placeholder page has only `width=device-width`.
- **First UI task (08 or 09):** add React hooks lint rules (`eslint-plugin-react-hooks`). Add accessibility lint rules (`eslint-plugin-jsx-a11y`) once a version supports ESLint 10 (6.10.2 supports only ESLint 9 or older).
- **Small cleanups:** now task 25.

Not planned (the owner's choice): Google reviews, online payment.

## How to add a task

1. **Pick the number:** the next free two-digit number. Check both the Tasks table and the backlog.
2. **Name it** `NN_short_name`: two digits, an underscore, then 2 to 4 lowercase words joined by underscores that say the outcome.
   - Good: `07_design_system`, `14_appointment_form`
   - Bad: `7_design` (needs two digits), `14-Appointment-Form` (no dashes or capitals), `14_stuff` (says nothing), `14_form_blog_and_seo` (too big, so split it)
3. **Add it here:** a row in the Tasks table, and a `### NN_short_name` section under "Task steps" with checkbox steps. Every task includes "Create branch", "Write the learning doc", "Review with code-reviewer and fix what it finds", "Compound" and "Merge into main".
4. **Branch from an up-to-date main** by following CLAUDE.md step 1: pull `main`, finish any earlier task that is merged but not yet marked done (or ask the owner to merge it first), then create the branch.
5. **Set the status** to `In progress`.
6. **Write the learning doc** from `document/learning/TEMPLATE.md`, and link it in the Learning doc column.
7. **Merge through a pull request** (CLAUDE.md step 9): Claude stops at "ready to merge", and the owner pushes the branch, opens the PR and merges it with "Create a merge commit".
8. **Mark it done** in one bookkeeping commit on local `main`, `docs(NN): mark task NN done`: tick "Merge into main", and set `Done` here and in the learning doc's header. It isn't pushed: the next task's pull request carries it to GitHub.
