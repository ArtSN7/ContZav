"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button.tsx"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card.tsx"
import { Input } from "@/components/ui/input.tsx"
import { Label } from "@/components/ui/label.tsx"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group.tsx"
import { Badge } from "@/components/ui/badge.tsx"
import { Separator } from "@/components/ui/separator.tsx"
import { Switch } from "@/components/ui/switch.tsx"
import { CreditCard, Check, Zap, Crown, ArrowLeft, Rocket } from "lucide-react"
import { useNavigate} from "react-router";
import {CONTENT_ROUTE_PLANNING, DASHBOARD_ROUTE} from "@/utils/CONSTANTS.ts";

const plans = [
  {
    id: "basic",
    name: "Basic",
    price: 2990,
    features: ["20 роликов/месяц", "5 соцсетей", "Базовая поддержка", "HD качество"],
    icon: Zap,
    color: "text-blue-600",
  },
  {
    id: "pro",
    name: "Pro",
    price: 5990,
    features: ["50 роликов/месяц", "Все соцсети", "Приоритетная поддержка", "4K качество", "Аналитика"],
    icon: Crown,
    color: "text-purple-600",
    popular: true,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: 12990,
    features: [
      "Безлимитные ролики",
      "Все соцсети",
      "Персональный менеджер",
      "4K качество",
      "Расширенная аналитика",
      "API доступ",
    ],
    icon: Rocket,
    color: "text-orange-600",
  },
]

export function PricingLaunch() {
  const [selectedPlan, setSelectedPlan] = useState("pro")
  const [isAnnual, setIsAnnual] = useState(false)
  const [cardNumber, setCardNumber] = useState("")
  const [expiryDate, setExpiryDate] = useState("")
  const [cvv, setCvv] = useState("")
  const [cardName, setCardName] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const navigate = useNavigate()

  // Mock calculation based on content count and networks
  const contentCount = 5
  const networksCount = 3
  const basePrice = plans.find((p) => p.id === selectedPlan)?.price || 0
  const annualDiscount = isAnnual ? 0.2 : 0
  const finalPrice = Math.round(basePrice * (1 - annualDiscount))

  const handlePayment = async () => {
    if (!cardNumber || !expiryDate || !cvv || !cardName) return

    setIsProcessing(true)
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false)
      // Redirect to success page or dashboard
      navigate(DASHBOARD_ROUTE)
    }, 3000)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Тарифы и запуск</h1>
        <p className="text-muted-foreground">Выберите подходящий тариф и запустите создание контента</p>
      </div>

      {/* Dynamic Pricing */}
      <Card className="border-accent">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <CreditCard className="h-5 w-5" />
            <span>Стоимость вашего заказа</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span>Количество роликов:</span>
              <span>{contentCount} шт.</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Социальные сети:</span>
              <span>{networksCount} платформы</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Выбранный тариф:</span>
              <span className="capitalize">{selectedPlan}</span>
            </div>
            {isAnnual && (
              <div className="flex justify-between text-sm text-green-600">
                <span>Скидка за годовую оплату:</span>
                <span>-20%</span>
              </div>
            )}
            <Separator />
            <div className="flex justify-between text-lg font-bold">
              <span>Итого:</span>
              <span>
                {finalPrice.toLocaleString()} ₽{isAnnual ? "/год" : "/месяц"}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Subscription Plans */}
      <Card>
        <CardHeader>
          <CardTitle>Выберите тарифный план</CardTitle>
          <CardDescription>Все планы включают создание контента с AI и публикацию в соцсетях</CardDescription>
          <div className="flex items-center space-x-2 pt-2">
            <Label htmlFor="annual-toggle" className="text-sm">
              Месячная оплата
            </Label>
            <Switch id="annual-toggle" checked={isAnnual} onCheckedChange={setIsAnnual} />
            <Label htmlFor="annual-toggle" className="text-sm">
              Годовая оплата
            </Label>
            {isAnnual && <Badge variant="secondary">-20%</Badge>}
          </div>
        </CardHeader>
        <CardContent>
          <RadioGroup value={selectedPlan} onValueChange={setSelectedPlan}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {plans.map((plan) => (
                <div
                  key={plan.id}
                  className={`relative p-4 border rounded-lg cursor-pointer transition-all ${
                    selectedPlan === plan.id ? "border-accent bg-accent/5" : "border-border hover:border-accent/50"
                  } ${plan.popular ? "ring-2 ring-accent" : ""}`}
                  onClick={() => setSelectedPlan(plan.id)}
                >
                  {plan.popular && (
                    <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2">Популярный</Badge>
                  )}
                  <div className="flex items-center space-x-2 mb-3">
                    <RadioGroupItem value={plan.id} id={plan.id} />
                    <plan.icon className={`h-5 w-5 ${plan.color}`} />
                    <Label htmlFor={plan.id} className="font-semibold">
                      {plan.name}
                    </Label>
                  </div>
                  <div className="mb-4">
                    <span className="text-2xl font-bold">
                      {Math.round(plan.price * (1 - annualDiscount)).toLocaleString()}
                    </span>
                    <span className="text-muted-foreground"> ₽{isAnnual ? "/год" : "/мес"}</span>
                  </div>
                  <ul className="space-y-2">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center space-x-2 text-sm">
                        <Check className="h-4 w-4 text-green-600" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Payment Form */}
      <Card>
        <CardHeader>
          <CardTitle>Данные для оплаты</CardTitle>
          <CardDescription>Введите данные банковской карты для оплаты</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="card-number">Номер карты</Label>
              <Input
                id="card-number"
                placeholder="1234 5678 9012 3456"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                maxLength={19}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="card-name">Имя на карте</Label>
              <Input
                id="card-name"
                placeholder="IVAN PETROV"
                value={cardName}
                onChange={(e) => setCardName(e.target.value)}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="expiry">Срок действия</Label>
              <Input
                id="expiry"
                placeholder="MM/YY"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                maxLength={5}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cvv">CVV</Label>
              <Input
                id="cvv"
                placeholder="123"
                value={cvv}
                onChange={(e) => setCvv(e.target.value)}
                maxLength={3}
                type="password"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Launch Button */}
      <Card>
        <CardContent className="pt-6">
          <Button
            onClick={handlePayment}
            disabled={!cardNumber || !expiryDate || !cvv || !cardName || isProcessing}
            size="lg"
            className="w-full h-14 text-lg"
          >
            {isProcessing ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                Обработка платежа...
              </>
            ) : (
              <>
                <Rocket className="mr-3 h-6 w-6" />
                Оплатить и запустить ({finalPrice.toLocaleString()} ₽)
              </>
            )}
          </Button>
          <p className="text-xs text-muted-foreground text-center mt-3">
            Нажимая кнопку, вы соглашаетесь с условиями использования и политикой конфиденциальности
          </p>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between items-center pt-6">
        <Button variant="outline" onClick={() => navigate(CONTENT_ROUTE_PLANNING)}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Назад
        </Button>
        <div className="flex space-x-2">
          <div className="w-3 h-3 bg-muted rounded-full"></div>
          <div className="w-3 h-3 bg-muted rounded-full"></div>
          <div className="w-3 h-3 bg-muted rounded-full"></div>
          <div className="w-3 h-3 bg-muted rounded-full"></div>
          <div className="w-3 h-3 bg-accent rounded-full"></div>
        </div>
      </div>
    </div>
  )
}
