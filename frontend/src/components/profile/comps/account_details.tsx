"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Camera, Save, User } from "lucide-react"

// Интерфейс для типизации данных профиля
interface ProfileData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  bio: string;
  website: string;
  avatarUrl?: string;
  badges: { variant: "default" | "secondary"; label: string }[];
}

// Функция для получения данных профиля (пока с мок-данными)
const getProfileData = (): ProfileData => {
  return {
    firstName: "Иван",
    lastName: "Петров",
    email: "ivan@example.com",
    phone: "+7 (999) 123-45-67",
    company: "ООО 'СтройМатериалы'",
    bio: "Эксперт в области строительных материалов с 10-летним опытом работы в отрасли.",
    website: "https://stroymaterials.ru",
    avatarUrl: "https://api.dicebear.com/9.x/adventurer/svg?seed=Amaya",
    badges: [
      { variant: "default", label: "Pro Plan" },
      { variant: "secondary", label: "Верифицирован" },
    ],
  };
};

export function AccountDetails() {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<ProfileData>(getProfileData());

  const handleSave = () => {
    // Mock save functionality
    console.log("Saving profile data:", formData);
    setIsEditing(false);
  };

  const handleInputChange = (field: keyof ProfileData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <Card>
        <CardHeader>
          <CardTitle>Основная информация</CardTitle>
          <CardDescription>Управляйте своими личными данными и настройками профиля</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Avatar Section */}
          <div className="flex items-center space-x-6">
            <div className="relative">
              <Avatar className="h-24 w-24">
                <AvatarImage src={formData.avatarUrl} />
                <AvatarFallback className="text-lg">
                  {formData.firstName[0]}
                  {formData.lastName[0]}
                </AvatarFallback>
              </Avatar>
              <Button
                size="icon"
                variant="outline"
                className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full bg-transparent"
              >
                <Camera className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-semibold">
                {formData.firstName} {formData.lastName}
              </h3>
              <p className="text-muted-foreground">{formData.email}</p>
              <div className="flex space-x-2">
                {formData.badges.map((badge, index) => (
                  <Badge key={index} variant={badge.variant}>
                    {badge.label}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="firstName">Имя</Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) => handleInputChange("firstName", e.target.value)}
                disabled={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Фамилия</Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) => handleInputChange("lastName", e.target.value)}
                disabled={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                disabled={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Телефон</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                disabled={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company">Компания</Label>
              <Input
                id="company"
                value={formData.company}
                onChange={(e) => handleInputChange("company", e.target.value)}
                disabled={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="website">Веб-сайт</Label>
              <Input
                id="website"
                value={formData.website}
                onChange={(e) => handleInputChange("website", e.target.value)}
                disabled={!isEditing}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">О себе</Label>
            <Textarea
              id="bio"
              value={formData.bio}
              onChange={(e) => handleInputChange("bio", e.target.value)}
              disabled={!isEditing}
              className="min-h-[100px]"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-2">
            {isEditing ? (
              <>
                <Button variant="outline" onClick={() => setIsEditing(false)}>
                  Отмена
                </Button>
                <Button onClick={handleSave}>
                  <Save className="mr-2 h-4 w-4" />
                  Сохранить
                </Button>
              </>
            ) : (
              <Button onClick={() => setIsEditing(true)}>
                <User className="mr-2 h-4 w-4" />
                Редактировать
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}