import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller.js';
import { validate } from '../middleware/validation.middleware.js';
import { authLimiter } from '../middleware/rateLimit.middleware.js';
import { authenticateToken } from '../middleware/auth.middleware.js';
import { loginSchema, registerSchema } from '../dtos/auth.dto.js';

const router = Router();

router.post('/register', authLimiter, validate(registerSchema), AuthController.register);
router.post('/login', authLimiter, validate(loginSchema), AuthController.login);
router.post('/logout', authenticateToken, AuthController.logout);
router.get('/profile', authenticateToken, AuthController.getProfile);

export { router as authRoutes };