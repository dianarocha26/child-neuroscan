# Changelog

All notable changes to this project are documented here. The format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

The project has no release tags. The only version number in the history is
`2.1.0` in `package.json`, present since the first commit, so entries below are
grouped by what the git history actually shows.

## [Unreleased]

### Phase 2: repository cleanup (branch `claude/phase-2-cleanup`)

#### Added
- GitHub Actions CI (`.github/workflows/ci.yml`): `npm ci` and a blocking
  `npm run build` on every push and pull request; `typecheck` and `lint` run
  but are non-blocking until existing errors are fixed.
- Vitest unit tests for `src/lib` (`npm test`, blocking in CI): screening
  score, local dates, export escaping, validation.
- Baseline migration `20260219000000_baseline_core_screening_tables.sql`
  (reconstructed from the code) so a fresh Supabase project builds.
- Shared `AppHeader` (home, search, language, account) and `.modal-overlay` /
  `.modal-panel` classes used by the app's modals.
- PWA icons and Open Graph image in `public/`.
- `.nvmrc` (Node 22) and `"engines": { "node": ">=20" }` in `package.json`.
- Content-Security-Policy and HSTS headers in `vercel.json`.
- Consolidated documentation: `README.md` (with clinical disclaimer),
  `ARCHITECTURE.md`, `DEPLOYMENT.md`, this changelog.

#### Changed
- `vercel.json`: the SPA rewrite no longer serves `index.html` for missing
  `/assets/*` or other files with an extension (they now 404); `/assets/*` is
  cached as immutable while `/`, `/index.html`, `/sw.js` and `/manifest.json`
  are `no-cache`.
- Inter is self-hosted with `@fontsource/inter` instead of loaded from Google
  Fonts.
- Service worker is versioned per build and only handles same-origin
  navigations and hashed assets.
- `robots.txt` and `sitemap.xml` list only the root URL (the app has no
  routes).
- `.env.example` lists only the two variables the code reads.
- `.gitignore` also ignores `.env.*` (except `.env.example`), `.vercel`,
  `supabase/.temp`, `coverage` and `*.tsbuildinfo`.
- `package.json`: license set to `UNLICENSED` (no license chosen yet);
  removed the no-op `prepare`, `analyze` and the `format` script (Prettier is
  not installed).
- `npm audit fix` (non-breaking): updated vulnerable transitive dev
  dependencies.

#### Removed
- Netlify and "Antigravity" deployment configs and scripts (`netlify.toml`,
  `deploy.sh`, `antigravity.json`, `.antigravityignore`); the app is deployed
  only on Vercel.
- `test-connection.html`, which contained a hard-coded Supabase URL and anon
  key.
- 13 overlapping or inaccurate Markdown documents (deployment guides,
  improvement summaries, feature lists) and `TECHNICAL.md`, replaced by the
  four documents above.
- Unused components, hooks and library modules.

### Phase 1: security and core fixes (branch `claude/new-session-4u6qtr`)

Adds five migrations that must be applied to Supabase before this frontend is
deployed: `20260224040000`, `20260224040100`, `20260224040200`,
`20260925000000`, `20260925000100`.

#### Security
- Closed public Row Level Security holes: community posts, comments and likes,
  `user_profiles` and `user_saved_resources` were readable or writable by
  anyone with the anon key. Access is now owner-only, moderation and counter
  columns are protected by column grants, and the migration fails if any
  anon/public policy remains (`20260925000000_fix_critical_rls_policies.sql`).
- The `photo-journal` storage bucket is private; photos are shown through
  short-lived signed URLs.
- Report exports escape user text in generated HTML and neutralise CSV/Excel
  formula injection.

#### Added
- Forgot-password and reset-password flow.
- `screening_results` table (the app used it but no migration created it) and
  a `max_score` column.
- Reminders screen backed by the existing `reminders` table (the screen
  previously showed a copy of the photo journal).
- "Is this working?" rating on reward charts (`reward_charts.is_effective`).

#### Fixed
- Screenings failed to save and the questionnaire hung on submit.
- A guest's screening was lost when they logged in to save it.
- Rewards entries and goals failed to save (column name mismatch).
- Data loss in the sensory profile, photo journal and appointment preparation.
- Blank labels in the report generator and analytics dashboard.
- Comprehensive report showed zeros and its export crashed.
- Missing back buttons (video library, resource finder); mobile navigation
  tabs that were blank or pointed to the wrong screen.
- Dates: local-day helpers so "today" is not tomorrow in the evening.
- Dark mode made most screens unreadable; the app is forced to light mode
  until screens support it.

#### Changed
- Clinical-safety wording: results and reports state that this is a
  parent-reported screening, not a diagnosis; neutral condition headings;
  tappable US crisis lines (911, 988, Crisis Text Line, Poison Control).

#### Removed
- Debug logging and on-screen debug banners.
- 38 accidentally committed duplicate files (`* 2.*`) and unused large images.

## 2026-06-11

Commits `cf671b8` and `fbbcbe3` on `main`.

### Fixed
- Edit and delete in appointment preparation, behaviour diary, crisis plan,
  goals, medications, photo journal, rewards and visual schedule.

### Changed
- New SVG favicon.

## [2.1.0] - 2026-02-26

Initial commit (`5f64f7a`) importing the existing application: React + Vite +
Supabase app with condition screening questionnaires, tracking tools,
community, video library, report generation, EN/ES language support, and the
50 Supabase migrations (up to `20260224033202_create_app_logs_table.sql`).
