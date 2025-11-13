"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Heart, MessageCircle, ExternalLink } from "lucide-react";

interface TopPerformingContentProps {
  topContent: any[];
  loading: boolean;
}

export function TopPerformingContent({
  topContent,
  loading,
}: TopPerformingContentProps) {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Топ-5 контента</CardTitle>
          <CardDescription>
            Самый эффективный контент за выбранный период
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(5)].map((_, index) => (
              <div
                key={index}
                className="flex items-center space-x-4 p-4 border border-border rounded-lg animate-pulse"
              >
                <div className="w-8 h-8 bg-muted rounded-full" />
                <div className="w-20 h-15 bg-muted rounded-lg" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-muted rounded w-3/4" />
                  <div className="h-3 bg-muted rounded w-1/2" />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="text-center">
                      <div className="h-4 bg-muted rounded w-8 mx-auto mb-1" />
                      <div className="h-3 bg-muted rounded w-12 mx-auto" />
                    </div>
                  ))}
                </div>
                <div className="w-10 h-10 bg-muted rounded" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const formatNumber = (num: number): string => {
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Топ-{topContent.length} контента</CardTitle>
        <CardDescription>
          Самый эффективный контент за выбранный период
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {topContent.map((content, index) => (
            <div
              key={content.contentId || content.id}
              className="flex items-center space-x-4 p-4 border border-border rounded-lg"
            >
              <div className="flex-shrink-0 w-8 h-8 bg-accent text-accent-foreground rounded-full flex items-center justify-center font-bold">
                {index + 1}
              </div>

              <div className="flex-shrink-0">
                <div className="w-20 h-15 bg-muted rounded-lg flex items-center justify-center">
                  <span className="text-xs text-muted-foreground">
                    Изображение
                  </span>
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  <h3 className="text-sm font-medium truncate">
                    {content.title}
                  </h3>
                  <Badge variant="secondary" className="text-xs">
                    {content.contentType === "video" ? "Видео" : "Пост"}
                  </Badge>
                </div>
                <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                  <span>{content.platform}</span>
                </div>
              </div>

              <div className="flex-shrink-0 grid grid-cols-3 gap-4 text-center">
                <div className="space-y-1">
                  <div className="flex items-center justify-center space-x-1">
                    <Eye className="h-3 w-3" />
                    <span className="text-xs font-medium">
                      {formatNumber(content.totalViews)}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">Просмотры</p>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center justify-center space-x-1">
                    <Heart className="h-3 w-3" />
                    <span className="text-xs font-medium">
                      {formatNumber(content.totalLikes)}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">Лайки</p>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center justify-center space-x-1">
                    <MessageCircle className="h-3 w-3" />
                    <span className="text-xs font-medium">
                      {formatNumber(content.totalComments)}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">Комментарии</p>
                </div>
              </div>

              <div className="flex-shrink-0 text-center">
                <div className="text-sm font-bold text-accent">
                  {content.engagementRate?.toFixed(1)}%
                </div>
                <p className="text-xs text-muted-foreground">ER</p>
              </div>

              <div className="flex-shrink-0">
                <Button variant="ghost" size="icon">
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
