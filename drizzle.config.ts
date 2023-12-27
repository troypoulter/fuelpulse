import { Config } from "drizzle-kit";
import { env } from "./lib/env.mjs";

export default {
    schema: "./lib/db/schema.ts",
    out: "./lib/db/migrations",
    driver: "turso",
    dbCredentials: env.NODE_ENV === "production" ? {
        url: env.DATABASE_URL,
        authToken: env.DATABASE_AUTH_TOKEN
    } : {
        url: env.DATABASE_URL
    },
    verbose: true,
    strict: true
} satisfies Config;