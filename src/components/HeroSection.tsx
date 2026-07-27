'use client';

import { motion } from 'framer-motion';
import { PortfolioConfig, CurrentWork } from '@/lib/types';
import { dispatchOpenTab } from '@/components/TabSystem';
import GitHubPullRequests from '@/components/GitHubPullRequests';
import GitHubContributions from '@/components/GitHubContributions';
import { sendGAEvent, TAP_CARD } from '@/analytics/events';

interface HeroSectionProps {
    config: PortfolioConfig;
}

/* Scroll to a section inside the tab's scroll container. */
function scrollToSection(id: string) {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/* Parse "[text](url)" → <a>, falling back to plain text. */
function parseReadingLink(item: string): React.ReactNode {
    const match = item.match(/^\[(.+?)\]\((.+?)\)$/);
    if (!match) return item;
    return (
        <a href={match[2]} target="_blank" rel="noopener noreferrer" className="reading-link">
            {match[1].replace(/:$/, '').trim()}
        </a>
    );
}

function openCurrentWorkTab(currentWork: CurrentWork) {
    sendGAEvent(TAP_CARD, { type: 'Research', title: currentWork.title });
    dispatchOpenTab({
        id: 'mars-terraforming',
        title: currentWork.title,
        type: 'detail',
        icon: <span className="text-xs">🔬</span>,
        content: (
            <div className="p-12 max-w-4xl mx-auto font-sans text-[var(--text-primary)]">
                <h1 className="text-4xl serif font-bold mb-4">{currentWork.title}</h1>
                <div className="h-px w-full bg-[var(--cream-300)] my-6" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div>
                        <h3 className="mono text-xs uppercase tracking-widest text-[var(--text-tertiary)] mb-2">Core Concept</h3>
                        <p className="text-lg leading-relaxed text-[var(--text-secondary)] mb-8">{currentWork.concept}</p>
                        <h3 className="mono text-xs uppercase tracking-widest text-[var(--text-tertiary)] mb-2">Current Progress</h3>
                        <p className="text-base leading-relaxed text-[var(--text-secondary)]">{currentWork.progress}</p>
                    </div>
                    <div className="bg-[var(--cream-100)] p-8 rounded-2xl border border-[var(--cream-300)] h-fit">
                        <h3 className="mono text-xs uppercase tracking-widest text-[var(--text-tertiary)] mb-4">Reading List</h3>
                        <ul className="space-y-3">
                            {currentWork.reading.map(r => (
                                <li key={r} className="flex gap-3 text-sm">
                                    <span className="text-[var(--mars-rust)] shrink-0">→</span>
                                    {parseReadingLink(r)}
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
        ),
    });
}

function StatusBadge({ status }: { status: string }) {
    const colors: Record<string, string> = {
        Accepted: 'var(--pastel-sage)',
        Published: 'var(--pastel-sky)',
        Preprint: 'var(--pastel-butter)',
    };

    return (
        <span
            className="text-[10px] font-medium px-2 py-0.5 rounded-full ml-2"
            style={{ background: colors[status] || colors.Preprint, color: 'var(--text-primary)' }}
        >
            {status}
        </span>
    );
}

function ColumnHeader({ label, action }: { label: string; action?: { text: string; onClick: () => void } }) {
    return (
        <div className="academic-col-header">
            <span className="mono">{label}</span>
            {action && (
                <button type="button" className="mono academic-col-link" onClick={action.onClick}>
                    {action.text}
                </button>
            )}
        </div>
    );
}

export default function HeroSection({ config }: HeroSectionProps) {
    const primaryEducation = config.education[0];
    const fade = (delay: number) => ({
        initial: { opacity: 0, y: 12 },
        animate: { opacity: 1, y: 0 },
        transition: { delay, duration: 0.5, ease: [0.4, 0, 0.2, 1] as const },
    });

    return (
        <header className="academic-hero">
            <div className="academic-masthead">
                <div className="academic-masthead-row">
                    <div className="academic-masthead-text">
                        <motion.h1 className="serif academic-name" {...fade(0.05)}>
                            {config.name}
                        </motion.h1>

                        <motion.p className="academic-location" {...fade(0.1)}>
                            {config.location}
                        </motion.p>

                        <motion.p className="academic-affiliation" {...fade(0.15)}>
                            {primaryEducation && (
                                <>
                                    {primaryEducation.degree}, {primaryEducation.institution}
                                    {primaryEducation.period && (
                                        <>
                                            <span className="academic-sep">·</span>
                                            <span className="mono academic-period">{primaryEducation.period}</span>
                                        </>
                                    )}
                                </>
                            )}
                        </motion.p>

                        <motion.p className="academic-bio" {...fade(0.28)}>
                            {config.about}
                        </motion.p>

                        <motion.div className="academic-interests" {...fade(0.35)}>
                            <span className="mono academic-interests-label">Research interests</span>
                            <div className="flex flex-wrap gap-2">
                                {config.researchInterests.map(interest => (
                                    <span key={interest} className="tag academic-tag">{interest}</span>
                                ))}
                            </div>
                        </motion.div>
                    </div>

                    {config.profileImage && (
                        <motion.div
                            className="academic-portrait"
                            initial={{ opacity: 0, scale: 0.96 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.15, duration: 0.6 }}
                        >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={config.profileImage} alt={config.name} />
                        </motion.div>
                    )}
                </div>
            </div>

            {/* ── Index: Research · Publications ────────────────────────── */}
            <motion.div
                className="academic-index"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45, duration: 0.6 }}
            >
                {/* Research */}
                <section className="academic-col">
                    <ColumnHeader
                        label="Research"
                        action={{ text: 'experience ↓', onClick: () => scrollToSection('experience') }}
                    />

                    <button
                        type="button"
                        className="academic-entry academic-entry-feature"
                        onClick={() => openCurrentWorkTab(config.currentWork)}
                    >
                        <span className="mono academic-entry-meta">Current project</span>
                        <span className="serif academic-entry-title">{config.currentWork.title}</span>
                        <span className="academic-entry-body">{config.currentWork.description}</span>
                        <span className="mono academic-entry-more">Read more →</span>
                    </button>

                    <GitHubPullRequests
                        githubUrl={config.github}
                        count={config.githubActivity?.count}
                        uniqueRepos={config.githubActivity?.uniqueRepos}
                    />

                    <GitHubContributions githubUrl={config.github} />
                </section>

                {/* Publications */}
                <section className="academic-col" id="publications">
                    <ColumnHeader label="Publications" />

                    <div>
                        {config.publications.map((pub, i) => (
                            <div key={pub.title} className="publication-item">
                                <div
                                    className="pub-icon pub-icon-pulse"
                                    style={{
                                        background:
                                            i === 0 ? 'var(--pastel-sage)'
                                                : i === 1 ? 'var(--pastel-sky)'
                                                    : 'var(--pastel-butter)',
                                    }}
                                >
                                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                                        <path d="M3 2h8v10H3z" stroke="currentColor" strokeWidth="1" fill="none" opacity={0.6} />
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
                            </div>
                        ))}
                    </div>
                </section>
            </motion.div>

            <div className="academic-scroll-cue mono" aria-hidden="true">scroll ↓</div>
        </header>
    );
}
