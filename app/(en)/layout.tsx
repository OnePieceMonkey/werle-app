import type { Viewport } from "next";
import RootHtml from "@/components/RootHtml";
import { homeMetadata } from "@/lib/seo";

export const metadata = homeMetadata("en");

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#161e33",
};

export default function EnLayout({ children }: { children: React.ReactNode }) {
  return <RootHtml lang="en">{children}</RootHtml>;
}
