import { migrate } from 'drizzle-orm/postgres-js/migrator';
import { db } from './index';
import Logger from '@/utils/logger';

export const migrateDB = async () => {
  console.log('migrating db');
  await migrate(db, { migrationsFolder: 'drizzle' });
  console.log('db migrated');
};
migrateDB();
