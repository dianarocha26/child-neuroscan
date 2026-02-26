export type RiskLevel = 'low' | 'moderate' | 'high';
export type Language = 'en' | 'es';

export interface Condition {
  id: string;
  code: string;
  name_en: string;
  name_es: string;
  description_en: string;
  description_es: string;
  icon: string;
  color: string;
  order_index: number;
  is_active: boolean;
  created_at: string;
  explanation_en?: string;
  explanation_es?: string;
  what_parents_see_en?: string;
  what_parents_see_es?: string;
  how_to_help_en?: string;
  how_to_help_es?: string;
}

export interface FunctionalDomain {
  id: string;
  code: string;
  name_en: string;
  name_es: string;
  description_en: string;
  description_es: string;
  created_at: string;
}

export interface Question {
  id: string;
  condition_id: string;
  question_en: string;
  question_es: string;
  order_index: number;
  weight: number;
  is_red_flag: boolean;
  age_min_months: number;
  age_max_months: number;
  created_at: string;
  domains?: FunctionalDomain[];
}

export interface DomainScore {
  domain_id: string;
  domain_code: string;
  score: number;
  max_score: number;
  percentage: number;
}

export interface ScreeningResult {
  id: string;
  condition_id: string;
  child_age_months: number;
  language: Language;
  responses: Record<string, boolean>;
  total_score: number;
  risk_level: RiskLevel;
  has_red_flags: boolean;
  domain_scores: Record<string, DomainScore>;
  completed_at: string;
  created_at: string;
}

export interface RecommendationCategory {
  id: string;
  code: string;
  name_en: string;
  name_es: string;
  icon: string;
  order_index: number;
  created_at: string;
}

export interface Recommendation {
  id: string;
  condition_id: string;
  category_id: string;
  title_en: string;
  title_es: string;
  description_en: string;
  description_es: string;
  priority: number;
  risk_levels: string[];
  age_min_months: number;
  age_max_months: number;
  created_at: string;
  category?: RecommendationCategory;
}

export interface DailyTip {
  id: string;
  condition_id: string;
  title_en: string;
  title_es: string;
  description_en: string;
  description_es: string;
  time_needed_minutes: number;
  difficulty: 'easy' | 'moderate' | 'challenging';
  category: string;
  order_index: number;
  created_at: string;
}
