import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Upload, User, Video, Camera } from "lucide-react";
import { useNavigate } from "react-router";
import { useApp } from "@/contexts/AppContext";
import { CONTENT_ROUTE_AVATAR } from "@/utils/CONSTANTS";

export function CreateAvatar() {
  const navigate = useNavigate();
  const { createAvatar, refreshAvatars } = useApp();

  const [formData, setFormData] = useState({
    name: "",
    gender: "",
    style: "",
    description: "",
    avatarImage: null as File | null,
  });
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({ ...prev, avatarImage: file }));
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await createAvatar(formData);
      await refreshAvatars();
      navigate(CONTENT_ROUTE_AVATAR);
    } catch (error) {
      console.error("Error creating avatar:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate(CONTENT_ROUTE_AVATAR);
  };

  return (
    <div className="container max-w-6xl mx-auto p-4 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={handleBack}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Создание AI-аватара</h1>
          <p className="text-muted-foreground">
            Настройте параметры для генерации уникального аватара
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <Card data-slot="card" className="xl:col-span-1 flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Camera className="h-5 w-5" />
                Изображение аватара
              </CardTitle>
              <CardDescription>
                Загрузите фото для создания AI-аватара
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col justify-center space-y-4">
              <div className="flex flex-col items-center space-y-4">
                <Avatar className="w-32 h-32 border-2 border-dashed border-muted-foreground/25">
                  {previewUrl ? (
                    <AvatarImage src={previewUrl} className="object-cover" />
                  ) : (
                    <AvatarFallback className="bg-muted">
                      <User className="h-8 w-8" />
                    </AvatarFallback>
                  )}
                </Avatar>

                <div className="text-center space-y-2">
                  <Input
                    id="avatar-image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  <Label htmlFor="avatar-image" className="cursor-pointer">
                    <Button variant="outline" type="button" asChild>
                      <span>
                        <Upload className="h-4 w-4 mr-2" />
                        Загрузить изображение
                      </span>
                    </Button>
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    PNG, JPG до 5MB
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="xl:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Основные параметры</CardTitle>
                <CardDescription>
                  Настройте основные характеристики аватара
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Название аватара</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          name: e.target.value,
                        }))
                      }
                      placeholder="Например: Деловой аватар"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="gender">Пол</Label>
                    <Select
                      value={formData.gender}
                      onValueChange={(value) =>
                        setFormData((prev) => ({ ...prev, gender: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Выберите пол" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Мужской</SelectItem>
                        <SelectItem value="female">Женский</SelectItem>
                        <SelectItem value="neutral">Нейтральный</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="style">Стиль</Label>
                  <Select
                    value={formData.style}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, style: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите стиль" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="business">Деловой</SelectItem>
                      <SelectItem value="casual">Повседневный</SelectItem>
                      <SelectItem value="creative">Креативный</SelectItem>
                      <SelectItem value="friendly">Дружелюбный</SelectItem>
                      <SelectItem value="professional">
                        Профессиональный
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Описание</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    placeholder="Опишите особенности аватара..."
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Предпросмотр</CardTitle>
                <CardDescription>
                  Как будет выглядеть ваш аватар
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 p-4 border rounded-lg bg-muted/20">
                  <Avatar className="w-16 h-16">
                    {previewUrl ? (
                      <AvatarImage src={previewUrl} />
                    ) : (
                      <AvatarFallback>
                        <User className="h-6 w-6" />
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">
                        {formData.name || "Новый аватар"}
                      </span>
                      {formData.gender && (
                        <Badge variant="outline" className="text-xs">
                          {formData.gender === "male"
                            ? "Мужской"
                            : formData.gender === "female"
                            ? "Женский"
                            : "Нейтральный"}
                        </Badge>
                      )}
                    </div>
                    {formData.style && (
                      <Badge variant="secondary" className="text-xs">
                        {formData.style}
                      </Badge>
                    )}
                    {formData.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {formData.description}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-end">
          <Button variant="outline" type="button" onClick={handleBack}>
            Отмена
          </Button>
          <Button
            type="submit"
            disabled={
              loading || !formData.name || !formData.gender || !formData.style
            }
            className="min-w-32"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2" />
                Создание...
              </>
            ) : (
              <>
                <Video className="h-4 w-4 mr-2" />
                Создать аватар
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
