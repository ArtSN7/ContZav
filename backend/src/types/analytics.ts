import { Document, Types } from 'mongoose';

export interface IAnalyticsData extends Document {
    content_id: Types.ObjectId;
    date: Date;
    views: number;
    reach: number;
    engagements: number;
    likes: number;
    comments: number;
    shares: number;
    saves: number;
    followers_gained: number;
    click_through_rate: number;
    engagement_rate: number;
    created_at: Date;
}

export interface IContentAnalytics {
    content_id: string;
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

export interface IUserAnalytics {
    total_views: number;
    total_reach: number;
    total_engagements: number;
    total_likes: number;
    total_comments: number;
    total_shares: number;
    total_followers_gained: number;
    avg_engagement_rate: number;
    avg_click_through_rate: number;
    top_content: IContentAnalytics[];
    platform_breakdown: IPlatformAnalytics[];
    demographic_data: IDemographicData;
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
    age_groups: IAgeGroupData[];
    genders: IGenderData[];
    locations: ILocationData[];
}

export interface IAgeGroupData {
    age_group: string;
    percentage: number;
}

export interface IGenderData {
    gender: string;
    percentage: number;
}

export interface ILocationData {
    location: string;
    percentage: number;
}