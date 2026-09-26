import type { Tables } from './supabase';
import type { CrisisPlan } from '../lib/api/crisis';

export type { BehaviorPattern, Correlation, WeeklySummary, TriggerAnalysis } from '../lib/api/analytics';
export type { CrisisPlan } from '../lib/api/crisis';

// Row types come from the generated schema (src/types/supabase.ts).
// Only JSON columns and joined relations are narrowed here.
// Each api module now owns its own row type (Reminder, SensoryProfile,
// VisualSchedule, Activity, ActivityTemplate, BehaviorTrigger,
// BehaviorIntervention, RewardChart, RewardEntry, RewardGoal live in their
// lib/api/*.ts modules, not here). CrisisPlan/BehaviorPattern/etc. above are
// re-exported from their api modules because ReportData / AnalyticsDashboard
// still reference them by these names.

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
