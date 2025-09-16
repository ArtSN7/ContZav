"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Download, FileText, FileSpreadsheet } from "lucide-react"

export function ExportOptions() {
  const handleExport = (format: string) => {
    // Mock export functionality
    console.log(`Exporting analytics data as ${format}`)
    // In real app, would generate and download the file
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Экспорт данных</CardTitle>
        <CardDescription>Скачайте отчет по аналитике в удобном формате</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row gap-4">
          <Button onClick={() => handleExport("csv")} variant="outline" className="flex-1">
            <FileSpreadsheet className="mr-2 h-4 w-4" />
            Скачать CSV
          </Button>
          <Button onClick={() => handleExport("pdf")} variant="outline" className="flex-1">
            <FileText className="mr-2 h-4 w-4" />
            Скачать PDF
          </Button>
          <Button onClick={() => handleExport("excel")} className="flex-1">
            <Download className="mr-2 h-4 w-4" />
            Полный отчет Excel
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-3">
          Отчеты включают все метрики за выбранный период с детализацией по платформам и контенту
        </p>
      </CardContent>
    </Card>
  )
}
