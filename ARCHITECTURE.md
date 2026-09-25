# Architecture

This describes the code as it is, including its known weaknesses. For setup see
[README.md](./README.md); for hosting and database operations see
[DEPLOYMENT.md](./DEPLOYMENT.md).

## Overview

```
Browser (React SPA, served by Vercel as static files)
   │  supabase-js (HTTPS + WebSocket, anon key + user JWT)
   ▼
Supabase: Postgres (RLS on every table) · Auth (email/password) · Storage (photo-journal bucket)
```

There is no application server. All reads and writes go straight from the
browser to Supabase, so **Row Level Security is the only thing protecting user
data**.

## Stack

- React 18 + TypeScript (`strict`), built with Vite 5
- Tailwind CSS 3, lucide-react icons, Inter self-hosted via `@fontsource/inter`
- `@supabase/supabase-js` v2
- Vercel for hosting (see `vercel.json`), GitHub Actions for CI

Runtime dependencies are deliberately few: React, supabase-js, lucide-react
and the font package. There is no router, state library, form library or UI kit.

## Folder layout

```
src/
  main.tsx          Mounts <App/> inside ErrorBoundary > ThemeProvider > AuthProvider > LanguageProvider;
                    registers the service worker (production only)
  App.tsx           Screen state machine, screening flow state, app header, global search, mobile nav
  components/       Screens (Login, LandingPage, Questionnaire, Results, BehaviorDiary, ...)
                    and shared UI (ErrorBoundary, LoadingSpinner, OfflineIndicator, ...)
  contexts/         AuthContext, LanguageContext, ThemeContext
  hooks/            Small shared hooks (e.g. online status, loading state)
  lib/
    supabase.ts     The single Supabase client; throws if env vars are missing
    database.ts     Screening data access and scoring (conditions, questions, results, recommendations, tips)
    dates.ts        Local-date helpers (avoid UTC "today" off-by-one)
    exportUtils.ts  HTML / print / CSV / JSON report export (escapes user text, guards CSV formula injection)
    logger.ts       console in dev; in production also inserts into the app_logs table
    errorHandler.ts Error helpers
    serviceWorker.ts Registers /sw.js and shows the "new version" toast
    translations.ts Static EN/ES strings used by a few screening screens
  types/            Shared types (database row shapes, component props)
public/             Copied verbatim: icons, manifest.json, sw.js, robots.txt, sitemap.xml
supabase/migrations/ SQL migrations
```

## Navigation

There is no router. `App.tsx` holds a single `currentScreen` state (a union type
`Screen` with about two dozen values such as `'landing'`, `'questionnaire'`,
`'dashboard'`, `'behavior'`) and renders the matching component with
`{currentScreen === '...' && <Component/>}`. Components navigate by calling
callbacks (`onBack`, `onNavigate`) passed down from `App`. Most feature screens
are `React.lazy` chunks.

Screening flow: `landing` -> `age-input` -> `questionnaire` -> `results`. Guests
can complete it; if a guest chooses to save, `App` keeps the result in state,
asks them to log in or sign up, and saves after authentication.

**Known limitation:** the URL never changes. Browser back/forward does not
work, screens cannot be bookmarked or linked, a refresh always returns to the
landing page, and in-progress state (such as questionnaire answers) is lost on
reload. `vercel.json` rewrites unknown paths to `index.html` only so that
stray deep links do not 404. Moving to a router (e.g. React Router) is the
main structural improvement still to do.

## Data access

Two patterns coexist:

1. `src/lib/database.ts` for the screening domain: loading conditions and
   questions (with their domains), scoring, saving and reading
   `screening_results`, recommendations and daily tips. Used by `App`,
   `LandingPage`, `Questionnaire`, `Results`, `ProgressDashboard` and
   `ReportGenerator`.
2. Direct `supabase.from('<table>')` calls inside the feature components
   (about 15 of them: behaviour diary, medications, goals, rewards, visual
   schedule, reminders, appointments, photo journal, crisis plan, sensory
   profile, community, videos, resources, analytics, comprehensive report).

There is no caching layer or shared query hook; each screen loads its own data
on mount. Row types in `src/types/database.ts` are hand-written, not generated
from the schema, so they can drift (`npm run typecheck` currently reports
some of these mismatches).

## Authentication

`AuthContext` wraps Supabase Auth:

- email + password `signUp`, `signIn`, `signOut`
- `resetPassword` sends a reset email with `redirectTo: window.location.origin`;
  when the user returns, the `PASSWORD_RECOVERY` event sets
  `passwordRecovery` and `App` shows the `ResetPassword` screen
- exposes `user` and `loading`; the session is persisted by supabase-js in
  `localStorage`

Screens that need an account are guarded in `App` by `user && ...`. A new
`auth.users` row creates a `public.profiles` row through the `handle_new_user`
trigger (`user_profiles`, which holds child/community profile data, is a separate table).

## Internationalisation

`LanguageContext` holds `language` (`'en' | 'es'`, default `'en'`, not
persisted across reloads) and a helper `t(en, es)` that returns one of its two
arguments. Most UI strings are written inline as `t('English', 'Español')`.
Database content has parallel columns (`name_en` / `name_es`,
`question_text_en` / `question_text_es`, ...). A small static dictionary in
`lib/translations.ts` is used by a few screening screens.

## Theming

`ThemeContext` supports light/dark/system, but dark mode is switched off
(`DARK_MODE_ENABLED = false`) because most screens have no `dark:` styles and
became unreadable. The app is light-only for now, and `index.html` declares
`color-scheme: light` so native form controls match.

## Service worker

`public/sw.js`, registered only in production builds by
`lib/serviceWorker.ts`:

- a build id is stamped into `dist/sw.js` at build time (plugin in
  `vite.config.ts`), so each deploy gets new cache names and old caches are
  deleted on activate
- navigations: network-first, falling back to the cached app shell offline
- `/assets/*` (content-hashed): cache-first, never caching errors or HTML
- everything else, including all Supabase requests and other origins, is not
  intercepted
- on update, an open tab shows a "new version" toast instead of force-reloading

`/sw.js` is served with `Cache-Control: no-cache` (see `vercel.json`); it must
never be cached long-term. There is no offline data sync: writes need a
connection.

## Security model (RLS)

- **User-owned tables** (behaviour entries, medications, goals, rewards,
  schedules, reminders, appointments, photo journal, crisis plans, sensory
  profiles, screening results, generated reports, ...): RLS enabled, policies
  for the `authenticated` role that restrict every operation to rows where
  `user_id = auth.uid()`.
- **Reference content** (recommendations, daily tips, videos, therapy
  resources, templates, ...): a `SELECT` policy for everyone and no write
  policies, so it is read-only from the client. The core screening tables
  (`conditions`, `questions`, `question_domains`, `functional_domains`) get
  the same rule from the baseline migration, which only adds a read policy
  where none exists, so check the production policies in the dashboard (see
  Known gaps).
- **Community** (posts, comments, likes, groups): authenticated users only;
  users write only their own rows; moderation and counter columns are
  protected by column grants and maintained by `SECURITY DEFINER` triggers.
- **Storage**: the `photo-journal` bucket is private; the app stores the object
  path and renders short-lived signed URLs.

Migration `20260925000000_fix_critical_rls_policies.sql` closed several early
holes (always-true policies, world-readable profiles, a public photo bucket)
and fails if any anon/public policy remains on the tables it covers. Any new
table must enable RLS and get owner-only policies in the same migration.

## Database migrations

`supabase/migrations/` holds **56** SQL files (February to September 2026)
that create about 100 tables, seed reference content (questionnaire items,
recommendations, tips, videos, resources, sample community data, milestone
reference data, report templates) and later fix schema/RLS problems. They are
applied manually; see [DEPLOYMENT.md](./DEPLOYMENT.md#2-database-migrations).

Several migrations create tables that the current UI does not use (e.g. IEP
organiser, emergency cards, therapist directory, mentorship, parent wellbeing).

## Known gaps

- **Base schema reconstructed, not dumped.** `conditions`, `questions`,
  `question_domains` and `functional_domains` were created by hand in the
  live database. `20260219000000_baseline_core_screening_tables.sql` now
  creates them, plus the 10 conditions and 8 functional domains that the seed
  migrations look up by `code`, so a fresh project builds from the repo.
  That schema was reconstructed from the code, not from production: compare
  it with `supabase db dump --schema public` and fix any differences. It is
  written to change nothing on production (`IF NOT EXISTS`, `ON CONFLICT DO
  NOTHING`, and a read policy only where a table has no SELECT policy).
  No migration seeds ASD questions, so a fresh project has the ASD condition
  with 0 questions while production has them.
- **Limited tests.** Vitest covers only pure logic in `src/lib` (scoring,
  dates, export escaping, validation). There are no component, integration or
  end-to-end tests.
- **No router** (see Navigation).
- **Type and lint errors.** `npm run typecheck` and `npm run lint` report
  existing errors; CI runs them as non-blocking until they are fixed.
- **Hand-written DB types** can drift from the real schema; generating them
  with `supabase gen types typescript` would catch mismatches.
- **Screening content is not clinically validated** (see the disclaimer in the
  README).
- **Dependency advisories.** `npm audit` still reports Vite 5 and its bundled
  `esbuild` (1 high, 1 moderate). They concern the local dev server
  (`npm run dev`), not the production bundle; fixing them needs a major Vite
  upgrade (6.4.3+ or later), which should be done and tested separately.
