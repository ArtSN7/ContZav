import { Router } from 'express';
import { ContentController } from '../controllers/content.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = Router();

router.use(authMiddleware);

router.post('/', ContentController.createContent);
router.get('/', ContentController.getUserContent);
router.get('/stats', ContentController.getContentStats);
router.get('/status', ContentController.getContentByStatus);
router.post('/generate-ai', ContentController.generateAIContent);
router.post('/download-package', ContentController.downloadContentPackage);
router.post('/:id/publish', ContentController.publishContent);
router.post('/:id/schedule', ContentController.scheduleContent);
router.put('/:id', ContentController.updateContent);
router.put('/:id/status', ContentController.updateContentStatus);
router.get('/:id', ContentController.getContent);
router.delete('/:id', ContentController.deleteContent);

export default router;