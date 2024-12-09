import { NextFunction, Request, Response } from 'express';
import { db } from '@/db';
import { eq } from 'drizzle-orm';

import { budget, groups, items } from '@/db/schema/Budget';
import Logger from '@/utils/logger';
import { AuthenticatedRequest } from '@/types';
import { accounts } from '@/db/schema/User';
import { reorderGroupSchemaArray } from '@/utils/validationSchema';
import { AppError } from '@/utils/AppError';

export const editGroupLabel = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const id = +req.params.id;
  const { label } = req.body;

  if (!id || !label) throw new AppError('Inouts are undefined ', 400);
  try {
    const group = await db.query.groups.findFirst({
      where: eq(groups.id, id),
      with: {
        items: true,
      },
    });
    if (!group) {
      Logger.error('Group does not exit');
      throw new AppError('Group does not exit', 400);
    }

    const updatedGroup = await db
      .update(groups)
      .set({
        label,
      })
      .where(eq(groups.id, id))
      .returning();
    const relatedItems = await db.select().from(items).where(eq(items.groupId, updatedGroup[0].id));
    Logger.silly('Group label succesfully');
    const groupWithItems = {
      ...updatedGroup[0],
      items: relatedItems,
    };
    res.status(200).send({ message: 'Group label succesfully', group: groupWithItems });
  } catch (error) {
    Logger.error('Error updating group:', error);
    next(error);
  }
};

export const createGroup = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const { type, label, budgetId } = req.body;
  const user = req.user;
  if (!user) return;
  try {
    const account = await db.query.accounts.findMany({
      where: eq(accounts.id, user.sub as string),
    });
    if (!account) {
      Logger.error('Account does not exit');
      throw new AppError('Account does not exit', 400);
    }
    const newGroup = await db
      .insert(groups)
      .values({
        label,
        type,
        budgetID: budgetId,
        userID: account[0].id,
      })
      .returning();
    const relatedItems = await db.select().from(items).where(eq(items.groupId, newGroup[0].id));

    Logger.error('Group created succesfully');
    res.status(200).send({
      message: 'Group created successfully',
      group: {
        ...newGroup[0],
        items: relatedItems,
      },
    });
  } catch (error) {
    Logger.error('Error creating group:', error);
    next(error);
  }
};
export const deleteGroup = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const id = +req.params.id;

  if (!id) {
    throw new AppError('Id is missing in the request ', 400);
  }

  try {
    const group = await db.query.groups.findFirst({
      where: eq(groups.id, id),
    });

    if (!group) {
      Logger.error('group does not exit');
      throw new AppError('Group does not exit', 400);
    }
    await db.delete(groups).where(eq(groups.id, id));
    res.status(201).json(group);
  } catch (error) {
    Logger.error('Error Deleting group:', error);
    next(error);
  }
};

export const reorderGroups = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const { data } = req.body;

  const validation = reorderGroupSchemaArray.safeParse(data);

  if (!validation.success) {
    throw new AppError('Invalid reorder data', 400);
  }

  try {
    const validatedData = validation.data;
    const updateResult = validatedData.map((item, index: number) => {
      item.position = index;

      return item;
    });

    // Fetch budget to validate existence

    const budgetExits = await db.query.budget.findFirst({
      where: eq(budget.id, updateResult[0].budgetId),
    });

    if (!budgetExits) {
      Logger.error(`Budget with ID ${updateResult[0].budgetId} not found`);
      throw new AppError(`Budget with ID ${validatedData[0].budgetId} not found`, 404);
    }

    await db.transaction(async tx => {
      const updatePromises = validatedData.map((group, index) => {
        return tx.update(groups).set({ position: index }).where(eq(groups.id, group.id));
      });
      await Promise.all(updatePromises);
    });
    const updatedBudget = await db.query.budget.findFirst({
      where: eq(budget.id, validatedData[0].budgetId),
      with: {
        groups: true,
      },
    });

    if (!updatedBudget?.groups) {
      throw new AppError('Failed to fetch updated groups', 500);
    }
    console.log('🚀 ~ updatedItems ~ updatedItems:', updatedBudget.groups);
    const positionsAreCorrect = updatedBudget.groups.every((item, index) => item.position === index);

    if (!positionsAreCorrect) {
      Logger.error('Position mismatch:', updatedBudget.groups);
      throw new AppError('Position updates were not applied correctly', 500);
    }

    res.status(201).json(updateResult);
  } catch (error) {
    next(error);
  }
};
