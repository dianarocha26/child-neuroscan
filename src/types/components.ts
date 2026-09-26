import type { Tables } from './supabase';

// Row types come from the generated schema (src/types/supabase.ts).
// Only JSON columns and joined relations are narrowed here.

export type ReportTemplate = Omit<Tables<'report_templates'>, 'sections'> & {
  sections: Array<{
    id: string;
    name: string;
    include: boolean;
  }>;
};

export type BehaviorEntry = Tables<'behavior_entries'>;

export type MedicationLog = Tables<'medication_logs'> & {
  medications?: {
    name: string;
    dosage: string;
  } | null;
};

export type Goal = Tables<'goals'>;

export type Appointment = Tables<'appointments'>;

export interface ReportData {
  generatedDate: string;
  dateRange: {
    start: string;
    end: string;
  };
  behaviors?: {
    total: number;
    entries: BehaviorEntry[];
    summary: string;
  };
  medications?: {
    logs: MedicationLog[];
    adherenceRate: number;
    summary: string;
  };
  goals?: {
    total: number;
    active: number;
    completed: number;
    details: Goal[];
  };
  appointments?: {
    total: number;
    attended: number;
    details: Appointment[];
  };
  crisisPlans?: Array<CrisisPlan>;
}

export type GeneratedReport = Omit<Tables<'generated_reports'>, 'report_data'> & {
  report_data: ReportData;
};

export type CrisisPlan = Tables<'crisis_plans'>;
export type CrisisContact = Tables<'crisis_contacts'>;
export type CalmingStrategy = Tables<'calming_strategies'>;
export type BehaviorPattern = Tables<'analytics_behavior_patterns'>;
export type Correlation = Tables<'analytics_correlations'>;
export type WeeklySummary = Tables<'analytics_weekly_summaries'>;
export type TriggerAnalysis = Tables<'analytics_trigger_analysis'>;
export type BehaviorTrigger = Tables<'behavior_triggers'>;
export type BehaviorIntervention = Tables<'behavior_interventions'>;
export type Reminder = Tables<'reminders'>;
export type RewardChart = Tables<'reward_charts'>;
export type RewardEntry = Tables<'reward_entries'>;
export type RewardGoal = Tables<'reward_goals'>;
export type SensoryProfile = Tables<'sensory_profiles'>;
export type VisualSchedule = Tables<'visual_schedules'>;
export type Activity = Tables<'schedule_activities'>;
export type ActivityTemplate = Tables<'activity_templates'>;
