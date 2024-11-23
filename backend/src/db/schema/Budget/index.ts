import { integer, numeric, pgEnum, pgTable, serial, uuid, text, varchar, date, timestamp } from 'drizzle-orm/pg-core';
import { accounts } from '../User';
import { relations } from 'drizzle-orm';

export const groupTypeEnum = pgEnum('type', ['expense', 'income']);
export const stausEnum = pgEnum('status', ['active', 'closed']);
export const frequencyEnum = pgEnum('frequency', ['weekly', 'monthly', 'quaterly', 'yearly']);

export const budget = pgTable('budget', {
  id: serial('id').primaryKey(),
  userId: uuid('userID').references(() => accounts.id),
  year: integer('year'),
  status: stausEnum('status'),
  month: integer('month'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

export const groups = pgTable('groups', {
  id: serial('id').primaryKey(),
  type: groupTypeEnum('type'),
  userID: uuid('userID').references(() => accounts.id),
  budgetID: integer('budget_id').references(() => budget.id),
  label: varchar('label', { length: 50 }).notNull(),
  position: serial('position').unique(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

export const items = pgTable('items', {
  id: serial('id').primaryKey(),
  type: groupTypeEnum('type'),
  groupID: integer('group_id')
    .references(() => groups.id, {
      onDelete: 'cascade',
    })
    .notNull(),
  position: integer('position').unique(),
  label: varchar('label', { length: 50 }).notNull(),
  amountBudget: numeric('amountBudget').notNull(),
  allocatedBudget: numeric('allocated'),

  dueDate: date('date'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});
export type Item = typeof items.$inferInsert;
export type Group = typeof groups.$inferInsert;
export type Budget = typeof budget.$inferInsert;

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

export const itemRelations = relations(items, ({ one }) => ({
  group: one(groups, {
    fields: [items.groupID],
    references: [groups.id],
  }),
}));
