import { timestamp, uuid, type AnyPgColumn, type UpdateDeleteAction } from 'drizzle-orm/pg-core';

type Options = {
  userId?: () => AnyPgColumn;
  createdByOnDelete?: UpdateDeleteAction;
  updatedByOnDelete?: UpdateDeleteAction;
  deletedByOnDelete?: UpdateDeleteAction;
};

const TIMESTAMP_CONFIG = {
  mode: 'date',
  precision: 3,
  withTimezone: true,
} as const;

export function timestamps() {
  return {
    createdAt: timestamp('created_at', TIMESTAMP_CONFIG).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', TIMESTAMP_CONFIG)
      .notNull()
      .defaultNow()
      .$onUpdateFn(() => new Date()),
    deletedAt: timestamp('deleted_at', TIMESTAMP_CONFIG),
  };
}

/**
 * Adds timestamp columns for rows that track the user responsible for
 * creation, updates, and soft deletion.
 *
 * Pass `userId` to attach foreign keys to the user table. Without `userId`,
 * the UUID columns are created without references.
 *
 * @example
 * ```ts
 * export const collections = pgTable('collections', {
 *   id: uuid('id').primaryKey(),
 *   ...withUserTimestamps({ userId: () => users.id }),
 * });
 * ```
 *
 * @example
 * ```ts
 * export const importJobs = pgTable('import_jobs', {
 *   id: uuid('id').primaryKey(),
 *   ...withUserTimestamps(),
 * });
 * ```
 *
 * @example
 * ```ts
 * export const dashboards = pgTable('dashboards', {
 *   id: uuid('id').primaryKey(),
 *   ...withUserTimestamps({
 *     userId: () => users.id,
 *     createdByOnDelete: 'cascade',
 *     updatedByOnDelete: 'set null',
 *     deletedByOnDelete: 'set null',
 *   }),
 * });
 * ```
 *
 * @defaultValue
 * `createdBy` uses `onDelete: 'restrict'`. `updatedBy` and `deletedBy` use `onDelete: 'set null'`.
 */
export function withUserTimestamps(options: Options = {}) {
  const createdByOnDelete = options.createdByOnDelete ?? 'restrict';
  const updatedByOnDelete = options.updatedByOnDelete ?? 'set null';
  const deletedByOnDelete = options.deletedByOnDelete ?? 'set null';

  return {
    createdBy: options.userId
      ? uuid('created_by').notNull().references(options.userId, { onDelete: createdByOnDelete })
      : uuid('created_by').notNull(),
    createdAt: timestamp('created_at', TIMESTAMP_CONFIG).notNull().defaultNow(),
    updatedBy: options.userId
      ? uuid('updated_by').references(options.userId, { onDelete: updatedByOnDelete })
      : uuid('updated_by'),
    updatedAt: timestamp('updated_at', TIMESTAMP_CONFIG)
      .notNull()
      .defaultNow()
      .$onUpdateFn(() => new Date()),
    deletedBy: options.userId
      ? uuid('deleted_by').references(options.userId, { onDelete: deletedByOnDelete })
      : uuid('deleted_by'),
    deletedAt: timestamp('deleted_at', TIMESTAMP_CONFIG),
  };
}
