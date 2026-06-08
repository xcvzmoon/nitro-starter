import type { z } from 'zod';
import { createInsertSchema, createSelectSchema, createUpdateSchema } from 'drizzle-orm/zod';
import { account } from '~/server/database/schemas/public';

export const AccountTable = account;

export const selectAccountSchema = createSelectSchema(AccountTable);
export const insertAccountSchema = createInsertSchema(AccountTable);
export const updateAccountSchema = createUpdateSchema(AccountTable);

export type Account = z.infer<typeof selectAccountSchema>;
export type InsertAccount = z.infer<typeof insertAccountSchema>;
export type UpdateAccount = z.infer<typeof updateAccountSchema>;
