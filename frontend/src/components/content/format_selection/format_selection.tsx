"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button.tsx"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card.tsx"
import { Video, FileText, Layers, ArrowRight } from "lucide-react"
import {useNavigate} from "react-router";
import {CONTENT_ROUTE_NICHE} from "@/utils/CONSTANTS.ts";

const formats = [
  {
    id: "video",
    title: "Video Reels",
    description: "Короткие видео для соцсетей",
    icon: Video,
    example: "Динамичные ролики до 60 секунд",
    color: "bg-red-50 border-red-200 hover:bg-red-100",
    iconColor: "text-red-600",
  },
  {
    id: "text",
    title: "Text Posts",
    description: "Посты для Telegram, VK и других",
    icon: FileText,
    example: "Информативные текстовые посты",
    color: "bg-blue-50 border-blue-200 hover:bg-blue-100",
    iconColor: "text-blue-600",
  },
  {
    id: "combination",
    title: "Combination",
    description: "Видео + текстовый пост",
    icon: Layers,
    example: "Комплексный контент для максимального охвата",
    color: "bg-purple-50 border-purple-200 hover:bg-purple-100",
    iconColor: "text-purple-600",
  },
]

export function FormatSelection() {
  const [selectedFormat, setSelectedFormat] = useState<string | null>(null)
  const navigate = useNavigate()

  const handleFormatSelect = (formatId: string) => {
    setSelectedFormat(formatId)
    // Navigate to niche definition after selection
    setTimeout(() => {
      navigate(CONTENT_ROUTE_NICHE)
    }, 500)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Выберите формат контента</h1>
        <p className="text-muted-foreground">Определите тип контента, который хотите создать</p>
      </div>

      {/* Format Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {formats.map((format) => (
          <Card
            key={format.id}
            className={`cursor-pointer transition-all duration-200 ${format.color} ${
              selectedFormat === format.id ? "ring-2 ring-accent" : ""
            }`}
            onClick={() => handleFormatSelect(format.id)}
          >
            <CardHeader className="text-center">
              <div className="mx-auto mb-4">
                <format.icon className={`h-12 w-12 ${format.iconColor}`} />
              </div>
              <CardTitle className="text-xl">{format.title}</CardTitle>
              <CardDescription className="text-base">{format.description}</CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <div className="p-4 bg-white/50 rounded-lg">
                <p className="text-sm text-muted-foreground">{format.example}</p>
              </div>
              <Button
                className="w-full"
                variant={selectedFormat === format.id ? "default" : "outline"}
                disabled={selectedFormat !== null && selectedFormat !== format.id}
              >
                {selectedFormat === format.id ? (
                  <>
                    Выбрано <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                ) : (
                  "Выбрать"
                )}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center pt-6">


      </div>
    </div>
  )
}