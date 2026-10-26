# 25_small_cleanups: .nvmrc, stale notes, old .next/ lines, and a lockfile check

> **Branch:** 25_small_cleanups · **Date:** 2026-10-26 · **Status:** In progress

**Plan:** [2026-10-26-1526-chore-small-cleanups-plan.md](../plans/2026-10-26-1526-chore-small-cleanups-plan.md). **Solution doc:** Pending (the compound question comes after the review).

## In one minute

- **`.nvmrc`** now names Node 24. Run `fnm use` in the repo, and fnm switches to it.
- **The `skills@1.5.18` note** now gives the true reason for the pin: it's the installer version we used, and newer ones haven't been checked. The old reason (Node below 22.20) stopped being true when you moved to Node 24.
- **The `.next/` lines are gone** from `.gitignore`, CLAUDE.md and code-reviewer. They came from an early guess that the site would use Next.js.
- **code-reviewer no longer reads `package-lock.json`.** It checks it with four counts that must match, and compares install scripts between `main` and the branch, so a bad lockfile still gets caught.

## Why: the problem we solved

Four leftovers from earlier tasks, listed in the backlog notes from task 06. The biggest one: code-reviewer read every changed file in full, including the lockfile. In task 06 that file was about 10,500 lines that npm wrote, which buried everything else in the review.

The four were grouped into one task because each is a few lines, and with pull requests every task costs you a merge.

## What: what changed

| File | Change | Why |
| --- | --- | --- |
| `.nvmrc` | Added | Names Node 24 for fnm and nvm |
| `readme.md` | Changed | Mentions `.nvmrc` and `fnm use`, and gives the real reason for the skills pin |
| `CLAUDE.md` | Changed | `.nvmrc` in the repo map, the skills pin reason, and `.next/` dropped from the generated folders |
| `document/skills/skills.md` | Changed | The skills pin reason |
| `.gitignore` | Changed | `.next/` and `next-env.d.ts` removed |
| `.claude/agents/code-reviewer.md` | Changed | `.next/` dropped, and a new step 4 checks the lockfile instead of reading it |
| `document/plans/2026-10-26-1526-chore-small-cleanups-plan.md` | Added | The plan (its install-script check was updated after review) |
| `document/task/task.md` | Changed | Task 25's status, ticked steps, and the learning-doc link |

## How: step by step

1. **Planned**, then had four reviewers check the plan. They found real holes in the first lockfile check:
   - It compared two counts that disappear together, so an entry with *neither* a URL nor a checksum passed (0 = 0).
   - A mistyped command prints the same silence as a pass.
   - A deleted lockfile looked like "only removed packages".
   - Step 2's plain `git diff` would still print the whole lockfile.

   The new check counts on the whole file and needs four equal numbers above 0, so none of those can pass quietly.
2. **Walked the check through every case** before writing it (the lesson from task 24). The table is in the plan.
3. **Made the four changes**, one file per commit.
4. **Reviewed with code-reviewer.** It found one must fix and two suggestions. All three are fixed (see "Review and lessons").

## New ideas in this task

- **`.nvmrc`:** a one-line file that names a Node version. fnm and nvm switch to it when you run `fnm use` or `nvm use`. Vercel doesn't read it: it uses its Project Settings or `package.json`'s `engines`.
- **Lockfile entry fields:** for each package, `package-lock.json` records `"resolved"` (where npm downloaded it) and `"integrity"` (a `sha512-` checksum, which proves the download wasn't changed).
- **Install script:** code that a package runs on your machine during `npm install`. It's worth knowing about each one.

## Check that it works

`.nvmrc` and fnm:

```text
$ cat .nvmrc
24
$ fnm use
Using Node v24.22.1
```

The lockfile check on today's lockfile, all four equal and above 0:

```text
entries 755, resolved 755, npm-reg 755, sha512 755
```

On a scratch copy with one URL changed to a look-alike host (`https://registry.npmjs.org.evil.example/...`), the npm-registry count drops, so the check catches it:

```text
entries 755, resolved 755, npm-reg 754, sha512 755
```

On task 06's diff, step 2's new diff has no lockfile section:

```text
$ git diff 8b057f7...06_react_app_setup -- . ':(exclude)package-lock.json' | grep -c '^diff --git a/package-lock.json'
0
```

That filtered diff is 1,532 lines, down from 12,028.

The install-script check on today's branch. The counts and names match on both sides, so nothing is new:

```text
count main:   1
count branch: 1
names main:   "node_modules/fsevents": {
names branch: "node_modules/fsevents": {
```

In a scratch repo where `main` has fsevents 2.3.2 with no install script, and the branch moves it to 2.3.3 with one, the first version of the check (`grep -B5` on the diff) printed nothing. The new check catches it:

```text
old check:    (no output, exit 1)
count main:   0
count branch: 1
names main:   (none)
names branch: "node_modules/fsevents": {
```

No file names `.next/` any more (`grep` exit 1 means no matches), and git still ignores the right folders:

```text
$ grep -rn -E '\.next/|next-env' .gitignore CLAUDE.md .claude/agents/ readme.md document/skills/
(no output, exit 1)
$ git status --short --ignored
!! .astro/
!! dist/
!! node_modules/
```

## Review and lessons

**code-reviewer, first pass: Needs changes.** Lint, typecheck and build passed, and git was unchanged after the review (same status, last commit and branches).

- **Must fix, fixed:** task.md's row 25 didn't link this learning doc (`3322de7`).
- **Suggestion, fixed:** the install-script check searched the diff with `grep -B5`. It printed nothing when a package already in the lockfile moved to a version that adds an install script: the package's name line doesn't change, so it sits about 7 lines above the new line, out of reach. Now the check counts and names install scripts on the whole file, on `main` and on the branch, and the number of names must equal the count (`dbe8e3a`). A scratch repo confirmed the old check missed the case and the new one catches it.
- **Suggestion, fixed:** step 4.2 said a low URL count meant a missing checksum. It now says what each low count means, and lets a local link or bundled entry pass if the report explains it, as the plan said (`1149c9e`).
- The plan's check and case table now match (`295568b`).

**code-reviewer, second pass:** Pending.

**Compound:** Pending.

## Common mistakes

- **Expecting `.nvmrc` to switch Node by itself.** Run `fnm use`, or turn on fnm's `--use-on-cd` option.
- **Trusting a check that prints nothing.** A broken command prints nothing too. A count that must match another count can't fail quietly.
- **Comparing two fields that vanish together.** Count the entries too, so a missing pair shows up.
- **Searching a diff for a line near the change.** An unchanged line, like a package's name, can sit further from the change than `grep -B` looks. Check the whole file on both sides instead.

## Try it yourself

About 5 minutes, and it changes nothing:

1. Run the four counts from code-reviewer's step 4 on `package-lock.json`. Do you get 755 four times?
2. Find `fsevents` in `package-lock.json` (`grep -n '"node_modules/fsevents"' package-lock.json`) and read the few lines below it. Which line says it runs an install script?

## Learn more

- [npm: package-lock.json](https://docs.npmjs.com/cli/v11/configuring-npm/package-lock-json/)
- [fnm (Fast Node Manager)](https://github.com/Schniz/fnm)
- [Vercel: supported Node.js versions](https://vercel.com/docs/functions/runtimes/node-js/node-js-versions)
