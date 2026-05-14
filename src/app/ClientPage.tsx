"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import dynamic from "next/dynamic";
import { PortfolioConfig } from "@/lib/types";
import HeroSection from "@/components/HeroSection";
import SocialSidebar from "@/components/SocialSidebar";
import AboutSection from "@/components/AboutSection";
import MarsCard from "@/components/MarsCard"; // Just the overlay
import PublicationsSection from "@/components/PublicationsSection";
import RocketTimeline from "@/components/RocketTimeline";
import StackedColumns from "@/components/StackedColumns";
import PersonalSection from "@/components/PersonalSection";
import Footer from "@/components/Footer";
import TabSystem from "@/components/TabSystem";
import LiveFeed from "@/components/LiveFeed";

const HeroScene = dynamic(() => import("@/components/ParallaxScene"), {
  ssr: false,
});

/* 
   HomeTabContent:
   The main scrollable content for the "Home" tab.
   Contains the Hero Scroll Sequence (Atom -> Solar -> Mars Card) followed by other sections.
*/
function HomeTabContent({ config }: { config: PortfolioConfig }) {
  const [scrollProgress, setScrollProgress] = useState(0);
  const heroContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Find the scrollable container provided by TabSystem (id="tab-content-home")
    const container = document.getElementById("tab-content-home");
    if (!container) return;

    const onScroll = () => {
      if (!heroContainerRef.current) return;
      const scrollTop = container.scrollTop;

      // Hero container height: We want scroll progress 0 to 1 over the sticky duration.
      // Let's assume the sticky container is 250vh tall to allow enough scroll time.
      const totalScrollDistance = container.clientHeight * 2;

      const progress = Math.min(
        1,
        Math.max(0, scrollTop / totalScrollDistance),
      );
      setScrollProgress(progress);
    };

    container.addEventListener("scroll", onScroll, { passive: true });
    onScroll(); // Trigger once on mount

    return () => container.removeEventListener("scroll", onScroll);
  }, []);

  // Calculate opacities for the overlapping hero content
  // Hero Text (Name, etc): Fade out 0 -> 0.4
  const heroTextOpacity = Math.max(0, 1 - scrollProgress * 2.5);
  const heroTextPointerEvents = heroTextOpacity > 0.1 ? "auto" : "none";

  // Mars Card (Overlay): Fade in 0.7 -> 1.0
  const marsCardOpacity = Math.max(0, (scrollProgress - 0.7) * 3.33);
  const marsCardPointerEvents = marsCardOpacity > 0.1 ? "auto" : "none";

  return (
    <div className="relative">
      {/* Live feed ticker - sticky at the very top */}
      <div
        style={{
          position: "sticky",
          top: 0,
          zIndex: 60,
        }}
      >
        <LiveFeed
          projects={config.projects}
          publications={config.publications}
          blog={config.blog}
        />
      </div>

      {/* Social sidebar */}
      <SocialSidebar
        github={config.github}
        linkedin={config.linkedin}
        twitter={config.twitter}
        scholar={config.scholar}
        email={config.email}
      />

      <main className="page-content">
        {/* ======= HERO CONTAINER (Sticky) ======= */}
        {/* 
                    This pure CSS parallax implementation relies on the container being tall 
                    while the inner content is 'sticky' or 'fixed' within it. 
                */}
        {/* ======= HERO CONTAINER (Spacer) ======= */}
        {/* 
                    Scene is now FIXED in the background.
                    This container provides the scroll space (350vh) to drive the animation 
                    fully to 100% progress before the next section overlaps.
                */}
        <div
          ref={heroContainerRef}
          className="hero-scene-container"
          style={{ height: "350vh", position: "relative" }}
        >
          {/* Fixed Background Scene */}
          <div
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 0,
              pointerEvents: "none",
            }}
          >
            <HeroScene scrollProgress={scrollProgress} />
          </div>

          <div className="sticky top-0 w-full h-screen overflow-hidden">
            {/* 2. Hero Text (Name) - Fades Out */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                opacity: heroTextOpacity,
                pointerEvents: heroTextPointerEvents as any,
                zIndex: 10,
              }}
            >
              <HeroSection config={config} scrollProgress={scrollProgress} />
            </div>

            {/* 3. Mars Card Overlay - Fades In over the 3D Mars */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-start",
                opacity: marsCardOpacity,
                pointerEvents: marsCardPointerEvents as any,
                zIndex: 20,
              }}
            >
              <div className="w-full h-full flex items-center pl-[5%]">
                <MarsCard currentWork={config.currentWork} />
              </div>
            </div>
          </div>
        </div>

        {/* ======= REST OF CONTENT ======= */}
        {/* 
                    Because the hero container holds the scroll space, 
                    AboutSection appears naturally after scrolling 250vh.
                */}

        {/* <AboutSection about={config.about} education={config.education} /> */}

        {/* 
                    Sections 3+ (Publications, etc.)
                    Wrapped in opaque background to cover the Fixed Mars Scene.
                */}
        <div className="relative z-10 bg-[var(--cream-50)]">
          <RocketTimeline
            education={config.education}
            workExperience={config.workExperience}
            researchExperience={config.researchExperience}
          />

          <PublicationsSection publications={config.publications} />

          <StackedColumns
            projects={config.projects}
            blog={config.blog}
            recommendedReading={config.recommendedReading}
          />

          <PersonalSection
            personalInterests={config.personalInterests}
            personalImages={config.personalImages}
          />

          <Footer name={config.name} />
        </div>
      </main>
    </div>
  );
}

interface ClientPageProps {
  config: PortfolioConfig;
}

export default function ClientPage({ config }: ClientPageProps) {
  const homeTab = {
    id: "home",
    title: "Sameer Kashyap — Computational Researcher",
    type: "home" as const,
    icon: <span className="text-xs">🏠</span>,
    content: <HomeTabContent config={config} />,
  };

  return <TabSystem initialTab={homeTab} />;
}
