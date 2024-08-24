import { pgTable, serial, text, varchar, pgSchema, uuid, timestamp } from 'drizzle-orm/pg-core';

const authSchema = pgSchema('auth');

const user = authSchema.table('users', {
  id: uuid('id').primaryKey(),
});

export const accounts = pgTable('accounts', {
  id: uuid('id')
    .primaryKey()
    .references(() => user.id, { onDelete: 'cascade' })
    .notNull(),

  email: varchar('email', { length: 256 }).notNull(),
  user_name: text('user_name'),

  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('update_at', {
    withTimezone: true,
  }).defaultNow(),
});
type Account = typeof accounts.$inferInsert;
