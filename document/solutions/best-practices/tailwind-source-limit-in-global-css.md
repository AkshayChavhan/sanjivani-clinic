---
title: Keep Tailwind's scan limited to src/, and check it with canary classes
date: 2026-10-26
category: best-practices
module: tailwind
problem_type: best_practice
component: frontend
severity: medium
applies_when:
  - Running shadcn init, shadcn apply or any preset change, which rewrite src/styles/global.css
  - Rewriting or regenerating src/styles/global.css, by hand or with a tool
  - Moving global.css to another folder
  - Adding another stylesheet that imports tailwindcss
  - Reviewing a diff that touches the Tailwind import line
related_components: [tooling]
tags: [tailwind, tailwind-v4, source-detection, global-css, shadcn, css-size, canary-check]
---

# Keep Tailwind's scan limited to src/, and check it with canary classes

## Context

Tailwind v4 builds CSS only for the class names it finds in your files. By default it looks through the whole repo. This repo is full of class names that the site never uses: the skill data in `.claude/` and the markdown in `document/`.

Task 06 limited the scan with one token on line 1 of `src/styles/global.css` (commit `f64fcfa`):

```css
@import "tailwindcss" source("../");
```

`source("../")` is relative to the stylesheet itself. `global.css` lives in `src/styles/`, so `../` means `src/`.

Task 06 measured two builds, made before shadcn init:

| Build | CSS size | Canary rules |
| --- | --- | --- |
| Without `source("../")` | 26,218 bytes | both present |
| With `source("../")` | 4,660 bytes | none |

**Nothing fails when the line is lost.** The build still succeeds without it (task 06 built it both ways), and lint and typecheck never look at the scan. The only sign is a bigger CSS file. shadcn init (4.22.1) kept the line in `28e579a`, but that was checked by hand, not promised. A later `shadcn apply`, a new preset or a rewrite of the file could drop it.

## Guidance

After anything rewrites `src/styles/global.css`, run these checks.

1. **The line survived.** Line 1 must still be the import with `source("../")`:

   ```bash
   head -1 src/styles/global.css
   # expect: @import "tailwindcss" source("../");
   ```

2. **Build fresh, then test both ways.** A stale `dist/` proves nothing, so build first. Then check a class the page really uses (the positive control, which shows the check can find a rule), and the two canaries (which must be absent):

   ```bash
   npm run build
   grep -c -F '.type-body' dist/_astro/*.css    # positive control: expect 1
   grep -c -F 'w-\[200px\]' dist/_astro/*.css   # canary: expect 0
   grep -c -F 'w-\[900px\]' dist/_astro/*.css   # canary: expect 0
   ```

   The backslashes are there because the built CSS escapes the brackets in the selector. `type-body` is on the placeholder page in `src/pages/index.astro` (it replaced `text-3xl` in task 07). When that page changes, use any class the site really uses.

3. **Keep the canaries honest.** A canary is a class that appears outside `src/` but never inside it. If it ever shows up in the built CSS, the scan is leaking. Today `w-[200px]` is in `.claude/skills/ui-ux-pro-max/data/stacks/shadcn.csv` and `w-[900px]` is in `.claude/skills/ui-ux-pro-max/data/stacks/html-tailwind.csv`. Both are also in `document/`. Before you trust a canary, confirm both halves:

   ```bash
   grep -rlF 'w-[200px]' src/                  # expect: nothing
   grep -rlF 'w-[200px]' .claude/ document/    # expect: at least one file
   ```

   If the site starts using a canary class, pick a new one with the same two checks.

**Moving the stylesheet changes what `../` means.** Moved up one folder, straight into `src/`, `../` becomes the repo root, and the limit silently disappears. Moved one folder deeper, `../` becomes `src/styles/`, and the page's classes vanish. Update the path in the same commit as the move.

**Every stylesheet that imports `tailwindcss` needs its own limit.** Give a new one the same `source(...)` (relative to where that file lives), and check its built CSS the same way.

## Why This Matters

The full scan made the CSS more than five times bigger, all with classes the site never uses. Patients download that CSS before the page can show, and this site is meant to be fast. No check catches the loss, so a review that only reads green checks would pass it. And the file that holds the line is exactly the file that shadcn and theme work rewrite most.

## When to Apply

Run the three checks whenever a task touches `src/styles/global.css` or adds another Tailwind stylesheet. That includes the design-system and preset work planned for task 07.

## Related

- `document/learning/06_react_app_setup.md`, "New ideas in this task" (the measurement) and "Try it yourself" (the same check as an exercise)
- `document/plans/2026-10-25-1400-chore-astro-react-app-setup-plan.md`, KTD5 (why the tools skip `.claude/` and `document/`)
- Tailwind: [Detecting classes in source files](https://tailwindcss.com/docs/detecting-classes-in-source-files)
