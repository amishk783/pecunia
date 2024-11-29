import express, { Express } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import morgan from 'morgan';
import config from './config/index';
import Logger from './utils/logger';
import { verifyUser } from './middleware/verifyUser';
const app = express();

import { budgetRouter } from './routes/budget';
import { itemRouter } from './routes/item';
import { errorHandler } from './middleware/errorMiddleware';

if (config.nodeEnv === 'production') {
  app.use(helmet());
  app.use(compression());
}
const corsOptions = {
  origin: 'https://localhost:5173',
};

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (config.nodeEnv !== 'test') {
  app.use(morgan(config.nodeEnv === 'production' ? 'combined' : 'dev'));
}

app.use('/', verifyUser);

app.use('/app/budget', budgetRouter);  
app.use('/app/item', itemRouter);

app.use(errorHandler); // centralized error approach

process.on('uncaughtException', (error: Error) => {
  Logger.error('uncaughtException', error);
  process.exit(1);
});

app.listen(config.port, () => {
  Logger.info(
    `
      ################################################
      🛡️  Server listening on port: ${config.port} 🛡️
      ################################################`,
  ).on('error', err => {
    Logger.error(err);
    process.exit(1);
  });
});
