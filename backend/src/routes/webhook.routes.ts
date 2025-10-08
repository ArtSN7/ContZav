import { Router } from 'express';
import { WebhookController } from '../controllers/webhook.controller.js';

const router = Router();

router.post('/generation-result', WebhookController.handleGenerationResult);
router.post('/publication-status', WebhookController.handlePublicationStatus);

export default router;