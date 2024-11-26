import { integer, numeric, pgEnum, pgTable, serial, uuid, text, varchar, date, timestamp } from 'drizzle-orm/pg-core';
import { accounts } from '../User';
import { relations } from 'drizzle-orm';

export const groupTypeEnum = pgEnum('type', ['expense', 'income']);
export const stausEnum = pgEnum('status', ['active', 'closed']);
export const frequencyEnum = pgEnum('frequency', ['weekly', 'monthly', 'quaterly', 'yearly']);

export const budget = pgTable('budget', {
  id: serial('id').primaryKey(),
  userId: uuid('userID').references(() => accounts.id),
  year: integer('year').notNull(),
  status: stausEnum('status').notNull(),
  month: integer('month').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

export const groups = pgTable('groups', {
  id: serial('id').primaryKey(),
  type: groupTypeEnum('type'),
  userID: uuid('userID').references(() => accounts.id),
  budgetID: integer('budget_id').references(() => budget.id),
  label: varchar('label', { length: 50 }).notNull(),
  position: integer('position').unique(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

export const items = pgTable('items', {
  id: serial('id').primaryKey(),
  type: groupTypeEnum('type'),
  groupId: integer('group_id')
    .references(() => groups.id, {
      onDelete: 'cascade',
    })
    .notNull(),
  position: integer('position').unique(),
  label: varchar('label', { length: 50 }).notNull(),
  amountBudget: numeric('amountBudget').notNull(),
  allocatedBudget: numeric('allocated').notNull(),

  dueDate: date('date'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});
export const transactions = pgTable('transactions', {
  id: serial('id').primaryKey().notNull(),
  itemId: integer('item_id')
    .references(() => items.id)
    .notNull(),
  label: varchar('label', { length: 50 }).notNull(),
  amount: numeric('amount').notNull(),
  paidVia: varchar('paid_via', { length: 50 }).notNull(),
  notes: varchar('notes', { length: 50 }),
  date: date('date').notNull(),
  category: varchar('category', { length: 50 }).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});
export type Item = typeof items.$inferInsert;
export type Group = typeof groups.$inferInsert;
export type Budget = typeof budget.$inferSelect;
export type Transaction = typeof transactions.$inferInsert;

export const budgetRelations = relations(budget, ({ one, many }) => ({
  groups: many(groups),
}));

export const groupRelations = relations(groups, ({ one, many }) => ({
  budget: one(budget, {
    fields: [groups.budgetID],
    references: [budget.id],
  }),
  items: many(items),
}));

export const itemRelations = relations(items, ({ one, many }) => ({
  group: one(groups, {
    fields: [items.groupId],
    references: [groups.id],
  }),
  transactions: many(transactions),
}));

export const transactionRelations = relations(transactions, ({ one, many }) => ({
  items: one(items, {
    fields: [transactions.itemId],
    references: [items.id],
  }),
}));
