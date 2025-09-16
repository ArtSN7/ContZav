import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import {ANALYTICS_ROUTE, AUTH_ROUTE, DASHBOARD_ROUTE, PROFILE_ROUTE} from './utils/CONSTANTS.ts'
import { AuthPage } from './components/auth/auth'
import DashboardPage from "@/components/dashboard/dashboard.tsx";
import AnalyticsPage from "@/components/analytics/analytics.tsx";
import ProfilePage from "@/components/profile/profile.tsx";

function App() {
  return (
    <Router>
      <Routes>
          <Route path={"/"} element={<AuthPage />} />, {/* вход */}
          <Route path={AUTH_ROUTE} element={<AuthPage />} />, {/* вход */}
          <Route path={DASHBOARD_ROUTE} element={<DashboardPage />} /> {/* которая главная в sidebar */}
          <Route path={ANALYTICS_ROUTE} element={<AnalyticsPage />} /> {/* которая аналитика в sidebar */}
          <Route path={PROFILE_ROUTE} element={<ProfilePage />} /> {/* которая профиль в sidebar */}
      </Routes>
    </Router>
  )
}

export default App