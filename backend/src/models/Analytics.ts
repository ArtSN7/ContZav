import { Schema, model, Document, Types } from 'mongoose';

export interface IAnalyticsData extends Document {
    content_id: Types.ObjectId;
    date: Date;
    views: number;
    reach: number;
    engagements: number;
    likes: number;
    comments: number;
    shares: number;
    followers_gained: number;
    created_at: Date;
}

export interface IContentAnalytics extends Document {
    content_id: Types.ObjectId;
    title: string;
    content_type: string;
    platform: string;
    total_views: number;
    total_reach: number;
    total_engagements: number;
    total_likes: number;
    total_comments: number;
    total_shares: number;
    engagement_rate: number;
    click_through_rate: number;
    followers_gained: number;
}

export interface IUserAnalytics extends Document {
    user_id: Types.ObjectId;
    period_start: Date;
    period_end: Date;
    total_views: number;
    total_reach: number;
    total_engagements: number;
    total_likes: number;
    total_comments: number;
    total_shares: number;
    total_followers_gained: number;
    avg_engagement_rate: number;
    avg_click_through_rate: number;
    platform_breakdown: IPlatformAnalytics[];
    demographic_data: IDemographicData;
    created_at: Date;
}

export interface IPlatformAnalytics {
    platform: string;
    views: number;
    reach: number;
    engagements: number;
    likes: number;
    comments: number;
    shares: number;
    engagement_rate: number;
}

export interface IDemographicData {
    age_groups: { age_group: string; percentage: number }[];
    genders: { gender: string; percentage: number }[];
    locations: { location: string; percentage: number }[];
}

export interface IStatistics extends Document {
    user_id: Types.ObjectId;
    date: Date;
    platform: string;
    followers_count: number;
    views_count: number;
    reactions_count: number;
    posts_count: number;
    videos_count: number;
    created_at: Date;
}

const analyticsDataSchema = new Schema<IAnalyticsData>({
    content_id: { type: Schema.Types.ObjectId, ref: 'Content', required: true },
    date: { type: Date, required: true },
    views: { type: Number, default: 0 },
    reach: { type: Number, default: 0 },
    engagements: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },
    comments: { type: Number, default: 0 },
    shares: { type: Number, default: 0 },
    followers_gained: { type: Number, default: 0 }
}, {
    timestamps: { createdAt: 'created_at' }
});

const userAnalyticsSchema = new Schema<IUserAnalytics>({
    user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    period_start: { type: Date, required: true },
    period_end: { type: Date, required: true },
    total_views: { type: Number, default: 0 },
    total_reach: { type: Number, default: 0 },
    total_engagements: { type: Number, default: 0 },
    total_likes: { type: Number, default: 0 },
    total_comments: { type: Number, default: 0 },
    total_shares: { type: Number, default: 0 },
    total_followers_gained: { type: Number, default: 0 },
    avg_engagement_rate: { type: Number, default: 0 },
    avg_click_through_rate: { type: Number, default: 0 },
    platform_breakdown: [{
        platform: { type: String, required: true },
        views: { type: Number, default: 0 },
        reach: { type: Number, default: 0 },
        engagements: { type: Number, default: 0 },
        likes: { type: Number, default: 0 },
        comments: { type: Number, default: 0 },
        shares: { type: Number, default: 0 },
        engagement_rate: { type: Number, default: 0 }
    }],
    demographic_data: {
        age_groups: [{
            age_group: { type: String, required: true },
            percentage: { type: Number, required: true }
        }],
        genders: [{
            gender: { type: String, required: true },
            percentage: { type: Number, required: true }
        }],
        locations: [{
            location: { type: String, required: true },
            percentage: { type: Number, required: true }
        }]
    }
}, {
    timestamps: { createdAt: 'created_at' }
});

const statisticsSchema = new Schema<IStatistics>({
    user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: Date, required: true },
    platform: { type: String, required: true },
    followers_count: { type: Number, default: 0 },
    views_count: { type: Number, default: 0 },
    reactions_count: { type: Number, default: 0 },
    posts_count: { type: Number, default: 0 },
    videos_count: { type: Number, default: 0 }
}, {
    timestamps: { createdAt: 'created_at' }
});

analyticsDataSchema.index({ content_id: 1, date: 1 });
userAnalyticsSchema.index({ user_id: 1, period_start: 1, period_end: 1 });
statisticsSchema.index({ user_id: 1, date: 1, platform: 1 });

export const AnalyticsData = model<IAnalyticsData>('AnalyticsData', analyticsDataSchema);
export const UserAnalytics = model<IUserAnalytics>('UserAnalytics', userAnalyticsSchema);
export const Statistics = model<IStatistics>('Statistics', statisticsSchema);