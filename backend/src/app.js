import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import pinoHttp from 'pino-http';
import { env } from './config/env.js';
import { logger } from './config/logger.js';
import { createSessionMiddleware } from './config/session.js';
import { generalLimiter } from './middleware/rateLimit.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';
import apiRoutes from './routes/index.js';

export function createApp() {
  const app = express();
  app.set('trust proxy', 1);

  app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
  app.use(cors({ origin: env.frontendUrl, credentials: true }));
  app.use(compression());
  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ extended: true, limit: '1mb' }));
  app.use(pinoHttp({ logger }));
  app.use(generalLimiter);
  app.use(createSessionMiddleware());

  app.get('/', (req, res) => res.json({ success: true, message: 'Swift Wheels API is running.' }));
  app.use('/api', apiRoutes);
  app.use(notFound);
  app.use(errorHandler);
  return app;
}
