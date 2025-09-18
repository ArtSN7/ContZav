import { DashboardLayout } from "@/components/utils_for_components/dashboard_layout";
import { NicheDefinition } from "./niche_definition";
import { ContentCreationProvider } from "@/contexts/ContentCreationContext";

export default function NichePage() {
  return (
    <DashboardLayout>
      <ContentCreationProvider>
        <NicheDefinition />
      </ContentCreationProvider>
    </DashboardLayout>
  );
}
