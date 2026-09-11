import { defineConfig } from 'drizzle-kit';

// Drizzle Kit reads DATABASE_URL from the environment. Migrations are only
// generated/applied when a real connection string is present.
const url = process.env.DATABASE_URL;

export default defineConfig({
  dialect: 'mysql',
  schema: './src/db/schema.ts',
  out: './drizzle',
  ...(url ? { dbCredentials: { url } } : {}),
  strict: true,
  verbose: true,
});
