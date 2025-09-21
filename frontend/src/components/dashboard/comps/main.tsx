import {Button} from "@/components/ui/button.tsx"
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card.tsx"
import {Badge} from "@/components/ui/badge.tsx"
import {PlusCircle, BarChart3, Eye, Heart, Share2, TrendingUp, Video, FileText, Calendar} from "lucide-react"

import YtLogo from "../../../utils/icons/YtLogo.png"
import TgLogo from "../../../utils/icons/TgLogo.png"
import TikTokLogo from "../../../utils/icons/TikTokLogo.png"
import {useNavigate} from "react-router";

import {CONTENT_CREATE_ROUTE, ANALYTICS_ROUTE} from "@/utils/CONSTANTS.ts";


// Функции для получения данных (пока с мок-данными)
const getStats = () => {
    return [
        {
            title: "Опубликовано",
            value: "3",
            description: "роликов и постов",
            icon: Video,
        },
        {
            title: "Просмотры",
            value: "0.6K",
            description: "+20.1% от прошлого месяца",
            icon: Eye,
            trend: "text-green-600",
        },
        {
            title: "Вовлеченность",
            value: "24%",
            description: "+5.2% от прошлого месяца",
            icon: Heart,
            trend: "text-green-600",
        },
        {
            title: "Соцсети",
            value: 3,
            description: "подключенных платформ",
            icon: Share2,
        },
    ];
};

const getPlatforms = () => {
    return [
        {name: "YouTube", icon: YtLogo},
        {name: "TikTok", icon: TikTokLogo},
        {name: "Telegram", icon: TgLogo},
    ];
};

const getRecentActivities = () => {
    return [
        {
            type: "video",
            title: "Топ-5 трендов в строительстве 2024",
            platform: "YouTube",
            time: "2 часа назад",
            status: "published",
        },
        {
            type: "post",
            title: "Как выбрать качественные стройматериалы",
            platform: "Telegram",
            time: "5 часов назад",
            status: "published",
        },
        {
            type: "video",
            title: "Обзор новых технологий в ремонте",
            platform: "YouTube, TikTok",
            time: "1 день назад",
            status: "processing",
        },
    ];
};

export function DashboardContent() {
    const stats = getStats();
    const platforms = getPlatforms();
    const activities = getRecentActivities();

    const navigate = useNavigate();


    const handleNavigationToCreateContent = () => {
        navigate(CONTENT_CREATE_ROUTE)
    }

    const handleNavigationToAnalytics = () => {
        navigate(ANALYTICS_ROUTE)
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col space-y-2">
                <h1 className="text-3xl font-bold text-foreground">Добро пожаловать</h1>
                <p className="text-muted-foreground">Управляйте своим контентом и отслеживайте результаты</p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <Card key={index}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                            <stat.icon className="h-4 w-4 text-muted-foreground"/>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stat.value}</div>
                            <p className={`text-xs text-muted-foreground ${stat.trend || ""}`}>
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
                            <PlusCircle className="h-5 w-5"/>
                            <span>Быстрые действия</span>
                        </CardTitle>
                        <CardDescription>Создайте новый контент или просмотрите аналитику</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Button onClick={() => handleNavigationToCreateContent()}
                                className="w-full justify-start space-x-2 h-12" size="lg">
                            <Video className="h-5 w-5"/>
                            <span>Создать новый контент</span>
                        </Button>
                        <Button onClick={() => handleNavigationToAnalytics()} variant="outline"
                                className="w-full justify-start space-x-2 h-12 bg-transparent"
                                size="lg">
                            <BarChart3 className="h-5 w-5"/>
                            <span>Посмотреть аналитику</span>
                        </Button>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                            <TrendingUp className="h-5 w-5"/>
                            <span>Подключенные платформы</span>
                        </CardTitle>
                        <CardDescription>Ваши активные социальные сети</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 gap-3">
                            {platforms.map((platform, index) => (
                                <div key={index}
                                     className="flex items-center space-x-2 p-3 border border-border rounded-lg">
                                    <div
                                        className={`w-8 h-8 rounded-full flex items-center justify-center`}>
                                        <img src={platform.icon}/>
                                    </div>
                                    <span className="text-sm font-medium">{platform.name}</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Recent Activity */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                        <Calendar className="h-5 w-5"/>
                        <span>Недавняя активность</span>
                    </CardTitle>
                    <CardDescription>Последние опубликованные материалы и уведомления</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {activities.map((item, index) => (
                            <div key={index}
                                 className="flex items-center space-x-4 p-4 border border-border rounded-lg">
                                <div className="flex-shrink-0">
                                    {item.type === "video" ? (
                                        <Video className="h-8 w-8 text-accent"/>
                                    ) : (
                                        <FileText className="h-8 w-8 text-accent"/>
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-foreground truncate">{item.title}</p>
                                    <p className="text-xs text-muted-foreground">
                                        {item.platform} • {item.time}
                                    </p>
                                </div>
                                <Badge variant={item.status === "published" ? "default" : "secondary"}>
                                    {item.status === "published" ? "Опубликовано" : "Обработка"}
                                </Badge>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
