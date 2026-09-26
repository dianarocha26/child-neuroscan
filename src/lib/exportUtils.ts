import { logger } from './logger';

export interface ExportData {
  type: 'assessment' | 'progress' | 'medication' | 'goals' | 'behavior' | 'comprehensive';
  title: string;
  date: string;
  data: unknown;
}

export interface ReportContent {
  childInfo?: {
    name?: string;
    age?: string | number;
    dateOfBirth?: string;
    gender?: string;
  };
  assessment?: {
    score?: number;
    riskLevel?: string;
    domains?: Array<{ name: string; score: number; maxScore?: number }>;
    concerns?: string[];
  };
  recommendations?: string[];
  summary?: Array<{ label: string; value: string | number }>;
  behaviors?: Array<{
    date: string;
    type: string;
    severity?: number | string;
    durationMinutes?: number | string;
    triggers?: string;
    notes?: string;
  }>;
  medications?: Array<{
    name: string;
    dosage: string;
    frequency?: string;
    startDate?: string;
  }>;
  medicationLogs?: Array<{
    date: string;
    medication: string;
    dosage: string;
    status: string;
    notes?: string;
  }>;
  goals?: Array<{
    title: string;
    description?: string;
    status?: string;
    progress?: number;
  }>;
  appointments?: Array<{
    date: string;
    provider?: string;
    location?: string;
    completed: boolean;
    notes?: string;
  }>;
  notes?: string;
}

export function escapeHtml(value: unknown): string {
  if (value === null || value === undefined) return '';
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// Prevent spreadsheet formula injection (CSV/Excel) for user-controlled strings.
export function neutralizeSpreadsheetValue(value: string): string {
  return /^[=+\-@\t\r]/.test(value) ? `'${value}` : value;
}

export function exportToJSON(data: ExportData, filename?: string): void {
  const jsonStr = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename || `${data.type}-${data.date}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function exportToCSV(data: Array<Record<string, unknown>>, headers: string[], filename: string): void {
  const csvContent = [
    headers.join(','),
    ...data.map(row => headers.map(header => {
      const value = row[header];
      if (value === null || value === undefined) return '';
      const stringValue = typeof value === 'string' ? neutralizeSpreadsheetValue(value) : String(value);
      if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n') || stringValue.includes('\r')) {
        return `"${stringValue.replace(/"/g, '""')}"`;
      }
      return stringValue;
    }).join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function generateHTMLReport(data: ExportData): string {
  const { title, date, data: content } = data;

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(title)}</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #1f2937;
      max-width: 8.5in;
      margin: 0 auto;
      padding: 0.5in;
      background: white;
    }
    .header {
      border-bottom: 3px solid #0891b2;
      padding-bottom: 20px;
      margin-bottom: 30px;
    }
    .header h1 {
      color: #0891b2;
      font-size: 28px;
      margin-bottom: 10px;
    }
    .header .meta {
      color: #6b7280;
      font-size: 14px;
    }
    .section {
      margin-bottom: 30px;
      page-break-inside: avoid;
    }
    .section h2 {
      color: #0891b2;
      font-size: 20px;
      margin-bottom: 15px;
      padding-bottom: 8px;
      border-bottom: 2px solid #e5e7eb;
    }
    .section h3 {
      color: #374151;
      font-size: 16px;
      margin-top: 20px;
      margin-bottom: 10px;
    }
    .info-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 15px;
      margin-bottom: 20px;
    }
    .info-item {
      background: #f9fafb;
      padding: 12px;
      border-radius: 8px;
      border-left: 3px solid #0891b2;
    }
    .info-item .label {
      font-weight: 600;
      color: #374151;
      font-size: 13px;
      margin-bottom: 4px;
    }
    .info-item .value {
      color: #6b7280;
      font-size: 14px;
    }
    .alert {
      background: #fef2f2;
      border-left: 4px solid #ef4444;
      padding: 15px;
      margin: 20px 0;
      border-radius: 4px;
    }
    .alert.warning {
      background: #fffbeb;
      border-left-color: #f59e0b;
    }
    .alert.success {
      background: #f0fdf4;
      border-left-color: #10b981;
    }
    .alert .alert-title {
      font-weight: 600;
      margin-bottom: 5px;
      color: #374151;
    }
    .score-card {
      background: linear-gradient(135deg, #0891b2 0%, #06b6d4 100%);
      color: white;
      padding: 20px;
      border-radius: 12px;
      margin: 20px 0;
      text-align: center;
    }
    .score-card .score {
      font-size: 48px;
      font-weight: bold;
      margin: 10px 0;
    }
    .score-card .label {
      font-size: 14px;
      opacity: 0.9;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 20px 0;
    }
    th, td {
      padding: 12px;
      text-align: left;
      border-bottom: 1px solid #e5e7eb;
    }
    th {
      background: #f9fafb;
      font-weight: 600;
      color: #374151;
    }
    .footer {
      margin-top: 50px;
      padding-top: 20px;
      border-top: 2px solid #e5e7eb;
      text-align: center;
      color: #6b7280;
      font-size: 12px;
    }
    ul {
      margin: 10px 0;
      padding-left: 25px;
    }
    li {
      margin: 8px 0;
    }
    @media print {
      body {
        padding: 0;
      }
      .section {
        page-break-inside: avoid;
      }
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>${escapeHtml(title)}</h1>
    <div class="meta">
      Generated on: ${escapeHtml(new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }))}
    </div>
  </div>

  ${renderContent(content as ReportContent | string)}

  <div class="footer">
    <p><strong>Important Disclaimer:</strong> This report is for informational purposes only and does not constitute medical advice.</p>
    <p>Please consult with qualified healthcare professionals for proper diagnosis and treatment.</p>
    <p>Generated by Child Development Screening App</p>
  </div>
</body>
</html>
  `.trim();
}

function renderContent(content: ReportContent | string): string {
  if (typeof content === 'string') return `<div class="section">${escapeHtml(content)}</div>`;
  if (!content) return '<div class="section"><p>No data available</p></div>';

  let html = '';

  if (content.childInfo) {
    html += `
      <div class="section">
        <h2>Child Information</h2>
        <div class="info-grid">
          ${content.childInfo.name ? `<div class="info-item"><div class="label">Name</div><div class="value">${escapeHtml(content.childInfo.name)}</div></div>` : ''}
          ${content.childInfo.age ? `<div class="info-item"><div class="label">Age</div><div class="value">${escapeHtml(content.childInfo.age)}</div></div>` : ''}
          ${content.childInfo.dateOfBirth ? `<div class="info-item"><div class="label">Date of Birth</div><div class="value">${escapeHtml(content.childInfo.dateOfBirth)}</div></div>` : ''}
          ${content.childInfo.gender ? `<div class="info-item"><div class="label">Gender</div><div class="value">${escapeHtml(content.childInfo.gender)}</div></div>` : ''}
        </div>
      </div>
    `;
  }

  if (content.assessment) {
    html += `
      <div class="section">
        <h2>Assessment Results</h2>
        ${content.assessment.score !== undefined ? `
          <div class="score-card">
            <div class="label">Total Score</div>
            <div class="score">${escapeHtml(content.assessment.score)}</div>
            <div class="label">Risk Level: ${escapeHtml(content.assessment.riskLevel || 'Not specified')}</div>
          </div>
        ` : ''}
        ${Array.isArray(content.assessment.domains) ? renderDomains(content.assessment.domains) : ''}
        ${Array.isArray(content.assessment.concerns) ? renderConcerns(content.assessment.concerns) : ''}
      </div>
    `;
  }

  if (Array.isArray(content.summary) && content.summary.length > 0) {
    html += `
      <div class="section">
        <h2>Summary</h2>
        <div class="info-grid">
          ${content.summary.map(item => `<div class="info-item"><div class="label">${escapeHtml(item.label)}</div><div class="value">${escapeHtml(item.value)}</div></div>`).join('')}
        </div>
      </div>
    `;
  }

  if (Array.isArray(content.recommendations)) {
    html += `
      <div class="section">
        <h2>Recommendations</h2>
        <ul>
          ${content.recommendations.map(rec => `<li>${escapeHtml(rec)}</li>`).join('')}
        </ul>
      </div>
    `;
  }

  if (Array.isArray(content.behaviors)) {
    html += `
      <div class="section">
        <h2>Behavioral Observations</h2>
        ${content.behaviors.length === 0 ? '<p>No behaviors logged during this period.</p>' : `
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Behavior</th>
              <th>Severity</th>
              <th>Duration (min)</th>
              <th>Triggers</th>
              <th>Notes</th>
            </tr>
          </thead>
          <tbody>
            ${content.behaviors.map(entry => `
              <tr>
                <td>${escapeHtml(entry.date)}</td>
                <td>${escapeHtml(entry.type)}</td>
                <td>${escapeHtml(entry.severity)}</td>
                <td>${escapeHtml(entry.durationMinutes)}</td>
                <td>${escapeHtml(entry.triggers)}</td>
                <td>${escapeHtml(entry.notes)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>`}
      </div>
    `;
  }

  if (Array.isArray(content.medications)) {
    html += `
      <div class="section">
        <h2>Current Medications</h2>
        <table>
          <thead>
            <tr>
              <th>Medication</th>
              <th>Dosage</th>
              <th>Frequency</th>
              <th>Start Date</th>
            </tr>
          </thead>
          <tbody>
            ${content.medications.map(med => `
              <tr>
                <td>${escapeHtml(med.name)}</td>
                <td>${escapeHtml(med.dosage)}</td>
                <td>${escapeHtml(med.frequency)}</td>
                <td>${escapeHtml(med.startDate)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  }

  if (Array.isArray(content.medicationLogs)) {
    html += `
      <div class="section">
        <h2>Medication Log</h2>
        ${content.medicationLogs.length === 0 ? '<p>No medication logs during this period.</p>' : `
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Medication</th>
              <th>Dosage</th>
              <th>Status</th>
              <th>Notes</th>
            </tr>
          </thead>
          <tbody>
            ${content.medicationLogs.map(log => `
              <tr>
                <td>${escapeHtml(log.date)}</td>
                <td>${escapeHtml(log.medication)}</td>
                <td>${escapeHtml(log.dosage)}</td>
                <td>${escapeHtml(log.status)}</td>
                <td>${escapeHtml(log.notes)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>`}
      </div>
    `;
  }

  if (Array.isArray(content.goals)) {
    html += `
      <div class="section">
        <h2>Goals & Progress</h2>
        ${content.goals.length === 0 ? '<p>No goals recorded.</p>' : ''}
        ${content.goals.map(goal => {
          const progress = Math.min(100, Math.max(0, Math.round(Number(goal.progress) || 0)));
          return `
          <div class="info-item" style="margin-bottom: 15px;">
            <div class="label">${escapeHtml(goal.title)}${goal.status ? ` (${escapeHtml(goal.status)})` : ''}</div>
            <div class="value">${escapeHtml(goal.description)}</div>
            <div style="margin-top: 8px;">
              <div style="background: #e5e7eb; height: 8px; border-radius: 4px; overflow: hidden;">
                <div style="background: #0891b2; height: 100%; width: ${progress}%;"></div>
              </div>
              <div style="text-align: right; font-size: 12px; margin-top: 4px;">${progress}% Complete</div>
            </div>
          </div>
        `;
        }).join('')}
      </div>
    `;
  }

  if (Array.isArray(content.appointments)) {
    html += `
      <div class="section">
        <h2>Appointments</h2>
        ${content.appointments.length === 0 ? '<p>No appointments during this period.</p>' : `
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Provider</th>
              <th>Location</th>
              <th>Completed</th>
              <th>Notes</th>
            </tr>
          </thead>
          <tbody>
            ${content.appointments.map(appt => `
              <tr>
                <td>${escapeHtml(appt.date)}</td>
                <td>${escapeHtml(appt.provider)}</td>
                <td>${escapeHtml(appt.location)}</td>
                <td>${appt.completed ? 'Yes' : 'No'}</td>
                <td>${escapeHtml(appt.notes)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>`}
      </div>
    `;
  }

  if (content.notes) {
    html += `
      <div class="section">
        <h2>Additional Notes</h2>
        <p>${escapeHtml(content.notes)}</p>
      </div>
    `;
  }

  return html || '<div class="section"><p>No data available</p></div>';
}

function renderDomains(domains: Array<{ name: string; score: number; maxScore?: number }>): string {
  return `
    <div class="info-grid">
      ${domains.map(domain => `
        <div class="info-item">
          <div class="label">${escapeHtml(domain.name)}</div>
          <div class="value">Score: ${escapeHtml(domain.score)}${domain.maxScore ? `/${escapeHtml(domain.maxScore)}` : ''}</div>
        </div>
      `).join('')}
    </div>
  `;
}

function renderConcerns(concerns: string[]): string {
  if (!concerns || concerns.length === 0) {
    return '<div class="alert success"><div class="alert-title">No significant concerns identified</div></div>';
  }
  return `
    <div class="alert warning">
      <div class="alert-title">Areas of Concern</div>
      <ul style="margin-top: 10px;">
        ${concerns.map(concern => `<li>${escapeHtml(concern)}</li>`).join('')}
      </ul>
    </div>
  `;
}

function openPrintWindow(htmlContent: string): void {
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    logger.warn('Unable to open print window (popup blocked?)');
    return;
  }
  // Sever the link back to this window so the new document cannot navigate or script the app.
  printWindow.opener = null;
  printWindow.document.open();
  printWindow.document.write(htmlContent);
  printWindow.document.close();
  printWindow.focus();
  setTimeout(() => {
    printWindow.print();
  }, 250);
}

export function printReport(htmlContent: string): void {
  openPrintWindow(htmlContent);
}

export function downloadHTMLReport(htmlContent: string, filename: string): void {
  const blob = new Blob([htmlContent], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function exportToExcel(data: Array<Record<string, unknown>>, headers: string[], filename: string): void {
  const csvContent = [
    headers.join('\t'),
    ...data.map(row => headers.map(header => {
      const value = row[header];
      if (value === null || value === undefined) return '';
      const stringValue = String(value).replace(/[\t\r\n]+/g, ' ');
      return typeof value === 'string' ? neutralizeSpreadsheetValue(stringValue) : stringValue;
    }).join('\t'))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'application/vnd.ms-excel' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename.replace('.csv', '.xls');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
