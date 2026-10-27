# Design System Master File

> **LOGIC:** When building a specific page, first check `design-system/sanjivani-clinic/pages/[page-name].md`.
> If that file exists, its rules **override** this Master file.
> If not, strictly follow the rules below.

---

**Project:** Sanjivani Clinic
**Direction:** A, Herbarium (chosen by the owner on 2026-10-27, over B Sahyadri and C Signboard)
**Written by hand** in task 07 on 2026-10-27, in the shape of ui-ux-pro-max's MASTER.md. Never regenerate it with `search.py --persist --force`: the tool suggested medical teal, which conflicts with the brief.
**Order of authority:** the [product brief](../../document/product/brief.md) ("Tone and look" and "Rules") wins over this file, and accessibility wins over everything.
**Plan:** [2026-10-27-1151-feat-design-system-plan.md](../../document/plans/2026-10-27-1151-feat-design-system-plan.md)

---

## Global Rules

### Color Palette

Each colour is named once, as a `--brand-*` variable in `:root` in `src/styles/global.css`. shadcn's semantic tokens point at them. Components use the semantic tokens (`bg-primary`, `text-muted-foreground`), never a raw hex value. The brand components (leaf mark, wordmark) read the `--brand-*` variables directly, so a local change to `--primary` or `--ring` never recolours the logo.

| Role | Hex | CSS Variable | Use it for |
|------|-----|--------------|------------|
| Leaf green | `#1E5236` | `--brand-leaf` → `--primary`, `--ring`, `--secondary-foreground` | headings' accents, links, primary buttons, focus outline |
| Ink | `#1B2620` | `--brand-ink` → `--foreground`, `--card-foreground`, `--accent-foreground` | all body text |
| Muted | `#55635A` | `--brand-muted` → `--muted-foreground` | secondary text (a text colour, not shadcn's `--muted` background) |
| Off-white | `#F6F4EC` | `--brand-off-white` → `--background`, `--primary-foreground` | the page; labels on leaf |
| Paper | `#FFFDF7` | `--brand-paper` → `--card`, `--popover` | cards, menus, dialogs, form fields |
| Sage | `#E4EBDD` | `--brand-sage` → `--muted`, `--secondary`, `--accent` | bands, secondary buttons, hover and highlight wash |
| Saffron | `#E3A23A` | `--brand-saffron` → `bg-saffron` only | decoration, large shapes, fills with an ink label |
| Hairline | `#D9DDD0` | `--brand-hairline` → `--border` | dividers and card borders only |
| Field edge | `#76837A` | `--brand-field-edge` → `--input` | the edges of form fields (added for the 3:1 floor) |
| Error red | `#B42318` | `--brand-error` → `--destructive` | error text and borders (added for the 4.5:1 floor) |

**Saffron rules.** The only saffron utilities are `bg-saffron` with `text-saffron-foreground` (ink), and the leaf mark's own veins. Saffron is never text, a meaningful icon, a border or a focus ring: it is 2.01:1 on the page. Leaf green on saffron is 4.10:1, so a saffron fill always takes an ink label. `--accent` is sage, not saffron: in shadcn, `--accent` is the hover wash, and saffron there would flash on every hover.

**Never use:** saffron text, leaf text on saffron, and the hairline as a form-field edge (1.25:1).

**On a leaf-green area,** set `[--ring:var(--brand-off-white)]` on the area, so the focus outline turns off-white (8.24:1). A light card inside that area inherits the off-white ring, so set `[--ring:var(--brand-leaf)]` back on the card. Plain text links on green need their own class (for example `text-primary-foreground underline`), because the default link colour is leaf.

**The contrast check.** `npm run test` runs `scripts/check-contrast.mjs`. It reads the hex values from `global.css` and checks every pair below, and it scans `src/` for any saffron class other than `bg-saffron`. Its table decides which pairs are checked; add a row whenever a new pairing appears. It isn't part of `npm run build`, and there is no CI yet, so run it before every merge. Output on 2026-10-27:

```text
Pairs the site uses:
pass               14.18:1  (needs 4.5)  Body text on the page
pass               15.35:1  (needs 4.5)  Body text on cards
pass               12.81:1  (needs 4.5)  Body text on sage bands
pass                5.75:1  (needs 4.5)  Muted text on the page
pass                6.22:1  (needs 4.5)  Muted text on cards
pass                5.19:1  (needs 4.5)  Muted text on sage bands
pass                8.24:1  (needs 4.5)  Leaf text and links on the page
pass                8.92:1  (needs 4.5)  Leaf text and links on cards
pass                7.44:1  (needs 4.5)  Leaf label on sage (secondary button)
pass                8.24:1  (needs 4.5)  Off-white label on leaf (primary button)
pass                7.06:1  (needs 4.5)  Ink label on saffron (saffron fill)
pass                5.97:1  (needs 4.5)  Error text on the page
pass                5.39:1  (needs 4.5)  Error text on sage bands
pass                5.07:1  (needs 4.5)  Error text on its 10% tint
pass                6.46:1  (needs 4.5)  Error text on cards
pass               12.81:1  (needs 4.5)  Hover and highlight text (accent)
pass               15.35:1  (needs 4.5)  Menu and dialog text
pass                8.24:1  (needs 3)  Focus outline on the page
pass                8.92:1  (needs 3)  Focus outline on cards
pass                8.92:1  (needs 3)  Focus outline on menus and dialogs
pass                7.44:1  (needs 3)  Focus outline on sage bands
pass                8.24:1  (needs 3)  Off-white focus outline on leaf
pass                3.60:1  (needs 3)  Field edge on the page
pass                3.90:1  (needs 3)  Field edge on cards
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

**Dark mode** is task 18. The `.dark` block is still shadcn's grey default, and nothing applies `.dark`.

### Typography

- **Headings:** Martel 700 and 800. **Everything else:** Mukta 400, 500 and 700. Both families cover Latin and Devanagari. Neither has italics, so emphasis uses weight.
- `--font-heading` is Martel and `--font-sans` is Mukta. `h1` to `h6` use Martel by default, and so do shadcn's CardTitle and DialogTitle.
- Only these five weights are loaded. Adding a weight adds a download (see "Font weight" below).

**CSS import** (in `src/styles/global.css`, below the first three imports; line 1 never moves):

```css
@import "@fontsource/mukta/400.css";
@import "@fontsource/mukta/500.css";
@import "@fontsource/mukta/700.css";
@import "@fontsource/martel/700.css";
@import "@fontsource/martel/800.css";
```

Each file declares every script with a `unicode-range`, so a browser downloads the Devanagari file only when the page shows Devanagari in that face.

**Type scale.** Use these `type-*` utilities for text a patient reads. Sizes are in rem, so they grow when a patient raises the browser's text size. Display, h2 and lead grow smoothly from phone (375px) to desktop (1440px).

| Utility | Font | Phone | Desktop | Latin line height | Devanagari line height |
|---------|------|-------|---------|-------------------|------------------------|
| `type-display` | Martel 800 | 36px | 60px | 1.15 | 1.4 |
| `type-h2` | Martel 700 | 24px | 36px | 1.25 | 1.45 |
| `type-h3` | Martel 700 | 21px | 21px | 1.3 | 1.45 |
| `type-lead` | Mukta 400 | 18px | 21px | 1.6 | 1.7 |
| `type-body` | Mukta 400 | 18px | 18px | 1.6 | 1.75 |
| `type-small` | Mukta 400 | 16px | 16px | 1.5 | 1.7 |

The Devanagari values were checked on the specimen page (`/specimen`) on 2026-10-27 in Chrome at 375 to 1440px: no marks touch the next line, so they weren't changed. Text a patient must read is never smaller than 16px. Body text is 18px at every width.

The Latin line heights are set in `@layer base`, just above the `:lang` rule. They must never move to the unlayered `:root`: an unlayered rule beats every layered one, and whole Hindi or Marathi pages would keep the Latin values (ce-code-review caught this in task 07).

### Spacing Variables

Tailwind's 4px steps are the spacing scale; there are no custom `--space-*` tokens.

| Token | Value | Usage |
|-------|-------|-------|
| `--space-xs` → `1` | 4px | tight gaps, icon to label |
| `--space-sm` → `2` | 8px | inline gaps, label to field |
| `--space-md` → `4` | 16px | gaps between controls; page gutter on phones |
| `--space-lg` → `6` | 24px | card padding |
| `--space-xl` → `8` | 32px | between groups |
| `--space-2xl` → `12` | 48px | between sections on phones |
| `--space-3xl` → `16` | 64px | page gutter on desktop |

- **Page gutters:** 16px on phones (`px-4`), 64px from 640px up (`sm:px-16`).
- **Sections:** 48px apart on phones, 72px on desktop (`py-12`, `sm:py-18`).
- **Reading width:** body text at most about 65 characters (`max-w-[65ch]`).
- **Corners:** 10px for controls (`rounded-lg`, which is `--radius`) and 14px for containers (`rounded-xl`).

### Shadow Depths

No shadow on cards. Hairlines and sage bands separate content instead. Floating layers (menus, dialogs, popovers) keep shadcn's own shadow.

---

## Component Specs

These map each part to shadcn variants and tokens. None is installed yet; task 08 adds the first ones (see "Before the first `shadcn add`").

### Buttons

- `default`: `bg-primary text-primary-foreground` (leaf with an off-white label).
- `outline` and `secondary`: a leaf label (`text-primary` or `text-secondary-foreground`).
- A saffron button: `bg-saffron text-saffron-foreground` only.
- All buttons: `min-h-11` (44px), `rounded-lg` (10px), Mukta 700.
- Links styled as buttons set their own look; they aren't underlined.

### Cards

`bg-card` (paper), `border border-border` (hairline), `rounded-xl` (14px), no shadow.

### Inputs

`bg-card`, `border border-input` (field edge), `rounded-lg`, `min-h-11`, and 18px text (`text-[1.125rem]`), so iPhones don't zoom in. Labels sit above the field. Errors are `type-small text-destructive`, joined to the field with `aria-describedby`, and the field gets `aria-invalid="true"`.

### Modals

`bg-popover` (paper), `rounded-xl`, the title in Martel (shadcn's DialogTitle does this through `--font-heading`). Every Dialog, Sheet and Drawer has a title.

---

## Style Guidelines

**Style:** Herbarium. Calm and trustworthy: plain words, short sentences, no hype. Warm off-white pages, dark text, leaf green for headings' accents, links and actions, and saffron as a small warm accent.

**The one memorable element** is a line-drawn leaf, like a pressed herbarium specimen (a nod to the Sanjivani herb). Task 09 builds it for the home page's hero. It is 300×390 on the board: a leaf-green outline and veins, a saffron midrib running into the stem, and lines about 2.5px and 1.6px wide. It is decorative (`aria-hidden="true"`), and its thin lines must stay visible when it's drawn smaller.

### Page Pattern

The home page (task 09): the headline and the two actions ("Request an appointment" and "Call the clinic") beside the specimen leaf, then a sage band with the timings, the address and the doctor.

---

## Languages and Devanagari

- Every page sets `<html lang>` to `en`, `hi` or `mr`. Marathi is `mr`, never `hi`.
- Every phrase in another language carries its own `lang` (for example `<span lang="mr">संजीवनी</span>` inside English).
- The `:lang(hi), :lang(mr)` rule gives the `type-*` utilities and Tailwind's own line heights (`text-sm` to `text-9xl`, `leading-*`) their Devanagari values. It also turns off fake italics, so emphasis (`em`, `i`, `cite`) in Hindi and Marathi is bold instead.
- English text inside a Hindi or Marathi page keeps the taller Devanagari line heights. That's looser than needed, but never clipped.
- Plain text gets the taller line height only where the language starts (the page, or a phrase with its own `lang`), so a link inside a heading keeps the heading's line height.
- Letter-spacing on Devanagari is always 0: it breaks the line that joins the letters. An unlayered rule enforces it, so no `tracking-*` class can switch it back on.
- `leading-none` and `truncate` clip Devanagari marks. Never use them on text that can be Hindi or Marathi.
- **Each `shadcn add` is checked** for `leading-none`, `truncate`, and `text-xs` or `text-sm` on text a patient reads. Raise those to `text-base` or a `type-*` utility.
- **Astro whitespace:** Astro drops the line break between a word and an element that starts the next line ("A" + `<a>` became "Alink" on the specimen). Keep a word and the inline element after it on the same line.

## Brand marks

| File | What it is | Notes |
|------|------------|-------|
| `src/components/brand/LeafMark.astro` | The 40×40 leaf: leaf-green body, saffron midrib and four veins | Decorative (`aria-hidden`). `size` prop, default `1em`. Draws in system colours in Windows contrast themes. |
| `src/components/brand/Wordmark.astro` | The leaf mark, "संजीवनी" (Martel 800, leaf, `lang="mr"`) and "Sanjivani Clinic" (Mukta 500, ink, `lang="en"`) | Every size is in em: set `font-size` on it or its parent to scale it. At 1rem the leaf is 44px and the lockup is 58px tall on English, Hindi and Marathi pages alike. Wrap it in an `<h1>` or the header's home link. Screen readers read both lines; there's no `aria-label`. |
| `public/favicon.svg`, `public/favicon.ico` | The leaf and midrib only, on a paper tile | The only brand files with fixed hex colours. Keep them in step with LeafMark by hand. The `.ico` is a 32×32 PNG made from the SVG with the `sharp` that Astro installs (the command is in the task 07 learning doc). |

Smallest sizes: the leaf mark reads at 16px. Keep the wordmark at font-size 1rem or more, so its English line stays at least 16px. The wordmark's two names have a real space between them in the page text, so copied text reads "संजीवनी Sanjivani Clinic".

The favicon and this file hold copies of the palette's hex values, and `npm run test` doesn't compare them with `global.css`. When a palette colour changes, change them by hand.

## Focus and touch targets

- Keyboard focus is a solid 2px outline in `--ring` (leaf), with a 2px gap. An unlayered `:focus-visible` rule draws it on links, buttons, form fields, `summary`, `[tabindex]` and the option, menu-item, tab, checkbox, radio and switch roles. It also turns off shadcn's half-transparent ring shadow, which is too faint (about 2.5:1). A component's `outline-none` can't hide it.
- Plain links in text are underlined before any hover, with the line 0.2em below the text so it clears the marks under Devanagari letters. Leaf next to ink is only 1.7:1, and phones have no hover. The rule matches links with no `class` attribute at all: a link with any class, even `class=""`, gets no colour or underline, so give every styled link its own look.
- Buttons, `[role="button"]` and `summary` show the hand cursor (a base rule).
- Patient-facing controls are at least 44px tall (`min-h-11`), including task 08's language switch.
- Highlighted options in menus, selects and comboboxes need a cue that isn't only colour (sage on paper is 1.2:1), such as an inset outline. Add it when the first one is installed (task 14).

## Status meanings

- **Success:** leaf text on sage, with an icon.
- **Attention:** a saffron fill with ink text and an icon.
- **Error:** `text-destructive`, with an icon and words that say how to fix it.
- Never colour alone. Tasks 13 and 14 add status tokens when they need them.

---

## Motion

- At most one calm moment when a page loads (task 09), lasting 150 to 300ms. No fade-up on every section.
- GSAP runs through `useGSAP` and `gsap.matchMedia()`, with a still version for `(prefers-reduced-motion: reduce)`.
- CSS animations and transitions (including shadcn's dialogs) finish at once under "reduce motion": a global rule in `global.css` handles that.

---

## Anti-Patterns (Do NOT Use)

- Saffron text or icons, and leaf text on saffron.
- Letter-spacing or italics on Devanagari.
- Patient-facing text under 16px.
- `leading-none` or `truncate` on Devanagari.
- A shadow on every card, all-caps labels, and arrows added to button text.
- Raw hex values in components (use the tokens).
- Any word the brief's rule 2 bans ("best", "No. 1", "guaranteed", "100%", "painless", "miracle", "permanent"), even in sample text.

### Additional Forbidden Patterns

- Emoji as icons (use SVG: the project's Lucide icons, or the brand marks).
- Testimonials, reviews or before-and-after photos, unless the brief's rule 6 is met.

---

## Pre-Delivery Checklist

Before delivering any UI code, verify:

- [ ] No emojis used as icons (use SVG instead)
- [ ] All icons from a consistent icon set
- [ ] `cursor-pointer` on all clickable elements
- [ ] Hover states with smooth transitions (150-300ms)
- [ ] Light mode: text contrast 4.5:1 minimum, and `npm run test` passes
- [ ] Focus states visible for keyboard navigation
- [ ] `prefers-reduced-motion` respected
- [ ] Responsive: 375px, 768px, 1024px, 1440px, with no sideways scroll (and 320px)
- [ ] All three scripts render in Martel and Mukta
- [ ] Devanagari line heights checked: no marks touch the next line, nothing clipped
- [ ] 44px touch targets
- [ ] `lang` set on the page and on every phrase in another language
- [ ] Each added shadcn component checked for `leading-none`, `truncate`, `text-xs` and `text-sm`

## Before the first `shadcn add` (task 08)

- **An open owner decision:** base-nova's controls are 32px tall, under the 44px floor. Either keep base-nova and size each patient-facing control up to 44px, or switch to a roomier shadcn style while no component exists yet. A style change needs `shadcn init --force`, so the owner decides first.
- **A design call:** a Devanagari phrase inside an English heading makes that line much taller, because a phrase with its own `lang` gets the body line height (a 60px display line grows from about 69px to about 105px). Decide before the wordmark or a Hindi phrase goes in a heading: limit the rule to block elements, or give headings their own value.
- **Recheck the focus rule:** `[tabindex]` also matches `tabindex="-1"` popups, and the rule's `box-shadow: none` removes a component's shadow while it has focus. No installed component is affected yet.

## Font weight

Downloads measured on 2026-10-27 (woff2):

| Page | Files | Total |
|------|-------|-------|
| English (the placeholder) | Mukta 400 and 500 Latin, Martel 800 Devanagari (the wordmark) | about 86 KB |
| A typical Hindi or Marathi page | Mukta 400 Devanagari, Mukta 400 and 500 Latin, Martel 700 and 800 Devanagari | about 228 KB |

Each Mukta Devanagari weight is about 100 KB, so bold Hindi or Marathi text adds about 100 KB more. Task 08 preloads one file per page, chosen by language.
