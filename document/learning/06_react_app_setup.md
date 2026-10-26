# 06_react_app_setup: the Astro + React app, with Tailwind, shadcn and GSAP

> **Branch:** 06_react_app_setup · **Date:** 2026-10-25 · **Status:** In progress

**Plan:** [2026-10-25-1400-chore-astro-react-app-setup-plan.md](../plans/2026-10-25-1400-chore-astro-react-app-setup-plan.md). No solution doc yet: the compound question comes after the review.

## In one minute

- The repo now has a real app at its root: **Astro 7** with **React 19**, **Tailwind CSS 4** and TypeScript. It shows one placeholder page: a "Sanjivani Clinic" heading and one line of text.
- **shadcn/ui** is set up (Base UI, the `nova` preset) with no components yet. **GSAP** is installed with no animation code yet.
- Three checks guard every later task: `npm run lint`, `npm run typecheck` and `npm run build`. All three pass, and the tools are set to skip `.claude/` and `document/`.
- The built page loads **zero JavaScript**. That's Astro's "islands" idea at work.

## Why: the problem we solved

Tasks 01 to 05 built the rules, skills, agents and workflow, but there was no app. Every backlog task from 07 on needs one, and the ui-engineer agent refuses to start without `package.json` and `components.json` at the root.

Three things made this harder than one `npm create astro` command:

- The repo root wasn't empty, and this Mac's disk ignores letter case. To it, `README.md` and `readme.md` are the same file, so the template would have overwritten ours.
- The repo holds third-party skill files, full of Tailwind class names and `.tsx` code. New tools would scan, lint or type-check them unless told not to.
- The newest TypeScript (7.0) is ahead of the check and lint tools.

## What: what changed

| File or folder | Change | Why it exists |
| --- | --- | --- |
| `package.json` | Added | The app's name, Node version, npm scripts and packages. `"private": true` stops it being published by mistake |
| `package-lock.json` | Added | The exact version of every package (see "New ideas") |
| `astro.config.mjs` | Added | Turns on the React integration and Tailwind's Vite plugin |
| `tsconfig.json` | Added | Strict TypeScript, JSX for React, the `@/*` alias; `.claude` and `document` excluded |
| `src/pages/index.astro` | Added | The placeholder home page |
| `src/styles/global.css` | Added | Tailwind (scanning `src/` only) and shadcn's theme |
| `src/lib/utils.ts` | Added | shadcn's `cn()` helper, which joins class names |
| `components.json` | Added | shadcn's config |
| `eslint.config.js` | Added | The lint rules, and the folders lint skips |
| `public/`, `.vscode/` | Added | Favicons; a suggestion to install the Astro editor extension (both from the template) |
| `.gitignore` | Changed | `.astro/` (Astro's generated files) and `yarn-error.log*` (from the template) |
| `CLAUDE.md`, `readme.md`, `document/skills/skills.md`, `document/task/task.md` | Changed | Stage, stack, repo map, a Commands section with the safe dev-server rule, a code-reviewer command that allows only the four checks, "Run it locally" with a note on a leftover dev server, the shadcn note, backlog notes |

The folder layout, as a sketch:

```text
src/pages/index.astro   one file per URL; this one is "/"
src/styles/global.css   Tailwind and the theme colours
src/lib/utils.ts        cn()
public/                 copied into the site as it is
node_modules/ dist/ .astro/   generated, ignored by git
```

## How: step by step

1. **Scaffold in a scratch folder, then copy.** A *scaffold* is a starter project that a tool generates. We read the flags first (`npm create astro@latest -- --help`, create-astro 5.3.1). Then, from inside a scratch folder outside the repo:

   ```bash
   npm create astro@latest ./sanjivani-clinic -- --template minimal --no-install --no-git --skip-houston --yes
   ```

   - `--template minimal`: the smallest starter.
   - `--no-install`, `--no-git`: don't install packages or start a git repo yet.
   - `--skip-houston`: skip the mascot animation.
   - `--yes`: accept the default answer to every question.
   - The *relative* target `./sanjivani-clinic` makes the package name `sanjivani-clinic`. An absolute path would have put the whole path, username included, into the name.

   A case-insensitive check found two clashes, `.gitignore` and `readme.md`, so neither was copied. We copied the rest untouched (`5ff1eff`), added `"private": true` back (`b1bb65b`), and ran `npm install` (`added 185 packages, ...`, `found 0 vulnerabilities`).

2. **Add React and Tailwind:** `npx astro add react tailwind --yes`. An *integration* is a plugin for Astro, and `astro add` installs it and edits the config for you. *Vite* is the build tool Astro uses inside; Tailwind plugs into it. It also printed "You must import your Tailwind stylesheet". The page imports it itself, because a shared layout is task 08.

3. **Add the `@/` alias** in `tsconfig.json`: `"paths": { "@/*": ["./src/*"] }`. A *path alias* is a shortcut: `@/lib/utils` means `src/lib/utils` from any folder. shadcn's code uses it.

4. **Limit Tailwind to `src/`** (`f64fcfa`). Line 1 of `global.css` became `@import "tailwindcss" source("../");`. "New ideas" shows why, with numbers.

5. **Write the placeholder page** (`cb782a8`): one `h1` with `class="text-3xl font-bold"` and one paragraph. No React component.

6. **Initialise shadcn.** `npx shadcn@latest init --help` first, then:

   ```bash
   npx shadcn@latest init --base base --preset nova
   ```

   - `--base base`: build components on Base UI (the owner's choice over Radix UI and React Aria).
   - `--preset nova`: a ready-made look: neutral colours, the Geist font, Lucide icons.

   What it changed (`28e579a`):
   - **Added `components.json`:** style `base-nova`, CSS variables on, aliases like `@/components/ui`.
   - **Added `src/lib/utils.ts`:** one line, `export { cn } from "cn"`.
   - **Changed `global.css`:** imports for animations, shadcn's base CSS and the font. It also added a `.dark` class switch, colour *tokens* (named values like `--primary`, set once in `:root` and again in `.dark`), and base styles for `body`. Our `source("../")` line survived.
   - **Added 7 packages:** `@base-ui/react`, `cn`, `class-variance-authority`, `lucide-react`, `tw-animate-css`, `@fontsource-variable/geist` (font files served from our own site, no Google Fonts call) and `shadcn`.

7. **Install GSAP:** `npm install gsap @gsap/react` (3.15.0 and 2.1.2). GSAP's licence is free ("standard no-charge"), but it isn't open source. npm warned that `fsevents@2.3.3` has an install script. We didn't approve it (see Decisions).

8. **Add the checks.**
   - `npm install --save-dev @astrojs/check "typescript@~6.0.3"`, plus the script `"typecheck": "astro check"`.
   - `npm install --save-dev eslint @eslint/js typescript-eslint eslint-plugin-astro`, plus `eslint.config.js` and `"lint": "eslint ."`.
   - `--save-dev` lists a package under `devDependencies`: tools for building and checking, not part of the site.

## New ideas in this task

**Astro and islands.** Astro turns pages into plain HTML at build time. An `.astro` file starts with *frontmatter*, code between two `---` lines that runs at build time (ours imports `global.css`). The HTML comes below it. React components are *islands*: small interactive parts on a static page. A component sends JavaScript to the browser only if you add a `client:*` *directive*. For example, `<BookingForm client:load />` runs it as soon as the page loads, and `client:visible` waits until it scrolls into view. That start-up step is called *hydration*. Without a directive, React renders it to HTML at build time and ships no code.

Our page has no island, so the built `dist/index.html` has **zero `<script>` tags**. It loads only the two favicons and one CSS file. The build still writes a 220,749-byte `client.FVv06Hs5.js` for future React islands, but no page loads it.

**Tailwind CSS v4.** Tailwind gives you *utility classes*: small classes that each do one thing, such as `text-3xl` (big text) or `font-bold`. At build time it scans your files for class names and writes CSS only for those. By default it scans the whole project, including `.claude/` and `document/`, which are full of class names. `source("../")` sets the scan root to the stylesheet's parent folder, `src/`.

We proved it with two *canary* classes, `w-[200px]` and `w-[900px]`. A canary is a test value that should never show up; if it does, something is leaking. These two appear only in `.claude/` and `document/`. Two builds, made before shadcn init:

| Build | CSS size | Canary rules |
| --- | --- | --- |
| Without `source("../")` | 26,218 bytes | both present |
| With `source("../")` | 4,660 bytes | none |

So the full scan made the CSS more than five times bigger, all with classes the site never uses. After shadcn init, the final CSS is 10,817 bytes, still with no canaries.

**package.json vs package-lock.json.** `package.json` is the file you edit: names, *version ranges* and scripts. `^4.3.3` means "4.3.3 or any newer 4.x". `~6.0.3` means "any 6.0.x from 6.0.3 on, never 6.1". `package-lock.json` is written by npm: the exact version, download URL and checksum of every package, including the ones our packages pull in. Commit both, together. `npm ci` (clean install) deletes `node_modules/` and installs exactly what the lockfile says. It's the honest test that a fresh clone works.

**The npm scripts.** `npm run <name>` runs a command from `package.json`:

| Script | Runs | What it does |
| --- | --- | --- |
| `dev` | `astro dev` | A *dev server*: a local web server that reloads the page when you save |
| `build` | `astro build` | Builds the finished site into `dist/` |
| `preview` | `astro preview` | Serves `dist/`, to check the build |
| `astro` | `astro` | Any Astro command, e.g. `npm run astro -- --help` |
| `lint` | `eslint .` | *Linting*: rule checks for likely bugs, such as unused variables |
| `typecheck` | `astro check` | *Type checking*: TypeScript checks that values match their types, in `.ts` and `.astro` files |

## Decisions worth knowing

**The AGENTS.md choice: not kept.** `AGENTS.md` is a file of instructions for AI coding agents. create-astro writes one unless you pass `--no-ai`. We left that flag out on purpose, so we could read it first. It told agents to manage the dev server with `astro dev stop`. But that command stops *any* dev server for this project, including the owner's own. So it clashed with our rules, and we didn't keep it or import it with an `@AGENTS.md` line. Instead, CLAUDE.md got a Commands section with the safe rule: run `npx astro dev status` first, and stop only a server you started.

- **Base UI and `nova`:** the owner chose Base UI. It's shadcn's recommended default and what our shadcn skill uses; task 07 can change the preset.
- **TypeScript stays on `~6.0.3`:** 7.0.2 is the newest, but `astro check` refuses it, and typescript-eslint supports only versions below 6.1.
- **`paths` without `baseUrl`:** the shadcn Astro guide adds `"baseUrl": "."`, but TypeScript 6 deprecates it (error TS5101), and `paths` alone works.
- **Tools skip `.claude/` and `document/`:** Tailwind through `source("../")`, ESLint through `globalIgnores`, TypeScript through `exclude`. We never edit skill files, so errors there would only be noise.
- **No React component on the page:** the task said "nothing else". The first island comes with a UI task.
- **`fsevents` install script not approved:** it's an optional macOS file-watching helper. Approving it writes a field into `package.json`, and everything works without it.
- **Astro telemetry stays on (the owner's choice):** *telemetry* is anonymous usage data a tool sends to its makers, and Astro's is on by default. `npx astro telemetry disable` turns it off for good, but it writes a user setting outside the repo, so we didn't run it. For one command only: `ASTRO_TELEMETRY_DISABLED=1 npm run build`.
- **20 steps, not split:** task-planner's rule is 5 to 8 steps per task, but the owner wrote this one.

### Where the commands differ from the tracker

- **Scaffold:** a relative target, run from the scratch folder, plus `--skip-houston`; `--no-ai` left out on purpose.
- **`@latest`** became create-astro 5.3.1, astro 7.4.2, shadcn 4.22.1 and eslint 10.13.0.
- **Alias:** `paths` without the guide's `baseUrl`.
- **shadcn "defaults":** `--base base --preset nova`, because `--defaults` means a Next.js template.
- **Dev server:** not "start it in the background, then kill it". Astro backgrounds itself under Claude Code, and we stopped only the server we started.
- **Checks:** `npm run typecheck` was added, because code-reviewer runs it.
- **AGENTS.md:** not kept (above), so there's no `@AGENTS.md` line.

## Check that it works

Node v24.22.1, npm 11.19.1. Lint, typecheck, `git status` and the `dist/` checks were run again while this doc was written. The build, dev-server and `npm ci` outputs are from the check run just before it.

`npm run lint` printed only its header and exited 0:

```text
> sanjivani-clinic@0.0.1 lint
> eslint .
```

A check that can't fail proves nothing. So the main session added a temporary `src/lint-probe.ts` with an unused variable, and lint failed (exit 1):

```text
src/lint-probe.ts
  1:7  error  'unusedProbe' is assigned a value but never used  @typescript-eslint/no-unused-vars

✖ 1 problem (1 error, 0 warnings)
```

After the file was deleted, lint passed again.

`npm run typecheck`, the result lines:

```text
Result (5 files): 
- 0 errors
- 0 warnings
- 0 hints
```

`npm run build`, the last lines:

```text
 generating static routes 
14:27:57   ├─ /index.html (+7ms) 
14:27:57 ✓ Completed in 28ms.

14:27:57 [build] ✓ Completed in 414ms.
14:27:57 [build] 1 page(s) built in 480ms
14:27:57 [build] Complete!
```

The whole built page, `cat dist/index.html` (no `<script>` anywhere):

```html
<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><link rel="icon" type="image/svg+xml" href="/favicon.svg"><link rel="icon" href="/favicon.ico"><meta name="viewport" content="width=device-width"><meta name="generator" content="Astro v7.4.2"><title>Sanjivani Clinic</title><link rel="stylesheet" href="/_astro/index.BXhWY5UI.css"></head><body><h1 class="text-3xl font-bold">Sanjivani Clinic</h1><p>Our new website is on its way.</p></body></html>
```

**The dev server.** First, `npx astro dev status` said "No dev server is running.", and port 4321 was free. Then (`pid` is the process ID, the number the computer gives a running program; `curl -sI` asks quietly for the headers only):

```text
$ npm run dev

> sanjivani-clinic@0.0.1 dev
> astro dev

{"message":"Dev server running at http://localhost:4321 (pid 49587)\n  Stop:   astro dev stop\n  Status: astro dev status\n  Logs:   astro dev logs","label":"SKIP_FORMAT","level":"info"}

$ npx astro dev status
{"message":"Dev server running at http://localhost:4321 (pid 49587, uptime 1s, background)","label":"SKIP_FORMAT","level":"info"}

$ curl -sI http://localhost:4321
HTTP/1.1 200 OK
(5 more header lines, including content-type: text/html)

$ npx astro dev stop
{"message":"Stopped dev server (pid 49587).","label":"SKIP_FORMAT","level":"info"}
$ npx astro dev status
{"message":"No dev server is running.","label":"SKIP_FORMAT","level":"info"}
```

The pid is 49587 all the way through, so we stopped only our own server. In your own terminal, `npm run dev` stays in the foreground with readable logs. Stop it with Ctrl+C.

**Clean install.** `npm ci`, run with no dev server running:

```text
added 665 packages, and audited 666 packages in 14s

218 packages are looking for funding
  run `npm fund` for details

found 0 vulnerabilities
```

After it, lint, typecheck and build passed again. `npx shadcn@latest info --json` finds `components.json` and reports framework `Astro`, Tailwind `v4`, base `base`, style `base-nova` and `"components": []`. All 755 download URLs in the lockfile point at `registry.npmjs.org`.

**Git stays clean.** `git status --short` printed nothing. `git status --short --ignored` printed:

```text
!! .astro/
!! dist/
!! node_modules/
```

`!!` means "ignored": the generated folders exist, but git won't track them.

## Review and lessons

**ce-code-review** ran first: five reviewers (correctness, project standards, adversarial, agent-native, past lessons). Cross-model review is off in our config, so no code went to another AI company. Its verdict: **Ready to merge**, with no findings, plus five "residual risks" (things worth knowing that nobody proved are bugs) and one testing gap. We acted on four of them:

| What it noticed | What we did |
| --- | --- |
| The code-reviewer command allowed `npm run *`. Once `package.json` existed, that also allowed `npm run dev` (a background server) and `npm run astro add` (an install). | Allowed only `lint`, `typecheck`, `build` and `test` (`1579037`) |
| "Stop only the same pid" could still match the owner's server: when one is running, `npm run dev` prints "Dev server already running at … (pid N)" with *its* pid. | Stop only after your own `npm run dev` printed "Dev server running at" (`4825a96`) |
| A dev server left by a Claude session blocks your `npm run dev`. | A note in readme's "Run it locally" (`3306b2a`) |
| Nothing imports through `@/` yet, so the alias was untested. | A throwaway build importing `cn` from `@/lib/utils` passed and gave `p-4` for `cn("p-2", "p-4")`; the page was then restored |

**code-reviewer, first pass** (in a fresh process, with the new four-check command). We saved `git status --short`, `git log -1 --oneline` and `git show-ref --heads` before and after. They matched, so it changed nothing. Verdict: **Needs changes**, with one must fix, one question and three suggestions:

- **Must fix:** this section still said "pending" after ce-code-review had run. Fixed by writing it.
- **Question, a push:** git records two pushes of this branch to GitHub, on 25 Oct at 13:55 and 26 Oct at 11:25. No command in this task ran `git push`, and GitHub has no pull request for the branch (`gh pr list` printed `[]`). Over to the owner (see the end of the task).
- **Suggestions:** shorten this doc (we trimmed the dev-server transcript); the backlog's "open decision" about GitHub is out of date, because `cd138bb` and `8b057f7` already joined the two `main`s (it's the owner's text, so we only point it out); and the viewport tag lacks `initial-scale=1`, which is now a backlog note for task 08.

**Lesson:** a permission written for one situation can quietly grow when the project changes. `npm run *` was harmless while there were no scripts.

**Compound:** we asked, "If this lesson weren't written down, would a future session repeat the mistake or redo the investigation?"

- **The dev-server stop rule and the reviewer's permissions:** no. Both are now written in CLAUDE.md, which every session reads.
- **Scaffolding into a non-empty folder:** no. It happens once.
- **Tailwind's scan limit:** yes. If line 1 of `global.css` loses `source("../")`, lint, typecheck and build all still pass, and the CSS quietly grows five times. Task 07 is likely to rewrite that file (theme work or `shadcn apply`).

So we ran the lightweight command from CLAUDE.md. It wrote [document/solutions/best-practices/tailwind-source-limit-in-global-css.md](../solutions/best-practices/tailwind-source-limit-in-global-css.md) and printed `✓ Documentation complete (non-interactive lightweight mode)`. We read it in full and ran its checks: `head -1` shows the line, the positive control `.text-3xl` counts 1, both canaries count 0, and neither canary appears in `src/`.

## Common mistakes

- **Running `npm create astro` in a folder that isn't empty.** It makes a random sub-folder, and on a case-insensitive disk its `README.md` replaces `readme.md`. Scaffold somewhere else, then copy.
- **Installing `typescript@latest`.** That gets 7.x, which `astro check` refuses. Keep `~6.0.3`.
- **Expecting a React component to react without `client:*`.** It ships as plain HTML, so its buttons do nothing.
- **Forgetting to import `global.css`.** Tailwind classes then do nothing. Here the page imports it; from task 08 the layout will.
- **Committing `package.json` without `package-lock.json`.** Everyone else then installs different versions.
- **Running `astro dev stop` without checking first.** It can stop the owner's server. Run `npx astro dev status` first.
- **Leaving a wildcard permission like `Bash(npm run *)` as it is.** It matched nothing before this task and everything after. Name the exact commands.

## Try it yourself

About 10 minutes. Step 4 undoes everything.

1. Run `npm run build`, then `ls -l dist/_astro/*.css`. Note the size.
2. Open `dist/index.html`. Find the CSS link, and check that there is no `<script>`.
3. In `src/styles/global.css`, change line 1 to `@import "tailwindcss";`. Build again. Is the CSS bigger? Run `grep -c -F 'w-\[200px\]' dist/_astro/*.css`. Our numbers (26,218 vs 4,660 bytes) were measured before shadcn init, so yours will differ.
4. Undo it with `git restore src/styles/global.css`, then build again. `git status --short` should print nothing.

## Learn more

- Astro: [Islands](https://docs.astro.build/en/concepts/islands/) · [Project structure](https://docs.astro.build/en/basics/project-structure/) · [CLI reference](https://docs.astro.build/en/reference/cli-reference/) · [Build with AI (the background dev server)](https://docs.astro.build/en/guides/build-with-ai/) · [Telemetry](https://astro.build/telemetry/)
- Tailwind: [Detecting classes in source files](https://tailwindcss.com/docs/detecting-classes-in-source-files)
- shadcn/ui: [Astro installation](https://ui.shadcn.com/docs/installation/astro) · [CLI](https://ui.shadcn.com/docs/cli)
- npm: [package.json](https://docs.npmjs.com/cli/v11/configuring-npm/package-json/) · [package-lock.json](https://docs.npmjs.com/cli/v11/configuring-npm/package-lock-json/) · [npm ci](https://docs.npmjs.com/cli/v11/commands/npm-ci/)
- ESLint: [Configuration files](https://eslint.org/docs/latest/use/configure/configuration-files) · [typescript-eslint](https://typescript-eslint.io/getting-started/) · [eslint-plugin-astro](https://ota-meshi.github.io/eslint-plugin-astro/user-guide/)
- GSAP: [React guide](https://gsap.com/resources/React/) · [Standard license](https://gsap.com/standard-license) (the address the `gsap` package names; on 2026-10-25 it led to a "Forums Temporarily Offline" page)
