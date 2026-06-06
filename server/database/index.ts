import { drizzle } from 'drizzle-orm/postgres-js';
import { EnhancedQueryLogger } from 'drizzle-query-logger';
import postgres from 'postgres';
import { dbCredentials } from '~/drizzle.config';

export const db = drizzle({
  client: postgres(dbCredentials),
  logger: new EnhancedQueryLogger(),
});
