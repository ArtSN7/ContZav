import { Request, Response } from 'express';
import { AIService } from '../services/ai.service.js';
import { GenerateNicheDto, GenerateQuestionsDto, GenerateContentDto, ApproveContentDto, ScheduleContentDto } from '../dtos/ai.dto.js';
import { AIContentModel } from '../models/AIContent.js';

export class AIController {
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

    static async getContent(req: Request, res: Response) {
        try {
            const { contentId } = req.params;
            const content = await AIContentModel.findById(contentId);
            res.json(content);
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch content' });
        }
    }

    static async getUserContent(req: Request, res: Response) {
        try {
            const userId = req.user!.id;
            const content = await AIContentModel.findByUserId(userId);
            res.json(content);
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch user content' });
        }
    }

    static async approveContent(req: Request, res: Response) {
        try {
            const dto: ApproveContentDto = req.body;
            const content = await AIService.approveContent(dto.contentId, dto.approved, dto.feedback);
            res.json(content);
        } catch (error) {
            res.status(500).json({ error: 'Failed to approve content' });
        }
    }

    static async regenerateContent(req: Request, res: Response) {
        try {
            const { contentId } = req.params;
            await AIService.regenerateContent(contentId);
            res.json({ message: 'Content regeneration started' });
        } catch (error) {
            res.status(500).json({ error: 'Failed to regenerate content' });
        }
    }

    static async regenerateContentMock(req: Request, res: Response) {
        try {
            const { contentId } = req.params;
            await AIService.regenerateContentMock(contentId);
            res.json({ message: 'Content regeneration completed' });
        } catch (error) {
            res.status(500).json({ error: 'Failed to regenerate content' });
        }
    }

    static async scheduleContent(req: Request, res: Response) {
        try {
            const dto: ScheduleContentDto = req.body;
            const content = await AIService.scheduleContent(dto.contentId, dto.platforms, new Date(dto.publishDate!));
            res.json(content);
        } catch (error) {
            res.status(500).json({ error: 'Failed to schedule content' });
        }
    }

    static async scheduleContentMock(req: Request, res: Response) {
        try {
            const dto: ScheduleContentDto = req.body;
            const content = await AIService.scheduleContentMock(dto.contentId, dto.platforms, new Date(dto.publishDate!));
            res.json(content);
        } catch (error) {
            res.status(500).json({ error: 'Failed to schedule content' });
        }
    }

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