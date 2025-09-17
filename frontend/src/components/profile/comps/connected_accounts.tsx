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
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Link2,
  Unlink,
  Settings,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { getAuthToken } from "@/utils/auth";

interface SocialAccount {
  provider: string;
  connected: boolean;
  username: string;
  followers: string;
  lastSync: string;
}

export function ConnectedAccounts() {
  const [accounts, setAccounts] = useState<SocialAccount[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSocialAccounts();
  }, []);

  const fetchSocialAccounts = async () => {
    try {
      const token = getAuthToken();
      const response = await fetch("http://localhost:5090/api/auth/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to fetch social accounts");

      const data = await response.json();
      if (data.success) {
        setAccounts(data.data.socialAccounts);
      }
    } catch (error) {
      console.error("Error fetching social accounts:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = (provider: string) => {
    setAccounts((prev) =>
      prev.map((account) =>
        account.provider === provider
          ? { ...account, connected: true, lastSync: "Только что" }
          : account
      )
    );
  };

  const handleDisconnect = (provider: string) => {
    setAccounts((prev) =>
      prev.map((account) =>
        account.provider === provider
          ? { ...account, connected: false, lastSync: "" }
          : account
      )
    );
  };

  if (loading) return <div>Loading...</div>;

  const connectedCount = accounts.filter((account) => account.connected).length;
  const accountIcons: { [key: string]: string } = {
    youtube: "🎥",
    instagram: "📸",
    vk: "🔵",
    telegram: "✈️",
    tiktok: "🎵",
    facebook: "📘",
  };

  const accountNames: { [key: string]: string } = {
    youtube: "YouTube",
    instagram: "Instagram",
    vk: "ВКонтакте",
    telegram: "Telegram",
    tiktok: "TikTok",
    facebook: "Facebook",
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Подключенные аккаунты</CardTitle>
          <CardDescription>
            Управляйте подключениями к социальным сетям для автоматической
            публикации контента
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center">
                <Link2 className="h-5 w-5 text-accent-foreground" />
              </div>
              <div>
                <p className="font-medium">
                  Подключено аккаунтов: {connectedCount}
                </p>
                <p className="text-sm text-muted-foreground">
                  Из {accounts.length} доступных платформ
                </p>
              </div>
            </div>
            <Badge variant="default">
              {Math.round((connectedCount / accounts.length) * 100)}% покрытие
            </Badge>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {accounts.map((account) => (
          <Card
            key={account.provider}
            className={account.connected ? "border-green-200" : "border-border"}
          >
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="text-2xl">
                    {accountIcons[account.provider]}
                  </div>
                  <div>
                    <h3 className="font-semibold">
                      {accountNames[account.provider]}
                    </h3>
                    {account.connected && (
                      <p className="text-sm text-muted-foreground">
                        {account.username}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {account.connected ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-muted-foreground" />
                  )}
                </div>
              </div>

              {account.connected ? (
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Подписчики:</span>
                    <span className="font-medium">{account.followers}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      Последняя синхронизация:
                    </span>
                    <span className="font-medium">{account.lastSync}</span>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 bg-transparent"
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      Настройки
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDisconnect(account.provider)}
                    >
                      <Unlink className="h-4 w-4 mr-2" />
                      Отключить
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    Подключите аккаунт для автоматической публикации контента
                  </p>
                  <Button
                    onClick={() => handleConnect(account.provider)}
                    className="w-full"
                  >
                    <Link2 className="h-4 w-4 mr-2" />
                    Подключить
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Настройки публикации</CardTitle>
          <CardDescription>
            Глобальные настройки для всех подключенных аккаунтов
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <label className="text-sm font-medium">
                Автоматическая публикация
              </label>
              <p className="text-xs text-muted-foreground">
                Публиковать контент сразу после создания
              </p>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <label className="text-sm font-medium">
                Уведомления о публикации
              </label>
              <p className="text-xs text-muted-foreground">
                Получать уведомления о статусе публикации
              </p>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <label className="text-sm font-medium">
                Синхронизация метрик
              </label>
              <p className="text-xs text-muted-foreground">
                Автоматически обновлять статистику каждый час
              </p>
            </div>
            <Switch defaultChecked />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
