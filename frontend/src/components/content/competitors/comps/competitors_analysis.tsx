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
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  ArrowRight,
  ArrowLeft,
  Users,
  ExternalLink,
  Check,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  CONTENT_ROUTE_NICHE,
  CONTENT_ROUTE_SCRIPT,
} from "@/utils/CONSTANTS.ts";
import { useApp } from "@/contexts/AppContext";

export function CompetitorsAnalysis() {
  const [newCompetitorName, setNewCompetitorName] = useState("");
  const navigate = useNavigate();
  const {
    competitors,
    selectedCompetitors,
    setSelectedCompetitors,
    addCompetitor,
    loadingCompetitors,
    refreshCompetitors,
  } = useApp();

  useEffect(() => {
    refreshCompetitors();
  }, []);

  const addCustomCompetitor = async () => {
    if (newCompetitorName.trim()) {
      try {
        await addCompetitor({
          name: newCompetitorName.trim(),
          platform: "Custom",
        });
        setNewCompetitorName("");
      } catch (error) {
        console.error("Error adding competitor:", error);
      }
    }
  };

  const toggleCompetitor = (id: string) => {
    setSelectedCompetitors((prev: string[]) =>
      prev.includes(id) ? prev.filter((c: string) => c !== id) : [...prev, id]
    );
  };

  const handleNext = () => {
    navigate(CONTENT_ROUTE_SCRIPT);
  };

  const allCompetitors = [...competitors];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-foreground">
          Анализ конкурентов
        </h1>
        <p className="text-muted-foreground">
          Выберите конкурентов для анализа вашей ниши
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Рекомендуемые конкуренты
          </CardTitle>
          <CardDescription>
            Выберите конкурентов из списка или добавьте своих
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loadingCompetitors ? (
            <div className="text-center py-4">
              <div className="animate-pulse">Загрузка конкурентов...</div>
            </div>
          ) : (
            <div className="space-y-3">
              {allCompetitors.map((competitor) => (
                <div
                  key={competitor.id}
                  className={`flex items-center justify-between p-4 rounded-lg border cursor-pointer transition-all duration-200 hover:bg-muted/50 ${
                    selectedCompetitors.includes(competitor.id)
                      ? "bg-primary/5 border-primary"
                      : "border-border"
                  }`}
                  onClick={() => toggleCompetitor(competitor.id)}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                        selectedCompetitors.includes(competitor.id)
                          ? "bg-primary border-primary"
                          : "border-muted-foreground"
                      }`}
                    >
                      {selectedCompetitors.includes(competitor.id) && (
                        <Check className="w-3 h-3 text-primary-foreground" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-medium">{competitor.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="secondary" className="text-xs">
                          {competitor.platform}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  {competitor.url && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(competitor.url, "_blank");
                      }}
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
              {allCompetitors.length === 0 && (
                <div className="text-center py-4 text-muted-foreground">
                  Нет доступных конкурентов
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Добавить конкурента
          </CardTitle>
          <CardDescription>Добавьте название канала конкурента</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3">
            <Input
              placeholder="Название канала"
              value={newCompetitorName}
              onChange={(e) => setNewCompetitorName(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && addCustomCompetitor()}
              className="flex-1"
            />
            <Button
              onClick={addCustomCompetitor}
              disabled={!newCompetitorName.trim() || loadingCompetitors}
            >
              <Plus className="w-4 h-4 mr-2" />
              Добавить
            </Button>
          </div>
        </CardContent>
      </Card>

      {selectedCompetitors.length > 0 && (
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">
                  Выбрано конкурентов: {selectedCompetitors.length}
                </p>
                <p className="text-sm text-muted-foreground">
                  Эти данные будут использованы для создания уникального
                  контента
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

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
        <Button onClick={handleNext}>
          Далее
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
