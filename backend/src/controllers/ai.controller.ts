import { Request, Response } from 'express';
import { AIService } from '../services/ai.service.js';
import { AIContent } from '../models/AIContent.js';

export class AIController {
    /**
     * Попросить AI придумать вопросы по выбранной теме
     * @param req - Запрос с параметрами генерации вопросов
     * @param req.body.niche - Тема для контента (например, "Строительные материалы")
     * @param req.body.contentType - Тип контента: видео, текст или комбинированный
     * @param res - Ответ с подтверждением начала генерации
     * @returns {Object} Сообщение о начале генерации вопросов
     */
    static async generateNicheQuestions(req: Request, res: Response) {
        try {
            const userId = req.user!.id;
            const dto = req.body;

            await AIService.generateNicheQuestions(userId, dto);
            res.json({ message: 'Niche questions generation started' });
        } catch (error) {
            res.status(500).json({ error: 'Failed to generate niche questions' });
        }
    }

    /**
     * Тестовая версия генерации вопросов (для разработки)
     * Возвращает готовые вопросы без реального AI
     * @param req - Запрос с теми же параметрами, что и реальная генерация
     * @param res - Ответ с массивом сгенерированных вопросов
     * @returns {Object} Объект с массивом вопросов для тестирования
     */
    static async generateNicheQuestionsMock(req: Request, res: Response) {
        try {
            const userId = req.user!.id;
            const dto = req.body;

            const questions = await AIService.generateNicheQuestionsMock(userId, dto);
            res.json({ questions });
        } catch (error) {
            res.status(500).json({ error: 'Failed to generate niche questions' });
        }
    }

    /**
     * Создать готовый контент на основе выбранных вопросов
     * AI напишет сценарий для видео или готовый текст поста
     * @param req - Запрос с параметрами генерации контента
     * @param req.body.selectedQuestions - Массив вопросов для раскрытия в контенте
     * @param res - Ответ со сгенерированным контентом
     * @returns {Object} Созданный контент со сценарием или текстом
     */
    static async generateContent(req: Request, res: Response) {
        try {
            const userId = req.user!.id;
            const dto = req.body;

            const content = await AIService.generateContentScript(userId, dto);
            res.json(content);
        } catch (error) {
            res.status(500).json({ error: 'Failed to generate content' });
        }
    }

    /**
     * Тестовая версия генерации контента (для разработки)
     * @param req - Запрос с параметрами генерации
     * @param res - Ответ с тестовым контентом
     * @returns {Object} Тестовый контент без использования реального AI
     */
    static async generateContentMock(req: Request, res: Response) {
        try {
            const userId = req.user!.id;
            const dto = req.body;

            const content = await AIService.generateContentScriptMock(userId, dto);
            res.json(content);
        } catch (error) {
            res.status(500).json({ error: 'Failed to generate content' });
        }
    }

    /**
     * Получить конкретный созданный контент по его ID
     * @param req - Запрос с ID контента в параметрах URL
     * @param req.params.contentId - Уникальный идентификатор контента
     * @param res - Ответ с информацией о контенте
     * @returns {Object} Полная информация о контенте
     */
    static async getContent(req: Request, res: Response) {
        try {
            const { contentId } = req.params;
            const content = await AIService.getAIContentById(contentId);
            res.json(content);
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch content' });
        }
    }

    /**
     * Получить весь контент текущего пользователя
     * Список всех созданных видео, постов и черновиков
     * @param req - Запрос от авторизованного пользователя
     * @param res - Ответ с массивом контента пользователя
     * @returns {Object[]} Массив всего контента пользователя
     */
    static async getUserContent(req: Request, res: Response) {
        try {
            const userId = req.user!.id;
            const content = await AIService.getUserAIContent(userId);
            res.json(content);
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch user content' });
        }
    }

    /**
     * Одобрить или отклонить сгенерированный контент
     * Если не понравилось - можно попросить AI переделать
     * @param req - Запрос с решением по контенту
     * @param req.body.contentId - ID контента для одобрения/отклонения
     * @param req.body.approved - true если контент одобрен, false если отклонен
     * @param req.body.feedback - Текст с замечаниями для улучшения
     * @param res - Ответ с обновленной информацией о контенте
     * @returns {Object} Обновленный контент с новым статусом
     */
    static async approveContent(req: Request, res: Response) {
        try {
            const { contentId, approved, feedback } = req.body;
            const content = await AIService.approveContent(contentId, approved, feedback);
            res.json(content);
        } catch (error) {
            res.status(500).json({ error: 'Failed to approve content' });
        }
    }

    /**
     * Попросить AI переделать контент с учетом замечаний
     * Используется когда пользователь не одобрил первый вариант
     * @param req - Запрос с ID контента для перегенерации
     * @param req.params.contentId - ID контента который нужно перегенерировать
     * @param res - Ответ с подтверждением начала перегенерации
     * @returns {Object} Сообщение о начале перегенерации контента
     */
    static async regenerateContent(req: Request, res: Response) {
        try {
            const { contentId } = req.params;
            await AIService.regenerateContent(contentId);
            res.json({ message: 'Content regeneration started' });
        } catch (error) {
            res.status(500).json({ error: 'Failed to regenerate content' });
        }
    }

    /**
     * Тестовая версия перегенерации контента (для разработки)
     * @param req - Запрос с ID контента
     * @param res - Ответ с подтверждением завершения
     * @returns {Object} Сообщение о завершении перегенерации
     */
    static async regenerateContentMock(req: Request, res: Response) {
        try {
            const { contentId } = req.params;
            await AIService.regenerateContentMock(contentId);
            res.json({ message: 'Content regeneration completed' });
        } catch (error) {
            res.status(500).json({ error: 'Failed to regenerate content' });
        }
    }

    /**
     * Запланировать публикацию контента в социальных сетях
     * Выбрать дату, время и платформы для публикации
     * @param req - Запрос с параметрами планирования
     * @param req.body.contentId - ID контента для планирования
     * @param req.body.platforms - Массив платформ для публикации
     * @param req.body.publishDate - Дата и время публикации
     * @param res - Ответ с обновленной информацией о контенте
     * @returns {Object} Контент с установленным расписанием публикации
     */
    static async scheduleContent(req: Request, res: Response) {
        try {
            const { contentId, platforms, publishDate } = req.body;
            const content = await AIService.scheduleContent(contentId, platforms, new Date(publishDate));
            res.json(content);
        } catch (error) {
            res.status(500).json({ error: 'Failed to schedule content' });
        }
    }

    /**
     * Тестовая версия планирования публикации (для разработки)
     * @param req - Запрос с параметрами планирования
     * @param res - Ответ с тестовыми данными
     * @returns {Object} Тестовый контент с расписанием
     */
    static async scheduleContentMock(req: Request, res: Response) {
        try {
            const { contentId, platforms, publishDate } = req.body;
            const content = await AIService.scheduleContentMock(contentId, platforms, new Date(publishDate));
            res.json(content);
        } catch (error) {
            res.status(500).json({ error: 'Failed to schedule content' });
        }
    }

    /**
 * Скачать готовый контент
 * Для видео - ссылка на скачивание, для текста - текстовый файл
 * @param req - Запрос с ID контента для скачивания
 * @param req.params.contentId - ID контента который нужно скачать
 * @param res - Ответ с файлом для скачивания или ссылкой
 * @returns {Buffer|Object} Файл для скачивания или объект со ссылкой
 */
    static async downloadContent(req: Request, res: Response) {
        try {
            const { contentId } = req.params;
            const content = await AIContent.findById(contentId);

            if (!content) {
                return res.status(404).json({ error: 'Content not found' });
            }

            // Используем приведение типов
            const contentData = content as any;

            if (contentData.content_type === 'video' && contentData.video_url) {
                res.json({ downloadUrl: contentData.video_url });
            } else if (contentData.content) {
                res.setHeader('Content-Type', 'text/plain');
                res.setHeader('Content-Disposition', `attachment; filename=content-${contentId}.txt`);
                res.send(contentData.content);
            } else {
                res.status(404).json({ error: 'No content available for download' });
            }
        } catch (error) {
            res.status(500).json({ error: 'Failed to download content' });
        }
    }

    /**
     * Сгенерировать видео на основе текстового сценария
     * @param req - Запрос с ID контента для генерации видео
     * @param req.params.contentId - ID контента для генерации видео
     * @param res - Ответ с подтверждением начала генерации
     * @returns {Object} Сообщение о начале генерации видео
     */
    static async generateVideo(req: Request, res: Response) {
        try {
            const { contentId } = req.params;
            await AIService.generateVideo(contentId);
            res.json({ message: 'Video generation started' });
        } catch (error) {
            res.status(500).json({ error: 'Failed to generate video' });
        }
    }

    /**
     * Тестовая версия генерации видео (для разработки)
     * @param req - Запрос с ID контента
     * @param res - Ответ с подтверждением завершения
     * @returns {Object} Сообщение о завершении генерации видео
     */
    static async generateVideoMock(req: Request, res: Response) {
        try {
            const { contentId } = req.params;
            await AIService.generateVideoMock(contentId);
            res.json({ message: 'Video generation completed' });
        } catch (error) {
            res.status(500).json({ error: 'Failed to generate video' });
        }
    }
}