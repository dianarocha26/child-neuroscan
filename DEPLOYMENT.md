# Deployment

ChildNeuroScan is deployed on **Vercel** as a static Vite build, with
**Supabase** as the backend. There is no other supported host.

- Frontend: Vercel Git integration. Every push builds; the production branch
  (`main`) deploys to https://childneuroscan.com, every other branch and pull
  request gets a preview URL.
- Database, Auth, Storage: one Supabase project. Schema changes live in
  `supabase/migrations/` and are applied **manually** (see below).
- CI: `.github/workflows/ci.yml` runs `npm ci`, `npm run build` and `npm test`
  on every push and pull request. It does not deploy.

## 1. Vercel project settings

`vercel.json` in the repo sets the framework (Vite), build command
(`npm run build`), output directory (`dist`), SPA rewrite and headers, so the
dashboard defaults are fine.

- **Node.js version**: Project Settings -> Build and Deployment -> Node.js
  Version: 22.x (matches `.nvmrc`; `package.json` requires >= 20).
- **Environment variables** (Project Settings -> Environment Variables), set
  for both **Production** and **Preview**:

  | Name | Value |
  | --- | --- |
  | `VITE_SUPABASE_URL` | `https://<project-ref>.supabase.co` |
  | `VITE_SUPABASE_ANON_KEY` | the project's anon / public key |

  These are inlined into the JavaScript bundle at build time, so after
  changing them you must **redeploy**. A missing value does not fail the build;
  the deployed app shows a blank page and logs
  `Missing Supabase environment variables` in the console. Never put the
  `service_role` key in a `VITE_` variable.

  Preview deployments use the same Supabase project as production unless you
  point the Preview variables at a separate project.

### What vercel.json does

- **Rewrite**: any path that is not under `/assets/` and has no file extension
  is served `/index.html` (the app has no URL routes; this only keeps deep
  links and refreshes from 404-ing). Vercel checks real files first, so
  existing files are served normally. A missing hashed chunk such as
  `/assets/index-abc123.js` returns a real 404 instead of `index.html` with
  status 200, which would otherwise break module loading after a deploy.
- **Caching**: `/assets/*` (content-hashed by Vite) is
  `public, max-age=31536000, immutable`. `/`, `/index.html`, `/sw.js` and
  `/manifest.json` are `no-cache` so a new deploy is picked up right away.
  `sw.js` must never be cached long-term.
- **Security headers** on every response: HSTS, `X-Content-Type-Options`,
  `X-Frame-Options: DENY`, `Referrer-Policy`, `Permissions-Policy` (camera,
  microphone, geolocation off) and a Content-Security-Policy.

### Content-Security-Policy

The CSP only allows what the app actually loads:

| Directive | Allows | Why |
| --- | --- | --- |
| `script-src` | `'self'` | Vite emits only external module scripts |
| `style-src` | `'self' 'unsafe-inline'` | React `style={}` props and the print/report window's inline `<style>` |
| `font-src` | `'self' data:` | Inter is self-hosted via `@fontsource/inter` |
| `img-src` | `'self' data: blob:`, `*.supabase.co`, `images.pexels.com` | photo previews (blob), signed Storage URLs, video thumbnails seeded from Pexels |
| `media-src` | `'self' blob:`, `*.supabase.co` | photo-journal videos |
| `connect-src` | `'self'`, `https://*.supabase.co`, `wss://*.supabase.co` | Supabase REST/Auth/Storage/Realtime |
| `frame-src` | `www.youtube.com`, `www.youtube-nocookie.com` | video library embeds |

If you add content from a new host (for example a video in the `videos` table
that is not on YouTube, or thumbnails from another CDN), add that host to the
CSP or it will be blocked. Check the browser console for
`Refused to ... because it violates the Content Security Policy`.

The Vercel preview toolbar/comments script is not in the CSP, so it will not
load on preview deployments. Add `https://vercel.live` to `script-src`,
`connect-src` and `frame-src` if you want it.

## 2. Database migrations

Migrations are plain SQL files in `supabase/migrations/`, named
`<timestamp>_<description>.sql` and applied in filename order. There is no
automated migration step in CI or on Vercel.

**Rule: apply database migrations before deploying the frontend that needs
them.** Migrations should be backwards compatible with the currently deployed
frontend (add columns/tables first, remove old ones in a later release), so the
order "migrate, then merge/deploy" is always safe.

Two ways to apply a migration:

1. **SQL editor** (what has been used so far): Supabase Dashboard -> SQL
   Editor, paste the file contents, run. Do this once per new file, in order.
   The dashboard does not record this in the CLI's migration history.
2. **Supabase CLI**:

   ```bash
   npx supabase login
   npx supabase link --project-ref <project-ref>
   npx supabase migration list        # compare local files vs. remote history
   npx supabase db push               # applies files not yet in remote history
   ```

   Because earlier migrations were applied through the dashboard, the remote
   history may not list them and `db push` would try to re-run all of them.
   Before the first `db push`, check `migration list` and mark files that are
   already applied with
   `npx supabase migration repair --status applied <timestamp>`.

After applying a migration, check it in the dashboard (Table Editor / Auth
policies) and run the relevant part of the smoke test below.

Note: the tables `conditions`, `questions`, `question_domains` and
`functional_domains` were created by hand in the live database.
`20260219000000_baseline_core_screening_tables.sql` recreates them so a new
project can be built from this folder. It was reconstructed from the code, so
diff it against `supabase db dump --schema public` of production before
relying on it. It is idempotent and should change nothing on production.
Because its timestamp is older than the migrations already applied, mark it
as applied there
(`npx supabase migration repair --status applied 20260219000000`) instead of
pushing it. A new project gets no ASD questions: no migration seeds them.

## 3. Supabase Auth URL configuration

Supabase Dashboard -> Authentication -> URL Configuration:

- **Site URL**: `https://childneuroscan.com`. Sign-up confirmation emails link
  here.
- **Redirect URLs** (allow-list). The password-reset flow calls
  `resetPasswordForEmail` with `redirectTo: window.location.origin`, so every
  origin the app runs on must be listed, or the reset link falls back to the
  Site URL:
  - `https://childneuroscan.com/**`
  - `https://www.childneuroscan.com/**` (if `www` is served)
  - Vercel previews: `https://*-<vercel-team-slug>.vercel.app/**` (match your
    project's preview URL pattern, shown on any preview deployment)
  - Local development: `http://localhost:5173/**`

Also under Authentication: Email provider enabled (email + password is the
only sign-in method the app uses).

## 4. Rollback

- **Frontend**: Vercel Dashboard -> Deployments -> pick the last good
  production deployment -> **Instant Rollback** (or "Promote to Production").
  This is immediate and does not rebuild. Then revert the bad commit on `main`
  so the next push does not redeploy it.
- **Database**: migrations are **forward-only**; there are no down migrations.
  To undo a schema change, write and apply a new migration that reverses it.
  For data loss, restore from Supabase backups (Dashboard -> Database ->
  Backups; availability depends on the plan).
- Because migrations are applied first and are backwards compatible, rolling
  back the frontend alone is normally safe.

## 5. Post-deploy smoke test

Run on the production URL (and on the preview URL before merging anything
risky). Use a private window so no old service worker or session interferes.

- [ ] Home page loads, no errors in the browser console, no CSP violations.
- [ ] Hard-refresh a deep path (e.g. `/anything`): the app loads (SPA rewrite).
- [ ] `https://childneuroscan.com/assets/does-not-exist.js` returns **404**,
      not the HTML page.
- [ ] Response headers (DevTools -> Network -> document): CSP, HSTS,
      `X-Frame-Options: DENY` present; `/sw.js` and `/` have
      `Cache-Control: no-cache`; an `/assets/*.js` file has
      `max-age=31536000, immutable`.
- [ ] Switch language EN/ES; labels change.
- [ ] As a guest: choose a condition, enter an age, answer the questionnaire,
      see the result with the not-a-diagnosis note.
- [ ] Sign up / log in; the guest screening can be saved and appears in the
      progress dashboard.
- [ ] "Forgot password": the email arrives and its link opens the reset screen
      on the same domain.
- [ ] Create, edit and delete an entry in one tracker (e.g. behaviour diary).
- [ ] Photo journal: upload an image, it displays (signed URL), delete it.
- [ ] Video library: a video plays (YouTube embed not blocked).
- [ ] Generate a report and open the print view / CSV export.
- [ ] After a second deploy, an open tab offers to reload (service worker
      update) and the new version loads.
