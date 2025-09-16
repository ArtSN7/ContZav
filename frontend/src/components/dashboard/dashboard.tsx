import { DashboardLayout } from "../utils/dashboard_layout.tsx"
import { DashboardContent } from "./comps/main.tsx"

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <DashboardContent />
    </DashboardLayout>
  )
}
