import { Request, Response } from 'express';
import { AIService } from '../services/ai.service.js';

/**
 * Контроллер для обработки вебхуков от внешних сервисов
 * Получает результаты генерации контента от AI сервисов
 */
export class WebhookController {
    /**
   * Обработать результат генерации контента от внешнего AI сервиса
   * req - Запрос с результатом генерации от AI сервиса
   * req.body.requestId - ID запроса на генерацию
   * req.body.result - Результат генерации (текст, ссылка на видео и т.д.)
   * req.body.error - Ошибка генерации (если была)
   * res - Ответ с подтверждением получения результата
   * {Object} - Подтверждение обработки результата
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
}