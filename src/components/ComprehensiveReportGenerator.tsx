import { useState, useEffect } from 'react';
import { FileText, Download, Calendar, CheckCircle, Printer, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useLoadingState } from '../hooks/useLoadingState';
import { logger } from '../lib/logger';
import { SuccessIllustration, LoadingIllustration, EmptyStateIllustration } from './FriendlyIllustrations';
import { exportToJSON, exportToCSV, generateHTMLReport, printReport, downloadHTMLReport, type ExportData, type ReportContent } from '../lib/exportUtils';
import type { ReportTemplate, GeneratedReport, ReportData, BehaviorEntry, MedicationLog, Goal, Appointment } from '../types/components';
import { toJson } from '../lib/json';
import { toGeneratedReport, toReportTemplate } from '../lib/reports';
import { PageHeader } from './PageHeader';

// Matches the behavior type saved by BehaviorDiary; every other type counts as challenging.
const POSITIVE_BEHAVIOR_TYPE = 'Positive Behavior';

const formatList = (value: string[] | string | null | undefined): string =>
  Array.isArray(value) ? value.join(', ') : value || '';

const formatDateTime = (value: string | null | undefined): string => {
  if (!value) return '';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleString();
};

const goalProgress = (goal: Goal): number => {
  const target = Number(goal.target_value) || 0;
  if (goal.status === 'achieved') return 100;
  if (target <= 0) return 0;
  return Math.min(100, Math.max(0, Math.round(((Number(goal.current_value) || 0) / target) * 100)));
};

// Maps a stored report into the shape exportUtils.generateHTMLReport renders.
const toReportContent = (report: GeneratedReport): ReportContent => {
  const data = report.report_data || ({} as ReportData);
  const summary: NonNullable<ReportContent['summary']> = [];
  const content: ReportContent = { summary };

  if (data.behaviors) {
    summary.push({ label: 'Behaviors', value: data.behaviors.summary });
    content.behaviors = (data.behaviors.entries || []).map((entry) => ({
      date: entry.entry_date,
      type: entry.behavior_type || '',
      severity: entry.severity ?? '',
      durationMinutes: entry.duration_minutes ?? '',
      triggers: formatList(entry.triggers),
      notes: entry.notes || ''
    }));
  }

  if (data.medications) {
    summary.push({ label: 'Medication Adherence', value: `${data.medications.adherenceRate}% - ${data.medications.summary}` });
    content.medicationLogs = (data.medications.logs || []).map((log) => ({
      date: formatDateTime(log.taken_at),
      medication: log.medications?.name || '',
      dosage: log.medications?.dosage || '',
      status: log.status || '',
      notes: log.notes || ''
    }));
  }

  if (data.goals) {
    summary.push({ label: 'Goals', value: `${data.goals.completed} of ${data.goals.total} achieved, ${data.goals.active} in progress` });
    content.goals = (data.goals.details || []).map((goal) => ({
      title: goal.title,
      description: goal.description || '',
      status: goal.status,
      progress: goalProgress(goal)
    }));
  }

  if (data.appointments) {
    summary.push({ label: 'Appointments', value: `${data.appointments.attended} of ${data.appointments.total} completed` });
    content.appointments = (data.appointments.details || []).map((appt) => ({
      date: formatDateTime(appt.appointment_date),
      provider: appt.provider_name || '',
      location: appt.location || '',
      completed: Boolean(appt.completed),
      notes: appt.notes || ''
    }));
  }

  if (report.notes) {
    content.notes = report.notes;
  }

  return content;
};

export default function ComprehensiveReportGenerator() {
  const { user } = useAuth();
  const { t } = useLanguage();

  const [templates, setTemplates] = useState<ReportTemplate[]>([]);
  const [generatedReports, setGeneratedReports] = useState<GeneratedReport[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<ReportTemplate | null>(null);
  const { loading, setLoading } = useLoadingState();
  const [generating, setGenerating] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const [dateRangeStart, setDateRangeStart] = useState('');
  const [dateRangeEnd, setDateRangeEnd] = useState('');
  const [reportTitle, setReportTitle] = useState('');
  const [reportNotes, setReportNotes] = useState('');
  const [expandedReport, setExpandedReport] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    if (!user) {
      logger.error('Cannot load data: user is null');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const [templatesRes, reportsRes] = await Promise.all([
        supabase
          .from('report_templates')
          .select('*')
          .eq('is_active', true)
          .order('name'),

        supabase
          .from('generated_reports')
          .select('*')
          .eq('user_id', user.id)
          .order('generated_at', { ascending: false })
      ]);

      if (templatesRes.error) throw templatesRes.error;
      if (reportsRes.error) throw reportsRes.error;

      setTemplates((templatesRes.data || []).map(toReportTemplate));
      setGeneratedReports((reportsRes.data || []).map(toGeneratedReport));
    } catch (error) {
      logger.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateReport = async () => {
    if (!selectedTemplate || !dateRangeStart || !dateRangeEnd || !reportTitle) {
      alert('Please fill in all required fields');
      return;
    }

    if (!user) {
      alert('You must be logged in to generate reports');
      return;
    }

    try {
      setGenerating(true);

      const reportData = await compileReportData(selectedTemplate.template_type, dateRangeStart, dateRangeEnd);

      const { data, error } = await supabase
        .from('generated_reports')
        .insert({
          user_id: user.id,
          template_id: selectedTemplate.id,
          report_type: selectedTemplate.template_type,
          title: reportTitle,
          date_range_start: dateRangeStart,
          date_range_end: dateRangeEnd,
          report_data: toJson(reportData),
          notes: reportNotes
        })
        .select()
        .single();

      if (error) throw error;

      setGeneratedReports([toGeneratedReport(data), ...generatedReports]);

      setReportTitle('');
      setReportNotes('');
      setSelectedTemplate(null);

      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 4000);
    } catch (error) {
      logger.error('Error generating report:', error);
      alert('Failed to generate report. Please try again.');
    } finally {
      setGenerating(false);
    }
  };

  const compileReportData = async (reportType: string, startDate: string, endDate: string): Promise<ReportData> => {
    if (!user) {
      throw new Error('User must be authenticated to compile report data');
    }

    const data: ReportData = {
      generatedDate: new Date().toISOString(),
      dateRange: { start: startDate, end: endDate }
    };

    // taken_at / appointment_date are timestamptz, so include the whole end day.
    // Timestamp columns: use the user's local day boundaries
    const startOfDay = new Date(`${startDate}T00:00:00`).toISOString();
    const endOfDay = new Date(`${endDate}T23:59:59.999`).toISOString();

    const [behaviors, medications, goals, appointments] = await Promise.all([
      supabase
        .from('behavior_entries')
        .select('*')
        .eq('user_id', user.id)
        .gte('entry_date', startDate)
        .lte('entry_date', endDate)
        .order('entry_date', { ascending: true }),

      supabase
        .from('medication_logs')
        .select('*, medications(name, dosage)')
        .eq('user_id', user.id)
        .gte('taken_at', startOfDay)
        .lte('taken_at', endOfDay)
        .order('taken_at', { ascending: true }),

      supabase
        .from('goals')
        .select('*')
        .eq('user_id', user.id),

      supabase
        .from('appointments')
        .select('*')
        .eq('user_id', user.id)
        .gte('appointment_date', startOfDay)
        .lte('appointment_date', endOfDay)
        .order('appointment_date', { ascending: true })
    ]);

    const firstError = behaviors.error || medications.error || goals.error || appointments.error;
    if (firstError) {
      throw firstError;
    }

    const behaviorEntries: BehaviorEntry[] = behaviors.data || [];
    const medicationLogs: MedicationLog[] = medications.data || [];
    const goalRows: Goal[] = goals.data || [];
    const appointmentRows: Appointment[] = appointments.data || [];

    data.behaviors = {
      total: behaviorEntries.length,
      entries: behaviorEntries,
      summary: generateBehaviorSummary(behaviorEntries)
    };

    data.medications = {
      logs: medicationLogs,
      adherenceRate: calculateAdherence(medicationLogs),
      summary: generateMedicationSummary(medicationLogs)
    };

    data.goals = {
      total: goalRows.length,
      active: goalRows.filter(g => g.status === 'in_progress').length,
      completed: goalRows.filter(g => g.status === 'achieved').length,
      details: goalRows
    };

    data.appointments = {
      total: appointmentRows.length,
      attended: appointmentRows.filter(a => a.completed).length,
      details: appointmentRows
    };

    if (reportType === 'crisis') {
      const crisisPlans = await supabase
        .from('crisis_plans')
        .select('*')
        .eq('user_id', user.id);

      if (crisisPlans.error) {
        throw crisisPlans.error;
      }

      data.crisisPlans = crisisPlans.data || [];
    }

    return data;
  };

  const generateBehaviorSummary = (behaviors: Array<{ behavior_type?: string }>) => {
    if (behaviors.length === 0) return 'No behaviors logged during this period.';

    const positive = behaviors.filter(b => b.behavior_type === POSITIVE_BEHAVIOR_TYPE).length;
    const challenging = behaviors.length - positive;

    return `Total: ${behaviors.length} (${positive} positive, ${challenging} challenging)`;
  };

  const generateMedicationSummary = (logs: Array<{ status?: string }>) => {
    if (logs.length === 0) return 'No medication logs during this period.';
    const taken = logs.filter(l => l.status === 'taken').length;
    return `${taken} of ${logs.length} doses taken (${((taken / logs.length) * 100).toFixed(1)}% adherence)`;
  };

  const calculateAdherence = (logs: Array<{ status?: string }>) => {
    if (logs.length === 0) return 0;
    const taken = logs.filter(l => l.status === 'taken').length;
    return Math.round((taken / logs.length) * 100);
  };

  const handleExportJSON = (report: GeneratedReport) => {
    const exportData: ExportData = {
      type: 'comprehensive',
      title: report.title,
      date: report.generated_at ?? '',
      data: {
        ...report.report_data,
        notes: report.notes,
        dateRange: {
          start: report.date_range_start,
          end: report.date_range_end
        }
      }
    };
    exportToJSON(exportData, `${report.title.replace(/\s+/g, '_')}-${new Date().toISOString().split('T')[0]}.json`);
  };

  const handleExportCSV = (report: GeneratedReport) => {
    const data = report.report_data || ({} as ReportData);
    const rows: Array<Record<string, unknown>> = [];

    (data.behaviors?.entries || []).forEach((entry) => {
      rows.push({
        Type: 'Behavior',
        Date: entry.entry_date,
        Item: entry.behavior_type || '',
        Status: '',
        Details: [
          entry.severity != null ? `Severity ${entry.severity}/5` : '',
          entry.duration_minutes != null ? `${entry.duration_minutes} min` : '',
          formatList(entry.triggers) ? `Triggers: ${formatList(entry.triggers)}` : ''
        ].filter(Boolean).join('; '),
        Notes: entry.notes || ''
      });
    });

    (data.medications?.logs || []).forEach((log) => {
      rows.push({
        Type: 'Medication',
        Date: formatDateTime(log.taken_at),
        Item: log.medications?.name || '',
        Status: log.status || '',
        Details: log.medications?.dosage ? `Dosage: ${log.medications.dosage}` : '',
        Notes: log.notes || ''
      });
    });

    (data.goals?.details || []).forEach((goal) => {
      rows.push({
        Type: 'Goal',
        Date: goal.target_date || '',
        Item: goal.title || '',
        Status: goal.status || '',
        Details: [
          goal.category ? `Category: ${goal.category}` : '',
          `Progress: ${goalProgress(goal)}%`,
          goal.target_value != null ? `${goal.current_value ?? 0}/${goal.target_value} ${goal.unit || ''}`.trim() : ''
        ].filter(Boolean).join('; '),
        Notes: goal.description || goal.notes || ''
      });
    });

    (data.appointments?.details || []).forEach((appt) => {
      rows.push({
        Type: 'Appointment',
        Date: formatDateTime(appt.appointment_date),
        Item: appt.provider_name || '',
        Status: appt.completed ? 'Completed' : 'Scheduled',
        Details: appt.location ? `Location: ${appt.location}` : '',
        Notes: appt.notes || ''
      });
    });

    const headers = ['Type', 'Date', 'Item', 'Status', 'Details', 'Notes'];
    exportToCSV(rows, headers, `${report.title.replace(/\s+/g, '_')}-${new Date().toISOString().split('T')[0]}.csv`);
  };

  const buildHTMLExportData = (report: GeneratedReport): ExportData => ({
    type: 'comprehensive',
    title: report.title,
    date: report.generated_at ?? '',
    data: toReportContent(report)
  });

  const handlePrintReport = (report: GeneratedReport) => {
    const htmlContent = generateHTMLReport(buildHTMLExportData(report));
    printReport(htmlContent);
  };

  const handleDownloadHTML = (report: GeneratedReport) => {
    const htmlContent = generateHTMLReport(buildHTMLExportData(report));
    downloadHTMLReport(htmlContent, `${report.title.replace(/\s+/g, '_')}-${new Date().toISOString().split('T')[0]}.html`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div>

      {showSuccess && (
        <div className="fixed top-4 right-4 left-4 sm:left-auto z-[70] animate-in" role="status" aria-live="polite">
          <div className="bg-white rounded-2xl shadow-soft-lg border-2 border-emerald-200 p-4 sm:p-6 sm:max-w-sm">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 flex-shrink-0">
                <SuccessIllustration />
              </div>
              <div>
                <p className="font-bold text-gray-900 text-lg flex items-center gap-2">
                  {t('Report generated successfully!', '¡Informe generado con éxito!')}
                  <Sparkles className="w-5 h-5 text-yellow-500" aria-hidden="true" />
                </p>
                <p className="text-gray-600 mt-1">{t('Your report is ready to view, print, or download.', 'Tu informe está listo para ver, imprimir o descargar.')}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto relative">
        <PageHeader
          icon={FileText}
          tone="slate"
          title={t('Reports', 'Informes')}
          subtitle={t('Printable summaries for doctors, schools, and therapists', 'Resúmenes imprimibles para médicos, escuelas y terapeutas')}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 animate-in-delay-1">
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-soft-lg p-5 sm:p-8 border border-white/60">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center shadow-lg">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Create New Report</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Report Template
                </label>
                <div className="space-y-2">
                  {templates.map((template) => (
                    <button
                      key={template.id}
                      onClick={() => setSelectedTemplate(template)}
                      className={`w-full text-left p-4 sm:p-5 rounded-xl border-2 transition-all duration-200 ${
                        selectedTemplate?.id === template.id
                          ? 'border-blue-600 bg-gradient-to-br from-blue-50 to-blue-100 shadow-lg'
                          : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50/50'
                      }`}
                    >
                      <p className="font-bold text-gray-900 text-lg">{template.name}</p>
                      <p className="text-sm text-gray-600 mt-2 leading-relaxed">{template.description}</p>
                    </button>
                  ))}
                </div>
              </div>

              {selectedTemplate && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Report Title
                    </label>
                    <input
                      type="text"
                      value={reportTitle}
                      onChange={(e) => setReportTitle(e.target.value)}
                      placeholder="e.g., Quarterly Medical Update - Q1 2024"
                      className="input-field"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Start Date
                      </label>
                      <input
                        type="date"
                        value={dateRangeStart}
                        onChange={(e) => setDateRangeStart(e.target.value)}
                        className="input-field"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        End Date
                      </label>
                      <input
                        type="date"
                        value={dateRangeEnd}
                        onChange={(e) => setDateRangeEnd(e.target.value)}
                        className="input-field"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Additional Notes
                    </label>
                    <textarea
                      value={reportNotes}
                      onChange={(e) => setReportNotes(e.target.value)}
                      rows={4}
                      placeholder="Add any additional context, concerns, or questions for the recipient..."
                      className="input-field"
                    />
                  </div>

                  <button
                    onClick={generateReport}
                    disabled={generating}
                    className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
                  >
                    {generating ? (
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        </div>
                        <span>{t('Generating report...', 'Generando informe...')}</span>
                        <Sparkles className="w-4 h-4 animate-pulse" />
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <FileText className="w-5 h-5" />
                        <span>{t('Generate Report', 'Generar Informe')}</span>
                      </div>
                    )}
                  </button>
                  {generating && (
                    <div className="mt-4 p-4 bg-primary-50 border border-primary-200 rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12">
                          <LoadingIllustration />
                        </div>
                        <div>
                          <p className="font-semibold text-primary-900">{t('Preparing your report...', 'Preparando tu informe...')}</p>
                          <p className="text-sm text-primary-700">{t('This only takes a few seconds', 'Esto solo toma unos segundos')}</p>
                        </div>
                      </div>
                    </div>
                  )}
              </>
            )}
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-soft-lg p-5 sm:p-8 border border-white/60">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-xl flex items-center justify-center shadow-lg">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">{t('Generated Reports', 'Informes Generados')}</h2>
            </div>

            {generatedReports.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="w-40 h-40 sm:w-56 sm:h-56 mb-4">
                  <EmptyStateIllustration />
                </div>
                <p className="text-gray-600 text-center text-lg font-medium">
                  {t('No reports yet', 'Aún no hay informes')}
                </p>
                <p className="text-gray-500 text-center mt-2">
                  {t('Create your first report using the form', 'Crea tu primer informe usando el formulario')}
                </p>
                <div className="mt-6 inline-flex items-center gap-2 bg-emerald-50 px-4 py-2 rounded-full">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  <span className="text-sm font-semibold text-emerald-700">{t('Your reports will appear here', 'Tus informes aparecerán aquí')}</span>
                </div>
              </div>
            ) : (
              <div className="space-y-4 max-h-[600px] overflow-y-auto">
                {generatedReports.map((report) => (
                  <div key={report.id} className="border-2 border-gray-200 rounded-2xl overflow-hidden hover:border-emerald-300 hover:shadow-lg transition-all duration-200">
                    <div className="p-5 bg-gradient-to-br from-emerald-50 to-green-50">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1 flex items-start gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
                            <CheckCircle className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <h3 className="font-bold text-gray-900 text-lg">{report.title}</h3>
                            <p className="text-sm text-emerald-700 capitalize font-medium">{report.report_type} Report</p>
                          </div>
                        </div>
                        <button
                          onClick={() => setExpandedReport(expandedReport === report.id ? null : report.id)}
                          className="text-emerald-600 hover:text-emerald-800 hover:bg-white rounded-lg p-2 transition-colors"
                        >
                          {expandedReport === report.id ? (
                            <ChevronUp className="w-5 h-5" />
                          ) : (
                            <ChevronDown className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
                        <Calendar className="w-4 h-4" />
                        <span>
                          {new Date(report.date_range_start).toLocaleDateString()} - {new Date(report.date_range_end).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => handleDownloadHTML(report)}
                          className="bg-teal-700 text-white px-3 py-2 rounded text-sm font-medium hover:bg-teal-800 transition-colors flex items-center justify-center gap-2"
                          title="Download as HTML"
                        >
                          <Download className="w-4 h-4" />
                          HTML
                        </button>
                        <button
                          onClick={() => handlePrintReport(report)}
                          className="bg-gray-600 text-white px-3 py-2 rounded text-sm font-medium hover:bg-gray-700 transition-colors flex items-center justify-center gap-2"
                          title="Print Report"
                        >
                          <Printer className="w-4 h-4" />
                          Print
                        </button>
                        <button
                          onClick={() => handleExportJSON(report)}
                          className="bg-emerald-600 text-white px-3 py-2 rounded text-sm font-medium hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2"
                          title="Export as JSON"
                        >
                          <FileText className="w-4 h-4" />
                          JSON
                        </button>
                        <button
                          onClick={() => handleExportCSV(report)}
                          className="bg-teal-600 text-white px-3 py-2 rounded text-sm font-medium hover:bg-teal-700 transition-colors flex items-center justify-center gap-2"
                          title="Export as CSV"
                        >
                          <FileText className="w-4 h-4" />
                          CSV
                        </button>
                      </div>
                    </div>

                    {expandedReport === report.id && (
                      <div className="p-4 border-t border-gray-200 bg-white">
                        <p className="text-sm text-gray-600 mb-2">
                          <strong>Generated:</strong> {new Date(report.generated_at ?? '').toLocaleString()}
                        </p>
                        {report.notes && (
                          <div className="mt-3">
                            <p className="text-sm font-medium text-gray-700 mb-1">Notes:</p>
                            <p className="text-sm text-gray-600">{report.notes}</p>
                          </div>
                        )}
                        {report.report_data && (
                          <div className="mt-3 space-y-2">
                            {report.report_data.behaviors && (
                              <div className="text-sm">
                                <span className="font-medium text-gray-700">Behaviors:</span>
                                <span className="text-gray-600 ml-2">{report.report_data.behaviors.summary}</span>
                              </div>
                            )}
                            {report.report_data.medications && (
                              <div className="text-sm">
                                <span className="font-medium text-gray-700">Medications:</span>
                                <span className="text-gray-600 ml-2">{report.report_data.medications.summary}</span>
                              </div>
                            )}
                            {report.report_data.goals && (
                              <div className="text-sm">
                                <span className="font-medium text-gray-700">Goals:</span>
                                <span className="text-gray-600 ml-2">
                                  {report.report_data.goals.completed} of {report.report_data.goals.total} completed
                                </span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 border-2 border-blue-100 rounded-2xl p-5 sm:p-8 shadow-soft-lg backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">How to Use Reports</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
            <div>
              <p className="font-semibold mb-1">Medical Reports</p>
              <p>Share with doctors, specialists, and healthcare providers to show progress and concerns</p>
            </div>
            <div>
              <p className="font-semibold mb-1">Educational Reports</p>
              <p>Bring to IEP meetings and parent-teacher conferences to document needs and progress</p>
            </div>
            <div>
              <p className="font-semibold mb-1">Therapy Reports</p>
              <p>Review with OT, PT, speech, or ABA therapists to track goal achievement</p>
            </div>
            <div>
              <p className="font-semibold mb-1">Crisis Reports</p>
              <p>Document incidents and effective strategies for emergency planning</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
