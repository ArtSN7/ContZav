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
import { CalendarIcon, ArrowRight, ArrowLeft, Clock } from "lucide-react"
import { useNavigate} from "react-router";
import { format } from "date-fns"
import { ru } from "date-fns/locale"
import {CONTENT_ROUTE_PRICING, CONTENT_ROUTE_SCRIPT} from "@/utils/CONSTANTS.ts";

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
  { id: "whatsapp", name: "WhatsApp", ready: false, icon: "💬" },
  { id: "snapchat", name: "Snapchat", ready: false, icon: "👻" },
  { id: "wechat", name: "WeChat", ready: false, icon: "💚" },
  { id: "reddit", name: "Reddit", ready: false, icon: "🤖" },
  { id: "threads", name: "Threads", ready: false, icon: "🧵" },
]

export function PublicationPlanning() {
  const [contentCount, setContentCount] = useState(5)
  const [selectedNetworks, setSelectedNetworks] = useState<string[]>(["youtube", "instagram", "vk"])
  const [scheduleType, setScheduleType] = useState("immediate")
  const [selectedDate, setSelectedDate] = useState<Date>()
  const [selectedTime, setSelectedTime] = useState("12:00")
  const navigate = useNavigate()

  const toggleNetwork = (networkId: string) => {
    setSelectedNetworks((prev) =>
      prev.includes(networkId) ? prev.filter((id) => id !== networkId) : [...prev, networkId],
    )
  }

  const handleNext = () => {
    if (contentCount > 0 && selectedNetworks.length > 0) {
      navigate(CONTENT_ROUTE_PRICING)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Планирование публикации</h1>
        <p className="text-muted-foreground">Настройте количество контента и выберите платформы для публикации</p>
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

      {/* Schedule Options */}
      <Card>
        <CardHeader>
          <CardTitle>Расписание публикации</CardTitle>
          <CardDescription>Выберите, когда опубликовать контент</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <RadioGroup value={scheduleType} onValueChange={setScheduleType}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="immediate" id="immediate" />
              <Label htmlFor="immediate">Опубликовать сразу</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="scheduled" id="scheduled" />
              <Label htmlFor="scheduled">Запланировать</Label>
            </div>
          </RadioGroup>

          {scheduleType === "scheduled" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
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
                    {scheduleType === "immediate"
                      ? "Сразу после создания"
                      : selectedDate
                        ? format(selectedDate, "dd.MM.yyyy", { locale: ru })
                        : "Дата не выбрана"}
                  </p>
                  {scheduleType === "scheduled" && <p className="text-xs text-muted-foreground">{selectedTime}</p>}
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
        <Button variant="outline" onClick={() => navigate(CONTENT_ROUTE_SCRIPT)}>
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
