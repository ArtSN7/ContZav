"use client"

import {useState} from "react"
import {Button} from "@/components/ui/button.tsx"
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card.tsx"
import {Textarea} from "@/components/ui/textarea.tsx"
import {Badge} from "@/components/ui/badge.tsx"
import {Play, ThumbsUp, ThumbsDown, ArrowRight, ArrowLeft, Edit} from "lucide-react"
import {useNavigate} from "react-router";
import {CONTENT_ROUTE_NICHE, CONTENT_ROUTE_PLANNING} from "@/utils/CONSTANTS.ts";

const sampleScript = `🏠 Топ-5 ошибок при выборе стройматериалов

Привет! Сегодня расскажу о самых частых ошибках, которые допускают при покупке стройматериалов.

1️⃣ Экономия на качестве
Дешевые материалы часто оборачиваются дорогим ремонтом. Лучше один раз купить качественно.

2️⃣ Неправильный расчет количества
Всегда берите материалы с запасом 10-15%. Докупать потом может быть проблематично.

3️⃣ Игнорирование сезонности
Некоторые работы лучше делать в определенное время года. Планируйте заранее!

4️⃣ Покупка без консультации
Не стесняйтесь спрашивать у специалистов. Это поможет избежать дорогих ошибок.

5️⃣ Неучет особенностей объекта
Каждый дом уникален. То, что подошло соседу, может не подойти вам.

💡 Хотите избежать этих ошибок? Пишите в комментариях, расскажу подробнее!

#стройматериалы #ремонт #строительство #советы`

export function ScriptCreation() {
    const [script, setScript] = useState(sampleScript)
    const [isEditing, setIsEditing] = useState(false)
    const [feedback, setFeedback] = useState("")
    const [showFeedback, setShowFeedback] = useState(false)
    const navigate = useNavigate()

    const handleApprove = () => {
        navigate(CONTENT_ROUTE_PLANNING)
    }

    const handleReject = () => {
        setShowFeedback(true)
    }

    const submitFeedback = () => {
        // In real app, would send feedback to regenerate script
        console.log("Feedback submitted:", feedback)
        setShowFeedback(false)
        setFeedback("")
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div className="text-center space-y-2">
                <h1 className="text-3xl font-bold text-foreground">Сценарий и тестовый ролик</h1>
                <p className="text-muted-foreground">Просмотрите сгенерированный сценарий и тестовое видео</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Script Section */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle>Сценарий контента</CardTitle>
                                <CardDescription>AI-сгенерированный сценарий на основе ваших ответов</CardDescription>
                            </div>
                            <Button variant="outline" size="sm" onClick={() => setIsEditing(!isEditing)}>
                                <Edit className="h-4 w-4 mr-2"/>
                                {isEditing ? "Сохранить" : "Редактировать"}
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {isEditing ? (
                            <Textarea
                                value={script}
                                onChange={(e) => setScript(e.target.value)}
                                className="min-h-[400px] font-mono text-sm"
                            />
                        ) : (
                            <div className="bg-muted p-4 rounded-lg">
                                <pre className="whitespace-pre-wrap text-sm leading-relaxed">{script}</pre>
                            </div>
                        )}
                        <div className="mt-4 flex flex-wrap gap-2">
                            <Badge variant="secondary">Длительность: ~45 сек</Badge>
                            <Badge variant="secondary">Формат: Вертикальное видео</Badge>
                            <Badge variant="secondary">Хештеги: 4</Badge>
                        </div>
                    </CardContent>
                </Card>

                {/* Test Reel Section */}
                <Card>
                    <CardHeader>
                        <CardTitle>Тестовый ролик</CardTitle>
                        <CardDescription>Предварительный просмотр с AI-аватаром</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {/* Video Player Mockup */}
                        <div
                            className="aspect-[9/16] bg-gradient-to-br from-gray-900 to-gray-700 rounded-lg flex items-center justify-center relative overflow-hidden">
                            <div className="text-center text-white space-y-4">
                                <div
                                    className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto">
                                    <Play className="h-8 w-8 ml-1"/>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-sm font-medium">AI-Аватар</p>
                                    <p className="text-xs opacity-80">Нажмите для воспроизведения</p>
                                </div>
                            </div>
                            {/* Mock avatar */}
                            <div className="absolute bottom-4 left-4 right-4">
                                <div className="bg-black/50 backdrop-blur-sm rounded-lg p-3">
                                    <p className="text-white text-xs leading-relaxed">
                                        "Привет! Сегодня расскажу о самых частых ошибках при выборе стройматериалов..."
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Video Info */}
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Качество:</span>
                                <span className="font-medium">HD 1080p</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Голос:</span>
                                <span className="font-medium">Мужской, русский</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Фон:</span>
                                <span className="font-medium">Офисный</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Approval Section */}
            <Card>
                <CardHeader>
                    <CardTitle>Утверждение контента</CardTitle>
                    <CardDescription>Одобрите сценарий и видео для продолжения или оставьте отзыв для
                        улучшения</CardDescription>
                </CardHeader>
                <CardContent>
                    {!showFeedback ? (
                        <div className="flex justify-center space-x-4">
                            <Button onClick={handleApprove} size="lg" className="bg-green-600 hover:bg-green-700">
                                <ThumbsUp className="mr-2 h-5 w-5"/>
                                Утвердить
                            </Button>
                            <Button onClick={handleReject} variant="destructive" size="lg">
                                <ThumbsDown className="mr-2 h-5 w-5"/>
                                Отклонить
                            </Button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <Textarea
                                placeholder="Опишите, что нужно изменить в сценарии или видео..."
                                value={feedback}
                                onChange={(e) => setFeedback(e.target.value)}
                                className="min-h-[100px]"
                            />
                            <div className="flex justify-end space-x-2">
                                <Button variant="outline" onClick={() => setShowFeedback(false)}>
                                    Отмена
                                </Button>
                                <Button onClick={submitFeedback} disabled={!feedback.trim()}>
                                    Отправить отзыв
                                </Button>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Navigation */}
            <div className="flex justify-between items-center pt-6">
                <Button variant="outline" onClick={() => navigate(CONTENT_ROUTE_NICHE)}>
                    <ArrowLeft className="mr-2 h-4 w-4"/>
                    Назад
                </Button>
                <div className="flex space-x-2">
                    <div className="w-3 h-3 bg-muted rounded-full"></div>
                    <div className="w-3 h-3 bg-muted rounded-full"></div>
                    <div className="w-3 h-3 bg-accent rounded-full"></div>
                    <div className="w-3 h-3 bg-muted rounded-full"></div>
                    <div className="w-3 h-3 bg-muted rounded-full"></div>
                </div>
                <Button onClick={handleApprove}>
                    Далее
                    <ArrowRight className="ml-2 h-4 w-4"/>
                </Button>
            </div>
        </div>
    )
}
