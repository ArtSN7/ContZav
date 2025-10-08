import { Request, Response } from 'express';
import { AIService } from '../services/ai.service.js';
import { GenerateNicheDto, GenerateQuestionsDto, GenerateContentDto, ApproveContentDto, ScheduleContentDto } from '../dtos/ai.dto.js';
import { AIContentModel } from '../models/AIContent.js';

/**
 * Контроллер для управления AI-генерацией контента
 * От создания идей до готовых видео и текстов
 */
export class AIController {
    /**
    * Попросить AI придумать вопросы по выбранной теме
    * req - Запрос с параметрами генерации вопросов
    * req.body.niche - Тема для контента (например, "Строительные материалы")
    * req.body.contentType - Тип контента: видео, текст или комбинированный
    * res - Ответ с подтверждением начала генерации
    * {Object} - Сообщение о начале генерации вопросов
    */
    static async generateNicheQuestions(req: Request, res: Response) {
        try {
            const userId = req.user!.id;
            const dto: GenerateNicheDto = req.body;

            await AIService.generateNicheQuestions(userId, dto);
            res.json({ message: 'Niche questions generation started' });
        } catch (error) {
            res.status(500).json({ error: 'Failed to generate niche questions' });
        }
    }

    /**
  * Тестовая версия генерации вопросов (для разработки)
  * Возвращает готовые вопросы без реального AI
  * req - Запрос с теми же параметрами, что и реальная генерация
  * res - Ответ с массивом сгенерированных вопросов
  * {Object} - Объект с массивом вопросов для тестирования
  */
    static async generateNicheQuestionsMock(req: Request, res: Response) {
        try {
            const userId = "req.user!.id";
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
   * req - Запрос с параметрами генерации контента
   * req.body.selectedQuestions - Массив вопросов для раскрытия в контенте
   * res - Ответ со сгенерированным контентом
   * {AIContent} - Созданный контент со сценарием или текстом
   */
    static async generateContent(req: Request, res: Response) {
        try {
            const userId = req.user!.id;
            const dto: GenerateContentDto = req.body;

            const content = await AIService.generateContentScript(userId, dto);
            res.json(content);
        } catch (error) {
            res.status(500).json({ error: 'Failed to generate content' });
        }
    }

    /**
 * Тестовая версия генерации контента (для разработки)
 * req - Запрос с параметрами генерации
 * res - Ответ с тестовым контентом
 * {AIContent} - Тестовый контент без использования реального AI
 */
    static async generateContentMock(req: Request, res: Response) {
        try {
            const userId = req.user!.id;
            const dto: GenerateContentDto = req.body;

            const content = await AIService.generateContentScriptMock(userId, dto);
            res.json(content);
        } catch (error) {
            res.status(500).json({ error: 'Failed to generate content' });
        }
    }

    /**
   * Получить конкретный созданный контент по его ID
   * req - Запрос с ID контента в параметрах URL
   * req.params.contentId - Уникальный идентификатор контента
   * res - Ответ с информацией о контенте
   * {AIContent} - Полная информация о контенте
   */
    static async getContent(req: Request, res: Response) {
        try {
            const { contentId } = req.params;
            const content = await AIContentModel.findById(contentId);
            res.json(content);
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch content' });
        }
    }

    /**
  * Получить весь контент текущего пользователя
  * Список всех созданных видео, постов и черновиков
  * req - Запрос от авторизованного пользователя
  * res - Ответ с массивом контента пользователя
  * {AIContent[]} - Массив всего контента пользователя
  */
    static async getUserContent(req: Request, res: Response) {
        try {
            const userId = req.user!.id;
            const content = await AIContentModel.findByUserId(userId);
            res.json(content);
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch user content' });
        }
    }

    /**
  * Одобрить или отклонить сгенерированный контент
  * Если не понравилось - можно попросить AI переделать
  * req - Запрос с решением по контенту
  * req.body.approved - true если контент одобрен, false если отклонен
  * req.body.feedback - Текст с замечаниями для улучшения
  * res - Ответ с обновленной информацией о контенте
  * {AIContent} - Обновленный контент с новым статусом
  */
    static async approveContent(req: Request, res: Response) {
        try {
            const dto: ApproveContentDto = req.body;
            const content = await AIService.approveContent(dto.contentId, dto.approved, dto.feedback);
            res.json(content);
        } catch (error) {
            res.status(500).json({ error: 'Failed to approve content' });
        }
    }

    /**
  * Попросить AI переделать контент с учетом замечаний
  * Используется когда пользователь не одобрил первый вариант
  * req - Запрос с ID контента для перегенерации
  * req.params.contentId - ID контента который нужно перегенерировать
  * res - Ответ с подтверждением начала перегенерации
  * {Object} - Сообщение о начале перегенерации контента
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
 * req - Запрос с ID контента
 * res - Ответ с подтверждением завершения
 * {Object} - Сообщение о завершении перегенерации
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
 * req - Запрос с параметрами планирования
 * req.body.platforms - Массив платформ для публикации
 * req.body.publishDate - Дата и время публикации
 * res - Ответ с обновленной информацией о контенте
 * {AIContent} - Контент с установленным расписанием публикации
 */
    static async scheduleContent(req: Request, res: Response) {
        try {
            const dto: ScheduleContentDto = req.body;
            const content = await AIService.scheduleContent(dto.contentId, dto.platforms, new Date(dto.publishDate!));
            res.json(content);
        } catch (error) {
            res.status(500).json({ error: 'Failed to schedule content' });
        }
    }

    /**
 * Тестовая версия планирования публикации (для разработки)
 * req - Запрос с параметрами планирования
 * res - Ответ с тестовыми данными
 * {AIContent} - Тестовый контент с расписанием
 */
    static async scheduleContentMock(req: Request, res: Response) {
        try {
            const dto: ScheduleContentDto = req.body;
            const content = await AIService.scheduleContentMock(dto.contentId, dto.platforms, new Date(dto.publishDate!));
            res.json(content);
        } catch (error) {
            res.status(500).json({ error: 'Failed to schedule content' });
        }
    }

    /**
  * Скачать готовый контент
  * Для видео - ссылка на скачивание, для текста - текстовый файл
  * req - Запрос с ID контента для скачивания
  * req.params.contentId - ID контента который нужно скачать
  * res - Ответ с файлом для скачивания или ссылкой
  * {Buffer|Object} - Файл для скачивания или объект со ссылкой
  */
    static async downloadContent(req: Request, res: Response) {
        try {
            const { contentId } = req.params;
            const content = await AIContentModel.findById(contentId);

            if (content.content_type === 'video' && content.video_url) {
                res.json({ downloadUrl: content.video_url });
            } else if (content.text_content) {
                res.setHeader('Content-Type', 'text/plain');
                res.setHeader('Content-Disposition', `attachment; filename=content-${contentId}.txt`);
                res.send(content.text_content);
            } else {
                res.status(404).json({ error: 'No content available for download' });
            }
        } catch (error) {
            res.status(500).json({ error: 'Failed to download content' });
        }
    }
}