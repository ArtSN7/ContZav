import { Router } from 'express';
import { ProfileController } from '../controllers/profile.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validation.middleware.js';
import { updateProfileSchema, changePasswordSchema, enableTwoFactorSchema } from '../dtos/profile.dto.js';

const router = Router();

router.get('/', authenticateToken, ProfileController.getProfile);
router.put('/', authenticateToken, validate(updateProfileSchema), ProfileController.updateProfile);
router.post('/change-password', authenticateToken, validate(changePasswordSchema), ProfileController.changePassword);
router.post('/verify-password', authenticateToken, ProfileController.verifyPassword);

router.get('/two-factor', authenticateToken, ProfileController.getTwoFactorSettings);
router.post('/two-factor/enable', authenticateToken, validate(enableTwoFactorSchema), ProfileController.enableTwoFactor);
router.post('/two-factor/disable', authenticateToken, ProfileController.disableTwoFactor);

router.get('/sessions', authenticateToken, ProfileController.getActiveSessions);
router.delete('/sessions/:sessionId', authenticateToken, ProfileController.terminateSession);
router.delete('/sessions', authenticateToken, ProfileController.terminateAllSessions);

export { router as profileRoutes };