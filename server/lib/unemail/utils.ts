import type { EmailResult, Result } from 'unemail';
import type { SendEmailOptions } from '~/server/lib/unemail/type';
import { email } from '~/server/lib/unemail';
import { from } from '~/server/lib/unemail/config';

export async function sendEmail(options: SendEmailOptions) {
  const { from: sender = from, ...rest } = options;
  return email.send({ ...rest, from: sender });
}

export async function sendBatchEmail(messages: SendEmailOptions[]) {
  const emailResults: Result<EmailResult>[] = [];
  const batchEmailResults = email.sendBatchStream(
    messages.map((message) => {
      const { from: sender = from, ...rest } = message;
      return { ...rest, from: sender };
    }),
  );

  for await (const emailResult of batchEmailResults) {
    emailResults.push(emailResult);
  }

  return emailResults;
}
