# Phase 4 handoff

Read CLAUDE.md first, then this file. Don't re-audit the repo; PHASE3.md has the detail behind anything summarised here.

## State at end of phase 3
- Live on childneuroscan.com (main, Vercel). Integration branch for phase 3 was `claude/phase-3-78iozs`.
- Done in phase 3: generated DB types (tsc/eslint blocking in CI), data layer in `src/lib/api/`, `alert()`/`confirm()` replaced by the dialog/toast components, linked form labels, child profiles, in-app reminder alerts, visual-schedule icons, `app_logs` PII fix + 30-day retention, vite 7, mentor self-verify lock, content for cerebral palsy, epilepsy, intellectual disability and Tourette, dead code removal (task 7, PR #13), load-error states with Retry (PR #16).
- Prod migrations: all phase 3 migrations applied by the owner on 2026-09-26.
- Baselines: tsc 0 errors, eslint 0 errors (23 warnings), 134 unit tests passing.

## Carried over from phase 3
- **Auth emails (phase 3 task 0)**: in-app messages (check your email, `email_not_confirmed`, resend button) were in progress in a separate thread; confirm they merged. Branded emails still need custom SMTP (e.g. Resend) with owner DNS setup, then rewritten Supabase templates. Supabase default SMTP is rate-limited, so do this before real users sign up.
- **Owner check**: confirm the prod `conditions` SELECT policy is `USING (true)`.

## Phase 4 scope (in priority order)
1. **Reminders when the app is closed**: phase 3 only alerts while the app is open. Real push needs Web Push (VAPID keys), a subscriptions table and a scheduled Edge Function. Build only if parents ask; otherwise skip.
2. **Condition content review**: content for the 4 new conditions was written without clinical review. Get a reviewer if possible; until then keep wording conservative (see phase 3 owner decisions).
3. **Router** (optional, bigger): replace the `currentScreen` state machine with a router so URLs and the back button work.
4. **Small cleanups** (only alongside related work): goals/medications/photos still call `requireUserId()` instead of taking `userId`; report types still live in `src/types/components.ts`; the video view counter never worked (videos has no UPDATE policy; fix or remove it).

## Deferred
- **Mentorship match lock**: a mentee can set their own match to `active` in `parent_mentorship_matches` without the mentor accepting. No screen uses mentoring yet, so only needed if mentoring is ever built (owner, 2026-09-26).

## Out of scope unless the owner asks
- Schedule icons and `alert()`/`confirm()` replacement: done in phase 3.
- Spanish and dark mode: hidden/removed. Dark mode would need every screen styled.

## Open questions for the owner
- Push reminders (item 1): build now, or wait for parent feedback?
- Router (item 3): in phase 4 or later?
- Any clinical reviewer available for item 2?
