"use client"

import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card"
import {
    LineChart,
    Line,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
} from "recharts"

const trendData = [
    {date: "01.12", views: 2400, engagement: 400},
    {date: "02.12", views: 1398, engagement: 300},
    {date: "03.12", views: 9800, engagement: 800},
    {date: "04.12", views: 3908, engagement: 480},
    {date: "05.12", views: 4800, engagement: 380},
    {date: "06.12", views: 3800, engagement: 430},
    {date: "07.12", views: 4300, engagement: 520},
]

const comparisonData = [
    {month: "Ноябрь", thisMonth: 45000, lastMonth: 38000},
    {month: "Декабрь", thisMonth: 52000, lastMonth: 45000},
]

const demographicsData = [
    {name: "18-24", value: 35, color: "#8b5cf6"},
    {name: "25-34", value: 40, color: "#06b6d4"},
    {name: "35-44", value: 20, color: "#10b981"},
    {name: "45+", value: 5, color: "#f59e0b"},
]

export function AnalyticsCharts() {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Trend Chart */}
            <Card className="lg:col-span-2">
                <CardHeader>
                    <CardTitle>Динамика метрик</CardTitle>
                    <CardDescription>Просмотры и вовлеченность за последние 7 дней</CardDescription>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={trendData}>
                            <CartesianGrid strokeDasharray="3 3"/>
                            <XAxis dataKey="date"/>
                            <YAxis/>
                            <Tooltip/>
                            <Line type="monotone" dataKey="views" stroke="#8b5cf6" strokeWidth={2} name="Просмотры"/>
                            <Line type="monotone" dataKey="engagement" stroke="#06b6d4" strokeWidth={2}
                                  name="Вовлеченность"/>
                        </LineChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            {/* Comparison Chart */}
            <Card>
                <CardHeader>
                    <CardTitle>Сравнение периодов</CardTitle>
                    <CardDescription>Этот месяц vs прошлый месяц</CardDescription>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={comparisonData}>
                            <CartesianGrid strokeDasharray="3 3"/>
                            <XAxis dataKey="month"/>
                            <YAxis/>
                            <Tooltip/>
                            <Bar dataKey="lastMonth" fill="#e2e8f0" name="Прошлый месяц"/>
                            <Bar dataKey="thisMonth" fill="#8b5cf6" name="Этот месяц"/>
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            {/* Demographics Chart */}
            <Card>
                <CardHeader>
                    <CardTitle>Демография аудитории</CardTitle>
                    <CardDescription>Возрастные группы подписчиков</CardDescription>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={250}>
                        <PieChart>
                            <Pie
                                data={demographicsData}
                                cx="50%"
                                cy="50%"
                                outerRadius={80}
                                dataKey="value"
                                label={({name, value}) => `${name}: ${value}%`}
                            >
                                {demographicsData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color}/>
                                ))}
                            </Pie>
                            <Tooltip/>
                        </PieChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
        </div>
    )
}
