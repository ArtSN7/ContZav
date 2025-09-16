import { Router } from 'express';
import { ProfileController } from '../controllers/profile.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';

const router = Router();

router.put('/', authenticateToken, ProfileController.updateProfile);
router.post('/social/connect', authenticateToken, ProfileController.connectSocialAccount);
router.post('/social/disconnect', authenticateToken, ProfileController.disconnectSocialAccount);

export { router as profileRoutes };