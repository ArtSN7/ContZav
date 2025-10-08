import { Content } from '../models/Content.js';
import { Types } from 'mongoose';

export class ContentService {
    static async createContent(contentData: {
        user_id: string;
        title: string;
        content: string;
        content_type: 'post' | 'story' | 'reels' | 'video';
        platform: 'instagram' | 'tiktok' | 'youtube' | 'vk';
        ai_content_id?: string;
    }): Promise<any> {
        const content = new Content({
            ...contentData,
            user_id: new Types.ObjectId(contentData.user_id),
            ai_content_id: contentData.ai_content_id ? new Types.ObjectId(contentData.ai_content_id) : undefined
        });
        await content.save();
        return content;
    }

    static async getUserContent(userId: string): Promise<any[]> {
        return Content.find({ user_id: new Types.ObjectId(userId) })
            .sort({ created_at: -1 });
    }

    static async updateContentStatus(contentId: string, status: 'draft' | 'scheduled' | 'published' | 'failed'): Promise<any> {
        const content = await Content.findByIdAndUpdate(
            contentId,
            { status },
            { new: true }
        );
        if (!content) throw new Error('Content not found');
        return content;
    }

    static async getContentById(contentId: string): Promise<any> {
        const content = await Content.findById(contentId);
        if (!content) throw new Error('Content not found');
        return content;
    }

    static async deleteContent(contentId: string): Promise<void> {
        const result = await Content.findByIdAndDelete(contentId);
        if (!result) throw new Error('Content not found');
    }

    static async scheduleContent(contentId: string, scheduleDate: Date, platforms: string[]): Promise<any> {
        const content = await Content.findByIdAndUpdate(
            contentId,
            {
                schedule_date: scheduleDate,
                platforms,
                status: 'scheduled'
            },
            { new: true }
        );
        if (!content) throw new Error('Content not found');
        return content;
    }

    static async publishContent(contentId: string): Promise<any> {
        const content = await Content.findByIdAndUpdate(
            contentId,
            {
                publish_date: new Date(),
                status: 'published'
            },
            { new: true }
        );
        if (!content) throw new Error('Content not found');
        return content;
    }
}