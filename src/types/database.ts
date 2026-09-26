import type { Tables } from './supabase';

export type RiskLevel = 'low' | 'moderate' | 'high';
export type Language = 'en' | 'es';

export type Condition = Tables<'conditions'>;
export type FunctionalDomain = Tables<'functional_domains'>;

export type Question = Tables<'questions'> & {
  domains?: FunctionalDomain[];
};

// type (not interface) so it stays assignable to the generated Json type
export type DomainScore = {
  domain_id: string;
  domain_code: string;
  score: number;
  max_score: number;
  percentage: number;
};

/** screening_results row with its text/JSON columns narrowed (see toScreeningResult in lib/database) */
export type ScreeningResult = Omit<
  Tables<'screening_results'>,
  'language' | 'responses' | 'risk_level' | 'domain_scores' | 'created_at'
> & {
  created_at: string;
  language: Language;
  responses: Record<string, boolean>;
  risk_level: RiskLevel;
  domain_scores: Record<string, DomainScore>;
};

/** Screening result as read back with its condition embedded */
export type ScreeningResultWithCondition = ScreeningResult & { condition: Condition };

export type RecommendationCategory = Tables<'recommendation_categories'>;

export type Recommendation = Tables<'recommendations'> & {
  category?: RecommendationCategory | null;
};

export type DailyTip = Tables<'daily_tips'>;
