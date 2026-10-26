---
title: Check legal rules on the official source before writing them, not from memory
date: 2026-10-26
category: workflow-issues
module: product-brief
problem_type: workflow_issue
component: development_workflow
severity: high
applies_when:
  - Writing or changing a rule the site follows because of a law, a regulator or a doctors' code, such as the Rules in document/product/brief.md
  - Planning or building the privacy notice or page, the appointment form, testimonials or reviews, the health blog, the clinic schema (JSON-LD), the gallery or the doctor's photo
  - Writing WhatsApp messages or any other text that could count as advertising
  - A plan or research note gives a legal fact that was written without web access
  - Getting ready for launch, when the doctor signs off the Rules
root_cause: missing_workflow_step
related_components: [documentation]
tags: [legal-rules, nmc-guidelines, testimonials, privacy-notice, model-memory, official-sources, product-brief, web-research]
---

# Check legal rules on the official source before writing them, not from memory

## Context

Task 26 wrote the product brief, including the rules a doctor's website in India must follow. Its plan was made in a headless `claude -p` run where WebSearch and WebFetch were denied (plan, KTD2). The research agent couldn't use the web either, so every legal fact in the plan came from model memory.

The plan knew this, and guarded against one risk: it cited laws by name only, because "numbers and dates are what memory gets wrong" (KTD2). That guard wasn't enough. Memory didn't only get numbers wrong. It missed a whole new rule:

- **What memory said:** the plan's KTD6 kept testimonials and before-and-after photos off the site "unless the doctor checks the current rules and decides otherwise". So it was left for the doctor to decide.
- **What was true:** on 6 October 2026, about three weeks before task 26, the National Medical Commission (NMC) issued its Guidelines on Ethical Advertising and Public Communication (Public Notice R-13014/01/2024-Ethics). They say a patient's consent doesn't make a testimonial or a before-and-after picture allowed.

A research subagent with web search checked the plan's legal facts on official sites on 2026-10-26, before the brief was written. That check changed the brief's rule 6 to a flat "No testimonials or before-and-after photos". It also added "painless", "miracle" and "no promotional WhatsApp messages" to rules 2 and 5, and changed the verdict on backlog 17 (testimonials slider). Task 26 made these fixes (`8f7291f`, `fd90550`) on the same branch as this doc.

Some of what memory said was right: the check confirmed that the NMC's 2023 conduct regulations are on hold, so the 2002 code still applies. The problem isn't that memory is always wrong. It's that nobody can tell which parts are wrong until someone checks.

## Guidance

Before you write or change any rule a doctor's website must follow, do these four things.

1. **Check the official source with a web-enabled agent.** Use a research subagent that has web tools. A headless `claude -p` run can search only if `WebSearch` and `WebFetch` are in its `--allowedTools` list, and task 26's ce-plan run didn't have them. If a plan came from a run without web access, treat its legal facts as unchecked, and check them before you write anything.
2. **Prefer official sites.** Task 26 used nmc.org.in, indiacode.nic.in, meity.gov.in, ascionline.in, the government's press office (PIB) and prsindia.org. News reports and law-firm notes are second sources only.
3. **Record the check in the task's learning doc:** the URL, the date you checked it, and what it means for the site. If you couldn't reach a source, say so, and leave that fact out of the rules instead of writing it from memory.
4. **Cite laws by their official name in user-facing docs** (the brief, the privacy page, the site's text). Add a section number or a date only when the learning doc records that you checked it. A year in a law's official title, such as the 1954 in the Drugs and Magic Remedies Act, 1954, is part of its name.

**Start from what task 26 already checked.** The sources table is in `document/learning/26_product_brief.md` ("How", step 3), and the rules are in `document/product/brief.md` ("Rules the site follows"). Re-open the URLs. Don't trust the table blindly, because it is a snapshot from 2026-10-26.

**Some facts there have dates attached, so re-check them when the task that uses them starts:**

| Topic | Later task | What to re-check |
| --- | --- | --- |
| Privacy notice and page, the form, where requests go | 14, 15, and the privacy page's task (not chosen yet) | The Digital Personal Data Protection (DPDP) Act, 2023 and its Rules. Task 26 found that most duties start about May 2027, with the Information Technology Act's 2011 rules applying until then. |
| Testimonials, reviews, before-and-after photos | 17 | The NMC guidelines |
| Doctor's photo, gallery | 19 | The NMC guidelines on self-promotional photos; written consent for any patient photo |
| Health blog | 20 | The NMC guidelines and the 2002 code: no cure claims, no self-promotion |
| Clinic schema (JSON-LD) | 21 | Facts only; no ratings |
| WhatsApp, quick actions | 12, 15 | The NMC guidelines count WhatsApp as advertising |
| Launch | 23 | The doctor signs off the Rules against the code and guidelines in force at launch |

**A scanned PDF can look empty.** The NMC notice is a scanned PDF, and task 26's subagent read it with OCR. If a fetched PDF gives back little or no text, it's probably a scan. Read it with OCR before you decide what it says.

## Why This Matters

A model's memory stops at its training cutoff. A regulator can issue new rules after that date, and the NMC did. Careful wording can't fix a gap like that. Citing laws by name protected the brief from wrong section numbers, but not from a rule the model had never seen.

The cost of a miss is high. Without the check, the brief would have left testimonials for the doctor to decide, and backlog 17 still reads "Testimonials slider (real, consented testimonials only)", with consent as its only test. The NMC guidelines say consent isn't enough. These rules bind the doctor, so a breach on the site, in any of the three languages, puts the doctor's standing with the medical council at risk.

## When to Apply

- Any task that writes, changes or relies on a rule from a law, a regulator or a doctors' code
- Any plan or research written without web access that states a legal fact
- Before launch, and again whenever a task uses a fact with a date on it (such as the DPDP start dates)

## Examples

Rule 6, before and after the check:

```markdown
<!-- before: plan KTD6, written from memory -->
Testimonials and before-and-after photos also stay off the site unless the
doctor checks the current rules and decides otherwise.

<!-- after: brief rule 6, checked on nmc.org.in on 2026-10-26 -->
6. **No testimonials or before-and-after photos.** The NMC guidelines say a
   patient's consent doesn't make them allowed.
```

How the learning doc records a check (from `document/learning/26_product_brief.md`):

```markdown
that date was checked on the [official NMC notice](https://www.nmc.org.in/whats-new/download/1874)
(Public Notice R-13014/01/2024-Ethics, dated 6 October 2026).
```

## Related

- `document/learning/26_product_brief.md`: "How" step 3 (the sources table) and "Common mistakes"
- `document/product/brief.md`: "Rules the site follows" and "Still to confirm"
- `document/plans/2026-10-26-1936-docs-product-brief-plan.md`: KTD2 (laws by name) and KTD6 (testimonials, written from memory)
- `document/task/task.md`: the backlog check, rows 12, 14, 15, 17, 19, 20, 21 and 23
- NMC: [Guidelines on Ethical Advertising and Public Communication (PDF)](https://www.nmc.org.in/whats-new/download/1874)
