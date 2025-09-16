import {Button} from "@/components/ui/button.tsx"
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card.tsx"
import {Badge} from "@/components/ui/badge.tsx"
import {PlusCircle, BarChart3, Eye, Heart, Share2, TrendingUp, Video, FileText, Calendar} from "lucide-react"

export function DashboardContent() {
    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col space-y-2">
                <h1 className="text-3xl font-bold text-foreground">Добро пожаловать в Контент Завод</h1>
                <p className="text-muted-foreground">Управляйте своим контентом и отслеживайте результаты</p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Опубликовано</CardTitle>
                        <Video className="h-4 w-4 text-muted-foreground"/>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">24</div>
                        <p className="text-xs text-muted-foreground">роликов и постов</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Просмотры</CardTitle>
                        <Eye className="h-4 w-4 text-muted-foreground"/>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">12.5K</div>
                        <p className="text-xs text-muted-foreground">
                            <span className="text-green-600">+20.1%</span> от прошлого месяца
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Вовлеченность</CardTitle>
                        <Heart className="h-4 w-4 text-muted-foreground"/>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">89%</div>
                        <p className="text-xs text-muted-foreground">
                            <span className="text-green-600">+5.2%</span> от прошлого месяца
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Соцсети</CardTitle>
                        <Share2 className="h-4 w-4 text-muted-foreground"/>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">5</div>
                        <p className="text-xs text-muted-foreground">подключенных платформ</p>
                    </CardContent>
                </Card>
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
                        <Button className="w-full justify-start space-x-2 h-12" size="lg">
                            <Video className="h-5 w-5"/>
                            <span>Создать новый контент</span>
                        </Button>
                        <Button variant="outline" className="w-full justify-start space-x-2 h-12 bg-transparent"
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
                            <div className="flex items-center space-x-2 p-3 border border-border rounded-lg">
                                <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                                    <span className="text-white text-xs font-bold">YT</span>
                                </div>
                                <span className="text-sm font-medium">YouTube</span>
                            </div>
                            <div className="flex items-center space-x-2 p-3 border border-border rounded-lg">
                                <div className="w-8 h-8 bg-purple-800 rounded-full flex items-center justify-center">
                                    <span className="text-white text-xs font-bold">IG</span>
                                </div>
                                <span className="text-sm font-medium">Instagram</span>
                            </div>
                            <div className="flex items-center space-x-2 p-3 border border-border rounded-lg">
                                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                                    <span className="text-white text-xs font-bold">VK</span>
                                </div>
                                <span className="text-sm font-medium">ВКонтакте</span>
                            </div>
                            <div className="flex items-center space-x-2 p-3 border border-border rounded-lg">
                                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                                    <span className="text-white text-xs font-bold">TG</span>
                                </div>
                                <span className="text-sm font-medium">Telegram</span>
                            </div>
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
                        {[
                            {
                                type: "video",
                                title: "Топ-5 трендов в строительстве 2024",
                                platform: "YouTube, Instagram",
                                time: "2 часа назад",
                                status: "published",
                            },
                            {
                                type: "post",
                                title: "Как выбрать качественные стройматериалы",
                                platform: "VK, Telegram",
                                time: "5 часов назад",
                                status: "published",
                            },
                            {
                                type: "video",
                                title: "Обзор новых технологий в ремонте",
                                platform: "YouTube",
                                time: "1 день назад",
                                status: "processing",
                            },
                        ].map((item, index) => (
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
    )
}
