import { Schema, model, Document, Types } from 'mongoose';

export interface IAIGenerationRequest extends Document {
    user_id: Types.ObjectId;
    prompt: string;
    parameters: {
        tone?: string;
        style?: string;
        length?: number;
        target_audience?: string;
        keywords?: string[];
        contentType?: string;
        questions?: string[];
        contentId?: string;
        feedback?: string;
    };
    status: 'pending' | 'processing' | 'completed' | 'failed';
    result?: any;
    error?: string;
    created_at: Date;
    updated_at: Date;
}

const aiGenerationRequestSchema = new Schema<IAIGenerationRequest>({
    user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    prompt: { type: String, required: true },
    parameters: {
        tone: { type: String },
        style: { type: String },
        length: { type: Number },
        target_audience: { type: String },
        keywords: [{ type: String }],
        contentType: { type: String },
        questions: [{ type: String }],
        contentId: { type: String },
        feedback: { type: String }
    },
    status: { type: String, enum: ['pending', 'processing', 'completed', 'failed'], default: 'pending' },
    result: { type: Schema.Types.Mixed },
    error: { type: String }
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

aiGenerationRequestSchema.index({ user_id: 1, created_at: -1 });
aiGenerationRequestSchema.index({ status: 1 });

export const AIGenerationRequest = model<IAIGenerationRequest>('AIGenerationRequest', aiGenerationRequestSchema);