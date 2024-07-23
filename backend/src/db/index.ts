import config from '@/config';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

import * as schema from './schema/schema';
// Assuming the file extension is '.ts'
const client = postgres(config.databaseURL);
export const db = drizzle(client, { schema: schema });
