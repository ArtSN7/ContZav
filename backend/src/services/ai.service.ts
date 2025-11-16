// ai.service.ts
import { AIContent } from '../models/AIContent.js';
import { AIGenerationRequest } from '../models/AIGeneration.js';
import { Avatar } from '../models/Avatar.js';
import { UserApiKeys } from '../models/UserApiKeys.js';
import { N8nService } from './n8n.service.js';
import { Types } from 'mongoose';
import { WebSocketService } from './websocket.service.js';

export class AIService {
    static async getUserApiKeys(userId: string): Promise<{ heygen_api_key: string; openai_api_key: string }> {
        let apiKeys = await UserApiKeys.findOne({ user_id: new Types.ObjectId(userId) });

        if (!apiKeys) {
            apiKeys = new UserApiKeys({
                user_id: new Types.ObjectId(userId),
                heygen_api_key: '',
                openai_api_key: ''
            });
            await apiKeys.save();
        }

        return {
            heygen_api_key: apiKeys.heygen_api_key,
            openai_api_key: apiKeys.openai_api_key
        };
    }

    static async updateUserApiKeys(userId: string, keys: { heygen_api_key?: string; openai_api_key?: string }): Promise<void> {
        await UserApiKeys.findOneAndUpdate(
            { user_id: new Types.ObjectId(userId) },
            { $set: keys },
            { upsert: true, new: true }
        );
    }

    static async getUserAvatars(userId: string): Promise<any[]> {
        return Avatar.find({ user_id: new Types.ObjectId(userId) })
            .sort({ created_at: -1 });
    }

    static async createAvatar(userId: string, avatarData: {
        name: string;
        gender: string;
        style: string;
        avatar_url: string;
        heygen_avatar_id: string;
    }): Promise<any> {
        const avatar = new Avatar({
            user_id: new Types.ObjectId(userId),
            ...avatarData,
            status: 'active'
        });
        await avatar.save();
        return avatar;
    }

    static async deleteAvatar(userId: string, avatarId: string): Promise<void> {
        const result = await Avatar.findOneAndDelete({
            _id: avatarId,
            user_id: new Types.ObjectId(userId)
        });
        if (!result) throw new Error('Avatar not found');
    }

    static async generateNicheQuestions(userId: string, dto: any): Promise<string[]> {
        const answers = {
            niche: dto.niche
        };

        try {
            const response = await N8nService.generateNicheQuestions(answers);

            if (response.status === 'processing') {
                console.log("N8N processing request, returning temporary questions");
                return [
                    `Какие тренды в нише "${dto.niche}" сейчас наиболее популярны?`,
                    `Какой контент в формате "${dto.contentType}" лучше всего работает в этой нише?`,
                    `Какие проблемы вашей аудитории в нише "${dto.niche}" можно решить с помощью контента?`,
                    `Какие вопросы чаще всего задают новички в нише "${dto.niche}"?`,
                    `Как выделиться среди конкурентов в нише "${dto.niche}"?`
                ];
            }

            let questions: string[] = [];
            if (response && response.output) {
                if (Array.isArray(response.output)) {
                    questions = response.output;
                } else if (typeof response.output === 'string') {
                    questions = response.output.split('\n')
                        .filter(q => q.trim().length > 0)
                        .map(q => q.trim());
                }
            }

            questions = questions.slice(0, 10).map(q =>
                q.replace(/^[0-9]+[\.\)]\s*/, '').trim()
            ).filter(q => q.length > 0);

            return questions;

        } catch (error: any) {
            console.error('N8N niche questions error:', error.message);

            return [
                `Какие тренды в нише "${dto.niche}" сейчас наиболее популярны?`,
                `Какой контент в формате "${dto.contentType}" лучше всего работает в этой нише?`,
                `Какие проблемы вашей аудитории можно решить с помощью контента о "${dto.niche}"?`
            ];
        }
    }

    static async generateContentScript(userId: string, dto: any): Promise<any> {
        const generationRequest = new AIGenerationRequest({
            user_id: new Types.ObjectId(userId),
            prompt: `Generate content for niche: ${dto.niche}, type: ${dto.contentType}`,
            parameters: {
                niche: dto.niche,
                contentType: dto.contentType,
                questions: dto.selectedQuestions
            },
            status: 'processing'
        });
        await generationRequest.save();

        const answers = {
            niche: dto.niche,
            contentType: dto.contentType,
            questions: dto.selectedQuestions
        };

        try {
            this.emitGenerationUpdate(userId, generationRequest._id.toString(), 30);

            const output = await N8nService.generateQuestions(answers);
            console.log("Raw content generation response:", output);

            let script: string;

            if (typeof output === 'string') {
                script = output;
            } else if (output.output) {
                script = typeof output.output === 'string' ? output.output : JSON.stringify(output.output);
            } else if (output.script) {
                script = output.script;
            } else if (output.content) {
                script = output.content;
            } else {
                script = JSON.stringify(output);
            }

            this.emitGenerationUpdate(userId, generationRequest._id.toString(), 80);

            const content = new AIContent({
                user_id: new Types.ObjectId(userId),
                title: dto.niche || 'Generated Content',
                content: script,
                content_type: dto.contentType || 'video',
                platform: 'multiple',
                selected_questions: dto.selectedQuestions || [],
                status: 'ready',
                ai_generation_request_id: generationRequest._id
            });
            await content.save();

            await AIGenerationRequest.findByIdAndUpdate(generationRequest._id, {
                status: 'completed',
                result: { contentId: content._id }
            });

            this.emitGenerationUpdate(userId, generationRequest._id.toString(), 100);
            this.emitContentReady(userId, content._id.toString());

            return {
                ...content.toObject(),
                content: script
            };

        } catch (error: any) {
            console.error('Error in generateContentScript:', error);

            await AIGenerationRequest.findByIdAndUpdate(generationRequest._id, {
                status: 'failed',
                error: error.message
            });

            const fallbackContent = `Контент о ${dto.niche} в формате ${dto.contentType}. Сгенерирован автоматически.`;

            const content = new AIContent({
                user_id: new Types.ObjectId(userId),
                title: dto.niche || 'Generated Content',
                content: fallbackContent,
                content_type: dto.contentType || 'video',
                platform: 'multiple',
                selected_questions: dto.selectedQuestions || [],
                status: 'ready',
                ai_generation_request_id: generationRequest._id
            });
            await content.save();

            return {
                ...content.toObject(),
                content: fallbackContent
            };
        }
    }

    static async generateVideoWithAvatar(contentId: string, avatarId: string): Promise<void> {
        const content = await AIContent.findById(contentId);
        if (!content) throw new Error('Content not found');

        const avatar = await Avatar.findById(avatarId);
        if (!avatar) throw new Error('Avatar not found');

        const apiKeys = await this.getUserApiKeys(content.user_id.toString());

        this.emitGenerationUpdate(content.user_id.toString(), contentId, 20);

        const trendwatching = {
            content: content.content,
            title: content.title,
            contentType: content.content_type
        };

        const systemprompt = `Создай сценарий для видео аватара на тему: ${content.title}. Контент: ${content.content}`;

        const avatarScript = await N8nService.generateAvatarScript(trendwatching, systemprompt);

        this.emitGenerationUpdate(content.user_id.toString(), contentId, 50);

        const voiceId = "default-voice";

        const videoResult = await N8nService.generateAvatarVideo(
            apiKeys.heygen_api_key,
            avatar.heygen_avatar_id,
            voiceId,
            avatarScript
        );

        this.emitGenerationUpdate(content.user_id.toString(), contentId, 90);

        await AIContent.findByIdAndUpdate(contentId, {
            video_url: videoResult.videoUrl || videoResult.url,
            status: 'ready'
        });

        this.emitGenerationUpdate(content.user_id.toString(), contentId, 100);
        this.emitVideoReadyUpdate(content.user_id.toString(), contentId, videoResult.videoUrl || videoResult.url);
    }

    static async transcribeTikTok(userId: string, tiktokId: string): Promise<any> {
        return await N8nService.transcribeTikTok(tiktokId);
    }

    static async transcribeInstagram(userId: string, instaId: string): Promise<any> {
        return await N8nService.transcribeInstagram(instaId);
    }

    static async getAIContentWithVideo(contentId: string): Promise<any> {
        const content = await AIContent.findById(contentId);
        if (!content) throw new Error('Content not found');

        const videoData = {
            id: content._id.toString(),
            title: content.title,
            duration: "45 сек",
            quality: "HD 1080p",
            format: "MP4 (9:16)",
            avatar: "Основной Аватар",
            videoUrl: content.video_url || "",
            script: content.content,
            status: content.video_url ? "ready" : "generating"
        };

        return videoData;
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
        const content = await AIContent.findById(contentId);
        if (!content) throw new Error('Content not found');

        const answers = {
            niche: content.title,
            contentType: content.content_type,
            questions: content.selected_questions,
            feedback: content.feedback,
            regenerate: true
        };

        const output = await N8nService.generateQuestions(answers);

        let newScript;
        if (typeof output === 'string') {
            newScript = output;
        } else {
            newScript = output.script || output.content || JSON.stringify(output);
        }

        await AIContent.findByIdAndUpdate(contentId, {
            content: newScript,
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

    static async getUserAIContent(userId: string): Promise<any[]> {
        return AIContent.find({ user_id: new Types.ObjectId(userId) })
            .sort({ created_at: -1 });
    }

    static async getAIContentById(contentId: string): Promise<any> {
        const content = await AIContent.findById(contentId);
        if (!content) throw new Error('Content not found');
        return content;
    }

    static async getCompetitors(userId: string): Promise<any[]> {
        return [];
    }

    static async addCompetitor(userId: string, competitorData: any): Promise<any> {
        return competitorData;
    }

    static async removeCompetitor(competitorId: string): Promise<void> {
    }

    static async emitGenerationUpdate(userId: string, contentId: string, progress: number) {
        WebSocketService.emitToUser(userId, 'generation-progress', {
            contentId,
            progress,
            message: `Generation progress: ${progress}%`
        });
    }

    static async emitVideoReadyUpdate(userId: string, contentId: string, videoUrl: string) {
        WebSocketService.emitToUser(userId, 'video-ready', {
            contentId,
            videoUrl
        });
    }

    static async emitContentReady(userId: string, contentId: string) {
        WebSocketService.emitToUser(userId, 'content-ready', {
            contentId,
            message: 'Content generation completed'
        });
    }
}