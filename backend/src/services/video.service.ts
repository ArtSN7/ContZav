import axios from 'axios';
import { config } from '../config/index.js';
import { logger } from '../utils/logger.js';

export class VideoService {
    static async generateVideo(script: string, style: string, tone: string): Promise<string> {
        try {
            const response = await axios.post(
                `${config.VIDEO_GENERATION_URL}/generate`,
                { script, style, tone },
                {
                    headers: {
                        'Authorization': `Bearer ${config.AI_API_KEY}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            return response.data.videoUrl;
        } catch (error) {
            logger.error('Failed to generate video:', error);
            throw new Error('Video generation failed');
        }
    }
}