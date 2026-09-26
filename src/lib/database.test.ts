import { describe, expect, it, vi } from 'vitest';
import type { FunctionalDomain, Question } from '../types/database';
import { calculateScreeningScore } from './database';

// src/lib/supabase.ts throws at import time without VITE_SUPABASE_* env vars;
// calculateScreeningScore never touches the client, so a stub is enough.
// (vi.mock is hoisted above the imports.)
vi.mock('./supabase', () => ({ supabase: {} }));

function domain(id: string, code = id.toUpperCase()): FunctionalDomain {
  return {
    id,
    code,
    name_en: code,
    name_es: code,
    description_en: '',
    description_es: '',
    created_at: '2024-01-01T00:00:00Z',
  };
}

let seq = 0;
function question(overrides: Partial<Question> = {}): Question {
  seq += 1;
  return {
    id: `q${seq}`,
    condition_id: 'cond',
    question_en: `Question ${seq}`,
    question_es: `Pregunta ${seq}`,
    order_index: seq,
    weight: 1,
    is_red_flag: false,
    age_min_months: 0,
    age_max_months: 216,
    created_at: '2024-01-01T00:00:00Z',
    ...overrides,
  };
}

/** Ten weight-1 questions with the first `yes` answered 'yes'. */
function tenQuestionsWithYes(yes: number) {
  const questions = Array.from({ length: 10 }, () => question());
  const responses = Object.fromEntries(questions.map((q, i) => [q.id, i < yes]));
  return { questions, responses };
}

const score = (responses: Record<string, boolean>, questions: Question[], age = 36) =>
  calculateScreeningScore('cond', responses, questions, age);

describe('calculateScreeningScore', () => {
  describe('age filtering', () => {
    it('only counts questions whose age range includes the child (inclusive bounds)', async () => {
      const qs = [
        question({ id: 'young', age_min_months: 0, age_max_months: 23, weight: 5 }),
        question({ id: 'lower-edge', age_min_months: 24, age_max_months: 48, weight: 2 }),
        question({ id: 'upper-edge', age_min_months: 12, age_max_months: 24, weight: 3 }),
        question({ id: 'old', age_min_months: 25, age_max_months: 60, weight: 7 }),
      ];
      const all = { young: true, 'lower-edge': true, 'upper-edge': false, old: true };

      const result = await score(all, qs, 24);

      expect(result.maxScore).toBe(5); // lower-edge (2) + upper-edge (3)
      expect(result.totalScore).toBe(2); // only lower-edge answered yes in range
    });

    it('ignores red flags and domains of out-of-range questions', async () => {
      const qs = [
        question({ id: 'flag', is_red_flag: true, age_min_months: 60, age_max_months: 120, domains: [domain('social')] }),
        question({ id: 'in', weight: 1 }),
      ];
      const result = await score({ flag: true, in: false }, qs, 36);

      expect(result.hasRedFlags).toBe(false);
      expect(result.riskLevel).toBe('low');
      expect(result.domainScores).toEqual({});
      expect(result.maxScore).toBe(1);
    });
  });

  describe('scoring', () => {
    it('sums the weights of "yes" answers against the weights of all in-range questions', async () => {
      const qs = [
        question({ id: 'a', weight: 3 }),
        question({ id: 'b', weight: 2 }),
        question({ id: 'c', weight: 5 }),
      ];
      const result = await score({ a: true, b: false, c: true }, qs);

      expect(result.totalScore).toBe(8);
      expect(result.maxScore).toBe(10);
    });

    it('treats unanswered questions as "no" but still counts them in maxScore', async () => {
      const qs = [question({ id: 'a', weight: 2 }), question({ id: 'b', weight: 2 })];
      const result = await score({ a: true }, qs);

      expect(result.totalScore).toBe(2);
      expect(result.maxScore).toBe(4);
    });

    it('ignores responses for question ids that are not in the question set', async () => {
      const qs = [question({ id: 'a' })];
      const result = await score({ a: false, ghost: true }, qs);

      expect(result.totalScore).toBe(0);
      expect(result.maxScore).toBe(1);
    });

    it('returns a zero, low-risk result when no questions apply', async () => {
      await expect(score({}, [])).resolves.toEqual({
        totalScore: 0,
        maxScore: 0,
        riskLevel: 'low',
        hasRedFlags: false,
        domainScores: {},
      });

      const onlyOutOfRange = [question({ age_min_months: 100, age_max_months: 200 })];
      const result = await score({ [onlyOutOfRange[0].id]: true }, onlyOutOfRange, 12);
      expect(result).toMatchObject({ totalScore: 0, maxScore: 0, riskLevel: 'low' });
    });
  });

  describe('risk thresholds (share of weighted "yes" answers)', () => {
    it.each([
      [0, 'low'],
      [2, 'low'], // 20%
      [3, 'moderate'], // exactly 30%
      [5, 'moderate'], // 50%
      [6, 'high'], // exactly 60%
      [10, 'high'],
    ] as const)('%i/10 yes -> %s', async (yes, expected) => {
      const { questions, responses } = tenQuestionsWithYes(yes);
      const result = await score(responses, questions);
      expect(result.riskLevel).toBe(expected);
      expect(result.hasRedFlags).toBe(false);
    });

    it('uses >= at the boundaries: just below 30% is low, just below 60% is moderate', async () => {
      // 29/100 and 59/100 via weights.
      const low = [question({ id: 'y', weight: 29 }), question({ id: 'n', weight: 71 })];
      expect((await score({ y: true }, low)).riskLevel).toBe('low');

      const moderate = [question({ id: 'y', weight: 59 }), question({ id: 'n', weight: 41 })];
      expect((await score({ y: true }, moderate)).riskLevel).toBe('moderate');
    });

    it('is driven by weight, not by question count', async () => {
      const qs = [
        question({ id: 'heavy', weight: 7 }),
        question({ id: 'l1', weight: 1 }),
        question({ id: 'l2', weight: 1 }),
        question({ id: 'l3', weight: 1 }),
      ];
      // 1 of 4 questions, but 70% of the weight.
      expect((await score({ heavy: true }, qs)).riskLevel).toBe('high');
      // 3 of 4 questions, but 30% of the weight.
      expect((await score({ l1: true, l2: true, l3: true }, qs)).riskLevel).toBe('moderate');
    });
  });

  describe('red flags', () => {
    it('a single "yes" on a red-flag question forces high risk regardless of percentage', async () => {
      const qs = [
        question({ id: 'flag', is_red_flag: true, weight: 1 }),
        ...Array.from({ length: 19 }, (_, i) => question({ id: `n${i}` })),
      ];
      const result = await score({ flag: true }, qs); // 5%

      expect(result.hasRedFlags).toBe(true);
      expect(result.riskLevel).toBe('high');
    });

    it('a red-flag question answered "no" or left unanswered does not raise risk', async () => {
      const qs = [question({ id: 'flag', is_red_flag: true }), question({ id: 'other' })];

      for (const responses of [{ flag: false }, {}] as Record<string, boolean>[]) {
        const result = await score(responses, qs);
        expect(result.hasRedFlags).toBe(false);
        expect(result.riskLevel).toBe('low');
      }
    });
  });

  describe('domain scores', () => {
    it('aggregates score and max per domain across questions, including "no" answers', async () => {
      const social = domain('d-social', 'SOCIAL');
      const motor = domain('d-motor', 'MOTOR');
      const qs = [
        question({ id: 'a', weight: 2, domains: [social] }),
        question({ id: 'b', weight: 3, domains: [social, motor] }),
        question({ id: 'c', weight: 1, domains: [motor] }),
        question({ id: 'd', weight: 4 }), // no domains
      ];
      const result = await score({ a: true, b: false, c: true, d: true }, qs);

      expect(result.domainScores).toEqual({
        'd-social': { domain_id: 'd-social', domain_code: 'SOCIAL', score: 2, max_score: 5, percentage: 40 },
        'd-motor': { domain_id: 'd-motor', domain_code: 'MOTOR', score: 1, max_score: 4, percentage: 25 },
      });
      // Domain-less questions still count toward the overall score.
      expect(result.totalScore).toBe(7);
      expect(result.maxScore).toBe(10);
    });

    it('reports a domain with 0% when all its questions are answered "no"', async () => {
      const qs = [question({ id: 'a', weight: 2, domains: [domain('x')] })];
      const result = await score({ a: false }, qs);

      expect(result.domainScores.x).toEqual({ domain_id: 'x', domain_code: 'X', score: 0, max_score: 2, percentage: 0 });
    });

    it('treats an empty domains array like no domains', async () => {
      const qs = [question({ id: 'a', domains: [] })];
      expect((await score({ a: true }, qs)).domainScores).toEqual({});
    });
  });
});
