import config from '@/config';
import { db } from '@/db';
import { items } from '@/db/schema/Budget';
import { AuthenticatedRequest } from '@/types';
import { AppError } from '@/utils/AppError';
import { getScanStatus, saveScansession, updateScanSession } from '@/utils/scanSessionService';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { uuid } from 'drizzle-orm/pg-core';
import { NextFunction, Response } from 'express';
import OpenAI from 'openai';
import Tesseract from 'tesseract.js';

const openai = new OpenAI({ apiKey: config.openAIApikey });

const genAI = new GoogleGenerativeAI(config.geminiAIApiKey);
const model = genAI.getGenerativeModel({ model: 'models/gemini-1.5-pro' });

export const scanTransaction = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  console.log(config.openAIApikey);
  console.log(req.body);
  const image = req.file;

  try {
    if (!image) {
      throw new AppError('No image provided', 400);
    }

    const scanSessionId = crypto.randomUUID();

    processReceiptScan(image, scanSessionId);

    return res.status(200).json({
      success: true,
      scanSessionId,
    });
  } catch (error) {
    console.log('🚀 ~ scanTransaction ~ error:', error);
    next(error);
  }
};

export const extractTransactionDetails = async <T>(extractedText: string): Promise<T> => {
  const genAI = new GoogleGenerativeAI(config.geminiAIApiKey);
  const model = genAI.getGenerativeModel({ model: 'models/gemini-1.5-pro' });

  // fetch categories for mapping

  const categories = await db.query.items.findMany();

  const categoryMap = categories.reduce(
    (map, category) => {
      map[category.label.toLowerCase()] = category.id;
      return map;
    },
    {} as Record<string, number>,
  );

  const prompt = `You are a smart assistant. Based on the provided receipt text and categories, extract and map the transaction details to the following schema, assign the categories on the basis of receipt which matches best:
                    {
                     "date": "Transaction date",
                     "amount": "Total amount spent",
                      "label": "Merchant name",
                      "category": "Category name (assign category closest to provided category map based on receipt)",
                      "paidVia": "Payment method",
                       "notes": ["List of all items from the bill"],

                    }

                    Categories:${JSON.stringify(categoryMap)}
                    Receipt Text:"${extractedText}"
                    Return a valid JSON object matching the schema. If any field is missing, provide the best possible match or null where appropriate.
    `;

  try {
    const result = await model.generateContent([prompt]);

    const responseText = result.response
      .text()
      .replace(/```(json)?/g, '')
      .trim();
    return JSON.parse(responseText);
  } catch (error) {
    console.error('AI Extraction Error:', error);
    throw new AppError('Failed to extract transaction details', 500);
  }
};

export const processWithOCR = async (imageBuffer: Buffer): Promise<string> => {
  try {
    const result = await Tesseract.recognize(imageBuffer, 'eng');
    const extractedText = result.data.text;

    // basic text sanitization

    return extractedText
      .trim()
      .replace(/```json/g, '') // Remove opening JSON code block
      .replace(/```/g, ''); // Remove closing code block
  } catch (error) {
    console.error('OCR Processing Error:', error);
    throw new Error('Failed to process recipt image');
  }
};

export const processReceiptScan = async (file: Express.Multer.File, scanSessionId: string) => {
  try {
    await saveScansession({
      id: scanSessionId,
      status: 'PROCESSING',
      originalFileName: file.originalname,
    });
    //  OCR Processing
    const extractedText = await processWithOCR(file.buffer);
    console.log("🚀 ~ processReceiptScan ~ extractedText:", extractedText)

    // AI powered Extraction

    const transactionDetails = await extractTransactionDetails(extractedText);
    console.log("🚀 ~ processReceiptScan ~ transactionDetails:", transactionDetails)

    // Update scan session with extracted details
    await updateScanSession(scanSessionId, {
      status: 'COMPLETED',
      extractedData: transactionDetails,
    });
  } catch (error) {
    // Handle and log errors
    if (error instanceof AppError)
      await updateScanSession(scanSessionId, {
        status: 'FAILED',
        error: error.message,
      });
  }
};

export const checkScanStatus = async (req: AuthenticatedRequest, res: Response) => {
  const { id: scanSessionId } = req.params;
  console.log('🚀 ~ checkScanStatus ~ scanSessionId:', scanSessionId);

  try {
    const scanStatus = await getScanStatus(scanSessionId);
    res.json(scanStatus);
  } catch (error) {
    res.status(404).json({ error: 'Scan session not found' });
  }
};
