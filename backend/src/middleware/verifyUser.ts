import jwt, { decode } from 'jsonwebtoken';
import config from '@/config';
import { Response, NextFunction } from 'express';
import Logger from '@/utils/logger';
import { AuthenticatedRequest } from '@/types';
import { AppError } from '@/utils/AppError';

export const verifyUser = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) {
    Logger.error('Unauthorized: No token provided');
    throw new AppError('Access denied', 400);
  }

  jwt.verify(
    token,
    config.jwtSecret,
    (error: jwt.VerifyErrors | null, decoded: jwt.JwtPayload | string | undefined) => {
      if (error) {
        Logger.error('Invalid token');
        throw new AppError('Your session has expired. Please log in again', 403);
      }

      req.user = decoded;

      Logger.silly('User authenticated successfully');
      next();
    },
  );
};
