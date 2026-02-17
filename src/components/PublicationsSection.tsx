'use client';

import { motion } from 'framer-motion';
import { Publication } from '@/lib/types';

interface PublicationsSectionProps {
    publications: Publication[];
}

function StatusBadge({ status }: { status: string }) {
    const colors: Record<string, { bg: string; text: string }> = {
        Accepted: { bg: 'var(--pastel-sage)', text: 'var(--text-primary)' },
        Published: { bg: 'var(--pastel-sky)', text: 'var(--text-primary)' },
        Preprint: { bg: 'var(--pastel-butter)', text: 'var(--text-primary)' },
    };
    const c = colors[status] || colors.Preprint;

    return (
        <span
            className="text-[10px] font-medium px-2 py-0.5 rounded-full ml-2"
            style={{ background: c.bg, color: c.text }}
        >
            {status}
        </span>
    );
}

export default function PublicationsSection({ publications }: PublicationsSectionProps) {
    return (
        <section className="section-block" id="publications">
            <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
            >
                <p className="mono text-xs tracking-widest uppercase pt-2 pb-3 border-t mb-6"
                    style={{ color: 'var(--text-tertiary)', borderColor: 'var(--cream-300)' }}>
                    Publications
                </p>
            </motion.div>

            <div>
                {publications.map((pub, i) => (
                    <motion.div
                        key={pub.title}
                        className="publication-item"
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: '-20px' }}
                        transition={{ delay: i * 0.1, duration: 0.5 }}
                    >
                        {/* Animated icon */}
                        <div className="pub-icon pub-icon-pulse" style={{
                            background: i === 0 ? 'var(--pastel-sage)' : i === 1 ? 'var(--pastel-sky)' : 'var(--pastel-butter)',
                        }}>
                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                                <path
                                    d="M3 2h8v10H3z"
                                    stroke="currentColor"
                                    strokeWidth="1"
                                    fill="none"
                                    opacity={0.6}
                                />
                                <path d="M5 5h4M5 7h4M5 9h2" stroke="currentColor" strokeWidth="0.8" opacity={0.5} />
                            </svg>
                        </div>

                        <div className="flex-1">
                            <div className="flex items-center flex-wrap gap-1">
                                {pub.link ? (
                                    <a
                                        href={pub.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="link-hover font-medium text-sm"
                                    >
                                        {pub.title}
                                    </a>
                                ) : (
                                    <span className="font-medium text-sm">{pub.title}</span>
                                )}
                                <StatusBadge status={pub.status} />
                            </div>
                            <p className="text-xs mt-1" style={{ color: 'var(--text-tertiary)' }}>
                                {pub.venue}
                            </p>
                        </div>

                        <span className="mono text-xs" style={{ color: 'var(--text-tertiary)' }}>
                            {pub.year}
                        </span>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
