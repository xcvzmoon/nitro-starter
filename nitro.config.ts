import { defineConfig } from 'nitro';

export default defineConfig({
  compatibilityDate: '2026-06-06',
  serverDir: './server',
  storage: {
    cache: {
      driver: 'redis',
      url: process.env.REDIS_URL,
    },
  },
});
