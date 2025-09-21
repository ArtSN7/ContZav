"use client"

import {useState} from "react"
import {Button} from "@/components/ui/button.tsx"
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card.tsx"
import {Input} from "@/components/ui/input.tsx"
import {Label} from "@/components/ui/label.tsx"
import {RadioGroup, RadioGroupItem} from "@/components/ui/radio-group.tsx"
import {Calendar} from "@/components/ui/calendar.tsx"
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover.tsx"
import {Badge} from "@/components/ui/badge.tsx"
import {CalendarIcon, ArrowRight, ArrowLeft, Clock, Download} from "lucide-react"
import {useNavigate} from "react-router";
import {format} from "date-fns"
import {ru} from "date-fns/locale"

import YtLogo from "../../../utils/icons/YtLogo.png"
import TikTokLogo from "../../../utils/icons/TikTokLogo.png"
import TGLogo from "../../../utils/icons/TgLogo.png"
import {CONTENT_ROUTE_VIDEO_PREVIEW, SUCCESS_PAGE_ROUTE} from "@/utils/CONSTANTS.ts";

const socialNetworks = [
    {id: "youtube", name: "YouTube", ready: true, icon: YtLogo},
    {id: "tiktok", name: "TikTok", ready: true, icon: TikTokLogo},
    {id: "telegram", name: "Telegram", ready: true, icon: TGLogo},
]

export function EnhancedPublicationPlanning() {
    const [contentCount, _] = useState(1)
    const [selectedNetworks, setSelectedNetworks] = useState<string[]>([])
    const [publicationType, setPublicationType] = useState("schedule") // Added publication type
    const [selectedDate, setSelectedDate] = useState<Date>()
    const [selectedTime, setSelectedTime] = useState("12:00")
    const navigate = useNavigate()

    const toggleNetwork = (networkId: string) => {
        setSelectedNetworks((prev) =>
            prev.includes(networkId) ? prev.filter((id) => id !== networkId) : [...prev, networkId],
        )
    }

    const handleDownload = () => {
        // Create mock content files for download
        const contentData = {
            videos: Array.from({length: contentCount}, (_, i) => ({
                id: i + 1,
                title: `Ролик ${i + 1}`,
                script: `Сценарий для ролика ${i + 1}...`,
                networks: selectedNetworks,
            })),
            metadata: {
                created: new Date().toISOString(),
                totalCount: contentCount,
                networks: selectedNetworks,
            },
        }

        const blob = new Blob([JSON.stringify(contentData, null, 2)], {type: "application/json"})
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `content-package-${Date.now()}.json`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
    }

    const handleNext = () => {
        if (contentCount > 0 && selectedNetworks.length > 0) {
            navigate(SUCCESS_PAGE_ROUTE)
        }
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div className="text-center space-y-2">
                <h1 className="text-3xl font-bold text-foreground">Планирование публикации</h1>
                <p className="text-muted-foreground">Настройте количество контента и выберите способ публикации</p>
            </div>

            {/* Social Networks */}
            <Card>
                <CardHeader>
                    <CardTitle>Социальные сети</CardTitle>
                    <CardDescription>Выберите платформы для публикации контента</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                        {socialNetworks.map((network) => (
                            <div
                                key={network.id}
                                className={`relative p-3 border rounded-lg cursor-pointer transition-all ${
                                    network.ready
                                        ? selectedNetworks.includes(network.id)
                                            ? "border-accent bg-accent/10"
                                            : "border-border hover:border-accent/50"
                                        : "border-muted bg-muted/50 cursor-not-allowed opacity-60"
                                }`}
                                onClick={() => network.ready && toggleNetwork(network.id)}
                            >
                                <div className="flex flex-col items-center space-y-2">
                                    <div className="w-5 h-5 rounded-full flex items-center justify-center">
                                        <img src={network.icon}/>
                                    </div>
                                    <span className="text-xs font-medium text-center">{network.name}</span>
                                    {!network.ready && (
                                        <Badge variant="secondary" className="text-xs">
                                            В разработке
                                        </Badge>
                                    )}
                                    {network.ready && selectedNetworks.includes(network.id) && (
                                        <div className="absolute top-1 right-1 w-3 h-3 bg-accent rounded-full"></div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="mt-4 p-3 bg-muted rounded-lg">
                        <p className="text-sm">
                            <strong>Выбрано платформ:</strong> {selectedNetworks.length}
                        </p>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Способ публикации</CardTitle>
                    <CardDescription>Выберите, как хотите опубликовать контент</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <RadioGroup value={publicationType} onValueChange={setPublicationType}>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="schedule" id="schedule"/>
                            <Label htmlFor="schedule">Запланировать автопубликацию</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="download" id="download"/>
                            <Label htmlFor="download">Скачать файлы для ручной публикации</Label>
                        </div>
                    </RadioGroup>

                    {publicationType === "schedule" && (
                        <div
                            className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 p-4 border border-accent/20 rounded-lg bg-accent/5">
                            <div className="space-y-2">
                                <Label>Дата публикации</Label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button variant="outline"
                                                className="w-full justify-start text-left font-normal bg-transparent">
                                            <CalendarIcon className="mr-2 h-4 w-4"/>
                                            {selectedDate ? format(selectedDate, "PPP", {locale: ru}) : "Выберите дату"}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0">
                                        <Calendar mode="single" selected={selectedDate} onSelect={setSelectedDate}
                                                  initialFocus/>
                                    </PopoverContent>
                                </Popover>
                            </div>
                            <div className="space-y-2">
                                <Label>Время публикации</Label>
                                <div className="flex items-center space-x-2">
                                    <Clock className="h-4 w-4 text-muted-foreground"/>
                                    <Input
                                        type="time"
                                        value={selectedTime}
                                        onChange={(e) => setSelectedTime(e.target.value)}
                                        className="flex-1"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {publicationType === "download" && (
                        <div className="p-4 border border-blue-200 rounded-lg bg-blue-50">
                            <div className="flex items-start space-x-3">
                                <Download className="h-5 w-5 text-blue-600 mt-0.5"/>
                                <div className="space-y-2">
                                    <p className="text-sm font-medium text-blue-900">Скачивание файлов</p>
                                    <p className="text-xs text-blue-700">
                                        Вы получите архив с готовыми видео, изображениями и текстами для каждой
                                        социальной сети. Сможете
                                        опубликовать контент самостоятельно в удобное время.
                                    </p>
                                    <Button
                                        onClick={handleDownload}
                                        size="sm"
                                        className="mt-2"
                                        disabled={contentCount === 0 || selectedNetworks.length === 0}
                                    >
                                        <Download className="mr-2 h-4 w-4"/>
                                        Скачать контент-пакет
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Navigation */}
            <div className="flex justify-between items-center pt-6">
                <Button variant="outline" onClick={() => navigate(CONTENT_ROUTE_VIDEO_PREVIEW)}>
                    <ArrowLeft className="mr-2 h-4 w-4"/>
                    Назад
                </Button>
                <div className="flex space-x-2">
                    <div className="w-3 h-3 bg-muted rounded-full"></div>
                    <div className="w-3 h-3 bg-muted rounded-full"></div>
                    <div className="w-3 h-3 bg-muted rounded-full"></div>
                    <div className="w-3 h-3 bg-accent rounded-full"></div>
                    <div className="w-3 h-3 bg-muted rounded-full"></div>
                </div>
                <Button onClick={handleNext} disabled={contentCount === 0 || selectedNetworks.length === 0}>
                    Опубликовать
                    <ArrowRight className="ml-2 h-4 w-4"/>
                </Button>
            </div>
        </div>
    )
}
