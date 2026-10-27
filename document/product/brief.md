# Sanjivani Clinic website: product brief

> **Date:** 2026-10-26, updated 2026-10-27 · From the owner's answers. Only the owner changes this brief. The rules are careful defaults checked against official sources, not legal advice.

Every new task checks its choices against this page. The stack is in [CLAUDE.md](../../CLAUDE.md); tasks and backlog in [task.md](../task/task.md).

## The clinic

- **Sanjivani Clinic** is a dermatology clinic: it treats skin and hair problems.
- It's in **Pune**, with **one doctor**.

## Patients and what they come to do

*An assumption (see "Still to confirm").*

People in and around Pune with a skin or hair problem, booking for themselves, a child or an older relative. Most visit on a phone and read English, Hindi or Marathi. They come to check the doctor's qualifications and whether the clinic treats their problem, see the timings, fees and whether it's open, find the way, and call, message or request an appointment.

## The first version

- **Pages:** the doctor, services, timings and fees, contact and directions, and a short FAQ.
- **One tap** to call, WhatsApp or get directions.
- **An appointment request form.** The patient picks a preferred day and time, and the clinic confirms by phone or WhatsApp. It's a request, not a booking: a Google Sheet, an email or a chat can't hold a slot. Where requests go is backlog 15.
- **A privacy notice** beside the form, and **a privacy page**.
- **Fast on a phone**, easy to read, usable with a keyboard alone, and respects "reduce motion".

## Tone and look

- **Tone:** calm and trustworthy. Plain words, short sentences, no hype.
- **Look:** deep **leaf green** (a nod to the Sanjivani herb), a warm **saffron** accent, warm **off-white** surfaces, **high-contrast** text and soft **rounded** corners.
- **Saffron is an accent only:** highlights, large shapes, and button fills with dark labels. It's too pale on off-white for small text or meaningful icons, so text stays dark, and headings, links, icons and focus rings use leaf green.
- **No logo or brand colours exist yet.** Task 07 creates them, and checks **contrast** (the brightness difference between two colours): at least 4.5:1 for text and 3:1 for icons.

## Languages

- **English, Hindi and Marathi.** Every page is in all three.
- Hindi and Marathi use the Devanagari script, so the fonts must include it.

## Rules the site follows

These assume a modern-medicine doctor registered with the Maharashtra Medical Council. They come from the Indian Medical Council (Professional Conduct, Etiquette and Ethics) Regulations, 2002 ("the 2002 code") and the National Medical Commission's (NMC) guidelines on ethical advertising, issued in October 2026 ("the NMC guidelines"). They bind all three languages: a translation must not turn "treatment" into "cure".

1. **Facts only.** Show the doctor's name, recognised qualifications and registration number, and the address, timings, fees and services. Say "dermatologist" only if the doctor holds a dermatology qualification. (The 2002 code; the NMC guidelines.)
2. **No praise or promises.** Never "best", "No. 1", "guaranteed", "100%", "painless", "miracle" or "permanent", and no comparisons with other doctors. (The NMC guidelines; the Consumer Protection Act, 2019.)
3. **No cure claims.** Write "diagnosis and treatment of …", never that a treatment cures a condition. (The 2002 code; the Drugs and Magic Remedies (Objectionable Advertisements) Act, 1954, which lists leucoderma.)
4. **Pigmentation in medical words.** Never "fairness" or "whitening", and never suggest darker skin is a problem. (A careful default from the Advertising Standards Council of India's voluntary guidelines on skin-lightening ads.)
5. **No soliciting.** No offers, discounts, paid referrals or product endorsements, no asking for reviews, and no promotional WhatsApp messages. (The 2002 code; the NMC guidelines.)
6. **Testimonials only with the doctor's written OK; no before-and-after photos.** The owner wants testimonials (backlog 17), but the NMC guidelines say patient consent doesn't make them allowed. None go live until the doctor confirms in writing that the rules allow them, each with the patient's written consent. Any patient photo needs written consent (a parent's or guardian's if under 18) and must not identify them.
7. **Private booking requests.** The form asks only for a name, phone number, preferred day and time, and an optional short reason. A plain notice beside it, in all three languages, says what's collected, why, who gets it, how long it's kept and how to ask for deletion. The consent box starts unticked. Only the clinic can open the Sheet, inbox and chat, and old requests are deleted after a set period. (The Information Technology Act's 2011 privacy rules, which treat health information as sensitive; the Digital Personal Data Protection Act, 2023, whose duties phase in.)
8. **Booking, not advice.** The form and WhatsApp only request appointments, and the site gives no personal medical advice. (The Telemedicine Practice Guidelines, 2020.)

## Out of scope

- Online payment and Google reviews (the owner's choice).
- Patient accounts, medical records and report downloads.
- Online consultations and selling products.
- Patient reviews and before-and-after photos (see the Rules).

## Still to confirm

**Clinic facts.** Task 10 keeps them as marked placeholders until the owner gives them: the doctor's name, qualifications and registration number; the address; the timings, including closed days and holidays; the fees; the services.

**For the owner and the doctor:**

- the patients section;
- this brief's first-version additions: directions, one-tap call and WhatsApp, and the privacy notice and page;
- the opening language and web address style (task 10);
- which task writes the privacy notice and page;
- how long requests are kept, and who the privacy contact is;
- who at the clinic answers new requests, and how fast, and who checks the Hindi and Marathi;
- whether the doctor's photo goes on the site;
- the doctor's council (assumed Maharashtra's), written OK on testimonials, and sign-off on the Rules at launch.

**Before launch:** every placeholder holds a real fact, the doctor has signed off the Rules, a fluent reader has checked the Hindi and Marathi, and the privacy notice and page are ready.
