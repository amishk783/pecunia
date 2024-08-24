import { Request, Response } from 'express';
import { db } from '@/db';
import { eq } from 'drizzle-orm';
import { parse, getMonth, getYear } from 'date-fns';
import Logger from '@/utils/logger';
import { AuthenticatedRequest } from '@/types';
import { accounts } from '@/db/schema/User';
import { Budget, budget } from '@/db/schema/Budget';
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
