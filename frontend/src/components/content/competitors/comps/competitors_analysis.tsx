"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Plus, ArrowRight, ArrowLeft, Users, TrendingUp, Eye } from "lucide-react"
import { useNavigate } from "react-router-dom"
import {CONTENT_ROUTE_COMPETITORS, CONTENT_ROUTE_SCRIPT} from "@/utils/CONSTANTS.ts";

interface Competitor {
  id: string
  name: string
  platform: string
  followers: string
  engagement: string
  avatar: string
  description: string
  strengths: string[]
}

const suggestedCompetitors: Competitor[] = [
  {
    id: "1",
    name: "СтройЭксперт",
    platform: "YouTube",
    followers: "125K",
    engagement: "4.2%",
    avatar: "/placeholder.svg?height=40&width=40",
    description: "Канал о строительстве и ремонте",
    strengths: ["Качественный контент", "Регулярные выпуски", "Экспертность"],
  },
  {
    id: "2",
    name: "Дом Мечты",
    platform: "Instagram",
    followers: "89K",
    engagement: "6.8%",
    avatar: "/placeholder.svg?height=40&width=40",
    description: "Дизайн интерьера и стройматериалы",
    strengths: ["Визуальный контент", "Высокий engagement", "Тренды"],
  },
  {
    id: "3",
    name: "Строй Советы",
    platform: "TikTok",
    followers: "67K",
    engagement: "8.1%",
    avatar: "/placeholder.svg?height=40&width=40",
    description: "Короткие советы по строительству",
    strengths: ["Вирусный контент", "Молодая аудитория", "Креативность"],
  },
]

export function CompetitorsAnalysis() {
  const [competitors, setCompetitors] = useState<Competitor[]>(suggestedCompetitors)
  const [newCompetitor, setNewCompetitor] = useState({
    name: "",
    platform: "",
    followers: "",
  })
  const [selectedCompetitors, setSelectedCompetitors] = useState<string[]>([])
  const navigate = useNavigate()

  const addCustomCompetitor = () => {
    if (newCompetitor.name && newCompetitor.platform) {
      const competitor: Competitor = {
        id: Date.now().toString(),
        name: newCompetitor.name,
        platform: newCompetitor.platform,
        followers: newCompetitor.followers || "N/A",
        engagement: "N/A",
        avatar: "/placeholder.svg?height=40&width=40",
        description: "Добавлен пользователем",
        strengths: ["Пользовательский анализ"],
      }

      setCompetitors([...competitors, competitor])
      setNewCompetitor({ name: "", platform: "", followers: "" })
    }
  }

  const toggleCompetitor = (id: string) => {
    setSelectedCompetitors((prev) => (prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]))
  }

  const handleNext = () => {
    navigate(CONTENT_ROUTE_SCRIPT)
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Анализ конкурентов</h1>
        <p className="text-muted-foreground">Изучите конкурентов в вашей нише для создания лучшего контента</p>
      </div>

      {/* Suggested Competitors */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Рекомендуемые конкуренты
          </CardTitle>
          <CardDescription>Мы нашли этих конкурентов в вашей нише на основе анализа</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {competitors.map((competitor) => (
              <Card
                key={competitor.id}
                className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                  selectedCompetitors.includes(competitor.id) ? "ring-2 ring-primary bg-primary/5" : "hover:bg-muted/50"
                }`}
                onClick={() => toggleCompetitor(competitor.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={competitor.avatar || "/placeholder.svg"} />
                      <AvatarFallback>{competitor.name[0]}</AvatarFallback>
                    </Avatar>

                    <div className="flex-1 space-y-2">
                      <div>
                        <h3 className="font-semibold text-sm">{competitor.name}</h3>
                        <p className="text-xs text-muted-foreground">{competitor.description}</p>
                      </div>

                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs">
                          {competitor.platform}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          <span>{competitor.followers}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <TrendingUp className="w-3 h-3" />
                          <span>{competitor.engagement}</span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-1">
                        {competitor.strengths.slice(0, 2).map((strength, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {strength}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Add Custom Competitor */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Добавить конкурента
          </CardTitle>
          <CardDescription>Добавьте своих конкурентов для более полного анализа</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              placeholder="Название канала/аккаунта"
              value={newCompetitor.name}
              onChange={(e) => setNewCompetitor({ ...newCompetitor, name: e.target.value })}
            />
            <Input
              placeholder="Платформа (YouTube, Instagram, TikTok)"
              value={newCompetitor.platform}
              onChange={(e) => setNewCompetitor({ ...newCompetitor, platform: e.target.value })}
            />
            <div className="flex gap-2">
              <Input
                placeholder="Подписчики (опционально)"
                value={newCompetitor.followers}
                onChange={(e) => setNewCompetitor({ ...newCompetitor, followers: e.target.value })}
              />
              <Button onClick={addCustomCompetitor} disabled={!newCompetitor.name || !newCompetitor.platform}>
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Selected Summary */}
      {selectedCompetitors.length > 0 && (
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Выбрано конкурентов: {selectedCompetitors.length}</p>
                <p className="text-sm text-muted-foreground">
                  Эти данные будут использованы для создания уникального контента
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-primary">Готово к анализу</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Navigation */}
      <div className="flex justify-between items-center pt-6">
        <Button variant="outline" onClick={() => navigate(CONTENT_ROUTE_COMPETITORS)}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Назад
        </Button>
        <div className="flex space-x-2">
          <div className="w-3 h-3 bg-muted rounded-full"></div>
          <div className="w-3 h-3 bg-muted rounded-full"></div>
          <div className="w-3 h-3 bg-accent rounded-full"></div>
          <div className="w-3 h-3 bg-muted rounded-full"></div>
          <div className="w-3 h-3 bg-muted rounded-full"></div>
        </div>
        <Button onClick={handleNext}>
          Далее
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
