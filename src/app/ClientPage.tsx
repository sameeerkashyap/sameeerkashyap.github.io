"use client";

import { useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { PortfolioConfig } from "@/lib/types";
import HeroSection from "@/components/HeroSection";
import SocialSidebar from "@/components/SocialSidebar";
import MarsCard from "@/components/MarsCard";
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

function HomeTabContent({ config }: { config: PortfolioConfig }) {
  const heroContainerRef = useRef<HTMLDivElement>(null);
  const heroTextDivRef = useRef<HTMLDivElement>(null);
  const marsCardDivRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const container = document.getElementById("tab-content-home");
    if (!container) return;

    const onScroll = () => {
      // Coalesce to one update per animation frame
      if (rafRef.current !== null) return;
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = null;
        const totalScrollDistance = container.clientHeight * 2;
        const progress = Math.min(
          1,
          Math.max(0, container.scrollTop / totalScrollDistance),
        );

        // Direct DOM mutations — no React re-renders on scroll
        const heroTextOpacity = Math.max(0, 1 - progress * 2.5);
        if (heroTextDivRef.current) {
          heroTextDivRef.current.style.opacity = String(heroTextOpacity);
          heroTextDivRef.current.style.transform = `translateY(${progress * -80}px)`;
          heroTextDivRef.current.style.pointerEvents =
            heroTextOpacity > 0.1 ? "auto" : "none";
        }

        const marsCardOpacity = Math.max(0, (progress - 0.7) * 3.33);
        if (marsCardDivRef.current) {
          marsCardDivRef.current.style.opacity = String(marsCardOpacity);
          marsCardDivRef.current.style.pointerEvents =
            marsCardOpacity > 0.1 ? "auto" : "none";
        }
      });
    };

    container.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      container.removeEventListener("scroll", onScroll);
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div className="relative">
      <div style={{ position: "sticky", top: 0, zIndex: 60 }}>
        <LiveFeed
          projects={config.projects}
          publications={config.publications}
          blog={config.blog}
        />
      </div>

      <SocialSidebar
        github={config.github}
        linkedin={config.linkedin}
        twitter={config.twitter}
        scholar={config.scholar}
        email={config.email}
      />

      <main className="page-content">
        <div
          ref={heroContainerRef}
          className="hero-scene-container"
          style={{ height: "350vh", position: "relative" }}
        >
          {/* Fixed Background Scene — owns its own scroll listener */}
          <div
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 0,
              pointerEvents: "none",
            }}
          >
            <HeroScene />
          </div>

          <div className="sticky top-0 w-full h-screen overflow-hidden">
            {/* Hero Text — fades + slides up via direct DOM style */}
            <div
              ref={heroTextDivRef}
              style={{
                position: "absolute",
                inset: 0,
                opacity: 1,
                transform: "translateY(0px)",
                pointerEvents: "auto",
                zIndex: 10,
              }}
            >
              <HeroSection config={config} />
            </div>

            {/* Mars Card — fades in via direct DOM style */}
            <div
              ref={marsCardDivRef}
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-start",
                opacity: 0,
                pointerEvents: "none",
                zIndex: 20,
              }}
            >
              <div className="w-full h-full flex items-center pl-[5%]">
                <MarsCard currentWork={config.currentWork} />
              </div>
            </div>
          </div>
        </div>

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
