'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CurrentWork } from '@/lib/types';

interface MarsSectionProps {
    currentWork: CurrentWork;
}

export default function MarsSection({ currentWork }: MarsSectionProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Generate particle positions deterministically to avoid hydration mismatch
    const particles = useMemo(() => {
        return Array.from({ length: 30 }, (_, i) => ({
            width: 2 + (((i * 7 + 3) % 11) / 11) * 3,
            height: 2 + (((i * 13 + 5) % 11) / 11) * 3,
            left: ((i * 37 + 11) % 100),
            top: ((i * 53 + 17) % 100),
            r: 150 + (((i * 23 + 7) % 11) / 11) * 100,
            g: (((i * 31 + 2) % 11) / 11) * 80,
            dur: 3 + (((i * 41 + 9) % 11) / 11) * 4,
            delay: (((i * 19 + 3) % 11) / 11) * 3,
        }));
    }, []);

    return (
        <>
            <motion.section
                className="mars-section"
                onClick={() => setIsModalOpen(true)}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.8 }}
                id="current-work"
            >
                {/* Background gradient */}
                <div className="mars-bg" />

                {/* Animated particles overlay */}
                <div style={{ position: 'absolute', inset: 0, zIndex: 1, overflow: 'hidden' }}>
                    {particles.map((p, i) => (
                        <motion.div
                            key={i}
                            style={{
                                position: 'absolute',
                                width: p.width,
                                height: p.height,
                                left: `${p.left}%`,
                                top: `${p.top}%`,
                                borderRadius: '50%',
                                background: `rgba(255, ${p.r}, ${p.g}, 0.4)`,
                            }}
                            animate={{
                                y: [0, -20, 0],
                                opacity: [0.3, 0.8, 0.3],
                            }}
                            transition={{
                                duration: p.dur,
                                repeat: Infinity,
                                delay: p.delay,
                            }}
                        />
                    ))}
                </div>

                <div className="mars-content">
                    <motion.p
                        style={{ color: 'rgba(255,255,255,0.5)', fontFamily: "'JetBrains Mono', monospace", fontSize: '0.75rem', letterSpacing: '0.15em', textTransform: 'uppercase' as const, marginBottom: '0.75rem' }}
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                    >
                        Current Research
                    </motion.p>

                    <motion.h2
                        className="serif mars-shimmer-text"
                        style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 700, marginBottom: '1rem' }}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.4, duration: 0.6 }}
                    >
                        {currentWork.title}
                    </motion.h2>

                    <motion.p
                        style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.9rem', lineHeight: 1.7, marginBottom: '1.5rem' }}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.6 }}
                    >
                        {currentWork.description}
                    </motion.p>

                    <motion.div
                        style={{ display: 'flex', flexWrap: 'wrap' as const, gap: '0.5rem', justifyContent: 'center', marginBottom: '1rem' }}
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.8 }}
                    >
                        {currentWork.tags.map((tag) => (
                            <span
                                key={tag}
                                style={{
                                    fontSize: '0.75rem',
                                    padding: '2px 12px',
                                    borderRadius: '999px',
                                    background: 'rgba(255,255,255,0.1)',
                                    color: 'rgba(255,255,255,0.7)',
                                    border: '1px solid rgba(255,255,255,0.15)',
                                }}
                            >
                                {tag}
                            </span>
                        ))}
                    </motion.div>

                    <motion.p
                        style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.6rem', letterSpacing: '0.15em', textTransform: 'uppercase' as const, color: 'rgba(255,255,255,0.35)' }}
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 1.0 }}
                    >
                        Click to explore →
                    </motion.p>
                </div>
            </motion.section>

            {/* Mars Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <motion.div
                        className="modal-backdrop"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsModalOpen(false)}
                    >
                        <motion.div
                            className="modal-panel"
                            initial={{ opacity: 0, y: 40, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 40, scale: 0.95 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button className="modal-close" onClick={() => setIsModalOpen(false)}>
                                ✕
                            </button>

                            <p className="mono" style={{ fontSize: '0.6rem', letterSpacing: '0.15em', textTransform: 'uppercase' as const, marginBottom: '0.5rem', color: 'var(--mars-rust)' }}>
                                Current Research Focus
                            </p>

                            <h2 className="serif" style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 700, marginBottom: '1.5rem', color: 'var(--text-primary)' }}>
                                {currentWork.title}
                            </h2>

                            {/* Core Concept */}
                            <div style={{ marginBottom: '1.5rem' }}>
                                <h3 className="mono" style={{ fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase' as const, color: 'var(--text-tertiary)', marginBottom: '0.5rem' }}>
                                    Core Concept
                                </h3>
                                <p style={{ fontSize: '0.875rem', lineHeight: 1.7, color: 'var(--text-secondary)' }}>
                                    {currentWork.concept}
                                </p>
                            </div>

                            {/* Current Progress */}
                            <div style={{ marginBottom: '1.5rem' }}>
                                <h3 className="mono" style={{ fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase' as const, color: 'var(--text-tertiary)', marginBottom: '0.5rem' }}>
                                    Current Progress
                                </h3>
                                <p style={{ fontSize: '0.875rem', lineHeight: 1.7, color: 'var(--text-secondary)' }}>
                                    {currentWork.progress}
                                </p>
                            </div>

                            {/* Related Reading */}
                            <div style={{ marginBottom: '1rem' }}>
                                <h3 className="mono" style={{ fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase' as const, color: 'var(--text-tertiary)', marginBottom: '0.75rem' }}>
                                    Related Reading
                                </h3>
                                <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                    {currentWork.reading.map((item) => (
                                        <li key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                                            <span style={{ color: 'var(--mars-rust)' }}>→</span>
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Tags */}
                            <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: '0.5rem', paddingTop: '1rem', borderTop: '1px solid var(--cream-300)' }}>
                                {currentWork.tags.map((tag) => (
                                    <span key={tag} className="tag">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
