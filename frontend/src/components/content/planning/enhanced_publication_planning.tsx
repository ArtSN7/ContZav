"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button.tsx"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card.tsx"
import { Input } from "@/components/ui/input.tsx"
import { Label } from "@/components/ui/label.tsx"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group.tsx"
import { Calendar } from "@/components/ui/calendar.tsx"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover.tsx"
import { Badge } from "@/components/ui/badge.tsx"
import { CalendarIcon, ArrowRight, ArrowLeft, Clock, Download } from "lucide-react"
import { useNavigate} from "react-router";
import { format } from "date-fns"
import { ru } from "date-fns/locale"

const socialNetworks = [
  { id: "youtube", name: "YouTube", ready: true, icon: "🎥" },
  { id: "instagram", name: "Instagram", ready: true, icon: "📸" },
  { id: "vk", name: "ВКонтакте", ready: true, icon: "🔵" },
  { id: "dzen", name: "Яндекс.Дзен", ready: true, icon: "🟡" },
  { id: "facebook", name: "Facebook", ready: true, icon: "📘" },
  { id: "twitter", name: "X (Twitter)", ready: true, icon: "🐦" },
  { id: "tiktok", name: "TikTok", ready: true, icon: "🎵" },
  { id: "pinterest", name: "Pinterest", ready: true, icon: "📌" },
  { id: "telegram", name: "Telegram", ready: true, icon: "✈️" },
  { id: "linkedin", name: "LinkedIn", ready: true, icon: "💼" },
]

export function EnhancedPublicationPlanning() {
  const [contentCount, setContentCount] = useState(5)
  const [selectedNetworks, setSelectedNetworks] = useState<string[]>(["youtube", "instagram", "vk"])
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
      videos: Array.from({ length: contentCount }, (_, i) => ({
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

    const blob = new Blob([JSON.stringify(contentData, null, 2)], { type: "application/json" })
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
      navigate("/dashboard/content/pricing")
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Планирование публикации</h1>
        <p className="text-muted-foreground">Настройте количество контента и выберите способ публикации</p>
      </div>

      {/* Content Count */}
      <Card>
        <CardHeader>
          <CardTitle>Количество контента</CardTitle>
          <CardDescription>Укажите, сколько роликов или постов нужно создать</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <Label htmlFor="content-count" className="text-sm font-medium">
                Количество роликов/постов:
              </Label>
              <Input
                id="content-count"
                type="number"
                min="1"
                max="50"
                value={contentCount}
                onChange={(e) => setContentCount(Number(e.target.value))}
                className="w-24"
              />
              <span className="text-sm text-muted-foreground">(1-50)</span>
            </div>
            <div className="bg-muted p-3 rounded-lg">
              <p className="text-sm">
                <strong>Выбрано:</strong> {contentCount} {contentCount === 1 ? "ролик" : "роликов"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

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
                  <span className="text-2xl">{network.icon}</span>
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
              <RadioGroupItem value="schedule" id="schedule" />
              <Label htmlFor="schedule">Запланировать автопубликацию</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="download" id="download" />
              <Label htmlFor="download">Скачать файлы для ручной публикации</Label>
            </div>
          </RadioGroup>

          {publicationType === "schedule" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 p-4 border border-accent/20 rounded-lg bg-accent/5">
              <div className="space-y-2">
                <Label>Дата публикации</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal bg-transparent">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {selectedDate ? format(selectedDate, "PPP", { locale: ru }) : "Выберите дату"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={selectedDate} onSelect={setSelectedDate} initialFocus />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2">
                <Label>Время публикации</Label>
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
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
                <Download className="h-5 w-5 text-blue-600 mt-0.5" />
                <div className="space-y-2">
                  <p className="text-sm font-medium text-blue-900">Скачивание файлов</p>
                  <p className="text-xs text-blue-700">
                    Вы получите архив с готовыми видео, изображениями и текстами для каждой социальной сети. Сможете
                    опубликовать контент самостоятельно в удобное время.
                  </p>
                  <Button
                    onClick={handleDownload}
                    size="sm"
                    className="mt-2"
                    disabled={contentCount === 0 || selectedNetworks.length === 0}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Скачать контент-пакет
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Preview */}
      <Card>
        <CardHeader>
          <CardTitle>Предварительный просмотр</CardTitle>
          <CardDescription>Сводка планируемой публикации</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Array.from({ length: Math.min(contentCount, 3) }, (_, i) => (
              <div key={i} className="flex items-center justify-between p-3 border border-border rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-accent/20 rounded-lg flex items-center justify-center">
                    <span className="text-sm font-medium">{i + 1}</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Ролик {i + 1}</p>
                    <p className="text-xs text-muted-foreground">
                      {selectedNetworks.length} {selectedNetworks.length === 1 ? "платформа" : "платформ"}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm">
                    {publicationType === "download"
                      ? "Скачать файлы"
                      : selectedDate
                        ? format(selectedDate, "dd.MM.yyyy", { locale: ru })
                        : "Дата не выбрана"}
                  </p>
                  {publicationType === "schedule" && <p className="text-xs text-muted-foreground">{selectedTime}</p>}
                </div>
              </div>
            ))}
            {contentCount > 3 && (
              <div className="text-center py-2">
                <p className="text-sm text-muted-foreground">... и еще {contentCount - 3} роликов</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between items-center pt-6">
        <Button variant="outline" onClick={() => navigate("/dashboard/content/script")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
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
          Далее
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
