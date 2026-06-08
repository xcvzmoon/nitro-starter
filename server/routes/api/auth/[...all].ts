import { defineHandler } from 'nitro';
import { auth } from '~/server/lib/better-auth/auth';

export default defineHandler(async (event) => {
  return auth.handler(event.req);
});
