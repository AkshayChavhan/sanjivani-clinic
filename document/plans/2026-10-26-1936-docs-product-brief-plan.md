---
title: Product Brief - Plan
type: docs
date: 2026-10-26
artifact_contract: ce-unified-plan/v1
product_contract_source: ce-plan-bootstrap
execution: code
---

# Product Brief - Plan

**Task:** `26_product_brief` in `document/task/task.md`. `CLAUDE.md` wins over this plan.

## Goal Capsule

- **Objective:** Anyone starting a later task (the design system, the clinic data, the booking form) can check their choices against one short page. It says what the Sanjivani Clinic site is for, who uses it, what the first version must do, how it looks, which rules it follows and what it leaves out. The owner can see at a glance which backlog ideas fit and which need their decision.
- **Means:** one Markdown brief at `document/product/brief.md` (KTD1), listed in both repo maps and linked from the backlog note. The backlog check goes in a note under the backlog table (KTD3).
- **Authority:** `CLAUDE.md`, then the task 26 steps in `document/task/task.md`, then this plan. The owner's answers (Key Decisions) are fixed.
- **Stop and ask the owner if:** a section seems to need a clinic fact nobody has given (list it under "Still to confirm" instead, and never invent it); a change would edit, add, remove or reorder a backlog row; or a rule can only be stated by taking one side of a legal question.
- **Execution profile:** docs only. To prove it works: read the brief against each requirement, check every link, and confirm the backlog rows are unchanged.
- **Who finishes:** the main session commits on `26_product_brief` and stops at "ready to merge" (CLAUDE.md step 9).

## Product Contract

### Summary

Write a one-page product brief for the Sanjivani Clinic website from the owner's answers. Add it to the repo maps in readme.md and CLAUDE.md, and link it from the backlog note in task.md. Check each backlog idea against the brief, and write the verdicts under the backlog for the owner to act on.

### Problem Frame

The backlog (tasks 07 to 23) says "confirm each one with the product brief before it becomes a task", but no brief exists yet. The only description of the product is one line in CLAUDE.md and readme.md: "a fast, multilingual website where patients see the doctor, services and timings, and book an appointment". That line doesn't say the clinic treats skin, hair and nails. It doesn't name the languages or the look either, or the rules a doctor's website must follow in India.

Without a brief, task 07 would pick colours with no direction. Ideas like a BMI calculator (16) or a testimonials slider (17) could get built for a clinic they don't fit, and some may break medical advertising rules. The owner has now answered the product questions. This task writes the answers down where every session will find them.

### Requirements

**What the brief says**

- R1. It describes the clinic as the owner gave it: a dermatology clinic (skin, hair and nails) in Pune, with one doctor. *Changed after owner review (2026-10-27): skin and hair only. The owner's answer was "Dermatology (skin, hair)"; nails had been added in the planning request.*
- R2. It says who the patients are and what they come to the site to do.
- R3. It lists what the first version of the site must do.
- R4. It states the tone and the look: calm and trustworthy; deep leaf green (a nod to the Sanjivani herb); a warm saffron accent; warm off-white surfaces; high-contrast text; soft rounded corners. It says there is no logo or brand colours yet, and that task 07_design_system creates them.
- R5. It states the languages: English, Hindi and Marathi.
- R6. It states the constraints: India's medical advertising rules, factual claims only, patient consent for any photo or testimonial, and patient privacy for the booking form.
- R7. It lists what is out of scope, including online payment and Google reviews (not planned, the owner's choice).
- R8. It lists the clinic facts still missing, which task 10 fills in: the doctor's name, qualifications and registration number, the address, timings, fees and services.
- R9. It points to decisions made elsewhere instead of copying them: the stack (CLAUDE.md) and the booking route (backlog 15: a Google Sheet or email, with WhatsApp as the fallback).

**How it reads**

- R10. It fits on one page, in plain words a junior engineer can follow, and explains any term a reader may not know.
- R11. It states no clinic fact the owner hasn't given. Anything inferred is listed as an assumption for the owner to confirm.

**Where people find it**

- R12. The repo maps in readme.md and CLAUDE.md list it.
- R13. The backlog note in task.md links it.

**The backlog check**

- R14. Every backlog row, 07 to 23, gets a verdict against the brief with a short reason. The verdicts are written where the owner and task-planner will see them. No backlog row is changed, added or removed.

### Key Decisions

- **The owner's answers:** a dermatology clinic in Pune with one doctor; English, Hindi and Marathi; no logo or brand colours yet, so task 07 creates them; the look in R4. Governs R1, R4, R5. The task request gives these as decided, so this plan doesn't reopen them. KTD5 and KTD6 record the one challenge each got from research.
- **Decided in other files:** the stack (CLAUDE.md); the booking route (backlog 15); Google reviews and online payment are not planned (task.md). Governs R7, R9.
- **Changing the backlog stays the owner's call.** Governs R14.

### Scope Boundaries

- No backlog row is edited. The verdicts are proposals (R14).
- No clinic facts are filled in: that's task 10. No colours, fonts or logo are made: that's task 07.
- The privacy notice text and privacy page are not written here. The brief only says the site needs them, and the task that builds the form or the info pages writes them.
- The brief is in English only. It's a working doc for the team, not a page of the site.
- This is not a legal review. The brief names each rule and the careful default, and says the doctor confirms them before launch (KTD2).
- Considered and not built:
  - **The verdicts inside the brief.** They'd push the brief past one page, and they'd mix a dated check into a lasting doc. Revisit if the owner wants one product file.
  - **A separate backlog-check file.** One more file to find, and the verdicts belong next to the rows they judge.

#### Deferred to Follow-Up Work

- Pointers to the brief from the other places that use it: `document/skills/skills.md` (its frontend-design section, which says "the brief's own words win", and the line saying the product brief makes the final call), `.claude/agents/ui-engineer.md` and `.claude/agents/task-planner.md`, and the "The project" section of CLAUDE.md. The request names only the repo maps and the backlog note. Each pointer is one line. Suggest folding them into task 07, or a small task of their own. An agent file change also means updating CLAUDE.md's Agents table.

## Planning Contract

### Key Technical Decisions

- KTD1. **The brief's shape.** A short header, then eight sections in this order: The clinic; Patients and what they come to do; The first version; Tone and look; Languages; Rules the site follows; Out of scope; Still to confirm. The header gives the date, says the content comes from the owner's answers of 2026-10-26, says the owner decides any change to the brief, and says it isn't legal advice. Why: the order follows the request. Facts come first, rules near the end, and every open item sits in one place at the bottom, where task 10 will look.
- KTD2. **Rules are written as what the site does, citing each law by name only.** Each rule is one line: what the site does or never does, then the law or code it comes from, in brackets. No section numbers, regulation numbers or dates, unless the implementer checks them against the official source during this task and records that in the learning doc. The brief says these are careful defaults, not legal advice, and that the doctor confirms them before launch. The Maharashtra Medical Council or a lawyer can confirm them. The Rules section opens with two lines:
  - The rules assume a modern-medicine doctor registered with the Maharashtra Medical Council. The brief doesn't say which conduct code is in force now. That question goes under "Still to confirm".
  - The rules bind every language. The Hindi and Marathi text says what the English says, and no more, because a translation can turn "treatment" into "cure".

  A year that is part of a law's official title, like the 1954 in the Drugs and Magic Remedies Act, 1954, is part of its name and stays. Why: the planning session couldn't open any web source (WebSearch and WebFetch were denied), so every fact below comes from the research agent's memory. The names of the laws are stable. Numbers and dates are what memory gets wrong. The rules to state:
  1. Facts only: the doctor's name, recognised qualifications and registration number; the address, timings, fees and services. Specialist titles, such as "dermatologist", only with the matching qualification. (Indian Medical Council Professional Conduct, Etiquette and Ethics Regulations, 2002, cited by name only. The research says the NMC's 2023 conduct regulations are on hold, but that's a status claim nobody checked, so it stays out of the brief.)
  2. No self-praise: no "best", "No. 1", "guaranteed", "permanent", "100%", awards used as marketing, or comparisons with other doctors. (The same code; the Consumer Protection Act 2019 and its guidelines on misleading advertisements.)
  3. Never say a treatment cures any condition. Describe each service as "diagnosis and treatment of …". (Drugs and Magic Remedies (Objectionable Advertisements) Act, 1954, whose list includes leucoderma (vitiligo); the 2002 code's bar on boasting of cures. A rule for every condition needs no lookup in a list nobody has checked.)
  4. Pigmentation care in medical words. Never "fairness" or "whitening", and never suggest darker skin is a problem. (ASCI's guidelines on skin-lightening ads. They're self-regulation, not law for a website, so the brief marks this rule as a careful default.)
  5. No soliciting patients: no offers or discounts, no paid referrals, no asking for reviews, no product endorsements. (The 2002 code.)
  6. Patient photos and stories: KTD6.
  7. The booking form's privacy:
     - It asks only for a name, a phone number, a preferred day and time, and an optional short reason.
     - Next to the form, a short plain notice says what is collected, why, who receives it (the Sheet, the email or WhatsApp), how long it's kept and how to ask for deletion.
     - The consent box starts unticked.
     - The site has a privacy page and names a privacy contact.
     - The notice is in all three languages.
     - Only the clinic can open the Sheet, the inbox and the WhatsApp chat. Old entries are deleted after a set period, which goes under "Still to confirm".
     - Sources: the IT Act's 2011 privacy rules for sensitive personal data, which treat health information as sensitive and apply now; the Digital Personal Data Protection Act 2023 and its Rules, whose duties start in phases. Give no start dates.
  8. The form and WhatsApp are for booking, not medical advice, and the site gives no personal medical advice. (Telemedicine Practice Guidelines 2020, which apply once a doctor advises patients remotely.)

  If the implementer's session can use the web, it checks these sources on nmc.org.in, indiacode.nic.in, meity.gov.in and ascionline.in. It may then add what it confirmed, and say so in the learning doc. Research notes: see Sources.
- KTD3. **The backlog verdicts go in task.md as a note directly under the backlog table**, above the task 06 notes. It has a bold lead-in that names the brief, then a bulleted list (not a table, so the backlog-table check stays exact) with one line per row in row order: the row number, a verdict, "first version" or "later", and a reason of a few words. Three verdicts: Fits / Fits with a change / Doesn't fit, owner to decide. The table rows stay byte-for-byte the same. Why: the verdicts sit next to the rows they judge, where task-planner and the owner already look. The "Notes from task 06 for later tasks" list already set this pattern, and it keeps the brief short (Scope Boundaries).
- KTD4. **The draft verdicts.** The implementer starts here and re-checks each one against the finished brief. (The owner decided rows 12, 16 and 17 on 2026-10-27: drop the emergency strip, keep the BMI calculator, keep testimonials behind the doctor's written OK. task.md has the final verdicts.)

  | Row | Verdict | Why |
  | --- | --- | --- |
  | 07 design system | Fits with a change, first version | The brief sets its direction. Its goal should add a logo or wordmark, because task 07 creates them (Key Decisions). |
  | 08 layout shell | Fits, first version | Every page needs it. |
  | 09 home page | Fits, first version | Keep the one entrance animation calm, with its reduced-motion fallback. |
  | 10 clinic data and i18n | Fits, first version | It builds the clinic data file and the three languages. The facts stay clearly marked placeholders until the owner gives the real ones (the owner's choice for the backlog run, 2026-10-26). |
  | 11 info pages | Fits, first version | FAQ answers stay general and factual, with no personal medical advice. |
  | 12 quick actions | Fits with a change, first version | Call, WhatsApp, directions and the action bar fit. An "emergency strip" could suggest a skin clinic handles emergencies: owner to decide its wording, or drop it. |
  | 13 open-now badge | Fits, later | Useful, but patients can book without it. |
  | 14 appointment form | Fits with a change, first version | Its "time slots" are preferred times the clinic confirms, not reserved slots: a Sheet, an email or WhatsApp can't hold a slot. It must follow KTD2 rule 7. |
  | 15 booking backends | Fits, first version | Already decided. The clinic stays responsible for the patient data each service holds. |
  | 16 BMI calculator | Doesn't fit, owner to decide | BMI isn't part of skin, hair or nail care. Suggest dropping it. |
  | 17 testimonials slider | Doesn't fit, owner to decide | The doctors' code treats publishing patients' cure stories as self-promotion, even with consent (KTD6). Suggest dropping it, or parking it until the doctor confirms. |
  | 18 dark mode | Fits, later | Patients don't need it to book, and the brief's look is a light, warm off-white. |
  | 19 gallery | Fits with a change, later | Photos of the clinic, its rooms and equipment only. No patients, no before-and-after. |
  | 20 health blog | Fits with a change, later | Teaching articles under the doctor's name, with no self-promotion. Each article in three languages adds translation work. |
  | 21 SEO, schema, sitemap | Fits, first version | The schema uses facts only, with no ratings, since Google reviews aren't planned. |
  | 22 admin panel | Fits, later | Lets the clinic change timings and fees without code. The site can launch without it. |
  | 23 deploy to Vercel | Fits with a change, first version | Needed to launch. Before the site goes public, four things must be true: every placeholder is replaced with a real fact, the doctor has confirmed the brief's Rules section, a fluent reader has checked the Hindi and Marathi text against the Rules, and the privacy notice and page are ready. |
- KTD5. **Saffron is the accent, not a text or icon colour.** The challenge to the owner's look: a warm saffron on warm off-white is too pale for small text, and the owner also asked for high-contrast text. Any shade that still reads as saffron also falls below the 3:1 contrast that meaningful icons need. So the brief gives saffron only to:
  - decorative highlights;
  - large shapes;
  - button fills whose label is in the dark text colour.

  Body text stays dark on off-white, and leaf green carries headings and links. Meaningful icons (call, WhatsApp, directions) and focus rings use leaf green or the dark text colour. Task 07 sets the exact colours. It checks text against 4.5:1 contrast, and icons and other non-text parts against 3:1. This refines the owner's look and doesn't change it.
- KTD6. **For patient photos and testimonials, consent is the minimum, not a permission.** The challenge to the owner's constraint: the 2002 code bars "boasting of cures" or letting reports of them be published, even with the patient's consent, and the paused 2023 regulations reportedly banned testimonials and patient images outright. So the brief says two things. Any patient photo or story needs the patient's written consent (a parent's or guardian's for anyone under 18), and no one may be identifiable without it. Testimonials and before-and-after photos also stay off the site unless the doctor checks the current rules and decides otherwise. The owner's consent rule stands, and this adds the stricter reading for the doctor to settle. If the owner or doctor confirms the stricter reading, backlog 17 should be dropped (KTD4).

### Assumptions

These are bets made without the owner, since this run asked no questions. The owner confirms or corrects them when reviewing the pull request.

- The patients (R2): people in and around Pune with a skin, hair or nail problem. Some book for themselves, and others book for a child or an older relative. Most come on a phone, and they read English, Hindi or Marathi. What they come to do: check the doctor is qualified, see whether the clinic treats their problem, see the timings, fees and whether it's open, find the way, call or message, and request an appointment. The brief lists this under "Still to confirm", because it's drawn from the clinic type and city, not from data.
- The first version (R3) is CLAUDE.md's one-line description, plus the three languages and backlog 15's booking route. Three things are added because patients can't find the clinic or book safely without them: the address with directions, one-tap call and WhatsApp, and the privacy notice and page. It must also load fast on a phone, be readable, work with a keyboard and respect reduced motion. The form sends a booking request, not a confirmed booking: the patient picks a preferred day and time, and the clinic confirms by phone or WhatsApp. A Sheet, an email or WhatsApp can't hold a slot.
- "One page" means about 1,000 words or fewer.
- Which language the site opens in, and how its web addresses look, are left to task 10. The brief lists them under "Still to confirm".
- The brief holds no clinic facts, even after task 10. Task 10 puts them in its clinic data file, as marked placeholders until the owner gives the real values, so there is one copy.
- Whether the doctor's own photo goes on the site is the doctor's choice. The 2002 code calls a photo on a letterhead or signboard self-advertising and says nothing about websites. The brief lists it under "Still to confirm".

### Sources

- Research notes for KTD2 and KTD6: the National Medical Commission (Registered Medical Practitioner Professional Conduct) Regulations, 2023 are on hold, so the 2002 code applies. The Drugs and Magic Remedies Act's list of conditions includes leucoderma. The 2011 privacy rules apply in 2026, and the DPDP duties start in phases. None of this was checked against a live page: the research agent couldn't use the web either, and wrote from memory.
- Past lessons: `document/solutions/workflow-issues/check-new-steps-against-claude-md.md` (owner decisions stay open: R14, KTD3); `document/solutions/workflow-issues/update-learning-doc-after-later-steps.md` (U6); `document/solutions/workflow-issues/walk-new-procedures-through-every-case.md` (point to a rule rather than copy it: R9); `document/solutions/workflow-issues/check-whole-file-not-diff-window.md` (a check that prints nothing must not count as a pass: the Verification Contract's check 4).
- `document/skills/skills.md`: frontend-design reads the brief, and "the brief's own words win" over its style advice. That's why R4's look must be specific.

## Implementation Units

### U1. Write the brief

- **Goal:** `document/product/brief.md` exists and meets R1 to R11.
- **Requirements:** R1 to R11
- **Dependencies:** none
- **Files:** `document/product/brief.md` (new; the folder `document/product/` is new too)
- **Approach:**
  1. Follow KTD1's sections. The Rules section follows KTD2, KTD5 and KTD6.
  2. "Still to confirm" has two short lists:
     - The facts task 10 fills in (R8). Task 10 puts them in the clinic data file as marked placeholders, and the owner supplies the real values before launch.
     - The assumptions for the owner and the doctor: the patients, the opening language, the retention period, the privacy contact, the doctor's photo, testimonials (KTD6), and who at the clinic answers new booking requests and how fast. Also which conduct code applies (the doctor's council, and the version in force now), the doctor's sign-off on the Rules section (KTD2), and who, fluent in Hindi and Marathi, checks the site's text against the Rules.
  3. If the draft runs over 1,000 words, shorten the wording first, starting with the patients and first-version sections. Never drop an item that R1 to R11, KTD2, KTD5 or KTD6 requires. If it still doesn't fit, record the count in the learning doc and tell the owner at "ready to merge".
  4. Link to `../../CLAUDE.md` for the stack and `../task/task.md` for the backlog, instead of copying them (R9).
- **Patterns to follow:** readme.md and the learning docs: short sentences, bold leader words, tables only for five or more items of the same shape.
- **Test scenarios:**
  - Every part of the owner's answers in R1, R4 and R5 appears in the brief, worded as the owner gave it.
  - All seven missing facts in R8 appear under "Still to confirm".
  - No person's name, phone number, street address, rupee amount, clock time or registration number appears anywhere (R11).
  - No section number, regulation number or date is given for a law, unless the learning doc records the official page it was checked on (KTD2). A year inside a law's official title is part of its name.
  - Every relative link opens an existing file.
  - The word count is 1,000 or fewer (R10).
- **Verification:** a reader who knows nothing about the project can say, after one read, what the clinic is, what the site must do first, how it should look and what it must never claim.

### U2. Add the brief to the readme repo map

- **Goal:** the readme's repo map lists the brief (R12).
- **Requirements:** R12
- **Dependencies:** U1
- **Files:** `readme.md`
- **Approach:** one row right after the `document/task/task.md` row. It says what the brief is, in the readme's plain wording.
- **Test scenarios:** Test expectation: none -- one table row. The Verification Contract checks that it's there and that its path is right.
- **Verification:** the row's path matches the file U1 created.

### U3. Add the brief to the CLAUDE.md repo map

- **Goal:** sessions see the brief in the map they read at startup (R12).
- **Requirements:** R12
- **Dependencies:** U1
- **Files:** `CLAUDE.md`
- **Approach:** one row right after the `document/task/task.md` row. It says what the brief is for, and to read it before planning a feature or doing UI work. Nothing else in CLAUDE.md changes (Deferred to Follow-Up Work).
- **Test scenarios:** Test expectation: none -- one table row.
- **Verification:** the row's path matches the file U1 created, and the rest of the table is unchanged.

### U4. Link the brief from the backlog note

- **Goal:** the backlog's "confirm each one with the product brief" note links to the brief (R13).
- **Requirements:** R13
- **Dependencies:** U1
- **Files:** `document/task/task.md`
- **Approach:** turn "the product brief" in the backlog's first line into a link to `../product/brief.md`. Change nothing else in that line.
- **Test scenarios:** Test expectation: none -- one link.
- **Verification:** the link opens the brief from task.md's folder.

### U5. Record the backlog check

- **Goal:** every backlog row has a verdict that the owner can act on (R14).
- **Requirements:** R14
- **Dependencies:** U1, U4
- **Files:** `document/task/task.md`
- **Approach:** add the note from KTD3, starting from KTD4's draft verdicts. Re-check each verdict against the finished brief, and change any that no longer fits it. Each row the owner must decide says so.
- **Patterns to follow:** the "Notes from task 06 for later tasks" list in the same section.
- **Test scenarios:**
  - There are 17 verdict lines, one each for 07 to 23, in row order.
  - The diff of task.md changes no line of the backlog table.
  - Rows 16 and 17 carry "Doesn't fit, owner to decide". Row 12 is "Fits with a change", and its reason names the owner's choice about the emergency strip.
- **Verification:** the owner can read the note and know, for each row, whether to keep it, change it or drop it.

### U6. Learning doc

- **Goal:** `document/learning/26_product_brief.md`, written by learning-doc-writer from `document/learning/TEMPLATE.md`.
- **Requirements:** CLAUDE.md "Learning docs"
- **Dependencies:** U1 to U5
- **Files:** `document/learning/26_product_brief.md`, and its link in task.md's Tasks table
- **Approach:**
  1. Why: the backlog asked for a brief that didn't exist.
  2. What: the brief, the map rows, the link and the verdicts.
  3. How: the real steps.
  4. New terms: product brief, first version, scope, personal data, consent, colour contrast.
  5. Say plainly that the legal facts weren't checked against live sources (KTD2).
  6. Say ce-code-review was skipped, because it runs only for code changes (CLAUDE.md step 7) and this task changes only docs.
  7. Placeholders start with "Pending" (`update-learning-doc-after-later-steps.md`).
- **Test scenarios:** Test expectation: none -- prose doc. code-reviewer checks it.
- **Verification:** it answers Why, What and How, and every ticked step in task.md has its result in the doc.

## Verification Contract

The commands that contain `|` are in this block rather than in the table, so they copy cleanly (a table cell would need `\|`):

```bash
# 1. The owner's answers: every count is 1 or more
for t in dermatolog 'skin and hair' Pune 'one doctor' calm trustworthy 'leaf green' saffron 'off-white' 'high-contrast' rounded logo 'brand colo' 'task 07' English Hindi Marathi; do printf '%s: ' "$t"; grep -c -i -- "$t" document/product/brief.md; done
# 2. No law cited by number: no hits, or each hit is recorded as checked in the learning doc
grep -n -E '[Ss]ection [0-9]|[Ss]ec\. ?[0-9]|[Rr]egulation [0-9]|[Rr]ule [0-9]' document/product/brief.md
# 3. No law cited by date: every year printed is 1954, 2002, 2011, 2019, 2020 or 2023 (inside a law's title) or 2026 (the header date)
grep -n -o -E '(19|20)[0-9]{2}' document/product/brief.md
# 4. No backlog-table line changed, main against the working copy: prints "same", then 19 (header, separator and 17 rows)
diff <(git show main:document/task/task.md | sed -n '/^## Backlog/,/^## How to add/p' | grep '^|') <(sed -n '/^## Backlog/,/^## How to add/p' document/task/task.md | grep '^|') && echo same
sed -n '/^## Backlog/,/^## How to add/p' document/task/task.md | grep -c '^|'
```

Check 4 compares the whole table on both sides, so it works before and after committing. A diff of commits alone prints nothing while the edit is uncommitted, and that silence looks like a pass (`document/solutions/workflow-issues/check-whole-file-not-diff-window.md`).

| Check | Passes when |
| --- | --- |
| Commands 1 to 4 above | each prints what its comment says |
| `wc -w document/product/brief.md` | 1,000 or fewer. If over, follow U1 step 3 |
| The backlog-check note, from its bold lead-in to the next blank line | exactly 17 lines, 07 to 23 in order, each with one of KTD3's verdicts and "first version" or "later"; rows 16 and 17 say "Doesn't fit, owner to decide"; row 12's reason names the emergency-strip choice |
| A read of the brief against R1 to R11 | each requirement has a part of the brief that meets it, all seven facts in R8 are under "Still to confirm", and R11's banned items appear nowhere. The result goes in the learning doc's "Check that it works" |
| `grep -n 'document/product/brief.md' readme.md CLAUDE.md` | one map row in each file |
| `grep -n 'Proposed only.*](../product/brief.md)' document/task/task.md` | exactly one line: the backlog's intro line (task 26's own step already names the path, so a plain path search would pass before U4) |
| Every relative link in the changed files | opens an existing file |
| `npm run lint`, `npm run typecheck`, `npm run build` | they pass, and `git status --short` stays clean |
| code-reviewer, with the before-and-after snapshot from CLAUDE.md step 7 | the snapshots match, and the verdict is recorded in the learning doc |

## Definition of Done

- The plan is linked from task 26's plan step, and that step is ticked.
- U1 to U6 are committed on `26_product_brief`, one file per commit. Tracker ticks are commits of their own.
- Every check in the Verification Contract passes.
- The final code-reviewer pass says "Ready to merge", recorded in the same sitting as ticking Review.
- The compound question is answered in the learning doc.
- The owner merges the pull request (CLAUDE.md step 9), then task 26 is marked done.
