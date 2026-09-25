# CLAUDE.md

Guidance for Claude Code sessions on this repo.

## Project
React 18 + Vite + TypeScript + Tailwind, Supabase (auth, Postgres with RLS, storage), hosted on Vercel (childneuroscan.com). See README.md and ARCHITECTURE.md.

- App is **English-only** for now (Spanish kept in code behind a flag) and **light mode only**.
- Migrations in `supabase/migrations/` are applied manually by the owner. Never assume they have run on production.
- Never push to `main` without the owner's explicit go-ahead. Work on a `claude/*` branch. No force push.
- Never read real user data from the production Supabase.

## Working style (default for every session)
- Answers short and plain. Results, not narration. Push back when something doesn't make sense.
- One session per phase. Start by reading the current phase handoff file (e.g. `PHASE3.md`) instead of re-auditing the repo.
- End every phase by committing, pushing, and updating/writing the next handoff file (scope, decisions, open questions).
- Collect owner decisions in one batched list, not one question at a time.
- Screenshots only at the end of a phase, unless asked.

## Subagents
- Few agents, narrow scope ("fix these files"), not open-ended audits.
- Split work by files so agents never edit the same file in parallel.
- Pattern: one fixer, then one round of parallel reviewers (report only, with file paths), then one fixer applies all findings.
- Always include security, database and architecture review for changes touching those areas.
- Use cheaper models (Sonnet/Haiku) for mechanical work (renames, deletions, copy edits); stronger models for DB, security, architecture.

## Checks before any push
- `npm run build` and `npm test` must pass.
- `npx tsc --noEmit -p tsconfig.app.json` and `npx eslint src` must not add errors vs. the previous baseline.
