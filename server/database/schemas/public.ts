import { pgTable, text, boolean, index } from 'drizzle-orm/pg-core';
import { id } from '~/server/database/utils/id';
import { timestamps } from '~/server/database/utils/timestamps';

export const user = pgTable('user', {
  ...id(),
  ...timestamps(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('email_verified').default(false).notNull(),
  image: text('image'),
});

export const session = pgTable(
  'session',
  {
    ...id(),
    ...timestamps(),
    expiresAt: text('expires_at').notNull(),
    token: text('token').notNull().unique(),
    ipAddress: text('ip_address'),
    userAgent: text('user_agent'),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
  },
  (table) => [index('session_userId_idx').on(table.userId)],
);

export const account = pgTable(
  'account',
  {
    ...id(),
    ...timestamps(),
    accountId: text('account_id').notNull(),
    providerId: text('provider_id').notNull(),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    accessToken: text('access_token'),
    refreshToken: text('refresh_token'),
    idToken: text('id_token'),
    accessTokenExpiresAt: text('access_token_expires_at'),
    refreshTokenExpiresAt: text('refresh_token_expires_at'),
    scope: text('scope'),
    password: text('password'),
  },
  (table) => [index('account_userId_idx').on(table.userId)],
);

export const verification = pgTable(
  'verification',
  {
    ...id(),
    ...timestamps(),
    identifier: text('identifier').notNull(),
    value: text('value').notNull(),
    expiresAt: text('expires_at').notNull(),
  },
  (table) => [index('verification_identifier_idx').on(table.identifier)],
);
