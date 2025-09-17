import { AIContentModel } from '../models/AIContent';
import { AIGenerationModel } from '../models/AIGeneration';
import { n8nService } from './n8n.service.js';
import { GenerateNicheDto, GenerateQuestionsDto, GenerateContentDto } from '../dtos/ai.dto';

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

    static async generateContentScript(userId: string, dto: GenerateQuestionsDto): Promise<AIContent> {
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

    static async approveContent(contentId: string, approved: boolean, feedback?: string): Promise<AIContent> {
        const status = approved ? 'approved' : 'rejected';
        const updateData: Partial<AIContent> = { status };

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

    static async scheduleContent(contentId: string, platforms: string[], scheduleDate: Date): Promise<AIContent> {
        return AIContentModel.scheduleContent(contentId, platforms, scheduleDate);
    }
}