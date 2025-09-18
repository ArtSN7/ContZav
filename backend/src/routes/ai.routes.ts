import { Router } from 'express';
import { AIController } from '../controllers/ai.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validation.middleware.js';
import { generateNicheSchema, generateContentSchema, approveContentSchema, scheduleContentSchema } from '../dtos/ai.dto.js';

const router = Router();

// router.post('/generate-questions', authenticateToken, validate(generateNicheSchema), AIController.generateNicheQuestions);
// router.post('/generate-content', authenticateToken, validate(generateContentSchema), AIController.generateContent);
// router.get('/content', authenticateToken, AIController.getUserContent);
// router.get('/content/:contentId', authenticateToken, AIController.getContent);
// router.post('/approve-content', authenticateToken, validate(approveContentSchema), AIController.approveContent);
// router.post('/regenerate-content/:contentId', authenticateToken, AIController.regenerateContent);
// router.post('/schedule-content', authenticateToken, validate(scheduleContentSchema), AIController.scheduleContent);
// router.get('/download-content/:contentId', authenticateToken, AIController.downloadContent);

router.post('/generate-questions', AIController.generateNicheQuestions);
router.post('/generate-questions/mock', AIController.generateNicheQuestionsMock);
router.post('/generate-content', AIController.generateContent);
router.post('/generate-content/mock', AIController.generateContentMock);
router.get('/content', AIController.getUserContent);
router.get('/content/:contentId', AIController.getContent);
router.post('/approve-content', AIController.approveContent);
router.post('/regenerate-content/:contentId', AIController.regenerateContent);
router.post('/regenerate-content/:contentId/mock', AIController.regenerateContentMock);
router.post('/schedule-content', AIController.scheduleContent);
router.post('/schedule-content/mock', AIController.scheduleContentMock);
router.get('/download-content/:contentId', AIController.downloadContent);

export { router as aiRoutes };