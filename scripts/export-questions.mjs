#!/usr/bin/env node
// Export screening questions from a Supabase project (public anon read) as
// idempotent SQL for another project. Conditions and domains are matched by
// `code`, so UUIDs don't need to match between projects.
//
// Usage:
//   SUPABASE_URL=https://xxx.supabase.co SUPABASE_ANON_KEY=... \
//     node scripts/export-questions.mjs asd > asd_questions.sql

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_ANON_KEY;
const codes = process.argv.slice(2);
if (!url || !key || codes.length === 0) {
  console.error('Usage: SUPABASE_URL=... SUPABASE_ANON_KEY=... node scripts/export-questions.mjs <condition_code>...');
  process.exit(1);
}

async function get(path) {
  const res = await fetch(`${url}/rest/v1/${path}`, {
    headers: { apikey: key, Authorization: `Bearer ${key}` },
  });
  if (!res.ok) throw new Error(`${res.status} ${await res.text()}`);
  return res.json();
}

const lit = (v) =>
  v === null || v === undefined ? 'NULL'
  : typeof v === 'number' || typeof v === 'boolean' ? String(v)
  : `'${String(v).replace(/'/g, "''")}'`;

const cols = ['question_en', 'question_es', 'order_index', 'weight', 'is_red_flag', 'age_min_months', 'age_max_months'];
const out = ['BEGIN;'];

for (const code of codes) {
  const [condition] = await get(`conditions?select=id&code=eq.${encodeURIComponent(code)}`);
  if (!condition) throw new Error(`No condition with code "${code}"`);
  const questions = await get(
    `questions?select=*,question_domains(functional_domains(code))&condition_id=eq.${condition.id}&order=order_index`
  );
  out.push(`-- ${questions.length} questions for "${code}"`);
  for (const q of questions) {
    out.push(
      `INSERT INTO public.questions (id, condition_id, ${cols.join(', ')})\n` +
      `SELECT ${lit(q.id)}, c.id, ${cols.map((c) => lit(q[c])).join(', ')}\n` +
      `FROM public.conditions c WHERE c.code = ${lit(code)}\nON CONFLICT (id) DO NOTHING;`
    );
    for (const qd of q.question_domains ?? []) {
      const domain = qd.functional_domains?.code;
      if (!domain) continue;
      out.push(
        `INSERT INTO public.question_domains (question_id, domain_id)\n` +
        `SELECT ${lit(q.id)}, d.id FROM public.functional_domains d WHERE d.code = ${lit(domain)}\n` +
        `ON CONFLICT DO NOTHING;`
      );
    }
  }
}

out.push('COMMIT;');
console.log(out.join('\n'));
