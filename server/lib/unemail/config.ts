import { z } from 'zod';

export const smtpCredentials = z
  .object({
    host: z.string().regex(/^[a-zA-Z0-9.-]+$/, { error: 'Invalid SMTP host' }),
    port: z.coerce.number({ error: 'Invalid SMTP port' }),
    secure: z.stringbool({ error: 'Invalid SMTP secure' }),
    user: z.string({ error: 'Invalid SMTP user' }),
    password: z.string({ error: 'Invalid SMTP password' }),
  })
  .parse({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: process.env.SMTP_SECURE,
    user: process.env.SMTP_USER,
    password: process.env.SMTP_PASSWORD,
  });

export const from = z.email({ error: 'Invalid GMAIL account' }).parse(process.env.GMAIL_EMAIL);
