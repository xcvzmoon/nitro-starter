import { defineHandler, HTTPError } from 'nitro';
import { auth } from '~/server/lib/better-auth/auth';

export default defineHandler(async (event) => {
  if (event.url.pathname.startsWith('/api/auth/')) {
    return;
  }

  const session = await auth.api.getSession({ headers: event.req.headers });

  if (!session?.user) {
    throw new HTTPError({
      status: 401,
      statusText: 'Unauthorized',
      message: 'You must be signed in to access this resource',
    });
  }

  event.context.auth = session;
});
