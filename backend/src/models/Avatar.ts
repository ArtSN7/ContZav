import { Schema, model, Document, Types } from 'mongoose';

export interface IAvatar extends Document {
    user_id: Types.ObjectId;
    name: string;
    gender: string;
    style: string;
    avatar_url: string;
    heygen_avatar_id: string;
    status: 'active' | 'inactive' | 'generating';
    usage_count: number;
    created_at: Date;
    updated_at: Date;
}

const avatarSchema = new Schema<IAvatar>({
    user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    gender: { type: String, required: true },
    style: { type: String, required: true },
    avatar_url: { type: String, required: true },
    heygen_avatar_id: { type: String, required: true },
    status: { type: String, enum: ['active', 'inactive', 'generating'], default: 'active' },
    usage_count: { type: Number, default: 0 }
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

avatarSchema.index({ user_id: 1, created_at: -1 });
avatarSchema.index({ status: 1 });

export const Avatar = model<IAvatar>('Avatar', avatarSchema);