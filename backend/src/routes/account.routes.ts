import { Router } from 'express';
import { AccountController } from '../controllers/account.controller.js';
import { ProfileController } from '../controllers/profile.controller.js';
import { SubscriptionController } from '../controllers/subscription.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = Router();

router.use(authMiddleware);

// Profile routes
router.get('/profile', ProfileController.getProfile);
router.put('/profile', ProfileController.updateProfile);
router.put('/profile/password', ProfileController.changePassword);

// 2FA routes
router.get('/profile/2fa', ProfileController.getTwoFactorSettings);
router.post('/profile/2fa/enable', ProfileController.enableTwoFactor);
router.post('/profile/2fa/disable', ProfileController.disableTwoFactor);

// Sessions routes
router.get('/profile/sessions', ProfileController.getActiveSessions);
router.delete('/profile/sessions/:sessionId', ProfileController.terminateSession);
router.delete('/profile/sessions', ProfileController.terminateAllSessions);

// Social accounts routes
router.get('/social/accounts', AccountController.getSocialAccounts);
router.post('/social/accounts/:platform/connect', AccountController.connectSocialAccount);
router.post('/social/accounts/:platform/disconnect', AccountController.disconnectSocialAccount);
router.post('/social/accounts/:platform/sync', AccountController.syncSocialAccount);
router.put('/social/accounts/:platform/settings', AccountController.updateSocialSettings);

// Subscription routes (в рамках account)
router.get('/subscription', SubscriptionController.getSubscription);
router.get('/subscription/plans', SubscriptionController.getPlans);
router.put('/subscription', SubscriptionController.updateSubscription);
router.post('/subscription/cancel', SubscriptionController.cancelSubscription);
router.get('/subscription/usage/:feature', SubscriptionController.checkUsage);

export default router;