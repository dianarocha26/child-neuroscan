# Phase 3 handoff

Read CLAUDE.md first. This file is the starting point for the phase 3 session; don't re-audit the repo.

## State at end of phase 2
- Supabase project: **gzzknitztrtifhyciqit** (fresh, built with `supabase db push` from `supabase/migrations/`). The old project `bmgbpnwheaalmalyusep` had no real users and is retired; nobody on the team has dashboard access to it.
- Vercel env points at gzz… (Production + Preview). Auth Site URL and redirect URLs set for childneuroscan.com and www.
- ASD questions copied from the old project into `20260926000000_seed_asd_questions.sql` (15 questions) via `scripts/export-questions.mjs`.
- App is English-only (`SPANISH_ENABLED` in LanguageContext) and light-only (`DARK_MODE_ENABLED` in ThemeContext).
- Baselines: `tsc` 22 errors, `eslint src` 9 errors, 122 unit tests passing.

## Phase 3 scope (in priority order)
0. **Auth emails and messages (do first)**:
   - After sign-up, show "Check your email to confirm your account".
   - On login failure, handle `email_not_confirmed` ("Your account needs verification. Check your email.") and add a "Resend confirmation email" button (`supabase.auth.resend`). For other failures, say "Email or password is incorrect. If you just signed up, confirm your email first."
   - Branded emails: custom SMTP (e.g. Resend) with sender `ChildNeuroScan <no-reply@childneuroscan.com>`, which needs owner DNS setup. Then rewrite the Supabase email templates (confirm, reset password) in the app's voice.
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
- Behavior change: a screening result whose condition can't be read (e.g. RLS) is kept and shown as "Screening" with a `logger.warn`, instead of crashing the page.
- tsc 22 → 0, eslint errors 9 → 0 (26 warnings). CI typecheck and lint are now blocking.

### Task 2: data layer (done)
- All component data access is in `src/lib/api/<domain>.ts`. Components never import `supabase` (AuthContext excepted).
- One error pattern (`src/lib/api/client.ts`): functions throw `DataError(action, cause)`; helpers `unwrapList` (lists), `unwrap` (`.single()` / insert+select), `unwrapMaybe` (`.maybeSingle()`), `check` (writes), `requireUserId`.
- Rule: the api module owns its row types. Text columns with a DB CHECK are narrowed to literal unions there (goals, medications, reminders, photos, community, resources).
- Screens load secondary lists with `Promise.allSettled`, so one failed read doesn't hide the rest. Read errors are logged, not swallowed.
- Behavior changes: deleting a photo entry keeps the row if the storage file can't be removed (retryable, no orphaned child photos); `listVideos` ignores an age-group value that isn't a plain slug.
- Later: no screen has a load-error state (a failed load looks like "no data yet"); goals/medications/photos still call `requireUserId()` instead of taking `userId`; `src/types/components.ts` still holds report types used by ComprehensiveReportGenerator; the video view counter never worked (videos has no UPDATE policy).

### Decisions (owner delegated, 2026-09-26)
- Allowed values: goals and medications already had CHECK constraints; only `reminders.reminder_type` lacked one, added in `20260926010000_reminders_type_check.sql` (NOT VALID, safe on existing data). Postgres CHECKs don't narrow generated types, so the literal unions are applied in code when rows are mapped in `src/lib/` (task 2).
- `conditions` read policy on prod: unknown (baseline migration only creates one if missing). The app no longer depends on it: results with an unreadable condition still show. **Owner: still check the policy in the Supabase dashboard** (it should be `USING (true)` for SELECT).

### Child profiles (branch `claude/child-profiles-ylz3ky`, off phase 3)
- Uses the existing `children` table (name, date of birth; RLS per parent). No migration. Data calls in `src/lib/api/children.ts`, list shared via `ChildrenContext`.
- Owner chose option A: pickers fill the existing `child_name` text columns; no `child_id` links. Renaming a child does not update old entries.
- First sign-in with no children shows a skippable "Your children" screen once per browser (`childrenSetupSeen:<userId>` in localStorage). Header "Children" button reopens it.
- `ChildPicker` replaces the 11 free-text name fields; free text stays available ("Someone else…") and for names not in the list.
- Screening: signed-in parents pick a child on the age step; age comes from date of birth and the name step is skipped. Guests unchanged.

### Task 4: forms accessibility, reminder alerts, schedule icons (branch `claude/phase-3-task-4-9py10m`)
- Labels: every form label is now linked (htmlFor/id, or wraps its input). Kept each form's own markup instead of swapping to `FormField` (would restyle forms for no a11y gain). Button groups use `role="group"` + `aria-labelledby` + `aria-pressed`. `FormField.tsx` is still unused (candidate for task 7).
- Reminder alerts (`src/hooks/useReminderAlerts.ts`, logic in `src/lib/reminderAlerts.ts`): while the app is open, signed-in users get an in-app toast and, if allowed, a browser notification when a reminder is due (up to 24h overdue). Already-alerted reminders are tracked per browser in localStorage (`reminderAlerts:<userId>`); editing a reminder's date/time re-arms it. No push service, no schema change, `last_sent_at` unused. Reminders screen has a "Turn on notifications" button. `sw.js` focuses the app on notification click.
- Nothing is sent when the app is closed. Real push (Web Push + a scheduled Edge Function) would need VAPID keys and a cron; revisit only if parents ask.
- Reminders "today"/overdue now use the local date instead of UTC.
- Visual schedule shows the activity icon (`icon_name`, lucide names from `src/components/scheduleIcons.ts`; unknown → Circle) and the activity form has an icon picker.


### Task 6: content for the 4 remaining conditions (branch `claude/phase-3-task-6-content-a7gogl`)
- Migration `20260926030000_seed_remaining_condition_content.sql` adds explanations (EN+ES), 7 recommendations and 5 daily tips each for cerebral palsy, epilepsy, intellectual disability and Tourette. Generated from a script; each condition has at least one recommendation for every risk level (incl. "talk to your pediatrician"). Epilepsy includes standard seizure first aid and the 5-minute emergency rule.
- Re-runnable: explanations only fill empty columns; rows use fixed ids + `ON CONFLICT (id) DO NOTHING`. Tested twice on a local Postgres 16 against the earlier seed migrations. No code change: tip categories reuse existing `HomeProgramTips` labels.
- Owner: apply the migration manually in prod. No clinical review yet (see owner decisions).

### Task 0: auth emails and messages (branch `claude/phase-3-auth-emails-ew1dcb`)
- Sign-up: when Supabase returns no session (confirmation required), the form stays and says "Check your email to confirm your account" with a link to sign in. If confirmation is off, the user is signed in directly.
- Login: `email_not_confirmed` shows "Your account needs verification. Check your email." plus a "Resend confirmation email" button (`supabase.auth.resend`, type `signup`). Every other failure shows one generic message (no account enumeration).
- `signUp` and `resend` pass `emailRedirectTo: window.location.origin`, so preview deploys need their URL in Supabase redirect URLs to confirm there.
- Branded templates are in `supabase/templates/` (`confirmation.html`, `recovery.html`), pasted by the owner into the dashboard. Custom SMTP (Resend) and DNS are owner setup; not in `config.toml`.
- SignUp now sends the full name as `full_name` user metadata; the existing `handle_new_user` trigger copies it into `profiles.full_name`.
