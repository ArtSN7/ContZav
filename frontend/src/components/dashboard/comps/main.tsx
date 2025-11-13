import { Button } from "@/components/ui/button.tsx";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx";
import { Badge } from "@/components/ui/badge.tsx";
import {
  PlusCircle,
  BarChart3,
  Eye,
  Heart,
  Share2,
  TrendingUp,
  Video,
  FileText,
  Calendar,
  Users,
} from "lucide-react";
import { useNavigate } from "react-router";
import { CONTENT_CREATE_ROUTE, ANALYTICS_ROUTE } from "@/utils/CONSTANTS.ts";
import { useApp } from "@/contexts/AppContext";

import GoogleLogo from "../../../utils/icons/GoogleLogo.png";
import VKLogo from "../../../utils/icons/VKLogo.png";
import YandexLogo from "../../../utils/icons/YandexLogo.png";
import YouTubeLogo from "../../../utils/icons/YtLogo.png";
import TikTokLogo from "../../../utils/icons/TikTokLogo.png";
import TelegramLogo from "../../../utils/icons/TgLogo.png";
import InstagramLogo from "../../../utils/icons/InstaLogo.png";
import AppleLogo from "../../../utils/icons/AppleLogo.png";

export function DashboardContent() {
  const {
    contentStats,
    platforms,
    recentActivities,
    dashboardStats,
    loadingContentStats,
    loadingPlatforms,
    loadingRecentActivities,
    loadingDashboardStats,
    refreshContentStats,
    refreshPlatforms,
    refreshRecentActivities,
    refreshDashboardStats,
  } = useApp();

  const navigate = useNavigate();

  const handleNavigationToCreateContent = () => {
    navigate(CONTENT_CREATE_ROUTE);
  };

  const handleNavigationToAnalytics = () => {
    navigate(ANALYTICS_ROUTE);
  };

  const getPlatformIcon = (platformName: string) => {
    console.log({ platformName });
    const icons: { [key: string]: string } = {
      google: GoogleLogo,
      vk: VKLogo,
      yandex: YandexLogo,
      youtube: YouTubeLogo,
      tiktok: TikTokLogo,
      telegram: TelegramLogo,
      instagram: InstagramLogo,
      apple: AppleLogo,
    };
    return icons[platformName.toLowerCase()] || YandexLogo;
  };

  const stats = [
    {
      title: "Опубликовано",
      value: loadingContentStats
        ? "..."
        : contentStats?.published?.toString() || "0",
      description: "роликов и постов",
      icon: Video,
    },
    {
      title: "Просмотры",
      value: loadingDashboardStats
        ? "..."
        : dashboardStats.totalViews.toLocaleString() || "0",
      description: "Общее количество просмотров",
      icon: Eye,
    },
    {
      title: "Вовлеченность",
      value: loadingDashboardStats
        ? "..."
        : `${dashboardStats.engagementRate.toFixed(1)}%` || "0%",
      description: "Средний показатель вовлеченности",
      icon: Heart,
    },
    {
      title: "Подписчики",
      value: loadingDashboardStats
        ? "..."
        : dashboardStats.totalFollowers.toLocaleString() || "0",
      description: "Новых подписчиков",
      icon: Users,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Добро пожаловать</h1>
        <p className="text-muted-foreground">
          Управляйте своим контентом и отслеживайте результаты
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <PlusCircle className="h-5 w-5" />
              <span>Быстрые действия</span>
            </CardTitle>
            <CardDescription>
              Создайте новый контент или просмотрите аналитику
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              onClick={() => handleNavigationToCreateContent()}
              className="w-full justify-start space-x-2 h-12"
              size="lg"
            >
              <Video className="h-5 w-5" />
              <span>Создать новый контент</span>
            </Button>
            <Button
              onClick={() => handleNavigationToAnalytics()}
              variant="outline"
              className="w-full justify-start space-x-2 h-12 bg-transparent"
              size="lg"
            >
              <BarChart3 className="h-5 w-5" />
              <span>Посмотреть аналитику</span>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5" />
              <span>Подключенные платформы</span>
            </CardTitle>
            <CardDescription>Ваши активные социальные сети</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              {loadingPlatforms ? (
                <div className="col-span-2 text-center py-4">
                  <div className="animate-pulse">Загрузка платформ...</div>
                </div>
              ) : platforms.length > 0 ? (
                platforms.map((platform, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-2 p-3 border border-border rounded-lg"
                  >
                    <div className="w-8 h-8 rounded-full flex items-center justify-center bg-muted">
                      <img
                        src={getPlatformIcon(platform.name)}
                        alt={platform.name}
                        className="w-4 h-4"
                      />
                    </div>
                    <span className="text-sm font-medium">{platform.name}</span>
                    <Badge
                      variant={platform.connected ? "default" : "secondary"}
                      className="ml-auto"
                    >
                      {platform.connected ? "Подключено" : "Не подключено"}
                    </Badge>
                  </div>
                ))
              ) : (
                <div className="col-span-2 text-center py-4 text-muted-foreground">
                  Нет подключенных платформ
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="h-5 w-5" />
            <span>Недавняя активность</span>
          </CardTitle>
          <CardDescription>
            Последние опубликованные материалы и уведомления
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {loadingRecentActivities ? (
              <div className="text-center py-4">
                <div className="animate-pulse">Загрузка активностей...</div>
              </div>
            ) : recentActivities.length > 0 ? (
              recentActivities.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-4 p-4 border border-border rounded-lg"
                >
                  <div className="flex-shrink-0">
                    {item.type === "video" ? (
                      <Video className="h-8 w-8 text-accent" />
                    ) : (
                      <FileText className="h-8 w-8 text-accent" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {item.title}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {item.platform} • {item.time}
                    </p>
                  </div>
                  <Badge
                    variant={
                      item.status === "published" ? "default" : "secondary"
                    }
                  >
                    {item.status === "published" ? "Опубликовано" : "Обработка"}
                  </Badge>
                </div>
              ))
            ) : (
              <div className="text-center py-4 text-muted-foreground">
                Нет недавней активности
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
