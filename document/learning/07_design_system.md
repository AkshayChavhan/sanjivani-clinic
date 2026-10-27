# 07_design_system: The Herbarium design system

> **Branch:** 07_design_system · **Date:** 2026-10-27 · **Status:** In progress

**Plan:** [2026-10-27-1151-feat-design-system-plan.md](../plans/2026-10-27-1151-feat-design-system-plan.md). **Design system:** [MASTER.md](../../design-system/sanjivani-clinic/MASTER.md). **Solution doc:** [same-layer-defaults-and-whole-page-lang-tests.md](../solutions/best-practices/same-layer-defaults-and-whole-page-lang-tests.md).

## In one minute

- The site now has its own look, **Herbarium**, the direction you chose: leaf green, dark ink text, warm off-white, a saffron accent and a pressed-leaf mark.
- **Martel** (headings) and **Mukta** (text) replace Geist. Both have Devanagari letters, so Hindi and Marathi show in the clinic's own fonts.
- **Line heights follow the language.** Hindi and Marathi lines sit further apart than English ones, so the marks above and below the letters have room.
- **`npm run test` now checks colour contrast**, and fails loudly when a colour gets too pale.
- New files for task 08: the leaf mark, the wordmark, a new favicon, a hidden `/specimen` page, and `MASTER.md`, the written rules.

## Why: the problem we solved

The brief describes the look in words only. The app still wore shadcn's grey defaults and the Geist font. Geist has no Devanagari letters, so Hindi and Marathi text would fall back to whatever font the phone has.

Task 08 (header and layout) needs the colours, type and wordmark settled first. Without one written, checked source, every later task would pick its own, and the pages would drift apart.

## What: what changed

| File | Change | Why |
| --- | --- | --- |
| `src/styles/global.css` | Changed | Fonts, colours, type scale, language line heights, focus, links, motion |
| `scripts/check-contrast.mjs` | Added | The contrast check behind `npm run test` |
| `package.json`, `package-lock.json`, `eslint.config.js` | Changed | Martel and Mukta in, Geist out; the `test` script; Node names for `scripts/` |
| `src/components/brand/` | Added | `LeafMark.astro` and `Wordmark.astro`, ready for task 08 |
| `public/favicon.svg`, `public/favicon.ico` | Replaced | The leaf instead of Astro's logo |
| `src/pages/index.astro`, `src/pages/specimen.astro` | Changed, added | The wordmark on the placeholder; a hidden page showing the whole system |
| `design-system/sanjivani-clinic/MASTER.md` | Added | The design system, written by hand |
| `document/plans/2026-10-27-1151-feat-design-system-plan.md` | Added | The plan |
| `CLAUDE.md`, `readme.md`, `skills.md`, the Tailwind lesson | Changed | Point at MASTER.md, `scripts/` and `npm run test`; the lesson checks for `.type-body` now |
| `document/task/task.md` | Changed | Steps, and notes for tasks 08, 09, 14, 18, 21 and 23 |

## How: step by step

1. **Three directions, and your choice (2026-10-27).** Claude showed you three contrast-checked boards on a private claude.ai page (https://claude.ai/artifact/1irMQ9JkDmpD1undTY2yZE; only you can open it): **A Herbarium** (Martel and Mukta, a pressed-leaf drawing, the Devanagari name first), **B Sahyadri** (Anek Devanagari, wide headlines, layered hills) and **C Signboard** (Eczar and Hind, a green signboard header). ui-ux-pro-max's own idea, medical teal with Figtree and Noto, was set aside, because the brief wins. You chose A (`44ff7dd`).

2. **Plan** (`a0990e8`, linked in `793933e`). ce-plan ran headless, meaning one prompt with no chat (`claude -p '/compound-engineering:ce-plan …' --allowedTools …`), with no web access. Five document reviewers checked it, and it applied 8 fixes. To meet the contrast floor, it added two colours (a **field edge** `#76837A` for form fields and an **error red** `#B42318`), gave saffron its own token (a named colour; see "New ideas"), and swapped the half-transparent focus ring (about 2.5:1) for a solid outline.

3. **Build, one unit at a time.**
   - **U1 Fonts** (`6f751c1`). First, the npm check (re-run for this doc):

     ```text
     $ npm view @fontsource/martel@5.3.0 version license scripts
     version = '5.3.0'
     license = 'OFL-1.1'
     $ npm view @fontsource/mukta@5.3.0 version license scripts
     version = '5.3.0'
     license = 'OFL-1.1'
     ```

     No `scripts` line means no install scripts, and OFL-1.1 is a free font licence. Then both were installed and Geist uninstalled (not re-run here: installs change files). npm's "install-scripts" warning about `fsevents` predates this task.
   - **U2 Palette and tokens** (`2fe2892`): ten `--brand-*` colours, with shadcn's tokens pointing at them. `.dark` is untouched.
   - **U3 Contrast check** (`3e75896`). To prove it can fail, `--brand-muted` was set to `#8A958C`: 3 pairs failed and it exited with 1. Then the value was restored.
   - **U4 Type scale** (`df3ab9c`): six `type-*` classes, taller Hindi and Marathi line heights, and no letter-spacing on Devanagari.
   - **U5 Focus, links, motion** (`ea6deb6`): the solid outline, underlined text links, and a "reduce motion" rule. The plan's optional `color-scheme: only light` rule (A11) was **not** added: a planning reviewer suggested dropping it, nobody checked Chrome's docs, and Android's auto-dark is off by default.
   - **U6 Leaf mark, wordmark, favicon** (`e473897`, `658816a`, `7192be2`). This one-off command made the `.ico` from the SVG, with the `sharp` image library Astro already installs. It isn't committed as a script:

     ```bash
     node --input-type=module -e "import sharp from 'sharp'; await sharp('public/favicon.svg', { density: 384 }).resize(32, 32).png({ palette: true }).toFile('public/favicon.ico');"
     ```

     `density: 384` draws the SVG large before shrinking it, so it stays sharp. `palette: true` makes a small PNG with a colour table, the same format as Astro's original.
   - **U7 Pages** (`036a863`, `cff2304`), **U8 MASTER.md** (`61b0116`, by hand, never `--persist --force`), **U9 Docs** (`c151d21`, `d2fd1f8`, `d3442e5`, `b65be7b`, `bfaf9b7`, `045631c`).

4. **Browser check (2026-10-27).** Claude checked both pages in your Chrome, through the Claude in Chrome extension, on `astro preview` (it serves the built site locally):
   - All five font weights loaded. No sideways scroll at 320, 375, 768, 1024 or 1440px, or at 200% text size at 375 and 768.
   - Line heights, English vs Hindi and Marathi: body 1.60 vs 1.75, display 1.15 vs 1.40, h2 1.25 vs 1.45, small 1.50 vs 1.70. `text-sm` in Hindi got 1.70; `tracking-tight` computed to 0.
   - The wordmark was 58.2px tall in all three languages. Every control was at least 44px. Tab showed a solid 2px leaf outline with a 2px gap (off-white on the green area).
   - With the web fonts removed, Devanagari fell back to system fonts, unclipped.
   - **Not tested:** forced colours and reduced motion (the extension can't switch them on; only their CSS was confirmed in the build), and no screen reader.
   - **Found and fixed:** "A link on sage" rendered as "Alink" (see "Common mistakes").

5. **ce-code-review, then fixes** (see "Review and lessons").

## Decisions worth knowing

- **Two layers, and the "muted" trap.** The palette layer names each colour once (`--brand-leaf: #1E5236`), and shadcn's tokens point at it (`--primary: var(--brand-leaf)`). The `--brand-` prefix matters: the palette's "muted" (`#55635A`) is a *text* colour, but shadcn's `--muted` is a *background* (sage here).
- **Saffron has its own token.** shadcn's `--accent` is the hover wash on buttons and menus, so saffron there would flash on every hover. `--accent` stays sage, and saffron is only ever `bg-saffron text-saffron-foreground` (ink on saffron, 7.06:1).
- **A solid outline, outside every layer.** shadcn's 50% ring is about 2.5:1, under WCAG's 3:1. The new outline is *unlayered* (see "New ideas"), so a component's `outline-none` can't hide it, and Windows contrast themes keep it.
- **Line heights follow `lang`.** Each `type-*` class reads a variable such as `--lh-body`, and the `:lang` rule swaps in taller values. It also sets Tailwind's own `--text-sm--line-height` and friends, for future shadcn components.
- **The contrast check is `npm run test`.** There's no test framework, and code-reviewer may run `npm run test` but not `node`. Never-use pairs must fail and black on white must be 21:1, so broken maths can't pass quietly.

## New ideas in this task

- **Design token:** a named value, such as a colour, used instead of the raw value. Change it once and everything follows.
- **Semantic token:** a token named for its job, not its look, such as `--primary` or `--destructive`.
- **Palette layer:** our `--brand-*` variables, one per colour. The semantic tokens point at them.
- **Contrast ratio:** how far apart two colours are in brightness, from 1:1 to 21:1 (black on white).
- **WCAG:** the Web Content Accessibility Guidelines. Version 2.2 asks for 4.5:1 for normal text, and 3:1 for icons, field edges and focus outlines.
- **Font subset and `unicode-range`:** each font comes as one file per script (Latin, Devanagari…). `unicode-range` says which letters a file covers, so the browser fetches the Devanagari file only when a page shows Devanagari.
- **`font-display: swap`:** show a system font at once, then swap in the web font when it arrives. Fontsource sets it.
- **The Devanagari headline (शिरोरेखा, *shirorekha*) and its marks:** the line along the top that joins the letters. Vowel marks sit above and below, so Devanagari needs taller lines, and letter-spacing breaks the headline.
- **`:lang()`:** a CSS selector that matches by language. `:lang(hi)` matches every element inside a `lang="hi"` page or phrase.
- **`@utility`:** Tailwind v4's way to define your own class, such as `type-body`.
- **`:focus-visible`:** matches focus that came from the keyboard, not a mouse click.
- **Forced colours:** a mode, such as Windows contrast themes, where the system replaces the page's colours.
- **Favicon:** the small icon in the browser tab.
- **Cascade layer (`@layer`):** a named group of CSS rules; Tailwind uses layers. A rule outside every layer ("unlayered") beats every layered rule, whatever its specificity.

## Check that it works

The contrast check, run for this doc (22 passing lines cut, marked `…`):

```text
$ npm run test
Pairs the site uses:
pass               14.18:1  (needs 4.5)  Body text on the page
…
pass                8.24:1  (needs 3)  Focus outline on the page
pass                3.25:1  (needs 3)  Field edge on sage bands

Never-use pairs (each must fail):
fails, as expected  2.01:1  (needs 4.5)  Saffron text on the page
fails, as expected  4.10:1  (needs 4.5)  Leaf text on saffron
fails, as expected  1.25:1  (needs 3)  Hairline as a form-field edge
fails, as expected  4.29:1  (needs 4.5)  Error text on a 20% error tint

Control: black on white is 21.00:1 (must be 21.00)

Saffron scan: 6 files in src/, 0 banned saffron classes (pattern self-test passed)

All 31 checks passed: 25 pairs, 4 never-use pairs, the control and the saffron scan.
```

Also run for this doc: `npm run lint` exited 0, `npm run typecheck` reported 0 errors, 0 warnings and 0 hints, and a fresh `npm run build` printed `2 page(s) built` and `Complete!`. Then:

```text
$ head -1 src/styles/global.css
@import "tailwindcss" source("../");
$ grep -c -F '.type-body' dist/_astro/*.css
1
$ file public/favicon.ico
public/favicon.ico: PNG image data, 32 x 32, 8-bit colormap, non-interlaced
```

**Font weight.** The `.woff2` files each kind of page loads total 88,272 bytes (86 KiB) for the English page and 233,772 bytes (228 KiB) for a typical Hindi or Marathi page. Each extra Mukta Devanagari weight adds about 100 KB. You left the choice to Claude (2026-10-27): all five weights stay, because most of a Hindi page's weight is the Devanagari body font it needs anyway. Revisit if task 09 measures a slow load.

**shadcn style.** Also left to Claude: base-nova stays, and each patient-facing control is sized up to 44px as it's added. Switching styles needs `shadcn init --force`, which can rewrite the theme in `global.css`, and even a roomier style would still need resizing.

The rest is pasted from the final run of the plan's Verification Contract (its checklist), not re-run here:

```text
== tailwind scan
positive control .type-body: 1
canary w-[200px]: 0, w-[900px]: 0
canaries in src/: 0, outside src/: 5
== type-* built
type-display:1 type-h2:1 type-h3:1 type-lead:1 type-body:1 type-small:1
== fonts built
Martel @font-face: 6, Mukta @font-face: 10, Geist: 0
Devanagari woff2 files: 5
== tokens kept
main 32, branch 42, missing on branch: []
.dark unchanged: True
== lockfile
entries 756, resolved 756, npm-reg 756, sha512 756
install scripts main/branch: 1 / 1
```

A *canary* is a class found only outside `src/`. If one showed up in the built CSS, Tailwind would be scanning the wrong files. "Tokens kept" means no token name from `main` went missing.

One label is wrong. The checklist's search counted every `font-family:Mukta` in the built CSS, not only the `@font-face` rules, so its "Mukta @font-face: 10" includes the page's own `html{font-family:Mukta,…}` rule. The real count is 15 `@font-face` rules: 6 for Martel and 9 for Mukta (three subsets for each of the five weights). Either way, Geist is 0.

## Review and lessons

**ce-code-review: Ready with fixes.** It ran report-only and headless, with six reviewers and the second-model check off. Its one real bug was a P2 (moderate), found by two reviewers with confidence 100. The Latin `--lh-*` values sat in the unlayered `:root`, which beats every `@layer` rule, so a whole `<html lang="hi">` page would have kept 1.6 instead of 1.75. The specimen missed it: it only tested a `<section lang="hi">` inside an English page. The fix moved those values into `@layer base`, above the `:lang` rule (`7870380`). Then Claude switched the specimen's `<html lang>` to `hi` and `mr` in Chrome, and a plain paragraph went to 1.75.

Also fixed from its notes:

- Devanagari line heights for `text-5xl` to `text-9xl`, bold emphasis in Hindi and Marathi, and a hand cursor on buttons (`f50d5cc`).
- A real space between the wordmark's two names, so copied text reads "संजीवनी Sanjivani Clinic" (`8348482`).
- Four more contrast pairs, the never-use "error text on a 20% tint" (4.29:1), and the saffron scan with its self-test (`abfde8f`). Failure test: a scratch file using `text-saffron` made it exit 1, then was deleted.
- The specimen's second wordmark at 1.5rem instead of 0.75rem, so its English line never drops under 16px (`4acfd23`).
- Notes in MASTER.md (`cf515fe`) and task.md (`3022697`).

**Left for task 08** (MASTER.md, "Before the first `shadcn add`"): base-nova's 32px controls versus the 44px floor (your call; switching needs `shadcn init --force`), a Devanagari phrase that makes a heading line much taller, and the focus rule also matching `tabindex="-1"` popups. **Known and accepted:** English text inside a Hindi page keeps the looser Devanagari line heights.

**code-reviewer, first pass: Ready to merge**, with no must fixes, and git unchanged before and after. It re-ran every number in this doc and got the same results, down to the byte. Its five suggestions, all fixed:

1. **A generated page file could quietly override MASTER.md.** MASTER.md kept the template's rule that `pages/<page>.md` overrides it, and ui-ux-pro-max's `--persist` writes such a file even without `--force`, from its own medical-teal idea. Now MASTER.md says page files are hand-written too, and CLAUDE.md and skills.md say never to run `--persist` here (`7603104`, `3e5d729`, `5c6177c`, `f375887`).
2. **The saffron scan missed some forms:** side borders (`border-t-saffron`), `ring-offset-saffron`, opacity (`bg-saffron/50`) and arbitrary values (`text-(--color-saffron)`). The scan now bans every saffron class except `bg-saffron` and `text-saffron-foreground`, and its self-test covers those forms (`36490e0`). A scratch file with three of them made it exit 1, then was deleted. MASTER.md now says it can't check pairings: each `bg-saffron` still needs an ink label, checked by eye.
3. **MASTER.md's never-use list missed the fourth pair** (error text on a 20% tint, 4.29:1). Added there and to the anti-patterns (`7603104`).
4. **The spacing table listed `--space-*` variables that don't exist.** It now shows each role's Tailwind class instead (`7603104`).
5. **`--color-leaf` was registered but unused.** Removed: leaf green goes through the semantic tokens (`f16ddbe`).

**code-reviewer, second pass: Ready to merge**, with no must fixes, and git unchanged. Two suggestions, both fixed:

1. **The saffron scan still missed two forms:** opacity in brackets (`bg-saffron/[0.5]`) and arbitrary properties (`[color:var(--brand-saffron)]`). We added them to the self-test first, and it failed, which proved the gap. Then we widened the pattern; the self-test passed, and a scratch file with both forms made the check exit 1 (`d37bb75`).
2. **Two rule files disagreed about `--force`.** The `f375887` rewording made CLAUDE.md say "never", while skills.md still said "never without asking". "Never" is the rule now, since MASTER.md is hand-written, and skills.md says so (`a480517`). This is stricter than before task 07.

**code-reviewer, third pass: Ready to merge**, with no must fixes, and git unchanged. It confirmed both second-pass fixes, and also traced the saffron pattern against forms its self-test doesn't list (`[&>p]:text-saffron`, `text-saffron!`): both are caught. Two doc suggestions, both fixed:

1. "Try it yourself" said the undo command throws away *unsaved* changes. It throws away *uncommitted* ones, including saved edits. Fixed, and it now shows the clearer `git restore`.
2. task.md's brief-pointer note still began "07 or its own small task", though task 07 left that work out. It now says "Its own small task" (`d61ff8c`).

These were wording fixes after the final pass, so there was no fourth pass.

**Compound:** we asked, "If this lesson weren't written down, would a future session repeat the mistake or redo the investigation?" Yes. The unlayered-`:root` bug was silent (lint, typecheck, build and `npm run test` all passed), and our own browser check missed it because it tested Hindi only inside an English page. Tasks 08 and 10 set `<html lang>` and will edit `global.css`, and no saved lesson covered cascade layers. We ran the lightweight command, and it wrote [same-layer-defaults-and-whole-page-lang-tests.md](../solutions/best-practices/same-layer-defaults-and-whole-page-lang-tests.md) (`✓ Documentation complete (non-interactive lightweight mode)`). We read it in full: its code matches `global.css` and `7870380`, and it adds a console check for whole Hindi and Marathi pages.

## Common mistakes

- **An unlayered rule silently beating a layered one.** Nothing warns you. If a layered rule "does nothing", look for an unlayered rule that sets the same property on the same element.
- **Testing a language rule only on a nested section.** `<section lang="hi">` and `<html lang="hi">` hit different rules. Test both a phrase and a whole page.
- **Astro dropping whitespace.** Astro drops the line break between a word and an element that starts the next line. So `A` and then `<a>…</a>` on the next line became "Alink". Keep the word and the element on one line.
- **Using saffron as text.** It's 2.01:1 on the page. `npm run test` now fails on `text-saffron`, `border-saffron` and similar classes in `src/`.

## Try it yourself

About 5 minutes. Nothing stays changed.

1. In `src/styles/global.css`, change `--brand-muted: #55635A;` to `#8A958C`, then run `npm run test`. Among its lines you should see these, and it exits with 1. (We ran it on a scratch copy outside the repo, and kept only these lines.)

   ```text
   FAIL                2.82:1  (needs 4.5)  Muted text on the page
   FAIL                3.05:1  (needs 4.5)  Muted text on cards
   FAIL                2.55:1  (needs 4.5)  Muted text on sage bands
   The check failed. Problems found: 3
   ```

   Undo it with `git restore src/styles/global.css` (the older `git checkout -- src/styles/global.css` does the same). It puts the file back to its last committed version, so it throws away every *uncommitted* change to that file, including edits you've already saved. Then run `npm run test` again: all 31 checks pass.
2. Run `npm run dev` and open the specimen page (usually http://localhost:4321/specimen). Press Tab a few times. Where does the outline turn off-white? Compare the gaps between lines in the English and Hindi paragraphs. Stop the server with Ctrl+C.

## Learn more

- [WCAG 2.2: Contrast (Minimum)](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html) and [Non-text Contrast](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html)
- [MDN: `@layer`](https://developer.mozilla.org/en-US/docs/Web/CSS/@layer)
- [MDN: `:lang()`](https://developer.mozilla.org/en-US/docs/Web/CSS/:lang)
- [Tailwind CSS: adding custom utilities](https://tailwindcss.com/docs/adding-custom-styles#adding-custom-utilities)
- [Fontsource: Martel](https://fontsource.org/fonts/martel) and [Mukta](https://fontsource.org/fonts/mukta)
