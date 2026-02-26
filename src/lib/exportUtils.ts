import { logger } from './logger';

export interface ExportData {
  type: 'assessment' | 'progress' | 'medication' | 'goals' | 'behavior' | 'comprehensive';
  title: string;
  date: string;
  data: any;
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

export function exportToCSV(data: any[], headers: string[], filename: string): void {
  const csvContent = [
    headers.join(','),
    ...data.map(row => headers.map(header => {
      const value = row[header];
      if (value === null || value === undefined) return '';
      const stringValue = String(value);
      if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
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
  <title>${title}</title>
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
    <h1>${title}</h1>
    <div class="meta">
      Generated on: ${new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })}
    </div>
  </div>

  ${renderContent(content)}

  <div class="footer">
    <p><strong>Important Disclaimer:</strong> This report is for informational purposes only and does not constitute medical advice.</p>
    <p>Please consult with qualified healthcare professionals for proper diagnosis and treatment.</p>
    <p>Generated by Child Development Screening App</p>
  </div>
</body>
</html>
  `.trim();
}

function renderContent(content: any): string {
  if (typeof content === 'string') return `<div class="section">${content}</div>`;

  let html = '';

  if (content.childInfo) {
    html += `
      <div class="section">
        <h2>Child Information</h2>
        <div class="info-grid">
          ${content.childInfo.name ? `<div class="info-item"><div class="label">Name</div><div class="value">${content.childInfo.name}</div></div>` : ''}
          ${content.childInfo.age ? `<div class="info-item"><div class="label">Age</div><div class="value">${content.childInfo.age}</div></div>` : ''}
          ${content.childInfo.dateOfBirth ? `<div class="info-item"><div class="label">Date of Birth</div><div class="value">${content.childInfo.dateOfBirth}</div></div>` : ''}
          ${content.childInfo.gender ? `<div class="info-item"><div class="label">Gender</div><div class="value">${content.childInfo.gender}</div></div>` : ''}
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
            <div class="score">${content.assessment.score}</div>
            <div class="label">Risk Level: ${content.assessment.riskLevel || 'Not specified'}</div>
          </div>
        ` : ''}
        ${content.assessment.domains ? renderDomains(content.assessment.domains) : ''}
        ${content.assessment.concerns ? renderConcerns(content.assessment.concerns) : ''}
      </div>
    `;
  }

  if (content.recommendations) {
    html += `
      <div class="section">
        <h2>Recommendations</h2>
        <ul>
          ${content.recommendations.map((rec: string) => `<li>${rec}</li>`).join('')}
        </ul>
      </div>
    `;
  }

  if (content.medications) {
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
            ${content.medications.map((med: any) => `
              <tr>
                <td>${med.name}</td>
                <td>${med.dosage}</td>
                <td>${med.frequency}</td>
                <td>${med.startDate}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  }

  if (content.goals) {
    html += `
      <div class="section">
        <h2>Goals & Progress</h2>
        ${content.goals.map((goal: any) => `
          <div class="info-item" style="margin-bottom: 15px;">
            <div class="label">${goal.title}</div>
            <div class="value">${goal.description || ''}</div>
            <div style="margin-top: 8px;">
              <div style="background: #e5e7eb; height: 8px; border-radius: 4px; overflow: hidden;">
                <div style="background: #0891b2; height: 100%; width: ${goal.progress || 0}%;"></div>
              </div>
              <div style="text-align: right; font-size: 12px; margin-top: 4px;">${goal.progress || 0}% Complete</div>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  if (content.notes) {
    html += `
      <div class="section">
        <h2>Additional Notes</h2>
        <p>${content.notes}</p>
      </div>
    `;
  }

  return html || '<div class="section"><p>No data available</p></div>';
}

function renderDomains(domains: any[]): string {
  return `
    <div class="info-grid">
      ${domains.map(domain => `
        <div class="info-item">
          <div class="label">${domain.name}</div>
          <div class="value">Score: ${domain.score}${domain.maxScore ? `/${domain.maxScore}` : ''}</div>
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
        ${concerns.map(concern => `<li>${concern}</li>`).join('')}
      </ul>
    </div>
  `;
}

export function printReport(htmlContent: string): void {
  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 250);
  }
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

export function exportToExcel(data: any[], headers: string[], filename: string): void {
  const csvContent = [
    headers.join('\t'),
    ...data.map(row => headers.map(header => {
      const value = row[header];
      if (value === null || value === undefined) return '';
      return String(value);
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

export function exportToPDF(htmlContent: string): void {
  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 250);
  }
}

export function shareReport(data: ExportData): void {
  if (navigator.share) {
    const text = `${data.title}\n\nGenerated on: ${new Date(data.date).toLocaleDateString()}\n\nData: ${JSON.stringify(data.data, null, 2)}`;
    navigator.share({
      title: data.title,
      text: text,
    }).catch((error) => logger.error('Error sharing', error));
  } else {
    logger.warn('Web Share API not supported');
  }
}

export function copyToClipboard(data: ExportData): Promise<void> {
  const text = `${data.title}\n\nGenerated on: ${new Date(data.date).toLocaleDateString()}\n\n${JSON.stringify(data.data, null, 2)}`;
  return navigator.clipboard.writeText(text);
}

export function exportMultipleFormats(data: ExportData, formats: Array<'json' | 'csv' | 'html' | 'excel'>): void {
  formats.forEach(format => {
    switch (format) {
      case 'json':
        exportToJSON(data);
        break;
      case 'html':
        const htmlContent = generateHTMLReport(data);
        downloadHTMLReport(htmlContent, `${data.type}-${data.date}.html`);
        break;
      default:
        logger.warn(`Format ${format} not fully implemented yet`);
    }
  });
}
