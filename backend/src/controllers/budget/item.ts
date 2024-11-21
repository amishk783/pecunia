import { Request, Response } from 'express';
import { db } from '@/db';
import { eq } from 'drizzle-orm';
import { budget, groups, items } from '@/db/schema/Budget';
import Logger from '@/utils/logger';
import { AuthenticatedRequest } from '@/types';

export const updateItemByID = async (req: AuthenticatedRequest, res: Response) => {
  const id = +req.params.id;
  const { amountBudget } = req.body;

  const item = await db.query.items.findMany({
    where: eq(items.id, id),
  });
  if (!item) {
    Logger.error('Item does not exit');
    res.status(400).send('Item does not exit');
  }
  try {
    const updateItem = await db.update(items).set({ amountBudget: amountBudget }).where(eq(items.id, item[0].id));
    console.log(updateItem);
    res.status(200).send('Item updated successfully');
  } catch (error) {
    Logger.error('Error updating item:', error);
    res.status(500).send('Internal server error');
    console.log(error);
  }
};

export const createItem = async (req: AuthenticatedRequest, res: Response) => {
  const { label, type, groupId, amountBudget } = req.body;

  try {
    const group = await db.query.groups.findMany({
      where: eq(groups.id, groupId),
    });
    if (!group) {
      Logger.error(`Group with ID ${groupId} not found`);
      return res.status(400).json({ error: 'Group not found' });
    }
    const newItem = await db
      .insert(items)
      .values({
        label,
        type,
        groupID: groupId,
        amountBudget,
      })
      .returning();
    res.status(201).json(newItem[0]);
  } catch (error) {
    Logger.error('Error creating item:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
};

export const deleteItem = async (req: AuthenticatedRequest, res: Response) => {
  const id = +req.params.id;
  console.log('🚀 ~ deleteItem ~ id:', id);

  try {
    const item = await db.query.items.findFirst({
      where: eq(items.id, id),
    });
    console.log('🚀 ~ deleteItem ~ item:', item);
    if (!item) {
      Logger.error('Item does not exit');
      return res.status(400).send('Item does not exit');
    }
    await db.delete(items).where(eq(items.id, id));
    res.status(201).json(item);
  } catch (error) {
    Logger.error('Error Deleting item:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
};
