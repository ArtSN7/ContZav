"use client"

import {useState, useEffect} from "react"
import {Button} from "@/components/ui/button"
import {Card, CardContent} from "@/components/ui/card"
import {Play, ArrowRight, ArrowLeft, Download, RefreshCw, Clock, Video, User} from "lucide-react"
import {useNavigate} from "react-router";
import {CONTENT_ROUTE_PLANNING, CONTENT_ROUTE_SCRIPT} from "@/utils/CONSTANTS.ts";

export function VideoPreview() {
    const [_, setIsGenerating] = useState(true)
    const [videoReady, setVideoReady] = useState(false)
    const [isPlaying, setIsPlaying] = useState(false)
    const navigate = useNavigate()


    useEffect(() => {
        const timer = setTimeout(() => {
            setIsGenerating(false)
            setVideoReady(true)
        }, 4000)

        return () => clearTimeout(timer)
    }, [])

    const regenerateVideo = () => {
        setIsGenerating(true)
        setVideoReady(false)
        setTimeout(() => {
            setIsGenerating(false)
            setVideoReady(true)
        }, 4000)
    }

    const handleNext = () => {
        navigate(CONTENT_ROUTE_PLANNING)
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-3">
                        {videoReady ? "Ваше видео готово!" : "Создаем ваше видео..."}
                    </h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        {videoReady
                            ? "Просмотрите результат и при необходимости внесите изменения"
                            : "Пожалуйста, подождите, пока мы генерируем ваш контент с выбранным аватаром"}
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-8">
                    {/* Main Video Section - Takes most space */}
                    <div className="xl:col-span-3">
                        <Card className="overflow-hidden shadow-2xl border-0">
                            <CardContent className="p-0">
                                <div
                                    className="aspect-[9/16] max-w-md mx-auto bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 relative overflow-hidden">
                                    {!videoReady ? (
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="text-center text-white space-y-6">
                                                <div className="relative">
                                                    <div
                                                        className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center mx-auto backdrop-blur-sm">
                                                        <div
                                                            className="animate-spin w-10 h-10 border-3 border-white border-t-transparent rounded-full"></div>
                                                    </div>
                                                    <div
                                                        className="absolute -inset-4 bg-white/5 rounded-full animate-ping"></div>
                                                </div>
                                                <div className="space-y-3">
                                                    <p className="text-lg font-semibold">Генерируем видео</p>
                                                    <p className="text-sm opacity-80 max-w-xs mx-auto leading-relaxed">
                                                        Создаем персонализированный контент с вашим аватаром
                                                    </p>
                                                    <div
                                                        className="w-32 h-1 bg-white/20 rounded-full mx-auto overflow-hidden">
                                                        <div
                                                            className="h-full bg-white rounded-full animate-pulse w-3/4"></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            {/* Video Player */}
                                            <div
                                                className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent">
                                                {isPlaying ? (
                                                    <video
                                                        className="absolute inset-0 w-full h-full object-cover"
                                                        controls
                                                        src="./video_data_for_test.mp4"
                                                    />
                                                ) : (
                                                    <div className="absolute inset-0 flex items-center justify-center">
                                                        <button
                                                            onClick={() => setIsPlaying(true)}
                                                            className="w-20 h-20 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-all duration-300 hover:scale-110 shadow-2xl"
                                                        >
                                                            <Play className="h-8 w-8 text-gray-900 ml-1"/>
                                                        </button>
                                                    </div>
                                                )}


                                            </div>
                                        </>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {videoReady && (
                            <div className="flex justify-center gap-4 mt-6">
                                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8">
                                    <Download className="mr-2 h-5 w-5"/>
                                    Скачать видео
                                </Button>
                                <Button variant="outline" size="lg" onClick={regenerateVideo}
                                        className="px-8 bg-transparent">
                                    <RefreshCw className="mr-2 h-5 w-5"/>
                                    Пересоздать
                                </Button>
                            </div>
                        )}
                    </div>

                    <div className="xl:col-span-1 space-y-6">
                        {/* Video Stats */}
                        <Card className="border-0 shadow-lg">
                            <CardContent className="p-6">
                                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                    <Video className="w-5 h-5 text-blue-600"/>
                                    Параметры видео
                                </h3>
                                {videoReady ? (
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-gray-600">Качество</span>
                                            <span
                                                className="text-sm font-medium bg-green-100 text-green-800 px-2 py-1 rounded-full">
                        HD 1080p
                      </span>
                                        </div>
                                        <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 flex items-center gap-1">
                        <Clock className="w-3 h-3"/>
                        Длительность
                      </span>
                                            <span className="text-sm font-medium">45 сек</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-gray-600">Формат</span>
                                            <span className="text-sm font-medium">MP4 (9:16)</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 flex items-center gap-1">
                        <User className="w-3 h-3"/>
                        Аватар
                      </span>
                                            <span className="text-sm font-medium">Основной Аватар</span>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {[...Array(4)].map((_, i) => (
                                            <div key={i} className="h-4 bg-gray-200 rounded animate-pulse"></div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Script Preview */}
                        <Card className="border-0 shadow-lg">
                            <CardContent className="p-6">
                                <h3 className="font-semibold text-gray-900 mb-4">Сценарий</h3>
                                <div className="text-sm text-gray-600 leading-relaxed">
                                    <p className="mb-2">
                                        <strong>Хук:</strong> "Фишки Маркетинга"
                                    </p>
                                    <p className="mb-2">
                                        <strong>Основная часть:</strong> Рассказ о фишках маркетинга
                                    </p>
                                    <p>
                                        <strong>CTA:</strong> "Подпишись для новых советов"
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                <div className="flex justify-between items-center mt-12 pt-8 border-t border-gray-200">
                    <Button variant="outline" size="lg" onClick={() => navigate(CONTENT_ROUTE_SCRIPT)} className="px-8">
                        <ArrowLeft className="mr-2 h-5 w-5"/>
                        Назад к аватару
                    </Button>

                    <div className="flex items-center gap-2">
                        {[...Array(6)].map((_, i) => (
                            <div
                                key={i}
                                className={`w-2 h-2 rounded-full transition-colors ${
                                    i === 5 ? "bg-blue-600" : i < 5 ? "bg-blue-200" : "bg-gray-200"
                                }`}
                            />
                        ))}
                    </div>

                    <Button
                        size="lg"
                        onClick={handleNext}
                        disabled={!videoReady}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-8"
                    >
                        Продолжить
                        <ArrowRight className="ml-2 h-5 w-5"/>
                    </Button>
                </div>
            </div>
        </div>
    )
}
