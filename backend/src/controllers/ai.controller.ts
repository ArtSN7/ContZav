import { Request, Response } from 'express';
import { AIService } from '../services/ai.service.js';
import { AIContent } from '../models/AIContent.js';

export class AIController {
    static async generateNicheQuestions(req: Request, res: Response) {
        try {
            const userId = "req.user!.id";
            // const userId = req.user!.id;
            const dto = req.body;

            const questions = await AIService.generateNicheQuestions(userId, dto);

            res.json({
                success: true,
                data: { questions },
                message: 'Questions generated successfully'
            });
        } catch (error: any) {
            console.error('Error generating questions:', error);
            res.status(500).json({
                success: false,
                error: error.message || 'Failed to generate niche questions'
            });
        }
    }

    static async generateContent(req: Request, res: Response) {
        try {
            const userId = req.user!.id;
            const dto = req.body;

            const content = await AIService.generateContentScript(userId, dto);

            res.json({
                success: true,
                data: {
                    script: content.content,
                    video_url: content.video_url
                },
                message: 'Content generated successfully'
            });
        } catch (error: any) {
            console.error('Error generating content:', error);
            res.status(500).json({
                success: false,
                error: error.message || 'Failed to generate content'
            });
        }
    }

    static async generateVideoWithAvatar(req: Request, res: Response) {
        try {
            const { contentId } = req.params;
            const { avatarId } = req.body;

            await AIService.generateVideoWithAvatar(contentId, avatarId);

            res.json({
                success: true,
                message: 'Video generation with avatar started'
            });
        } catch (error: any) {
            console.error('Error generating video with avatar:', error);
            res.status(500).json({
                success: false,
                error: error.message || 'Failed to generate video with avatar'
            });
        }
    }

    static async transcribeTikTok(req: Request, res: Response) {
        try {
            const userId = req.user!.id;
            const { tiktokId } = req.body;

            const transcription = await AIService.transcribeTikTok(userId, tiktokId);

            res.json({
                success: true,
                data: transcription,
                message: 'TikTok transcription completed'
            });
        } catch (error: any) {
            console.error('Error transcribing TikTok:', error);
            res.status(500).json({
                success: false,
                error: error.message || 'Failed to transcribe TikTok'
            });
        }
    }

    static async transcribeInstagram(req: Request, res: Response) {
        try {
            const userId = req.user!.id;
            const { instaId } = req.body;

            const transcription = await AIService.transcribeInstagram(userId, instaId);

            res.json({
                success: true,
                data: transcription,
                message: 'Instagram transcription completed'
            });
        } catch (error: any) {
            console.error('Error transcribing Instagram:', error);
            res.status(500).json({
                success: false,
                error: error.message || 'Failed to transcribe Instagram'
            });
        }
    }

    static async getVideoPreview(req: Request, res: Response) {
        try {
            const { contentId } = req.params;
            const videoData = await AIService.getAIContentWithVideo(contentId);

            res.json({
                success: true,
                data: videoData
            });
        } catch (error: any) {
            console.error('Error fetching video preview:', error);
            res.status(500).json({
                success: false,
                error: error.message || 'Failed to fetch video preview'
            });
        }
    }

    static async getContent(req: Request, res: Response) {
        try {
            const { contentId } = req.params;
            const content = await AIService.getAIContentById(contentId);

            res.json({
                success: true,
                data: content
            });
        } catch (error: any) {
            console.error('Error fetching content:', error);
            res.status(500).json({
                success: false,
                error: error.message || 'Failed to fetch content'
            });
        }
    }

    static async getUserContent(req: Request, res: Response) {
        try {
            const userId = req.user!.id;
            const content = await AIService.getUserAIContent(userId);

            res.json({
                success: true,
                data: content
            });
        } catch (error: any) {
            console.error('Error fetching user content:', error);
            res.status(500).json({
                success: false,
                error: error.message || 'Failed to fetch user content'
            });
        }
    }

    static async approveContent(req: Request, res: Response) {
        try {
            const { contentId, approved, feedback } = req.body;
            const content = await AIService.approveContent(contentId, approved, feedback);

            res.json({
                success: true,
                data: content,
                message: 'Content approved successfully'
            });
        } catch (error: any) {
            console.error('Error approving content:', error);
            res.status(500).json({
                success: false,
                error: error.message || 'Failed to approve content'
            });
        }
    }

    static async regenerateContent(req: Request, res: Response) {
        try {
            const { contentId } = req.params;
            await AIService.regenerateContent(contentId);

            res.json({
                success: true,
                message: 'Content regeneration completed'
            });
        } catch (error: any) {
            console.error('Error regenerating content:', error);
            res.status(500).json({
                success: false,
                error: error.message || 'Failed to regenerate content'
            });
        }
    }

    static async scheduleContent(req: Request, res: Response) {
        try {
            const { contentId, platforms, publishDate } = req.body;
            const content = await AIService.scheduleContent(contentId, platforms, new Date(publishDate));

            res.json({
                success: true,
                data: content,
                message: 'Content scheduled successfully'
            });
        } catch (error: any) {
            console.error('Error scheduling content:', error);
            res.status(500).json({
                success: false,
                error: error.message || 'Failed to schedule content'
            });
        }
    }

    static async downloadContent(req: Request, res: Response) {
        try {
            const { contentId } = req.params;
            const content = await AIContent.findById(contentId);

            if (!content) {
                return res.status(404).json({
                    success: false,
                    error: 'Content not found'
                });
            }

            const contentData = content as any;

            if (contentData.content_type === 'video' && contentData.video_url) {
                res.json({
                    success: true,
                    data: { downloadUrl: contentData.video_url }
                });
            } else if (contentData.content) {
                res.setHeader('Content-Type', 'text/plain');
                res.setHeader('Content-Disposition', `attachment; filename=content-${contentId}.txt`);
                res.send(contentData.content);
            } else {
                res.status(404).json({
                    success: false,
                    error: 'No content available for download'
                });
            }
        } catch (error: any) {
            console.error('Error downloading content:', error);
            res.status(500).json({
                success: false,
                error: error.message || 'Failed to download content'
            });
        }
    }

    static async generateVideo(req: Request, res: Response) {
        try {
            const { contentId } = req.params;
            const content = await AIContent.findById(contentId);

            if (!content) {
                return res.status(404).json({
                    success: false,
                    error: 'Content not found'
                });
            }

            const avatars = await AIService.getUserAvatars(content.user_id.toString());
            if (avatars.length === 0) {
                return res.status(400).json({
                    success: false,
                    error: 'No avatars available for video generation'
                });
            }

            await AIService.generateVideoWithAvatar(contentId, avatars[0]._id.toString());

            res.json({
                success: true,
                message: 'Video generation started'
            });
        } catch (error: any) {
            console.error('Error generating video:', error);
            res.status(500).json({
                success: false,
                error: error.message || 'Failed to generate video'
            });
        }
    }

    static async getCompetitors(req: Request, res: Response) {
        try {
            const userId = req.user!.id;
            const competitors = await AIService.getCompetitors(userId);

            res.json({
                success: true,
                data: competitors
            });
        } catch (error: any) {
            console.error('Error fetching competitors:', error);
            res.status(500).json({
                success: false,
                error: error.message || 'Failed to fetch competitors'
            });
        }
    }

    static async addCompetitor(req: Request, res: Response) {
        try {
            const userId = req.user!.id;
            const competitorData = req.body;
            const competitor = await AIService.addCompetitor(userId, competitorData);

            res.json({
                success: true,
                data: competitor
            });
        } catch (error: any) {
            console.error('Error adding competitor:', error);
            res.status(500).json({
                success: false,
                error: error.message || 'Failed to add competitor'
            });
        }
    }

    static async removeCompetitor(req: Request, res: Response) {
        try {
            const { competitorId } = req.params;
            await AIService.removeCompetitor(competitorId);

            res.json({
                success: true,
                message: 'Competitor removed successfully'
            });
        } catch (error: any) {
            console.error('Error removing competitor:', error);
            res.status(500).json({
                success: false,
                error: error.message || 'Failed to remove competitor'
            });
        }
    }
}