import { Config } from "drizzle-kit";
import { env } from "./lib/env.mjs";

export default {
    schema: "./lib/db/schema.ts",
    out: "./lib/db/migrations",
    driver: "turso",
    dbCredentials: {
        url: env.DATABASE_URL,
        // authToken: env.DATABASE_AUTH_TOKEN
    },
    verbose: true
} satisfies Config;