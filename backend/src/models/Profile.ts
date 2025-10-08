import { Schema, model, Document, Types } from 'mongoose';

export interface IUserProfile extends Document {
    user_id: Types.ObjectId;
    name: string;
    avatar_url?: string;
    bio?: string;
    website?: string;
    location?: string;
    language: string;
    timezone: string;
    email_notifications: boolean;
    push_notifications: boolean;
    created_at: Date;
    updated_at: Date;
}

export interface ITwoFactorSettings extends Document {
    user_id: Types.ObjectId;
    enabled: boolean;
    method?: 'sms' | 'authenticator';
    phone_number?: string;
    secret?: string;
    backup_codes: string[];
    created_at: Date;
    updated_at: Date;
}

export interface IActiveSession extends Document {
    user_id: Types.ObjectId;
    device_info: string;
    ip_address: string;
    location: string;
    last_activity: Date;
    created_at: Date;
    updated_at: Date;
}

const userProfileSchema = new Schema<IUserProfile>({
    user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    name: { type: String, required: true },
    avatar_url: { type: String },
    bio: { type: String },
    website: { type: String },
    location: { type: String },
    language: { type: String, default: 'ru' },
    timezone: { type: String, default: 'Europe/Moscow' },
    email_notifications: { type: Boolean, default: true },
    push_notifications: { type: Boolean, default: true }
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

const twoFactorSettingsSchema = new Schema<ITwoFactorSettings>({
    user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    enabled: { type: Boolean, default: false },
    method: { type: String, enum: ['sms', 'authenticator'] },
    phone_number: { type: String },
    secret: { type: String },
    backup_codes: [{ type: String }]
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

const activeSessionSchema = new Schema<IActiveSession>({
    user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    device_info: { type: String, required: true },
    ip_address: { type: String, required: true },
    location: { type: String, required: true },
    last_activity: { type: Date, required: true }
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

userProfileSchema.index({ user_id: 1 });
twoFactorSettingsSchema.index({ user_id: 1 });
activeSessionSchema.index({ user_id: 1 });
activeSessionSchema.index({ last_activity: 1 });

export const UserProfile = model<IUserProfile>('UserProfile', userProfileSchema);
export const TwoFactorSettings = model<ITwoFactorSettings>('TwoFactorSettings', twoFactorSettingsSchema);
export const ActiveSession = model<IActiveSession>('ActiveSession', activeSessionSchema);