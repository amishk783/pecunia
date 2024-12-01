import config from '@/config';
import { Redis } from '@upstash/redis';
import { AppError } from './AppError';
interface ScanSessionType {
  id: string;
  status: 'PROCESSING' | 'COMPLETED' | 'FAILED';
  originalFileName?: string;
  extractedData?: any;
  error?: string;
}

const redis = new Redis({
  url: config.upstashRedisUrl,
  token: config.upstashRedisKey,
});

export const saveScansession = async (session: ScanSessionType) => {
  await redis.set(`scan_session:${session.id}`, JSON.stringify(session), { ex: 3600 });
};

export const updateScanSession = async (sessionId: string, updates: Partial<ScanSessionType>) => {
  const existingSessionJson = await redis.get(`scan_session:${sessionId}`);

  if (!existingSessionJson) {
    throw new Error('Scan session not found');
  }

  const existingSession = existingSessionJson;

  const updatedSession = { ...existingSession, ...updates };
  console.log("🚀 ~ updateScanSession ~ updatedSession:", updatedSession)

  await redis.set(`scan_session:${sessionId}`,updatedSession, { ex: 3600 });
};

export const getScanStatus = async (sessionId: string) => {
  console.log('🚀 ~ getScanStatus ~ sessionId:', sessionId);
  const sessionJson = (await redis.get(`scan_session:${sessionId}`)) as ScanSessionType;

  console.log('🚀 ~ getScanStatus ~ sessionJson:', sessionJson);

  if (!sessionJson) {
    throw new AppError('Scan session not found', 400);
  }
  return sessionJson;
};
