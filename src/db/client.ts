import { drizzle, type MySql2Database } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import * as schema from './schema';
import { env } from '@/lib/env';

/**
 * Lazily-initialised database handle.
 *
 * When DATABASE_URL is unset (typical local dev before MariaDB is configured),
 * getDb() returns null and the API layer responds in an explicit, documented
 * non-persistent mode — it never silently pretends to persist, and the site
 * never crashes for lack of a database.
 */
export type Database = MySql2Database<typeof schema>;

let pool: mysql.Pool | null = null;
let db: Database | null = null;

export function getDb(): Database | null {
  if (!env.DATABASE_URL) return null;
  if (db) return db;

  pool = mysql.createPool({
    uri: env.DATABASE_URL,
    connectionLimit: 5,
    waitForConnections: true,
    // Fail fast rather than hanging a request if the DB is unreachable.
    connectTimeout: 10_000,
  });
  db = drizzle(pool, { schema, mode: 'default' });
  return db;
}

export { schema };
