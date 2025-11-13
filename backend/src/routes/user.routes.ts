import { Router } from 'express';
import { UserController } from '../controllers/user.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = Router();

router.use(authMiddleware);

router.get('/profile', UserController.getProfile);
router.put('/profile', UserController.updateProfile);

router.get('/social-accounts', UserController.getSocialAccounts);
router.post('/social-accounts/connect/:platform', UserController.connectSocialAccount);
router.delete('/social-accounts/disconnect/:platform', UserController.disconnectSocialAccount);
router.post('/social-accounts/sync/:platform', UserController.syncSocialAccount);
router.put('/social-accounts/settings/:platform', UserController.updateSocialSettings);

router.get('/sessions', UserController.getActiveSessions);
router.delete('/sessions/:sessionId', UserController.terminateSession);
router.delete('/sessions', UserController.terminateAllSessions);

router.get('/two-factor', UserController.getTwoFactorStatus);
router.post('/two-factor/enable', UserController.enableTwoFactor);
router.post('/two-factor/disable', UserController.disableTwoFactor);

export default router;