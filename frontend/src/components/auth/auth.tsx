import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { LogoAndBrandComponent } from "@/components/utils_for_components/logo_brand_component.tsx";
import { TermsAndPrivacy } from "@/components/utils_for_components/TermsAndConditions.tsx";
import GoogleLogo from "../../utils/icons/GoogleLogo.png";
import VKLogo from "../../utils/icons/VKLogo.png";
import YandexLogo from "../../utils/icons/YandexLogo.png";
import { useAuth } from "@/contexts/AuthContext";

export function AuthPage() {
  const { loading, error, clearError } = useAuth();

  const VK_AUTH = "vk";
  const GOOGLE_AUTH = "google";
  const YANDEX_AUTH = "yandex";

  const handleSocialAuth = async (provider: string) => {
    clearError();

    try {
      const response = await fetch(
        `http://localhost:5090/api/auth/${provider}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success && data.data.authUrl) {
        window.location.href = data.data.authUrl;
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (err: any) {
      console.error("Auth error:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <LogoAndBrandComponent />

        <Card className="border-border shadow-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Войти</CardTitle>
            <CardDescription className="text-center">
              Выберите способ входа в систему
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <div className="p-3 text-sm text-red-500 bg-red-50 border border-red-200 rounded-md">
                {error}
              </div>
            )}

            <div className="space-y-3">
              <Button
                variant="outline"
                className="w-full h-12 text-left justify-start space-x-3 bg-transparent"
                onClick={() => handleSocialAuth(GOOGLE_AUTH)}
                disabled={loading}
              >
                <div className="w-5 h-5 rounded-full flex items-center justify-center">
                  <img src={GoogleLogo} alt="Google" />
                </div>
                <span>Продолжить с Google</span>
              </Button>

              <Button
                variant="outline"
                className="w-full h-12 text-left justify-start space-x-3 bg-transparent"
                onClick={() => handleSocialAuth(VK_AUTH)}
                disabled={loading}
              >
                <div className="w-5 h-5 rounded-full flex items-center justify-center">
                  <img src={VKLogo} alt="VK" />
                </div>
                <span>Продолжить с ВКонтакте</span>
              </Button>

              <Button
                variant="outline"
                className="w-full h-12 text-left justify-start space-x-3 bg-transparent"
                onClick={() => handleSocialAuth(YANDEX_AUTH)}
                disabled={loading}
              >
                <div className="w-5 h-5 rounded-full flex items-center justify-center">
                  <img src={YandexLogo} alt="Yandex" />
                </div>
                <span>Продолжить с Яндекс</span>
              </Button>
            </div>

            <Separator className="my-6" />

            <p className="text-xs text-muted-foreground text-center leading-relaxed">
              Продолжая, вы соглашаетесь с{" "}
              <Dialog>
                <DialogTrigger className="text-accent hover:underline">
                  Условиями использования{" "}
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Условия</DialogTitle>
                    <DialogDescription className="max-h-96 overflow-y-auto">
                      <TermsAndPrivacy />
                    </DialogDescription>
                  </DialogHeader>
                </DialogContent>
              </Dialog>
            </p>
          </CardContent>
        </Card>

        <div className="text-center">
          <p className="text-xs text-muted-foreground">
            © 2025 Контент Завод. Все права защищены.
          </p>
        </div>
      </div>
    </div>
  );
}
