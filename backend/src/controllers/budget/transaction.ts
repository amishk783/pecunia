import { db } from '@/db';
import { items, Transaction, transactions } from '@/db/schema/Budget';
import { AuthenticatedRequest } from '@/types';
import Logger from '@/utils/logger';
import { transactionSchema } from '@/utils/validationSchema';
import { eq } from 'drizzle-orm';
import { Response } from 'express';
import { format, parse } from 'date-fns';
import { date } from 'drizzle-orm/mysql-core';

export const createTransaction = async (req: AuthenticatedRequest, res: Response) => {
  const inputData: Transaction = req.body;
  const validatedData = await transactionSchema.parseAsync(inputData);
  console.log('🚀 ~ createTransaction ~ validatedData:', validatedData);

  if (!validatedData) {
    return res.send(400).send('');
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
      return res.status(400).send('Item does not exist');
    }

    const newTransaction = await db
      .insert(transactions)
      .values({
        ...validatedData,
        date: isoDateString, // Use the correctly formatted date here
        itemId: item.id,
      })
      .returning();

    res.status(201).json(newTransaction[0]);
  } catch (error) {
    Logger.error('Error creating item:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
};

export const deleteTransaction = async (req: AuthenticatedRequest, res: Response) => {
  const id = +req.params.id;

  try {
    const transaction = await db.query.transactions.findFirst({
      where: eq(items.id, id),
    });

    if (!transaction) {
      Logger.error('Transaction does not exit');
      return res.status(400).send('Transaction does not exit');
    }
    await db.delete(items).where(eq(items.id, id));
    res.status(201).json(transaction);
  } catch (error) {
    Logger.error('Error Deleting Transaction:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
};

export const updateTransactionByID = async (req: AuthenticatedRequest, res: Response) => {
  const id = +req.params.id;

  const validatedData = transactionSchema.parse(req.body);
  try {
    // Parse the date from the DD/MM/YYYY format to a Date object
    const parsedDate = parse(validatedData.date, 'dd/MM/yyyy', new Date());

    const isoDateString = parsedDate.toISOString(); // Format to YYYY-MM-DD for PostgreSQL
    const transaction = await db.query.transactions.findFirst({
      where: eq(transactions.id, id),
    });
    if (!transaction) {
      Logger.error('Transaction does not exit');
      return res.status(400).send('Transaction does not exit');
    }

    const updateTransaction = await db
      .update(transactions)
      .set({ ...validatedData, date: isoDateString })
      .where(eq(transactions.id, transaction.id));
    console.log(updateTransaction);
    res.status(200).send({ data: transaction, message: 'Transaction updated successfully' });
  } catch (error) {
    Logger.error('Error updating Transaction:', error);
    res.status(500).send('Internal server error');
    console.log(error);
  }
};

export const getAllTransaction = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const allTransactions = await db.query.transactions.findMany({
      with: {
        items: true,
      },
    });

    if (!allTransactions) {
      Logger.error('Transactions does not exit');
      return res.status(400).send('Transactions does not exit');
    }
    const transformedTransactions = allTransactions.map(transaction => ({
      ...transaction,

      date: format(new Date(transaction.date), 'MMM dd, yyyy'),
    }));
    res.status(200).send(transformedTransactions);
  } catch (error) {
    Logger.error('Error updating Transaction:', error);
    res.status(500).send('Internal server error');
    console.log(error);
  }
};

export const getTransactionById = async (req: AuthenticatedRequest, res: Response) => {
  const id = +req.params.id;
  if (!id) {
    Logger.error('Error updating Transaction:');
    return res.status(500).send('Internal server error');
  }
  try {
    const transaction = await db.query.transactions.findFirst({
      where: eq(transactions.id, id),
    });
    if (!transaction) {
      Logger.error('Transactions does not exit');
      return res.status(400).send('Transactions does not exit');
    }

    res.status(200).send(transaction);
  } catch (error) {
    Logger.error('Error updating Transaction:', error);
    res.status(500).send('Internal server error');
    console.log(error);
  }
};
