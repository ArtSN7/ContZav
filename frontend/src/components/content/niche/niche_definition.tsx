"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button.tsx"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card.tsx"
import { Textarea } from "@/components/ui/textarea.tsx"
import { Input } from "@/components/ui/input.tsx"
import { Checkbox } from "@/components/ui/checkbox.tsx"
import { Sparkles, Plus, ArrowRight, ArrowLeft } from "lucide-react"
import { useNavigate} from "react-router";
import {CONTENT_CREATE_ROUTE, CONTENT_ROUTE_SCRIPT} from "@/utils/CONSTANTS.ts";

const sampleQuestions = [
  "Какие проблемы решают ваши стройматериалы?",
  "Кто ваша целевая аудитория?",
  "Какие преимущества у ваших товаров?",
  "Какие тренды актуальны в вашей нише?",
  "Какие сезонные особенности важны?",
]

export function NicheDefinition() {
  const [niche, setNiche] = useState("")
  const [questions, setQuestions] = useState<string[]>([])
  const [selectedQuestions, setSelectedQuestions] = useState<string[]>([])
  const [customQuestion, setCustomQuestion] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const navigate = useNavigate()

  const generateQuestions = async () => {
    if (!niche.trim()) return

    setIsGenerating(true)
    // Simulate API call
    setTimeout(() => {
      setQuestions(sampleQuestions)
      setIsGenerating(false)
    }, 2000)
  }

  const addCustomQuestion = () => {
    if (customQuestion.trim()) {
      setQuestions([...questions, customQuestion])
      setCustomQuestion("")
    }
  }

  const toggleQuestion = (question: string) => {
    setSelectedQuestions((prev) => (prev.includes(question) ? prev.filter((q) => q !== question) : [...prev, question]))
  }

  const handleNext = () => {
    if (selectedQuestions.length > 0) {
      navigate(CONTENT_ROUTE_SCRIPT)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Определите вашу нишу</h1>
        <p className="text-muted-foreground">Опишите вашу сферу деятельности для генерации релевантных вопросов</p>
      </div>

      {/* Niche Input */}
      <Card>
        <CardHeader>
          <CardTitle>Описание ниши</CardTitle>
          <CardDescription>Расскажите о вашей сфере деятельности, товарах или услугах</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="Например, стройматериалы для частного дома"
            value={niche}
            onChange={(e) => setNiche(e.target.value)}
            className="min-h-[100px]"
          />
          <Button onClick={generateQuestions} disabled={!niche.trim() || isGenerating} className="w-full">
            {isGenerating ? (
              <>
                <Sparkles className="mr-2 h-4 w-4 animate-spin" />
                Генерируем вопросы...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Сгенерировать вопросы
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Generated Questions */}
      {questions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Маркетинговые вопросы</CardTitle>
            <CardDescription>Выберите вопросы, которые помогут создать релевантный контент</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              {questions.map((question, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 border border-border rounded-lg">
                  <Checkbox
                    id={`question-${index}`}
                    checked={selectedQuestions.includes(question)}
                    onCheckedChange={() => toggleQuestion(question)}
                  />
                  <label htmlFor={`question-${index}`} className="text-sm leading-relaxed cursor-pointer flex-1">
                    {question}
                  </label>
                </div>
              ))}
            </div>

            {/* Custom Question Input */}
            <div className="border-t border-border pt-4">
              <div className="flex space-x-2">
                <Input
                  placeholder="Добавить свой вопрос..."
                  value={customQuestion}
                  onChange={(e) => setCustomQuestion(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && addCustomQuestion()}
                />
                <Button onClick={addCustomQuestion} size="icon" variant="outline">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {selectedQuestions.length > 0 && (
              <div className="bg-muted p-4 rounded-lg">
                <p className="text-sm font-medium mb-2">Выбрано вопросов: {selectedQuestions.length}</p>
                <p className="text-xs text-muted-foreground">
                  Эти вопросы будут использованы для создания сценария контента
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Navigation */}
      <div className="flex justify-between items-center pt-6">
        <Button variant="outline" onClick={() => navigate(CONTENT_CREATE_ROUTE)}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Назад
        </Button>
        <div className="flex space-x-2">

          <div className="w-3 h-3 bg-accent rounded-full"></div>
          <div className="w-3 h-3 bg-muted rounded-full"></div>
          <div className="w-3 h-3 bg-muted rounded-full"></div>
          <div className="w-3 h-3 bg-muted rounded-full"></div>
        </div>
        <Button onClick={handleNext} disabled={selectedQuestions.length === 0}>
          Далее
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
