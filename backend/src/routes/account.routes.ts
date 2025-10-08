import { Router } from 'express';
import { AccountController } from '../controllers/account.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = Router();

router.use(authMiddleware);

router.get('/subscription', AccountController.getSubscription);
router.put('/subscription', AccountController.updateSubscription);
router.get('/payments', AccountController.getPaymentHistory);
router.post('/payments', AccountController.createPayment);
router.post('/social/sync', AccountController.syncSocialAccounts);
router.put('/social/settings', AccountController.updateSocialSettings);

export default router;