import { describe, expect, it } from 'vitest';
import { validation } from './validation';

describe('validation.email', () => {
  it.each(['parent@example.com', 'a.b+tag@sub.example.co.uk', 'x@y.z'])('accepts %s', (email) => {
    expect(validation.email(email)).toEqual({ valid: true });
  });

  it.each(['', '   '])('requires a value (%j)', (email) => {
    expect(validation.email(email)).toEqual({ valid: false, error: 'Email is required' });
  });

  it.each(['plainaddress', 'no-at.example.com', 'user@', '@example.com', 'user@example', 'us er@example.com', 'user@exa mple.com', 'a@@b.com'])(
    'rejects %j',
    (email) => {
      expect(validation.email(email)).toEqual({ valid: false, error: 'Please enter a valid email address' });
    }
  );
});

describe('validation.password', () => {
  it('accepts a password meeting every rule', () => {
    expect(validation.password('Abcdefg1')).toEqual({ valid: true });
  });

  it('requires at least 8 characters (boundary)', () => {
    expect(validation.password('Abcdef1')).toEqual({ valid: false, error: 'Password must be at least 8 characters' });
    expect(validation.password('')).toEqual({ valid: false, error: 'Password must be at least 8 characters' });
    expect(validation.password('Abcdefg1').valid).toBe(true);
  });

  it('requires an uppercase letter', () => {
    expect(validation.password('abcdefg1')).toEqual({
      valid: false,
      error: 'Password must contain at least one uppercase letter',
    });
  });

  it('requires a lowercase letter', () => {
    expect(validation.password('ABCDEFG1')).toEqual({
      valid: false,
      error: 'Password must contain at least one lowercase letter',
    });
  });

  it('requires a digit', () => {
    expect(validation.password('Abcdefgh')).toEqual({
      valid: false,
      error: 'Password must contain at least one number',
    });
  });

  it('reports the first failing rule in order: length, upper, lower, digit', () => {
    expect(validation.password('abc').error).toMatch(/at least 8/);
    expect(validation.password('abcdefgh').error).toMatch(/uppercase/);
    expect(validation.password('ABCDEFGH').error).toMatch(/lowercase/);
  });
});
