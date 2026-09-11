import { describe, it, expect } from 'vitest';
import { newsletterSchema, contactSchema } from '@/lib/schemas';

describe('newsletterSchema', () => {
  it('accepts a valid email and normalises case/whitespace', () => {
    const result = newsletterSchema.safeParse({ email: '  Reader@Example.ORG ' });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.email).toBe('reader@example.org');
  });

  it('rejects an invalid email', () => {
    expect(newsletterSchema.safeParse({ email: 'not-an-email' }).success).toBe(false);
  });

  it('rejects a filled honeypot', () => {
    const result = newsletterSchema.safeParse({ email: 'a@b.com', website: 'spam' });
    expect(result.success).toBe(false);
  });

  it('allows an empty honeypot', () => {
    const result = newsletterSchema.safeParse({ email: 'a@b.com', website: '' });
    expect(result.success).toBe(true);
  });
});

describe('contactSchema', () => {
  it('accepts a well-formed message', () => {
    const result = contactSchema.safeParse({
      name: 'Alex Muster',
      email: 'alex@example.org',
      message: 'Dies ist eine ausreichend lange Nachricht.',
    });
    expect(result.success).toBe(true);
  });

  it('rejects a too-short message', () => {
    const result = contactSchema.safeParse({
      name: 'Al',
      email: 'alex@example.org',
      message: 'kurz',
    });
    expect(result.success).toBe(false);
  });

  it('enforces the message length ceiling', () => {
    const result = contactSchema.safeParse({
      name: 'Alex',
      email: 'alex@example.org',
      message: 'x'.repeat(4001),
    });
    expect(result.success).toBe(false);
  });
});
