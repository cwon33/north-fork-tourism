import { createEnv } from '@t3-oss/env-core';
import { z } from 'zod';

const env = createEnv({
  clientPrefix: 'EXPO_PUBLIC_',

  client: {
    // API URL for the backend service
    // This is used for generating the API client with the "gen-api" command
    EXPO_PUBLIC_API_URL: z.string().url('API_URL must be a valid URL').optional(),

    EXPO_PUBLIC_FIREBASE_API_KEY: z.string().min(1),
    EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN: z.string().min(1),
    EXPO_PUBLIC_FIREBASE_PROJECT_ID: z.string().min(1),
    EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET: z.string().min(1),
    EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: z.string().min(1),
    EXPO_PUBLIC_FIREBASE_APP_ID: z.string().min(1),
    EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID: z.string().optional(),

    EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN: z.string().optional(),
  },

  /**
   * What object holds the environment variables at runtime. Map these manually like below.
   */
  runtimeEnv: {
    EXPO_PUBLIC_API_URL: process.env.EXPO_PUBLIC_API_URL,

    EXPO_PUBLIC_FIREBASE_API_KEY:
      process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
    EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN:
      process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
    EXPO_PUBLIC_FIREBASE_PROJECT_ID:
      process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
    EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET:
      process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
    EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID:
      process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    EXPO_PUBLIC_FIREBASE_APP_ID:
      process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
    EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID:
      process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID,

    EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN:
      process.env.EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN,
  },
});

export default env;
