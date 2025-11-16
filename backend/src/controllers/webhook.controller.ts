import { Request, Response } from 'express';
import { WebSocketService } from '../services/websocket.service.js';
import { AIContent } from '../models/AIContent.js';
import { AIGenerationRequest } from '../models/AIGeneration.js';

export class WebhookController {
    static async handleGenerationProgress(req: Request, res: Response) {
        try {
            console.log(req.body);
            const { userId, contentId, progress, message } = req.body;
            console.log({ userId, contentId, progress, message });

            if (userId && contentId) {
                WebSocketService.emitToUser(userId, 'generation-progress', {
                    contentId,
                    progress,
                    message
                });
            }

            res.status(200).json({ success: true });
        } catch (error) {
            console.error('Error handling generation progress:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    static async handleVideoReady(req: Request, res: Response) {
        try {
            console.log(req.body);
            const { contentId, videoUrl } = req.body;
            console.log({ contentId, videoUrl });

            if (contentId) {
                const content = await AIContent.findById(contentId);
                if (content && videoUrl) {
                    await AIContent.findByIdAndUpdate(contentId, {
                        video_url: videoUrl,
                        status: 'ready'
                    });

                    WebSocketService.emitVideoReady(content.user_id.toString(), contentId, videoUrl);
                }
            }

            res.status(200).json({ success: true });
        } catch (error) {
            console.error('Error handling video ready:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    static async handleContentReady(req: Request, res: Response) {
        try {
            console.log(req.body);
            const { generationRequestId, content } = req.body;

            console.log({ generationRequestId, content });

            if (generationRequestId) {
                const generationRequest = await AIGenerationRequest.findById(generationRequestId);
                if (generationRequest) {
                    await AIGenerationRequest.findByIdAndUpdate(generationRequestId, {
                        status: 'completed',
                        result: content
                    });

                    WebSocketService.emitContentReady(generationRequest.user_id.toString());
                }
            }

            res.status(200).json({ success: true });
        } catch (error) {
            console.error('Error handling content ready:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
}