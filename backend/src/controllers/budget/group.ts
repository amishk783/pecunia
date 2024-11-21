import { Request, Response } from 'express';
import { db } from '@/db';
import { eq } from 'drizzle-orm';

import { groups, items } from '@/db/schema/Budget';
import Logger from '@/utils/logger';
import { AuthenticatedRequest } from '@/types';
import { accounts } from '@/db/schema/User';

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
    const relatedItems = await db.select().from(items).where(eq(items.groupID, updatedGroup[0].id));
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
  console.log(type, label, budgetId);
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
    const relatedItems = await db.select().from(items).where(eq(items.groupID, newGroup[0].id));

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
