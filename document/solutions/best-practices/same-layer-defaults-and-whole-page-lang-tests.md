---
title: Keep CSS defaults in the same layer as the rule that overrides them, and test lang on a whole page
date: 2026-10-27
category: best-practices
module: tailwind
problem_type: best_practice
component: frontend
severity: medium
applies_when:
  - Adding a CSS variable or rule to src/styles/global.css that a layered rule must be able to change, such as the :lang(hi), :lang(mr) rule in @layer base
  - Moving a rule into or out of the unlayered part of global.css, or after a tool such as shadcn rewrites the file
  - Building the real Hindi and Marathi pages, which set lang on <html>
  - A rule inside @layer base seems to do nothing
symptoms:
  - Whole Hindi or Marathi pages (lang set on <html>) kept the Latin line heights, 1.6 instead of 1.75, with no error or warning
  - A section with its own lang inside an English page looked right, so the browser check passed
resolution_type: code_fix
related_components: [documentation]
tags: [css-cascade-layers, unlayered-css, tailwind-v4, global-css, lang-attribute, devanagari, line-height, silent-failure]
---

# Keep CSS defaults in the same layer as the rule that overrides them, and test lang on a whole page

## Context

Task 07 gave the `type-*` utilities their line heights through variables: `--lh-display`, `--lh-h2`, `--lh-h3`, `--lh-lead`, `--lh-body` and `--lh-small`. The Latin values are the defaults. A `:lang(hi), :lang(mr)` rule inside `@layer base` swaps in taller ones for Devanagari.

At first, the Latin defaults sat in the big `:root` block near the top of `src/styles/global.css`, next to the palette. That block is **unlayered**: it is outside every `@layer`.

**An unlayered rule beats every layered rule, whatever its specificity.** (This is for normal declarations. With `!important` the order flips, and layered wins.) On a page with `<html lang="hi">`, both rules match the same element, `<html>`. The unlayered `:root` won, so `--lh-body` stayed 1.6 instead of 1.75. Nothing failed: lint, typecheck, build and the contrast test all passed.

**Why the browser check missed it.** The specimen page has `<html lang="en">` and tests Hindi and Marathi only in `<section lang="hi">` and `<section lang="mr">`. On a section, nothing competes: `:root` matches only `<html>`, so the section takes its value from the `:lang` rule, and its children inherit it. The bug shows only when the language is set on `<html>` itself, which is how the real Hindi and Marathi pages will work.

ce-code-review caught it (two reviewers, confidence 100) before the merge. The fix, `7870380` on the `07_design_system` branch, moved the defaults into `@layer base`, just above the `:lang` rule. It reaches `main` with task 07's pull request.

## Guidance

**1. A default that a layered rule must override goes in the same layer, above that rule.** This is how `global.css` looks after the fix (shortened):

```css
@layer base {
  :root {
    --lh-body: 1.6;          /* Latin default */
  }

  :lang(hi), :lang(mr) {
    --lh-body: 1.75;         /* wins on <html lang="hi"> */
  }
}
```

**Order matters inside the layer.** `:root` and `:lang(hi)` have the same specificity (one pseudo-class each), so the rule that comes later wins. Keep the defaults above the `:lang` rule.

**2. Use unlayered only for rules that must beat everything.** `global.css` has two on purpose: `letter-spacing: 0` on Devanagari, and the `:focus-visible` outline. They sit outside every layer so that no `tracking-*` or `outline-none` utility can undo them. The palette and shadcn tokens in the unlayered `:root` are safe today, because only the unlayered `.dark` rule changes them. Before adding a variable to that block, ask: "Will a rule inside a layer (for a language, a section or a theme) ever need to change this?" If yes, put it in `@layer base`.

**3. Test a language rule two ways.** Test a phrase or section inside an English page, and also a whole page. To test a whole page, open `/specimen` in the browser, then run this in the DevTools console:

```js
document.documentElement.lang = 'hi';
getComputedStyle(document.documentElement).getPropertyValue('--lh-body'); // expect "1.75"
document.documentElement.lang = 'mr';
getComputedStyle(document.documentElement).getPropertyValue('--lh-body'); // expect "1.75"
document.documentElement.lang = 'en';
getComputedStyle(document.documentElement).getPropertyValue('--lh-body'); // expect "1.6"
```

Before the fix, the first two would have printed `1.6`. Task 07 checked the fix the same way, by switching the specimen's `<html lang>` to `hi` and `mr` in Chrome: a plain paragraph went to 1.75.

## Why This Matters

Every page is in English, Hindi and Marathi (`document/product/brief.md`), so every Hindi and Marathi page would have had the bug. At 1.6, the marks above and below Devanagari letters can come close to the next line. No tool warns about it, so a review that only reads green checks would pass it. Only a computed-style check on a whole-page `lang` finds it.

## When to Apply

- Any change to the `--lh-*` variables, the `:lang` rule, or the unlayered `:root` block in `src/styles/global.css`.
- Any new rule meant to override something for one language, one section or one theme.
- Before the first real Hindi or Marathi page ships: run the console check on it, not only on the specimen.

## Examples

Before the fix (wrong), the default sat outside every layer:

```css
:root {
  --lh-body: 1.6;            /* unlayered: beats the layered :lang rule */
}

@layer base {
  :lang(hi), :lang(mr) {
    --lh-body: 1.75;         /* loses on <html lang="hi"> */
  }
}
```

After the fix (right): the example under Guidance, step 1.

## Related

- `document/learning/07_design_system.md`: the review result, and "Common mistakes"
- `design-system/sanjivani-clinic/MASTER.md`, Typography: the rule that the Latin line heights must never move to the unlayered `:root`
- `document/solutions/best-practices/tailwind-source-limit-in-global-css.md`: another check to run after anything rewrites `global.css`
- MDN: [`@layer`](https://developer.mozilla.org/en-US/docs/Web/CSS/@layer) and [`:lang()`](https://developer.mozilla.org/en-US/docs/Web/CSS/:lang)
