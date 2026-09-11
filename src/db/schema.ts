import { mysqlTable, varchar, text, timestamp, index } from 'drizzle-orm/mysql-core';

/**
 * Aperçu database schema (MariaDB / MySQL via Drizzle).
 *
 * IDs are application-generated UUIDs (crypto.randomUUID) stored as char(36):
 * portable across MariaDB/MySQL versions and independent of DB-side UUID support.
 * Only data strictly needed for the feature is stored.
 *
 * NOTE (Phase 2): community accounts, sessions and story discussion tables will
 * be added alongside auth — see docs/PHASE-2-COMMUNITY.md. The route + client
 * structure here is intentionally shaped to accommodate them without a rewrite.
 */

export const newsletterSubscriptions = mysqlTable(
  'newsletter_subscriptions',
  {
    id: varchar('id', { length: 36 }).primaryKey(),
    email: varchar('email', { length: 254 }).notNull().unique(),
    // Locale the visitor subscribed from — supports future bilingual sends.
    locale: varchar('locale', { length: 8 }).notNull().default('de'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
  },
  (t) => [index('idx_newsletter_created_at').on(t.createdAt)],
);

export const contactSubmissions = mysqlTable(
  'contact_submissions',
  {
    id: varchar('id', { length: 36 }).primaryKey(),
    name: varchar('name', { length: 120 }).notNull(),
    email: varchar('email', { length: 254 }).notNull(),
    message: text('message').notNull(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
  },
  (t) => [
    index('idx_contact_created_at').on(t.createdAt),
    index('idx_contact_email').on(t.email),
  ],
);

export type NewsletterSubscription = typeof newsletterSubscriptions.$inferSelect;
export type ContactSubmission = typeof contactSubmissions.$inferSelect;
