import { Request, Response } from 'express';
import { AIService } from '../services/ai.service.js';

export class WebhookController {
    static async handleGenerationResult(req: Request, res: Response) {
        try {
            const { requestId, status, result, error } = req.body;

            if (status === 'completed') {
                await AIService.handleGenerationResult(requestId, result);
            } else if (status === 'failed') {
                await AIService.handleGenerationResult(requestId, null, error);
            }

            res.status(200).json({ success: true });
        } catch (error) {
            res.status(500).json({ error: 'Failed to process generation result' });
        }
    }
}