import { NextFunction, Response } from 'express';
import { db } from '@/db';
import { eq } from 'drizzle-orm';
import { budget, groups, Item, items } from '@/db/schema/Budget';
import Logger from '@/utils/logger';
import { AuthenticatedRequest } from '@/types';
import { reorderItemsSchemaArray } from '@/utils/validationSchema';
import { AppError } from '@/utils/AppError';

export const updateItemByID = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const id = +req.params.id;
  const { amountBudget } = req.body;

  const item = await db.query.items.findMany({
    where: eq(items.id, id),
  });
  if (!item) {
    Logger.error('Item does not exit');
    throw new AppError('Item does not exit', 400);
  }
  try {
    const updateItem = await db.update(items).set({ amountBudget: amountBudget }).where(eq(items.id, item[0].id));
    console.log(updateItem);
    res.status(200).send('Item updated successfully');
  } catch (error) {
    Logger.error('Error updating item:', error);
    next(error);
  }
};

export const createItem = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const { label, type, groupId, amountBudget } = req.body;

  try {
    const group = await db.query.groups.findFirst({
      where: eq(groups.id, groupId),
    });
    if (!group) {
      Logger.error(`Group with ID ${groupId} not found`);
      throw new AppError('Group not found', 400);
    }
    const newItem = await db
      .insert(items)
      .values({
        label,
        type,
        groupId,
        amountBudget,
        allocatedBudget: '0',
      })
      .returning();
    res.status(201).json(newItem[0]);
  } catch (error) {
    Logger.error('Error creating item:', error);
    next(error);
  }
};

export const deleteItem = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const id = +req.params.id;

  if (!id) {
    throw new AppError('Id is missing in the request ', 400);
  }

  try {
    const item = await db.query.items.findFirst({
      where: eq(items.id, id),
    });

    if (!item) {
      Logger.error('Item does not exit');
      throw new AppError('Item does not exit', 400);
    }
    await db.delete(items).where(eq(items.id, id));
    res.status(201).json(item);
  } catch (error) {
    Logger.error('Error Deleting item:', error);
    next(error);
  }
};

export const reorder = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const { data } = req.body;

  const validation = reorderItemsSchemaArray.safeParse(data);

  if (!validation.success) {
    throw new AppError('Invalid reorder data', 400);
  }

  try {
    const validatedData = validation.data;
    const updateResult = validatedData.map((item, index: number) => {
      item.position = index;
      return item;
    });

    const group = await db.query.groups.findFirst({
      where: eq(groups.id, updateResult[0].groupId),
    });

    if (!group) {
      Logger.error(`Group with ID ${updateResult[0].groupId} not found`);
      throw new AppError('Group not found', 400);
    }

    await db.transaction(async tx => {
      const updatePromises = validatedData.map((item, index) => {
        return tx.update(items).set({ position: index }).where(eq(items.id, item.id));
      });
      await Promise.all(updatePromises);
    });

    const updatedGroup = await db.query.groups.findFirst({
      where: eq(groups.id, group.id),
      with: {
        items: true,
      },
    });

    if (!updatedGroup || !updatedGroup.items) {
      throw new AppError('Failed to fetch updated items', 400);
    }

    const updatesSuccessful = updatedGroup.items.every((item, index) => item.position === index);

    if (!updatesSuccessful) {
      throw new AppError('Position updates were not applied correctly', 500);
    }

    res.status(201).json({ updateResult: updatedGroup.items });
  } catch (error) {
    next(error);
  }
};
