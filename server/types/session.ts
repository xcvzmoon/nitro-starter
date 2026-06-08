import type { z } from 'zod';
import { createInsertSchema, createSelectSchema, createUpdateSchema } from 'drizzle-orm/zod';
import { session } from '~/server/database/schemas/public';

export const SessionTable = session;

export const selectSessionSchema = createSelectSchema(SessionTable);
export const insertSessionSchema = createInsertSchema(SessionTable);
export const updateSessionSchema = createUpdateSchema(SessionTable);

export type Session = z.infer<typeof selectSessionSchema>;
export type InsertSession = z.infer<typeof insertSessionSchema>;
export type UpdateSession = z.infer<typeof updateSessionSchema>;
