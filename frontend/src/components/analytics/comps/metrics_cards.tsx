"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Eye,
  Heart,
  MessageCircle,
  Share2,
  Users,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import { useApp } from "@/contexts/AppContext";

interface MetricsCardsProps {
  className?: string;
}

export function MetricsCards({ className }: MetricsCardsProps) {
  const { analyticsData, platformComparison, loadingAnalytics } = useApp();

  if (loadingAnalytics || !analyticsData) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, index) => (
          <Card key={index} className={className}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Загрузка...</CardTitle>
              <div className="h-4 w-4 bg-muted rounded animate-pulse" />
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-muted rounded animate-pulse mb-2" />
              <div className="h-6 bg-muted rounded animate-pulse" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  const getPercentageChange = (current: number, previous: number): string => {
    if (previous === 0) return current > 0 ? "+100%" : "0%";
    const change = ((current - previous) / previous) * 100;
    return `${change > 0 ? "+" : ""}${change.toFixed(1)}%`;
  };

  const getTrend = (current: number, previous: number): "up" | "down" => {
    if (previous === 0) return current > 0 ? "up" : "down";
    return current > previous ? "up" : "down";
  };

  const comparison = platformComparison?.comparison || {};

  const metrics = [
    {
      title: "Просмотры/Охват",
      value: formatNumber(analyticsData.totalViews),
      change: getPercentageChange(
        analyticsData.totalViews,
        platformComparison?.previous_period?.total_views || 0
      ),
      trend: getTrend(
        analyticsData.totalViews,
        platformComparison?.previous_period?.total_views || 0
      ),
      icon: Eye,
      description: "Общий охват за период",
    },
    {
      title: "Реакции",
      value: formatNumber(analyticsData.totalLikes),
      change: getPercentageChange(
        analyticsData.totalLikes,
        platformComparison?.previous_period?.total_likes || 0
      ),
      trend: getTrend(
        analyticsData.totalLikes,
        platformComparison?.previous_period?.total_likes || 0
      ),
      icon: Heart,
      description: "Лайки, сердечки, реакции",
    },
    {
      title: "Вовлеченность",
      value: formatNumber(analyticsData.totalEngagements),
      change: getPercentageChange(
        analyticsData.totalEngagements,
        platformComparison?.previous_period?.total_engagements || 0
      ),
      trend: getTrend(
        analyticsData.totalEngagements,
        platformComparison?.previous_period?.total_engagements || 0
      ),
      icon: MessageCircle,
      description: "Комментарии, репосты, сохранения",
    },
    {
      title: "Подписчики",
      value: `+${formatNumber(analyticsData.totalFollowersGained)}`,
      change: getPercentageChange(
        analyticsData.totalFollowersGained,
        platformComparison?.previous_period?.total_followers_gained || 0
      ),
      trend: getTrend(
        analyticsData.totalFollowersGained,
        platformComparison?.previous_period?.total_followers_gained || 0
      ),
      icon: Users,
      description: "Прирост подписчиков",
    },
    {
      title: "CTR",
      value: `${analyticsData.avgClickThroughRate.toFixed(1)}%`,
      change: getPercentageChange(
        analyticsData.avgClickThroughRate,
        platformComparison?.previous_period?.avg_click_through_rate || 0
      ),
      trend: getTrend(
        analyticsData.avgClickThroughRate,
        platformComparison?.previous_period?.avg_click_through_rate || 0
      ),
      icon: Share2,
      description: "Кликабельность контента",
    },
    {
      title: "Средний ER",
      value: `${analyticsData.avgEngagementRate.toFixed(1)}%`,
      change: getPercentageChange(
        analyticsData.avgEngagementRate,
        platformComparison?.previous_period?.avg_engagement_rate || 0
      ),
      trend: getTrend(
        analyticsData.avgEngagementRate,
        platformComparison?.previous_period?.avg_engagement_rate || 0
      ),
      icon: TrendingUp,
      description: "Engagement Rate",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {metrics.map((metric, index) => (
        <Card key={index} className={className}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {metric.title}
            </CardTitle>
            <metric.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metric.value}</div>
            <div className="flex items-center space-x-2 mt-2">
              <Badge
                variant={metric.trend === "up" ? "default" : "destructive"}
                className="text-xs"
              >
                {metric.trend === "up" ? (
                  <TrendingUp className="h-3 w-3 mr-1" />
                ) : (
                  <TrendingDown className="h-3 w-3 mr-1" />
                )}
                {metric.change}
              </Badge>
              <span className="text-xs text-muted-foreground">
                от прошлого месяца
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {metric.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
