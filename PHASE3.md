# Phase 3 handoff

Read CLAUDE.md first. This file is the starting point for the phase 3 session; don't re-audit the repo.

## State at end of phase 2
- Supabase project: **gzzknitztrtifhyciqit** (fresh, built with `supabase db push` from `supabase/migrations/`). The old project `bmgbpnwheaalmalyusep` had no real users and is retired; nobody on the team has dashboard access to it.
- Vercel env points at gzz… (Production + Preview). Auth Site URL and redirect URLs set for childneuroscan.com and www.
- ASD questions copied from the old project into `20260926000000_seed_asd_questions.sql` (15 questions) via `scripts/export-questions.mjs`.
- App is English-only (`SPANISH_ENABLED` in LanguageContext) and light-only (`DARK_MODE_ENABLED` in ThemeContext).
- Baselines: `tsc` 22 errors, `eslint src` 9 errors, 122 unit tests passing.

## Phase 3 scope (in priority order)
1. **Generated DB types**: `npx supabase gen types typescript --project-id gzzknitztrtifhyciqit > src/types/supabase.ts`, wire into the Supabase client, fix the 22 tsc errors, then make typecheck and lint blocking in CI.
2. **Data layer**: move ad-hoc `supabase.from(...)` calls in components into `src/lib/` functions with typed results and one error pattern.
3. **Replace `alert()`/`confirm()`** (~56 places) with the existing Toast and ResponsiveModal components.
4. **Forms accessibility**: reuse `FormField` so labels are linked to inputs across tracker forms.
5. **Privacy**: `app_logs` stores PII; stop logging personal data and add retention.
6. **Content**: cerebral palsy, epilepsy, intellectual disability and Tourette have questions but no explanations/recommendations/tips.
7. **Remove dead code** listed by the phase 2 code-quality review (unused exports in exportUtils, errorHandler, FriendlyIllustrations, serviceWorker, ThemeContext) and leftover `dark:` classes.
8. **Security**: upgrade vite 5 → 6+/vitest to clear dev-only audit findings. Mentorship self-verify issue (users can mark themselves verified).
9. **Router** (optional, bigger): replace the `currentScreen` state machine with a router so URLs and back button work.

## Owner decisions (2026-09-26)
- Fake therapists / community posts: **remove** (new migration deleting the seeded rows; keep empty states looking good).
- Analytics screen: **keep for now**.
- License: **private** (UNLICENSED).
- Clinical sign-off: **nobody available**. Keep all wording conservative ("parent-reported", "not a diagnosis", "talk to your pediatrician"); don't present scores as clinical thresholds. Revisit before any marketing.
- Spanish: **hidden for now**.
- Reminders notifications and visual-schedule icons: **build them** (add to scope after item 4).

## Known gaps
- Reminders are in-app only (no push/email).
- Supabase default SMTP is rate-limited; set up custom SMTP before real users sign up.

## Progress
### Task 1: generated DB types (done, branch `claude/phase-3-78iozs`)
- `src/types/supabase.ts` is generated from `supabase/migrations` with a local DB (no project token needed):
  `npx supabase db start && npx supabase gen types typescript --local --schema public > src/types/supabase.ts`.
  Needs Docker. `supabase/config.toml` is committed for this.
- Shared row types in `src/types/components.ts` and `src/types/database.ts` are aliases of generated `Tables<...>`; JSON columns are mapped in `src/lib/database.ts` (screening results) and `src/lib/reports.ts` (report templates/generated reports), trusting shapes this app writes.
- Behavior change: a screening result whose condition can't be read (e.g. RLS) is now skipped with a `logger.warn` instead of crashing the page.
- tsc 22 → 0, eslint errors 9 → 0 (26 warnings). CI typecheck and lint are now blocking.
- Follow-ups (task 2): several components still keep local copies of row types (GoalTracker, MedicationTracker, NotificationCenter, Community, ResourceFinder, AppointmentPrep, VideoLibrary); move them to shared aliases along with the data-layer move.

### Child profiles (branch `claude/child-profiles-ylz3ky`, off phase 3)
- Uses the existing `children` table (name, date of birth; RLS per parent). No migration. Data calls in `src/lib/children.ts`, list shared via `ChildrenContext`.
- Owner chose option A: pickers fill the existing `child_name` text columns; no `child_id` links. Renaming a child does not update old entries.
- First sign-in with no children shows a skippable "Your children" screen once per browser (`childrenSetupSeen:<userId>` in localStorage). Header "Children" button reopens it.
- `ChildPicker` replaces the 11 free-text name fields; free text stays available ("Someone else…") and for names not in the list.
- Screening: signed-in parents pick a child on the age step; age comes from date of birth and the name step is skipped. Guests unchanged.

### Open questions for the owner
- Text columns that used to be literal unions in the code (goal status/priority, medication type, reminder type) are plain `text` in the DB. Add CHECK constraints or enums so the generated types narrow again?
- What is the prod RLS policy on `conditions`? If it filters `is_active`, deactivating a condition hides parents' past screenings.
