"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Play,
  ThumbsUp,
  ThumbsDown,
  ArrowRight,
  ArrowLeft,
  Edit,
  Loader2,
} from "lucide-react";
import { useNavigate } from "react-router";
import { CONTENT_ROUTE_NICHE, CONTENT_ROUTE_PLANNING } from "@/utils/CONSTANTS";
import { useContentCreation } from "@/contexts/ContentCreationContext";

export function ScriptCreation() {
  const {
    script,
    setScript,
    videoUrl,
    loading,
    generateContent,
    niche,
    selectedQuestions,
    customQuestions,
  } = useContentCreation();

  const [isEditing, setIsEditing] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [showFeedback, setShowFeedback] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (niche && selectedQuestions.length > 0 && !script) {
      generateContent();
    }
  }, [niche, selectedQuestions, script, generateContent]);

  const handleApprove = () => {
    navigate(CONTENT_ROUTE_PLANNING);
  };

  const handleReject = () => {
    setShowFeedback(true);
  };

  const submitFeedback = async () => {
    try {
      const token = localStorage.getItem("auth_token");
      const response = await fetch(
        `http://localhost:5090/api/ai/regenerate-content/mock`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ feedback }),
        }
      );

      if (!response.ok) throw new Error("Failed to regenerate content");

      await generateContent();
      setShowFeedback(false);
      setFeedback("");
    } catch (error) {
      console.error("Error submitting feedback:", error);
    }
  };

  const handleEditSave = () => {
    if (isEditing) {
      setIsEditing(false);
    } else {
      setIsEditing(true);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-foreground">
          Сценарий и тестовый ролик
        </h1>
        <p className="text-muted-foreground">
          Просмотрите сгенерированный сценарий и тестовое видео
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Сценарий контента</CardTitle>
                <CardDescription>
                  AI-сгенерированный сценарий на основе ваших ответов
                </CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleEditSave}
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Edit className="h-4 w-4 mr-2" />
                )}
                {isEditing ? "Сохранить" : "Редактировать"}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                <span className="ml-2 text-muted-foreground">
                  Генерируем контент...
                </span>
              </div>
            ) : isEditing ? (
              <Textarea
                value={script}
                onChange={(e) => setScript(e.target.value)}
                className="min-h-[400px] font-mono text-sm"
                placeholder="Введите ваш сценарий..."
              />
            ) : (
              <div className="bg-muted p-4 rounded-lg">
                <pre className="whitespace-pre-wrap text-sm leading-relaxed">
                  {script || "Сценарий будет сгенерирован здесь..."}
                </pre>
              </div>
            )}
            {script && !loading && (
              <div className="mt-4 flex flex-wrap gap-2">
                <Badge variant="secondary">Длительность: ~45 сек</Badge>
                <Badge variant="secondary">Формат: Вертикальное видео</Badge>
                <Badge variant="secondary">Хештеги: 4</Badge>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Тестовый ролик</CardTitle>
            <CardDescription>
              Предварительный просмотр с AI-аватаром
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {loading ? (
              <div className="aspect-[9/16] flex items-center justify-center bg-muted rounded-lg">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                <span className="ml-2 text-muted-foreground">
                  Генерируем видео...
                </span>
              </div>
            ) : videoUrl ? (
              <div className="aspect-[9/16] bg-gradient-to-br from-gray-900 to-gray-700 rounded-lg flex items-center justify-center relative overflow-hidden">
                <div className="text-center text-white space-y-4">
                  <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto">
                    <Play className="h-8 w-8 ml-1" />
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium">AI-Аватар</p>
                    <p className="text-xs opacity-80">
                      Нажмите для воспроизведения
                    </p>
                  </div>
                </div>
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="bg-black/50 backdrop-blur-sm rounded-lg p-3">
                    <p className="text-white text-xs leading-relaxed">
                      "Привет! Сегодня расскажу о самых частых ошибках при
                      выборе стройматериалов..."
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="aspect-[9/16] bg-muted rounded-lg flex items-center justify-center">
                <p className="text-muted-foreground text-center px-4">
                  {script
                    ? "Видео готовится..."
                    : "Видео будет сгенерировано после создания сценария"}
                </p>
              </div>
            )}

            {videoUrl && !loading && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Качество:</span>
                  <span className="font-medium">HD 1080p</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Голос:</span>
                  <span className="font-medium">Мужской, русский</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Фон:</span>
                  <span className="font-medium">Офисный</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Утверждение контента</CardTitle>
          <CardDescription>
            Одобрите сценарий и видео для продолжения или оставьте отзыв для
            улучшения
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!showFeedback ? (
            <div className="flex justify-center space-x-4">
              <Button
                onClick={handleApprove}
                size="lg"
                className="bg-green-600 hover:bg-green-700"
                disabled={!script || loading}
              >
                <ThumbsUp className="mr-2 h-5 w-5" />
                Утвердить
              </Button>
              <Button
                onClick={handleReject}
                variant="destructive"
                size="lg"
                disabled={!script || loading}
              >
                <ThumbsDown className="mr-2 h-5 w-5" />
                Отклонить
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <Textarea
                placeholder="Опишите, что нужно изменить в сценарии или видео..."
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                className="min-h-[100px]"
              />
              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setShowFeedback(false)}
                >
                  Отмена
                </Button>
                <Button
                  onClick={submitFeedback}
                  disabled={!feedback.trim() || loading}
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : null}
                  Отправить отзыв
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-between items-center pt-6">
        <Button variant="outline" onClick={() => navigate(CONTENT_ROUTE_NICHE)}>
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
        <Button onClick={handleApprove} disabled={!script || loading}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
          Далее
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
