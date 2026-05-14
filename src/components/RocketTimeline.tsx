'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';

const ThreeModelViewer = dynamic(() => import('@/components/ThreeModelViewer'), { ssr: false });
import { WorkExperience, ResearchExperience, Education } from '@/lib/types';
import { sendGAEvent, TAP_CARD } from '@/analytics/events';

interface RocketTimelineProps {
    education: Education[];
    workExperience: WorkExperience[];
    researchExperience: ResearchExperience[];
}

interface ShipSpec {
    shipName: string;
    shipClass: string;
    speed: string;
    propulsion: string;
    crew: string;
    color: string;
    registry: string;
    quote: string;
}

const SPACESHIPS_SPECS: Record<string, ShipSpec> = {
    falcon: {
        shipName: 'Millennium Falcon',
        shipClass: 'YT-1300 Light Freighter',
        registry: 'YT-1300 (Highly Modified)',
        speed: '0.5 past lightspeed',
        propulsion: 'Girodyne SRB42 Hyperdrive',
        crew: 'Han Solo & Chewbacca',
        color: '#38bdf8',
        quote: '"She may not look like much, but she\'s got it where it counts, kid."',
    },
    endurance: {
        shipName: 'The Endurance',
        shipClass: 'Modular Exploration Vessel',
        registry: 'Interstellar-Ranger Node',
        speed: 'Escape Velocity / Gravitational Sling',
        propulsion: 'Magnetoplasmadynamic (MPD) Thrusters',
        crew: 'Cooper, Brand, CASE & TARS',
        color: '#c4b7d4',
        quote: '"Do not go gentle into that good night. Rage, rage against the dying of the light."',
    },
    hailmary: {
        shipName: 'The Hail Mary',
        shipClass: 'Scientific Research Vessel',
        registry: 'Project Hail Mary (Earth-Saving)',
        speed: '0.92c (Relativistic)',
        propulsion: 'Enriched Astrophage-Thrust Engine',
        crew: 'Ryland Grace & Rocky (Eridian)',
        color: '#34d399',
        quote: '"Fist my bump! Science is the only way, my friend."',
    }
};

const SHIP_MODELS: Record<string, string> = {
    falcon:    '/models/millennium_falcon.glb',
    endurance: '/models/interstellar__endurance_high_fidelity.glb',
    hailmary:  '/models/project_hail_mary_ship.glb'
};

// Shaped to each ship's silhouette so the canvas fills its form without dead space
const SHIP_TRACK_CONFIG: Record<string, { w: number; h: number }> = {
    falcon:    { w: 260, h: 155 },
    endurance: { w: 190, h: 190 },
    hailmary:  { w: 148, h: 248 },
};

// Initial orientation — ships auto-spin on Y; X/Z set the static tilt/roll pose
const SHIP_ROTATIONS: Record<string, [number, number, number]> = {
    falcon:    [-Math.PI / 2.5, 0, Math.PI], // X tilt ~72° + Z flip — dorsal hull faces camera
    endurance: [Math.PI / 6, 0, 0],          // slight X tilt — ring visible at angle
    hailmary:  [0, Math.PI / 2, 0],          // 90° Y — side profile of the needle hull
};

// Hero-view scale boost per ship (for ships that render small after normalization)
const SHIP_HERO_SCALE: Record<string, number> = {
    falcon:    1.0,
    endurance: 1.0,
    hailmary:  1.6,
};

export default function RocketTimeline({ education, workExperience, researchExperience }: RocketTimelineProps) {
    const [pinnedIndex, setPinnedIndex] = useState<number | null>(null);
    const [isMobile, setIsMobile] = useState(false);
    useEffect(() => {
        const check = () => setIsMobile(window.innerWidth < 768);
        check();
        window.addEventListener('resize', check);
        return () => window.removeEventListener('resize', check);
    }, []);

    // Close expanded card on scroll/swipe (mobile only)
    const sectionRef = useRef<HTMLElement>(null);
    const touchStartY = useRef(0);
    useEffect(() => {
        if (!isMobile || pinnedIndex === null) return;
        const section = sectionRef.current;
        if (!section) return;

        const onTouchStart = (e: TouchEvent) => {
            touchStartY.current = e.touches[0].clientY;
        };
        const onTouchMove = (e: TouchEvent) => {
            if (Math.abs(e.touches[0].clientY - touchStartY.current) > 30) {
                setPinnedIndex(null);
            }
        };

        section.addEventListener('touchstart', onTouchStart, { passive: true });
        section.addEventListener('touchmove', onTouchMove, { passive: true });
        return () => {
            section.removeEventListener('touchstart', onTouchStart);
            section.removeEventListener('touchmove', onTouchMove);
        };
    }, [isMobile, pinnedIndex]);

    const timelineData = [
        {
            id: 'frontrow',
            year: '2021',
            actualPeriod: workExperience[2]?.period,
            roleTitle: workExperience[2]?.title,
            entity: workExperience[2]?.company,
            location: workExperience[2]?.location,
            description: workExperience[2]?.description,
            highlights: workExperience[2]?.highlights ?? [],
            tags: workExperience[2]?.tags ?? [],
            shipKey: 'falcon'
        },
        {
            id: 'acko',
            year: '2022',
            actualPeriod: `${workExperience[1]?.period?.split('–')[0]?.trim()} – ${workExperience[0]?.period?.split('–')[1]?.trim()}`,
            roleTitle: 'SDE I → SDE II',
            entity: workExperience[0]?.company,
            location: workExperience[0]?.location,
            description: `${workExperience[1]?.description} ${workExperience[0]?.description}`,
            highlights: [
                ...(workExperience[1]?.highlights ?? []).slice(0, 2),
                ...(workExperience[0]?.highlights ?? []).slice(0, 2),
            ],
            tags: [
                ...(workExperience[1]?.tags ?? []),
                ...(workExperience[0]?.tags ?? []),
            ],
            shipKey: 'endurance'
        },
        {
            id: 'ucsc',
            year: '2025',
            actualPeriod: `${education[0]?.period} / ${researchExperience[0]?.period}`,
            roleTitle: `${researchExperience[0]?.title}`,
            entity: researchExperience[0]?.institution,
            location: researchExperience[0]?.location,
            description: researchExperience[0]?.description,
            highlights: researchExperience[0]?.highlights ?? [],
            tags: researchExperience[0]?.tags ?? [],
            shipKey: 'hailmary'
        }
    ];

    const currentItem = pinnedIndex !== null ? timelineData[pinnedIndex] : null;
    const currentSpec  = currentItem ? SPACESHIPS_SPECS[currentItem.shipKey] : null;

    const handleSelect = (idx: number) => {
        sendGAEvent(TAP_CARD, { type: 'RocketTimeline', title: timelineData[idx].roleTitle, origin: 'timeline-rocket' });
        setPinnedIndex(pinnedIndex === idx ? null : idx);
    };

    return (
        <section ref={sectionRef} className="relative overflow-hidden py-16 px-4 md:px-8 bg-[#0c0a09] border-y border-neutral-900" id="experience">
            {/* Background stars */}
            <div className="absolute inset-0 opacity-15 pointer-events-none" style={{
                backgroundImage: 'radial-gradient(1px 1px at 20px 30px,#fff,rgba(0,0,0,0)),radial-gradient(1px 1px at 75px 120px,#fef08a,rgba(0,0,0,0)),radial-gradient(1.5px 1.5px at 150px 80px,#93c5fd,rgba(0,0,0,0))',
                backgroundSize: '200px 200px',
            }} />

            <div className="max-w-[1200px] mx-auto relative z-10">

                {/* Header */}
                <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="mb-12">
                    <div className="flex items-center gap-3">
                        <span className="mono text-xs text-[var(--mars-glow)] tracking-widest uppercase">Active Mission</span>
                        <div className="h-px flex-1 bg-gradient-to-r from-[var(--mars-glow)]/30 to-transparent" />
                    </div>
                    <h2 className="serif text-3xl md:text-4xl font-semibold text-white mt-3">Experience</h2>
                </motion.div>

                {/* mode="wait" — timeline exits fully before hero enters, so two canvases
                    never fight over the same DOM element and there is no camera-reset flash */}
                <AnimatePresence mode="wait">
                    {pinnedIndex === null ? (

                        /* ── TIMELINE ── */
                        <motion.div
                            key="timeline"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0, scale: 0.98, transition: { duration: 0.18 } }}
                            transition={{ duration: 0.25 }}
                        >
                            <div className="relative rounded-2xl bg-black/40 border border-neutral-900/60 shadow-2xl backdrop-blur-md overflow-hidden">
                                <div
                                    className="md:overflow-x-auto py-8 md:py-12 px-4 md:px-6 [&::-webkit-scrollbar]:hidden"
                                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' } as React.CSSProperties}
                                >
                                    <div className="relative md:min-w-[960px] flex flex-col md:flex-row md:justify-between md:items-center md:px-12 py-4 gap-6 md:gap-0">

                                        {/* Grid bg */}
                                        <div className="absolute inset-0 opacity-5 pointer-events-none" style={{
                                            backgroundImage: 'linear-gradient(rgba(249,115,22,.1) 1px,transparent 1px),linear-gradient(90deg,rgba(249,115,22,.1) 1px,transparent 1px)',
                                            backgroundSize: '40px 40px'
                                        }} />

                                        {/* Horizontal axis line — desktop */}
                                        <div className="hidden md:block absolute left-12 right-12 top-1/2 -translate-y-1/2 h-[2px] bg-gradient-to-r from-orange-500/10 via-orange-500/50 to-emerald-500/50 z-0">
                                            <motion.div
                                                className="h-full w-32 bg-gradient-to-r from-transparent via-white to-transparent opacity-70"
                                                animate={{ left: ['-10%', '110%'] }}
                                                transition={{ repeat: Infinity, duration: 5, ease: 'linear' }}
                                                style={{ position: 'absolute' }}
                                            />
                                        </div>

                                        {/* Vertical axis line — mobile */}
                                        <div className="block md:hidden absolute left-[17px] top-0 bottom-0 w-[2px] bg-gradient-to-b from-orange-500/10 via-orange-500/50 to-emerald-500/50 z-0">
                                            <motion.div
                                                className="w-full h-20 bg-gradient-to-b from-transparent via-white to-transparent opacity-70"
                                                animate={{ top: ['-10%', '110%'] }}
                                                transition={{ repeat: Infinity, duration: 5, ease: 'linear' }}
                                                style={{ position: 'absolute' }}
                                            />
                                        </div>

                                        {timelineData.map((item, idx) => {
                                            const spec = SPACESHIPS_SPECS[item.shipKey];
                                            const cfg  = SHIP_TRACK_CONFIG[item.shipKey];
                                            const shipW = isMobile ? 140 : cfg.w;
                                            const shipH = isMobile ? 110 : cfg.h;

                                            return (
                                                <div
                                                    key={item.id}
                                                    className="relative flex flex-row md:flex-col md:items-center cursor-pointer group pl-9 md:pl-0 gap-4 md:gap-0"
                                                    style={isMobile ? undefined : { width: cfg.w + 60 }}
                                                    onClick={() => handleSelect(idx)}
                                                >
                                                    {/* Mobile dot on vertical axis */}
                                                    <div className="md:hidden absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full border-2 bg-neutral-900 border-neutral-700 group-hover:border-orange-400 group-hover:scale-110 transition-all duration-200 z-10" />

                                                    {/* Year — above ship on desktop, in text column on mobile */}
                                                    <div className="hidden md:flex mb-4 mono text-xs font-semibold px-2.5 py-1 rounded border bg-neutral-900 text-neutral-400 border-neutral-800 group-hover:text-orange-400 group-hover:border-orange-500/40 transition-colors duration-200">
                                                        {item.year}
                                                    </div>

                                                    {/* Ship canvas */}
                                                    <div className="relative z-10 shrink-0" style={{ width: shipW, height: shipH }}>
                                                        <ThreeModelViewer
                                                            modelUrl={SHIP_MODELS[item.shipKey]}
                                                            glowColor={spec.color}
                                                            enableControls={false}
                                                            compact={true}
                                                            autoRotate={true}
                                                            initialRotation={SHIP_ROTATIONS[item.shipKey]}
                                                        />
                                                        <div className="absolute inset-0 z-20 bg-transparent" />
                                                    </div>

                                                    {/* Desktop axis dot */}
                                                    <div className="hidden md:block relative mt-3">
                                                        <div className="w-3 h-3 rounded-full border-2 bg-neutral-900 border-neutral-700 group-hover:border-orange-400 group-hover:scale-110 transition-all duration-200" />
                                                    </div>

                                                    {/* Text info — centered on desktop, right column on mobile */}
                                                    <div className="flex flex-col justify-center md:items-center md:text-center md:mt-3 md:px-2 flex-1 md:flex-none">
                                                        <div className="md:hidden mb-1.5 mono text-xs font-semibold px-2 py-0.5 rounded border bg-neutral-900 text-neutral-400 border-neutral-800 group-hover:text-orange-400 group-hover:border-orange-500/40 transition-colors duration-200 self-start">
                                                            {item.year}
                                                        </div>
                                                        <p className="text-xs font-semibold text-neutral-400 group-hover:text-white transition-colors duration-200">{item.roleTitle}</p>
                                                        <p className="text-[10px] mono text-neutral-500 mt-0.5 uppercase tracking-wider">{item.entity}</p>
                                                        <p className="text-[9px] mono text-neutral-700 mt-1 group-hover:text-neutral-500 transition-colors duration-200">{isMobile ? 'tap' : 'click'} to explore →</p>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                    ) : currentItem && currentSpec ? (

                        /* ── HERO ── */
                        <motion.div
                            key={`hero-${currentItem.id}`}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0, transition: { duration: 0.18 } }}
                            transition={{ duration: 0.22 }}
                        >
                            {/* Nav */}
                            <div className="flex items-center justify-between mb-5">
                                <button
                                    onClick={() => setPinnedIndex(null)}
                                    className="mono text-xs text-neutral-400 hover:text-white border border-neutral-800 hover:border-neutral-600 bg-neutral-900/60 px-3 py-1.5 rounded-lg transition-all cursor-pointer"
                                >
                                    ← Timeline
                                </button>
                                <div className="flex gap-2">
                                    {timelineData.map((item, idx) => {
                                        const s = SPACESHIPS_SPECS[item.shipKey];
                                        const active = pinnedIndex === idx;
                                        return (
                                            <button key={item.id} onClick={() => setPinnedIndex(idx)}
                                                className="mono text-[9px] px-2.5 py-1 rounded border transition-all cursor-pointer"
                                                style={active
                                                    ? { borderColor: s.color, color: s.color, background: `${s.color}18` }
                                                    : { borderColor: '#2a2a2a', color: '#555', background: 'transparent' }
                                                }>
                                                {item.year}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Hero card — ship scales in from compact-like size (easeOutExpo zoom feel) */}
                            <motion.div
                                initial={{ scale: 0.92, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                                className="rounded-2xl border overflow-hidden"
                                style={{ borderColor: `${currentSpec.color}28`, background: '#080706' }}
                            >
                                <div className="flex flex-col md:flex-row min-h-[540px]">

                                    {/* LEFT — ship */}
                                    <div
                                        className="relative md:w-[58%] shrink-0"
                                        style={{ minHeight: 380, height: 'clamp(380px, 60vh, 700px)' }}
                                    >
                                        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_55%,rgba(0,0,0,0.5)_100%)] z-10" />
                                        <div className="absolute top-3 left-4 mono text-[8px] text-neutral-700 z-20 uppercase tracking-widest">{currentSpec.registry}</div>
                                        <ThreeModelViewer
                                            modelUrl={SHIP_MODELS[currentItem.shipKey]}
                                            glowColor={currentSpec.color}
                                            enableControls={true}
                                            compact={false}
                                            autoRotate={true}
                                            scaleScalar={SHIP_HERO_SCALE[currentItem.shipKey]}
                                            initialRotation={SHIP_ROTATIONS[currentItem.shipKey]}
                                        />
                                    </div>

                                    {/* RIGHT — details */}
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ duration: 0.3, delay: 0.25 }}
                                        className="md:w-[42%] overflow-y-auto p-6 md:p-8 flex flex-col gap-5 border-t md:border-t-0 md:border-l"
                                        style={{ borderColor: `${currentSpec.color}18`, scrollbarWidth: 'none', msOverflowStyle: 'none' } as React.CSSProperties}
                                    >
                                        {/* Identity */}
                                        <div className="border-b pb-4" style={{ borderColor: `${currentSpec.color}18` }}>
                                            <p className="mono text-[9px] uppercase tracking-widest mb-1" style={{ color: currentSpec.color }}>{currentSpec.shipClass}</p>
                                            <h3 className="serif text-2xl md:text-3xl font-semibold text-white leading-tight">{currentSpec.shipName}</h3>
                                            <p className="text-xs text-neutral-400 italic mt-2 leading-relaxed">{currentSpec.quote}</p>
                                        </div>

                                        {/* Telemetry specs */}
                                        <div className="grid grid-cols-2 gap-3 bg-neutral-950/60 p-3 rounded-xl border border-neutral-800/60 mono text-xs">
                                            {[
                                                ['Propulsion', currentSpec.propulsion],
                                                ['Velocity',   currentSpec.speed],
                                                ['Crew',       currentSpec.crew],
                                                ['Class',      currentSpec.shipClass],
                                            ].map(([label, val]) => (
                                                <div key={label}>
                                                    <span className="text-neutral-500 block text-[9px] uppercase tracking-wider mb-0.5">{label}</span>
                                                    <span className="text-neutral-300 font-medium block truncate" title={val}>{val}</span>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Description */}
                                        <p className="text-sm text-neutral-300 leading-relaxed italic bg-neutral-950/40 p-3 rounded-xl border border-neutral-900/60">{currentItem.description}</p>

                                        {/* Work experience */}
                                        <div className="border-t pt-5" style={{ borderColor: `${currentSpec.color}15` }}>
                                            <p className="mono text-[9px] uppercase tracking-widest text-neutral-500 mb-2">Actual Impact</p>
                                            <h2 className="font-semibold text-sm text-white">{currentItem.roleTitle}</h2>
                                            <p className="text-xs text-[var(--mars-orange)] mt-0.5">{currentItem.entity} &bull; {currentItem.location}</p>
                                            <p className="mono text-[10px] text-neutral-500 mt-1 mb-3">{currentItem.actualPeriod}</p>
                                            <ul className="space-y-2.5 text-sm text-neutral-300">
                                                {currentItem.highlights.map((h, i) => (
                                                    <li key={i} className="flex gap-2.5 items-start leading-relaxed">
                                                        <span className="text-xs select-none mt-0.5 shrink-0" style={{ color: currentSpec.color }}>▸</span>
                                                        <span>{h}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>

                                        {/* Tags */}
                                        <div className="pt-4 border-t border-neutral-900 flex flex-wrap gap-1.5">
                                            {currentItem.tags.map((tag, i) => (
                                                <span key={`${tag}-${i}`} className="text-[9px] mono px-2 py-0.5 rounded border bg-neutral-900/60 text-neutral-400 border-neutral-800">{tag}</span>
                                            ))}
                                        </div>
                                    </motion.div>
                                </div>
                            </motion.div>
                        </motion.div>

                    ) : null}
                </AnimatePresence>
            </div>
        </section>
    );
}
