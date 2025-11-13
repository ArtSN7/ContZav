import { Request, Response } from 'express';
import { AIService } from '../services/ai.service.js';
import { logger } from '../utils/logger.js';

export class WebhookController {
    static async handleGenerationResult(req: Request, res: Response) {
        try {
            const { requestId, result, error } = req.body;

            logger.info(`Received generation result for request ${requestId}`, { result, error });

            await AIService.handleGenerationResult(requestId, result, error);

            res.json({
                success: true,
                message: 'Generation result processed successfully'
            });
        } catch (error: any) {
            logger.error('Error handling generation result:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to process generation result'
            });
        }
    }

    static async handlePublicationStatus(req: Request, res: Response) {
        try {
            const { contentId, status, error } = req.body;

            logger.info(`Received publication status for content ${contentId}`, { status, error });

            res.json({
                success: true,
                message: 'Publication status processed successfully'
            });
        } catch (error: any) {
            logger.error('Error handling publication status:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to process publication status'
            });
        }
    }
}