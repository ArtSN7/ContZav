"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Eye, Heart, MessageCircle, Share2, Users, TrendingUp, TrendingDown } from "lucide-react"

const metrics = [
  {
    title: "Просмотры/Охват",
    value: "127.5K",
    change: "+12.5%",
    trend: "up",
    icon: Eye,
    description: "Общий охват за период",
  },
  {
    title: "Реакции",
    value: "8.2K",
    change: "+8.1%",
    trend: "up",
    icon: Heart,
    description: "Лайки, сердечки, реакции",
  },
  {
    title: "Вовлеченность",
    value: "15.7K",
    change: "+15.2%",
    trend: "up",
    icon: MessageCircle,
    description: "Комментарии, репосты, сохранения",
  },
  {
    title: "Подписчики",
    value: "+1.2K",
    change: "+5.8%",
    trend: "up",
    icon: Users,
    description: "Прирост подписчиков",
  },
  {
    title: "CTR",
    value: "3.4%",
    change: "-0.2%",
    trend: "down",
    icon: Share2,
    description: "Кликабельность контента",
  },
  {
    title: "Средний ER",
    value: "6.8%",
    change: "+1.1%",
    trend: "up",
    icon: TrendingUp,
    description: "Engagement Rate",
  },
]

export function MetricsCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {metrics.map((metric, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
            <metric.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metric.value}</div>
            <div className="flex items-center space-x-2 mt-2">
              <Badge variant={metric.trend === "up" ? "default" : "destructive"} className="text-xs">
                {metric.trend === "up" ? (
                  <TrendingUp className="h-3 w-3 mr-1" />
                ) : (
                  <TrendingDown className="h-3 w-3 mr-1" />
                )}
                {metric.change}
              </Badge>
              <span className="text-xs text-muted-foreground">от прошлого месяца</span>
            </div>
            <p className="text-xs text-muted-foreground mt-2">{metric.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
