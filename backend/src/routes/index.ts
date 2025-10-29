import { Router } from 'express';
import authRoutes from './auth.routes.js';
import accountRoutes from './account.routes.js';
import subscriptionRoutes from './subscription.routes.js';
import analyticsRoutes from './analytics.routes.js';
import aiRoutes from './ai.routes.js';
import contentRoutes from './content.routes.js';
import webhookRoutes from './webhook.routes.js';
import { requestLoggerMiddleware } from '@/middleware/request-logger.middleware.js';

const router = Router();

router.use(requestLoggerMiddleware);

router.use('/auth', authRoutes);
router.use('/account', accountRoutes);
router.use('/subscription', subscriptionRoutes);
router.use('/analytics', analyticsRoutes);
router.use('/ai', aiRoutes);
router.use('/content', contentRoutes);
router.use('/webhook', webhookRoutes);

export { router as appRoutes };