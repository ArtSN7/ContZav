import { N8nService } from './n8n.service.js';

export class AIService {
    static async generateScript(topic: string, niche: string, tone: string = 'professional'): Promise<string> {
        const prompt = `Generate a script about ${topic} for ${niche} niche in ${tone} tone`;
        const result = await N8nService.generateAIContent(prompt, niche, 'video');
        return result.script;
    }

    static async generatePost(topic: string, niche: string, platform: string): Promise<string> {
        const prompt = `Generate a social media post about ${topic} for ${platform} platform in ${niche} niche`;
        const result = await N8nService.generateAIContent(prompt, niche, 'text');
        return result.content;
    }

    static async analyzeTrends(niche: string): Promise<any> {
        const prompt = `Analyze current trends in ${niche} niche for content creation`;
        const result = await N8nService.generateAIContent(prompt, niche, 'analysis');
        return result.trends;
    }
}
