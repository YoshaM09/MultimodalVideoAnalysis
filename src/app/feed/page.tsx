import { VideoFeed } from "../components/video-feed";
import { SideNavigation } from "../components/side-navigation";

export default function FeedPage() {
  return (
    <div className="min-h-screen bg-[#121212]">
      <SideNavigation />

      {/* Main Content */}
      <main className="pl-16">
        <VideoFeed />
      </main>
    </div>
  );
}
