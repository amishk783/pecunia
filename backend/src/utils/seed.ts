import { groups, budget, items, Item, Group, groupTypeEnum } from '@/db/schema/Budget';
import { db } from '@/db/';
import Logger from './logger';

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

export const seed = async (budgetId: number, userID: string): Promise<{ groups: Group[] }> => {
  try {
    const groupData: Group[] = seedGroup.map(group => ({
      type: group.type,
      label: group.label,
      budgetID: budgetId,
      userID,
    }));

    Logger.silly('Seed start');
    const insertedGroup = await db.insert(groups).values(groupData).returning();

    const budgetItemsData: Item[] = [];

    insertedGroup.forEach(group => {
      const itemsForGroup = seedItems[group.label as keyof typeof seedItems];
      if (itemsForGroup) {
        itemsForGroup.forEach(item => {
          budgetItemsData.push({
            type: item.type,
            label: item.label,
            amountBudget: item.amountBudget,
            allocatedBudget: item.allocatedBudget,
            groupID: group.id,
          });
        });
      }
    });
    await db.insert(items).values(budgetItemsData);
    const groupsWithItems = await db.query.groups.findMany({
      columns: {
        userID: false,
        createdAt: false,
      },
      with: {
        items: {
          columns: {
            createdAt: false,
          },
        },
      },
      where: (groups, { eq }) => eq(groups.budgetID, budgetId),
    });
    Logger.silly('Seed Completed');
    return { groups: groupsWithItems };
  } catch (error) {
    console.log('Error', error);
  }
};
