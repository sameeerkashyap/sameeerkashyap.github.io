'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { PortfolioConfig } from '@/lib/types';
import HeroSection from '@/components/HeroSection';
import SocialSidebar from '@/components/SocialSidebar';
import AboutSection from '@/components/AboutSection';
import MarsCard from '@/components/MarsCard';
import PublicationsSection from '@/components/PublicationsSection';
import StackedColumns from '@/components/StackedColumns';
import PersonalSection from '@/components/PersonalSection';
import Footer from '@/components/Footer';

const HeroScene = dynamic(() => import('@/components/ParallaxScene'), { ssr: false });

interface ClientPageProps {
    config: PortfolioConfig;
}

export default function ClientPage({ config }: ClientPageProps) {
    const [scrollProgress, setScrollProgress] = useState(0);
    const heroContainerRef = useRef<HTMLDivElement>(null);

    const handleScroll = useCallback(() => {
        if (!heroContainerRef.current) return;
        const rect = heroContainerRef.current.getBoundingClientRect();
        const containerHeight = heroContainerRef.current.offsetHeight - window.innerHeight;
        if (containerHeight <= 0) return;
        const scrolled = -rect.top;
        const progress = Math.min(1, Math.max(0, scrolled / containerHeight));
        setScrollProgress(progress);
    }, []);

    useEffect(() => {
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [handleScroll]);

    return (
        <>
            {/* Social sidebar */}
            <SocialSidebar
                github={config.github}
                linkedin={config.linkedin}
                twitter={config.twitter}
                scholar={config.scholar}
                email={config.email}
            />

            <main className="page-content">
                {/* ======= HERO: Atom → Solar System → Mars ======= */}
                <div ref={heroContainerRef} className="hero-scene-container">
                    <div className="hero-canvas-wrapper">
                        <HeroScene scrollProgress={scrollProgress} />
                        <HeroSection config={config} scrollProgress={scrollProgress} />
                    </div>
                </div>

                {/* ======= ABOUT ======= */}
                <AboutSection about={config.about} education={config.education} />

                {/* ======= MARS CARD (current research, planet spins behind) ======= */}
                <section className="section-block" id="current-work" style={{ paddingTop: 0 }}>
                    <MarsCard currentWork={config.currentWork} />
                </section>

                {/* ======= PUBLICATIONS ======= */}
                <PublicationsSection publications={config.publications} />

                {/* ======= THREE COLUMNS ======= */}
                <StackedColumns
                    workExperience={config.workExperience}
                    researchExperience={config.researchExperience}
                    projects={config.projects}
                    blog={config.blog}
                    recommendedReading={config.recommendedReading}
                />

                {/* ======= PERSONAL ======= */}
                <PersonalSection
                    personalInterests={config.personalInterests}
                    personalImages={config.personalImages}
                />

                {/* ======= FOOTER ======= */}
                <Footer name={config.name} email={config.email} />
            </main>
        </>
    );
}
