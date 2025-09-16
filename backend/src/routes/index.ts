import { Router } from 'express';
import { authRoutes } from './auth.routes.js';
import { contentRoutes } from './content.routes.js';
import { analyticsRoutes } from './analytics.routes.js';
import { profileRoutes } from './profile.routes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/content', contentRoutes);
router.use('/analytics', analyticsRoutes);
router.use('/profile', profileRoutes);

export { router as appRoutes };