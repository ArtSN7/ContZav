import { AIContent } from '../models/AIContent.js';
import { AIGenerationRequest } from '../models/AIGeneration.js';
import { N8nService } from './n8n.service.js';
import { MockAiService } from './mockAiService.js';
import { GenerateNicheDto, GenerateQuestionsDto, GenerateContentDto } from '../dtos/ai.dto.js';
import { Types } from 'mongoose';

export class AIService {
    static async generateNicheQuestions(userId: string, dto: GenerateNicheDto): Promise<string[]> {
        const request = new AIGenerationRequest({
            user_id: new Types.ObjectId(userId),
            prompt: dto.niche,
            parameters: { contentType: dto.contentType },
            status: 'pending'
        });
        await request.save();

        await N8nService.triggerWorkflow('generate-niche-questions', {
            requestId: request._id.toString(),
            niche: dto.niche,
            contentType: dto.contentType,
            userId
        });

        return [];
    }

    static async generateNicheQuestionsMock(userId: string, dto: GenerateNicheDto): Promise<string[]> {
        return MockAiService.generateQuestions(dto.niche, dto.contentType);
    }

    static async generateContentScript(userId: string, dto: GenerateQuestionsDto): Promise<any> {
        const content = new AIContent({
            user_id: new Types.ObjectId(userId),
            title: dto.niche,
            content: '',
            content_type: dto.contentType,
            platform: 'instagram',
            selected_questions: dto.selectedQuestions || [],
            status: 'generating'
        });
        await content.save();

        const request = new AIGenerationRequest({
            user_id: new Types.ObjectId(userId),
            prompt: dto.niche,
            parameters: {
                contentType: dto.contentType,
                questions: dto.selectedQuestions,
                contentId: content._id.toString()
            },
            status: 'pending'
        });
        await request.save();

        await N8nService.triggerWorkflow('generate-content-script', {
            requestId: request._id.toString(),
            contentId: content._id.toString(),
            niche: dto.niche,
            contentType: dto.contentType,
            questions: dto.selectedQuestions,
            userId
        });

        return content;
    }

    static async generateContentScriptMock(userId: string, dto: GenerateQuestionsDto): Promise<any> {
        const content = await MockAiService.generateContent(dto.niche, dto.contentType, dto.selectedQuestions || []);

        const savedContent = new AIContent({
            user_id: new Types.ObjectId(userId),
            title: dto.niche,
            content: content.script,
            content_type: dto.contentType,
            platform: 'instagram',
            selected_questions: dto.selectedQuestions || [],
            video_url: content.videoUrl,
            status: 'ready'
        });
        await savedContent.save();

        return savedContent;
    }

    static async generateVideo(contentId: string): Promise<void> {
        const content = await AIContent.findById(contentId);
        if (!content) throw new Error('Content not found');

        const request = new AIGenerationRequest({
            user_id: content.user_id,
            prompt: content.content,
            parameters: { contentId: content._id.toString() },
            status: 'pending'
        });
        await request.save();

        await N8nService.triggerWorkflow('generate-video', {
            requestId: request._id.toString(),
            contentId: content._id.toString(),
            script: content.content,
            userId: content.user_id.toString()
        });
    }

    static async generateVideoMock(contentId: string): Promise<void> {
        const content = await AIContent.findById(contentId);
        if (!content) throw new Error('Content not found');

        const mockVideo = await MockAiService.generateVideoContent(content.content);

        await AIContent.findByIdAndUpdate(contentId, {
            video_url: mockVideo.videoUrl,
            status: 'ready'
        });
    }

    static async handleGenerationResult(requestId: string, result: any, error?: string): Promise<void> {
        const request = await AIGenerationRequest.findById(requestId);
        if (!request) throw new Error('Request not found');

        if (error) {
            await AIGenerationRequest.findByIdAndUpdate(requestId, {
                status: 'failed',
                error: error,
                updated_at: new Date()
            });
            return;
        }

        await AIGenerationRequest.findByIdAndUpdate(requestId, {
            status: 'completed',
            result: result,
            updated_at: new Date()
        });

        // Исправляем доступ к parameters
        const parameters = request.parameters as any;
        if (parameters?.contentId) {
            const content = await AIContent.findById(parameters.contentId);
            if (content) {
                if (request.prompt.includes('content')) {
                    await AIContent.findByIdAndUpdate(parameters.contentId, {
                        content: result.script,
                        status: 'ready'
                    });

                    if (content.content_type !== 'text') {
                        await this.generateVideo(content._id.toString());
                    }
                } else if (request.prompt.includes('video')) {
                    await AIContent.findByIdAndUpdate(parameters.contentId, {
                        video_url: result.videoUrl,
                        status: 'ready'
                    });
                }
            }
        }
    }

    static async approveContent(contentId: string, approved: boolean, feedback?: string): Promise<any> {
        const status = approved ? 'approved' : 'rejected';
        const updateData: any = { status };

        if (feedback) {
            updateData.feedback = feedback;
        }

        return AIContent.findByIdAndUpdate(contentId, updateData, { new: true });
    }

    static async regenerateContent(contentId: string): Promise<void> {
        const content = await AIContent.findByIdAndUpdate(contentId, { status: 'generating' }, { new: true });
        if (!content) throw new Error('Content not found');

        const contentObj = content.toObject();
        const request = new AIGenerationRequest({
            user_id: content.user_id,
            prompt: content.title,
            parameters: {
                contentType: content.content_type,
                questions: content.selected_questions,
                contentId: content._id.toString(),
                feedback: content.feedback
            },
            status: 'pending'
        });
        await request.save();

        await N8nService.triggerWorkflow('regenerate-content', {
            requestId: request._id.toString(),
            contentId: content._id.toString(),
            niche: content.title,
            contentType: content.content_type,
            questions: content.selected_questions,
            feedback: content.feedback,
            userId: content.user_id.toString()
        });
    }

    static async regenerateContentMock(contentId: string): Promise<void> {
        const content = await AIContent.findById(contentId);
        if (!content) throw new Error('Content not found');

        const contentObj = content.toObject();
        const newContent = await MockAiService.generateContent(content.title, content.content_type, content.selected_questions);

        await AIContent.findByIdAndUpdate(contentId, {
            content: newContent.script,
            video_url: newContent.videoUrl,
            status: 'ready'
        });
    }

    static async scheduleContent(contentId: string, platforms: string[], scheduleDate: Date): Promise<any> {
        return AIContent.findByIdAndUpdate(contentId, {
            platforms,
            schedule_date: scheduleDate,
            status: 'scheduled'
        }, { new: true });
    }

    static async scheduleContentMock(contentId: string, platforms: string[], scheduleDate: Date): Promise<any> {
        const content = await AIContent.findByIdAndUpdate(
            contentId,
            {
                platforms,
                schedule_date: scheduleDate,
                status: 'scheduled'
            },
            { new: true }
        );
        if (!content) throw new Error('Content not found');
        return content;
    }

    static async getUserAIContent(userId: string): Promise<any[]> {
        return AIContent.find({ user_id: new Types.ObjectId(userId) })
            .sort({ created_at: -1 });
    }

    static async getAIContentById(contentId: string): Promise<any> {
        const content = await AIContent.findById(contentId);
        if (!content) throw new Error('Content not found');
        return content;
    }
}