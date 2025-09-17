import { Router } from 'express';
import { AccountController } from '../controllers/account.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';

const router = Router();

router.get('/subscription', authenticateToken, AccountController.getSubscription);
router.put('/subscription', authenticateToken, AccountController.updateSubscription);

router.get('/payments', authenticateToken, AccountController.getPaymentHistory);
router.post('/payments', authenticateToken, AccountController.createPayment);

router.post('/social/sync', authenticateToken, AccountController.syncSocialAccounts);
router.put('/social/settings', authenticateToken, AccountController.updateSocialSettings);

export { router as accountRoutes };