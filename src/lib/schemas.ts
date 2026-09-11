import { z } from 'zod';

/**
 * Shared validation schemas for the form endpoints. Kept framework-agnostic so
 * they can be unit-tested in isolation and, later, reused for client-side hints.
 */

// A honeypot field that must remain empty. Real users never see it; bots fill it.
const honeypot = z
  .string()
  .max(0, 'spam detected')
  .optional()
  .or(z.literal(''))
  .transform(() => '' as const);

export const newsletterSchema = z.object({
  email: z.string().trim().toLowerCase().email('Ungültige E-Mail-Adresse.').max(254),
  // Anti-abuse honeypot — named innocuously.
  website: honeypot,
});
export type NewsletterInput = z.infer<typeof newsletterSchema>;

export const contactSchema = z.object({
  name: z.string().trim().min(2, 'Bitte einen Namen angeben.').max(120),
  email: z.string().trim().toLowerCase().email('Ungültige E-Mail-Adresse.').max(254),
  message: z.string().trim().min(10, 'Die Nachricht ist zu kurz.').max(4000),
  website: honeypot,
});
export type ContactInput = z.infer<typeof contactSchema>;

/** Maximum accepted request body size for form endpoints (bytes). */
export const MAX_BODY_BYTES = 16 * 1024; // 16 KB — generous for text forms.
