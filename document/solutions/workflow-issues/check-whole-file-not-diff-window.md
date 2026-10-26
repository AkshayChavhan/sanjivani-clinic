---
title: Check the whole file on both sides, not a grep window on the diff
date: 2026-10-26
category: workflow-issues
module: code-reviewer
problem_type: workflow_issue
component: development_workflow
severity: medium
applies_when:
  - Writing a check that greps a git diff for a changed line and uses -B or -A to find a nearby line, such as the package name
  - Checking package-lock.json for new install scripts, other download hosts or missing checksums
  - Writing a review step where "no output" counts as a pass
  - Changing step 4 of .claude/agents/code-reviewer.md
root_cause: logic_error
tags: [git-diff, grep-context, package-lock, install-script, code-reviewer, silent-pass, lockfile-check]
---

# Check the whole file on both sides, not a grep window on the diff

## Context

Task 25 taught code-reviewer to check `package-lock.json` instead of reading it. One check looks for new install scripts: a lockfile entry with `"hasInstallScript": true` runs code on your machine during `npm install`.

The first version searched the diff, then looked a few lines up for the package's name:

```bash
git diff main...HEAD -- package-lock.json | grep -B5 '^+.*"hasInstallScript": true' | grep 'node_modules/'
```

That works for a brand-new package: the whole entry is new, so its name line sits right above. It fails for a package already in the lockfile that moves to a version that adds an install script. The name line doesn't change, so the diff shows it only as a context line, above every removed and added line. code-reviewer's first pass found this. A scratch diff for fsevents 2.3.2 to 2.3.3 shows it:

```diff
     "node_modules/fsevents": {
-      "version": "2.3.2",
-      "resolved": "https://registry.npmjs.org/fsevents/-/fsevents-2.3.2.tgz",
-      "integrity": "sha512-OLD",
+      "version": "2.3.3",
+      "resolved": "https://registry.npmjs.org/fsevents/-/fsevents-2.3.3.tgz",
+      "integrity": "sha512-NEW",
+      "hasInstallScript": true,
```

The name is 7 lines above the new line. `-B5` stops at `-      "resolved"`. The check printed nothing, which is exactly what a pass prints.

The plan had walked the check through its cases first (the lesson in `walk-new-procedures-through-every-case.md`). This case wasn't in the table until after the review (`295568b`).

## Guidance

1. **Don't look for a nearby line in a diff.** An unchanged line shows up only as context. How far it sits from the change depends on how many lines were removed and added in between. A bigger `-B` only moves the edge: a change with more lines in between goes past any number you pick.
2. **Check the whole file, on `main` and on the branch.** In the file, each entry is in one piece, so the name sits a few lines above the target line (4 lines for fsevents today). `git show main:<file>` reads `main`'s copy without switching branches.
3. **Pair every list with a count that must match.** Count the target lines on each side with `grep -c`, then list the names. If the number of names doesn't equal the count, the window missed one. You see a mismatch, not silence.
4. **Compare the two sides.** A name on the branch that isn't on `main` is new, whether the package is new or moved to a new version.

The check that replaced it is code-reviewer step 4.3 (`dbe8e3a`):

```bash
git show main:package-lock.json | grep -c '"hasInstallScript": true'                              # count on main
grep -c '"hasInstallScript": true' package-lock.json                                             # count on the branch
git show main:package-lock.json | grep -B6 '"hasInstallScript": true' | grep '^    "node_modules/'  # names on main
grep -B6 '"hasInstallScript": true' package-lock.json | grep '^    "node_modules/'                   # names on the branch
```

## Why This Matters

The old check failed open. A supply-chain check said nothing, and saying nothing looked like a pass. The reviewer would have let a new install script through.

The new `-B6` window isn't proven to reach the name every time either: a future npm could put more fields between them. The counts make that safe. A miss shows as fewer names than the count, and code-reviewer then holds back "Ready to merge" and lists it under what it couldn't check.

## When to Apply

- Any check on `package-lock.json`, or on another generated file that a reviewer checks instead of reads
- Any `grep -B` or `-A` on `git diff` output that needs a line from outside the changed lines
- Task 25's open follow-up, which changes code-reviewer step 4.2: a `sha1-` checksum is weaker, not missing (see the learning doc's "Review and lessons")

## Examples

On task 25's branch, the new check finds nothing new. Both counts are `1`, and both sides name the same package:

```text
count main:   1
count branch: 1
names main:   "node_modules/fsevents": {
names branch: "node_modules/fsevents": {
```

In the scratch repo from the learning doc (fsevents 2.3.2 on `main`, 2.3.3 with an install script on the branch), the old check printed nothing. The new one shows the change:

```text
count main:   0
count branch: 1
names main:   (none)
names branch: "node_modules/fsevents": {
```

## Related

- `document/learning/25_small_cleanups.md`: "Check that it works" and "Review and lessons"
- `document/plans/2026-10-26-1526-chore-small-cleanups-plan.md`: KTD4 and its case walk
- `document/solutions/workflow-issues/walk-new-procedures-through-every-case.md`: walk a new check through every case before the review. Add a row for where the changed lines sit in a diff
- `.claude/agents/code-reviewer.md`, step 4
- The commit IDs above are on task 25's branch. CLAUDE.md step 9 has the owner merge with a merge commit, which keeps them.
