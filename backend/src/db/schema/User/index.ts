import { pgTable, serial, text, varchar, pgSchema, uuid, timestamp } from 'drizzle-orm/pg-core';

const authSchema = pgSchema('auth');

const users = authSchema.table('users', {
  id: uuid('id').primaryKey(),
});

export const accounts = pgTable('accounts', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 256 }).notNull(),
  user_name: text('user_name'),

  user_id: uuid('user_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('update_at', {
    withTimezone: true,
  }).defaultNow(),
});
