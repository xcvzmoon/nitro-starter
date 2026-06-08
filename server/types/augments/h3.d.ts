import type { Session, User } from 'better-auth';

declare module 'h3' {
  interface H3EventContext {
    auth?: {
      session: Session;
      user: User;
    };
  }
}
