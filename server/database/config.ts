import { z } from 'zod';

export const dbCredentials = z
  .object({
    user: z.string({ error: 'DB_CONFIG_INVALID_USER' }).min(1, {
      error: 'DB_CONFIG_INVALID_USER',
    }),
    password: z.string({ error: 'DB_CONFIG_INVALID_PASSWORD' }),
    host: z.string({ error: 'DB_CONFIG_INVALID_HOST' }).min(1, {
      error: 'DB_CONFIG_INVALID_HOST',
    }),
    port: z.coerce.number({ error: 'DB_CONFIG_INVALID_PORT' }).int().positive(),
    database: z.string({ error: 'DB_CONFIG_INVALID_DATABASE' }).min(1, {
      error: 'DB_CONFIG_INVALID_DATABASE',
    }),
    ssl: z.stringbool({ error: 'DB_CONFIG_INVALID_SSL' }),
  })
  .parse({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_DATABASE,
    ssl: process.env.DB_SSL,
  });
