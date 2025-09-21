import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import {
    ANALYTICS_ROUTE,
    AUTH_ROUTE,
    DASHBOARD_ROUTE,
    PROFILE_ROUTE,
    CONTENT_CREATE_ROUTE,
    CONTENT_ROUTE_NICHE,
    CONTENT_ROUTE_PLANNING,
    CONTENT_ROUTE_SCRIPT, CONTENT_ROUTE_AVATAR, CONTENT_ROUTE_COMPETITORS, CONTENT_ROUTE_VIDEO_PREVIEW, SUCCESS_PAGE_ROUTE
} from "./utils/CONSTANTS.ts";

import {AuthPage} from "./components/auth/auth";


import DashboardPage from "@/components/dashboard/dashboard.tsx";
import AnalyticsPage from "@/components/analytics/analytics.tsx";
import ProfilePage from "@/components/profile/profile.tsx";
import ContentPage from "@/components/content/format_selection/main.tsx";
import PlanningPage from "@/components/content/planning/main.tsx";
import NichePage from "@/components/content/niche/main.tsx";
import ScriptPage from "@/components/content/script_creation/main.tsx";
import AvatarPage from "@/components/content/avatar/main.tsx";
import CompetitorsPage from "@/components/content/competitors/main.tsx";
import VideoPreviewPage from "@/components/content/video_preview/main.tsx";
import SuccessPage from "@/components/utils_for_components/success_window.tsx";

// import { AuthProvider } from "./contexts/AuthContext.tsx";

function App() {
    return (
        // <AuthProvider>
        <Router>
            <Routes>
                <Route path={"/"} element={<AuthPage/>}/>
                <Route path={AUTH_ROUTE} element={<AuthPage/>}/>
                <Route path={DASHBOARD_ROUTE} element={<DashboardPage/>}/>
                <Route path={ANALYTICS_ROUTE} element={<AnalyticsPage/>}/>
                <Route path={PROFILE_ROUTE} element={<ProfilePage/>}/>
                <Route path={CONTENT_CREATE_ROUTE} element={<ContentPage/>}/>
                <Route path={CONTENT_ROUTE_PLANNING} element={<PlanningPage/>}/>
                <Route path={CONTENT_ROUTE_NICHE} element={<NichePage/>}/>
                <Route path={CONTENT_ROUTE_SCRIPT} element={<ScriptPage/>}/>
                <Route path={CONTENT_ROUTE_AVATAR} element={<AvatarPage/>}/>
                <Route path={CONTENT_ROUTE_COMPETITORS} element={<CompetitorsPage/>}/>
                <Route path={CONTENT_ROUTE_VIDEO_PREVIEW} element={<VideoPreviewPage/>}/>
                <Route path={SUCCESS_PAGE_ROUTE} element={<SuccessPage/>}/>
            </Routes>
        </Router>
        // {/* </AuthProvider> */}
    );
}

export default App;
