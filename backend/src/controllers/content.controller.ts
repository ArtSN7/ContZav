import { Request, Response, NextFunction } from 'express';
import { ContentModel } from '../models/Content.js';
import { AIService } from '../services/ai.service.js';
import { SocialService } from '../services/social.service.js';
import { AppError } from '../exceptions/AppError.js';
import { contentCreationSchema, contentUpdateSchema } from '../dtos/content.dto.js';

export class ContentController {
    static async generateContent(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            if (!req.user) throw new AppError('Unauthorized', 401);

            const validatedData = contentCreationSchema.parse(req.body);

            let generatedContent: string;
            if (validatedData.contentType === 'video') {
                generatedContent = await AIService.generateScript(
                    validatedData.title,
                    validatedData.niche
                );
            } else {
                generatedContent = await AIService.generatePost(
                    validatedData.title,
                    validatedData.niche,
                    validatedData.platforms[0]
                );
            }

            const content = await ContentModel.create({
                user_id: req.user.id,
                title: validatedData.title,
                description: validatedData.description,
                niche: validatedData.niche,
                content_type: validatedData.contentType,
                generated_content: generatedContent,
                platforms: validatedData.platforms,
                tags: validatedData.tags,
                status: 'draft',
            });

            res.json({
                success: true,
                data: content,
                message: 'Content generated successfully',
            });
        } catch (error) {
            next(error);
        }
    }

    static async publishContent(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            if (!req.user) throw new AppError('Unauthorized', 401);

            const { contentId, platforms, scheduleDate } = req.body;
            const content = await ContentModel.updateStatus(contentId, 'scheduled');

            if (scheduleDate) {
                await SocialService.schedulePost(content, platforms, new Date(scheduleDate));
            } else {
                await SocialService.schedulePost(content, platforms, new Date());
            }

            res.json({
                success: true,
                message: 'Content scheduled for publication',
            });
        } catch (error) {
            next(error);
        }
    }

    static async getUserContent(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            if (!req.user) throw new AppError('Unauthorized', 401);

            const content = await ContentModel.findByUserId(req.user.id);
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

            const validatedData = contentUpdateSchema.parse(req.body);
            const content = await ContentModel.updateStatus(req.params.id, 'draft');

            res.json({
                success: true,
                data: content,
                message: 'Content updated successfully',
            });
        } catch (error) {
            next(error);
        }
    }
}
