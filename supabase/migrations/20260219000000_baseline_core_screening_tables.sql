/*
  # Baseline: core screening tables (RECONSTRUCTED - verify before relying on it)

  ## Why this exists
  `conditions`, `functional_domains`, `questions` and `question_domains` are
  used by the app (src/lib/database.ts) and referenced by later migrations
  (questionnaire seeds, recommendations, daily_tips, screening_results), but
  they were created by hand in the live database and no migration created
  them. A fresh Supabase project therefore could not be built from this
  folder (11 of the migrations failed with `relation "conditions" does not
  exist`).

  ## IMPORTANT
  This schema was RECONSTRUCTED FROM CODE (src/types/database.ts,
  src/lib/database.ts, and the INSERT/ALTER statements in later migrations),
  NOT from the production database. It must be compared with
  `supabase db dump --schema public` of production and corrected before it
  is relied on as the source of truth.

  On production this migration is designed to be a NO-OP:
    - every table/index is `IF NOT EXISTS`;
    - the unique constraint on `code` is added only when no single-column
      unique index on `code` exists;
    - the public-read policy is created only when the table has no SELECT
      (or ALL) policy at all;
    - ENABLE ROW LEVEL SECURITY is idempotent;
    - reference rows use `ON CONFLICT (code) DO NOTHING`.
  It never drops, alters or updates existing columns, rows or policies.

  ## Deliberately NOT included
  - conditions.explanation_en/_es, what_parents_see_en/_es, how_to_help_en/_es:
    added later by 20260220000218_add_condition_explanations_and_tips.sql
    (which only adds them when `explanation_en` is missing).
  - Questions. The questionnaire seeds (20260219234649 .. 20260219234932)
    insert them. NOTE: no migration seeds ASD questions, although the live
    database has them; a fresh project gets an ASD condition with 0 questions.

  ## Security
  Reference data: RLS enabled, SELECT for anon + authenticated, no write
  policies (so clients cannot write; service_role bypasses RLS).
*/

-- ---------------------------------------------------------------------------
-- 1. Tables
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.conditions (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code           text NOT NULL UNIQUE,
  name_en        text NOT NULL,
  name_es        text NOT NULL,
  description_en text NOT NULL DEFAULT '',
  description_es text NOT NULL DEFAULT '',
  icon           text NOT NULL DEFAULT 'brain',
  color          text NOT NULL DEFAULT 'blue',
  order_index    integer NOT NULL DEFAULT 0,
  is_active      boolean NOT NULL DEFAULT true,
  created_at     timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.functional_domains (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code           text NOT NULL UNIQUE,
  name_en        text NOT NULL,
  name_es        text NOT NULL,
  description_en text NOT NULL DEFAULT '',
  description_es text NOT NULL DEFAULT '',
  created_at     timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.questions (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  condition_id   uuid NOT NULL REFERENCES public.conditions(id) ON DELETE CASCADE,
  question_en    text NOT NULL,
  question_es    text NOT NULL,
  order_index    integer NOT NULL DEFAULT 0,
  weight         numeric NOT NULL DEFAULT 1,
  is_red_flag    boolean NOT NULL DEFAULT false,
  age_min_months integer NOT NULL DEFAULT 0,
  age_max_months integer NOT NULL DEFAULT 216,
  created_at     timestamptz NOT NULL DEFAULT now()
);

-- Join table. The FKs are required for the PostgREST embed
-- `questions?select=*,question_domains(functional_domains(*))`.
CREATE TABLE IF NOT EXISTS public.question_domains (
  question_id uuid NOT NULL REFERENCES public.questions(id) ON DELETE CASCADE,
  domain_id   uuid NOT NULL REFERENCES public.functional_domains(id) ON DELETE CASCADE,
  PRIMARY KEY (question_id, domain_id)
);

-- ---------------------------------------------------------------------------
-- 2. Unique constraint on `code` (needed by ON CONFLICT (code) below).
--    Added only when no single-column, non-partial unique index on `code`
--    exists (e.g. a hand-made production table without it).
-- ---------------------------------------------------------------------------
DO $$
DECLARE
  t text;
BEGIN
  FOREACH t IN ARRAY ARRAY['conditions', 'functional_domains'] LOOP
    IF NOT EXISTS (
      SELECT 1
      FROM pg_index i
      JOIN pg_attribute a
        ON a.attrelid = i.indrelid AND a.attnum = i.indkey[0]
      WHERE i.indrelid = format('public.%I', t)::regclass
        AND i.indisunique
        AND i.indnkeyatts = 1
        AND i.indpred IS NULL
        AND a.attname = 'code'
    ) THEN
      EXECUTE format('ALTER TABLE public.%I ADD CONSTRAINT %I UNIQUE (code)',
                     t, t || '_code_key');
    END IF;
  END LOOP;
END $$;

-- ---------------------------------------------------------------------------
-- 3. Indexes for the app's access paths
-- ---------------------------------------------------------------------------
-- getConditions(): .eq('is_active', true).order('order_index')
CREATE INDEX IF NOT EXISTS idx_conditions_active_order
  ON public.conditions (is_active, order_index);
-- getQuestionsForCondition(): .eq('condition_id', id).order('order_index')
CREATE INDEX IF NOT EXISTS idx_questions_condition_order
  ON public.questions (condition_id, order_index);
-- question_domains PK covers (question_id, ...); index the other FK.
CREATE INDEX IF NOT EXISTS idx_question_domains_domain
  ON public.question_domains (domain_id);

-- ---------------------------------------------------------------------------
-- 4. Row level security: public read, no client writes
-- ---------------------------------------------------------------------------
ALTER TABLE public.conditions         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.functional_domains ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questions          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.question_domains   ENABLE ROW LEVEL SECURITY;

-- Create a read policy only when the table has no SELECT/ALL policy yet, so
-- whatever production already has is left untouched.
DO $$
DECLARE
  t text;
BEGIN
  FOREACH t IN ARRAY ARRAY['conditions', 'functional_domains',
                           'questions', 'question_domains'] LOOP
    IF NOT EXISTS (
      SELECT 1 FROM pg_policies
      WHERE schemaname = 'public'
        AND tablename = t
        AND cmd IN ('SELECT', 'ALL')
    ) THEN
      EXECUTE format(
        'CREATE POLICY %I ON public.%I FOR SELECT TO anon, authenticated USING (true)',
        'Public can view ' || replace(t, '_', ' '), t);
    END IF;
  END LOOP;
END $$;

-- ---------------------------------------------------------------------------
-- 5. Reference rows required by the later seed migrations
--    (they look these up with `SELECT id INTO ... WHERE code = '...'`).
--    `color` must be a key of colorClasses in src/components/ConditionCard.tsx
--    (blue, green, orange, teal, pink, amber, cyan, slate, red); `icon` uses
--    lucide kebab-case names like recommendation_categories.icon (the UI does
--    not render it today).
-- ---------------------------------------------------------------------------
INSERT INTO public.conditions
  (code, name_en, name_es, description_en, description_es, icon, color, order_index, is_active)
VALUES
  ('asd',
   'Autism Spectrum Disorder (ASD)',
   'Trastorno del Espectro Autista (TEA)',
   'Social communication, interaction and repetitive behaviors or interests.',
   'Comunicación social, interacción y conductas o intereses repetitivos.',
   'puzzle', 'blue', 1, true),
  ('adhd',
   'ADHD',
   'TDAH',
   'Attention, hyperactivity and impulse control.',
   'Atención, hiperactividad y control de impulsos.',
   'zap', 'orange', 2, true),
  ('speech_delay',
   'Speech and Language Delay',
   'Retraso del Habla y Lenguaje',
   'Understanding language, speaking and expressing needs.',
   'Comprensión del lenguaje, habla y expresión de necesidades.',
   'message-circle', 'green', 3, true),
  ('developmental_delay',
   'Developmental Delay',
   'Retraso del Desarrollo',
   'Motor, cognitive, social and self-care milestones.',
   'Hitos motores, cognitivos, sociales y de cuidado personal.',
   'baby', 'teal', 4, true),
  ('learning_disorders',
   'Learning Disorders',
   'Trastornos del Aprendizaje',
   'Reading, writing and math skills.',
   'Habilidades de lectura, escritura y matemáticas.',
   'book-open', 'amber', 5, true),
  ('sensory_processing',
   'Sensory Processing',
   'Procesamiento Sensorial',
   'Responses to sounds, textures, movement and other sensations.',
   'Respuestas a sonidos, texturas, movimiento y otras sensaciones.',
   'hand', 'pink', 6, true),
  ('cerebral_palsy',
   'Cerebral Palsy',
   'Parálisis Cerebral',
   'Muscle tone, movement, posture and coordination.',
   'Tono muscular, movimiento, postura y coordinación.',
   'accessibility', 'cyan', 7, true),
  ('epilepsy',
   'Epilepsy',
   'Epilepsia',
   'Seizures, staring spells and unusual episodes.',
   'Convulsiones, episodios de mirada fija y episodios inusuales.',
   'activity', 'red', 8, true),
  ('intellectual_disability',
   'Intellectual Disability',
   'Discapacidad Intelectual',
   'Learning, reasoning, problem solving and daily living skills.',
   'Aprendizaje, razonamiento, resolución de problemas y habilidades de la vida diaria.',
   'brain', 'slate', 9, true),
  ('tourette',
   'Tourette Syndrome and Tics',
   'Síndrome de Tourette y Tics',
   'Repeated movements or sounds (tics).',
   'Movimientos o sonidos repetidos (tics).',
   'sparkles', 'orange', 10, true)
ON CONFLICT (code) DO NOTHING;

INSERT INTO public.functional_domains
  (code, name_en, name_es, description_en, description_es)
VALUES
  ('attention', 'Attention & Focus', 'Atención y Concentración',
   'Sustaining attention, focus and task completion.',
   'Mantener la atención, la concentración y completar tareas.'),
  ('behavioral', 'Behavioral Regulation', 'Regulación del Comportamiento',
   'Impulse control, activity level and emotional regulation.',
   'Control de impulsos, nivel de actividad y regulación emocional.'),
  ('cognitive', 'Cognitive Development', 'Desarrollo Cognitivo',
   'Thinking, learning, memory and problem solving.',
   'Pensamiento, aprendizaje, memoria y resolución de problemas.'),
  ('communication', 'Communication', 'Comunicación',
   'Understanding and using speech, language and gestures.',
   'Comprender y usar el habla, el lenguaje y los gestos.'),
  ('motor', 'Motor Skills', 'Habilidades Motoras',
   'Gross and fine motor skills, coordination and balance.',
   'Motricidad gruesa y fina, coordinación y equilibrio.'),
  ('sensory', 'Sensory Processing', 'Procesamiento Sensorial',
   'Responses to sounds, touch, movement, sights and tastes.',
   'Respuestas a sonidos, tacto, movimiento, imágenes y sabores.'),
  ('sleep', 'Sleep', 'Sueño',
   'Sleep patterns, falling asleep and staying asleep.',
   'Patrones de sueño, conciliar el sueño y mantenerlo.'),
  ('social', 'Social Interaction', 'Interacción Social',
   'Relating to others, play and social reciprocity.',
   'Relacionarse con otros, juego y reciprocidad social.')
ON CONFLICT (code) DO NOTHING;
