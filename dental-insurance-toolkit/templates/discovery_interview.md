# Discovery Interview Guide

> 60-90 minute conversation with the dentist-owner AND the office manager (do them together — the OM has the day-to-day workflow, the dentist has the financial context). Use this to fill out `practice_context.md` and validate baseline metrics before building.

---

## Logistics

- **Duration:** 60-90 minutes
- **Attendees:** Dentist-owner + office manager / billing coordinator
- **Format:** In person at the practice if possible (you'll see the workflow). Remote OK as a fallback.
- **What to ask them to have ready:**
  - 5-10 recent EOBs (with denials, de-identified or with PHI redacted)
  - 5-10 recent pre-auth submissions they've sent
  - A list of their top insurance carriers by claim volume
  - Last month's production report
  - Last month's outstanding insurance receivables aging report

---

## Section 1 — Practice context (10 min)

1. How long has the practice been open?
2. How many providers? (dentists, hygienists, assistants)
3. What's the rough monthly production?
4. What's your in-network vs. out-of-network mix?
5. When did you migrate to Denticon? (Recent migration = good moment to introduce new workflow)
6. Who handles insurance day-to-day? Is that one person's full job, or split?

## Section 2 — The pain (15 min)

Ask the office manager to describe a "bad insurance day" in detail. Listen for emotional words — those are the pain points worth quoting later.

7. Walk me through how a pre-auth gets done today. Who does what?
8. How long does an average pre-auth take you to write?
9. What's the worst part of the process?
10. When do you get pre-auths denied? What are the most common reasons?
11. Same questions for appeals — walk me through one from start to finish.
12. How many denials do you NOT appeal each month because you don't have time? Roughly how much money is that?
13. If you got 8 hours of your week back, what would you actually do with it?

> The answer to #13 is your testimonial gold.

## Section 3 — Carriers and codes (15 min)

14. What are your top 5-6 insurance carriers by volume?
15. Which carrier gives you the most trouble? Specific examples?
16. Which procedures most often need pre-auth in this practice? (Confirm: crowns, buildups, endo, perio SRP, dentures, surgical extractions, occlusal guards)
17. Which procedures get denied most often after submission?
18. Any state-specific carrier or insurance commission issues you've dealt with?

## Section 4 — Voice and standards (10 min)

19. Show me 3-5 narratives you've written that DID get approved. (These become the voice/tone reference for the skill files.)
20. Are there phrases you've found that work especially well with [biggest carrier]?
21. Anything you've been told NEVER to put in a narrative?
22. Who reviews and signs off on the final narrative — you, the dentist, or it goes out as-written?

## Section 5 — Workflow integration (10 min)

23. Where do clinical notes live? (Denticon Document Center, paper, both?)
24. How do EOBs come in — paper, electronic, both?
25. Where do you store appeal letters once written?
26. Do you have a network drive or shared folder where pre-auths and appeals go?
27. Who else needs to see the output — billing team, dentist, treatment coordinator?

## Section 6 — HIPAA / data handling (10 min)

This is the part where you build trust and head off objections.

28. Have you used any cloud-based AI tools before? (ChatGPT, etc.)
29. Are you aware of HIPAA constraints around AI? (If not — explain briefly: PHI requires a BAA, which Anthropic offers; we de-identify before processing, re-attach locally.)
30. Who is your HIPAA officer / compliance contact? (You may need a brief BAA conversation with them.)
31. Where would they want generated outputs stored? (Network drive, Denticon Document Center, etc.)

## Section 7 — Success criteria (10 min)

32. If we deployed this and it worked, what would be different in 60 days?
33. What's the one number that would make you say "this was 100% worth it"?
34. Who else in your network would care about this if it works? (Study club members, alumni, ASDA contacts — this is your future referral list.)

---

## Post-Interview Actions (within 24 hours)

1. Fill in `context/practice_context.md` with all data collected
2. Update `reference/carrier_intelligence.md` with the practice's specific carrier mix and any observed patterns
3. Send a follow-up email summarizing what you heard, what you'll build, and the timeline
4. Schedule the baseline measurement week (1 week of tracking BEFORE deploying anything)
5. Confirm BAA status with Anthropic before any PHI touches the system

---

## Red Flags to Watch For

- Practice is too small (<$500K production) — won't pay $5K
- Office manager is hostile to AI / change — adoption will fail
- Practice has no documentation discipline (notes are sparse, charts incomplete) — system will produce LOW confidence outputs because evidence is missing; this is a chart-quality problem, not a system problem, but the practice will blame the system
- Dentist-owner is technical and "wants to build it themselves" — good prospect for partnership, bad prospect for paid build
- HIPAA officer / compliance team won't sign off — must resolve before any PHI flows
