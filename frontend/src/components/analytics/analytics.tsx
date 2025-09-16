import {DashboardLayout} from "../utils/dashboard_layout"
import {AnalyticsDashboard} from "./comps/analytics_dashboard"

export default function AnalyticsPage() {
    return (
        <DashboardLayout>
            <AnalyticsDashboard/>
        </DashboardLayout>
    )
}