import { Schema, model, Document, Types } from 'mongoose';

export interface IAIContent extends Document {
    user_id: Types.ObjectId;
    title: string;
    content: string;
    content_type: 'post' | 'story' | 'reels' | 'video';
    platform: 'instagram' | 'tiktok' | 'youtube' | 'vk' | 'multiple';
    status: 'draft' | 'scheduled' | 'published' | 'failed' | 'ready' | 'processing';
    schedule_date?: Date;
    publish_date?: Date;
    platforms: string[];
    feedback?: string;
    selected_questions?: string[];
    video_url?: string;
    ai_generation_request_id?: Types.ObjectId;
    created_at: Date;
    updated_at: Date;
}

const aiContentSchema = new Schema<IAIContent>({
    user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    content: { type: String, required: true },
    content_type: { type: String, enum: ['post', 'story', 'reels', 'video'], required: true },
    platform: { type: String, enum: ['instagram', 'tiktok', 'youtube', 'vk', 'multiple'], default: 'multiple' },
    status: { type: String, enum: ['draft', 'scheduled', 'published', 'failed', 'ready', 'processing'], default: 'draft' },
    schedule_date: { type: Date },
    publish_date: { type: Date },
    platforms: [{ type: String }],
    feedback: { type: String },
    selected_questions: [{ type: String }],
    video_url: { type: String },
    ai_generation_request_id: { type: Schema.Types.ObjectId, ref: 'AIGenerationRequest' }
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

aiContentSchema.index({ user_id: 1, created_at: -1 });
aiContentSchema.index({ status: 1, schedule_date: 1 });

export const AIContent = model<IAIContent>('AIContent', aiContentSchema);