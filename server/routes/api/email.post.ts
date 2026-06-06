import { defineHandler, HTTPError } from 'nitro';
import { z } from 'zod';
import { sendEmail } from '~/server/lib/unemail/utils';

const formDataPreprocessor = z.preprocess(
  (formData: FormData) => {
    return {
      to: formData.get('to'),
      subject: formData.get('subject'),
      text: formData.get('text'),
      html: formData.get('html'),
    };
  },
  z.object({
    to: z.string(),
    subject: z.string(),
    text: z.string(),
    html: z.string(),
  }),
);

export default defineHandler(async (event) => {
  const formData = await event.req.formData();
  const sendEmailOptions = formDataPreprocessor.parse(formData);

  const { data, error } = await sendEmail(sendEmailOptions);

  if (error) {
    throw new HTTPError({
      status: error.retryable ? 502 : 400,
      statusText: error.retryable ? 'Bad Gateway' : 'Bad Request',
      message: 'Email send failed',
      data: { code: error.code },
    });
  }

  return data;
});
