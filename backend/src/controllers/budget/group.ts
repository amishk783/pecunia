import { Request, Response } from 'express';
import { db } from '@/db';
import { eq } from 'drizzle-orm';

import { groups } from '@/db/schema/Budget';
import Logger from '@/utils/logger';
import { AuthenticatedRequest } from '@/types';
import { accounts } from '@/db/schema/User';

export const editGroupLabel = async (req: Request, res: Response) => {
  const id = +req.params.id;
  const { label } = req.body;
  console.log(id, label);

  try {
    const group = await db.query.groups.findMany({
      where: eq(groups.id, id),
    });
    if (!group) {
      Logger.error('Group does not exit');
      res.status(400).send('Group does not exit');
    }

    await db
      .update(groups)
      .set({
        label,
      })
      .where(eq(groups.id, id));
    Logger.error('Group label succesfully');
    res.status(400).send('Group label succesfully');
  } catch (error) {
    Logger.error('Error updating group:', error);
    console.log(error);
    res.status(500).send('Internal server error');
  }
};

export const createGroup = async (req: AuthenticatedRequest, res: Response) => {
  const { type, label, budgetID } = req.body;
  const user = req.user;
  console.log(type, label, budgetID);
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
        budgetID,
        userID: account[0].id,
      })
      .returning();

    Logger.error('Group created succesfully');
    res.status(400).send({ 'Group created succesfully': newGroup });
  } catch (error) {
    Logger.error('Error creating group:', error);
    console.log(error);
    res.status(500).send('Internal server error');
  }
};
