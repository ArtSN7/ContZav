import { Router } from 'express';
import { AIController } from '../controllers/ai.controller.js';
import { AvatarController } from '../controllers/avatar.controller.js';
import { ApiKeysController } from '../controllers/apiKeys.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = Router();

router.use(authMiddleware);

router.post('/questions', AIController.generateNicheQuestions);
router.post('/content', AIController.generateContent);
router.post('/transcribe/tiktok', AIController.transcribeTikTok);
router.post('/transcribe/instagram', AIController.transcribeInstagram);
router.post('/content/:contentId/video-with-avatar', AIController.generateVideoWithAvatar);
router.post('/content/:contentId/regenerate', AIController.regenerateContent);
router.post('/content/:contentId/video', AIController.generateVideo);
router.post('/content/approve', AIController.approveContent);
router.post('/content/schedule', AIController.scheduleContent);
router.get('/content', AIController.getUserContent);
router.get('/content/:contentId', AIController.getContent);
router.get('/content/:contentId/video-preview', AIController.getVideoPreview);
router.get('/content/:contentId/download', AIController.downloadContent);
router.get('/competitors', AIController.getCompetitors);
router.post('/competitors', AIController.addCompetitor);
router.delete('/competitors/:competitorId', AIController.removeCompetitor);

router.get('/avatars', AvatarController.getAvatars);
router.post('/avatars', AvatarController.createAvatar);
router.delete('/avatars/:avatarId', AvatarController.deleteAvatar);

router.get('/api-keys', ApiKeysController.getApiKeys);
router.put('/api-keys', ApiKeysController.updateApiKeys);

export default router;