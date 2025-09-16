"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Link2, Unlink, Settings, CheckCircle, AlertCircle } from "lucide-react"

const socialAccounts = [
  {
    id: "youtube",
    name: "YouTube",
    icon: "🎥",
    connected: true,
    username: "@stroymaterials",
    followers: "12.5K",
    status: "active",
    lastSync: "2 часа назад",
  },
  {
    id: "instagram",
    name: "Instagram",
    icon: "📸",
    connected: true,
    username: "@stroymaterials_ru",
    followers: "8.9K",
    status: "active",
    lastSync: "1 час назад",
  },
  {
    id: "vk",
    name: "ВКонтакте",
    icon: "🔵",
    connected: true,
    username: "stroymaterials",
    followers: "15.2K",
    status: "active",
    lastSync: "30 минут назад",
  },
  {
    id: "telegram",
    name: "Telegram",
    icon: "✈️",
    connected: true,
    username: "@stroymaterials_channel",
    followers: "3.4K",
    status: "active",
    lastSync: "5 минут назад",
  },
  {
    id: "tiktok",
    name: "TikTok",
    icon: "🎵",
    connected: false,
    username: "",
    followers: "",
    status: "disconnected",
    lastSync: "",
  },
  {
    id: "facebook",
    name: "Facebook",
    icon: "📘",
    connected: false,
    username: "",
    followers: "",
    status: "disconnected",
    lastSync: "",
  },
]

export function ConnectedAccounts() {
  const [accounts, setAccounts] = useState(socialAccounts)

  const handleConnect = (accountId: string) => {
    setAccounts((prev) =>
      prev.map((account) =>
        account.id === accountId ? { ...account, connected: true, status: "active", lastSync: "Только что" } : account,
      ),
    )
  }

  const handleDisconnect = (accountId: string) => {
    setAccounts((prev) =>
      prev.map((account) =>
        account.id === accountId ? { ...account, connected: false, status: "disconnected", lastSync: "" } : account,
      ),
    )
  }

  const connectedCount = accounts.filter((account) => account.connected).length

  return (
    <div className="space-y-6">
      {/* Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Подключенные аккаунты</CardTitle>
          <CardDescription>
            Управляйте подключениями к социальным сетям для автоматической публикации контента
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center">
                <Link2 className="h-5 w-5 text-accent-foreground" />
              </div>
              <div>
                <p className="font-medium">Подключено аккаунтов: {connectedCount}</p>
                <p className="text-sm text-muted-foreground">Из {accounts.length} доступных платформ</p>
              </div>
            </div>
            <Badge variant="default">{Math.round((connectedCount / accounts.length) * 100)}% покрытие</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Social Accounts List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {accounts.map((account) => (
          <Card key={account.id} className={account.connected ? "border-green-200" : "border-border"}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="text-2xl">{account.icon}</div>
                  <div>
                    <h3 className="font-semibold">{account.name}</h3>
                    {account.connected && <p className="text-sm text-muted-foreground">{account.username}</p>}
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
                    <span className="text-muted-foreground">Последняя синхронизация:</span>
                    <span className="font-medium">{account.lastSync}</span>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                      <Settings className="h-4 w-4 mr-2" />
                      Настройки
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDisconnect(account.id)}>
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
                  <Button onClick={() => handleConnect(account.id)} className="w-full">
                    <Link2 className="h-4 w-4 mr-2" />
                    Подключить
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Publishing Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Настройки публикации</CardTitle>
          <CardDescription>Глобальные настройки для всех подключенных аккаунтов</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <label className="text-sm font-medium">Автоматическая публикация</label>
              <p className="text-xs text-muted-foreground">Публиковать контент сразу после создания</p>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <label className="text-sm font-medium">Уведомления о публикации</label>
              <p className="text-xs text-muted-foreground">Получать уведомления о статусе публикации</p>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <label className="text-sm font-medium">Синхронизация метрик</label>
              <p className="text-xs text-muted-foreground">Автоматически обновлять статистику каждый час</p>
            </div>
            <Switch defaultChecked />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
