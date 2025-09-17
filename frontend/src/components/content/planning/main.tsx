import { DashboardLayout} from "@/components/utils_for_components/dashboard_layout.tsx";
import { EnhancedPublicationPlanning } from "./enhanced_publication_planning"

export default function PlanningPage() {
  return (
    <DashboardLayout>
      <EnhancedPublicationPlanning />
    </DashboardLayout>
  )
}
