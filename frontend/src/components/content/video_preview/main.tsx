import { DashboardLayout } from "@/components/utils_for_components/dashboard_layout";
import {VideoPreview} from "@/components/content/video_preview/comps/video_preview.tsx";

export default function VideoPreviewPage() {
  return (
    <DashboardLayout>
        <VideoPreview />
    </DashboardLayout>
  );
}
