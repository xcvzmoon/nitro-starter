import { drizzle } from 'drizzle-orm/postgres-js';
import { EnhancedQueryLogger } from 'drizzle-query-logger';
import postgres from 'postgres';
import { dbCredentials } from '~/server/database/config';
import { relations } from '~/server/database/relations';
import * as schema from '~/server/database/schemas/public';

export const db = drizzle({
  client: postgres(dbCredentials),
  logger: new EnhancedQueryLogger(),
  relations,
  schema,
});
