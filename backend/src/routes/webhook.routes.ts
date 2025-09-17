import { Router } from 'express';
import { WebhookController } from '../controllers/webhook.controller';

const router = Router();

router.post('/generation-result', WebhookController.handleGenerationResult);

export { router as webhookRoutes };