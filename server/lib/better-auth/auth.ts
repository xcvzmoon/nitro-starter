import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { v7 as uuidV7 } from 'uuid';
import { db } from '~/server/database';
import * as schema from '~/server/database/schemas/public';

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'pg',
    schema,
  }),
  advanced: {
    database: {
      generateId: () => uuidV7(),
    },
  },
  emailAndPassword: {
    enabled: true,
  },
});
