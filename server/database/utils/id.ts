import { uuid } from 'drizzle-orm/pg-core';
import { v7 as uuidV7 } from 'uuid';

export function id() {
  return {
    id: uuid('id')
      .$defaultFn(() => uuidV7())
      .primaryKey(),
  };
}
