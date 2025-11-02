import { BackgroundPaths } from "@/components/ui/shadcn-io/background-paths";

export default function ArtisticLanding() {
  return (
    <div className="fixed h-full w-full top-0">
      <BackgroundPaths />
      {/* The component includes its own content overlay with title and button */}
      {/* Additional content can be layered with higher z-index if needed */}
    </div>
  );
}