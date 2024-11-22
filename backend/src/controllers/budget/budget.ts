import { Response } from 'express';
import { db } from '@/db';
import { and, eq } from 'drizzle-orm';
import { parse, getMonth, getYear } from 'date-fns';
import Logger from '@/utils/logger';
import { AuthenticatedRequest } from '@/types';
import { accounts } from '@/db/schema/User';
import { Budget, budget, Group, groups, items } from '@/db/schema/Budget';
import { seed } from '@/utils/seed';

export const createOnboardingBudget = async (req: AuthenticatedRequest, res: Response) => {
  const { date } = req.body;

  const parsedDate = parse(date, 'dd/MM/yyyy', new Date());
  console.log(parsedDate);
  const month = getMonth(parsedDate) + 1;
  const fullyear = getYear(parsedDate);

  const userId = req.user.sub as string;

  const account = await db.query.accounts.findFirst({
    where: eq(accounts.id, userId),
  });

  if (!account) {
    Logger.error('Account does not exit');
    res.status(400).send('Account does not exit');
  }

  const newBudget: Budget[] = await db
    .insert(budget)
    .values({
      userId: account.id,
      year: fullyear,
      month,
      status: 'active',
    })
    .returning();
  const parsedBudget = newBudget.map(({ userId, createdAt, ...rest }) => rest);

  const result = await seed(parsedBudget[0].id, account.id);
  const monthBudget = { ...parsedBudget[0], ...result };
  res.status(201).send({ monthBudget });
};

export const getBudgetByMonth = async (req: AuthenticatedRequest, res: Response) => {
  const { date } = req.body;

  if (!date) {
    Logger.error('Date is missing in the request body.');
    return res.status(400).send('Date is required.');
  }

  try {
    const parsedDate = parse(date, 'dd/MM/yyyy', new Date());
    console.log(parsedDate);
    const desiredMonth = getMonth(parsedDate) + 1;

    const desiredYear = getYear(parsedDate);

    const userId = req.user.sub as string;

    const account = await db.query.accounts.findFirst({
      where: eq(accounts.id, userId),
    });

    if (!account) {
      Logger.error('Account does not exit');
      return res.status(400).send('Account does not exit');
    }

    const budgetData = await db.query.budget.findFirst({
      where: and(eq(budget.userId, userId), eq(budget.month, desiredMonth), eq(budget.year, desiredYear)),
      with: {
        groups: {
          with: {
            items: true,
          },
        },
      },
    });

    if (!budgetData) {
      Logger.error('Budget not found for the specified month and year.');
      return res.status(404).send('Budget not found for the specified month and year.');
    }

    const currentBudget = budgetData;

    res.status(200).send({ currentBudget });
  } catch (error) {
    Logger.error('Error fetching budget data:', error);
    res.status(500).send('An error occurred while fetching the budget data.');
  }
};

export const getAllExistenceBudget = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user.sub as string;
  const account = await db.query.accounts.findFirst({
    where: eq(accounts.id, userId),
  });

  if (!account) {
    Logger.error('Account does not exit');
    return res.status(400).send('Account does not exit');
  }
  const budgetData = await db.query.budget.findMany({
    where: and(eq(budget.userId, userId)),
  });

  const budgetExitence = budgetData.reduce(
    (acc, budget) => {
      const { year, month, id } = budget;

      if (!acc[year]) {
        acc[year] = {};
      }
      acc[year][month] = id;

      return acc;
    },
    {} as Record<string, Record<number, number>>,
  );
  if (!budgetData.length) {
    Logger.error('Budget not found for the specified month and year.');
    return res.status(404).send('Budget not found for the specified month and year.');
  }
  res.status(200).send({ budgetExitence });
};

export const cloneBudget = async (req: AuthenticatedRequest, res: Response) => {
  const id = +req.params.id;
  console.log('🚀 ~ cloneBudget ~ id:', id);

  const { date } = req.body;
  console.log('🚀 ~ cloneBudget ~ date:', date);

  const prevExistingBudget = await db.query.budget.findFirst({
    where: eq(budget.id, id),
    with: {
      groups: {
        with: {
          items: true,
        },
      },
    },
  });

  if (!prevExistingBudget) {
    Logger.error('Budget not found for the specified ID.');
    return res.status(404).send('Budget not found.');
  }

  const year = getYear(date);
  console.log('🚀 ~ cloneBudget ~ year:', year);
  const month = getMonth(date);
  console.log('🚀 ~ cloneBudget ~ month:', month);
  try {
    const result = await db.transaction(async tx => {
      const [newBudget] = await tx
        .insert(budget)
        .values({
          userId: prevExistingBudget.userId,
          status: prevExistingBudget.status,
          year,
          month,
        })
        .returning();

      if (!newBudget) {
        throw new Error('Failed to create new budget');
      }

      if (prevExistingBudget.groups && prevExistingBudget.groups.length > 0) {
        for (const group of prevExistingBudget.groups) {
          const [newGroup] = await tx
            .insert(groups)
            .values({
              budgetID: newBudget.id,
              type: group.type,
              label: group.label,
              userID: group.userID,
            })
            .returning();
          if (group.items && group.items.length > 0) {
            const newGroupItems = group.items.map(item => ({
              type: item.type,
              label: item.label,
              groupId: newGroup.id,
              amountBudget: item.amountBudget,
              allocatedBudget: item.amountBudget,
              dueDate: item.dueDate,
            }));
            await tx.insert(items).values(newGroupItems);
          }
        }
      }
      const completeBudget = await tx.query.budget.findFirst({
        where: eq(budget.id, newBudget.id),
        with: {
          groups: {
            with: {
              items: true,
            },
          },
        },
      });
      return completeBudget;
    });
    Logger.info(`Successfully cloned budget ${id} to new budget ${result.id}`);
    return res.status(201).json({
      message: 'Budget successfully cloned',
      budget: result,
    });
  } catch (error) {
    Logger.error('Error cloning budget:', error);
    return res.status(500).json({
      message: 'Failed to clone budget',
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    });
  }
};
