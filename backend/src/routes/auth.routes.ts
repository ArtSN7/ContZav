import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller.js';
import { validate } from '../middleware/validation.middleware.js';
import { authLimiter } from '../middleware/rateLimit.middleware.js';
import { authenticateToken } from '../middleware/auth.middleware.js';
import { loginSchema, registerSchema, oauthCallbackSchema } from '../dtos/auth.dto.js';

const router = Router();

router.post('/register', authLimiter, validate(registerSchema), AuthController.register);
router.post('/login', authLimiter, validate(loginSchema), AuthController.login);
router.post('/logout', authenticateToken, AuthController.logout);
router.get('/profile', AuthController.getProfileMock);
// router.get('/profile', authenticateToken, AuthController.getProfile); !! testing
router.post('/refresh', AuthController.refreshToken);

router.get('/google', AuthController.googleAuth);
router.get('/google/callback', AuthController.googleCallback);
router.get('/vk', AuthController.vkAuth);
router.get('/vk/callback', AuthController.vkCallback);
router.get('/apple', AuthController.appleAuth);
router.post('/apple/callback', AuthController.appleCallback);

export { router as authRoutes };