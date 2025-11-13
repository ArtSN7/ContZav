import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  Crown,
  Calendar,
  CreditCard,
  Download,
  AlertTriangle,
} from "lucide-react";
import { useApp } from "@/contexts/AppContext";
import { Skeleton } from "@/components/ui/skeleton";

export function SubscriptionManagement() {
  const {
    subscriptionData,
    loadingSubscription,
    cancelSubscription,
    refreshSubscription,
  } = useApp();

  const handleCancelSubscription = async () => {
    try {
      await cancelSubscription();
      await refreshSubscription();
    } catch (error) {
      console.error("Error cancelling subscription:", error);
    }
  };

  if (loadingSubscription) {
    return <SubscriptionSkeleton />;
  }

  if (!subscriptionData) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-muted-foreground">
            Не удалось загрузить данные подписки
          </div>
        </CardContent>
      </Card>
    );
  }

  const safeUsage = subscriptionData.usage || {
    videosUsed: 0,
    videosLimit: 10,
    networksUsed: 0,
    networksLimit: 3,
  };

  const videosProgress =
    safeUsage.videosLimit > 0
      ? (safeUsage.videosUsed / safeUsage.videosLimit) * 100
      : 0;

  const networksProgress =
    safeUsage.networksLimit > 0
      ? (safeUsage.networksUsed / safeUsage.networksLimit) * 100
      : 0;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Crown className="h-5 w-5 text-accent" />
            <span>Текущий тариф</span>
          </CardTitle>
          <CardDescription>
            Информация о вашей подписке и использовании
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="text-2xl font-bold">
                {subscriptionData.plan || "Free"} Plan
              </h3>
              <p className="text-muted-foreground">
                {(subscriptionData.price || 0).toLocaleString()} ₽/
                {subscriptionData.billingCycle === "monthly" ? "месяц" : "год"}
              </p>
            </div>
            <Badge
              variant={
                subscriptionData.status === "active" ? "default" : "destructive"
              }
            >
              {subscriptionData.status === "active" ? "Активна" : "Неактивна"}
            </Badge>
          </div>

          <Separator />

          <div className="space-y-4">
            <h4 className="font-semibold">Использование за месяц</h4>

            <div className="space-y-3">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Видео/посты</span>
                  <span>
                    {safeUsage.videosUsed} из {safeUsage.videosLimit}
                  </span>
                </div>
                <Progress value={videosProgress} className="h-2" />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Социальные сети</span>
                  <span>
                    {safeUsage.networksUsed} из {safeUsage.networksLimit}
                  </span>
                </div>
                <Progress value={networksProgress} className="h-2" />
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-3">
            <h4 className="font-semibold">Информация о платежах</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>
                  Следующий платеж:{" "}
                  {subscriptionData.nextBilling || "Не указан"}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <CreditCard className="h-4 w-4 text-muted-foreground" />
                <span>Карта: •••• •••• •••• 1234</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Управление подпиской</CardTitle>
          <CardDescription>
            Измените тариф или управляйте платежами
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              variant="outline"
              className="h-auto p-4 flex flex-col space-y-2 bg-transparent"
            >
              <Crown className="h-6 w-6" />
              <span className="font-medium">Изменить тариф</span>
              <span className="text-xs text-muted-foreground">
                Повысить или понизить
              </span>
            </Button>

            <Button
              variant="outline"
              className="h-auto p-4 flex flex-col space-y-2 bg-transparent"
            >
              <CreditCard className="h-6 w-6" />
              <span className="font-medium">Способ оплаты</span>
              <span className="text-xs text-muted-foreground">
                Изменить карту
              </span>
            </Button>

            <Button
              variant="outline"
              className="h-auto p-4 flex flex-col space-y-2 bg-transparent"
            >
              <Download className="h-6 w-6" />
              <span className="font-medium">Счета</span>
              <span className="text-xs text-muted-foreground">
                Скачать документы
              </span>
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="border-destructive">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            <span>Опасная зона</span>
          </CardTitle>
          <CardDescription>
            Необратимые действия с вашей подпиской
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-destructive/20 rounded-lg">
            <div>
              <h4 className="font-medium">Отменить подписку</h4>
              <p className="text-sm text-muted-foreground">
                Подписка будет отменена в конце текущего периода
              </p>
            </div>
            <Button variant="destructive" onClick={handleCancelSubscription}>
              Отменить
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function SubscriptionSkeleton() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-64" />
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Skeleton className="h-8 w-32" />
              <Skeleton className="h-4 w-24" />
            </div>
            <Skeleton className="h-6 w-20" />
          </div>
          <Separator />
          <div className="space-y-4">
            <Skeleton className="h-5 w-40" />
            <div className="space-y-3">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-16" />
                </div>
                <Skeleton className="h-2 w-full" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-16" />
                </div>
                <Skeleton className="h-2 w-full" />
              </div>
            </div>
          </div>
          <Separator />
          <div className="space-y-3">
            <Skeleton className="h-5 w-40" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-64" />
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-24 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-64" />
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
