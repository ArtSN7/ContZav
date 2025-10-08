import { Request, Response } from 'express';
import { AIService } from '../services/ai.service.js';

export class WebhookController {
    /**
     * Обработать результат генерации контента от внешнего AI сервиса
     * @param req - Запрос с результатом генерации от AI сервиса
     * @param req.body.requestId - ID запроса на генерацию
     * @param req.body.status - Статус генерации: completed или failed
     * @param req.body.result - Результат генерации (текст, ссылка на видео и т.д.)
     * @param req.body.error - Ошибка генерации (если была)
     * @param res - Ответ с подтверждением получения результата
     * @returns {Object} Подтверждение обработки результата
     */
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

    /**
     * Обработать вебхук от социальных сетей о статусе публикации
     * @param req - Запрос с информацией о публикации
     * @param req.body.contentId - ID контента
     * @param req.body.platform - Платформа публикации
     * @param req.body.status - Статус публикации
     * @param req.body.publishedUrl - Ссылка на опубликованный контент
     * @param res - Ответ с подтверждением получения
     * @returns {Object} Подтверждение обработки
     */
    static async handlePublicationStatus(req: Request, res: Response) {
        try {
            const { contentId, platform, status, publishedUrl } = req.body;

            res.status(200).json({ success: true });
        } catch (error) {
            res.status(500).json({ error: 'Failed to process publication status' });
        }
    }
}