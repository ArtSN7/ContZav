import { DashboardLayout } from "@/components/utils_for_components/dashboard_layout.tsx"
import {FormatSelection} from "@/components/content/format_selection/format_selection.tsx";

export default function ContentPage() {
  return (
    <DashboardLayout>
      <FormatSelection />
    </DashboardLayout>
  )
}
