import { supabase } from './supabase';
import type {
  Condition,
  Question,
  FunctionalDomain,
  ScreeningResult,
  RiskLevel,
  Language,
  DomainScore,
  Recommendation,
  DailyTip
} from '../types/database';

export async function getConditions(): Promise<Condition[]> {
  console.log('>>> getConditions: Starting query...');
  console.log('>>> Supabase client:', supabase);

  const { data, error } = await supabase
    .from('conditions')
    .select('*')
    .eq('is_active', true)
    .order('order_index');

  console.log('>>> getConditions: Query result:', { data, error });

  if (error) {
    console.error('>>> getConditions: ERROR', error);
    throw error;
  }

  console.log('>>> getConditions: Returning data:', data);
  return data || [];
}

interface QuestionWithDomains {
  id: string;
  condition_id: string;
  question_text_en: string;
  question_text_es: string;
  weight: number;
  is_red_flag: boolean;
  age_min_months: number;
  age_max_months: number;
  order_index: number;
  question_domains?: Array<{
    functional_domains: FunctionalDomain;
  }>;
}

export async function getQuestionsForCondition(conditionId: string): Promise<Question[]> {
  const { data, error } = await supabase
    .from('questions')
    .select(`
      *,
      question_domains (
        functional_domains (*)
      )
    `)
    .eq('condition_id', conditionId)
    .order('order_index');

  if (error) throw error;

  return (data || []).map((q: QuestionWithDomains) => ({
    ...q,
    domains: q.question_domains?.map((qd) => qd.functional_domains) || []
  }));
}

export async function calculateScreeningScore(
  conditionId: string,
  responses: Record<string, boolean>,
  questions: Question[],
  childAgeMonths: number
): Promise<{
  totalScore: number;
  maxScore: number;
  riskLevel: RiskLevel;
  hasRedFlags: boolean;
  domainScores: Record<string, DomainScore>;
}> {
  let totalScore = 0;
  let maxScore = 0;
  let hasRedFlags = false;
  const domainScoresMap: Record<string, { score: number; maxScore: number; domain: FunctionalDomain }> = {};

  for (const question of questions) {
    if (childAgeMonths >= question.age_min_months && childAgeMonths <= question.age_max_months) {
      const response = responses[question.id];
      maxScore += question.weight;

      if (response === true) {
        totalScore += question.weight;

        if (question.is_red_flag) {
          hasRedFlags = true;
        }

        if (question.domains) {
          for (const domain of question.domains) {
            if (!domainScoresMap[domain.id]) {
              domainScoresMap[domain.id] = {
                score: 0,
                maxScore: 0,
                domain
              };
            }
            domainScoresMap[domain.id].score += question.weight;
            domainScoresMap[domain.id].maxScore += question.weight;
          }
        }
      } else {
        if (question.domains) {
          for (const domain of question.domains) {
            if (!domainScoresMap[domain.id]) {
              domainScoresMap[domain.id] = {
                score: 0,
                maxScore: 0,
                domain
              };
            }
            domainScoresMap[domain.id].maxScore += question.weight;
          }
        }
      }
    }
  }

  const percentage = maxScore > 0 ? (totalScore / maxScore) * 100 : 0;

  let riskLevel: RiskLevel;
  if (hasRedFlags || percentage >= 60) {
    riskLevel = 'high';
  } else if (percentage >= 30) {
    riskLevel = 'moderate';
  } else {
    riskLevel = 'low';
  }

  const domainScores: Record<string, DomainScore> = {};
  for (const [domainId, data] of Object.entries(domainScoresMap)) {
    domainScores[domainId] = {
      domain_id: domainId,
      domain_code: data.domain.code,
      score: data.score,
      max_score: data.maxScore,
      percentage: data.maxScore > 0 ? (data.score / data.maxScore) * 100 : 0
    };
  }

  return {
    totalScore,
    maxScore,
    riskLevel,
    hasRedFlags,
    domainScores
  };
}

export async function saveScreeningResult(
  conditionId: string,
  childAgeMonths: number,
  language: Language,
  responses: Record<string, boolean>,
  totalScore: number,
  riskLevel: RiskLevel,
  hasRedFlags: boolean,
  domainScores: Record<string, DomainScore>,
  childName?: string
): Promise<ScreeningResult> {
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError) {
    throw new Error(`Failed to get user: ${userError.message}`);
  }

  if (!user?.id) {
    throw new Error('User must be authenticated to save screening results');
  }

  const { data, error } = await supabase
    .from('screening_results')
    .insert({
      user_id: user.id,
      condition_id: conditionId,
      child_age_months: childAgeMonths,
      child_name: childName,
      language,
      responses,
      total_score: totalScore,
      risk_level: riskLevel,
      has_red_flags: hasRedFlags,
      domain_scores: domainScores
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getUserScreeningResults(userId: string): Promise<ScreeningResult[]> {
  const { data, error } = await supabase
    .from('screening_results')
    .select(`
      *,
      condition:conditions(*)
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function getScreeningResultById(id: string): Promise<ScreeningResult | null> {
  const { data, error } = await supabase
    .from('screening_results')
    .select(`
      *,
      condition:conditions(*)
    `)
    .eq('id', id)
    .maybeSingle();

  if (error) throw error;
  return data;
}

interface RecommendationWithCategory {
  id: string;
  condition_id: string;
  category_id: string;
  title_en: string;
  title_es: string;
  description_en: string;
  description_es: string;
  risk_levels: RiskLevel[];
  age_min_months: number;
  age_max_months: number;
  priority: number;
  category?: {
    id: string;
    name_en: string;
    name_es: string;
    icon: string;
  };
}

export async function getRecommendationsForCondition(
  conditionId: string,
  riskLevel: RiskLevel,
  childAgeMonths: number
): Promise<Recommendation[]> {
  const { data, error } = await supabase
    .from('recommendations')
    .select(`
      *,
      category:recommendation_categories(*)
    `)
    .eq('condition_id', conditionId)
    .contains('risk_levels', [riskLevel])
    .lte('age_min_months', childAgeMonths)
    .gte('age_max_months', childAgeMonths)
    .order('priority')
    .order('category_id');

  if (error) throw error;

  return (data || []).map((r: RecommendationWithCategory) => ({
    ...r,
    category: r.category
  }));
}

export async function getDailyTipsForCondition(
  conditionId: string
): Promise<DailyTip[]> {
  const { data, error } = await supabase
    .from('daily_tips')
    .select('*')
    .eq('condition_id', conditionId)
    .order('order_index');

  if (error) throw error;
  return data || [];
}
