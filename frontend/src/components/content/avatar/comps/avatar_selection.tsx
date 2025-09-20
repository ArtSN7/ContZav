"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button.tsx"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card.tsx"
import { Badge } from "@/components/ui/badge.tsx"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar.tsx"
import { ArrowRight, ArrowLeft, User } from "lucide-react"
import { useNavigate } from "react-router-dom"

const avatarOptions = [
  {
    id: "1",
    name: "Алексей",
    gender: "Мужской",
    age: "30-35",
    style: "Деловой",
    avatar: "/placeholder.svg?height=80&width=80",
    voice: "Уверенный, профессиональный",
  },
  {
    id: "2",
    name: "Мария",
    gender: "Женский",
    age: "25-30",
    style: "Дружелюбный",
    avatar: "/placeholder.svg?height=80&width=80",
    voice: "Теплый, располагающий",
  },
  {
    id: "3",
    name: "Дмитрий",
    gender: "Мужской",
    age: "35-40",
    style: "Экспертный",
    avatar: "/placeholder.svg?height=80&width=80",
    voice: "Авторитетный, знающий",
  },
]

export function AvatarSelection() {
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null)
  const navigate = useNavigate()

  const handleNext = () => {
    if (selectedAvatar) {
      navigate("/dashboard/content/preview")
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Выбор аватара</h1>
        <p className="text-muted-foreground">Выберите AI-аватар для озвучивания вашего сценария</p>
      </div>

      {/* Avatar Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Доступные аватары
          </CardTitle>
          <CardDescription>Каждый аватар имеет уникальный голос и стиль подачи</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4">
            {avatarOptions.map((avatar) => (
              <Card
                key={avatar.id}
                className={`cursor-pointer transition-all duration-200 ${
                  selectedAvatar === avatar.id ? "ring-2 ring-primary bg-primary/5" : "hover:bg-muted/50"
                }`}
                onClick={() => setSelectedAvatar(avatar.id)}
              >
                <CardContent className="p-6">
                  <div className="flex items-center gap-6">
                    <Avatar className="w-20 h-20">
                      <AvatarImage src={avatar.avatar || "/placeholder.svg"} />
                      <AvatarFallback className="text-lg">{avatar.name[0]}</AvatarFallback>
                    </Avatar>

                    <div className="flex-1 space-y-3">
                      <div>
                        <h3 className="text-xl font-semibold">{avatar.name}</h3>
                        <p className="text-muted-foreground">{avatar.voice}</p>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <Badge variant="secondary">{avatar.gender}</Badge>
                        <Badge variant="secondary">{avatar.age}</Badge>
                        <Badge variant="secondary">{avatar.style}</Badge>
                      </div>
                    </div>

                    {selectedAvatar === avatar.id && (
                      <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between items-center pt-6">
        <Button variant="outline" onClick={() => navigate("/dashboard/content/script")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Назад
        </Button>
        <div className="flex space-x-2">
          <div className="w-3 h-3 bg-muted rounded-full"></div>
          <div className="w-3 h-3 bg-muted rounded-full"></div>
          <div className="w-3 h-3 bg-muted rounded-full"></div>
          <div className="w-3 h-3 bg-muted rounded-full"></div>
          <div className="w-3 h-3 bg-accent rounded-full"></div>
          <div className="w-3 h-3 bg-muted rounded-full"></div>
        </div>
        <Button onClick={handleNext} disabled={!selectedAvatar}>
          Далее
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
