import { Response } from 'express';
import { db } from '@/db';
import { and, eq } from 'drizzle-orm';
import { parse, getMonth, getYear } from 'date-fns';
import Logger from '@/utils/logger';
import { AuthenticatedRequest } from '@/types';
import { accounts } from '@/db/schema/User';
import { Budget, budget, Group, groups, items } from '@/db/schema/Budget';
import { seed } from '@/utils/seed';

export const createBudget = async (req: AuthenticatedRequest, res: Response) => {
  const { date } = req.body;

  const parsedDate = parse(date, 'dd/MM/yyyy', new Date());
  console.log(parsedDate);
  const month = getMonth(parsedDate) + 1;
  const fullyear = getYear(parsedDate);

  const userId = req.user.sub as string;

  const account = await db.query.accounts.findMany({
    where: eq(accounts.id, userId),
  });

  if (!account) {
    Logger.error('Account does not exit');
    res.status(400).send('Account does not exit');
  }

  const newBudget: Budget[] = await db
    .insert(budget)
    .values({
      userId: account[0].id,
      year: fullyear,
      month,
      status: 'active',
    })
    .returning();
  const parsedBudget = newBudget.map(({ userId, createdAt, ...rest }) => rest);

  const result = await seed(parsedBudget[0].id, account[0].id);
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

    const budgetData = await db.query.budget.findMany({
      where: and(eq(budget.userId, userId), eq(budget.month, desiredMonth), eq(budget.year, desiredYear)),
      with: {
        groups: {
          with: {
            items: true,
          },
        },
      },
    });

    if (!budgetData.length) {
      Logger.error('Budget not found for the specified month and year.');
      return res.status(404).send('Budget not found for the specified month and year.');
    }

    const currentBudget = budgetData[0];

    res.status(200).send({ currentBudget });
  } catch (error) {
    Logger.error('Error fetching budget data:', error);
    res.status(500).send('An error occurred while fetching the budget data.');
  }
};
