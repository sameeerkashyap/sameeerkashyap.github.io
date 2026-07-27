'use client';

import { useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { CurrentWork } from '@/lib/types';
import MarsCard from '@/components/MarsCard';

const ParallaxScene = dynamic(() => import('@/components/ParallaxScene'), { ssr: false });

/* ================================================================
   The scroll-driven solar system → Mars sequence for the current
   research. Owns a 280vh scroll track; the 3D canvas is fixed
   behind it and the research card fades in as Mars arrives.
   Scroll progress is measured from this section's own position, so
   it works wherever the section sits in the page.
   ================================================================ */

interface MarsSceneProps {
    currentWork: CurrentWork;
}

export default function MarsScene({ currentWork }: MarsSceneProps) {
    const sectionRef = useRef<HTMLDivElement>(null);
    const canvasWrapRef = useRef<HTMLDivElement>(null);
    const cardRef = useRef<HTMLDivElement>(null);
    const rafRef = useRef<number | null>(null);

    useEffect(() => {
        const container = document.getElementById('tab-content-home');
        const section = sectionRef.current;
        if (!container || !section) return;

        const onScroll = () => {
            // Coalesce to one update per animation frame
            if (rafRef.current !== null) return;
            rafRef.current = requestAnimationFrame(() => {
                rafRef.current = null;
                const rect = section.getBoundingClientRect();
                const containerTop = container.getBoundingClientRect().top;
                // Matches ParallaxScene: progress starts at mid-screen
                const lead = container.clientHeight * 0.5;
                const travel = rect.height - lead;
                const progress = Math.min(1, Math.max(0, (containerTop + lead - rect.top) / Math.max(1, travel)));

                // Only render/paint the canvas while the section is on screen
                const inView = rect.top < container.clientHeight && rect.bottom > 0;
                if (canvasWrapRef.current) {
                    canvasWrapRef.current.style.opacity = inView ? '1' : '0';
                    canvasWrapRef.current.style.visibility = inView ? 'visible' : 'hidden';
                }

                const cardOpacity = Math.max(0, (progress - 0.58) * 3.33);
                if (cardRef.current) {
                    cardRef.current.style.opacity = String(Math.min(1, cardOpacity));
                    cardRef.current.style.pointerEvents = cardOpacity > 0.1 ? 'auto' : 'none';
                }
            });
        };

        container.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
        return () => {
            container.removeEventListener('scroll', onScroll);
            if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
        };
    }, []);

    return (
        <div
            id="mars-scene"
            ref={sectionRef}
            className="mars-scene-track"
            style={{ height: '280vh', position: 'relative' }}
        >
            {/* Fixed 3D backdrop — the scene reads scroll progress itself */}
            <div
                ref={canvasWrapRef}
                style={{
                    position: 'fixed',
                    inset: 0,
                    zIndex: 0,
                    pointerEvents: 'none',
                    transition: 'opacity 0.4s ease',
                }}
            >
                <ParallaxScene />
            </div>

            <div className="sticky top-0 w-full h-screen overflow-hidden">
                <div
                    ref={cardRef}
                    style={{
                        position: 'absolute',
                        inset: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'flex-start',
                        opacity: 0,
                        pointerEvents: 'none',
                        zIndex: 20,
                    }}
                >
                    <div className="w-full h-full flex items-center pl-[5%]">
                        <MarsCard currentWork={currentWork} />
                    </div>
                </div>
            </div>
        </div>
    );
}
