import { db } from '@/db';
import { groups, items, Transaction, transactions } from '@/db/schema/Budget';
import { AuthenticatedRequest } from '@/types';
import Logger from '@/utils/logger';
import { transactionSchema } from '@/utils/validationSchema';
import { eq } from 'drizzle-orm';
import { NextFunction, Response } from 'express';
import { format, parse } from 'date-fns';

import { AppError } from '@/utils/AppError';

export const createTransaction = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const inputData: Transaction = req.body;
  const validatedData = await transactionSchema.parseAsync(inputData);
  console.log('🚀 ~ createTransaction ~ validatedData:', validatedData);

  if (!validatedData) {
    throw new AppError('Invalid transaction data', 400);
  }
  try {
    // Parse the date from the DD/MM/YYYY format to a Date object
    const parsedDate = format(validatedData.date, 'yyyy-MM-dd');

    const isoDateString = parsedDate; // Format to YYYY-MM-DD for PostgreSQL

    const item = await db.query.items.findFirst({
      where: eq(items.label, validatedData.category),
    });

    // Check if item exists and item.id is valid
    if (!item || !item.id) {
      Logger.silly("Item doesn't exist ");
      throw new AppError('Item does not exist', 400);
    }

    const newTransaction = await db
      .insert(transactions)
      .values({
        ...validatedData,
        date: isoDateString, // Use the correctly formatted date here
        itemId: item.id,
        userId: req.user?.sub as string,
      })
      .returning();
    const amountSpent = +item?.allocatedBudget + +newTransaction[0].amount;

    const updateItemAmount = await db
      .update(items)
      .set({ allocatedBudget: `${amountSpent}` })
      .where(eq(items.id, newTransaction[0].itemId));

    res.status(201).json(newTransaction[0]);
  } catch (error) {
    Logger.error('Error creating item:', error);
    next(error);
  }
};

export const deleteTransaction = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const id = +req.params.id;
  console.log('🚀 ~ deleteTransaction ~ id:', id);

  if (!id) {
    throw new AppError('Id is missing in the request ', 400);
  }

  try {
    const transaction = await db.query.transactions.findFirst({
      where: eq(transactions.id, id),
    });
    console.log('🚀 ~ deleteTransaction ~ transaction:', transaction);

    if (!transaction) {
      Logger.error('Transaction does not exit');
      throw new AppError('Transaction does not exit', 400);
    }
    const deletedTransaction = await db.delete(transactions).where(eq(transactions.id, id)).returning();
    res.status(201).json(deletedTransaction[0]);
  } catch (error) {
    Logger.error('Error Deleting Transaction:', error);
    next(error);
  }
};

export const updateTransactionByID = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const id = +req.params.id;
  if (!id) {
    throw new AppError('Id is missing in the request ', 400);
  }
  const validatedData = await transactionSchema.parse(req.body);

  if (!validatedData) {
    throw new AppError('Invalid transaction data', 400);
  }
  try {
    // Parse the date from the DD/MM/YYYY format to a Date object
    const parsedDate = parse(validatedData.date, 'dd/MM/yyyy', new Date());

    const isoDateString = parsedDate.toISOString(); // Format to YYYY-MM-DD for PostgreSQL
    const transaction = await db.query.transactions.findFirst({
      where: eq(transactions.id, id),
    });
    if (!transaction) {
      Logger.error('Transaction does not exit');
      throw new AppError('Transaction does not exit', 400);
    }

    const updateTransaction = await db
      .update(transactions)
      .set({ ...validatedData, date: isoDateString })
      .where(eq(transactions.id, transaction.id));
    console.log(updateTransaction);
    res.status(200).send({ data: transaction, message: 'Transaction updated successfully' });
  } catch (error) {
    Logger.error('Error updating Transaction:', error);
    next(error);
  }
};

export const getAllTransaction = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const user = req.user;
    console.log('🚀 ~ getAllTransaction ~ user:', user);

    if (!user) {
      throw new AppError('User does not exit', 400);
    }

    const allTransactions = await db.query.transactions.findMany({
      with: {
        items: true,
      },
      where: eq(transactions.userId, user.sub as string),
    });

    if (!allTransactions) {
      Logger.error('Transactions does not exit');
      throw new AppError('Transactions does not exit', 400);
    }
    const transformedTransactions = allTransactions.map(transaction => ({
      ...transaction,

      date: format(new Date(transaction.date), 'MMM dd, yyyy'),
    }));

    res.status(200).send(transformedTransactions);
  } catch (error) {
    Logger.error('Error updating Transaction:', error);
    next(error);
  }
};

export const getTransactionById = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const id = +req.params.id;
  if (!id) {
    Logger.error('Id is missing in the request');
    throw new AppError('Id is missing in the request', 400);
  }
  try {
    const transaction = await db.query.transactions.findFirst({
      where: eq(transactions.id, id),
    });
    if (!transaction) {
      Logger.error('Transactions does not exit');
      throw new AppError('Transactions does not exit', 400);
    }

    res.status(200).send(transaction);
  } catch (error) {
    Logger.error('Error updating Transaction:', error);
    next(error);
  }
};

export const copyTransaction = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const id = +req.params.id;
  const inputData: Transaction = req.body;
  const validatedData = await transactionSchema.parseAsync(inputData);

  if (!validatedData) {
    throw new AppError('Invalid transaction data', 400);
  }
  if (!id) {
    Logger.error('Id is missing in the request');
    throw new AppError('Id is missing in the request', 400);
  }
  try {
    const transaction = await db.query.transactions.findFirst({
      where: eq(transactions.id, id),
    });
    if (!transaction) {
      Logger.error('Transactions does not exit');
      throw new AppError('Transactions does not exit', 400);
    }

    const copiedTransaction = await db
      .insert(transactions)
      .values({
        ...validatedData,

        itemId: transaction.itemId,
      })
      .returning();

    res.status(201).json(copiedTransaction[0]);
  } catch (error) {
    Logger.error('Error updating Transaction:', error);
    next(error);
  }
};
