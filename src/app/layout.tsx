import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sameer Kashyap — Computational Researcher",
  description: "Research portfolio of Sameer Kashyap. Exploring the intersection of computation, physics, and intelligence through molecular dynamics, scientific visualization, and physics-informed machine learning.",
  keywords: ["research", "computational science", "molecular dynamics", "machine learning", "physics", "scientific visualization"],
  openGraph: {
    title: "Sameer Kashyap — Computational Researcher",
    description: "Exploring the intersection of computation, physics, and intelligence.",
    type: "website",
  },
};

import StickyBanner from "@/components/StickyBanner";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <StickyBanner />
        {children}
      </body>
    </html>
  );
}
