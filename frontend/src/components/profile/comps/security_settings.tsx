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
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Shield,
  Key,
  Smartphone,
  LogOut,
  AlertTriangle,
  Eye,
  EyeOff,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getAuthToken } from "@/utils/auth";

interface SecurityData {
  twoFactorEnabled: boolean;
  activeSessions: Array<{
    device: string;
    location: string;
    current: boolean;
    lastActive: string;
  }>;
}

export function SecuritySettings() {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    current: "",
    new: "",
    confirm: "",
  });
  const [securityData, setSecurityData] = useState<SecurityData | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchSecurityData();
  }, []);

  const fetchSecurityData = async () => {
    try {
      const token = getAuthToken();
      const response = await fetch("http://localhost:5090/api/auth/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to fetch security data");

      const data = await response.json();
      if (data.success) {
        setSecurityData(data.data.security);
      }
    } catch (error) {
      console.error("Error fetching security data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = () => {
    console.log("Changing password");
    setPasswordData({ current: "", new: "", confirm: "" });
  };

  const handleLogout = () => {
    console.log("Logging out");
    navigate("/");
  };

  const handleDeleteAccount = () => {
    console.log("Deleting account");
  };

  if (loading) return <div>Loading...</div>;
  if (!securityData) return <div>Error loading security data</div>;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5 text-green-500" />
            <span>Безопасность аккаунта</span>
          </CardTitle>
          <CardDescription>
            Управляйте настройками безопасности и конфиденциальности
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-3 p-3 border border-border rounded-lg">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <Shield className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium">
                  Двухфакторная аутентификация
                </p>
                <Badge variant="default" className="text-xs">
                  {securityData.twoFactorEnabled ? "Включена" : "Выключена"}
                </Badge>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 border border-border rounded-lg">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Key className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium">Надежный пароль</p>
                <Badge variant="default" className="text-xs">
                  Установлен
                </Badge>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 border border-border rounded-lg">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <Smartphone className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium">Активные сессии</p>
                <Badge variant="secondary" className="text-xs">
                  {securityData.activeSessions.length} устройств
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Изменение пароля</CardTitle>
          <CardDescription>
            Обновите пароль для повышения безопасности аккаунта
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="current-password">Текущий пароль</Label>
            <div className="relative">
              <Input
                id="current-password"
                type={showCurrentPassword ? "text" : "password"}
                value={passwordData.current}
                onChange={(e) =>
                  setPasswordData((prev) => ({
                    ...prev,
                    current: e.target.value,
                  }))
                }
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              >
                {showCurrentPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="new-password">Новый пароль</Label>
            <div className="relative">
              <Input
                id="new-password"
                type={showNewPassword ? "text" : "password"}
                value={passwordData.new}
                onChange={(e) =>
                  setPasswordData((prev) => ({ ...prev, new: e.target.value }))
                }
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8"
                onClick={() => setShowNewPassword(!showNewPassword)}
              >
                {showNewPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirm-password">Подтвердите новый пароль</Label>
            <Input
              id="confirm-password"
              type="password"
              value={passwordData.confirm}
              onChange={(e) =>
                setPasswordData((prev) => ({
                  ...prev,
                  confirm: e.target.value,
                }))
              }
            />
          </div>

          <Button
            onClick={handlePasswordChange}
            disabled={
              !passwordData.current ||
              !passwordData.new ||
              passwordData.new !== passwordData.confirm
            }
          >
            <Key className="mr-2 h-4 w-4" />
            Изменить пароль
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Двухфакторная аутентификация</CardTitle>
          <CardDescription>
            Дополнительный уровень защиты для вашего аккаунта
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <label className="text-sm font-medium">SMS-коды</label>
              <p className="text-xs text-muted-foreground">
                Получать коды подтверждения на телефон
              </p>
            </div>
            <Switch defaultChecked={securityData.twoFactorEnabled} />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <label className="text-sm font-medium">
                Приложение-аутентификатор
              </label>
              <p className="text-xs text-muted-foreground">
                Использовать Google Authenticator или аналогичное приложение
              </p>
            </div>
            <Switch defaultChecked={securityData.twoFactorEnabled} />
          </div>

          <Separator />

          <div className="space-y-2">
            <h4 className="font-medium">Резервные коды</h4>
            <p className="text-sm text-muted-foreground">
              Сохраните эти коды в безопасном месте для восстановления доступа
            </p>
            <Button variant="outline" size="sm">
              Сгенерировать новые коды
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Активные сессии</CardTitle>
          <CardDescription>
            Устройства, с которых выполнен вход в аккаунт
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {securityData.activeSessions.map((session, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 border border-border rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div>
                    <p className="text-sm font-medium">
                      {session.device}
                      {session.current && (
                        <Badge variant="secondary" className="ml-2 text-xs">
                          Текущая
                        </Badge>
                      )}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {session.location} • {session.lastActive}
                    </p>
                  </div>
                </div>
                {!session.current && (
                  <Button variant="ghost" size="sm">
                    Завершить
                  </Button>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Действия с аккаунтом</CardTitle>
          <CardDescription>
            Выход из системы и управление аккаунтом
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-border rounded-lg">
            <div>
              <h4 className="font-medium">Выйти из аккаунта</h4>
              <p className="text-sm text-muted-foreground">
                Завершить текущую сессию на этом устройстве
              </p>
            </div>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Выйти
            </Button>
          </div>

          <div className="flex items-center justify-between p-4 border border-destructive/20 rounded-lg">
            <div>
              <h4 className="font-medium text-destructive">Удалить аккаунт</h4>
              <p className="text-sm text-muted-foreground">
                Безвозвратно удалить аккаунт и все данные
              </p>
            </div>
            <Button variant="destructive" onClick={handleDeleteAccount}>
              <AlertTriangle className="h-4 w-4 mr-2" />
              Удалить
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
