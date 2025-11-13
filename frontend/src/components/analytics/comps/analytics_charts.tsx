"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XChart,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

interface AnalyticsChartsProps {
  analyticsData: any;
  statistics: any;
  loading: boolean;
}

export function AnalyticsCharts({
  analyticsData,
  statistics,
  loading,
}: AnalyticsChartsProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[...Array(3)].map((_, index) => (
          <Card key={index} className={index === 0 ? "lg:col-span-2" : ""}>
            <CardHeader>
              <CardTitle>Загрузка...</CardTitle>
              <CardDescription>Загрузка данных</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80 bg-muted rounded animate-pulse" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!analyticsData) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Нет данных</CardTitle>
            <CardDescription>Данные аналитики отсутствуют</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80 flex items-center justify-center text-muted-foreground">
              Нет данных для отображения
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const generateTrendDataFromStatistics = () => {
    if (!statistics || !Array.isArray(statistics)) {
      return [];
    }

    return statistics.map((stat: any) => ({
      date: new Date(stat.date).toLocaleDateString("ru-RU", {
        day: "2-digit",
        month: "2-digit",
      }),
      views: stat.views_count || 0,
      engagement: stat.reactions_count || 0,
    }));
  };

  const generatePlatformComparisonData = () => {
    if (
      !analyticsData.platformBreakdown ||
      !Array.isArray(analyticsData.platformBreakdown)
    ) {
      return [];
    }

    return analyticsData.platformBreakdown.map((platform: any) => ({
      platform: platform.platform,
      views: platform.views || 0,
      engagements: platform.engagements || 0,
    }));
  };

  const trendData = generateTrendDataFromStatistics();
  const platformData = generatePlatformComparisonData();
  const demographicsData = analyticsData.demographicData?.ageGroups || [];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Динамика метрик</CardTitle>
          <CardDescription>Просмотры и вовлеченность по дням</CardDescription>
        </CardHeader>
        <CardContent>
          {trendData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="views"
                  stroke="#8b5cf6"
                  strokeWidth={2}
                  name="Просмотры"
                />
                <Line
                  type="monotone"
                  dataKey="engagement"
                  stroke="#06b6d4"
                  strokeWidth={2}
                  name="Вовлеченность"
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-80 flex items-center justify-center text-muted-foreground">
              Нет данных для графика динамики
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Сравнение по платформам</CardTitle>
          <CardDescription>Просмотры по платформам</CardDescription>
        </CardHeader>
        <CardContent>
          {platformData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={platformData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="platform" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="views" fill="#8b5cf6" name="Просмотры" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-80 flex items-center justify-center text-muted-foreground">
              Нет данных по платформам
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Демография аудитории</CardTitle>
          <CardDescription>Возрастные группы подписчиков</CardDescription>
        </CardHeader>
        <CardContent>
          {demographicsData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={demographicsData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="percentage"
                  label={({ ageGroup, percentage }) =>
                    `${ageGroup}: ${percentage}%`
                  }
                >
                  {demographicsData.map((entry: any, index: number) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={`hsl(${index * 60}, 70%, 50%)`}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-80 flex items-center justify-center text-muted-foreground">
              Нет демографических данных
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
