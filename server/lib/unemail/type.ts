import type { EmailMessage } from 'unemail';

export type SendEmailOptions = Omit<EmailMessage, 'from'> & { from?: string };
