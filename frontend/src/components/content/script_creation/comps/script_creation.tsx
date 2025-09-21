"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { ArrowRight, ArrowLeft, Edit } from "lucide-react"
import { useNavigate } from "react-router-dom"
import {CONTENT_ROUTE_AVATAR, CONTENT_ROUTE_COMPETITORS} from "@/utils/CONSTANTS.ts";

const sampleScript = `Знаешь, почему 90% маркетологов сливают бюджеты впустую? Они игнорируют самый мощный инструмент влияния на клиентов – психологию. Я проанализировал сотни успешных кампаний и выявил закономерность: бренды, использующие триггеры страха потери, всегда получают конверсию выше на 37%.

Вот три приема, которые работают безотказно. Первый – создай искусственный дефицит. "Осталось всего 5 мест" действует сильнее любой скидки. Второй – используй социальное доказательство, но не банальное. Вместо "нас выбрали 1000 клиентов" покажи, как один конкретный человек решил свою проблему.

И третий, самый мощный – правило взаимного обмена. Дай клиенту что-то ценное бесплатно, и он почувствует необходимость отплатить покупкой. Внедри эти приемы, и твоя конверсия взлетит минимум вдвое.`

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
