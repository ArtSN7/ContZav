import { Document, Types } from 'mongoose';

export interface IAIContent extends Document {
    user_id: Types.ObjectId;
    niche: string;
    content_type: 'video' | 'text' | 'combination';
    generated_questions: string[];
    selected_questions: string[];
    script: string;
    video_url: string;
    text_content: string;
    status: 'generating' | 'ready' | 'approved' | 'rejected' | 'scheduled' | 'published';
    style: string;
    tone: string;
    length: number;
    feedback: string;
    platforms: string[];
    schedule_date: Date;
    publish_date: Date;
    created_at: Date;
    updated_at: Date;
}

export interface IAIGenerationRequest extends Document {
    user_id: Types.ObjectId;
    type: 'niche' | 'questions' | 'content' | 'video';
    prompt: string;
    parameters: any;
    status: 'pending' | 'processing' | 'completed' | 'failed';
    result: any;
    error: string;
    created_at: Date;
    updated_at: Date;
}