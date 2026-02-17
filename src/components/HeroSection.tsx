'use client';

import { motion } from 'framer-motion';
import { PortfolioConfig } from '@/lib/types';

interface HeroSectionProps {
    config: PortfolioConfig;
    scrollProgress: number;
}

export default function HeroSection({ config, scrollProgress }: HeroSectionProps) {
    // Fade out hero text as scroll progresses
    const heroOpacity = Math.max(0, 1 - scrollProgress * 3);
    const heroY = scrollProgress * -80;

    return (
        <div
            className="hero-overlay responsive-hero-padding"
            style={{
                opacity: heroOpacity,
                transform: `translateY(${heroY}px)`,
                transition: 'none',
            }}
        >
            <motion.p
                className="mono text-xs tracking-widest uppercase mb-4"
                style={{ color: 'var(--text-tertiary)' }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
            >
                {config.location}
            </motion.p>

            <motion.h1
                className="serif font-bold leading-tight mb-4"
                style={{ fontSize: 'clamp(2.5rem, 8vw, 6rem)', color: 'var(--text-primary)' }}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.8, ease: [0.4, 0, 0.2, 1] as const }}
            >
                {config.name}
            </motion.h1>

            <motion.p
                className="text-lg md:text-xl max-w-2xl mb-6 leading-relaxed"
                style={{ color: 'var(--text-secondary)' }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.6 }}
            >
                {config.tagline}
            </motion.p>

            <motion.div
                className="flex flex-wrap gap-3 mb-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.0, duration: 0.5 }}
            >
                {config.researchInterests.map((interest, i) => (
                    <motion.span
                        key={interest}
                        className="tag"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.0 + i * 0.1, duration: 0.4 }}
                    >
                        {interest}
                    </motion.span>
                ))}
            </motion.div>

            {/* Scroll hint */}
            <motion.div
                className="mt-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                transition={{ delay: 2, duration: 1 }}
            >

                <p className="mono text-[10px] tracking-widest uppercase" style={{ color: 'var(--text-tertiary)' }}>
                    scroll to explore ↓
                </p>
            </motion.div>
        </div >
    );
}
