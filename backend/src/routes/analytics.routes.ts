import { Router } from 'express';
import { AnalyticsController } from '../controllers/analytics.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validation.middleware.js';
import { analyticsFilterSchema } from '../dtos/analytics.dto.js';

const router = Router();

router.get('/content/:contentId', authenticateToken, validate(analyticsFilterSchema), AnalyticsController.getContentAnalytics);
router.get('/user', authenticateToken, validate(analyticsFilterSchema), AnalyticsController.getUserAnalytics);

export { router as analyticsRoutes };