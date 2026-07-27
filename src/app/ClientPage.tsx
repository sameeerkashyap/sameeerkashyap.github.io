"use client";

import { PortfolioConfig } from "@/lib/types";
import HeroSection from "@/components/HeroSection";
import SocialSidebar from "@/components/SocialSidebar";
import MarsScene from "@/components/MarsScene";
import RocketTimeline from "@/components/RocketTimeline";
import StackedColumns from "@/components/StackedColumns";
import PersonalSection from "@/components/PersonalSection";
import Footer from "@/components/Footer";
import TabSystem from "@/components/TabSystem";
import LiveFeed from "@/components/LiveFeed";

function HomeTabContent({ config }: { config: PortfolioConfig }) {
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
        <HeroSection config={config} />

        <MarsScene currentWork={config.currentWork} />

        <div className="relative z-10 bg-[var(--cream-50)]">
          <RocketTimeline
            education={config.education}
            workExperience={config.workExperience}
            researchExperience={config.researchExperience}
          />
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
