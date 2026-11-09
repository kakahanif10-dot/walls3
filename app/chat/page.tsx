import type { Metadata } from "next";
import DiscordLiveChat from "@/components/discord-live-chat";

export const metadata: Metadata = {
  title: "Live Trading Chat & AI Moderator — NextWall Street",
  description:
    "Discord-style live trading floor with minute-by-minute AI predictions, technical invalidation levels, multi-timezone clocks (WIB, UTC, EST), and community discussion.",
};

export default function ChatPage() {
  return (
    <div className="mx-auto max-w-[1520px] px-3 py-6 sm:px-6 sm:py-8">
      <DiscordLiveChat />
    </div>
  );
}
