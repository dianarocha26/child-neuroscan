import type { Tables } from '../types/supabase';
import type { GeneratedReport, ReportData, ReportTemplate } from '../types/components';

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
