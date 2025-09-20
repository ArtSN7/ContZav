"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, ArrowLeft, Edit } from "lucide-react"
import { useNavigate } from "react-router-dom"
import {CONTENT_ROUTE_AVATAR, CONTENT_ROUTE_COMPETITORS} from "@/utils/CONSTANTS.ts";

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
  const navigate = useNavigate()

  const handleApprove = () => {
    navigate(CONTENT_ROUTE_AVATAR) // Navigate to video page instead of planning
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Создание сценария</h1>
        <p className="text-muted-foreground">Просмотрите и отредактируйте сгенерированный сценарий</p>
      </div>

      {/* Script Section - now takes full width */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Сценарий контента</CardTitle>
              <CardDescription>AI-сгенерированный сценарий на основе ваших ответов</CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={() => setIsEditing(!isEditing)}>
              <Edit className="h-4 w-4 mr-2" />
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



      {/* Navigation */}
      <div className="flex justify-between items-center pt-6">
        <Button variant="outline" onClick={() => navigate(CONTENT_ROUTE_COMPETITORS)}>
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
        <Button onClick={handleApprove}>
          Далее
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
