import { Router } from 'express';
import { SubscriptionController } from '../controllers/subscription.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { adminMiddleware } from '../middleware/admin.middleware.js';

const router = Router();

// Public routes
router.get('/plans', SubscriptionController.getAllPlans);
router.get('/plans/:planId', SubscriptionController.getPlan);

// User routes
router.use(authMiddleware);
router.get('/user', SubscriptionController.getUserSubscription);
router.put('/user', SubscriptionController.updateUserSubscription);
router.delete('/user', SubscriptionController.cancelSubscription);
router.get('/limits/:feature', SubscriptionController.checkLimit);

// Admin routes
router.use(adminMiddleware);
router.post('/plans', SubscriptionController.createPlan);
router.put('/plans/:planId', SubscriptionController.updatePlan);
router.delete('/plans/:planId', SubscriptionController.deletePlan);

export default router;