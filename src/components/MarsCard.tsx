'use client';

import { motion } from 'framer-motion';
import { CurrentWork } from '@/lib/types';
import { dispatchOpenTab } from '@/components/TabSystem';

interface MarsCardProps {
    currentWork: CurrentWork;
    style?: React.CSSProperties; // Allow parent to control opacity/visibility
}

/* 
   Displays the Glassmorphism Card Overlay for the Mars section.
   The actual 3D Mars model is rendered by the main ParallaxScene behind this card.
*/
export default function MarsCard({ currentWork, style }: MarsCardProps) {

    const handleOpenTab = () => {
        dispatchOpenTab({
            id: 'mars-terraforming',
            title: 'Terraforming Mars',
            type: 'detail',
            icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /></svg>,
            content: (
                <div className="p-12 max-w-4xl mx-auto font-sans text-[var(--text-primary)]">
                    <h1 className="text-4xl font-serif font-bold mb-4">{currentWork.title}</h1>
                    <div className="h-px w-full bg-[var(--cream-300)] my-6" />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        <div>
                            <h3 className="mono text-xs uppercase tracking-widest text-[var(--text-tertiary)] mb-2">Core Concept</h3>
                            <p className="text-lg leading-relaxed text-[var(--text-secondary)] mb-8">{currentWork.concept}</p>

                            <h3 className="mono text-xs uppercase tracking-widest text-[var(--text-tertiary)] mb-2">Current Progress</h3>
                            <p className="text-base leading-relaxed text-[var(--text-secondary)] mb-8">{currentWork.progress}</p>
                        </div>

                        <div className="bg-[var(--cream-100)] p-8 rounded-2xl border border-[var(--cream-300)]">
                            <h3 className="mono text-xs uppercase tracking-widest text-[var(--text-tertiary)] mb-4">Reading List</h3>
                            <ul className="space-y-3">
                                {currentWork.reading.map(r => (
                                    <li key={r} className="flex gap-3 text-sm">
                                        <span className="text-[var(--mars-rust)]">→</span>
                                        {r}
                                    </li>
                                ))}
                            </ul>

                            <div className="mt-8 flex flex-wrap gap-2">
                                {currentWork.tags.map(tag => (
                                    <span key={tag} className="tag">{tag}</span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )
        });
    };

    return (
        <motion.div
            onClick={handleOpenTab}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center', // Vertically center
                justifyContent: 'flex-start', // Align left
                padding: 'clamp(2rem, 5vw, 4rem)',
                cursor: 'pointer',
                ...style // Parent opacity overrides
            }}
            className="group"
        >
            <div className="glass-card">
                <p style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: '0.65rem',
                    letterSpacing: '0.15em',
                    textTransform: 'uppercase',
                    color: 'rgba(255,255,255,0.5)',
                    marginBottom: '1rem',
                }}>
                    Current Research
                </p>

                <h2 style={{
                    fontFamily: "'Source Serif 4', Georgia, serif",
                    fontSize: 'clamp(1.8rem, 4vw, 2.5rem)',
                    fontWeight: 700,
                    marginBottom: '1rem',
                    color: '#fff',
                    textShadow: '0 2px 10px rgba(0,0,0,0.3)',
                }}>
                    {currentWork.title}
                </h2>

                <p style={{
                    color: 'rgba(255,255,255,0.8)',
                    fontSize: '0.95rem',
                    lineHeight: 1.6,
                    marginBottom: '1.5rem',
                }}>
                    {currentWork.description}
                </p>

                <div className="flex items-center gap-3">
                    <span style={{
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        color: '#fff',
                        borderBottom: '1px solid rgba(255,255,255,0.3)',
                        paddingBottom: 2,
                    }}>
                        Open in new tab
                    </span>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                        <polyline points="15 3 21 3 21 9" />
                        <line x1="10" y1="14" x2="21" y2="3" />
                    </svg>
                </div>
            </div>

            <style jsx global>{`
                .glass-card {
                    background: rgba(20, 20, 20, 0.40);
                    backdrop-filter: blur(40px) saturate(180%);
                    -webkit-backdrop-filter: blur(40px) saturate(180%);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-top: 1px solid rgba(255, 255, 255, 0.2);
                    border-radius: 24px;
                    padding: 2.5rem;
                    max-width: 480px;
                    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5), inset 0 0 0 1px rgba(255,255,255,0.05);
                    color: white;
                    transition: all 0.3s ease;
                }
                
                @media (max-width: 640px) {
                    .glass-card {
                        padding: 1.5rem;
                        border-radius: 16px;
                    }
                }

                .glass-card:hover {
                    background: rgba(255, 255, 255, 0.06);
                    transform: translateY(-4px);
                }
            `}</style>
        </motion.div>
    );
}
