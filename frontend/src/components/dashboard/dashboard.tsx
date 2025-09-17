import { DashboardLayout } from "@/components/utils_for_components/dashboard_layout"
import { DashboardContent } from "./comps/main.tsx"

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <DashboardContent />
    </DashboardLayout>
  )
}
