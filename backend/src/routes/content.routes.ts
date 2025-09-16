import { Router } from 'express';
import { ContentController } from '../controllers/content.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validation.middleware.js';
import { contentCreationSchema, contentUpdateSchema } from '../dtos/content.dto.js';

const router = Router();

router.post('/generate', authenticateToken, validate(contentCreationSchema), ContentController.generateContent);
router.post('/publish', authenticateToken, ContentController.publishContent);
router.get('/list', authenticateToken, ContentController.getUserContent);
router.put('/:id', authenticateToken, validate(contentUpdateSchema), ContentController.updateContent);

export { router as contentRoutes };