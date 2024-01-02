import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import { env } from '../env.mjs';
import * as schema from './schema';

const client = env.NODE_ENV === 'production' || env.USE_TURSO_LOCALLY === true ? createClient({
    url: env.DATABASE_URL,
    authToken: env.DATABASE_AUTH_TOKEN
}) : createClient({ url: env.DATABASE_URL });

export const db = drizzle(client, { schema });