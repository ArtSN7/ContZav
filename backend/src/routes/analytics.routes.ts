import { Router } from 'express';
import { AnalyticsController } from '../controllers/analytics.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = Router();

router.use(authMiddleware);

router.get('/content/:contentId', AnalyticsController.getContentAnalytics);
router.get('/user', AnalyticsController.getUserAnalytics);
router.get('/top-content', AnalyticsController.getTopContent);
router.get('/platform-comparison', AnalyticsController.getPlatformComparison);
router.get('/statistics', AnalyticsController.getStatistics);
router.get('/export', AnalyticsController.exportAnalytics);

export default router;