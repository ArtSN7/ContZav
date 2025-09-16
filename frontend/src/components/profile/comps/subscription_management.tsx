"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Crown, Calendar, CreditCard, Download, AlertTriangle } from "lucide-react"

export function SubscriptionManagement() {
  const [currentPlan] = useState({
    name: "Pro",
    price: 5990,
    billingCycle: "monthly",
    nextBilling: "15 января 2025",
    status: "active",
  })

  const [usage] = useState({
    videosUsed: 32,
    videosLimit: 50,
    networksUsed: 5,
    networksLimit: 10,
  })

  return (
    <div className="space-y-6">
      {/* Current Plan */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Crown className="h-5 w-5 text-accent" />
            <span>Текущий тариф</span>
          </CardTitle>
          <CardDescription>Информация о вашей подписке и использовании</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="text-2xl font-bold">{currentPlan.name} Plan</h3>
              <p className="text-muted-foreground">
                {currentPlan.price.toLocaleString()} ₽/{currentPlan.billingCycle === "monthly" ? "месяц" : "год"}
              </p>
            </div>
            <Badge variant={currentPlan.status === "active" ? "default" : "destructive"}>
              {currentPlan.status === "active" ? "Активна" : "Неактивна"}
            </Badge>
          </div>

          <Separator />

          {/* Usage Statistics */}
          <div className="space-y-4">
            <h4 className="font-semibold">Использование за месяц</h4>

            <div className="space-y-3">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Видео/посты</span>
                  <span>
                    {usage.videosUsed} из {usage.videosLimit}
                  </span>
                </div>
                <Progress value={(usage.videosUsed / usage.videosLimit) * 100} className="h-2" />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Социальные сети</span>
                  <span>
                    {usage.networksUsed} из {usage.networksLimit}
                  </span>
                </div>
                <Progress value={(usage.networksUsed / usage.networksLimit) * 100} className="h-2" />
              </div>
            </div>
          </div>

          <Separator />

          {/* Billing Info */}
          <div className="space-y-3">
            <h4 className="font-semibold">Информация о платежах</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>Следующий платеж: {currentPlan.nextBilling}</span>
              </div>
              <div className="flex items-center space-x-2">
                <CreditCard className="h-4 w-4 text-muted-foreground" />
                <span>Карта: •••• •••• •••• 1234</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Plan Management */}
      <Card>
        <CardHeader>
          <CardTitle>Управление подпиской</CardTitle>
          <CardDescription>Измените тариф или управляйте платежами</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="h-auto p-4 flex flex-col space-y-2 bg-transparent">
              <Crown className="h-6 w-6" />
              <span className="font-medium">Изменить тариф</span>
              <span className="text-xs text-muted-foreground">Повысить или понизить</span>
            </Button>

            <Button variant="outline" className="h-auto p-4 flex flex-col space-y-2 bg-transparent">
              <CreditCard className="h-6 w-6" />
              <span className="font-medium">Способ оплаты</span>
              <span className="text-xs text-muted-foreground">Изменить карту</span>
            </Button>

            <Button variant="outline" className="h-auto p-4 flex flex-col space-y-2 bg-transparent">
              <Download className="h-6 w-6" />
              <span className="font-medium">Счета</span>
              <span className="text-xs text-muted-foreground">Скачать документы</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Billing History */}
      <Card>
        <CardHeader>
          <CardTitle>История платежей</CardTitle>
          <CardDescription>Последние транзакции по вашему аккаунту</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { date: "15.12.2024", amount: 5990, status: "paid", invoice: "INV-001234" },
              { date: "15.11.2024", amount: 5990, status: "paid", invoice: "INV-001233" },
              { date: "15.10.2024", amount: 5990, status: "paid", invoice: "INV-001232" },
            ].map((payment, index) => (
              <div key={index} className="flex items-center justify-between p-3 border border-border rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div>
                    <p className="text-sm font-medium">{payment.amount.toLocaleString()} ₽</p>
                    <p className="text-xs text-muted-foreground">{payment.date}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary">{payment.invoice}</Badge>
                  <Button variant="ghost" size="sm">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-destructive">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            <span>Опасная зона</span>
          </CardTitle>
          <CardDescription>Необратимые действия с вашей подпиской</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-destructive/20 rounded-lg">
            <div>
              <h4 className="font-medium">Отменить подписку</h4>
              <p className="text-sm text-muted-foreground">Подписка будет отменена в конце текущего периода</p>
            </div>
            <Button variant="destructive">Отменить</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
