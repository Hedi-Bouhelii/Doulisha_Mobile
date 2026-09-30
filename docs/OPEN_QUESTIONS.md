# Open questions (mobile app)

For each question, the **Assumption** is what the app does until you decide. Answer in place (fill in **Decision** and the date) and the code will follow. Questions about the product as a whole stay in the web repository's `docs/OPEN_QUESTIONS.md` (Q1–Q28); these are numbered M1, M2…

---

### M1. A high-resolution logo for the app icon

- **Asked:** 2026-09-29 (part 3a)
- **Context:** The largest symbol file in the web repository is about 320 px wide. App icons are 1024 × 1024, so the current icon and splash screen are enlarged and slightly soft.
- **Assumption:** Keep the enlarged symbol on cream until a better file exists.
- **Decision:**

### M2. Copies of the web documents at the root of this repository

- **Asked:** 2026-09-29 (part 3a)
- **Context:** The folder started with copies of the web's documents (`API.md`, `BUILD_PROMPT.md`, the specification PDF…). You approved moving the handoff into `docs/` and deleting the copies, but the session's permissions did not allow deleting or moving files.
- **Assumption:** The copies stay untracked (not committed) and ignored by Prettier; the handoff is committed at the root as `MOBILE_HANDOFF.md`. The mobile docs link to the web repository instead.
- **Decision:**

### M3. Google or Facebook on the sign-up screen

- **Asked:** 2026-09-29 (part 3a)
- **Context:** On the web, a new Google or Facebook account lands on the setup page (city, join or organize) and an existing one goes straight in. In the app, the browser returns without saying which it was.
- **Assumption:** From the sign-up screen, setup always opens after Google or Facebook (an existing account sees its own name and city and continues). From the sign-in screen, setup opens only when the account still needs it.
- **Decision:**

### M4. Arabic wording of the app-only messages

- **Asked:** 2026-09-29 (part 3a)
- **Context:** `src/i18n/messages/ar.json` holds about 25 app-only strings (tab names, the restart prompt), written like the web's Arabic (web Q11: clear Modern Standard Arabic, "دوليشة", consistent terms).
- **Assumption:** Use them as written. TODO(i18n-review): a native read-through before launch, with the web's messages.
- **Decision:**
