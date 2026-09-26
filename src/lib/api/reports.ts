import { supabase } from '../supabase';
import type { Tables, TablesInsert } from '../../types/supabase';
import type {
  Appointment, BehaviorEntry, CrisisPlan, GeneratedReport, Goal, MedicationLog, ReportData, ReportTemplate
} from '../../types/components';
import { unwrap, unwrapList } from './client';

type Section = ReportTemplate['sections'][number];

const isSection = (value: unknown): value is Section =>
  typeof value === 'object' && value !== null &&
  typeof (value as Section).id === 'string' &&
  typeof (value as Section).name === 'string' &&
  typeof (value as Section).include === 'boolean';

// report_templates are seeded by migrations, so sections are checked.
export function toReportTemplate(row: Tables<'report_templates'>): ReportTemplate {
  return {
    ...row,
    sections: Array.isArray(row.sections) ? row.sections.filter(isSection) : []
  };
}

// ComprehensiveReportGenerator is the only writer of generated_reports.report_data,
// so its shape is trusted (same approach as toScreeningResult in lib/database).
export function toGeneratedReport(row: Tables<'generated_reports'>): GeneratedReport {
  const data = row.report_data;
  const isRecord = typeof data === 'object' && data !== null && !Array.isArray(data);
  return {
    ...row,
    report_data: (isRecord
      ? data
      : { generatedDate: '', dateRange: { start: '', end: '' } }) as unknown as ReportData
  };
}

/** Fields ComprehensiveReportGenerator collects to create a report. */
export type GeneratedReportInput = Pick<
  TablesInsert<'generated_reports'>,
  'template_id' | 'report_type' | 'title' | 'date_range_start' | 'date_range_end' | 'notes'
> & {
  report_data: TablesInsert<'generated_reports'>['report_data'];
};

export async function listReportTemplates(): Promise<ReportTemplate[]> {
  const rows = unwrapList(
    await supabase.from('report_templates').select('*').eq('is_active', true).order('name'),
    'load report templates'
  );
  return rows.map(toReportTemplate);
}

export async function listGeneratedReports(userId: string): Promise<GeneratedReport[]> {
  const rows = unwrapList(
    await supabase
      .from('generated_reports')
      .select('*')
      .eq('user_id', userId)
      .order('generated_at', { ascending: false }),
    'load generated reports'
  );
  return rows.map(toGeneratedReport);
}

export async function createGeneratedReport(userId: string, input: GeneratedReportInput): Promise<GeneratedReport> {
  const row: Tables<'generated_reports'> = unwrap(
    await supabase
      .from('generated_reports')
      .insert({ user_id: userId, ...input })
      .select()
      .single(),
    'generate the report'
  );
  return toGeneratedReport(row);
}

/** Gathers the rows a comprehensive report is built from, for the given date range. */
export async function compileReportSourceData(
  userId: string,
  startDate: string,
  endDate: string,
  reportType: string
): Promise<{
  behaviorEntries: BehaviorEntry[];
  medicationLogs: MedicationLog[];
  goals: Goal[];
  appointments: Appointment[];
  crisisPlans: CrisisPlan[] | null;
}> {
  // taken_at / appointment_date are timestamptz, so include the whole end day.
  // Timestamp columns: use the user's local day boundaries
  const startOfDay = new Date(`${startDate}T00:00:00`).toISOString();
  const endOfDay = new Date(`${endDate}T23:59:59.999`).toISOString();

  const [behaviors, medications, goals, appointments] = await Promise.all([
    supabase
      .from('behavior_entries')
      .select('*')
      .eq('user_id', userId)
      .gte('entry_date', startDate)
      .lte('entry_date', endDate)
      .order('entry_date', { ascending: true }),

    supabase
      .from('medication_logs')
      .select('*, medications(name, dosage)')
      .eq('user_id', userId)
      .gte('taken_at', startOfDay)
      .lte('taken_at', endOfDay)
      .order('taken_at', { ascending: true }),

    supabase
      .from('goals')
      .select('*')
      .eq('user_id', userId),

    supabase
      .from('appointments')
      .select('*')
      .eq('user_id', userId)
      .gte('appointment_date', startOfDay)
      .lte('appointment_date', endOfDay)
      .order('appointment_date', { ascending: true })
  ]);

  const behaviorEntries = unwrapList(behaviors, 'load behaviors for the report');
  const medicationLogs = unwrapList(medications, 'load medication logs for the report');
  const goalRows = unwrapList(goals, 'load goals for the report');
  const appointmentRows = unwrapList(appointments, 'load appointments for the report');

  let crisisPlans: CrisisPlan[] | null = null;
  if (reportType === 'crisis') {
    crisisPlans = unwrapList(
      await supabase.from('crisis_plans').select('*').eq('user_id', userId),
      'load crisis plans for the report'
    );
  }

  return { behaviorEntries, medicationLogs, goals: goalRows, appointments: appointmentRows, crisisPlans };
}
