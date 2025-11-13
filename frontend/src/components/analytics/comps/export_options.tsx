"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Download, FileText, FileSpreadsheet } from "lucide-react";
import { useApp } from "@/contexts/AppContext";
import { useState } from "react";

interface ExportOptionsProps {
  dateRange: { from: Date; to: Date };
  selectedNetwork: string;
}

export function ExportOptions({
  dateRange,
  selectedNetwork,
}: ExportOptionsProps) {
  const { exportAnalytics } = useApp();
  const [exporting, setExporting] = useState<string | null>(null);

  const handleExport = async (format: string) => {
    setExporting(format);
    try {
      const downloadUrl = await exportAnalytics(format, {
        startDate: dateRange.from,
        endDate: dateRange.to,
      });

      if (downloadUrl) {
        window.open(downloadUrl, "_blank");
      }
    } catch (error) {
      console.error("Export failed:", error);
    } finally {
      setExporting(null);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Экспорт данных</CardTitle>
        <CardDescription>
          Скачайте отчет по аналитике в удобном формате
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            onClick={() => handleExport("csv")}
            variant="outline"
            className="flex-1"
            disabled={!!exporting}
          >
            <FileSpreadsheet className="mr-2 h-4 w-4" />
            {exporting === "csv" ? "Скачивание..." : "Скачать CSV"}
          </Button>
          <Button
            onClick={() => handleExport("pdf")}
            variant="outline"
            className="flex-1"
            disabled={!!exporting}
          >
            <FileText className="mr-2 h-4 w-4" />
            {exporting === "pdf" ? "Скачивание..." : "Скачать PDF"}
          </Button>
          <Button
            onClick={() => handleExport("excel")}
            className="flex-1"
            disabled={!!exporting}
          >
            <Download className="mr-2 h-4 w-4" />
            {exporting === "excel" ? "Скачивание..." : "Полный отчет Excel"}
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-3">
          Отчеты включают все метрики за выбранный период с детализацией по
          платформам и контенту
        </p>
      </CardContent>
    </Card>
  );
}
