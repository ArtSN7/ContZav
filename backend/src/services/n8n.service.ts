import axios from 'axios';
import { config } from '../config/index.js';
import { logger } from '../utils/logger.js';

export class N8nService {
    static async getWorkflowStatus(workflowId: string): Promise<any> {
        try {
            const response = await axios.get(
                `${config.N8N_URL}/api/v1/workflows/${workflowId}/executions`,
                {
                    headers: {
                        'X-N8N-API-KEY': config.N8N_API_KEY
                    }
                }
            );

            return response.data;
        } catch (error: any) {
            logger.error(`Failed to get workflow status ${workflowId}:`, error);
            throw error;
        }
    }

    static async triggerWorkflow(workflowName: string, data: any): Promise<void> {
        try {
            const response = await axios.post(
                `${config.N8N_URL}/webhook/${workflowName}`,
                data,
                {
                    headers: {
                        'X-N8N-API-KEY': config.N8N_API_KEY,
                        'Content-Type': 'application/json'
                    }
                }
            );

            logger.info(`N8N workflow ${workflowName} triggered successfully`);
        } catch (error: any) {
            logger.error(`Failed to trigger N8N workflow ${workflowName}:`, error);
            throw error;
        }
    }

    static async updateGenerationStatus(requestId: string, status: string, result?: any, error?: string): Promise<void> {
        try {
            await axios.post(
                `${config.N8N_URL}/webhook/generation-status`,
                { requestId, status, result, error },
                {
                    headers: {
                        'X-N8N-API-KEY': config.N8N_API_KEY
                    }
                }
            );
        } catch (error: any) {
            logger.error('Failed to update generation status:', error);
        }
    }

    static async generateQuestions(answers: any): Promise<string> {
        try {
            const response = await axios.post(
                'https://nashnmain8n.ru/webhook/c6e0598a-89f3-48a6-a6bc-fde88548cc04',
                { answers },
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );

            return response.data.output;
        } catch (error: any) {
            logger.error('Failed to generate questions:', error);
            throw error;
        }
    }

    static async transcribeTikTok(tiktokId: string): Promise<any> {
        try {
            const response = await axios.post(
                'https://nashn8n.ru/webhook/744b9a62-9585-4b7d-b30f-5012cd158048',
                { tiktokid: tiktokId },
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );

            return response.data;
        } catch (error: any) {
            logger.error('Failed to transcribe TikTok:', error);
            throw error;
        }
    }

    static async transcribeInstagram(instaId: string): Promise<any> {
        try {
            const response = await axios.post(
                'https://nashn8n.ru/webhook/6dc03b76-1f09-4004-af61-0a7c9ebc346f',
                { instaid: instaId },
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );

            return response.data;
        } catch (error: any) {
            logger.error('Failed to transcribe Instagram:', error);
            throw error;
        }
    }

    static async generateAvatarScript(trendwatching: any, systemprompt: string): Promise<string> {
        try {
            const response = await axios.post(
                'https://nashnmain8n.ru/webhook/029be07e-dc02-407e-81a1-4eafea4b5d83',
                { trendwatching, systemprompt },
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );

            return response.data.output;
        } catch (error: any) {
            logger.error('Failed to generate avatar script:', error);
            throw error;
        }
    }

    static async generateAvatarVideo(apiKey: string, avatarId: string, voiceId: string, text: string): Promise<any> {
        try {
            const response = await axios.post(
                'https://nashnmain8n.ru/webhook/da9112db-de94-4e52-b46f-33df05f4cc81',
                { api: apiKey, avatarid: avatarId, voiceid: voiceId, text },
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );

            return response.data;
        } catch (error: any) {
            logger.error('Failed to generate avatar video:', error);
            throw error;
        }
    }
}