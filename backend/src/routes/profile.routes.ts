// import { Router } from 'express';
// import { ProfileController } from '../controllers/profile.controller.js';
// import { SubscriptionController } from '../controllers/subscription.controller.js';
// import { authMiddleware } from '../middleware/auth.middleware.js';

// const router = Router();

// router.use(authMiddleware);

// router.get('/', ProfileController.getProfile);
// router.put('/', ProfileController.updateProfile);
// router.put('/profile/password', ProfileController.changePassword);

// router.get('/profile/2fa', ProfileController.getTwoFactorSettings);
// router.post('/profile/2fa/enable', ProfileController.enableTwoFactor);
// router.post('/profile/2fa/disable', ProfileController.disableTwoFactor);

// router.get('/profile/sessions', ProfileController.getActiveSessions);
// router.delete('/profile/sessions/:sessionId', ProfileController.terminateSession);
// router.delete('/profile/sessions', ProfileController.terminateAllSessions);

// router.get('/subscription', SubscriptionController.getSubscription);
// router.get('/subscription/plans', SubscriptionController.getPlans);
// router.put('/subscription', SubscriptionController.updateSubscription);
// router.post('/subscription/cancel', SubscriptionController.cancelSubscription);
// router.get('/subscription/usage/:feature', SubscriptionController.checkUsage);

// export default router;