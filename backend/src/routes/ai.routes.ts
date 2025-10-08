import { Router } from 'express';
import { AIController } from '../controllers/ai.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = Router();

router.use(authMiddleware);

router.post('/questions', AIController.generateNicheQuestions);
router.post('/questions/mock', AIController.generateNicheQuestionsMock);
router.post('/content', AIController.generateContent);
router.post('/content/mock', AIController.generateContentMock);
router.post('/content/:contentId/regenerate', AIController.regenerateContent);
router.post('/content/:contentId/regenerate/mock', AIController.regenerateContentMock);
router.post('/content/:contentId/video', AIController.generateVideo);
router.post('/content/:contentId/video/mock', AIController.generateVideoMock);
router.post('/content/approve', AIController.approveContent);
router.post('/content/schedule', AIController.scheduleContent);
router.post('/content/schedule/mock', AIController.scheduleContentMock);
router.get('/content', AIController.getUserContent);
router.get('/content/:contentId', AIController.getContent);
router.get('/content/:contentId/download', AIController.downloadContent);

export default router;