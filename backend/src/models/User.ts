import { Schema, model, Document, Types } from 'mongoose';
import { hash, compare } from 'bcryptjs';

export interface IUser extends Document {
    _id: Types.ObjectId;
    email: string;
    password_hash?: string;
    name: string;
    avatar_url?: string;
    bio?: string;
    website?: string;
    location?: string;
    language: string;
    timezone: string;
    email_verified: boolean;
    role: 'user' | 'admin';
    last_login?: Date;
    email_notifications: boolean;
    push_notifications: boolean;
    two_factor_enabled: boolean;
    two_factor_method?: 'sms' | 'authenticator';
    two_factor_secret?: string;
    two_factor_backup_codes: string[];
    phone_number?: string;
    created_at: Date;
    updated_at: Date;
    comparePassword(candidatePassword: string): Promise<boolean>;
}

export interface ISocialAccount extends Document {
    user_id: Types.ObjectId;
    platform: 'google' | 'vkontakte' | 'yandex' | 'youtube' | 'instagram' | 'tiktok' | 'telegram' | 'facebook';
    platform_user_id: string;
    email: string;
    username?: string;
    access_token: string;
    refresh_token?: string;
    expires_at?: Date;
    profile_data: any;
    followers?: number;
    last_sync?: Date;
    is_connected: boolean;
    settings?: any;
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

const userSchema = new Schema<IUser>({
    email: { type: String, required: true, unique: true, lowercase: true, index: true },
    password_hash: { type: String },
    name: { type: String, required: true },
    avatar_url: { type: String },
    bio: { type: String },
    website: { type: String },
    location: { type: String },
    language: { type: String, default: 'ru' },
    timezone: { type: String, default: 'Europe/Moscow' },
    email_verified: { type: Boolean, default: false },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    last_login: { type: Date },
    email_notifications: { type: Boolean, default: true },
    push_notifications: { type: Boolean, default: true },
    two_factor_enabled: { type: Boolean, default: false },
    two_factor_method: { type: String, enum: ['sms', 'authenticator'] },
    two_factor_secret: { type: String },
    two_factor_backup_codes: [{ type: String }],
    phone_number: { type: String }
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

const socialAccountSchema = new Schema<ISocialAccount>({
    user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    platform: { type: String, enum: ['google', 'vkontakte', 'yandex', 'youtube', 'instagram', 'tiktok', 'telegram', 'facebook'], required: true },
    platform_user_id: { type: String, required: true },
    email: { type: String, required: true },
    username: { type: String },
    access_token: { type: String, required: true },
    refresh_token: { type: String },
    expires_at: { type: Date },
    profile_data: { type: Schema.Types.Mixed },
    followers: { type: Number },
    last_sync: { type: Date },
    is_connected: { type: Boolean, default: false },
    settings: { type: Schema.Types.Mixed }
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

userSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
    if (!this.password_hash) return false;
    return compare(candidatePassword, this.password_hash);
};

userSchema.pre('save', async function (next) {
    if (!this.isModified('password_hash') || !this.password_hash) return next();
    this.password_hash = await hash(this.password_hash, 12);
    next();
});

socialAccountSchema.index({ user_id: 1, platform: 1 }, { unique: true });
socialAccountSchema.index({ platform: 1, platform_user_id: 1 }, { unique: true });
activeSessionSchema.index({ user_id: 1 });
activeSessionSchema.index({ last_activity: 1 });

export const User = model<IUser>('User', userSchema);
export const SocialAccount = model<ISocialAccount>('SocialAccount', socialAccountSchema);
export const ActiveSession = model<IActiveSession>('ActiveSession', activeSessionSchema);