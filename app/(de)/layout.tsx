import type { Viewport } from "next";
import RootHtml from "@/components/RootHtml";
import { homeMetadata } from "@/lib/seo";

export const metadata = homeMetadata("de");

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#161e33",
};

export default function DeLayout({ children }: { children: React.ReactNode }) {
  return <RootHtml lang="de">{children}</RootHtml>;
}
