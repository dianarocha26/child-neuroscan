import React, { useState, useEffect } from 'react';
import { FileText, Download, Calendar, CheckCircle, Printer, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useLoadingState } from '../hooks/useLoadingState';
import { logger } from '../lib/logger';
import { SuccessIllustration, LoadingIllustration, EmptyStateIllustration } from './FriendlyIllustrations';
import { exportToJSON, exportToCSV, generateHTMLReport, printReport, downloadHTMLReport, type ExportData } from '../lib/exportUtils';
import type { ReportTemplate, GeneratedReport, ReportData } from '../types/components';

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

      setTemplates(templatesRes.data || []);
      setGeneratedReports(reportsRes.data || []);
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
          report_data: reportData,
          notes: reportNotes
        })
        .select()
        .single();

      if (error) throw error;

      setGeneratedReports([data, ...generatedReports]);

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

    try {
      const [behaviors, medications, goals, appointments] = await Promise.all([
        supabase
          .from('behavior_diary_entries')
          .select('*')
          .eq('user_id', user.id)
          .gte('entry_date', startDate)
          .lte('entry_date', endDate),

        supabase
          .from('medication_logs')
          .select('*')
          .eq('user_id', user.id)
          .gte('log_date', startDate)
          .lte('log_date', endDate),

        supabase
          .from('goals')
          .select('*')
          .eq('user_id', user.id),

        supabase
          .from('appointments')
          .select('*')
          .eq('user_id', user.id)
          .gte('appointment_date', startDate)
          .lte('appointment_date', endDate)
      ]);

      data.behaviors = {
        total: behaviors.data?.length || 0,
        entries: behaviors.data || [],
        summary: generateBehaviorSummary(behaviors.data || [])
      };

      data.medications = {
        logs: medications.data || [],
        adherenceRate: calculateAdherence(medications.data || []),
        summary: generateMedicationSummary(medications.data || [])
      };

      data.goals = {
        total: goals.data?.length || 0,
        active: goals.data?.filter(g => g.status === 'in_progress').length || 0,
        completed: goals.data?.filter(g => g.status === 'completed').length || 0,
        details: goals.data || []
      };

      data.appointments = {
        total: appointments.data?.length || 0,
        attended: appointments.data?.filter(a => a.status === 'completed').length || 0,
        details: appointments.data || []
      };

      if (reportType === 'crisis') {
        const crisisPlans = await supabase
          .from('crisis_plans')
          .select('*')
          .eq('user_id', user.id);

        data.crisisPlans = crisisPlans.data || [];
      }

    } catch (error) {
      logger.error('Error compiling report data:', error);
    }

    return data;
  };

  const generateBehaviorSummary = (behaviors: Array<{ behavior_type?: string }>) => {
    if (behaviors.length === 0) return 'No behaviors logged during this period.';

    const positive = behaviors.filter(b => b.behavior_type === 'positive').length;
    const challenging = behaviors.filter(b => b.behavior_type === 'challenging').length;

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

  const downloadReport = (report: GeneratedReport) => {
    handleDownloadHTML(report);
  };

  const printReportOld = (report: GeneratedReport) => {
    handlePrintReport(report);
  };

  const formatReportForPrint = (report: GeneratedReport) => {
    let content = `${report.title}\n`;
    content += `Generated: ${new Date(report.generated_at).toLocaleString()}\n`;
    content += `Period: ${new Date(report.date_range_start).toLocaleDateString()} - ${new Date(report.date_range_end).toLocaleDateString()}\n`;
    content += `Type: ${report.report_type.toUpperCase()}\n`;
    content += `\n${'='.repeat(60)}\n\n`;

    const data = report.report_data;

    if (data.behaviors) {
      content += `BEHAVIORAL OBSERVATIONS\n`;
      content += `${'-'.repeat(60)}\n`;
      content += `Summary: ${data.behaviors.summary}\n\n`;
      if (data.behaviors.entries.length > 0) {
        content += `Recent Entries:\n`;
        data.behaviors.entries.slice(0, 5).forEach((entry: any) => {
          content += `  • ${new Date(entry.entry_date).toLocaleDateString()}: ${entry.behavior_description || 'No description'}\n`;
        });
      }
      content += `\n`;
    }

    if (data.medications) {
      content += `MEDICATION TRACKING\n`;
      content += `${'-'.repeat(60)}\n`;
      content += `Summary: ${data.medications.summary}\n`;
      content += `Adherence Rate: ${data.medications.adherenceRate}%\n\n`;
    }

    if (data.goals) {
      content += `GOALS PROGRESS\n`;
      content += `${'-'.repeat(60)}\n`;
      content += `Total Goals: ${data.goals.total}\n`;
      content += `Active: ${data.goals.active}\n`;
      content += `Completed: ${data.goals.completed}\n\n`;
      if (data.goals.details.length > 0) {
        content += `Goal Details:\n`;
        data.goals.details.slice(0, 5).forEach((goal: any) => {
          content += `  • ${goal.title} (${goal.status})\n`;
        });
      }
      content += `\n`;
    }

    if (data.appointments) {
      content += `APPOINTMENTS\n`;
      content += `${'-'.repeat(60)}\n`;
      content += `Total: ${data.appointments.total}\n`;
      content += `Attended: ${data.appointments.attended}\n\n`;
    }

    if (report.notes) {
      content += `ADDITIONAL NOTES\n`;
      content += `${'-'.repeat(60)}\n`;
      content += `${report.notes}\n\n`;
    }

    content += `\n${'='.repeat(60)}\n`;
    content += `End of Report\n`;

    return content;
  };

  const handleExportJSON = (report: GeneratedReport) => {
    const exportData: ExportData = {
      type: 'comprehensive',
      title: report.title,
      date: report.generated_at,
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
    const data = report.report_data;
    const rows: any[] = [];

    if (data.behaviors?.entries) {
      data.behaviors.entries.forEach((entry: any) => {
        rows.push({
          Type: 'Behavior',
          Date: entry.entry_date,
          Description: entry.behavior_description || '',
          Intensity: entry.intensity || '',
          Duration: entry.duration_minutes || '',
          Trigger: entry.triggers || '',
          Notes: entry.notes || ''
        });
      });
    }

    if (data.medications?.logs) {
      data.medications.logs.forEach((log: any) => {
        rows.push({
          Type: 'Medication',
          Date: log.log_date,
          Medication: log.medication_name || '',
          Dosage: log.dosage_amount || '',
          Taken: log.taken ? 'Yes' : 'No',
          Notes: log.notes || ''
        });
      });
    }

    if (data.goals?.details) {
      data.goals.details.forEach((goal: any) => {
        rows.push({
          Type: 'Goal',
          Goal: goal.title || '',
          Status: goal.status || '',
          Progress: goal.progress_percent || 0,
          Category: goal.category || '',
          Description: goal.description || ''
        });
      });
    }

    const headers = ['Type', 'Date', 'Description', 'Notes'];
    exportToCSV(rows, headers, `${report.title.replace(/\s+/g, '_')}-${new Date().toISOString().split('T')[0]}.csv`);
  };

  const handlePrintReport = (report: GeneratedReport) => {
    const exportData: ExportData = {
      type: 'comprehensive',
      title: report.title,
      date: report.generated_at,
      data: {
        ...report.report_data,
        notes: report.notes,
        dateRange: {
          start: report.date_range_start,
          end: report.date_range_end
        }
      }
    };
    const htmlContent = generateHTMLReport(exportData);
    printReport(htmlContent);
  };

  const handleDownloadHTML = (report: GeneratedReport) => {
    const exportData: ExportData = {
      type: 'comprehensive',
      title: report.title,
      date: report.generated_at,
      data: {
        ...report.report_data,
        notes: report.notes,
        dateRange: {
          start: report.date_range_start,
          end: report.date_range_end
        }
      }
    };
    const htmlContent = generateHTMLReport(exportData);
    downloadHTMLReport(htmlContent, `${report.title.replace(/\s+/g, '_')}-${new Date().toISOString().split('T')[0]}.html`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 py-8 px-4">
      <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none"></div>

      {showSuccess && (
        <div className="fixed top-4 right-4 z-50 animate-in">
          <div className="bg-white rounded-2xl shadow-soft-lg border-2 border-emerald-200 p-6 max-w-sm">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 flex-shrink-0">
                <SuccessIllustration />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-lg flex items-center gap-2">
                  {t.reportSuccess}
                  <Sparkles className="w-5 h-5 text-yellow-500" />
                </h3>
                <p className="text-gray-600 mt-1">{t.reportReady}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto relative">
        <div className="mb-10 animate-in">
          <div className="inline-flex items-center justify-center mb-4 w-16 h-16 bg-gradient-to-br from-slate-500 to-slate-700 rounded-2xl shadow-glow-md">
            <FileText className="w-9 h-9 text-white" />
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-gray-900 via-slate-800 to-gray-900 bg-clip-text text-transparent mb-3 leading-tight">
            {t.reports?.title || 'Report Generator'}
          </h1>
          <p className="text-xl text-gray-600 font-medium">
            {t.reports?.subtitle || 'Create comprehensive reports for medical, educational, and therapy purposes'}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in-delay-1">
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-soft-lg p-8 border border-white/60">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center shadow-lg">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Create New Report</h2>
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
                      className={`w-full text-left p-5 rounded-xl border-2 transition-all duration-200 ${
                        selectedTemplate?.id === template.id
                          ? 'border-blue-600 bg-gradient-to-br from-blue-50 to-blue-100 shadow-lg scale-105'
                          : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50/50 hover:scale-102'
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

                  <div className="grid grid-cols-2 gap-4">
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
                        <span>{t.generatingReport}</span>
                        <Sparkles className="w-4 h-4 animate-pulse" />
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <FileText className="w-5 h-5" />
                        <span>{t.generateReport}</span>
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
                          <p className="font-semibold text-primary-900">{t.preparingReport}</p>
                          <p className="text-sm text-primary-700">{t.takesSeconds}</p>
                        </div>
                      </div>
                    </div>
                  )}
              </>
            )}
          </div>

          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-soft-lg p-8 border border-white/60">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-xl flex items-center justify-center shadow-lg">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">{t.generatedReports}</h2>
            </div>

            {generatedReports.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="w-56 h-56 mb-4">
                  <EmptyStateIllustration />
                </div>
                <p className="text-gray-600 text-center text-lg font-medium">
                  {t.noReportsYet}
                </p>
                <p className="text-gray-500 text-center mt-2">
                  {t.createFirstReport}
                </p>
                <div className="mt-6 inline-flex items-center gap-2 bg-emerald-50 px-4 py-2 rounded-full">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  <span className="text-sm font-semibold text-emerald-700">{t.reportsAppearHere}</span>
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
                          className="bg-blue-600 text-white px-3 py-2 rounded text-sm font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
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
                          <strong>Generated:</strong> {new Date(report.generated_at).toLocaleString()}
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

        <div className="mt-8 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 border-2 border-blue-100 rounded-2xl p-8 shadow-soft-lg backdrop-blur-sm">
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
    </div>
  );
}
