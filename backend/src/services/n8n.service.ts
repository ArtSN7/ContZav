// n8n.service.ts
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

            const urlWithParams = `${n8nUrl}?${queryParams.toString()}`;
            logger.info(`Sending GET request to n8n: ${urlWithParams}`);

            const response = await axios.get(urlWithParams, {
                timeout: 30000,
                validateStatus: (status) => status < 500
            });

            // Если ответ пустой, считаем что запрос принят в обработку
            // n8n отправит результат позже через вебхук на наш сервер
            if (response.status === 200) {
                logger.info('N8n request accepted, waiting for webhook callback');
                return { status: 'processing' };
            }

        } catch (error: any) {
            logger.error('N8N request failed:', error.message);
            throw new Error(`N8N service unavailable: ${error.message}`);
        }

        throw new Error('No response received from n8n service');
    }

    static async generateNicheQuestions(answers: any): Promise<any> {
        const n8nUrl = 'https://nashnmain8n.ru/webhook/d6e2d6ed-f04f-40b6-b1d9-5d80131052bc';

        try {
            const queryParams = new URLSearchParams();
            Object.keys(answers).forEach(key => {
                if (answers[key] !== undefined && answers[key] !== null) {
                    queryParams.append(key, String(answers[key]));
                }
            });

            const urlWithParams = `${n8nUrl}?${queryParams.toString()}`;
            logger.info(`Sending GET request for niche questions: ${urlWithParams}`);

            const response = await axios.get(urlWithParams, {
                timeout: 30000,
                validateStatus: (status) => status < 500
            });

            // Если ответ пустой, считаем что запрос принят
            if (response.status === 200) {
                logger.info('Niche questions request accepted, waiting for webhook callback');
                return { status: 'processing' };
            }

        } catch (error: any) {
            logger.error('Niche questions request failed:', error.message);
            throw error;
        }

        throw new Error('No response received from niche questions service');
    }

    // остальные методы без изменений
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