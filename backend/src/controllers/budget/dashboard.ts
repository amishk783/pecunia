import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '@/types';
import Logger from '@/utils/logger';
import { AppError } from '@/utils/AppError';
import { getMonth, getYear } from 'date-fns';
import { db } from '@/db';
import { and, eq } from 'drizzle-orm';
import { budget, groups, items } from '@/db/schema/Budget';

export const dashboardSummary = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const { date } = req.params;

  if (!date) {
    Logger.error('Date is not provided');
    throw new AppError('Date is not provided', 400);
  }

  const month = getMonth(date) + 1;
  const year = getYear(date);

  try {
    // budget of the month
    const existingBudget = await db.query.budget.findFirst({
      where: and(eq(budget.month, month), eq(budget.year, year)),
    });

    if (!existingBudget) {
      Logger.error('Budget does not provided');
      throw new AppError('Budget does not provided', 400);
    }
    const incomeGroups = await db.query.groups.findMany({
      where: and(eq(groups.budgetID, existingBudget.id), eq(groups.type, 'income')),
      with: { items: true },
    });
    const expenseGroups = await db.query.groups.findMany({
      where: and(eq(groups.budgetID, existingBudget.id), eq(groups.type, 'expense')),
      with: { items: true },
    });

    const totalIncome = incomeGroups.reduce((acc, group) => {
      const groupIncome = group.items.reduce((sum, item) => sum + Number(item.amountBudget), 0);
      return acc + groupIncome;
    }, 0);
    const totalExpense = expenseGroups.reduce((acc, group) => {
      const groupIncome = group.items.reduce((sum, item) => sum + Number(item.amountBudget), 0);
      return acc + groupIncome;
    }, 0);

    const summary = {
      totalIncome,
      totalExpense,
      netBalance: totalIncome - totalExpense,
    };
    Logger.info('Dashboard summary retrieved successfully', summary);
    return res.status(200).json({
      message: 'Dashboard summary retrieved successfully',
      data: summary,
    });
  } catch (error) {
    Logger.error('Error fetching dashboard summary', error);
    return next(error);
  }
};
