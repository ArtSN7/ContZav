import { DashboardLayout } from "@/components/utils_for_components/dashboard_layout";
import { ScriptCreation } from "./script_creation";
import { ContentCreationProvider } from "@/contexts/ContentCreationContext";

export default function ScriptPage() {
  return (
    <DashboardLayout>
      <ContentCreationProvider>
        <ScriptCreation />
      </ContentCreationProvider>
    </DashboardLayout>
  );
}
