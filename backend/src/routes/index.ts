import { Router } from 'express';
import { authRoutes } from './auth.routes.js';
import { contentRoutes } from './content.routes.js';
import { analyticsRoutes } from './analytics.routes.js';
import { profileRoutes } from './profile.routes.js';
import { accountRoutes } from './account.routes.js';
import { webhookRoutes } from './webhook.routes.js';
import { subscriptionRoutes } from './subscription.routes.js';
import { aiRoutes } from './ai.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/content', contentRoutes);
router.use('/analytics', analyticsRoutes);
router.use('/profile', profileRoutes);
router.use('/account', accountRoutes);
router.use('/webhook', webhookRoutes);
router.use('/subscription', subscriptionRoutes);
router.use('/ai', aiRoutes);

export { router as appRoutes };