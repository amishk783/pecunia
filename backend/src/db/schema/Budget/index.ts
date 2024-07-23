import { integer, numeric, pgEnum, pgTable, serial, text, varchar, date, timestamp } from 'drizzle-orm/pg-core';
export const groupTypeEnum = pgEnum('type', ['expense', 'income']);
export const budget = pgTable('budget', {
  id: serial('id').primaryKey(),
  date: date('date'),
});

export const groups = pgTable('groups', {
  id: serial('id').primaryKey(),
  type: groupTypeEnum('type'),
  budgetID: integer('budget_id').references(() => budget.id),

  label: varchar('label', { length: 50 }).notNull(),
});

export const items = pgTable('items', {
  id: serial('id').primaryKey(),
  type: groupTypeEnum('type'),
  groupID: integer('group_id').references(() => groups.id),
  label: varchar('label', { length: 50 }).notNull(),
  amountBudget: numeric('groupBudget').notNull(),
  allocatedBudget: numeric('allocated'),
  dueDate: date('date'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});
