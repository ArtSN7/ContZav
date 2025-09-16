import axios from 'axios';
import { config } from '../config/index.js';
import { logger } from '../utils/logger.js';

interface N8nWorkflowPayload {
    workflowId: string;
    data: any;
}

export class N8nService {
    private static async makeRequest(endpoint: string, data: any) {
        try {
            const response = await axios.post(`${config.N8N_URL}${endpoint}`, data, {
                headers: {
                    'X-N8N-API-KEY': config.N8N_API_KEY,
                    'Content-Type': 'application/json',
                },
                timeout: 30000,
            });
            return response.data;
        } catch (error) {
            logger.error('N8n request failed:', error);
            throw new Error('N8n service unavailable');
        }
    }

    static async triggerWorkflow(payload: N8nWorkflowPayload): Promise<any> {
        return this.makeRequest('/webhook/workflow', payload);
    }

    static async generateAIContent(prompt: string, niche: string, contentType: string): Promise<any> {
        const workflowPayload = {
            workflowId: 'ai-content-generation',
            data: { prompt, niche, contentType },
        };
        return this.triggerWorkflow(workflowPayload);
    }

    static async publishContent(content: any, platforms: string[]): Promise<any> {
        const workflowPayload = {
            workflowId: 'content-publishing',
            data: { content, platforms },
        };
        return this.triggerWorkflow(workflowPayload);
    }
}