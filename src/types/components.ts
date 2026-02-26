export interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  template_type: string;
  sections: Array<{
    id: string;
    name: string;
    include: boolean;
  }>;
  is_active: boolean;
  created_at?: string;
}

export interface BehaviorEntry {
  id: string;
  user_id: string;
  child_name: string;
  entry_date: string;
  entry_time?: string;
  behavior_type?: string;
  behavior_description?: string;
  severity?: number;
  intensity?: string;
  duration_minutes?: number;
  location?: string;
  triggers?: string[] | string;
  antecedents?: string;
  consequences?: string;
  interventions_used?: string[];
  effectiveness?: number;
  notes?: string;
  created_at?: string;
}

export interface MedicationLog {
  id: string;
  user_id: string;
  log_date: string;
  medication_name?: string;
  dosage_amount?: string;
  status?: string;
  taken?: boolean;
  notes?: string;
  created_at?: string;
}

export interface Goal {
  id: string;
  user_id: string;
  title: string;
  status: string;
  progress_percent?: number;
  category?: string;
  description?: string;
  target_date?: string;
  created_at?: string;
}

export interface Appointment {
  id: string;
  user_id: string;
  appointment_date: string;
  appointment_time?: string;
  appointment_type?: string;
  provider_name?: string;
  status?: string;
  notes?: string;
  created_at?: string;
}

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

export interface GeneratedReport {
  id: string;
  user_id: string;
  template_id: string;
  report_type: string;
  title: string;
  date_range_start: string;
  date_range_end: string;
  generated_at: string;
  report_data: ReportData;
  notes: string;
  created_at?: string;
}

export interface CrisisPlan {
  id: string;
  user_id: string;
  child_name: string;
  warning_signs: string[];
  immediate_actions: string[];
  things_to_avoid: string[];
  safe_space_location: string | null;
  medication_instructions: string | null;
  when_to_call_911: string[];
  additional_notes: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface CrisisContact {
  id: string;
  user_id: string;
  contact_name: string;
  relationship: string;
  phone_number: string;
  email: string | null;
  contact_type: string;
  priority_order: number;
  notes: string | null;
  created_at?: string;
}

export interface CalmingStrategy {
  id: string;
  user_id: string;
  child_name: string;
  strategy_name: string;
  strategy_type: string;
  description: string;
  effectiveness_rating: number | null;
  duration_minutes: number | null;
  materials_needed: string[];
  instructions: string[];
  created_at?: string;
}

export interface BehaviorPattern {
  id: string;
  user_id: string;
  pattern_type: string;
  behavior_category: string;
  frequency: number;
  time_range_start: string;
  time_range_end: string;
  insights: Record<string, unknown>;
  created_at?: string;
}

export interface Correlation {
  id: string;
  user_id: string;
  factor_a: string;
  factor_b: string;
  correlation_strength: number;
  occurrences: number;
  date_range_start: string;
  date_range_end: string;
  created_at?: string;
}

export interface WeeklySummary {
  id: string;
  user_id: string;
  week_start_date: string;
  week_end_date: string;
  total_behaviors: number;
  positive_behaviors: number;
  challenging_behaviors: number;
  medication_adherence_rate: number;
  top_triggers: Array<string>;
  mood_average: number;
  insights_summary: string;
  created_at?: string;
}

export interface TriggerAnalysis {
  id: string;
  user_id: string;
  trigger_name: string;
  total_occurrences: number;
  successful_strategies: Array<string>;
  time_patterns: Record<string, unknown>;
  severity_distribution: Record<string, unknown>;
  created_at?: string;
}

export interface BehaviorTrigger {
  id: string;
  user_id: string;
  trigger_name: string;
  trigger_category: string;
  created_at?: string;
}

export interface BehaviorIntervention {
  id: string;
  user_id: string;
  intervention_name: string;
  intervention_type: string;
  created_at?: string;
}

export interface Reminder {
  id: string;
  user_id: string;
  reminder_type: string;
  title: string;
  description: string | null;
  child_name: string | null;
  reminder_date: string;
  reminder_time: string;
  is_active: boolean;
  created_at?: string;
}

export interface RewardChart {
  id: string;
  user_id: string;
  child_name: string;
  chart_name: string;
  chart_type: string;
  target_behavior: string;
  points_per_star: number;
  created_at?: string;
}

export interface RewardEntry {
  id: string;
  chart_id: string;
  entry_date: string;
  stars_earned: number;
  notes: string | null;
  created_at?: string;
}

export interface RewardGoal {
  id: string;
  chart_id: string;
  goal_name: string;
  stars_required: number;
  is_achieved: boolean;
  achieved_date: string | null;
  created_at?: string;
}

export interface SensoryProfile {
  id: string;
  user_id: string;
  child_name: string;
  visual_sensitivity: number;
  auditory_sensitivity: number;
  tactile_sensitivity: number;
  taste_sensitivity: number;
  smell_sensitivity: number;
  vestibular_sensitivity: number;
  proprioceptive_sensitivity: number;
  visual_notes: string | null;
  auditory_notes: string | null;
  tactile_notes: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface VisualSchedule {
  id: string;
  user_id: string;
  child_name: string;
  schedule_name: string;
  schedule_type: string;
  is_active: boolean;
  created_at?: string;
}

export interface Activity {
  id: string;
  schedule_id: string;
  activity_name: string;
  activity_time: string | null;
  duration_minutes: number | null;
  activity_order: number;
  icon: string | null;
  notes: string | null;
  created_at?: string;
}

export interface ActivityTemplate {
  id: string;
  template_name: string;
  category: string;
  icon: string;
  default_duration: number;
  is_public: boolean;
  created_at?: string;
}
