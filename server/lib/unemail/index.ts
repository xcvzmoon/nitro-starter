import { createEmail } from 'unemail';
import smtp from 'unemail/driver/smtp';
import { withRetry, withCircuitBreaker, withDedupe, withLogger } from 'unemail/middleware';
import { smtpCredentials } from '~/server/lib/unemail/config';

export const email = createEmail({
  driver: withCircuitBreaker(
    withRetry(
      withDedupe(smtp(smtpCredentials), {
        strategy: 'contentHash',
        ttlSeconds: 60,
      }),
      {
        retries: 3,
        backoff: 'full-jitter',
      },
    ),
    {
      threshold: 5,
      cooldownMs: 30_000,
    },
  ),
}).use(withLogger({ redactLocalPart: true }));
