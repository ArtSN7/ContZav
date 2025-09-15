"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

export function AuthPage() {
  const [isLogin, setIsLogin] = useState(true)

  const handleSocialAuth = (provider: string) => {
    // Mock authentication - in real app would integrate with OAuth providers
    console.log(`Authenticating with ${provider}`)
    // Redirect to dashboard after successful auth
    window.location.href = "/dashboard"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Logo and Brand */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center space-x-2">
            <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
              <span className="text-accent-foreground font-bold text-lg">КЗ</span>
            </div>
            <h1 className="text-2xl font-bold text-foreground">Контент Завод</h1>
          </div>
          <p className="text-muted-foreground">Автоматизация создания контента для социальных сетей</p>
        </div>

        {/* Auth Card */}
        <Card className="border-border shadow-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">{isLogin ? "Войти в аккаунт" : "Создать аккаунт"}</CardTitle>
            <CardDescription className="text-center">
              {isLogin ? "Выберите способ входа в систему" : "Выберите способ регистрации"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Social Auth Buttons */}
            <div className="space-y-3">
              <Button
                variant="outline"
                className="w-full h-12 text-left justify-start space-x-3 bg-transparent"
                onClick={() => handleSocialAuth("google")}
              >
                <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">G</span>
                </div>
                <span>Продолжить с Google</span>
              </Button>

              <Button
                variant="outline"
                className="w-full h-12 text-left justify-start space-x-3 bg-transparent"
                onClick={() => handleSocialAuth("vk")}
              >
                <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">VK</span>
                </div>
                <span>Продолжить с ВКонтакте</span>
              </Button>

              <Button
                variant="outline"
                className="w-full h-12 text-left justify-start space-x-3 bg-transparent"
                onClick={() => handleSocialAuth("apple")}
              >
                <div className="w-5 h-5 bg-black rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">🍎</span>
                </div>
                <span>Продолжить с Apple</span>
              </Button>
            </div>

            <Separator className="my-6" />

            {/* Toggle between login/register */}
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                {isLogin ? "Нет аккаунта?" : "Уже есть аккаунт?"}
                <Button variant="link" className="p-0 ml-1 h-auto text-accent" onClick={() => setIsLogin(!isLogin)}>
                  {isLogin ? "Зарегистрироваться" : "Войти"}
                </Button>
              </p>
            </div>

            {/* Terms */}
            <p className="text-xs text-muted-foreground text-center leading-relaxed">
              Продолжая, вы соглашаетесь с{" "}
              <a href="#" className="text-accent hover:underline">
                Условиями использования
              </a>{" "}
              и{" "}
              <a href="#" className="text-accent hover:underline">
                Политикой конфиденциальности
              </a>
            </p>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center">
          <p className="text-xs text-muted-foreground">© 2024 Контент Завод. Все права защищены.</p>
        </div>
      </div>
    </div>
  )
}
