// UI
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

// components
import { LogoAndBrandComponent } from "@/components/utils_for_components/logo_brand_component.tsx";
import { TermsAndPrivacy } from "@/components/utils_for_components/TermsAndConditions.tsx";

// icons
import AppleLogo from "../../utils/icons/AppleLogo.png";
import GoogleLogo from "../../utils/icons/GoogleLogo.png";
import VKLogo from "../../utils/icons/VKLogo.png";

// other
import { useNavigate } from "react-router";
import { DASHBOARD_ROUTE } from "@/utils/CONSTANTS.ts";
import { useEffect, useState } from "react";

export function AuthPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const VK_AUTH = "vk";
  const GOOGLE_AUTH = "google";
  const APPLE_AUTH = "apple";

  // тут мы обрабатываем запрос аутенфикации
  const handleSocialAuth = async (provider: string) => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `http://localhost:5090/api/auth/${provider}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success && data.data.authUrl) {
        // Перенаправляем на OAuth провайдера
        window.location.href = data.data.authUrl;
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (err) {
      setError(err.message || "Authentication failed");
      console.error("Auth error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");
    const state = urlParams.get("state");
    const error = urlParams.get("error");

    if (error) {
      setError(error);
      return;
    }

    if (code && state) {
      handleOAuthCallback(code, state);
    }
  }, []);

  const handleOAuthCallback = async (code: string, state: string) => {
    setLoading(true);

    try {
      // Определяем провайдера из URL pathname
      const pathname = window.location.pathname;
      let provider = "";

      if (pathname.includes("google")) provider = "google";
      else if (pathname.includes("vk")) provider = "vk";
      else if (pathname.includes("apple")) provider = "apple";

      const response = await fetch(
        `http://localhost:5090/api/auth/${provider}/callback?code=${code}&state=${state}`
      );

      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();

      if (data.success && data.data.session) {
        localStorage.setItem("auth_token", data.data.session.access_token);
        localStorage.setItem("refresh_token", data.data.session.refresh_token);
        navigate(DASHBOARD_ROUTE);
      }
    } catch (err) {
      setError(err.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Logo and Brand */}
        <LogoAndBrandComponent />

        {/* Auth Card */}
        <Card className="border-border shadow-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Войти</CardTitle>
            <CardDescription className="text-center">
              Выберите способ входа в систему
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Social Auth Buttons */}
            <div className="space-y-3">
              <Button
                variant="outline"
                className="w-full h-12 text-left justify-start space-x-3 bg-transparent"
                onClick={() => handleSocialAuth(GOOGLE_AUTH)}
              >
                <div className="w-5 h-5 rounded-full flex items-center justify-center">
                  <img src={GoogleLogo} />
                </div>
                <span>Продолжить с Google</span>
              </Button>

              <Button
                variant="outline"
                className="w-full h-12 text-left justify-start space-x-3 bg-transparent"
                onClick={() => handleSocialAuth(VK_AUTH)}
              >
                <div className="w-5 h-5 rounded-full flex items-center justify-center">
                  <img src={VKLogo} />
                </div>
                <span>Продолжить с ВКонтакте</span>
              </Button>

              <Button
                variant="outline"
                className="w-full h-12 text-left justify-start space-x-3 bg-transparent"
                onClick={() => handleSocialAuth(APPLE_AUTH)}
              >
                <div className="w-5 h-5 rounded-full flex items-center justify-center">
                  <img src={AppleLogo} />
                </div>
                <span>Продолжить с Apple</span>
              </Button>
            </div>

            <Separator className="my-6" />

            {/* Terms */}
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

        {/* Footer */}
        <div className="text-center">
          <p className="text-xs text-muted-foreground">
            © 2025 Контент Завод. Все права защищены.
          </p>
        </div>
      </div>
    </div>
  );
}
