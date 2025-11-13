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
  Save,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useApp } from "@/contexts/AppContext";
import { Skeleton } from "@/components/ui/skeleton";

export function SecuritySettings() {
  const [showHeyGenKey, setShowHeyGenKey] = useState(false);
  const [apiKeysData, setApiKeysData] = useState({
    heygen_api_key: "",
  });
  const [savingApiKeys, setSavingApiKeys] = useState(false);
  const navigate = useNavigate();
  const { logout } = useAuth();
  const {
    securityData,
    loadingSecurity,
    toggle2FA,
    terminateSession,
    terminateAllSessions,
    apiKeys,
    loadingApiKeys,
    updateApiKeys,
  } = useApp();

  const handleToggle2FA = async (enabled: boolean) => {
    try {
      await toggle2FA(enabled);
      alert(
        `Двухфакторная аутентификация ${enabled ? "включена" : "выключена"}`
      );
    } catch (error: any) {
      alert(error.message);
    }
  };

  const handleTerminateSession = async (sessionId: string) => {
    try {
      await terminateSession(sessionId);
      alert("Сессия завершена");
    } catch (error: any) {
      alert(error.message);
    }
  };

  const handleTerminateAllSessions = async () => {
    try {
      await terminateAllSessions();
      alert("Все сессии завершены");
    } catch (error: any) {
      alert(error.message);
    }
  };

  const handleSaveApiKeys = async () => {
    setSavingApiKeys(true);
    try {
      await updateApiKeys(apiKeysData);
      alert("API ключ успешно сохранен!");
      setApiKeysData({ heygen_api_key: "" });
    } catch (error: any) {
      alert(error.message);
    } finally {
      setSavingApiKeys(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/auth");
    } catch (error) {
      console.error("Logout error:", error);
      navigate("/auth");
    }
  };

  const handleDeleteAccount = async () => {
    if (
      !confirm(
        "Вы уверены, что хотите удалить аккаунт? Это действие нельзя отменить."
      )
    ) {
      return;
    }

    try {
      console.log("Account deletion requested");
      alert("Запрос на удаление аккаунта отправлен");
    } catch (error) {
      console.error("Error deleting account:", error);
      alert("Ошибка при удалении аккаунта");
    }
  };

  if (loadingSecurity || loadingApiKeys) {
    return <SecuritySkeleton />;
  }

  const safeSecurityData = securityData || {
    twoFactorEnabled: false,
    activeSessions: [],
  };

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
                  {safeSecurityData.twoFactorEnabled ? "Включена" : "Выключена"}
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
                  {safeSecurityData.activeSessions.length} устройств
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card data-slot="card">
        <CardHeader>
          <CardTitle>API Ключи</CardTitle>
          <CardDescription>
            Укажите ваш API ключ для работы с HeyGen
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="heygen-api-key">HeyGen API Key</Label>
              <div className="relative">
                <Input
                  id="heygen-api-key"
                  type={showHeyGenKey ? "text" : "password"}
                  value={apiKeysData.heygen_api_key || apiKeys.heygen_api_key}
                  onChange={(e) =>
                    setApiKeysData((prev) => ({
                      ...prev,
                      heygen_api_key: e.target.value,
                    }))
                  }
                  placeholder="Введите ваш HeyGen API ключ"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8"
                  onClick={() => setShowHeyGenKey(!showHeyGenKey)}
                >
                  {showHeyGenKey ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                Получите в личном кабинете HeyGen. Необходим для генерации видео
                с аватарами.
              </p>
            </div>
          </div>

          <Button
            onClick={handleSaveApiKeys}
            disabled={savingApiKeys || !apiKeysData.heygen_api_key}
          >
            <Save className="mr-2 h-4 w-4" />
            {savingApiKeys ? "Сохранение..." : "Сохранить API ключ"}
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
            <Switch
              checked={safeSecurityData.twoFactorEnabled}
              onCheckedChange={handleToggle2FA}
            />
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
            <Switch
              checked={safeSecurityData.twoFactorEnabled}
              onCheckedChange={handleToggle2FA}
            />
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
            {safeSecurityData.activeSessions.map((session, index) => (
              <div
                key={session.id || index}
                className="flex items-center justify-between p-3 border border-border rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      session.current ? "bg-green-500" : "bg-blue-500"
                    }`}
                  ></div>
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
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleTerminateSession(session.id)}
                  >
                    Завершить
                  </Button>
                )}
              </div>
            ))}
          </div>

          {safeSecurityData.activeSessions.length > 1 && (
            <div className="mt-4 pt-4 border-t">
              <Button variant="outline" onClick={handleTerminateAllSessions}>
                Завершить все сессии
              </Button>
            </div>
          )}
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

function SecuritySkeleton() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-64" />
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-20 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>

      {Array.from({ length: 4 }).map((_, i) => (
        <Card key={i}>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-64" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, j) => (
                <Skeleton key={j} className="h-10 w-full" />
              ))}
              <Skeleton className="h-10 w-32" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
