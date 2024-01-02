import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";
 
export const env = createEnv({
  server: {
    DATABASE_URL: z.string().min(1),
    DATABASE_AUTH_TOKEN: z.string().min(1),
    FUEL_API_KEY: z.string().min(1),
    FUEL_SECRET: z.string().min(1),
    QSTASH_CURRENT_SIGNING_KEY: z.string().min(1),
    QSTASH_NEXT_SIGNING_KEY: z.string().min(1),
    USE_TURSO_LOCALLY: z
    .string()
    // only allow "true" or "false"
    .refine((s) => s === "true" || s === "false")
    // transform to boolean
    .transform((s) => s === "true"),
    NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  },
 
  // client: {
  //   // NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string().min(1),
  // },
 
  /**
   * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
   * middlewares) or client-side so we need to destruct manually.
   */
  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    DATABASE_AUTH_TOKEN: process.env.DATABASE_AUTH_TOKEN,
    FUEL_API_KEY: process.env.FUEL_API_KEY,
    FUEL_SECRET: process.env.FUEL_SECRET,
    QSTASH_CURRENT_SIGNING_KEY: process.env.QSTASH_CURRENT_SIGNING_KEY,
    QSTASH_NEXT_SIGNING_KEY: process.env.QSTASH_NEXT_SIGNING_KEY,
    USE_TURSO_LOCALLY: process.env.USE_TURSO_LOCALLY,
    NODE_ENV: process.env.NODE_ENV,
    // NEXT_PUBLIC_CLIENTVAR: process.env.NEXT_PUBLIC_CLIENTVAR,
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