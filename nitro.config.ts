import { defineConfig } from 'nitro';

export default defineConfig({
  compatibilityDate: '2026-06-06',
  serverDir: './server',
  features: {
    websocket: true,
  },
  storage: {
    cache: {
      driver: 'redis',
      url: process.env.REDIS_URL,
    },
    s3: {
      driver: 's3',
      accessKeyId: process.env.S3_ACCESS_KEY_ID,
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
      endpoint: process.env.S3_ENDPOINT,
      bucket: process.env.S3_BUCKET,
      region: process.env.S3_REGION,
    },
  },
});
