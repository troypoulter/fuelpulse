import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";
 
export const env = createEnv({
  server: {
    DATABASE_URL: z.string().min(1),
    DATABASE_AUTH_TOKEN: z.string().min(1),
    AUSTRALIA_NSW_FUEL_API_KEY: z.string().min(1),
    AUSTRALIA_NSW_FUEL_SECRET: z.string().min(1),
    QSTASH_CURRENT_SIGNING_KEY: z.string().min(1),
    QSTASH_NEXT_SIGNING_KEY: z.string().min(1),
    NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  },

  clientPrefix: "NEXT_PUBLIC_",
 
  client: {
    NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA: z.string().min(1),
  },
 
  /**
   * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
   * middlewares) or client-side so we need to destruct manually.
   */
  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    DATABASE_AUTH_TOKEN: process.env.DATABASE_AUTH_TOKEN,
    AUSTRALIA_NSW_FUEL_API_KEY: process.env.AUSTRALIA_NSW_FUEL_API_KEY,
    AUSTRALIA_NSW_FUEL_SECRET: process.env.AUSTRALIA_NSW_FUEL_SECRET,
    QSTASH_CURRENT_SIGNING_KEY: process.env.QSTASH_CURRENT_SIGNING_KEY,
    QSTASH_NEXT_SIGNING_KEY: process.env.QSTASH_NEXT_SIGNING_KEY,
    NODE_ENV: process.env.NODE_ENV,
    NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA: process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA,
  },
  /**
   * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially
   * useful for Docker builds.
   */
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  /**
   * Makes it so that empty strings are treated as undefined.
   * `SOME_VAR: z.string()` and `SOME_VAR=''` will throw an error.
   */
  emptyStringAsUndefined: true,
});