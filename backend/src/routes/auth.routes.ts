import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller.js';

const router = Router();

router.post('/refresh', AuthController.refreshToken);
router.post('/logout', AuthController.logout);

router.get('/google', AuthController.googleAuth);
router.get('/google/callback', AuthController.googleCallback);
router.get('/vk', AuthController.vkAuth);
router.get('/vk/callback', AuthController.vkCallback);
router.get('/yandex', AuthController.yandexAuth);
router.get('/yandex/callback', AuthController.yandexCallback);

export default router;