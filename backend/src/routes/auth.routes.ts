import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = Router();

router.post('/login', AuthController.login);
router.post('/register', AuthController.register);
router.post('/refresh', AuthController.refreshToken);
router.get('/profile/mock', AuthController.getProfileMock);

router.use(authMiddleware);

router.get('/profile', AuthController.getProfile);
router.post('/logout', AuthController.logout);
router.get('/google', AuthController.googleAuth);
router.get('/google/callback', AuthController.googleCallback);
router.get('/vk', AuthController.vkAuth);
router.get('/vk/callback', AuthController.vkCallback);
router.get('/apple', AuthController.appleAuth);
router.post('/apple/callback', AuthController.appleCallback);

export default router;