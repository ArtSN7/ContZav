import { Request, Response, NextFunction } from 'express';
import { ContentService } from '../services/content.service.js';
import { AIService } from '../services/ai.service.js';
import { SocialService } from '../services/social.service.js';
import { AppError } from '../exceptions/AppError.js';

export class ContentController {
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

    static async generateAIContent(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            if (!req.user) throw new AppError('Unauthorized', 401);

            const dto = {
                niche: req.body.niche,
                contentType: req.body.content_type,
                selectedQuestions: req.body.selectedQuestions
            };

            const aiContent = await AIService.generateContentScriptMock(req.user.id, dto);

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

    static async downloadContentPackage(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            if (!req.user) throw new AppError('Unauthorized', 401);

            const { contentIds, format } = req.body;

            const mockDownloadUrl = `/api/content/download/${Date.now()}.zip`;

            res.json({
                success: true,
                data: {
                    downloadUrl: mockDownloadUrl,
                    format: format || 'zip',
                    contentCount: contentIds?.length || 0
                }
            });
        } catch (error) {
            next(error);
        }
    }
}