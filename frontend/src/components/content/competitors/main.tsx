import { DashboardLayout} from "@/components/utils_for_components/dashboard_layout.tsx";
import { CompetitorsAnalysis } from "./comps/competitors_analysis"

export default function CompetitorsPage() {
  return (
    <DashboardLayout>
      <CompetitorsAnalysis />
    </DashboardLayout>
  )
}
