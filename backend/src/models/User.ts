import { Schema, model, Document, Types } from 'mongoose';
import { hash, compare } from 'bcryptjs';

export interface IAuthUser extends Document {
    email: string;
    password_hash: string;
    name: string;
    avatar_url?: string;
    email_verified: boolean;
    role: 'user' | 'admin';
    last_login?: Date;
    created_at: Date;
    updated_at: Date;

    comparePassword(candidatePassword: string): Promise<boolean>;
}

export interface ISocialAccount extends Document {
    user_id: Types.ObjectId;
    platform: 'google' | 'vkontakte' | 'apple' | 'youtube' | 'instagram' | 'tiktok';
    platform_user_id: string;
    email: string;
    username?: string;
    access_token: string;
    refresh_token?: string;
    expires_at?: Date;
    profile_data: any;
    created_at: Date;
    updated_at: Date;
}

const authUserSchema = new Schema<IAuthUser>({
    email: { type: String, required: true, unique: true, lowercase: true },
    password_hash: { type: String, required: true },
    name: { type: String, required: true },
    avatar_url: { type: String },
    email_verified: { type: Boolean, default: false },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    last_login: { type: Date }
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

const socialAccountSchema = new Schema<ISocialAccount>({
    user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    platform: { type: String, enum: ['google', 'vkontakte', 'apple', 'youtube', 'instagram', 'tiktok'], required: true },
    platform_user_id: { type: String, required: true },
    email: { type: String, required: true },
    username: { type: String },
    access_token: { type: String, required: true },
    refresh_token: { type: String },
    expires_at: { type: Date },
    profile_data: { type: Schema.Types.Mixed }
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

authUserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
    return compare(candidatePassword, this.password_hash);
};

authUserSchema.pre('save', async function (next) {
    if (!this.isModified('password_hash')) return next();
    this.password_hash = await hash(this.password_hash, 12);
    next();
});

socialAccountSchema.index({ user_id: 1, platform: 1 }, { unique: true });
socialAccountSchema.index({ platform: 1, platform_user_id: 1 }, { unique: true });
authUserSchema.index({ email: 1 });

export const User = model<IAuthUser>('User', authUserSchema);
export const SocialAccount = model<ISocialAccount>('SocialAccount', socialAccountSchema);