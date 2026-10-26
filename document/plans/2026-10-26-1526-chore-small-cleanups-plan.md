---
title: Small Cleanups - Plan
type: chore
date: 2026-10-26
artifact_contract: ce-unified-plan/v1
product_contract_source: ce-plan-bootstrap
execution: code
---

# Small Cleanups - Plan

**Task:** `25_small_cleanups` in `document/task/task.md`. `CLAUDE.md` wins over this plan.

## Goal Capsule

- **Objective:** The repo's notes and checks match the project as it is now. A fresh clone names its Node version in `.nvmrc`, which fnm and nvm switch to when you run `fnm use` or `nvm use`. No file names a stack we don't use. code-reviewer checks lockfile changes without reading thousands of generated lines, and still catches a bad one.
- **Means:** four small edits (KTD1 to KTD4), one commit each.
- **Authority:** `CLAUDE.md`, then the task 25 steps, then this plan.
- **Stop and ask the owner if:** a change would upgrade a tool, change a pinned version or install anything.
- **Execution profile:** docs, config and agent instructions. Prove each change by running its command and walking code-reviewer's new check through every case (`document/solutions/workflow-issues/walk-new-procedures-through-every-case.md`).
- **Who finishes:** the main session commits on `25_small_cleanups` and stops at "ready to merge" (CLAUDE.md step 9).

## Product Contract

### Summary

Add `.nvmrc`, reword the stale `skills@1.5.18` note, remove the leftover Next.js ignore lines, and give code-reviewer a short lockfile check.

### Problem Frame

Four leftovers from earlier tasks, listed in the task 06 backlog notes:

- fnm doesn't pick Node 24 by itself.
- The skills note gives a reason that's no longer true: "needed while Node is below 22.20", but Node is now 24.
- `.gitignore`, CLAUDE.md and code-reviewer still name `.next/`, from an early stack guess.
- code-reviewer is told to read every changed file in full, including `package-lock.json` (about 10,000 lines in task 06).

### Requirements

- R1. `.nvmrc` names Node 24, and the docs mention it.
- R2. The `skills@1.5.18` notes in CLAUDE.md, readme.md and skills.md give the real reason for the pin: it's the installer version we used, and newer versions haven't been checked. (The vetting record covers the skill sources, not the installer.) Changing it means checking a new version first, in its own task.
- R3. No file tells git, Claude or code-reviewer about `.next/` or `next-env.d.ts`.
- R4. code-reviewer checks `package-lock.json` with a few commands instead of reading it, in step 2's diff and in step 3. It still catches a package from outside npm's registry, a package without a checksum, a new install script, a deleted lockfile, and a lockfile change with no matching `package.json` change. A broken command can't look like a pass.

### Scope Boundaries

- The `skills@1.5.18` pin stays. Upgrading the installer is a supply-chain change that needs vetting first.
- `out/` and `build/` stay in `.gitignore`: they're generic build-output names, not Next.js-only.
- `.nvmrc` doesn't switch Node by itself. Turning on fnm's switch-on-`cd` option is the owner's own shell setup, so the readme only mentions it.

## Planning Contract

### Key Technical Decisions

- KTD1. **`.nvmrc` holds `24`.** It's the major version the owner runs (24.22.1), and fnm and nvm read it. A major-only pin doesn't force one patch release. Vercel doesn't read `.nvmrc`: it takes the version from its Project Settings or `package.json`'s `engines` (`>=22.23.4`, which stays the hard minimum).
- KTD2. **Keep the pin, change only its reason** (R2).
- KTD3. **Remove only `.next/` and `next-env.d.ts`** (R3).
- KTD4. **code-reviewer's lockfile check.** In `.claude/agents/code-reviewer.md`, "First: collect the changes":
  - Step 2's full diff leaves the lockfile out: `git diff main...HEAD -- . ':(exclude)package-lock.json'`. `--stat` stays as it is, so the lockfile still shows in the file list. (On task 06 this cuts the diff from 12,028 lines to 1,532.)
  - Step 3 reads every changed file in full, except `package-lock.json`. If `--stat` lists the lockfile, run these checks instead (only `git`, `grep` and `test`, which code-reviewer is allowed):
    1. `test -f package-lock.json` must succeed.
    2. Four counts on the whole file must be **equal and above 0**: package entries `grep -cE '^    "node_modules/' package-lock.json`; download URLs `grep -c '"resolved": ' package-lock.json`; npm-registry URLs `grep -cF '"resolved": "https://registry.npmjs.org/' package-lock.json`; checksums `grep -c '"integrity": "sha512-' package-lock.json`. Each count is a number, so a mistyped command shows up as a mismatch, not as silence. (On task 06's lockfile all four are 755.)
    3. New install scripts, on the whole file and on both sides: `git show main:package-lock.json | grep -c '"hasInstallScript": true'` and `grep -c '"hasInstallScript": true' package-lock.json` give the counts, and the same file piped through `grep -B6 '"hasInstallScript": true' | grep '^    "node_modules/'` gives the names. On each side the number of names must equal the count. A name on the branch that isn't on `main` is a new install script. (Today: 1 and 1, `fsevents` on both sides.)

       *Changed after review.* The first version searched the diff: `git diff main...HEAD -- package-lock.json | grep -B5 '^+.*"hasInstallScript": true' | grep 'node_modules/'`. code-reviewer found that it prints nothing when a package already in the lockfile moves to a version that adds an install script: the name line stays unchanged, about 7 lines above the new line, out of `-B5`'s reach. A scratch repo confirmed it.
    4. `git diff main...HEAD -- package.json` shows the dependency changes that explain the lockfile change.

### Case walk (KTD4)

| Case | What the checks print | What code-reviewer does |
| --- | --- | --- |
| Lockfile not in `git diff main...HEAD --stat` | the lockfile isn't listed | Skip checks 1 to 4 |
| New packages, all from npm, with `package.json` changed | check 1 succeeds; the four counts are equal and above 0; check 4 names the packages | Pass, and name the new packages |
| A package from outside npm's registry (git URL, tarball, other host, a look-alike host) | the npm-registry count is lower than the download-URL count | Must fix: find the line and say where it comes from |
| An entry without a checksum, or without both URL and checksum | the checksum or URL count is lower than the entry count | Must fix |
| A new package with an install script | check 3: the branch count is higher, and the name is on the branch's list but not `main`'s | Name it in the report as a question |
| A package already in the lockfile moves to a version that adds an install script | check 3: the same as a new package (the diff alone would hide it) | Name it in the report as a question |
| The install-script names don't match the count on one side | check 3: more or fewer names than the count | Not "Ready to merge": list it under what couldn't be checked |
| The lockfile was deleted | check 1 fails | Must fix: the project loses its pinned versions and checksums |
| Lockfile changed, `package.json` didn't | check 4 prints nothing | Ask why in the report (for example `npm update`) |
| Only removed packages | the four counts are still equal and above 0 | Pass |
| A command errors or is refused, or a count is 0 while the lockfile exists | an error, or 0 | Not "Ready to merge": list it under what couldn't be checked |
| An entry that is a local link (`"link": true`) or bundled (`"inBundle": true`) | the npm-registry or checksum count is lower than the entry count | Must fix unless the report names the entry and says why it's there (none exist today) |

## Implementation Units

### U1. `.nvmrc`

- **Files:** `.nvmrc`, `readme.md` (Prerequisites, and a repo map row), `CLAUDE.md` (repo map row)
- **Requirements:** R1
- **Verification:** `cat .nvmrc` prints `24`, and `fnm use` (or `node -v` after it) picks Node 24.

### U2. The skills pin note

- **Files:** `CLAUDE.md`, `readme.md`, `document/skills/skills.md`
- **Requirements:** R2
- **Verification:** no file says the pin is needed because of Node; the only `22.20` left is skills.md's history sentence about why the pin started. `skills@1.5.18` still appears in each file.

### U3. Next.js leftovers

- **Files:** `.gitignore`, `CLAUDE.md`, `.claude/agents/code-reviewer.md`
- **Requirements:** R3
- **Verification:** `grep -rn -E '\.next/|next-env' .gitignore CLAUDE.md .claude/agents/ readme.md document/skills/` finds nothing. `git status --short --ignored` still lists only `.astro/`, `dist/` and `node_modules/`.

### U4. code-reviewer's lockfile check

- **Files:** `.claude/agents/code-reviewer.md`
- **Requirements:** R4
- **Verification:** the four counts are 755 each on today's lockfile. On task 06's diff (`8b057f7...06_react_app_setup`), check 3 prints `fsevents`, and step 2's filtered diff has no `package-lock.json` section. A copy of the lockfile in the scratch folder with one `resolved` URL changed to another host makes the npm-registry count drop. The agent's job doesn't change, so CLAUDE.md's Agents table stays as it is.

### U5. Learning doc

- **Files:** `document/learning/25_small_cleanups.md`

## Verification Contract

| Check | Passes when |
| --- | --- |
| U1 to U4 verifications | each prints what its unit says |
| `npm run lint`, `npm run typecheck`, `npm run build` | they pass, and `git status --short` stays clean |
| code-reviewer pass with the before-and-after snapshot | the snapshots match, and the verdict is recorded |

## Definition of Done

- U1 to U5 are committed on `25_small_cleanups`, one file per commit.
- The final code-reviewer pass says "Ready to merge", recorded in the same sitting as ticking Review.
- The compound question is answered.
- The owner merges the PR per CLAUDE.md step 9, then task 25 is marked done.
