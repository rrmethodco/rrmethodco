# Discovery Interview Guide (Endodontic Practice)

> 60-90 minute conversation with the practice owner(s) AND the office manager. For mom's practice, this is a working session — she's the owner, she's on board, and she's a full participant. Use this to fill out `practice_context.md`, validate baseline metrics, and define the pilot scope before building.

---

## Logistics

- **Duration:** 60-90 minutes
- **Attendees:**
  - Mom (practice owner / endodontist) — clinical context, voice/tone validation, pilot champion
  - Office manager / billing coordinator — primary user of the system, owns the workflow
  - One other endodontist (if available) — voice variation across the 4-doc group
- **Format:** In person at the practice if possible. Video call OK.
- **What to ask them to have ready:**
  - 10 recent EOBs (with denials, de-identified or with PHI redacted)
  - 10 recent pre-auth submissions (de-identified)
  - 10 recent referral letters (de-identified)
  - List of top insurance carriers by claim volume
  - Last month's production report from PBS Endo
  - Last month's outstanding insurance receivables aging report
  - List of top 20 referring GPs

---

## Section 1 — Practice context (10 min)

1. How long has the practice been operating?
2. The 4 endodontists — partners or owner + associates? What's the governance structure for decisions like deploying new tools?
3. What's the rough monthly production?
4. Patient volume — how many active patients per week, per endodontist?
5. In-network vs. out-of-network mix?
6. PBS Endo — what version, on-prem or cloud, how long have you used it?
7. Imaging integration — sensors and CBCT brand/version?

## Section 2 — The pain (15 min)

Ask the office manager to describe a "bad insurance day" in detail. Listen for emotional words — those are the pain points worth quoting later.

8. Walk me through how a pre-auth gets done today. Who does what? How long does an average pre-auth take?
9. What's the worst part of the process?
10. When do you get pre-auths denied? What are the most common reasons?
11. Same questions for appeals — walk me through one from start to finish.
12. How many denials do you NOT appeal each month because you don't have time? Roughly how much money is that?
13. **Referral letters** — how do those get done today? Manual templates in PBS Endo? From scratch each time? How long per letter? How many per week?
14. If you got 15 hours of your week back, what would you actually do with it?

> Answer to #14 is testimonial gold.

## Section 3 — Carriers and codes (15 min)

15. Top 5-6 insurance carriers by volume?
16. Which carrier gives you the most trouble? Specific examples for endo (retreatment denials, apicoectomy denials, CBCT denials)?
17. Which procedures most often need pre-auth? (Confirm: D3346/47/48 retreatments, D3410-26 apicoectomies, D0367 CBCT, D9248 sedation, D3331 obstruction)
18. Which procedures get denied most often after submission?
19. Any state-specific carrier or insurance commission issues?
20. Do you ever do peer-to-peer reviews? With whom on the practice side? How effective are they?

## Section 4 — Voice and standards (10 min)

21. Show me 3-5 narratives the practice has written that DID get approved. (These become the voice/tone reference.)
22. Mom — show me 3-5 of your favorite referral letters you've sent. (These set the collegial-clinical voice for the referral letter skill.)
23. Are there phrases you've found that work especially well with [biggest carrier]?
24. Anything you've been told NEVER to put in a narrative?
25. Voice variation across the 4 endodontists — do they each have their own letter style, or is there a practice voice?

## Section 5 — Workflow integration (10 min)

26. Where do clinical notes live in PBS Endo — the main exam/treatment chart? How accessible is the chart text for export?
27. PBS Endo data export options — does the system have an API, scheduled CSV/PDF reports, or both?
28. How do EOBs come in — through PBS Endo's eClaims, paper, both?
29. Where do you currently store appeal letters and referral letters? Document Center in PBS Endo or external folder?
30. Who else needs to see the output — billing team, the other endodontists, treatment coordinators?
31. **What clearinghouse do you submit through?** (DentalXChange, Vyne, Tesia, Change Healthcare — confirm)

## Section 6 — HIPAA / data handling (10 min)

This is the part where you build trust and head off objections.

32. Have you used cloud-based AI tools before in the practice? (ChatGPT, etc.)
33. Are you aware of HIPAA constraints around AI? (If not — explain: PHI requires a BAA, which Anthropic offers; we de-identify before processing, re-attach locally.)
34. Who is your HIPAA officer / compliance contact?
35. Where would you want generated outputs stored — Document Center in PBS Endo, network drive, both?
36. Comfort level with: human-approved-with-one-click vs. fully autonomous submission? (Recommend the former for V1 — explain why: liability, trust, learning loop.)

## Section 7 — Success criteria (10 min)

37. If we deployed this and it worked, what would be different in 60 days?
38. What's the one number that would make you say "this was 100% worth it"?
39. Mom — beyond your practice, who in your endodontic network would care about this if it works? AAE colleagues, residency classmates, study clubs, study group at [her dental school]?
40. Would you be willing to do a video testimonial after 30-60 days of measured results, and to take referral calls from prospective customers?

---

## Section 8 — Pilot scope decisions (10 min)

This is where mom's full-participant status matters most. Decide together:

41. **Skill scope for V1:** all three skills (pre-auth, appeal, referral) at once, or sequence them? **Recommendation:** start with referral letters (highest volume, lowest stakes, fastest to demonstrate value), then layer in pre-auth and appeal in week 3-4.
42. **Practice scope:** all 4 endodontists from day 1, or pilot with mom + one other in weeks 1-2 then expand?
43. **Autonomy level for V1:** confirm human-approved-with-one-click. Get explicit sign-off.
44. **Integration scope:** for V1, manual paste-from-PBS-Endo OK, or integrate with PBS Endo via API / RPA / scheduled exports? (This is a 2-week vs. 6-week build difference.)
45. **Submission scope:** for V1, generate outputs only and let staff submit through PBS Endo eClaims. Defer auto-submission until V2.

---

## Post-Interview Actions (within 24 hours)

1. Fill in `context/practice_context.md` with all data collected
2. Update `reference/carrier_intelligence.md` with the practice's specific carrier mix and any observed patterns
3. Confirm clearinghouse choice (affects integration plan)
4. Confirm PBS Endo data access model (API vs. exports vs. RPA)
5. Send a follow-up email summarizing:
   - What you heard
   - What you'll build
   - The 4-week timeline to V1
   - The decisions made on autonomy/scope
6. Schedule the baseline measurement week (1 week of tracking BEFORE deploying anything)
7. Confirm BAA status with Anthropic before any PHI touches the system
8. Get mom's HIPAA officer / compliance team aligned on the approach

---

## Mom-Specific Advantages (lean into these)

Because mom is the owner + on board + a full participant, you have advantages most pilots don't:

- **No politics:** decisions can be made in this meeting, not in a 6-week procurement cycle
- **Real data access:** you can iterate against real (de-identified) cases, not synthetic ones
- **Voice authenticity:** mom validates output as a board-certified endodontist, not just an office manager
- **Referral velocity:** at the 60-day mark, mom can introduce you to her AAE network — that's potentially the entire customer pipeline for year one
- **Multi-doc validation:** 4 endodontists × different writing styles forces the system to handle voice variation from day 1, which is exactly what we need before selling to other practices

Do not waste this. Most AI startups would pay $100K+ for this kind of design partner.
