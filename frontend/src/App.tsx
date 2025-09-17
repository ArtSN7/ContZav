import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import {
    ANALYTICS_ROUTE,
    AUTH_ROUTE,
    DASHBOARD_ROUTE,
    PROFILE_ROUTE,
    CONTENT_CREATE_ROUTE,
    CONTENT_ROUTE_PRICING,
    CONTENT_ROUTE_NICHE,
    CONTENT_ROUTE_PLANNING,
    CONTENT_ROUTE_SCRIPT
} from './utils/CONSTANTS.ts'
import {AuthPage} from './components/auth/auth'
import DashboardPage from "@/components/dashboard/dashboard.tsx";
import AnalyticsPage from "@/components/analytics/analytics.tsx";
import ProfilePage from "@/components/profile/profile.tsx";
import ContentPage from "@/components/content/format_selection/main.tsx";
import PlanningPage from "@/components/content/planning/main.tsx";
import PricingPage from "@/components/content/pricing/main.tsx";
import NichePage from "@/components/content/niche/main.tsx";
import ScriptPage from "@/components/content/script_creation/main.tsx";

function App() {
    return (
        <Router>
            <Routes>
                <Route path={"/"} element={<AuthPage/>}/>, {/* вход */}
                <Route path={AUTH_ROUTE} element={<AuthPage/>}/>, {/* вход */}
                <Route path={DASHBOARD_ROUTE} element={<DashboardPage/>}/> {/* которая главная в sidebar */}
                <Route path={ANALYTICS_ROUTE} element={<AnalyticsPage/>}/> {/* которая аналитика в sidebar */}
                <Route path={PROFILE_ROUTE} element={<ProfilePage/>}/> {/* которая профиль в sidebar */}
                <Route path={CONTENT_CREATE_ROUTE} element={<ContentPage/>}/> {/* которая контент в sidebar */}

                {/* страницы / tabs при создании контента */}
                <Route path={CONTENT_ROUTE_PLANNING} element={<PlanningPage/>}/>
                <Route path={CONTENT_ROUTE_PRICING} element={<PricingPage/>}/>
                <Route path={CONTENT_ROUTE_NICHE} element={<NichePage/>}/>
                <Route path={CONTENT_ROUTE_SCRIPT} element={<ScriptPage/>}/>

            </Routes>
        </Router>
    )
}

export default App