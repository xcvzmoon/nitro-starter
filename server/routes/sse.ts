import { defineHandler } from 'nitro';
import { createEventStream } from 'nitro/h3';

export default defineHandler(async (event) => {
  const stream = createEventStream(event);

  const interval = setInterval(() => {
    void stream.push(`Message @ ${new Date().toLocaleTimeString()}`);
  }, 1000);

  stream.onClosed(() => {
    clearInterval(interval);
  });

  return stream.send();
});
