import jwt, { decode } from 'jsonwebtoken';
import config from '@/config';
import { Response, NextFunction } from 'express';
import Logger from '@/utils/logger';
import { AuthenticatedRequest } from '@/types';

export const verifyUser = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) {
    Logger.error('No token provided');
    return res.status(401).send('Unauthorized: No token provided');
  }

  jwt.verify(
    token,
    config.jwtSecret,
    (error: jwt.VerifyErrors | null, decoded: jwt.JwtPayload | string | undefined) => {
      if (error) {
        Logger.error('Invalid token');
        return res.status(403).send('Forbidden: Invalid token');
      }

      req.user = decoded;

      Logger.silly('User authenticated successfully');
      next();
    },
  );
};
