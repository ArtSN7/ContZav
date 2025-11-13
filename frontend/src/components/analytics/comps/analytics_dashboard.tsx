"use client";

import { useState, useEffect } from "react";
import { AnalyticsFilters } from "./analytics_filters";
import { MetricsCards } from "./metrics_cards";
import { AnalyticsCharts } from "./analytics_charts";
import { TopPerformingContent } from "./top_performing_content";
import { ExportOptions } from "./export_options";
import { useApp } from "@/contexts/AppContext";

export function AnalyticsDashboard() {
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    to: new Date(),
  });
  const [selectedNetwork, setSelectedNetwork] = useState("all");
  const [selectedContent, setSelectedContent] = useState("all");

  const {
    analyticsData,
    topContent,
    loadingAnalytics,
    loadingTopContent,
    fetchAnalytics,
    fetchTopContent,
    fetchStatistics,
    statistics,
  } = useApp();

  useEffect(() => {
    fetchAnalytics({
      startDate: dateRange.from,
      endDate: dateRange.to,
      platform: selectedNetwork !== "all" ? selectedNetwork : undefined,
    });
    fetchTopContent({
      startDate: dateRange.from,
      endDate: dateRange.to,
      limit: 5,
    });
    fetchStatistics({
      startDate: dateRange.from,
      endDate: dateRange.to,
      platform: selectedNetwork !== "all" ? selectedNetwork : undefined,
    });
  }, [dateRange, selectedNetwork]);

  const handleDateRangeChange = (range: { from: Date; to: Date }) => {
    setDateRange(range);
  };

  const handleNetworkChange = (network: string) => {
    setSelectedNetwork(network);
  };

  const handleContentChange = (content: string) => {
    setSelectedContent(content);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold text-foreground">
          Аналитика контента
        </h1>
        <p className="text-muted-foreground">
          Отслеживайте эффективность вашего контента в социальных сетях
        </p>
      </div>

      <AnalyticsFilters
        dateRange={dateRange}
        onDateRangeChange={handleDateRangeChange}
        selectedNetwork={selectedNetwork}
        onNetworkChange={handleNetworkChange}
        selectedContent={selectedContent}
        onContentChange={handleContentChange}
      />

      <MetricsCards />

      <AnalyticsCharts
        analyticsData={analyticsData}
        statistics={statistics}
        loading={loadingAnalytics}
      />

      <TopPerformingContent
        topContent={topContent}
        loading={loadingTopContent}
      />

      <ExportOptions dateRange={dateRange} selectedNetwork={selectedNetwork} />
    </div>
  );
}
