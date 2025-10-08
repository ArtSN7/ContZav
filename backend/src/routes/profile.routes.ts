import { Router } from 'express';
import { ProfileController } from '../controllers/profile.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = Router();

router.use(authMiddleware);

router.get('/', ProfileController.getProfile);
router.put('/', ProfileController.updateProfile);
router.put('/password', ProfileController.changePassword);
router.get('/2fa', ProfileController.getTwoFactorSettings);
router.post('/2fa/enable', ProfileController.enableTwoFactor);
router.post('/2fa/disable', ProfileController.disableTwoFactor);
router.post('/verify-password', ProfileController.verifyPassword);
router.get('/sessions', ProfileController.getActiveSessions);
router.post('/sessions', ProfileController.createSession);
router.delete('/sessions/:sessionId', ProfileController.terminateSession);
router.delete('/sessions', ProfileController.terminateAllSessions);

export default router;