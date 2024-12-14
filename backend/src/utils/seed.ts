import { groups, budget, items, Item, Group, groupTypeEnum } from '@/db/schema/Budget';
import { db } from '@/db/';
import Logger from './logger';
import { PgTransaction} from 'drizzle-orm/pg-core';

const seedGroup: { type: 'expense' | 'income'; label: string }[] = [
  {
    type: groupTypeEnum.enumValues[0],
    label: 'Food',
  },
  {
    type: groupTypeEnum.enumValues[0],
    label: 'Lifestyle',
  },
  {
    type: groupTypeEnum.enumValues[1],
    label: 'Income',
  },
];
interface GroupItem {
  type: 'expense' | 'income';
  label: string;
  amountBudget: string;
  allocatedBudget: string;
}

interface SeedItems {
  [key: string]: GroupItem[];
}

const seedItems: SeedItems = {
  Food: [
    {
      type: groupTypeEnum.enumValues[0],
      label: 'Swiggy',
      amountBudget: '0',
      allocatedBudget: '0',
    },
    {
      type: groupTypeEnum.enumValues[0],
      label: 'Dining Out',
      amountBudget: '0',
      allocatedBudget: '0',
    },
  ],
  Income: [
    {
      type: groupTypeEnum.enumValues[1],
      label: 'Paycheck 1',
      amountBudget: '0',
      allocatedBudget: '0',
    },
    {
      type: groupTypeEnum.enumValues[1],
      label: 'Paycheck 2',
      amountBudget: '0',
      allocatedBudget: '0',
    },
  ],
};

interface SeedDataType {
  [key: string]: string[];
}

export const seed = async (budgetId: number, userID: string, tx: typeof db, data: SeedDataType) => {
  const groupData: Group[] = seedGroup.map(group => ({
    type: group.type,
    label: group.label,
    budgetID: budgetId,
    userID,
  }));

  Logger.silly('Seed start');

  const clientSeed: Group[] = Object.entries(data).map(([key, value]) => ({
    type: 'expense',
    label: key,
    budgetID: budgetId,
    userID,
  }));

  const megeredGroups = [...groupData, ...clientSeed];
  const insertedGroup = await tx.insert(groups).values(megeredGroups).returning();

  const budgetItemsData: Item[] = [];

  insertedGroup.forEach(group => {
    if (seedItems[group.label as keyof typeof seedItems]) {
      const itemsForGroup = seedItems[group.label as keyof typeof seedItems];
      if (itemsForGroup) {
        itemsForGroup.forEach(item => {
          budgetItemsData.push({
            type: item.type,
            label: item.label,
            amountBudget: item.amountBudget,
            allocatedBudget: item.allocatedBudget,
            groupId: group.id,
          });
        });
      }
    } else {
      const itemsForGroup = data[group.label as keyof typeof data];
      if (itemsForGroup) {
        itemsForGroup.forEach(item => {
          budgetItemsData.push({
            type: 'expense',
            label: item,
            amountBudget: '0',
            allocatedBudget: '0',
            groupId: group.id,
          });
        });
      }
    }
  });
  await tx.insert(items).values(budgetItemsData);

  Logger.silly('Seed Completed');
};
