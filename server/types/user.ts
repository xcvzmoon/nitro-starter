import type { z } from 'zod';
import { createInsertSchema, createSelectSchema, createUpdateSchema } from 'drizzle-orm/zod';
import { user } from '~/server/database/schemas/public';

export const UserTable = user;

export const selectUserSchema = createSelectSchema(UserTable);
export const insertUserSchema = createInsertSchema(UserTable);
export const updateUserSchema = createUpdateSchema(UserTable);

export type User = z.infer<typeof selectUserSchema>;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type UpdateUser = z.infer<typeof updateUserSchema>;
