import { Router } from 'express';
import { SubscriptionController } from '../controllers/subscription.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';
import { requireAdmin } from '../middleware/admin.middleware.js';
import { validate } from '../middleware/validation.middleware.js';
import { createSubscriptionSchema, updateSubscriptionSchema } from '../dtos/subscription.dto.js';

const router = Router();

router.get('/plans', authenticateToken, SubscriptionController.getAllPlans);
router.get('/plans/:planId', authenticateToken, SubscriptionController.getPlan);
router.post('/plans', authenticateToken, requireAdmin, validate(createSubscriptionSchema), SubscriptionController.createPlan);
router.put('/plans/:planId', authenticateToken, requireAdmin, validate(updateSubscriptionSchema), SubscriptionController.updatePlan);
router.delete('/plans/:planId', authenticateToken, requireAdmin, SubscriptionController.deletePlan);

router.get('/user', authenticateToken, SubscriptionController.getUserSubscription);
router.put('/user', authenticateToken, SubscriptionController.updateUserSubscription);
router.delete('/user', authenticateToken, SubscriptionController.cancelSubscription);

export { router as subscriptionRoutes };