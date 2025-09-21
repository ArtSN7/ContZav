"use client"

import {useState} from "react"
import {AnalyticsFilters} from "./analytics_filters"
import {MetricsCards} from "./metrics_cards"
import {AnalyticsCharts} from "./analytics_charts"
import {TopPerformingContent} from "./top_performing_content"
import {ExportOptions} from "./export_options"

export function AnalyticsDashboard() {
    const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
        from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
        to: new Date(),
    })
    const [selectedNetwork, setSelectedNetwork] = useState("all")
    const [selectedContent, setSelectedContent] = useState("all")

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col space-y-2">

                {/*<span className="text-orange-500 text-2xl font-medium italic"> - в разработке</span>*/}

                <h1 className="text-3xl font-bold text-foreground">Аналитика контента</h1>

                <p className="text-muted-foreground">Отслеживайте эффективность вашего контента в социальных сетях</p>
            </div>

            {/* Filters */}
            <AnalyticsFilters
                dateRange={dateRange}
                onDateRangeChange={setDateRange}
                selectedNetwork={selectedNetwork}
                onNetworkChange={setSelectedNetwork}
                selectedContent={selectedContent}
                onContentChange={setSelectedContent}
            />

            {/* Metrics Cards */}
            <MetricsCards/>

            {/* Charts */}
            <AnalyticsCharts/>

            {/* Top Performing Content */}
            <TopPerformingContent/>

            {/* Export Options */}
            <ExportOptions/>
        </div>
    )
}
