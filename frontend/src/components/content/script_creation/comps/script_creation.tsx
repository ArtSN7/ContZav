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
import { ArrowRight, ArrowLeft, Edit } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  CONTENT_ROUTE_AVATAR,
  CONTENT_ROUTE_COMPETITORS,
} from "@/utils/CONSTANTS.ts";
import { useContentCreation } from "@/contexts/ContentCreationContext";

export function ScriptCreation() {
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();
  const {
    script,
    setScript,
    generateContent,
    loading,
    selectedQuestions,
    niche,
  } = useContentCreation();

  // useEffect(() => {
  //   console.log({ script, selectedQuestions, niche });
  //   if (!script && selectedQuestions.length > 0 && niche) {
  //     generateContent();
  //   }
  // }, []);

  useEffect(() => {
    const generateScript = async () => {
      if (!script) {
        await generateContent();
      }
    };

    generateScript();
  }, []);

  const handleApprove = () => {
    navigate(CONTENT_ROUTE_AVATAR);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-foreground">
          Создание сценария
        </h1>
        <p className="text-muted-foreground">
          Просмотрите и отредактируйте сгенерированный сценарий
        </p>
      </div>

      {/* Script Section - now takes full width */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Сценарий контента</CardTitle>
              <CardDescription>
                AI-сгенерированный сценарий на основе ваших ответов
              </CardDescription>
            </div>
            {script && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(!isEditing)}
              >
                <Edit className="h-4 w-4 mr-2" />
                {isEditing ? "Сохранить" : "Редактировать"}
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-pulse">Генерация сценария...</div>
            </div>
          ) : script ? (
            isEditing ? (
              <Textarea
                value={script}
                onChange={(e) => setScript(e.target.value)}
                className="min-h-[400px] font-mono text-sm"
              />
            ) : (
              <div className="bg-muted p-4 rounded-lg">
                <pre className="whitespace-pre-wrap text-sm leading-relaxed">
                  {script}
                </pre>
              </div>
            )
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              Не удалось сгенерировать сценарий. Пожалуйста, проверьте введенные
              данные.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between items-center pt-6">
        <Button
          variant="outline"
          onClick={() => navigate(CONTENT_ROUTE_COMPETITORS)}
        >
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
        <Button onClick={handleApprove} disabled={!script || loading}>
          Далее
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
