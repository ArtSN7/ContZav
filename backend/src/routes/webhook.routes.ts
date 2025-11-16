import { Router } from 'express';
import { WebhookController } from '../controllers/webhook.controller.js';

const router = Router();

router.post('/generation-progress', WebhookController.handleGenerationProgress);
router.post('/video-ready', WebhookController.handleVideoReady);
router.post('/content-ready', WebhookController.handleContentReady);

export default router;