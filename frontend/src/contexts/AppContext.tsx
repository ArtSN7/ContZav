import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { api } from "@/utils/api";
import { useAuth } from "./AuthContext";
import { useWebSocket } from "@/hooks/useWebSocket";

interface WebSocketMessage {
  type: "generation-progress" | "video-ready" | "content-ready";
  data: any;
}

interface AnalyticsData {
  totalViews: number;
  totalReach: number;
  totalEngagements: number;
  totalLikes: number;
  totalComments: number;
  totalShares: number;
  totalFollowersGained: number;
  avgEngagementRate: number;
  avgClickThroughRate: number;
  platformBreakdown: Array<{
    platform: string;
    views: number;
    reach: number;
    engagements: number;
    likes: number;
    comments: number;
    shares: number;
    engagementRate: number;
  }>;
  demographicData: {
    ageGroups: Array<{ ageGroup: string; percentage: number }>;
    genders: Array<{ gender: string; percentage: number }>;
    locations: Array<{ location: string; percentage: number }>;
  };
}

interface TopContent {
  contentId: string;
  title: string;
  contentType: string;
  platform: string;
  totalViews: number;
  totalReach: number;
  totalEngagements: number;
  totalLikes: number;
  totalComments: number;
  totalShares: number;
  engagementRate: number;
  clickThroughRate: number;
  followersGained: number;
}

interface SubscriptionData {
  plan: string;
  price: number;
  billingCycle: string;
  nextBilling: string;
  status: string;
  usage: {
    videosUsed: number;
    videosLimit: number;
    networksUsed: number;
    networksLimit: number;
  };
}

interface SecurityData {
  twoFactorEnabled: boolean;
  activeSessions: Array<{
    id: string;
    device: string;
    location: string;
    current: boolean;
    lastActive: string;
  }>;
}

interface ApiKeys {
  heygen_api_key: string;
  openai_api_key: string;
}

interface ProfileData {
  id: string;
  name: string;
  email: string;
  avatar_url?: string;
  bio?: string;
  website?: string;
  location?: string;
  phone?: string;
}

interface SocialAccount {
  provider: string;
  connected: boolean;
  username?: string;
  followers?: string;
  lastSync?: string;
}

interface Avatar {
  id: string;
  name: string;
  gender: string;
  style: string;
  avatar_url: string;
  created_at: string;
  usage_count: number;
  status: string;
}

interface ContentStats {
  published: number;
  views: string;
  engagement: string;
  platforms: number;
}

interface Platform {
  id: string;
  name: string;
  icon: string;
  connected: boolean;
  ready: boolean;
}

interface RecentActivity {
  type: "video" | "post";
  title: string;
  platform: string;
  time: string;
  status: "published" | "processing";
}

interface Competitor {
  id: string;
  name: string;
  platform: string;
  url?: string;
}

interface PublicationPlan {
  contentCount: number;
  selectedNetworks: string[];
  publicationType: "schedule" | "download";
  scheduledDate?: Date;
  scheduledTime?: string;
}

interface VideoPreviewData {
  id: string;
  title: string;
  duration: string;
  quality: string;
  format: string;
  avatar: string;
  videoUrl: string;
  script: string;
  status: "generating" | "ready" | "error";
}

interface AppContextType {
  isWebSocketConnected: boolean;
  connectWebSocket: () => void;
  disconnectWebSocket: () => void;

  generationProgress: { [key: string]: number };
  videoGenerationStatus: { [key: string]: string };

  securityData: SecurityData | null;
  loadingSecurity: boolean;
  toggle2FA: (enabled: boolean) => Promise<void>;
  terminateSession: (sessionId: string) => Promise<void>;
  terminateAllSessions: () => Promise<void>;

  apiKeys: ApiKeys;
  loadingApiKeys: boolean;
  updateApiKeys: (keys: Partial<ApiKeys>) => Promise<void>;

  profileData: ProfileData | null;
  loadingProfile: boolean;
  updateProfile: (data: Partial<ProfileData>) => Promise<void>;

  socialAccounts: SocialAccount[];
  loadingSocialAccounts: boolean;
  connectSocialAccount: (platform: string, data: any) => Promise<void>;
  disconnectSocialAccount: (platform: string) => Promise<void>;
  syncSocialAccount: (platform: string) => Promise<void>;
  updateSocialSettings: (platform: string, settings: any) => Promise<void>;

  subscriptionData: SubscriptionData | null;
  loadingSubscription: boolean;
  refreshSubscription: () => Promise<void>;
  cancelSubscription: () => Promise<void>;
  updateSubscription: (planId: string) => Promise<void>;

  avatars: Avatar[];
  loadingAvatars: boolean;
  refreshAvatars: () => Promise<void>;
  createAvatar: (data: any) => Promise<void>;
  deleteAvatar: (avatarId: string) => Promise<void>;

  contentStats: ContentStats | null;
  loadingContentStats: boolean;
  platforms: Platform[];
  loadingPlatforms: boolean;
  recentActivities: RecentActivity[];
  loadingRecentActivities: boolean;

  competitors: Competitor[];
  loadingCompetitors: boolean;
  selectedCompetitors: string[];
  setSelectedCompetitors: (competitors: string[]) => void;
  addCompetitor: (competitor: Omit<Competitor, "id">) => Promise<void>;
  removeCompetitor: (competitorId: string) => Promise<void>;
  refreshCompetitors: () => Promise<void>;

  publicationPlan: PublicationPlan | null;
  loadingPublicationPlan: boolean;
  updatePublicationPlan: (plan: Partial<PublicationPlan>) => Promise<void>;
  submitPublicationPlan: () => Promise<void>;
  downloadContentPackage: () => Promise<void>;

  videoPreview: VideoPreviewData | null;
  loadingVideoPreview: boolean;
  generateVideoPreview: (contentId: string) => Promise<void>;
  regenerateVideoPreview: (contentId: string) => Promise<void>;
  downloadVideo: (contentId: string) => Promise<void>;
  refreshVideoPreview: () => Promise<void>;

  analyticsData: AnalyticsData | null;
  loadingAnalytics: boolean;
  topContent: TopContent[];
  loadingTopContent: boolean;
  platformComparison: any;
  loadingPlatformComparison: boolean;
  statistics: any;
  loadingStatistics: boolean;

  fetchAnalytics: (params: {
    startDate?: Date;
    endDate?: Date;
    platform?: string;
  }) => Promise<void>;
  fetchTopContent: (params: {
    startDate?: Date;
    endDate?: Date;
    limit?: number;
  }) => Promise<void>;
  fetchPlatformComparison: (params: {
    startDate?: Date;
    endDate?: Date;
  }) => Promise<void>;
  fetchStatistics: (params: {
    startDate?: Date;
    endDate?: Date;
    platform?: string;
  }) => Promise<void>;
  exportAnalytics: (
    format: string,
    params: {
      startDate?: Date;
      endDate?: Date;
    }
  ) => Promise<string>;

  refreshProfile: () => Promise<void>;
  refreshSecurity: () => Promise<void>;
  refreshSocialAccounts: () => Promise<void>;
  refreshContentStats: () => Promise<void>;
  refreshPlatforms: () => Promise<void>;
  refreshRecentActivities: () => Promise<void>;

  dashboardStats: {
    totalViews: number;
    totalEngagements: number;
    totalFollowers: number;
    engagementRate: number;
  };
  loadingDashboardStats: boolean;
  refreshDashboardStats: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const { token } = useAuth();
  const { socket, isConnected } = useWebSocket();

  const [securityData, setSecurityData] = useState<SecurityData | null>(null);
  const [loadingSecurity, setLoadingSecurity] = useState(false);
  const [apiKeys, setApiKeys] = useState<ApiKeys>({
    heygen_api_key: "",
    openai_api_key: "",
  });
  const [loadingApiKeys, setLoadingApiKeys] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [socialAccounts, setSocialAccounts] = useState<SocialAccount[]>([]);
  const [loadingSocialAccounts, setLoadingSocialAccounts] = useState(false);
  const [subscriptionData, setSubscriptionData] =
    useState<SubscriptionData | null>(null);
  const [loadingSubscription, setLoadingSubscription] = useState(false);
  const [avatars, setAvatars] = useState<Avatar[]>([]);
  const [loadingAvatars, setLoadingAvatars] = useState(false);
  const [contentStats, setContentStats] = useState<ContentStats | null>(null);
  const [loadingContentStats, setLoadingContentStats] = useState(false);
  const [platforms, setPlatforms] = useState<Platform[]>([]);
  const [loadingPlatforms, setLoadingPlatforms] = useState(false);
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>(
    []
  );
  const [loadingRecentActivities, setLoadingRecentActivities] = useState(false);
  const [competitors, setCompetitors] = useState<Competitor[]>([]);
  const [loadingCompetitors, setLoadingCompetitors] = useState(false);
  const [selectedCompetitors, setSelectedCompetitors] = useState<string[]>([]);
  const [publicationPlan, setPublicationPlan] =
    useState<PublicationPlan | null>(null);
  const [loadingPublicationPlan, setLoadingPublicationPlan] = useState(false);
  const [videoPreview, setVideoPreview] = useState<VideoPreviewData | null>(
    null
  );
  const [loadingVideoPreview, setLoadingVideoPreview] = useState(false);

  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(
    null
  );
  const [loadingAnalytics, setLoadingAnalytics] = useState(false);
  const [topContent, setTopContent] = useState<TopContent[]>([]);
  const [loadingTopContent, setLoadingTopContent] = useState(false);
  const [platformComparison, setPlatformComparison] = useState<any>(null);
  const [loadingPlatformComparison, setLoadingPlatformComparison] =
    useState(false);
  const [statistics, setStatistics] = useState<any>(null);
  const [loadingStatistics, setLoadingStatistics] = useState(false);

  const [generationProgress, setGenerationProgress] = useState<{
    [key: string]: number;
  }>({});
  const [videoGenerationStatus, setVideoGenerationStatus] = useState<{
    [key: string]: string;
  }>({});

  const [dashboardStats, setDashboardStats] = useState({
    totalViews: 0,
    totalEngagements: 0,
    totalFollowers: 0,
    engagementRate: 0,
  });
  const [loadingDashboardStats, setLoadingDashboardStats] = useState(false);

  useEffect(() => {
    if (socket) {
      socket.on("generation-progress", (data: any) => {
        setGenerationProgress((prev) => ({
          ...prev,
          [data.contentId]: data.progress,
        }));
      });

      socket.on("video-ready", (data: any) => {
        setVideoGenerationStatus((prev) => ({
          ...prev,
          [data.contentId]: "ready",
        }));
        if (videoPreview?.id === data.contentId) {
          refreshVideoPreview();
        }
      });

      socket.on("content-ready", () => {
        refreshRecentActivities();
        refreshContentStats();
      });
    }

    return () => {
      if (socket) {
        socket.off("generation-progress");
        socket.off("video-ready");
        socket.off("content-ready");
      }
    };
  }, [socket, videoPreview]);

  const connectWebSocket = () => {
    console.log("WebSocket connection managed by Socket.IO");
  };

  const disconnectWebSocket = () => {
    if (socket) {
      socket.disconnect();
    }
  };

  const fetchSecurityData = async () => {
    setLoadingSecurity(true);
    try {
      const sessionsData = await api.get("/user/sessions");
      let twoFactorEnabled = false;

      try {
        const twoFactorData = await api.get("/user/two-factor");
        twoFactorEnabled = twoFactorData.data?.enabled || false;
      } catch (error) {
        console.warn("Two-factor endpoint not available");
      }

      const sessions = sessionsData.success
        ? sessionsData.data.map((session: any) => ({
            id: session._id || session.id,
            device: session.device_info,
            location: session.location,
            current:
              session.last_activity > new Date(Date.now() - 5 * 60 * 1000),
            lastActive: formatLastActive(session.last_activity),
          }))
        : [];

      setSecurityData({
        twoFactorEnabled,
        activeSessions: sessions,
      });
    } catch (error) {
      console.error("Error fetching security data:", error);
      setSecurityData({
        twoFactorEnabled: false,
        activeSessions: [],
      });
    } finally {
      setLoadingSecurity(false);
    }
  };

  const toggle2FA = async (enabled: boolean): Promise<void> => {
    try {
      if (enabled) {
        await api.post("/user/two-factor/enable");
      } else {
        await api.post("/user/two-factor/disable");
      }
      await fetchSecurityData();
    } catch (error: any) {
      throw new Error(error.message || "Ошибка при изменении настроек 2FA");
    }
  };

  const terminateSession = async (sessionId: string): Promise<void> => {
    try {
      await api.delete(`/user/sessions/${sessionId}`);
      await fetchSecurityData();
    } catch (error: any) {
      throw new Error(error.message || "Ошибка при завершении сессии");
    }
  };

  const terminateAllSessions = async (): Promise<void> => {
    try {
      await api.delete("/user/sessions");
      await fetchSecurityData();
    } catch (error: any) {
      throw new Error(error.message || "Ошибка при завершении всех сессий");
    }
  };

  const fetchApiKeys = async () => {
    setLoadingApiKeys(true);
    try {
      const response = await api.get("/ai/api-keys");
      if (response.success) {
        setApiKeys(response.data);
      }
    } catch (error) {
      console.error("Error fetching API keys:", error);
    } finally {
      setLoadingApiKeys(false);
    }
  };

  const updateApiKeys = async (keys: Partial<ApiKeys>): Promise<void> => {
    try {
      const response = await api.put("/ai/api-keys", keys);
      if (response.success) {
        setApiKeys((prev) => ({ ...prev, ...keys }));
      } else {
        throw new Error(response.error || "Ошибка при сохранении API ключей");
      }
    } catch (error: any) {
      throw new Error(error.message || "Ошибка при сохранении API ключей");
    }
  };

  const fetchProfileData = async () => {
    setLoadingProfile(true);
    try {
      const data = await api.get("/user/profile");
      if (data.success) {
        setProfileData(data.data.user);
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoadingProfile(false);
    }
  };

  const updateProfile = async (
    profileData: Partial<ProfileData>
  ): Promise<void> => {
    try {
      const data = await api.put("/user/profile", profileData);
      if (data.success) {
        setProfileData(data.data.user);
      }
    } catch (error: any) {
      throw new Error(error.message || "Ошибка при обновлении профиля");
    }
  };

  const fetchSocialAccounts = async () => {
    setLoadingSocialAccounts(true);
    try {
      const data = await api.get("/user/social-accounts");
      if (data.success) {
        setSocialAccounts(data.data);
      }
    } catch (error) {
      console.error("Error fetching social accounts:", error);
    } finally {
      setLoadingSocialAccounts(false);
    }
  };

  const connectSocialAccount = async (
    platform: string,
    accountData: any
  ): Promise<void> => {
    try {
      await api.post(`/user/social-accounts/connect/${platform}`, accountData);
      await fetchSocialAccounts();
    } catch (error: any) {
      throw new Error(error.message || "Ошибка при подключении аккаунта");
    }
  };

  const disconnectSocialAccount = async (platform: string): Promise<void> => {
    try {
      await api.delete(`/user/social-accounts/disconnect/${platform}`);
      await fetchSocialAccounts();
    } catch (error: any) {
      throw new Error(error.message || "Ошибка при отключении аккаунта");
    }
  };

  const syncSocialAccount = async (platform: string): Promise<void> => {
    try {
      await api.post(`/user/social-accounts/sync/${platform}`);
      await fetchSocialAccounts();
    } catch (error: any) {
      throw new Error(error.message || "Ошибка при синхронизации аккаунта");
    }
  };

  const updateSocialSettings = async (
    platform: string,
    settings: any
  ): Promise<void> => {
    try {
      await api.put(`/user/social-accounts/settings/${platform}`, settings);
      await fetchSocialAccounts();
    } catch (error: any) {
      throw new Error(error.message || "Ошибка при обновлении настроек");
    }
  };

  const fetchSubscriptionData = async () => {
    setLoadingSubscription(true);
    try {
      const data = await api.get("/subscription/user");
      if (data.success) {
        setSubscriptionData(data.data);
      }
    } catch (error) {
      console.error("Error fetching subscription:", error);
    } finally {
      setLoadingSubscription(false);
    }
  };

  const cancelSubscription = async (): Promise<void> => {
    try {
      await api.delete("/subscription/user");
      await fetchSubscriptionData();
    } catch (error: any) {
      throw new Error(error.message || "Ошибка при отмене подписки");
    }
  };

  const updateSubscription = async (planId: string): Promise<void> => {
    try {
      await api.put("/subscription/user", { planId });
      await fetchSubscriptionData();
    } catch (error: any) {
      throw new Error(error.message || "Ошибка при обновлении подписки");
    }
  };

  const fetchAvatars = async () => {
    setLoadingAvatars(true);
    try {
      const data = await api.get("/ai/content");
      if (data.success) {
        const avatarContent = data.data
          .filter(
            (content: any) =>
              content.content_type === "video" && content.parameters?.avatarId
          )
          .map((content: any) => ({
            id: content._id || content.id,
            name: content.title || "Аватар",
            gender: content.parameters?.gender || "Не указан",
            style: content.parameters?.style || "Стандартный",
            avatar_url: content.avatar_url || "",
            created_at: content.created_at || content.createdAt,
            usage_count: content.usage_count || 0,
            status: content.status === "published" ? "active" : "inactive",
          }));
        setAvatars(avatarContent);
      }
    } catch (error) {
      console.error("Error fetching avatars:", error);
      setAvatars([]);
    } finally {
      setLoadingAvatars(false);
    }
  };

  const createAvatar = async (avatarData: any): Promise<void> => {
    try {
      await api.post("/content/generate-ai", avatarData);
      await fetchAvatars();
    } catch (error: any) {
      throw new Error(error.message || "Ошибка при создании аватара");
    }
  };

  const deleteAvatar = async (avatarId: string): Promise<void> => {
    try {
      await api.delete(`/content/${avatarId}`);
      await fetchAvatars();
    } catch (error: any) {
      throw new Error(error.message || "Ошибка при удалении аватара");
    }
  };

  const fetchContentStats = async () => {
    setLoadingContentStats(true);
    try {
      const [contentData, analyticsData] = await Promise.all([
        api.get("/content/stats"),
        api.get("/analytics/statistics"),
      ]);

      const stats = {
        published: contentData.success ? contentData.data.published || 0 : 0,
        views: analyticsData.success
          ? formatViews(analyticsData.data.totalViews || 0)
          : "0",
        engagement: analyticsData.success
          ? `${analyticsData.data.engagementRate || 0}%`
          : "0%",
        platforms: socialAccounts.filter((account) => account.connected).length,
      };

      setContentStats(stats);
    } catch (error) {
      console.error("Error fetching content stats:", error);
      setContentStats({
        published: 0,
        views: "0",
        engagement: "0%",
        platforms: 0,
      });
    } finally {
      setLoadingContentStats(false);
    }
  };

  const fetchPlatforms = async () => {
    setLoadingPlatforms(true);
    try {
      const accounts = await api.get("/user/social-accounts");
      const platformData = accounts.success
        ? accounts.data.map((account: any) => ({
            id: account.provider,
            name: getPlatformDisplayName(account.provider),
            icon: getPlatformIcon(account.provider),
            connected: account.connected,
            ready: account.connected,
          }))
        : [];

      setPlatforms(platformData);
    } catch (error) {
      console.error("Error fetching platforms:", error);
      setPlatforms([]);
    } finally {
      setLoadingPlatforms(false);
    }
  };

  const fetchRecentActivities = async () => {
    setLoadingRecentActivities(true);
    try {
      const contentData = await api.get("/content");
      const activities = contentData.success
        ? contentData.data.slice(0, 3).map((content: any) => ({
            type: content.content_type === "video" ? "video" : "post",
            title: content.title || "Без названия",
            platform: content.platform || "Не указана",
            time: formatTimeAgo(content.created_at || content.createdAt),
            status: content.status === "published" ? "published" : "processing",
          }))
        : [];

      setRecentActivities(activities);
    } catch (error) {
      console.error("Error fetching recent activities:", error);
      setRecentActivities([]);
    } finally {
      setLoadingRecentActivities(false);
    }
  };

  const fetchCompetitors = async () => {
    setLoadingCompetitors(true);
    try {
      const data = await api.get("/ai/competitors");
      if (data.success) {
        setCompetitors(data.data);
      }
    } catch (error) {
      console.error("Error fetching competitors:", error);
      setCompetitors([]);
    } finally {
      setLoadingCompetitors(false);
    }
  };

  const addCompetitor = async (
    competitor: Omit<Competitor, "id">
  ): Promise<void> => {
    try {
      const response = await api.post("/ai/competitors", competitor);
      if (response.success) {
        await fetchCompetitors();
      }
    } catch (error: any) {
      throw new Error(error.message || "Ошибка при добавлении конкурента");
    }
  };

  const removeCompetitor = async (competitorId: string): Promise<void> => {
    try {
      await api.delete(`/ai/competitors/${competitorId}`);
      await fetchCompetitors();
    } catch (error: any) {
      throw new Error(error.message || "Ошибка при удалении конкурента");
    }
  };

  const updatePublicationPlan = async (
    plan: Partial<PublicationPlan>
  ): Promise<void> => {
    try {
      setPublicationPlan((prev) =>
        prev
          ? { ...prev, ...plan }
          : {
              contentCount: 1,
              selectedNetworks: [],
              publicationType: "schedule",
              ...plan,
            }
      );
    } catch (error: any) {
      throw new Error(
        error.message || "Ошибка при обновлении плана публикации"
      );
    }
  };

  const submitPublicationPlan = async (): Promise<void> => {
    if (!publicationPlan) return;

    try {
      const response = await api.post("/content/schedule", publicationPlan);
      if (!response.success) {
        throw new Error("Failed to submit publication plan");
      }
    } catch (error: any) {
      throw new Error(error.message || "Ошибка при отправке плана публикации");
    }
  };

  const downloadContentPackage = async (): Promise<void> => {
    if (!publicationPlan) return;

    try {
      const response = await api.post(
        "/content/download-package",
        publicationPlan
      );
      if (response.success && response.data.downloadUrl) {
        window.open(response.data.downloadUrl, "_blank");
      }
    } catch (error: any) {
      throw new Error(error.message || "Ошибка при скачивании пакета контента");
    }
  };

  const generateVideoPreview = async (contentId: string): Promise<void> => {
    setLoadingVideoPreview(true);
    try {
      const response = await api.post(`/ai/content/${contentId}/video`);
      if (response.success) {
        setVideoPreview({
          id: contentId,
          title: response.data.title || "Видео",
          duration: response.data.duration || "45 сек",
          quality: response.data.quality || "HD 1080p",
          format: response.data.format || "MP4 (9:16)",
          avatar: response.data.avatar || "Основной Аватар",
          videoUrl: response.data.videoUrl || "",
          script: response.data.script || "",
          status: "ready",
        });
      }
    } catch (error) {
      console.error("Error generating video preview:", error);
      setVideoPreview(null);
    } finally {
      setLoadingVideoPreview(false);
    }
  };

  const regenerateVideoPreview = async (contentId: string): Promise<void> => {
    setLoadingVideoPreview(true);
    try {
      const response = await api.post(`/ai/content/${contentId}/regenerate`);
      if (response.success) {
        await generateVideoPreview(contentId);
      }
    } catch (error) {
      console.error("Error regenerating video:", error);
      setLoadingVideoPreview(false);
    }
  };

  const downloadVideo = async (contentId: string): Promise<void> => {
    try {
      const response = await api.get(`/ai/content/${contentId}/download`);
      if (response.success && response.data.downloadUrl) {
        window.open(response.data.downloadUrl, "_blank");
      }
    } catch (error: any) {
      throw new Error(error.message || "Ошибка при скачивании видео");
    }
  };

  const refreshVideoPreview = async (): Promise<void> => {
    if (videoPreview) {
      await generateVideoPreview(videoPreview.id);
    }
  };

  const fetchAnalytics = async (params: {
    startDate?: Date;
    endDate?: Date;
    platform?: string;
  }): Promise<void> => {
    setLoadingAnalytics(true);
    try {
      const queryParams = new URLSearchParams();
      if (params.startDate)
        queryParams.append("startDate", params.startDate.toISOString());
      if (params.endDate)
        queryParams.append("endDate", params.endDate.toISOString());
      if (params.platform) queryParams.append("platform", params.platform);

      const response = await api.get(`/analytics/user?${queryParams}`);

      if (response.success) {
        const data = response.data;
        setAnalyticsData({
          totalViews: data.total_views || 0,
          totalReach: data.total_reach || 0,
          totalEngagements: data.total_engagements || 0,
          totalLikes: data.total_likes || 0,
          totalComments: data.total_comments || 0,
          totalShares: data.total_shares || 0,
          totalFollowersGained: data.total_followers_gained || 0,
          avgEngagementRate: data.avg_engagement_rate || 0,
          avgClickThroughRate: data.avg_click_through_rate || 0,
          platformBreakdown: data.platform_breakdown || [],
          demographicData: data.demographic_data || {
            ageGroups: [],
            genders: [],
            locations: [],
          },
        });
      }
    } catch (error) {
      console.error("Error fetching analytics:", error);
      setAnalyticsData(null);
    } finally {
      setLoadingAnalytics(false);
    }
  };

  const fetchTopContent = async (params: {
    startDate?: Date;
    endDate?: Date;
    limit?: number;
  }): Promise<void> => {
    setLoadingTopContent(true);
    try {
      const queryParams = new URLSearchParams();
      if (params.startDate)
        queryParams.append("startDate", params.startDate.toISOString());
      if (params.endDate)
        queryParams.append("endDate", params.endDate.toISOString());
      if (params.limit) queryParams.append("limit", params.limit.toString());

      const response = await api.get(`/analytics/top-content?${queryParams}`);

      if (response.success) {
        const data = response.data;
        setTopContent(
          data.map((item: any) => ({
            contentId: item.content_id,
            title: item.title,
            contentType: item.content_type,
            platform: item.platform,
            totalViews: item.total_views,
            totalReach: item.total_reach,
            totalEngagements: item.total_engagements,
            totalLikes: item.total_likes,
            totalComments: item.total_comments,
            totalShares: item.total_shares,
            engagementRate: item.engagement_rate,
            clickThroughRate: item.click_through_rate,
            followersGained: item.followers_gained,
          }))
        );
      }
    } catch (error) {
      console.error("Error fetching top content:", error);
      setTopContent([]);
    } finally {
      setLoadingTopContent(false);
    }
  };

  const fetchPlatformComparison = async (params: {
    startDate?: Date;
    endDate?: Date;
  }): Promise<void> => {
    setLoadingPlatformComparison(true);
    try {
      const queryParams = new URLSearchParams();
      if (params.startDate)
        queryParams.append("startDate", params.startDate.toISOString());
      if (params.endDate)
        queryParams.append("endDate", params.endDate.toISOString());

      const response = await api.get(
        `/analytics/platform-comparison?${queryParams}`
      );

      if (response.success) {
        setPlatformComparison(response.data);
      }
    } catch (error) {
      console.error("Error fetching platform comparison:", error);
      setPlatformComparison(null);
    } finally {
      setLoadingPlatformComparison(false);
    }
  };

  const fetchStatistics = async (params: {
    startDate?: Date;
    endDate?: Date;
    platform?: string;
  }): Promise<void> => {
    setLoadingStatistics(true);
    try {
      const queryParams = new URLSearchParams();
      if (params.startDate)
        queryParams.append("startDate", params.startDate.toISOString());
      if (params.endDate)
        queryParams.append("endDate", params.endDate.toISOString());
      if (params.platform) queryParams.append("platform", params.platform);

      const response = await api.get(`/analytics/statistics?${queryParams}`);

      if (response.success) {
        const statsData = Array.isArray(response.data) ? response.data : [];
        setStatistics(statsData);
      }
    } catch (error) {
      console.error("Error fetching statistics:", error);
      setStatistics([]);
    } finally {
      setLoadingStatistics(false);
    }
  };

  const fetchDashboardStats = async () => {
    setLoadingDashboardStats(true);
    try {
      const [analyticsResponse, contentResponse] = await Promise.all([
        api.get("/analytics/user"),
        api.get("/content/stats"),
      ]);

      if (analyticsResponse.success) {
        const analyticsData = analyticsResponse.data;
        setDashboardStats({
          totalViews: analyticsData.total_views || 0,
          totalEngagements: analyticsData.total_engagements || 0,
          totalFollowers: analyticsData.total_followers_gained || 0,
          engagementRate: analyticsData.avg_engagement_rate || 0,
        });
      }
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      setDashboardStats({
        totalViews: 0,
        totalEngagements: 0,
        totalFollowers: 0,
        engagementRate: 0,
      });
    } finally {
      setLoadingDashboardStats(false);
    }
  };

  const exportAnalytics = async (
    format: string,
    params: {
      startDate?: Date;
      endDate?: Date;
    }
  ): Promise<string> => {
    try {
      const queryParams = new URLSearchParams();
      queryParams.append("format", format);
      if (params.startDate)
        queryParams.append("startDate", params.startDate.toISOString());
      if (params.endDate)
        queryParams.append("endDate", params.endDate.toISOString());

      const response = await api.get(`/analytics/export?${queryParams}`);

      if (response.success && response.data.downloadUrl) {
        return response.data.downloadUrl;
      }
      throw new Error("Export failed");
    } catch (error: any) {
      throw new Error(error.message || "Ошибка при экспорте аналитики");
    }
  };

  const formatLastActive = (date: Date): string => {
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days} дней назад`;
    if (hours > 0) return `${hours} часов назад`;
    if (minutes > 0) return `${minutes} минут назад`;
    return "Сейчас";
  };

  const formatViews = (views: number): string => {
    if (views >= 1000000) {
      return `${(views / 1000000).toFixed(1)}M`;
    }
    if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}K`;
    }
    return views.toString();
  };

  const formatTimeAgo = (date: string): string => {
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));

    if (hours < 1) return "Только что";
    if (hours < 24) return `${hours} часов назад`;
    return `${Math.floor(hours / 24)} дней назад`;
  };

  const getPlatformIcon = (platform: string): string => {
    const icons: { [key: string]: string } = {
      google: "/icons/google.png",
      vk: "/icons/vk.png",
      yandex: "/icons/yandex.png",
      youtube: "/icons/youtube.png",
      tiktok: "/icons/tiktok.png",
      telegram: "/icons/telegram.png",
      instagram: "/icons/instagram.png",
      facebook: "/icons/facebook.png",
      twitter: "/icons/twitter.png",
    };
    return icons[platform.toLowerCase()] || "/icons/default.png";
  };

  const getPlatformDisplayName = (platform: string): string => {
    const names: { [key: string]: string } = {
      google: "Google",
      vk: "ВКонтакте",
      yandex: "Яндекс",
      youtube: "YouTube",
      tiktok: "TikTok",
      telegram: "Telegram",
      instagram: "Instagram",
      facebook: "Facebook",
      twitter: "Twitter",
    };
    return names[platform.toLowerCase()] || platform;
  };

  const refreshProfile = async () => {
    await fetchProfileData();
  };

  const refreshSecurity = async () => {
    await fetchSecurityData();
  };

  const refreshSocialAccounts = async () => {
    await fetchSocialAccounts();
  };

  const refreshSubscription = async () => {
    await fetchSubscriptionData();
  };

  const refreshAvatars = async () => {
    await fetchAvatars();
  };

  const refreshContentStats = async () => {
    await fetchContentStats();
  };

  const refreshPlatforms = async () => {
    await fetchPlatforms();
  };

  const refreshRecentActivities = async () => {
    await fetchRecentActivities();
  };

  const refreshCompetitors = async () => {
    await fetchCompetitors();
  };

  const refreshDashboardStats = async () => {
    await fetchDashboardStats();
  };

  useEffect(() => {
    if (token) {
      fetchProfileData();
      fetchSecurityData();
      fetchSocialAccounts();
      fetchSubscriptionData();
      fetchApiKeys();
      fetchAvatars();
      fetchContentStats();
      fetchPlatforms();
      fetchRecentActivities();
      fetchCompetitors();
      fetchDashboardStats();

      const defaultStartDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      const defaultEndDate = new Date();

      fetchAnalytics({ startDate: defaultStartDate, endDate: defaultEndDate });
      fetchTopContent({
        startDate: defaultStartDate,
        endDate: defaultEndDate,
        limit: 5,
      });
      fetchPlatformComparison({
        startDate: defaultStartDate,
        endDate: defaultEndDate,
      });
      fetchStatistics({ startDate: defaultStartDate, endDate: defaultEndDate });
    }
  }, [token]);

  const value: AppContextType = {
    securityData,
    loadingSecurity,
    toggle2FA,
    terminateSession,
    terminateAllSessions,
    apiKeys,
    loadingApiKeys,
    updateApiKeys,
    profileData,
    loadingProfile,
    updateProfile,
    socialAccounts,
    loadingSocialAccounts,
    connectSocialAccount,
    disconnectSocialAccount,
    syncSocialAccount,
    updateSocialSettings,
    subscriptionData,
    loadingSubscription,
    refreshProfile,
    refreshSecurity,
    refreshSocialAccounts,
    refreshSubscription,
    cancelSubscription,
    updateSubscription,
    avatars,
    loadingAvatars,
    refreshAvatars,
    createAvatar,
    deleteAvatar,
    contentStats,
    loadingContentStats,
    platforms,
    loadingPlatforms,
    recentActivities,
    loadingRecentActivities,
    competitors,
    loadingCompetitors,
    selectedCompetitors,
    setSelectedCompetitors,
    addCompetitor,
    removeCompetitor,
    refreshCompetitors,
    publicationPlan,
    loadingPublicationPlan,
    updatePublicationPlan,
    submitPublicationPlan,
    downloadContentPackage,
    videoPreview,
    loadingVideoPreview,
    generateVideoPreview,
    regenerateVideoPreview,
    downloadVideo,
    refreshVideoPreview,
    analyticsData,
    loadingAnalytics,
    topContent,
    loadingTopContent,
    platformComparison,
    loadingPlatformComparison,
    statistics,
    loadingStatistics,
    fetchAnalytics,
    fetchTopContent,
    fetchPlatformComparison,
    fetchStatistics,
    exportAnalytics,
    refreshContentStats,
    refreshPlatforms,
    refreshRecentActivities,
    dashboardStats,
    loadingDashboardStats,
    refreshDashboardStats,
    isWebSocketConnected: isConnected,
    generationProgress,
    videoGenerationStatus,
    connectWebSocket,
    disconnectWebSocket,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
