import axios from 'axios';
import { logger } from '../utils/logger.js';

export class N8nService {
    static async generateQuestions(answers: any): Promise<any> {
        const n8nUrl = 'https://nashnmain8n.ru/webhook/c6e0598a-89f3-48a6-a6bc-fde88548cc04';

        try {
            const queryParams = new URLSearchParams();
            Object.keys(answers).forEach(key => {
                if (answers[key] !== undefined && answers[key] !== null) {
                    queryParams.append(key, String(answers[key]));
                }
            });

            logger.info(`Sending GET request to n8n: ${n8nUrl}?${queryParams.toString()}`);

            const getResponse = await axios.get(`${n8nUrl}?${queryParams.toString()}`, {
                timeout: 30000,
                validateStatus: (status) => status < 500
            });

            if (getResponse.data) {
                logger.info('Successfully received response from n8n via GET');
                return getResponse.data;
            }

        } catch (getError: any) {
            logger.warn('GET request failed, trying POST:', getError.message);

            try {
                logger.info('Sending POST request to n8n:', { url: n8nUrl, data: answers });

                const postResponse = await axios.post(n8nUrl, answers, {
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    timeout: 30000,
                    validateStatus: (status) => status < 500
                });

                if (postResponse.data) {
                    logger.info('Successfully received response from n8n via POST');
                    return postResponse.data;
                }

            } catch (postError: any) {
                logger.error('Both GET and POST requests failed:', {
                    getError: getError.message,
                    postError: postError.message,
                    postResponse: postError.response?.data
                });
                throw new Error(`N8N service unavailable: ${postError.message}`);
            }
        }

        throw new Error('No response received from n8n service');
    }

    static async transcribeTikTok(tiktokId: string): Promise<any> {
        try {
            const response = await axios.post(
                'https://nashn8n.ru/webhook/744b9a62-9585-4b7d-b30f-5012cd158048',
                { tiktokid: tiktokId },
                {
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    timeout: 30000
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
                    },
                    timeout: 30000
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
                    },
                    timeout: 30000
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
                    },
                    timeout: 30000
                }
            );

            return response.data;
        } catch (error: any) {
            logger.error('Failed to generate avatar video:', error);
            throw error;
        }
    }
}