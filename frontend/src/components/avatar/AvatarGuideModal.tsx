import React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Video,
  User,
  Settings,
  Zap,
  CheckCircle,
  ArrowRight,
  Camera,
  Sparkles,
} from "lucide-react";
import { useNavigate } from "react-router";
import { CONTENT_ROUTE_AVATAR_CREATE } from "@/utils/CONSTANTS";

interface AvatarGuideModalProps {
  onClose: () => void;
}

export const AvatarGuideModal: React.FC<AvatarGuideModalProps> = ({
  onClose,
}) => {
  const navigate = useNavigate();

  const handleCreateAvatar = () => {
    onClose();
    navigate(CONTENT_ROUTE_AVATAR_CREATE);
  };

  const steps = [
    {
      icon: <Camera className="h-6 w-6" />,
      title: "Загрузите фото",
      description:
        "Выберите качественное фото лица для создания цифрового двойника",
    },
    {
      icon: <Settings className="h-6 w-6" />,
      title: "Настройте параметры",
      description: "Выберите пол, стиль и характеристики аватара",
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: "Генерация AI",
      description: "Наша нейросеть создаст реалистичный аватар за 5-10 минут",
    },
    {
      icon: <Video className="h-6 w-6" />,
      title: "Используйте в видео",
      description: "Аватар будет доступен для создания профессиональных видео",
    },
  ];

  const requirements = [
    "Четкое фото лица в хорошем качестве",
    "Естественное освещение без теней",
    "Нейтральное выражение лица",
    "Формат JPG или PNG",
  ];

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Sparkles className="h-6 w-6 text-blue-500" />
            Создайте свой AI-аватар
          </DialogTitle>
          <DialogDescription className="text-lg">
            Персонализируйте ваш контент с помощью цифрового двойника
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                Почему стоит создать аватар?
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                  <User className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                  <h4 className="font-semibold">Уникальность</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Ваш бренд узнаваем
                  </p>
                </div>
                <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                  <Video className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                  <h4 className="font-semibold">Профессионализм</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Качественный контент
                  </p>
                </div>
                <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                  <Zap className="h-8 w-8 text-green-500 mx-auto mb-2" />
                  <h4 className="font-semibold">Экономия времени</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Не нужно снимать видео
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Как это работает?</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {steps.map((step, index) => (
                  <div
                    key={index}
                    className="text-center p-4 border rounded-lg"
                  >
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                      {step.icon}
                    </div>
                    <Badge variant="secondary" className="mb-2">
                      Шаг {index + 1}
                    </Badge>
                    <h4 className="font-semibold text-sm mb-2">{step.title}</h4>
                    <p className="text-xs text-muted-foreground">
                      {step.description}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Требования к фото</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <ul className="space-y-2">
                    {requirements.map((req, index) => (
                      <li
                        key={index}
                        className="flex items-center gap-2 text-sm"
                      >
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        {req}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-muted rounded-lg p-4 flex items-center justify-center">
                  <div className="text-center text-muted-foreground">
                    <Camera className="h-8 w-8 mx-auto mb-2" />
                    <p className="text-sm">Пример хорошего фото</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Примеры аватаров</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { name: "Деловой", style: "business", color: "bg-blue-100" },
                  {
                    name: "Креативный",
                    style: "creative",
                    color: "bg-purple-100",
                  },
                  {
                    name: "Дружелюбный",
                    style: "friendly",
                    color: "bg-green-100",
                  },
                  {
                    name: "Профессиональный",
                    style: "professional",
                    color: "bg-orange-100",
                  },
                ].map((avatar, index) => (
                  <div key={index} className="text-center">
                    <div
                      className={`w-16 h-16 rounded-full mx-auto mb-2 flex items-center justify-center ${avatar.color}`}
                    >
                      <User className="h-6 w-6 text-gray-600" />
                    </div>
                    <p className="text-sm font-medium">{avatar.name}</p>
                    <Badge variant="outline" className="text-xs mt-1">
                      {avatar.style}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="flex flex-col sm:flex-row gap-4 justify-end pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Позже
            </Button>
            <Button onClick={handleCreateAvatar} className="gap-2">
              Создать аватар
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
