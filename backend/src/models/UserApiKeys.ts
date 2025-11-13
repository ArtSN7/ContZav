import { Schema, model, Document, Types } from 'mongoose';

export interface IUserApiKeys extends Document {
    user_id: Types.ObjectId;
    heygen_api_key: string;
    openai_api_key: string;
    created_at: Date;
    updated_at: Date;
}

const userApiKeysSchema = new Schema<IUserApiKeys>({
    user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    heygen_api_key: { type: String, default: '' },
    openai_api_key: { type: String, default: '' }
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

export const UserApiKeys = model<IUserApiKeys>('UserApiKeys', userApiKeysSchema);