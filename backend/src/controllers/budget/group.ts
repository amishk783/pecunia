import { Request, Response } from 'express';
import { db } from '@/db';
import { eq } from 'drizzle-orm';

import { budget, groups, items } from '@/db/schema/Budget';
import Logger from '@/utils/logger';
import { AuthenticatedRequest } from '@/types';
import { accounts } from '@/db/schema/User';
import { reorderGroupSchemaArray } from '@/utils/validationSchema';

export const editGroupLabel = async (req: AuthenticatedRequest, res: Response) => {
  const id = +req.params.id;
  const { label } = req.body;
  console.log(id, label);

  try {
    const group = await db.query.groups.findFirst({
      where: eq(groups.id, id),
      with: {
        items: true,
      },
    });
    if (!group) {
      Logger.error('Group does not exit');
      res.status(400).send('Group does not exit');
    }

    const updatedGroup = await db
      .update(groups)
      .set({
        label,
      })
      .where(eq(groups.id, id))
      .returning();
    const relatedItems = await db.select().from(items).where(eq(items.groupId, updatedGroup[0].id));
    console.log('🚀 ~ editGroupLabel ~ relatedItems:', relatedItems);
    Logger.silly('Group label succesfully');
    const groupWithItems = {
      ...updatedGroup[0],
      items: relatedItems,
    };
    res.status(200).send({ message: 'Group label succesfully', group: groupWithItems });
  } catch (error) {
    Logger.error('Error updating group:', error);
    console.log(error);
    res.status(500).send('Internal server error');
  }
};

export const createGroup = async (req: AuthenticatedRequest, res: Response) => {
  const { type, label, budgetId } = req.body;
  const user = req.user;
  if (!user) return;
  try {
    const account = await db.query.accounts.findMany({
      where: eq(accounts.id, user.sub as string),
    });
    if (!account) {
      Logger.error('Account does not exit');
      res.status(400).send('Account does not exit');
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
    console.log(error);
    res.status(500).send('Internal server error');
  }
};
export const deleteGroup = async (req: AuthenticatedRequest, res: Response) => {
  const id = +req.params.id;
  console.log('🚀 ~ deletegroup ~ id:', id);

  try {
    const group = await db.query.groups.findFirst({
      where: eq(groups.id, id),
    });
    console.log('🚀 ~ deletegroup ~ group:', group);
    if (!group) {
      Logger.error('group does not exit');
      return res.status(400).send('group does not exit');
    }
    await db.delete(groups).where(eq(groups.id, id));
    res.status(201).json(group);
  } catch (error) {
    Logger.error('Error Deleting group:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
};

export const reorderGroups = async (req: AuthenticatedRequest, res: Response) => {
  const { data } = req.body;

  const validation = reorderGroupSchemaArray.safeParse(data);

  if (!validation.success) {
    console.error(validation.error.format());
    return;
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
      return res.status(400).json({ error: 'Budget not found' });
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
      throw new Error('Failed to fetch updated groups');
    }
    console.log('🚀 ~ updatedItems ~ updatedItems:', updatedBudget.groups);
    const positionsAreCorrect = updatedBudget.groups.every((item, index) => item.position === index);

    if (!positionsAreCorrect) {
      Logger.error('Position mismatch:', updatedBudget.groups);
      throw new Error('Position updates were not applied correctly');
    }

    console.log('🚀 ~ updatedBudget ~ updatedBudget:', updatedBudget);

    res.status(201).json(updateResult);
  } catch (error) {
    console.log(error);
  }
};
