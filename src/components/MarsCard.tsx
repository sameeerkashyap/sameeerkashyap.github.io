'use client';

import { useState, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import { CurrentWork } from '@/lib/types';
import { useRef } from 'react';
import * as THREE from 'three';

/* Small spinning Mars for the card background */
function SpinningMars() {
    const { scene } = useGLTF('/models/mars.glb');
    const ref = useRef<THREE.Group>(null);

    useFrame((state) => {
        if (!ref.current) return;
        ref.current.rotation.y = state.clock.elapsedTime * 0.15;
    });

    return (
        <group ref={ref} scale={0.0018}>
            <primitive object={scene} />
        </group>
    );
}

interface MarsCardProps {
    currentWork: CurrentWork;
}

export default function MarsCard({ currentWork }: MarsCardProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <>
            {/* Mars "card" — full width, Mars spins behind a glass overlay */}
            <motion.div
                onClick={() => setIsModalOpen(true)}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.6 }}
                style={{
                    position: 'relative',
                    width: '100%',
                    minHeight: 340,
                    borderRadius: 20,
                    overflow: 'hidden',
                    cursor: 'pointer',
                    background: 'radial-gradient(circle at 65% 50%, var(--mars-rust) 0%, #1a0a02 100%)',
                }}
            >
                {/* Three.js Mars spinner behind the card */}
                <div style={{
                    position: 'absolute',
                    inset: 0,
                    zIndex: 0,
                    opacity: 0.7,
                }}>
                    <Canvas
                        camera={{ position: [0, 0, 3], fov: 45 }}
                        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
                        dpr={[1, 1.5]}
                        style={{ width: '100%', height: '100%' }}
                    >
                        <ambientLight intensity={0.4} />
                        <directionalLight position={[3, 2, 5]} intensity={1.2} color="#ffeedd" />
                        <Suspense fallback={null}>
                            <SpinningMars />
                        </Suspense>
                    </Canvas>
                </div>

                {/* Card content overlay */}
                <div style={{
                    position: 'relative',
                    zIndex: 2,
                    padding: 'clamp(1.5rem, 4vw, 2.5rem)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-end',
                    minHeight: 340,
                    background: 'linear-gradient(135deg, rgba(26, 10, 2, 0.85) 0%, rgba(26, 10, 2, 0.4) 50%, rgba(26, 10, 2, 0.2) 100%)',
                }}>
                    <p style={{
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: '0.65rem',
                        letterSpacing: '0.15em',
                        textTransform: 'uppercase',
                        color: 'rgba(255,255,255,0.45)',
                        marginBottom: '0.5rem',
                    }}>
                        Current Research
                    </p>

                    <h2 style={{
                        fontFamily: "'Source Serif 4', Georgia, serif",
                        fontSize: 'clamp(1.5rem, 3.5vw, 2.2rem)',
                        fontWeight: 700,
                        marginBottom: '0.75rem',
                        background: 'linear-gradient(90deg, var(--mars-orange), #ffd700, var(--mars-glow), #ffd700, var(--mars-orange))',
                        backgroundSize: '200% auto',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                        animation: 'mars-shimmer 4s linear infinite',
                    }}>
                        {currentWork.title}
                    </h2>

                    <p style={{
                        color: 'rgba(255,255,255,0.7)',
                        fontSize: '0.85rem',
                        lineHeight: 1.7,
                        maxWidth: 550,
                        marginBottom: '1rem',
                    }}>
                        {currentWork.description}
                    </p>

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                        {currentWork.tags.map((tag) => (
                            <span
                                key={tag}
                                style={{
                                    fontSize: '0.65rem',
                                    padding: '2px 10px',
                                    borderRadius: 999,
                                    background: 'rgba(255,255,255,0.1)',
                                    color: 'rgba(255,255,255,0.65)',
                                    border: '1px solid rgba(255,255,255,0.12)',
                                }}
                            >
                                {tag}
                            </span>
                        ))}
                    </div>

                    <p style={{
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: '0.55rem',
                        letterSpacing: '0.15em',
                        textTransform: 'uppercase',
                        color: 'rgba(255,255,255,0.3)',
                        marginTop: '1rem',
                    }}>
                        Click to explore →
                    </p>
                </div>
            </motion.div>

            {/* Detail modal */}
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

                            <p className="mono" style={{ fontSize: '0.6rem', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '0.5rem', color: 'var(--mars-rust)' }}>
                                Current Research Focus
                            </p>

                            <h2 className="serif" style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 700, marginBottom: '1.5rem', color: 'var(--text-primary)' }}>
                                {currentWork.title}
                            </h2>

                            <div style={{ marginBottom: '1.5rem' }}>
                                <h3 className="mono" style={{ fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--text-tertiary)', marginBottom: '0.5rem' }}>
                                    Core Concept
                                </h3>
                                <p style={{ fontSize: '0.875rem', lineHeight: 1.7, color: 'var(--text-secondary)' }}>
                                    {currentWork.concept}
                                </p>
                            </div>

                            <div style={{ marginBottom: '1.5rem' }}>
                                <h3 className="mono" style={{ fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--text-tertiary)', marginBottom: '0.5rem' }}>
                                    Current Progress
                                </h3>
                                <p style={{ fontSize: '0.875rem', lineHeight: 1.7, color: 'var(--text-secondary)' }}>
                                    {currentWork.progress}
                                </p>
                            </div>

                            <div style={{ marginBottom: '1rem' }}>
                                <h3 className="mono" style={{ fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--text-tertiary)', marginBottom: '0.75rem' }}>
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

                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', paddingTop: '1rem', borderTop: '1px solid var(--cream-300)' }}>
                                {currentWork.tags.map((tag) => (
                                    <span key={tag} className="tag">{tag}</span>
                                ))}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}

useGLTF.preload('/models/mars.glb');
