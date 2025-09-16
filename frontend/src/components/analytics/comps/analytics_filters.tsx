"use client"

import {Button} from "@/components/ui/button"
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select"
import {Calendar} from "@/components/ui/calendar"
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover"
import {CalendarIcon, Filter} from "lucide-react"
import {format} from "date-fns"
import {ru} from "date-fns/locale"

interface AnalyticsFiltersProps {
    dateRange: { from: Date; to: Date }
    onDateRangeChange: (range: { from: Date; to: Date }) => void
    selectedNetwork: string
    onNetworkChange: (network: string) => void
    selectedContent: string
    onContentChange: (content: string) => void
}

export function AnalyticsFilters({
                                     dateRange,
                                     onDateRangeChange,
                                     selectedNetwork,
                                     onNetworkChange,
                                     selectedContent,
                                     onContentChange,
                                 }: AnalyticsFiltersProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                    <Filter className="h-5 w-5"/>
                    <span>Фильтры</span>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {/* Date Range */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Период</label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button variant="outline"
                                        className="w-full justify-start text-left font-normal bg-transparent">
                                    <CalendarIcon className="mr-2 h-4 w-4"/>
                                    {dateRange.from && dateRange.to
                                        ? `${format(dateRange.from, "dd.MM", {locale: ru})} - ${format(dateRange.to, "dd.MM", {locale: ru})}`
                                        : "Выберите период"}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                    mode="range"
                                    selected={{from: dateRange.from, to: dateRange.to}}
                                    onSelect={(range) => {
                                        if (range?.from && range?.to) {
                                            onDateRangeChange({from: range.from, to: range.to})
                                        }
                                    }}
                                    numberOfMonths={2}
                                />
                            </PopoverContent>
                        </Popover>
                    </div>

                    {/* Network Selection */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Социальная сеть</label>
                        <Select value={selectedNetwork} onValueChange={onNetworkChange}>
                            <SelectTrigger>
                                <SelectValue placeholder="Выберите сеть"/>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Все сети</SelectItem>
                                <SelectItem value="youtube">YouTube</SelectItem>
                                <SelectItem value="instagram">Instagram</SelectItem>
                                <SelectItem value="vk">ВКонтакте</SelectItem>
                                <SelectItem value="telegram">Telegram</SelectItem>
                                <SelectItem value="tiktok">TikTok</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Content Selection */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Контент</label>
                        <Select value={selectedContent} onValueChange={onContentChange}>
                            <SelectTrigger>
                                <SelectValue placeholder="Выберите контент"/>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Весь контент</SelectItem>
                                <SelectItem value="video">Только видео</SelectItem>
                                <SelectItem value="text">Только посты</SelectItem>
                                <SelectItem value="recent">Последние 10</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Apply Filters Button */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium opacity-0">Применить</label>
                        <Button className="w-full">Применить фильтры</Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
