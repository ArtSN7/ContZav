import { Router } from 'express';
import { WebhookController } from '../controllers/webhook.controller.js';

const router = Router();


router.post('/webhook/generation-progress', WebhookController.handleGenerationProgress);
router.post('/webhook/video-ready', WebhookController.handleVideoReady);
router.post('/webhook/content-ready', WebhookController.handleContentReady);

export default router;