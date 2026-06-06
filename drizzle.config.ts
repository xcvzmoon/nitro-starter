import { defineConfig } from 'drizzle-kit';
import { z } from 'zod';

export const dbCredentials = z
  .object({
    user: z.string({ error: 'Invalid db user' }),
    password: z.string({ error: 'Invalid db password' }),
    host: z.string({ error: 'Invalid db host' }),
    port: z.coerce.number({ error: 'Invalid db port' }),
    database: z.string({ error: 'Invalid db database' }),
    ssl: z.stringbool({ error: 'Invalid db ssl' }),
  })
  .parse({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_DATABASE,
    ssl: process.env.DB_SSL,
  });

export default defineConfig({
  dialect: 'postgresql',
  schema: './server/database/schema.ts',
  out: './server/database/migrations',
  casing: 'snake_case',
  schemaFilter: [],
  tablesFilter: [],
  dbCredentials,
});
