"use client"

import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card"
import {Badge} from "@/components/ui/badge"
import {Button} from "@/components/ui/button"
import {Eye, Heart, MessageCircle, ExternalLink} from "lucide-react"


const topContent = [
    {
        id: 1,
        title: "Топ-5 ошибок при выборе стройматериалов",
        type: "video",
        platform: "YouTube",
        thumbnail: "https://picsum.photos/200/300/",
        views: 15420,
        likes: 892,
        comments: 156,
        engagement: "8.2%",
        publishDate: "3 дня назад",
    },
    {
        id: 2,
        title: "Как правильно рассчитать количество материалов",
        type: "video",
        platform: "Instagram",
        thumbnail: "https://picsum.photos/240/300/",
        views: 12350,
        likes: 743,
        comments: 89,
        engagement: "6.7%",
        publishDate: "5 дней назад",
    },
    {
        id: 3,
        title: "Сезонные особенности строительных работ",
        type: "text",
        platform: "VK",
        thumbnail: "https://picsum.photos/230/300/",
        views: 8920,
        likes: 456,
        comments: 67,
        engagement: "5.9%",
        publishDate: "1 неделю назад",
    },
    {
        id: 4,
        title: "Обзор новых технологий в строительстве",
        type: "video",
        platform: "YouTube",
        thumbnail: "https://picsum.photos/220/300/",
        views: 7650,
        likes: 398,
        comments: 45,
        engagement: "5.8%",
        publishDate: "2 недели назад",
    },
    {
        id: 5,
        title: "Экологичные материалы для дома",
        type: "text",
        platform: "Telegram",
        thumbnail: "https://picsum.photos/210/300/",
        views: 6890,
        likes: 312,
        comments: 34,
        engagement: "5.0%",
        publishDate: "2 недели назад",
    },
]

export function TopPerformingContent() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Топ-5 контента</CardTitle>
                <CardDescription>Самый эффективный контент за выбранный период</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {topContent.map((content, index) => (
                        <div key={content.id}
                             className="flex items-center space-x-4 p-4 border border-border rounded-lg">
                            {/* Rank */}
                            <div
                                className="flex-shrink-0 w-8 h-8 bg-accent text-accent-foreground rounded-full flex items-center justify-center font-bold">
                                {index + 1}
                            </div>

                            {/* Thumbnail */}
                            <div className="flex-shrink-0">
                                <img
                                    src={content.thumbnail}
                                    alt={content.title}
                                    className="w-20 h-15 object-cover rounded-lg"
                                />
                            </div>

                            {/* Content Info */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center space-x-2 mb-1">
                                    <h3 className="text-sm font-medium truncate">{content.title}</h3>
                                    <Badge variant="secondary" className="text-xs">
                                        {content.type === "video" ? "Видео" : "Пост"}
                                    </Badge>
                                </div>
                                <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                                    <span>{content.platform}</span>
                                    <span>{content.publishDate}</span>
                                </div>
                            </div>

                            {/* Metrics */}
                            <div className="flex-shrink-0 grid grid-cols-3 gap-4 text-center">
                                <div className="space-y-1">
                                    <div className="flex items-center justify-center space-x-1">
                                        <Eye className="h-3 w-3"/>
                                        <span className="text-xs font-medium">{content.views.toLocaleString()}</span>
                                    </div>
                                    <p className="text-xs text-muted-foreground">Просмотры</p>
                                </div>
                                <div className="space-y-1">
                                    <div className="flex items-center justify-center space-x-1">
                                        <Heart className="h-3 w-3"/>
                                        <span className="text-xs font-medium">{content.likes}</span>
                                    </div>
                                    <p className="text-xs text-muted-foreground">Лайки</p>
                                </div>
                                <div className="space-y-1">
                                    <div className="flex items-center justify-center space-x-1">
                                        <MessageCircle className="h-3 w-3"/>
                                        <span className="text-xs font-medium">{content.comments}</span>
                                    </div>
                                    <p className="text-xs text-muted-foreground">Комментарии</p>
                                </div>
                            </div>

                            {/* Engagement Rate */}
                            <div className="flex-shrink-0 text-center">
                                <div className="text-sm font-bold text-accent">{content.engagement}</div>
                                <p className="text-xs text-muted-foreground">ER</p>
                            </div>

                            {/* Action */}
                            <div className="flex-shrink-0">
                                <Button variant="ghost" size="icon">
                                    <ExternalLink className="h-4 w-4"/>
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}
