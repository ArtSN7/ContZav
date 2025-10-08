import { Request, Response, NextFunction } from 'express';
import { ContentService } from '../services/content.service.js';
import { AIService } from '../services/ai.service.js';
import { SocialService } from '../services/social.service.js';
import { AppError } from '../exceptions/AppError.js';

export class ContentController {
    /**
     * Создать новый контент вручную (без AI)
     * @param req - Запрос с данными для создания контента
     * @param req.body.title - Заголовок контента
     * @param req.body.content - Текст контента или URL медиа
     * @param req.body.content_type - Тип контента: post, story, reels, video
     * @param req.body.platform - Платформа для публикации
     * @param req.body.ai_content_id - ID AI контента (если создан через AI)
     * @param res - Ответ с созданным контентом
     * @param next - Функция next Express для обработки ошибок
     * @returns {Object} Созданный контент с ID и статусом
     */
    static async createContent(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            if (!req.user) throw new AppError('Unauthorized', 401);

            const contentData = {
                user_id: req.user.id,
                title: req.body.title,
                content: req.body.content,
                content_type: req.body.content_type,
                platform: req.body.platform,
                ai_content_id: req.body.ai_content_id
            };

            const content = await ContentService.createContent(contentData);

            res.json({
                success: true,
                data: content,
                message: 'Content created successfully',
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Опубликовать контент в выбранных социальных сетях
     * @param req - Запрос с параметрами публикации
     * @param req.body.contentId - ID контента для публикации
     * @param req.body.platforms - Массив платформ для публикации
     * @param req.body.scheduleDate - Дата публикации (если отложенная)
     * @param res - Ответ с результатом публикации
     * @param next - Функция next Express для обработки ошибок
     * @returns {Object} Статус публикации и ссылки на посты
     */
    static async publishContent(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            if (!req.user) throw new AppError('Unauthorized', 401);

            const { contentId, platforms, scheduleDate } = req.body;

            let content;
            if (scheduleDate) {
                content = await ContentService.scheduleContent(contentId, new Date(scheduleDate), platforms);
            } else {
                content = await ContentService.publishContent(contentId);
            }

            await SocialService.schedulePost(content, platforms, scheduleDate ? new Date(scheduleDate) : new Date());

            res.json({
                success: true,
                data: content,
                message: scheduleDate ? 'Content scheduled for publication' : 'Content published successfully',
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Получить список всего контента пользователя
     * @param req - Запрос с параметрами пагинации и фильтрации
     * @param req.query.page - Номер страницы (необязательно)
     * @param req.query.limit - Количество элементов на странице (необязательно)
     * @param req.query.status - Фильтр по статусу (черновик, опубликован и т.д.)
     * @param res - Ответ с массивом контента
     * @param next - Функция next Express для обработки ошибок
     * @returns {Object[]} Массив контента пользователя
     */
    static async getUserContent(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            if (!req.user) throw new AppError('Unauthorized', 401);

            const content = await ContentService.getUserContent(req.user.id);

            res.json({
                success: true,
                data: content,
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Обновить существующий контент
     * @param req - Запрос с ID контента и новыми данными
     * @param req.params.id - ID контента для обновления
     * @param req.body - Новые данные контента
     * @param res - Ответ с обновленным контентом
     * @param next - Функция next Express для обработки ошибок
     * @returns {Object} Обновленный контент
     */
    static async updateContent(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            if (!req.user) throw new AppError('Unauthorized', 401);

            const contentId = req.params.id;
            const updateData = req.body;

            const content = await ContentService.getContentById(contentId);

            if (content.user_id.toString() !== req.user.id) {
                throw new AppError('Access denied', 403);
            }

            const updatedContent = await ContentService.createContent({
                ...content.toObject(),
                ...updateData,
                user_id: req.user.id
            });

            res.json({
                success: true,
                data: updatedContent,
                message: 'Content updated successfully',
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Получить конкретный контент по ID
     * @param req - Запрос с ID контента
     * @param req.params.id - ID контента
     * @param res - Ответ с информацией о контенте
     * @param next - Функция next Express для обработки ошибок
     * @returns {Object} Информация о контенте
     */
    static async getContent(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            if (!req.user) throw new AppError('Unauthorized', 401);

            const contentId = req.params.id;
            const content = await ContentService.getContentById(contentId);

            if (content.user_id.toString() !== req.user.id) {
                throw new AppError('Access denied', 403);
            }

            res.json({
                success: true,
                data: content,
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Удалить контент
     * @param req - Запрос с ID контента для удаления
     * @param req.params.id - ID контента
     * @param res - Ответ с подтверждением удаления
     * @param next - Функция next Express для обработки ошибок
     * @returns {Object} Сообщение об успешном удалении
     */
    static async deleteContent(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            if (!req.user) throw new AppError('Unauthorized', 401);

            const contentId = req.params.id;
            const content = await ContentService.getContentById(contentId);

            if (content.user_id.toString() !== req.user.id) {
                throw new AppError('Access denied', 403);
            }

            await ContentService.deleteContent(contentId);

            res.json({
                success: true,
                message: 'Content deleted successfully',
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Обновить статус контента
     * @param req - Запрос с ID контента и новым статусом
     * @param req.params.id - ID контента
     * @param req.body.status - Новый статус контента
     * @param res - Ответ с обновленным контентом
     * @param next - Функция next Express для обработки ошибок
     * @returns {Object} Обновленный контент
     */
    static async updateContentStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            if (!req.user) throw new AppError('Unauthorized', 401);

            const contentId = req.params.id;
            const { status } = req.body;

            const content = await ContentService.getContentById(contentId);

            if (content.user_id.toString() !== req.user.id) {
                throw new AppError('Access denied', 403);
            }

            const updatedContent = await ContentService.updateContentStatus(contentId, status);

            res.json({
                success: true,
                data: updatedContent,
                message: 'Content status updated successfully',
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Запланировать публикацию контента
     * @param req - Запрос с параметрами планирования
     * @param req.params.id - ID контента
     * @param req.body.scheduleDate - Дата и время публикации
     * @param req.body.platforms - Массив платформ для публикации
     * @param res - Ответ с запланированным контентом
     * @param next - Функция next Express для обработки ошибок
     * @returns {Object} Контент с установленным расписанием
     */
    static async scheduleContent(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            if (!req.user) throw new AppError('Unauthorized', 401);

            const contentId = req.params.id;
            const { scheduleDate, platforms } = req.body;

            const content = await ContentService.getContentById(contentId);

            if (content.user_id.toString() !== req.user.id) {
                throw new AppError('Access denied', 403);
            }

            const scheduledContent = await ContentService.scheduleContent(contentId, new Date(scheduleDate), platforms);

            await SocialService.schedulePost(content, platforms, new Date(scheduleDate));

            res.json({
                success: true,
                data: scheduledContent,
                message: 'Content scheduled successfully',
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Создать контент на основе AI генерации
     * @param req - Запрос с параметрами для AI генерации
     * @param req.body.niche - Тема контента
     * @param req.body.content_type - Тип контента
     * @param req.body.platform - Платформа для публикации
     * @param req.body.selectedQuestions - Выбранные вопросы для генерации
     * @param res - Ответ с созданным контентом
     * @param next - Функция next Express для обработки ошибок
     * @returns {Object} Созданный AI контент
     */
    static async generateAIContent(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            if (!req.user) throw new AppError('Unauthorized', 401);

            const dto = {
                niche: req.body.niche,
                contentType: req.body.content_type,
                selectedQuestions: req.body.selectedQuestions
            };

            const aiContent = await AIService.generateContentScript(req.user.id, dto);

            const content = await ContentService.createContent({
                user_id: req.user.id,
                title: aiContent.title,
                content: aiContent.content,
                content_type: aiContent.content_type,
                platform: req.body.platform,
                ai_content_id: aiContent._id.toString()
            });

            res.json({
                success: true,
                data: content,
                message: 'AI content generated successfully',
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Получить контент по статусу
     * @param req - Запрос с фильтром по статусу
     * @param req.query.status - Статус контента для фильтрации
     * @param res - Ответ с отфильтрованным контентом
     * @param next - Функция next Express для обработки ошибок
     * @returns {Object[]} Массив контента с указанным статусом
     */
    static async getContentByStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            if (!req.user) throw new AppError('Unauthorized', 401);

            const { status } = req.query;
            const allContent = await ContentService.getUserContent(req.user.id);

            const filteredContent = allContent.filter(content => content.status === status);

            res.json({
                success: true,
                data: filteredContent,
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Получить статистику по контенту пользователя
     * @param req - Запрос от авторизованного пользователя
     * @param res - Ответ со статистикой контента
     * @param next - Функция next Express для обработки ошибок
     * @returns {Object} Статистика по контенту
     */
    static async getContentStats(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            if (!req.user) throw new AppError('Unauthorized', 401);

            const content = await ContentService.getUserContent(req.user.id);

            const stats = {
                total: content.length,
                draft: content.filter(c => c.status === 'draft').length,
                scheduled: content.filter(c => c.status === 'scheduled').length,
                published: content.filter(c => c.status === 'published').length,
                byPlatform: content.reduce((acc, curr) => {
                    acc[curr.platform] = (acc[curr.platform] || 0) + 1;
                    return acc;
                }, {} as Record<string, number>),
                byType: content.reduce((acc, curr) => {
                    acc[curr.content_type] = (acc[curr.content_type] || 0) + 1;
                    return acc;
                }, {} as Record<string, number>)
            };

            res.json({
                success: true,
                data: stats,
            });
        } catch (error) {
            next(error);
        }
    }
}