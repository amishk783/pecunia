import 'dotenv/config';
import type { Config } from 'drizzle-kit';

if (!process.env.DATABASE_URI) {
  throw new Error('DATABASE_URL is missing');
}

export default {
  schema: './src/db/schema/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  schemaFilter: ['public'],
  dbCredentials: {
    database:"postgres",
    url: process.env.DATABASE_URI,
    port: 5432,
    host: process.env.DATABASE_HOST||"",
    user: process.env.DATABASE_USER||"",
    password: process.env.DATABASE_PASSWORD!,
    ssl: false,
  },
  verbose: true,
  strict: true,
} satisfies Config;
