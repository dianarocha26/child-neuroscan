# ChildNeuroScan

A bilingual (English/Spanish) web app for parents and caregivers to run
parent-reported developmental screening questionnaires and to keep track of a
child's day-to-day care: behaviour, medications, goals, routines, appointments,
reminders, rewards, a photo journal, a crisis plan and printable reports.

It is a single-page React app backed by Supabase (Postgres, Auth, Storage) and
deployed on Vercel at https://childneuroscan.com.

## Clinical disclaimer

**ChildNeuroScan is not a diagnostic tool and does not provide medical advice.**

- The screenings are yes/no questionnaires answered by a parent or caregiver.
  They were written for this app; they are **not** validated clinical
  instruments (such as M-CHAT or Vanderbilt), and they have not been clinically
  evaluated.
- The result ("low" / "moderate" / "high") comes from a simple weighted score:
  the share of age-appropriate items answered "yes", with fixed cut-offs
  (30% and 60%), and any "red flag" item answered "yes" makes the result
  "high". See `calculateScreeningScore` in `src/lib/database.ts`.
- A result only suggests whether it may be worth talking to a paediatrician
  or a qualified specialist. It cannot confirm or rule out any condition.
- The crisis resources shown in the app (911, 988, Crisis Text Line, Poison
  Control) are US-only.

Anyone changing questionnaire content, scoring or result wording should keep
this framing intact.

## What is in the app

- **Screening**: pick a condition, enter the child's age, answer the
  questionnaire, see the result. Guests can take a screening; saving it
  requires an account.
- **Tracking tools** (signed-in users): progress dashboard, behaviour diary,
  medication tracker, goal tracker, rewards charts, visual schedule, sensory
  profile, reminders, appointment preparation, photo journal (private storage,
  signed URLs), crisis plan, analytics, report generator (HTML/print/CSV/JSON
  export).
- **Content**: condition information, recommendations, daily tips, therapy
  resources, a video library (YouTube embeds) and a community board.

## Tech stack

| Area | Choice |
| --- | --- |
| UI | React 18, TypeScript, Tailwind CSS 3, lucide-react icons, self-hosted Inter (`@fontsource/inter`) |
| Build | Vite 5 |
| Backend | Supabase: Postgres with Row Level Security, Auth (email + password), Storage |
| Hosting | Vercel (static build, Git integration) |
| Tests | Vitest unit tests for `src/lib` (`src/lib/*.test.ts`) |
| CI | GitHub Actions (`.github/workflows/ci.yml`): install, build, unit tests |

There is no router, no global state library and no component or end-to-end
tests yet. See
[ARCHITECTURE.md](./ARCHITECTURE.md) for details and known gaps.

## Quick start

Requirements: Node 22 (see `.nvmrc`; Node 20+ works) and access to a Supabase
project.

```bash
nvm use            # optional, picks up .nvmrc
npm ci
cp .env.example .env
# edit .env: set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY
npm run dev        # http://localhost:5173
```

A fresh Supabase project can be built from `supabase/migrations/`. The core
screening tables come from a baseline migration
(`20260219000000_baseline_core_screening_tables.sql`) that was reconstructed
from the code and still has to be verified against a dump of production.
Autism (ASD) questions are not in any migration yet, so a fresh project has
the ASD condition with no questions. See "Known gaps" in
[ARCHITECTURE.md](./ARCHITECTURE.md).

## Scripts

| Script | What it does |
| --- | --- |
| `npm run dev` | Vite dev server with hot reload (port 5173) |
| `npm run build` | Production build into `dist/` |
| `npm run build:clean` | Delete `dist/` and build |
| `npm run preview` | Serve the production build locally (port 4173) |
| `npm test` | Vitest unit tests (`src/lib`, Supabase mocked; no env vars needed) |
| `npm run typecheck` | `tsc --noEmit` on the app sources (currently reports errors) |
| `npm run lint` | ESLint (currently reports errors) |
| `npm run lint:fix` | ESLint with `--fix` |
| `npm run clean` | Delete `dist/` and `node_modules/` |

## Environment variables

Only two variables are read by the app (`src/lib/supabase.ts`). Both are
embedded in the browser bundle at build time, so they are public by design;
data access is protected by Row Level Security, not by keeping these secret.

| Variable | Required | Description |
| --- | --- | --- |
| `VITE_SUPABASE_URL` | yes | Supabase project URL, e.g. `https://<ref>.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | yes | Supabase anon (public) API key. Never use the `service_role` key here. |

If either is missing the build still succeeds, but the app throws at start-up
and shows a blank page.

## Project structure

```
.
├── .github/workflows/ci.yml   CI: npm ci + build + test (typecheck/lint non-blocking)
├── public/                    Static files copied as-is (icons, manifest, sw.js, robots, sitemap)
├── src/
│   ├── main.tsx               Entry: providers + service worker registration
│   ├── App.tsx                Screen state machine (all navigation lives here)
│   ├── components/            One component per screen/feature, plus shared UI
│   ├── contexts/              AuthContext, LanguageContext, ChildrenContext, DialogContext
│   ├── hooks/                 Small shared hooks
│   ├── lib/                   Supabase client, data helpers, export, logging, dates
│   └── types/                 Shared TypeScript types
├── supabase/migrations/       SQL migrations (applied manually, see DEPLOYMENT.md)
├── vercel.json                SPA rewrite, cache and security headers (incl. CSP)
└── vite.config.ts             Build config (vendor chunks, service-worker build id)
```

## Documentation

- [ARCHITECTURE.md](./ARCHITECTURE.md): how the app is put together, data and
  security model, known gaps.
- [DEPLOYMENT.md](./DEPLOYMENT.md): Vercel setup, database migrations, Supabase
  Auth URLs, rollback, post-deploy checks.
- [CHANGELOG.md](./CHANGELOG.md): history of notable changes.

## License

No open-source license has been chosen yet (`"license": "UNLICENSED"` in
`package.json`). All rights reserved by the owner until a license is added.
