import type { z } from 'zod';
import { createInsertSchema, createSelectSchema, createUpdateSchema } from 'drizzle-orm/zod';
import { verification } from '~/server/database/schemas/public';

export const VerificationTable = verification;

export const selectVerificationSchema = createSelectSchema(VerificationTable);
export const insertVerificationSchema = createInsertSchema(VerificationTable);
export const updateVerificationSchema = createUpdateSchema(VerificationTable);

export type Verification = z.infer<typeof selectVerificationSchema>;
export type InsertVerification = z.infer<typeof insertVerificationSchema>;
export type UpdateVerification = z.infer<typeof updateVerificationSchema>;
