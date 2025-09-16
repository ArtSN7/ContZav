import { DashboardLayout } from "@/components/utils_for_components/dashboard_layout.tsx"
import { UserProfile } from "./comps/user_profile"

export default function ProfilePage() {
  return (
    <DashboardLayout>
      <UserProfile />
    </DashboardLayout>
  )
}
