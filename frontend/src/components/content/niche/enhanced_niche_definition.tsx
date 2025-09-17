"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card.tsx"
import { Button } from "@/components/ui/button.tsx"
import { Input } from "@/components/ui/input.tsx"
import { Textarea } from "@/components/ui/textarea.tsx"
import { Checkbox } from "@/components/ui/checkbox.tsx"
import { Badge } from "@/components/ui/badge.tsx"
import { Separator } from "@/components/ui/separator.tsx"
import { Lightbulb, Plus, Wand2, Target, TrendingUp } from "lucide-react"

interface MarketingQuestion {
  id: string
  question: string
  category: "audience" | "problems" | "solutions" | "competition" | "trends"
  selected: boolean
}

export function EnhancedNicheDefinition({
  onComplete,
}: {
  onComplete: (niche: string, questions: string[], customQuestions: string[]) => void
}) {
  const [niche, setNiche] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [marketingQuestions, setMarketingQuestions] = useState<MarketingQuestion[]>([])
  const [customQuestion, setCustomQuestion] = useState("")
  const [customQuestions, setCustomQuestions] = useState<string[]>([])

  const analyzeNiche = async () => {
    if (!niche.trim()) return

    setIsAnalyzing(true)

    // Simulate AI analysis and question generation
    setTimeout(() => {
      const generatedQuestions: MarketingQuestion[] = [
        {
          id: "1",
          question: `Какие основные проблемы испытывает ваша аудитория в сфере "${niche}"?`,
          category: "problems",
          selected: false,
        },
        {
          id: "2",
          question: `Кто ваши главные конкуренты в нише "${niche}"?`,
          category: "competition",
          selected: false,
        },
        {
          id: "3",
          question: `Какие тренды сейчас актуальны в области "${niche}"?`,
          category: "trends",
          selected: false,
        },
        {
          id: "4",
          question: `Какой бюджет обычно выделяют клиенты на решения в сфере "${niche}"?`,
          category: "audience",
          selected: false,
        },
        {
          id: "5",
          question: `Какие уникальные преимущества может предложить ваш продукт/услуга?`,
          category: "solutions",
          selected: false,
        },
        {
          id: "6",
          question: `В какое время года спрос на "${niche}" наиболее высокий?`,
          category: "trends",
          selected: false,
        },
        {
          id: "7",
          question: `Какие каналы коммуникации предпочитает ваша целевая аудитория?`,
          category: "audience",
          selected: false,
        },
        {
          id: "8",
          question: `Какие мифы или заблуждения существуют в нише "${niche}"?`,
          category: "problems",
          selected: false,
        },
      ]

      setMarketingQuestions(generatedQuestions)
      setIsAnalyzing(false)
    }, 2000)
  }

  const toggleQuestion = (questionId: string) => {
    setMarketingQuestions((prev) => prev.map((q) => (q.id === questionId ? { ...q, selected: !q.selected } : q)))
  }

  const addCustomQuestion = () => {
    if (customQuestion.trim()) {
      setCustomQuestions((prev) => [...prev, customQuestion.trim()])
      setCustomQuestion("")
    }
  }

  const removeCustomQuestion = (index: number) => {
    setCustomQuestions((prev) => prev.filter((_, i) => i !== index))
  }

  const handleComplete = () => {
    const selectedQuestions = marketingQuestions.filter((q) => q.selected).map((q) => q.question)

    onComplete(niche, selectedQuestions, customQuestions)
  }

  const getCategoryIcon = (category: MarketingQuestion["category"]) => {
    switch (category) {
      case "audience":
        return Target
      case "problems":
        return Lightbulb
      case "solutions":
        return Plus
      case "competition":
        return TrendingUp
      case "trends":
        return TrendingUp
      default:
        return Lightbulb
    }
  }

  const getCategoryColor = (category: MarketingQuestion["category"]) => {
    switch (category) {
      case "audience":
        return "bg-blue-100 text-blue-800"
      case "problems":
        return "bg-red-100 text-red-800"
      case "solutions":
        return "bg-green-100 text-green-800"
      case "competition":
        return "bg-purple-100 text-purple-800"
      case "trends":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getCategoryName = (category: MarketingQuestion["category"]) => {
    switch (category) {
      case "audience":
        return "Аудитория"
      case "problems":
        return "Проблемы"
      case "solutions":
        return "Решения"
      case "competition":
        return "Конкуренция"
      case "trends":
        return "Тренды"
      default:
        return "Общее"
    }
  }

  const selectedCount = marketingQuestions.filter((q) => q.selected).length + customQuestions.length

  return (
    <div className="space-y-6">
      {/* Niche Input */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Определение ниши
          </CardTitle>
          <CardDescription>Опишите вашу нишу для генерации релевантных маркетинговых вопросов</CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Описание ниши</label>
            <Textarea
              value={niche}
              onChange={(e) => setNiche(e.target.value)}
              placeholder="Например: стройматериалы для частного дома, косметология для мужчин, IT-консалтинг для малого бизнеса..."
              className="min-h-[100px]"
            />
          </div>

          <Button onClick={analyzeNiche} disabled={!niche.trim() || isAnalyzing} className="w-full" size="lg">
            {isAnalyzing ? (
              <>
                <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                Анализируем нишу...
              </>
            ) : (
              <>
                <Wand2 className="w-4 h-4 mr-2" />
                Сгенерировать вопросы
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Generated Questions */}
      {marketingQuestions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Маркетинговые вопросы</CardTitle>
            <CardDescription>
              Выберите наиболее релевантные вопросы для улучшения контента ({selectedCount} выбрано)
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="grid gap-3">
              {marketingQuestions.map((question) => {
                const Icon = getCategoryIcon(question.category)

                return (
                  <div
                    key={question.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-all ${
                      question.selected ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                    }`}
                    onClick={() => toggleQuestion(question.id)}
                  >
                    <div className="flex items-start gap-3">
                      <Checkbox
                        checked={question.selected}
                        onChange={() => toggleQuestion(question.id)}
                        className="mt-1"
                      />

                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className={getCategoryColor(question.category)}>
                            <Icon className="w-3 h-3 mr-1" />
                            {getCategoryName(question.category)}
                          </Badge>
                        </div>

                        <p className="text-sm leading-relaxed">{question.question}</p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            <Separator />

            {/* Custom Questions */}
            <div className="space-y-3">
              <h4 className="font-medium">Добавить свой вопрос</h4>

              <div className="flex gap-2">
                <Input
                  value={customQuestion}
                  onChange={(e) => setCustomQuestion(e.target.value)}
                  placeholder="Введите свой маркетинговый вопрос..."
                  onKeyPress={(e) => e.key === "Enter" && addCustomQuestion()}
                />
                <Button onClick={addCustomQuestion} disabled={!customQuestion.trim()}>
                  <Plus className="w-4 h-4" />
                </Button>
              </div>

              {customQuestions.length > 0 && (
                <div className="space-y-2">
                  {customQuestions.map((question, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 bg-muted rounded">
                      <span className="flex-1 text-sm">{question}</span>
                      <Button variant="ghost" size="sm" onClick={() => removeCustomQuestion(index)}>
                        ×
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <Button onClick={handleComplete} disabled={selectedCount === 0} className="w-full" size="lg">
              Продолжить с выбранными вопросами ({selectedCount})
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
