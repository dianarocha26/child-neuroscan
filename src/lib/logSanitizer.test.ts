import { describe, it, expect } from 'vitest';
import { sanitizeLogEntry, shouldPersist } from './logSanitizer';

describe('sanitizeLogEntry', () => {
  it('keeps only the first string argument as the message', () => {
    const entry = sanitizeLogEntry('error', ['Failed to save child', { name: 'Emma', notes: 'private' }]);
    expect(entry.message).toBe('Failed to save child');
    expect(JSON.stringify(entry)).not.toContain('Emma');
    expect(JSON.stringify(entry)).not.toContain('private');
  });

  it('keeps error name and code but not the error message', () => {
    const pgError = { code: '23505', message: 'Key (email)=(parent@example.com) already exists', details: 'x' };
    const entry = sanitizeLogEntry('error', ['Failed', pgError]);
    expect(entry.data).toEqual({ code: '23505' });
    expect(JSON.stringify(entry)).not.toContain('parent@example.com');

    const err = new TypeError('Cannot read Emma');
    expect(sanitizeLogEntry('error', ['Oops', err]).data).toEqual({ name: 'TypeError' });
  });

  it('drops codes that are not short identifiers', () => {
    expect(sanitizeLogEntry('warn', ['Failed', { code: 'user parent@example.com' }]).data).toBeNull();
    expect(sanitizeLogEntry('warn', ['Failed', { code: 'autism' }]).data).toBeNull();
    expect(sanitizeLogEntry('warn', ['Failed', { code: 'PGRST116' }]).data).toEqual({ code: 'PGRST116' });
  });

  it('does not use a non-string first argument as the message', () => {
    const entry = sanitizeLogEntry('error', [{ email: 'parent@example.com' }]);
    expect(entry.message).toBe('(no message)');
    expect(JSON.stringify(entry)).not.toContain('parent@example.com');
  });

  it('truncates long messages', () => {
    expect(sanitizeLogEntry('error', ['a'.repeat(500)]).message).toHaveLength(200);
  });
});

describe('shouldPersist', () => {
  it('stores only errors and warnings', () => {
    expect(shouldPersist('error')).toBe(true);
    expect(shouldPersist('warn')).toBe(true);
    expect(shouldPersist('info')).toBe(false);
    expect(shouldPersist('log')).toBe(false);
  });
});
