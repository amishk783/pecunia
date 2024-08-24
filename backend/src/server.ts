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

if (config.nodeEnv === 'production') {
  app.use(helmet());
  app.use(compression());
}
const corsOptions = {
  origin: 'https://localhost:4893',
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (config.nodeEnv !== 'test') {
  app.use(morgan(config.nodeEnv === 'production' ? 'combined' : 'dev'));
}

app.use('/', verifyUser);

app.use('/app/budget', budgetRouter);

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
