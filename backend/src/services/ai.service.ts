import { AIContentModel } from '../models/AIContent.js';
import { AIGenerationModel } from '../models/AIGeneration.js';
import { n8nService } from './n8n.service.js';
import { MockAiService } from './mockAiService.js';
import { GenerateNicheDto, GenerateQuestionsDto, GenerateContentDto } from '../dtos/ai.dto.js';

export class AIService {
    static async generateNicheQuestions(userId: string, dto: GenerateNicheDto): Promise<string[]> {
        const request = await AIGenerationModel.create({
            user_id: userId,
            type: 'questions',
            prompt: dto.niche,
            parameters: { contentType: dto.contentType },
            status: 'pending'
        });

        await n8nService.triggerWorkflow('generate-niche-questions', {
            requestId: request.id,
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
        const content = await AIContentModel.create({
            user_id: userId,
            niche: dto.niche,
            content_type: dto.contentType,
            selected_questions: dto.selectedQuestions || [],
            status: 'generating'
        });

        const request = await AIGenerationModel.create({
            user_id: userId,
            type: 'content',
            prompt: dto.niche,
            parameters: {
                contentType: dto.contentType,
                questions: dto.selectedQuestions,
                contentId: content.id
            },
            status: 'pending'
        });

        await n8nService.triggerWorkflow('generate-content-script', {
            requestId: request.id,
            contentId: content.id,
            niche: dto.niche,
            contentType: dto.contentType,
            questions: dto.selectedQuestions,
            userId
        });

        return content;
    }

    static async generateContentScriptMock(userId: string, dto: GenerateQuestionsDto): Promise<any> {
        const content = await MockAiService.generateContent(dto.niche, dto.contentType, dto.selectedQuestions || []);

        const savedContent = await AIContentModel.create({
            user_id: userId,
            niche: dto.niche,
            content_type: dto.contentType,
            selected_questions: dto.selectedQuestions || [],
            script: content.script,
            video_url: content.videoUrl,
            status: 'ready'
        });

        return savedContent;
    }

    static async generateVideo(contentId: string): Promise<void> {
        const content = await AIContentModel.findById(contentId);

        const request = await AIGenerationModel.create({
            user_id: content.user_id,
            type: 'video',
            prompt: content.script,
            parameters: { contentId },
            status: 'pending'
        });

        await n8nService.triggerWorkflow('generate-video', {
            requestId: request.id,
            contentId,
            script: content.script,
            style: content.style,
            tone: content.tone,
            userId: content.user_id
        });
    }

    static async generateVideoMock(contentId: string): Promise<void> {
        const content = await AIContentModel.findById(contentId);
        const mockVideo = await MockAiService.generateVideoContent(content.script);

        await AIContentModel.update(contentId, {
            video_url: mockVideo.videoUrl,
            status: 'ready'
        });
    }

    static async handleGenerationResult(requestId: string, result: any, error?: string): Promise<void> {
        const request = await AIGenerationModel.findById(requestId);

        if (error) {
            await AIGenerationModel.updateStatus(requestId, 'failed', null, error);
            return;
        }

        await AIGenerationModel.updateStatus(requestId, 'completed', result);

        if (request.type === 'content' && request.parameters.contentId) {
            const content = await AIContentModel.update(request.parameters.contentId, {
                script: result.script,
                text_content: result.textContent,
                status: 'ready'
            });

            if (content.content_type !== 'text') {
                await this.generateVideo(content.id);
            }
        } else if (request.type === 'video' && request.parameters.contentId) {
            await AIContentModel.update(request.parameters.contentId, {
                video_url: result.videoUrl,
                status: 'ready'
            });
        }
    }

    static async approveContent(contentId: string, approved: boolean, feedback?: string): Promise<any> {
        const status = approved ? 'approved' : 'rejected';
        const updateData: any = { status };

        if (feedback) {
            updateData.feedback = feedback;
        }

        return AIContentModel.update(contentId, updateData);
    }

    static async regenerateContent(contentId: string): Promise<void> {
        const content = await AIContentModel.updateStatus(contentId, 'generating');

        const request = await AIGenerationModel.create({
            user_id: content.user_id,
            type: 'content',
            prompt: content.niche,
            parameters: {
                contentType: content.content_type,
                questions: content.selected_questions,
                contentId: content.id,
                feedback: content.feedback
            },
            status: 'pending'
        });

        await n8nService.triggerWorkflow('regenerate-content', {
            requestId: request.id,
            contentId: content.id,
            niche: content.niche,
            contentType: content.content_type,
            questions: content.selected_questions,
            feedback: content.feedback,
            userId: content.user_id
        });
    }

    static async regenerateContentMock(contentId: string): Promise<void> {
        const content = await AIContentModel.findById(contentId);
        const newContent = await MockAiService.generateContent(content.niche, content.content_type, content.selected_questions);

        await AIContentModel.update(contentId, {
            script: newContent.script,
            video_url: newContent.videoUrl,
            status: 'ready'
        });
    }

    static async scheduleContent(contentId: string, platforms: string[], scheduleDate: Date): Promise<any> {
        return AIContentModel.scheduleContent(contentId, platforms, scheduleDate);
    }

    static async scheduleContentMock(contentId: string, platforms: string[], scheduleDate: Date): Promise<any> {
        return AIContentModel.update(contentId, {
            platforms,
            schedule_date: scheduleDate,
            status: 'scheduled'
        });
    }
}