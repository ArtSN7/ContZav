"use client"

import {CheckCircle, Home} from "lucide-react"
import {Button} from "@/components/ui/button"
import {Card, CardContent, CardFooter, CardHeader} from "@/components/ui/card"
import {useNavigate} from "react-router";
import {DASHBOARD_ROUTE} from "@/utils/CONSTANTS.ts";

export default function SuccessPage() {

    const navigate = useNavigate();

    return (
        <div
            className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center p-4">
            <Card className="w-full max-w-md mx-auto shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader className="text-center pb-4">
                    <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                        <CheckCircle className="w-8 h-8 text-green-600"/>
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900">Все успешно выполнено!</h1>
                </CardHeader>

                <CardContent className="text-center">
                    <p className="text-gray-600 leading-relaxed">Ваша операция была успешно завершена.</p>
                </CardContent>

                <CardFooter className="pt-6">
                    <div className="w-full">
                        <Button onClick={() => navigate(DASHBOARD_ROUTE)}
                            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                            <Home className="w-4 h-4 mr-2"/>
                            Вернуться на главную страницу
                        </Button>
                    </div>
                </CardFooter>
            </Card>
        </div>
    )
}
