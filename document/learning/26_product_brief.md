# 26_product_brief: A one-page product brief for the clinic site

> **Branch:** 26_product_brief · **Date:** 2026-10-26 · **Status:** In progress

**Plan:** [2026-10-26-1936-docs-product-brief-plan.md](../plans/2026-10-26-1936-docs-product-brief-plan.md). **Solution doc:** [check-legal-rules-against-official-sources.md](../solutions/workflow-issues/check-legal-rules-against-official-sources.md).

## In one minute

- **New: [the product brief](../product/brief.md).** It's one page, 999 words (the plan's limit is 1,000). It covers the clinic (dermatology, in Pune, one doctor), its patients, what the first version must do, the look, the three languages, the rules and what's left out.
- **Every later task checks its choices against it.** Both repo maps list it, and the backlog note links to it.
- **All 17 backlog ideas got a verdict** in a note under the backlog table. Two don't fit (16 BMI calculator, 17 testimonials slider), and you decide what happens to them. No backlog row changed.
- **The legal rules were checked on official websites.** The plan's legal facts came from memory, and that memory was out of date. On 6 October 2026 the National Medical Commission (NMC) issued new advertising guidelines, and they rule out testimonials.
- Docs only. No app code changed.

## Why: the problem we solved

The backlog said "confirm each one with the product brief before it becomes a task", but there was no brief. The product's only description was one line in CLAUDE.md. That line didn't say what the clinic treats, which languages the site uses, how it should look, or which rules a doctor's website in India must follow.

You were about to start 07_design_system, which picks the colours and fonts. With no direction, it would have picked them blind. So the brief came first, as a task of its own.

## What: what changed

| File | Change | Why |
| --- | --- | --- |
| `document/product/brief.md` | Added | The brief, in eight sections |
| `document/plans/2026-10-26-1936-docs-product-brief-plan.md` | Added | The plan, written by ce-plan |
| `readme.md` | Changed | A repo-map row for the brief |
| `CLAUDE.md` | Changed | A repo-map row: read the brief before planning a feature or doing UI work |
| `document/task/task.md` | Changed | Task 26's row and steps, a link to the brief in the backlog note, the backlog check, and a note of the follow-up pointers to the brief |

## How: step by step

1. **Asked you the product questions** (in chat, 2026-10-26). Your answers:
   - The clinic is a specialist clinic for dermatology (skin and hair), in Pune, with one doctor.
   - The site is in English, Hindi and Marathi.
   - There's no logo and there are no brand colours yet, so the design system creates new ones.
   - The look is "calm and trustworthy": leaf green, a warm saffron accent and a warm off-white.
   - The brief is its own task, done before 07. We recommended this option.

   Then task 26 was added to task.md and set to In progress (`378e90b`).

2. **Planned in a fresh, headless process** (`1cda371`, linked in `807d178`). This session started before the Compound Engineering plugin was set up. A running session only sees what existed when it started, which is also why code-reviewer runs in a fresh process. So ce-plan ran like this:

   ```bash
   claude -p '/compound-engineering:ce-plan …the task request…' --allowedTools "Read" "Glob" "Grep" "Write" "Edit" "Agent" "Task" "Skill" "Bash(git log *)" "Bash(git show *)" "Bash(git status *)" "Bash(git diff *)" "Bash(git branch *)" "Bash(git rev-parse *)" "Bash(ls *)" "Bash(cat *)" "Bash(mkdir *)" "Bash(date *)" "Bash(python3 *)"
   ```

   - `-p`: print mode. Claude runs one prompt with no chat, prints the result and exits.
   - `--allowedTools`: the tools it may use without asking. Its git commands only read (`log`, `show`, `status`, `diff`, `branch`, `rev-parse`). The list isn't a hard wall, though: `Write` can write any file, and `python3` could run anything, git included. So the real check came after: `git status --short` showed only the new plan file, and `git log` showed no new commit.

   ce-plan wrote the plan, had five document reviewers check it, applied 14 fixes and stopped. The main session read the whole plan, then committed it. (We didn't run this again for this doc, because it writes a file.)

   **One gap:** the planning process couldn't use the web, so every legal fact in the plan came from memory. The plan knew this. Its KTD2 (Key Technical Decision 2) says to cite laws by name only: no section numbers, and no dates unless someone checks them on the official page and records the check here.

3. **Checked the legal facts on official websites.** A research subagent with web search checked them on 2026-10-26. It read nmc.org.in, indiacode.nic.in, ascionline.in, meity.gov.in, the government's press office (PIB) and prsindia.org. A news report (medicaldialogues.in) and some law-firm notes served only as second sources.

   | Source | What it means for the site |
   | --- | --- |
   | **NMC guidelines on ethical advertising**, 6 October 2026 (new, in force at once) | Show the doctor's name, qualifications and registration number. No "Best doctors", "No. 1 Specialist", "Guaranteed cures", "100% success", "painless treatment" or "Miracle treatment". A patient's consent doesn't make a testimonial or a before-and-after picture allowed. Doctors may not ask for reviews or share them. A doctor's photo isn't allowed where it's used as self-advertisement. WhatsApp counts as advertising. |
   | **The 2002 code** (the Indian Medical Council's conduct regulations) | Still in force, because the NMC's 2023 regulations have been on hold since 23 August 2023. No boasting of cures, even with consent. A doctor can claim to be a specialist only with the matching qualification. Fees may be stated publicly. |
   | **Drugs and Magic Remedies Act, 1954** | Its skin entries are leprosy, leucoderma and lupus. A 2020 draft would have added fairness, ageing and greying, but it was never passed. |
   | **ASCI's guidelines on fairness ads** (2014). ASCI is the Advertising Standards Council of India | Don't show darker skin as worse. ASCI's rules are voluntary, not law. |
   | **Digital Personal Data Protection (DPDP) Act, 2023 and its Rules** (13 November 2025) | Most duties start about May 2027. Until then the IT Act's 2011 rules apply, and they treat medical records as sensitive. |
   | **Telemedicine Practice Guidelines, 2020** | Still current. A chat that only books visits is probably not a consultation, but the subagent found no rule that says so. |
   | **Consumer Protection Act, 2019** and its 2022 guidelines on misleading ads | Apply to every ad. Medical care counts as a service (the Supreme Court's V.P. Shantha case). This part rests partly on second sources. |

   **What this changed.** The plan had left testimonials for the doctor to decide (its KTD6). The NMC guidelines settle that question, so the brief's rule 6 is "No testimonials or before-and-after photos", and backlog 17's verdict cites the guidelines. Rules 2 and 5 also gained the NMC's words: "painless", "miracle", and no promotional WhatsApp messages. The brief calls the guidelines "issued in October 2026". As KTD2 requires, here is the record: that date was checked on the [official NMC notice](https://www.nmc.org.in/whats-new/download/1874) (Public Notice R-13014/01/2024-Ethics, dated 6 October 2026). The notice is a scanned PDF, so the subagent read it with OCR, which is software that turns a picture of text into text.

   The plan asked this doc to say the legal facts weren't checked against live sources. The check happened after the plan was written, so this doc records the check instead.

4. **Wrote the brief** (`8f7291f`). It has the plan's eight sections, in order: the clinic, patients, the first version, tone and look, languages, rules, out of scope, and still to confirm. It says "skin, hair and nail", because dermatology covers nails too and the plan's R1 asks for those words. We made two fixes along the way:
   - The first draft was 1,165 words, and the plan caps the brief at 1,000. Following the plan, we shortened the patients and first-version sections first. That got it to exactly 1,000 without dropping any required item.
   - Check 2 (below) flagged "(rule 6)". That was the brief pointing at its own rule, not citing a law by number. We changed it to "(see the Rules)", so the check stays clean for the next person who runs it.
5. **Made the brief easy to find:** a row in the readme's repo map (`b7dfbdd`), a row in CLAUDE.md's (`659ecd2`), and a link from the backlog note (`693d9de`).
6. **Checked the backlog against the brief** (`fd90550`). This is a bulleted note under the backlog table, with one line per row:
   - **Fits:** 08, 09, 10, 11, 15 and 21 (first version); 13, 18 and 22 (later).
   - **Fits with a change:** 07 (add a logo or wordmark), 12 (you decide the "emergency strip" wording), 14 (preferred times, not reserved slots) and 23 (four conditions before launch), all first version; 19 and 20, later.
   - **Doesn't fit, owner to decide:** 16 BMI calculator, 17 testimonials slider.
7. **Ticked the brief and backlog steps** (`8c36f2a`).
8. **Reviewed with code-reviewer, in two passes.** Both said Ready to merge, with no must fixes. The first pass's six suggestions are fixed, which took the brief from 1,000 to 999 words. The second pass checked those fixes (see "Review and lessons").

**Skipped:** ce-code-review. CLAUDE.md step 7 runs it only for code changes, and this task changes only docs.

## Decisions worth knowing

- **Saffron is an accent, not a text colour.** Warm saffron on warm off-white is too pale for small text or for icons that carry meaning. So saffron gets highlights, large shapes and button fills with dark labels. Text stays dark, and leaf green carries headings, links, icons and focus rings. Task 07 picks the exact shades and checks their contrast.
- **Laws by name, and dates only when checked.** Memory gets names right and numbers wrong. Every year left in the brief is part of a law's title, the header date, or the NMC date checked above.
- **No invented clinic facts.** The doctor's name, qualifications and registration number, the address, timings, fees and services all sit under "Still to confirm". Task 10 keeps them as clearly marked placeholders. Guesses, such as who the patients are, are labelled as assumptions.
- **The verdicts live in task.md, not in the brief.** They sit next to the rows they judge, and the brief stays short. They're proposals: changing the backlog is your call.
- **Careful defaults, not legal advice.** The doctor signs off the Rules before launch.
- **Left for later:** one-line pointers to the brief from skills.md, from the ui-engineer and task-planner agents, and from CLAUDE.md's "The project" section. The plan suggests doing them in task 07.

## New ideas in this task

- **Product brief:** a short page that says what a product is for, who uses it, what it must do and what it won't do. Later choices are checked against it.
- **First version:** the smallest site that does the main job. Here, that means a patient can find the clinic and ask for an appointment. People often call this an MVP (minimum viable product).
- **Scope:** what a piece of work includes. "Out of scope" lists what it leaves out on purpose, so nobody builds it by accident.
- **Personal data:** any information about a person who can be identified, such as a name or a phone number. Health information is *sensitive* personal data, with stricter rules.
- **Consent:** a person's clear yes to one specific use of their data or picture. That's why the form's consent box starts unticked: a box ticked in advance isn't the patient saying yes.
- **Colour contrast ratio:** how far apart two colours are in brightness, from 1:1 (the same) to 21:1 (black on white). WCAG, the web's accessibility standard, asks for at least 4.5:1 for normal text and 3:1 for icons that carry meaning.
- **Headless run:** running Claude Code as `claude -p "…"`. It runs one prompt with no chat, then exits.
- **Testimonial:** a patient's story or quote that praises a treatment and is used to attract other patients.

## Check that it works

All of these were run on the branch, with every change committed. The word count, check 1 and check 3 were run again after the review's fixes.

```text
$ wc -w document/product/brief.md
     999 document/product/brief.md
```

Check 1 from the plan: each part of your answers appears at least once. This is the plan's loop, and its raw output:

```text
$ for t in dermatolog 'skin, hair and nail' Pune 'one doctor' calm trustworthy 'leaf green' saffron 'off-white' 'high-contrast' rounded logo 'brand colo' 'task 07' English Hindi Marathi; do printf '%s: ' "$t"; grep -c -i -- "$t" document/product/brief.md; done
dermatolog: 2
skin, hair and nail: 1
Pune: 2
one doctor: 1
calm: 1
trustworthy: 1
leaf green: 2
saffron: 2
off-white: 2
high-contrast: 1
rounded: 1
logo: 1
brand colo: 1
task 07: 1
English: 2
Hindi: 5
Marathi: 5
```

Check 2 looks for laws cited by number. It printed nothing (`grep` exit 1 means no matches). Normally silence alone proves little, but this check did catch "(rule 6)" in the draft, so we know it works.

Check 3 looks for years. Each one is part of a law's title, the header date (2026) or the checked NMC date (2026):

```text
$ grep -o -E "(19|20)[0-9]{2}" document/product/brief.md | sort | uniq -c
   1 1954
   5 2002
   1 2011
   1 2019
   1 2020
   1 2023
   2 2026
```

Check 4 confirms the backlog table is the same as on `main`: 19 lines (header, separator and 17 rows):

```text
same
19
```

- **Verdicts:** 17 lines, for rows 07 to 23 in order.
- **Links:** the backlog-note link search finds exactly one line (task.md line 139). Each repo map has one row for the brief. Every relative link in the brief and the task.md note opens an existing file.
- **No made-up facts:** a search for phone numbers, rupee amounts, clock times and "Dr. Name" printed nothing.
- **Requirements:** we read the brief against the plan's R1 to R11. Each one has a section that meets it, and all seven missing facts are under "Still to confirm".
- **Build checks:** `npm run lint` exited 0. `npm run typecheck` reported 0 errors, 0 warnings and 0 hints. `npm run build` printed `1 page(s) built` and `Complete!`. `git status --short` stayed empty.

## Review and lessons

**code-reviewer: Ready to merge**, with no must fixes and six suggestions. ce-code-review was skipped on purpose (see "How"). Git was unchanged after the review (same status, last commit and branches). All six suggestions are fixed:

1. **The doctor's council wasn't under "Still to confirm".** The Rules assume the Maharashtra Medical Council, so that assumption is now listed (`af71324`).
2. **Rule 8 said the form "books" appointments,** but the first-version section says it only sends a request. Rule 8 now says "request" (`af71324`). readme.md and CLAUDE.md still say "book": that's in the task 26 note in task.md (`708886e`).
3. **The doctor's-photo line had no recorded source.** The research did find it in the NMC guidelines, so the NMC row in the table above now says so.
4. **The follow-up pointers to the brief were only in the plan.** They're now a "Notes from task 26" bullet in task.md, where task-planner looks (`708886e`).
5. **Short forms weren't spelled out.** The brief now writes out the National Medical Commission, the Advertising Standards Council of India and the Information Technology Act. This doc spells out ASCI and DPDP (`af71324`, and this doc).
6. **Two parts of this doc weren't the real commands.** Step 2 now shows the full `--allowedTools` list, and says plainly what it does and doesn't prevent. Check 1 now shows the plan's loop and its raw output.

To pay for the new words, the brief dropped a few repeated ones, such as "(noted for task 07)", which the task 06 note already covers.

**code-reviewer, second pass: Ready to merge**, with no must fixes, and git again unchanged. It confirmed the six fixes and made three small suggestions:

1. **Review was ticked (`7976d74`) before this final pass ran.** The tick turned out true, but a box should be ticked only after the step is done. This section now records the final pass. Next time: record the final pass, then tick Review.
2. **"Try it yourself" asked for exactly 1000 words.** It now asks for 1,000 or fewer, so a later edit can't make it wrong.
3. **This doc is long** (about 3,000 words). Left as it is: the legal-sources table is the part a later task will need.

**Compound:** we asked, "If this lesson weren't written down, would a future session repeat the mistake or redo the investigation?" Yes. Citing laws by name guarded against wrong numbers, but not against a rule the model had never seen, and the NMC guidelines were that kind of rule. Tasks 12, 14, 15, 17, 19, 20, 21 and 23 all rely on these rules, and a session planning one of them would trust memory again or redo the research. No saved lesson covered it. We ran the lightweight command, and it wrote [check-legal-rules-against-official-sources.md](../solutions/workflow-issues/check-legal-rules-against-official-sources.md) (`✓ Documentation complete (non-interactive lightweight mode)`). We read it in full. Its commit IDs and quotes match the repo. We corrected one sentence that overstated what would have happened to backlog 17 without the check.

## Common mistakes

- **Trusting legal facts from memory.** The plan's memory said testimonials were a judgment call. That was true until 6 October 2026, about three weeks before this task. Check rules on the official site, and write down where and when you checked.
- **Treating every hit from a check as a failure.** "(rule 6)" wasn't a law at all. Read each hit before you act on it.
- **Inventing facts so a page looks finished.** A made-up fee or doctor's name can end up on the live site. Use a marked placeholder, and list it under "Still to confirm".
- **Forgetting the translations.** A Hindi or Marathi translation can turn "treatment" into "cure". The rules apply to every language, and a fluent reader checks the text before launch.
- **Changing the backlog yourself.** The verdicts are proposals. Dropping row 16 or 17 is your call as owner, not a session's.

## Try it yourself

About 5 minutes, and it changes nothing:

1. Run `wc -w document/product/brief.md` and check 4 from the plan's "Verification Contract". Do you get 1,000 or fewer, then `same` and 19?
2. Backlog row 13 (open-now badge) says it needs the closed days and holidays. Find where the brief lists them.
3. Which of the brief's Rules does this line break? "Dr. X is Pune's No. 1 skin specialist. Our laser cures pigmentation permanently, guaranteed!" (Answer: rule 2 for "No. 1", "permanently" and "guaranteed"; rule 3 for "cures"; and rule 1 if the doctor has no dermatology qualification. A safe version: "Diagnosis and treatment of pigmentation.")
4. See a false positive (a hit that isn't a real problem): `printf 'Testimonials (rule 6)\n' | grep -n -E '[Rr]ule [0-9]'` prints `1:Testimonials (rule 6)`. Is that a law cited by number?

## Learn more

- [NMC: Guidelines on Ethical Advertising and Public Communication (PDF)](https://www.nmc.org.in/whats-new/download/1874)
- [NMC: Rules and regulations](https://www.nmc.org.in/rules-regulations/)
- [India Code: the official text of India's laws](https://www.indiacode.nic.in/)
- [ASCI: Advertising Standards Council of India](https://www.ascionline.in/)
- [WCAG 2.2: Contrast (Minimum)](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html) and [Non-text Contrast](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html)
- [Claude Code: run Claude Code programmatically (`claude -p`)](https://code.claude.com/docs/en/headless)
