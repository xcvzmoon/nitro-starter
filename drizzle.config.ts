import { defineConfig } from 'drizzle-kit';
import { dbCredentials } from './server/database/config';

export default defineConfig({
  dialect: 'postgresql',
  schema: './server/database/schemas/*.ts',
  out: './server/database/migrations',
  casing: 'snake_case',
  schemaFilter: [],
  tablesFilter: [],
  dbCredentials,
});
