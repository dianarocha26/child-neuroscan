import { supabase } from './supabase';
import { logger } from './logger';
import type { Tables } from '../types/supabase';
import type {
  Condition,
  Question,
  FunctionalDomain,
  ScreeningResult,
  ScreeningResultWithCondition,
  RiskLevel,
  Language,
  DomainScore,
  Recommendation,
  DailyTip
} from '../types/database';

export async function getConditions(): Promise<Condition[]> {

  const { data, error } = await supabase
    .from('conditions')
    .select('*')
    .eq('is_active', true)
    .order('order_index');


  if (error) {
    throw error;
  }

  return data || [];
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

  return (data || []).map(({ question_domains, ...q }) => ({
    ...q,
    domains: question_domains
      .map((qd) => qd.functional_domains)
      .filter((d): d is FunctionalDomain => d !== null)
  }));
}

export async function calculateScreeningScore(
  _conditionId: string,
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
  maxScore: number,
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
      max_score: maxScore,
      risk_level: riskLevel,
      has_red_flags: hasRedFlags,
      domain_scores: domainScores
    })
    .select()
    .single();

  if (error) throw error;
  return toScreeningResult(data);
}

export async function getUserScreeningResults(userId: string): Promise<ScreeningResultWithCondition[]> {
  const { data, error } = await supabase
    .from('screening_results')
    .select(`
      *,
      condition:conditions(*)
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data || [])
    .map(toScreeningResultWithCondition)
    .filter((r): r is ScreeningResultWithCondition => r !== null);
}

export async function getScreeningResultById(id: string): Promise<ScreeningResultWithCondition | null> {
  const { data, error } = await supabase
    .from('screening_results')
    .select(`
      *,
      condition:conditions(*)
    `)
    .eq('id', id)
    .maybeSingle();

  if (error) throw error;
  return data ? toScreeningResultWithCondition(data) : null;
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

  return data || [];
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

// screening_results stores risk_level/language as text and responses/domain_scores
// as JSON. risk_level is limited by a CHECK constraint, and saveScreeningResult is
// the only writer of the JSON columns, so their shapes are trusted here.
function toScreeningResult(row: Tables<'screening_results'>): ScreeningResult {
  return {
    ...row,
    language: row.language === 'es' ? 'es' : 'en',
    risk_level: row.risk_level as RiskLevel,
    // Both columns default to now(); nothing inserts NULL.
    created_at: row.created_at ?? row.completed_at ?? '',
    responses: row.responses as Record<string, boolean>,
    domain_scores: row.domain_scores as unknown as Record<string, DomainScore>
  };
}

function toScreeningResultWithCondition(
  row: Tables<'screening_results'> & { condition: Condition | null }
): ScreeningResultWithCondition | null {
  const { condition, ...rest } = row;
  if (!condition) {
    // Condition hidden (e.g. by RLS) or missing; the result can't be shown without it.
    logger.warn('Screening result has no readable condition:', row.id);
    return null;
  }
  return { ...toScreeningResult(rest), condition };
}
