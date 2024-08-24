import { Request, Response } from 'express';
import { db } from '@/db';
import { eq } from 'drizzle-orm';
import { budget, groups, items } from '@/db/schema/Budget';
import Logger from '@/utils/logger';

export const updateItemByID = async (req: Request, res: Response) => {
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

export const createItem = async (req: Request, res: Response) => {
  const { label, type, groupID, amountBudget } = req.body;
  try {
    const group = await db.query.groups.findMany({
      where: eq(groups.id, groupID),
    });
    if (!group) {
      Logger.error(`Group with ID ${groupID} not found`);
      return res.status(400).json({ error: 'Group not found' });
    }
    const newItem = await db
      .insert(items)
      .values({
        label,
        type,
        groupID,
        amountBudget,
      })
      .returning();
    res.status(201).json(newItem[0]);
  } catch (error) {
    Logger.error('Error creating item:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
};

export const deleteItem = async (req: Request, res: Response) => {
  const id = +req.params.id;

  try {
    const item = await db.query.items.findMany({
      where: eq(items.id, id),
    });
    if (!item) {
      Logger.error('Item does not exit');
      res.status(400).send('Item does not exit');
    }
    await db.delete(items).where(eq(items.id, id));
  } catch (error) {
    Logger.error('Error Deleting item:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
};
