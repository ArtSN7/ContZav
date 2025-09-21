"use client"

import {useState} from "react"
import {Button} from "@/components/ui/button"
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card"
import {Badge} from "@/components/ui/badge"
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar"
import {Plus, User, Calendar, Settings, Trash2} from "lucide-react"
import {useNavigate} from "react-router"

import avatar from "./avatar.png"

const createdAvatars = [
    {
        id: "1",
        name: "Основной Аватар",
        gender: "Мужской",
        style: "Деловой",
        avatar: avatar,
        createdAt: "2024-01-15",
        usageCount: 12,
        status: "active",
    }
]

export function AvatarManagement() {
    const [avatars, setAvatars] = useState(createdAvatars)
    const navigate = useNavigate()

    const handleCreateNew = () => {
        navigate("/dashboard/content/avatar")
    }

    const handleDeleteAvatar = (avatarId: string) => {
        setAvatars((prev) => prev.filter((avatar) => avatar.id !== avatarId))
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="flex items-center gap-2">
                                <User className="w-5 h-5"/>
                                Мои аватары
                            </CardTitle>
                            <CardDescription>Управляйте созданными AI-аватарами для ваших видео</CardDescription>
                        </div>
                        <Button onClick={handleCreateNew} className="flex items-center gap-2">
                            <Plus className="w-4 h-4"/>
                            Создать новый
                        </Button>
                    </div>
                </CardHeader>
            </Card>

            {/* Avatars Grid */}
            <div className="grid gap-4">
                {avatars.length === 0 ? (
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                            <User className="w-12 h-12 text-muted-foreground mb-4"/>
                            <h3 className="text-lg font-semibold mb-2">Нет созданных аватаров</h3>
                            <p className="text-muted-foreground mb-4">Создайте свой первый AI-аватар для использования в
                                видео</p>
                            <Button onClick={handleCreateNew}>
                                <Plus className="w-4 h-4 mr-2"/>
                                Создать аватар
                            </Button>
                        </CardContent>
                    </Card>
                ) : (
                    avatars.map((avatar) => (
                        <Card key={avatar.id} className="hover:bg-muted/50 transition-colors">
                            <CardContent className="p-6">
                                <div className="flex items-center gap-6">
                                    <Avatar className="w-16 h-16">
                                        <AvatarImage src={avatar.avatar} className="w-full h-full object-cover"/>
                                        <AvatarFallback className="text-lg">{avatar.name[0]}</AvatarFallback>
                                    </Avatar>

                                    <div className="flex-1 space-y-2">
                                        <div className="flex items-center gap-3">
                                            <h3 className="text-lg font-semibold">{avatar.name}</h3>
                                            <Badge variant={avatar.status === "active" ? "default" : "secondary"}>
                                                {avatar.status === "active" ? "Активный" : "Неактивный"}
                                            </Badge>
                                        </div>

                                        <div className="flex flex-wrap gap-2">
                                            <Badge variant="outline">{avatar.gender}</Badge>
                                            <Badge variant="outline">{avatar.style}</Badge>
                                        </div>

                                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                            <div className="flex items-center gap-1">
                                                <Calendar className="w-4 h-4"/>
                                                Создан: {new Date(avatar.createdAt).toLocaleDateString("ru-RU")}
                                            </div>
                                            <div>Использован: {avatar.usageCount} раз</div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <Button variant="outline" size="sm">
                                            <Settings className="w-4 h-4 mr-2"/>
                                            Настроить
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleDeleteAvatar(avatar.id)}
                                            className="text-destructive hover:text-destructive"
                                        >
                                            <Trash2 className="w-4 h-4"/>
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>

            {/* Statistics */}
            {avatars.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle>Статистика использования</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="text-center p-4 bg-muted/50 rounded-lg">
                                <div className="text-2xl font-bold text-primary">{avatars.length}</div>
                                <div className="text-sm text-muted-foreground">Всего аватаров</div>
                            </div>
                            <div className="text-center p-4 bg-muted/50 rounded-lg">
                                <div className="text-2xl font-bold text-primary">
                                    {avatars.filter((a) => a.status === "active").length}
                                </div>
                                <div className="text-sm text-muted-foreground">Активных</div>
                            </div>
                            <div className="text-center p-4 bg-muted/50 rounded-lg">
                                <div className="text-2xl font-bold text-primary">
                                    {avatars.reduce((sum, avatar) => sum + avatar.usageCount, 0)}
                                </div>
                                <div className="text-sm text-muted-foreground">Общее использование</div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}
