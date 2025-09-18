"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Sparkles, Plus, ArrowRight, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router";
import { CONTENT_CREATE_ROUTE, CONTENT_ROUTE_SCRIPT } from "@/utils/CONSTANTS";
import { useContentCreation } from "@/contexts/ContentCreationContext";

export function NicheDefinition() {
  const {
    niche,
    setNiche,
    questions,
    selectedQuestions,
    customQuestions,
    loading,
    generateQuestions,
    setSelectedQuestions,
    addCustomQuestion,
    removeCustomQuestion,
  } = useContentCreation();

  const [customQuestion, setCustomQuestion] = useState("");
  const navigate = useNavigate();

  const toggleQuestion = (question: string) => {
    setSelectedQuestions((prev) =>
      prev.includes(question)
        ? prev.filter((q) => q !== question)
        : [...prev, question]
    );
  };

  const handleAddCustomQuestion = () => {
    if (customQuestion.trim()) {
      addCustomQuestion(customQuestion);
      setCustomQuestion("");
    }
  };

  const handleNext = () => {
    if (selectedQuestions.length + customQuestions.length > 0) {
      navigate(CONTENT_ROUTE_SCRIPT);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-foreground">
          Определите вашу нишу
        </h1>
        <p className="text-muted-foreground">
          Опишите вашу сферу деятельности для генерации релевантных вопросов
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Описание ниши</CardTitle>
          <CardDescription>
            Расскажите о вашей сфере деятельности, товарах или услугах
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="Например, стройматериалы для частного дома"
            value={niche}
            onChange={(e) => setNiche(e.target.value)}
            className="min-h-[100px]"
          />
          <Button
            onClick={generateQuestions}
            disabled={!niche.trim() || loading}
            className="w-full"
          >
            {loading ? (
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

      {questions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Маркетинговые вопросы</CardTitle>
            <CardDescription>
              Выберите вопросы, которые помогут создать релевантный контент
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              {questions.map((question, index) => (
                <div
                  key={index}
                  className="flex items-start space-x-3 p-3 border border-border rounded-lg"
                >
                  <Checkbox
                    id={`question-${index}`}
                    checked={selectedQuestions.includes(question)}
                    onCheckedChange={() => toggleQuestion(question)}
                  />
                  <label
                    htmlFor={`question-${index}`}
                    className="text-sm leading-relaxed cursor-pointer flex-1"
                  >
                    {question}
                  </label>
                </div>
              ))}
            </div>

            <div className="border-t border-border pt-4">
              <div className="flex space-x-2">
                <Input
                  placeholder="Добавить свой вопрос..."
                  value={customQuestion}
                  onChange={(e) => setCustomQuestion(e.target.value)}
                  onKeyPress={(e) =>
                    e.key === "Enter" && handleAddCustomQuestion()
                  }
                />
                <Button
                  onClick={handleAddCustomQuestion}
                  size="icon"
                  variant="outline"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              {customQuestions.length > 0 && (
                <div className="mt-3 space-y-2">
                  {customQuestions.map((question, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 bg-muted rounded"
                    >
                      <span className="text-sm">{question}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeCustomQuestion(index)}
                      >
                        ×
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {(selectedQuestions.length > 0 || customQuestions.length > 0) && (
              <div className="bg-muted p-4 rounded-lg">
                <p className="text-sm font-medium mb-2">
                  Выбрано вопросов:{" "}
                  {selectedQuestions.length + customQuestions.length}
                </p>
                <p className="text-xs text-muted-foreground">
                  Эти вопросы будут использованы для создания сценария контента
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <div className="flex justify-between items-center pt-6">
        <Button
          variant="outline"
          onClick={() => navigate(CONTENT_CREATE_ROUTE)}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Назад
        </Button>
        <div className="flex space-x-2">
          <div className="w-3 h-3 bg-accent rounded-full"></div>
          <div className="w-3 h-3 bg-muted rounded-full"></div>
          <div className="w-3 h-3 bg-muted rounded-full"></div>
          <div className="w-3 h-3 bg-muted rounded-full"></div>
        </div>
        <Button
          onClick={handleNext}
          disabled={selectedQuestions.length + customQuestions.length === 0}
        >
          Далее
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
