import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  escapeHtml,
  exportToCSV,
  exportToExcel,
  generateHTMLReport,
  neutralizeSpreadsheetValue,
  type ExportData,
  type ReportContent,
} from './exportUtils';

// exportUtils -> logger -> supabase, which throws at import without env vars.
vi.mock('./supabase', () => ({ supabase: {} }));
vi.mock('./logger', () => ({ logger: { log: vi.fn(), info: vi.fn(), warn: vi.fn(), error: vi.fn() } }));

const XSS_SCRIPT = '<script>alert(1)</script>';
const XSS_ATTR = '"><img src=x onerror=alert(1)>';
const QUOTES_AMP = `Tom & Jerry's "plan"`;

function report(content: ReportContent | string | unknown, title = 'Report'): string {
  const data: ExportData = { type: 'comprehensive', title, date: '2024-06-01T12:00:00Z', data: content };
  return generateHTMLReport(data);
}

/** The report must never contain these raw sequences if input was escaped. */
function expectNoInjection(html: string) {
  expect(html).not.toContain('<script>');
  expect(html).not.toContain('<img');
}

describe('escapeHtml', () => {
  it('escapes the five HTML-significant characters', () => {
    expect(escapeHtml(`<a href="x">Tom & 'Jerry'</a>`)).toBe(
      '&lt;a href=&quot;x&quot;&gt;Tom &amp; &#39;Jerry&#39;&lt;/a&gt;'
    );
  });

  it('escapes & first so existing entities are not double-decoded', () => {
    expect(escapeHtml('&lt;')).toBe('&amp;lt;');
  });

  it('returns "" for null/undefined and stringifies other values', () => {
    expect(escapeHtml(null)).toBe('');
    expect(escapeHtml(undefined)).toBe('');
    expect(escapeHtml(0)).toBe('0');
    expect(escapeHtml(false)).toBe('false');
  });
});

describe('generateHTMLReport escaping', () => {
  it('escapes the title in <title> and <h1>', () => {
    const html = report({}, XSS_SCRIPT);
    expectNoInjection(html);
    expect(html).toContain('<title>&lt;script&gt;alert(1)&lt;/script&gt;</title>');
    expect(html).toContain('<h1>&lt;script&gt;alert(1)&lt;/script&gt;</h1>');
  });

  it('escapes a plain-string payload', () => {
    const html = report(XSS_ATTR);
    expectNoInjection(html);
    expect(html).toContain('&quot;&gt;&lt;img src=x onerror=alert(1)&gt;');
  });

  it('escapes every user-controlled field in a full report', () => {
    const evil = (label: string) => `${label}${XSS_SCRIPT}${XSS_ATTR}${QUOTES_AMP}`;
    const content: ReportContent = {
      childInfo: { name: evil('name'), age: evil('age'), dateOfBirth: evil('dob'), gender: evil('gender') },
      assessment: {
        score: 42,
        riskLevel: evil('risk'),
        domains: [{ name: evil('domain'), score: 3, maxScore: 5 }],
        concerns: [evil('concern')],
      },
      recommendations: [evil('rec')],
      summary: [{ label: evil('sumlabel'), value: evil('sumvalue') }],
      behaviors: [
        { date: evil('bdate'), type: evil('btype'), severity: evil('bsev'), durationMinutes: evil('bdur'), triggers: evil('btrig'), notes: evil('bnotes') },
      ],
      medications: [{ name: evil('mname'), dosage: evil('mdose'), frequency: evil('mfreq'), startDate: evil('mstart') }],
      medicationLogs: [{ date: evil('ldate'), medication: evil('lmed'), dosage: evil('ldose'), status: evil('lstatus'), notes: evil('lnotes') }],
      goals: [{ title: evil('gtitle'), description: evil('gdesc'), status: evil('gstatus'), progress: 50 }],
      appointments: [{ date: evil('adate'), provider: evil('aprov'), location: evil('aloc'), completed: true, notes: evil('anotes') }],
      notes: evil('notes'),
    };
    const html = report(content, evil('title'));

    expectNoInjection(html);
    expect(html).not.toContain(QUOTES_AMP);
    // Every field made it into the output, escaped.
    const labels = [
      'name', 'age', 'dob', 'gender', 'risk', 'domain', 'concern', 'rec', 'sumlabel', 'sumvalue',
      'bdate', 'btype', 'bsev', 'bdur', 'btrig', 'bnotes', 'mname', 'mdose', 'mfreq', 'mstart',
      'ldate', 'lmed', 'ldose', 'lstatus', 'lnotes', 'gtitle', 'gdesc', 'gstatus',
      'adate', 'aprov', 'aloc', 'anotes', 'notes', 'title',
    ];
    const escapedTail = `${escapeHtml(XSS_SCRIPT)}${escapeHtml(XSS_ATTR)}${escapeHtml(QUOTES_AMP)}`;
    for (const label of labels) {
      expect(html, label).toContain(`${label}${escapedTail}`);
    }
  });

  it('clamps and coerces goal progress so it cannot inject into the style attribute', () => {
    const html = report({
      goals: [
        { title: 'a', progress: '100%;background:url(javascript:alert(1))' as unknown as number },
        { title: 'b', progress: 250 },
        { title: 'c', progress: -5 },
        { title: 'd', progress: 33.6 },
      ],
    });
    expect(html).not.toContain('javascript:');
    expect(html).toContain('width: 0%;');
    expect(html).toContain('width: 100%;');
    expect(html).toContain('width: 34%;');
    expect(html).toContain('0% Complete');
    expect(html).toContain('100% Complete');
  });
});

describe('generateHTMLReport with malformed content', () => {
  it.each([
    ['null', null],
    ['empty object', {}],
    ['number', 42],
  ])('does not throw for %s', (_label, content) => {
    expect(() => report(content)).not.toThrow();
  });

  it('skips non-array list fields instead of throwing', () => {
    const malformed = {
      assessment: { domains: 'nope', concerns: { 0: 'x' } },
      summary: 'nope',
      recommendations: { length: 1 },
      behaviors: 5,
      medications: 'aspirin',
      medicationLogs: {},
      goals: null,
      appointments: true,
    };
    let html = '';
    expect(() => {
      html = report(malformed);
    }).not.toThrow();
    expect(html).toContain('Assessment Results');
    for (const heading of ['Summary', 'Recommendations', 'Behavioral Observations', 'Current Medications', 'Medication Log', 'Goals &amp; Progress', 'Goals & Progress', 'Appointments']) {
      expect(html).not.toContain(`<h2>${heading}</h2>`);
    }
  });

  it('shows "No data available" for null and empty content', () => {
    expect(report(null)).toContain('No data available');
    expect(report({})).toContain('No data available');
  });

  it('renders empty-state messages for empty arrays', () => {
    const html = report({ behaviors: [], medicationLogs: [], goals: [], appointments: [], assessment: { concerns: [] } });
    expect(html).toContain('No behaviors logged during this period.');
    expect(html).toContain('No medication logs during this period.');
    expect(html).toContain('No goals recorded.');
    expect(html).toContain('No appointments during this period.');
    expect(html).toContain('No significant concerns identified');
  });
});

describe('neutralizeSpreadsheetValue', () => {
  it.each(['=SUM(A1:A2)', '+1+1', '-2+3', '@cmd', '\tstart', '\rstart', '=HYPERLINK("http://evil","x")'])(
    'prefixes a quote to formula-like %j',
    (value) => {
      expect(neutralizeSpreadsheetValue(value)).toBe(`'${value}`);
    }
  );

  it.each(['plain text', '12', 'a=b', ' =leading space', '', "'already"])('leaves %j untouched', (value) => {
    expect(neutralizeSpreadsheetValue(value)).toBe(value);
  });
});

describe('CSV / Excel export content', () => {
  const captured: string[] = [];
  const clicked: string[] = [];

  function stubDom() {
    captured.length = 0;
    clicked.length = 0;
    class FakeBlob {
      constructor(public parts: string[]) {
        captured.push(parts.join(''));
      }
    }
    vi.stubGlobal('Blob', FakeBlob);
    vi.stubGlobal('URL', { createObjectURL: () => 'blob:x', revokeObjectURL: () => {} });
    const link = { href: '', download: '', click: () => clicked.push(link.download) };
    vi.stubGlobal('document', {
      createElement: () => link,
      body: { appendChild: () => {}, removeChild: () => {} },
    });
  }

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('neutralises formula strings but not numbers, and quotes CSV specials', () => {
    stubDom();
    exportToCSV(
      [
        { name: '=cmd|"/c calc"!A1', notes: 'a, b', count: -5, date: '2024-06-01' },
        { name: '@SUM(1)', notes: 'line1\nline2', count: 0, date: null },
        { name: '+x', notes: 'say "hi"', count: 3.5, date: undefined },
      ],
      ['name', 'notes', 'count', 'date'],
      'out.csv'
    );

    expect(clicked).toEqual(['out.csv']);
    expect(captured[0]).toBe(
      [
        'name,notes,count,date',
        `"'=cmd|""/c calc""!A1","a, b",-5,2024-06-01`,
        `'@SUM(1),"line1\nline2",0,`,
        `'+x,"say ""hi""",3.5,`,
      ].join('\n')
    );
  });

  it('Excel export neutralises formulas and flattens tabs/newlines so columns stay aligned', () => {
    stubDom();
    exportToExcel(
      [
        { a: '-1+1', b: 'x\ty\nz', c: -7 },
        { a: '\t=evil', b: null, c: 1 },
      ],
      ['a', 'b', 'c'],
      'report.csv'
    );

    expect(clicked).toEqual(['report.xls']);
    const lines = captured[0].split('\n');
    // Tabs are flattened to a space before the prefix check, so a leading tab
    // becomes a leading space (inert in spreadsheets) rather than a quote.
    expect(lines).toEqual(['a\tb\tc', "'-1+1\tx y z\t-7", ' =evil\t\t1']);
  });
});
