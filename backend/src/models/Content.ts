import { Schema, model, Document, Types } from 'mongoose';

export interface IContentData extends Document {
    user_id: Types.ObjectId;
    title: string;
    content: string;
    content_type: 'post' | 'story' | 'reels' | 'video';
    platform: 'instagram' | 'tiktok' | 'youtube' | 'vk';
    status: 'draft' | 'scheduled' | 'published' | 'failed';
    schedule_date?: Date;
    publish_date?: Date;
    platforms: string[];
    ai_content_id?: Types.ObjectId;
    created_at: Date;
    updated_at: Date;
}

const contentSchema = new Schema<IContentData>({
    user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    content: { type: String, required: true },
    content_type: { type: String, enum: ['post', 'story', 'reels', 'video'], required: true },
    platform: { type: String, enum: ['instagram', 'tiktok', 'youtube', 'vk'], required: true },
    status: { type: String, enum: ['draft', 'scheduled', 'published', 'failed'], default: 'draft' },
    schedule_date: { type: Date },
    publish_date: { type: Date },
    platforms: [{ type: String }],
    ai_content_id: { type: Schema.Types.ObjectId, ref: 'AIContent' }
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

contentSchema.index({ user_id: 1, created_at: -1 });
contentSchema.index({ status: 1, schedule_date: 1 });

export const Content = model<IContentData>('Content', contentSchema);