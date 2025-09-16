export interface AnalyticsData {
    id: string;
    content_id: string;
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

export interface ContentAnalytics {
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

export interface UserAnalytics {
    total_views: number;
    total_reach: number;
    total_engagements: number;
    total_likes: number;
    total_comments: number;
    total_shares: number;
    total_followers_gained: number;
    avg_engagement_rate: number;
    avg_click_through_rate: number;
    top_content: ContentAnalytics[];
    platform_breakdown: PlatformAnalytics[];
    demographic_data: DemographicData;
}

export interface PlatformAnalytics {
    platform: string;
    views: number;
    reach: number;
    engagements: number;
    likes: number;
    comments: number;
    shares: number;
    engagement_rate: number;
}

export interface DemographicData {
    age_groups: AgeGroupData[];
    genders: GenderData[];
    locations: LocationData[];
}

export interface AgeGroupData {
    age_group: string;
    percentage: number;
}

export interface GenderData {
    gender: string;
    percentage: number;
}

export interface LocationData {
    location: string;
    percentage: number;
}