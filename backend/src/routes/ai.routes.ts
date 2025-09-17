import { Router } from 'express';
import { AIController } from '../controllers/ai.controller';
import { authenticateToken } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validation.middleware.js';
import { generateNicheSchema, generateContentSchema, approveContentSchema, scheduleContentSchema } from '../dtos/ai.dto';

const router = Router();

router.post('/generate-questions', authenticateToken, validate(generateNicheSchema), AIController.generateNicheQuestions);
router.post('/generate-content', authenticateToken, validate(generateContentSchema), AIController.generateContent);
router.get('/content', authenticateToken, AIController.getUserContent);
router.get('/content/:contentId', authenticateToken, AIController.getContent);
router.post('/approve-content', authenticateToken, validate(approveContentSchema), AIController.approveContent);
router.post('/regenerate-content/:contentId', authenticateToken, AIController.regenerateContent);
router.post('/schedule-content', authenticateToken, validate(scheduleContentSchema), AIController.scheduleContent);
router.get('/download-content/:contentId', authenticateToken, AIController.downloadContent);

export { router as aiRoutes };