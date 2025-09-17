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
        } catch (error) {
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
        } catch (error) {
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
        } catch (error) {
            logger.error('Failed to update generation status:', error);
        }
    }
}

export const n8nService = new N8nService();